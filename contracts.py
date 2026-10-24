"""
عقود الاشتراك — توليد ملف PDF احترافي (عربي) عبر Microsoft Edge بدون مكتبات خارجية.
القالب HTML يُطبع بمحرك Edge (--headless --print-to-pdf) فيظهر الخط العربي بشكل صحيح.
"""
import datetime
import html
import os
import pathlib
import shutil
import subprocess
import tempfile
import threading
import time

try:
    import winreg
except ImportError:
    winreg = None

ROOT = os.path.dirname(os.path.abspath(__file__))
FONTS = pathlib.Path(ROOT, "www", "lib", "fonts")
LOGO = pathlib.Path(ROOT, "www", "logo.svg")
_lock = threading.Lock()

DEFAULT_CONTRACT = {
    "sellerName": "رواج لإدارة الأعمال",
    "sellerCr": "", "sellerVat": "", "sellerPhone": "+967735999135", "sellerEmail": "aspreim@gmail.com", "sellerCity": "المملكة العربية السعودية",
    "signerName": "إدارة رواج لإدارة الأعمال",
    "signature": "",   # صورة توقيع (data URL) — اختياري
    "stamp": "",       # صورة ختم (data URL) — اختياري، وإلا يُرسم ختم تلقائي
    "intro": ("رواج لإدارة الأعمال نظام سحابي-محلي متكامل لإدارة المبيعات والمخزون والحسابات، صُمم ليمنح المنشآت أدوات احترافية "
              "تختصر الوقت وتضبط العمليات: نقطة بيع سريعة، فواتير ضريبية متوافقة مع متطلبات هيئة الزكاة والضريبة والجمارك، "
              "مخزون دقيق، حسابات عملاء وموردين، وتقارير لحظية تساعد على اتخاذ القرار."),
    "guarantee": ("يلتزم مزود الخدمة طوال مدة الاشتراك السارية بتقديم الدعم الفني وخدمة العملاء وحل مشاكل المستخدمين عبر الواتساب والبريد "
                  "والدعم عن بعد، وتوفير التحديثات والتحسينات دون رسوم إضافية، والحفاظ على سرية بيانات العميل وأمانها، "
                  "مع نسخ احتياطية تلقائية متعددة ومحمية."),
    "terms": ("يبدأ الاشتراك من تاريخ التفعيل وينتهي بانتهاء المدة المحددة ما لم يُجدَّد.\n"
              "الحساب وبيانات الدخول شخصية للعميل، ويتحمل العميل مسؤولية الحفاظ على سريتها.\n"
              "بيانات المنشأة ملك للعميل، ويحق له تصدير نسخة احتياطية منها في أي وقت.\n"
              "يحق للعميل التواصل مع الدعم الفني طوال مدة الاشتراك دون رسوم إضافية.\n"
              "المبالغ المدفوعة غير مستردة بعد تفعيل الاشتراك ما لم يُتفق على خلاف ذلك كتابياً.\n"
              "يخضع هذا العقد لأنظمة المملكة العربية السعودية."),
}

FEATURES = ["نقطة بيع سريعة بالباركود والفواتير المعلّقة", "فواتير ضريبية مع رمز QR (هيئة الزكاة)", "مخزون بمتوسط التكلفة وجرد وتسويات",
            "حسابات العملاء والموردين وكشوف الحساب", "سندات قبض وصرف ومصروفات وصناديق وبنوك", "تقارير لحظية: الأرباح والضريبة والمبيعات",
            "صلاحيات للموظفين وسجل كامل للعمليات", "قوالب فواتير احترافية قابلة للتخصيص", "نسخ احتياطية تلقائية محمية ضد الحذف",
            "دعم فني وخدمة عملاء طوال مدة الاشتراك"]


def e(v) -> str:
    return html.escape(str(v if v is not None else ""))


def find_browser():
    paths = []
    if winreg:
        for root in (winreg.HKEY_LOCAL_MACHINE, winreg.HKEY_CURRENT_USER):
            for exe in ("msedge.exe", "chrome.exe"):
                try:
                    with winreg.OpenKey(root, rf"SOFTWARE\Microsoft\Windows\CurrentVersion\App Paths\{exe}") as k:
                        paths.append(winreg.QueryValueEx(k, "")[0])
                except OSError:
                    pass
    paths += [r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe", r"C:\Program Files\Microsoft\Edge\Application\msedge.exe"]
    paths += [shutil.which(x) for x in ("chromium", "chromium-browser", "google-chrome", "microsoft-edge")]  # Linux / Docker
    return next((p for p in paths if p and os.path.exists(p)), None)


def stamp_svg(seller: str, date: str) -> str:
    """ختم دائري تلقائي للاشتراك"""
    return f"""<svg viewBox="0 0 200 200" width="140" height="140" xmlns="http://www.w3.org/2000/svg">
<g fill="none" stroke="#1d4ed8" opacity=".9"><circle cx="100" cy="100" r="94" stroke-width="4"/><circle cx="100" cy="100" r="85" stroke-width="1.5"/>
<path d="M30 74h140M30 126h140" stroke-width="1.5"/></g>
<g fill="#1d4ed8" text-anchor="middle" font-family="P"><text x="100" y="58" font-size="15" font-weight="700">{e(seller)}</text>
<text x="100" y="108" font-size="26" font-weight="700">معتمد</text>
<text x="100" y="148" font-size="13">ختم الاشتراك</text><text x="100" y="168" font-size="12" direction="ltr">{e(date)}</text>
<text x="40" y="104" font-size="14">★</text><text x="160" y="104" font-size="14">★</text></g></svg>"""


def contract_html(c: dict, cfg: dict) -> str:
    """c: بيانات العقد (no, date, customer..., plan..., username, password)"""
    cfg = {**DEFAULT_CONTRACT, **(cfg or {})}
    fonts = FONTS.as_uri()
    logo = LOGO.read_text(encoding="utf-8") if LOGO.exists() else ""
    cur = e(c.get("currency", "ر.س"))
    money = lambda v: f'<span class="n">{float(v or 0):,.2f}</span> {cur}'
    feats = c.get("features") or FEATURES
    terms = [t for t in str(cfg["terms"]).split("\n") if t.strip()]
    stamp = f'<img class="st" src="{e(cfg["stamp"])}" style="width:140px;height:140px;object-fit:contain">' if cfg.get("stamp") else stamp_svg(cfg["sellerName"], c["date"])
    sign = f'<img src="{e(cfg["signature"])}" style="height:70px;max-width:200px;object-fit:contain">' if cfg.get("signature") else f'<div class="sig-name">{e(cfg["signerName"])}</div>'
    row = lambda k, v: f'<tr><th>{k}</th><td>{v}</td></tr>' if v not in (None, "") else ""
    return f"""<!doctype html><html dir="rtl" lang="ar"><head><meta charset="utf-8"><style>
@font-face{{font-family:P;font-weight:400;src:url({fonts}/ibm-plex-sans-arabic-arabic-400-normal.woff2)}}
@font-face{{font-family:P;font-weight:700;src:url({fonts}/ibm-plex-sans-arabic-arabic-700-normal.woff2)}}
@font-face{{font-family:P;font-weight:400;src:url({fonts}/ibm-plex-sans-arabic-latin-400-normal.woff2);unicode-range:U+0000-00FF,U+2000-206F}}
@font-face{{font-family:P;font-weight:700;src:url({fonts}/ibm-plex-sans-arabic-latin-700-normal.woff2);unicode-range:U+0000-00FF,U+2000-206F}}
@page{{size:A4;margin:12mm 0 10mm}}@page :first{{margin-top:0}}*{{box-sizing:border-box;margin:0;padding:0}}
body{{font-family:P,Tahoma,sans-serif;color:#1e293b;font-size:11.5px;line-height:1.75;-webkit-print-color-adjust:exact;print-color-adjust:exact}}
.page{{padding:14mm 15mm 10mm;position:relative}}
.n,.ltr{{direction:ltr;unicode-bidi:isolate;font-variant-numeric:tabular-nums}}
.band{{position:absolute;top:0;left:0;right:0;height:7mm;background:linear-gradient(90deg,#4338ca,#4f46e5,#0891b2)}}
.hdr{{display:flex;align-items:center;justify-content:space-between;margin-top:4mm;padding-bottom:12px;border-bottom:2px solid #e2e8f0}}
.brand{{display:flex;align-items:center;gap:12px}}.brand svg{{width:58px;height:58px}}.brand b{{font-size:19px;display:block;color:#312e81}}.brand span{{color:#64748b;font-size:11px}}
.meta{{text-align:left;font-size:11px;color:#475569}}.meta b{{color:#0f172a}}
h1{{text-align:center;font-size:21px;color:#312e81;margin:14px 0 2px}}.sub{{text-align:center;color:#64748b;margin-bottom:12px}}
h2{{font-size:13.5px;color:#4338ca;margin:14px 0 6px;display:flex;align-items:center;gap:8px}}h2::before{{content:'';width:5px;height:16px;border-radius:3px;background:linear-gradient(#4f46e5,#0891b2)}}
.parties{{display:grid;grid-template-columns:1fr 1fr;gap:10px}}.box{{border:1px solid #e2e8f0;border-radius:10px;padding:9px 12px;background:#f8fafc}}.box h3{{font-size:12px;color:#334155;margin-bottom:3px}}
table{{width:100%;border-collapse:collapse}}.kv th{{width:34%;text-align:right;color:#64748b;font-weight:400;padding:3px 0}}.kv td{{font-weight:700;padding:3px 0}}
.plan{{border:1px solid #c7d2fe;border-radius:10px;overflow:hidden}}.plan th{{background:#eef2ff;color:#3730a3;text-align:right;padding:7px 10px;font-size:11px}}.plan td{{padding:7px 10px;border-top:1px solid #e0e7ff;font-weight:700}}
.total td{{background:#4f46e5;color:#fff;font-size:13px}}
.cred{{display:grid;grid-template-columns:1fr 1fr;gap:10px;border:1.5px dashed #0891b2;background:#ecfeff;border-radius:10px;padding:10px 14px}}.cred span{{color:#0e7490;font-size:11px;display:block}}.cred b{{font-size:15px;direction:ltr;unicode-bidi:isolate}}
.feats{{columns:2;column-gap:18px}}.feats li{{list-style:none;padding-right:16px;position:relative;break-inside:avoid}}.feats li::before{{content:'✓';position:absolute;right:0;color:#059669;font-weight:700}}
ol{{padding-right:18px}}ol li{{margin-bottom:2px}}.para{{text-align:justify;color:#334155}}
.end-block{{break-inside:avoid;page-break-inside:avoid}}.sigs{{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-top:14px;align-items:end}}.sig{{text-align:center}}.sig .line{{border-top:1px solid #94a3b8;margin-top:8px;padding-top:4px;color:#64748b}}
.sig-name{{font-size:19px;color:#1e3a8a;font-weight:700}}.sig-row{{display:flex;align-items:center;justify-content:center;gap:14px;height:150px}}.sig-row svg,.sig-row img.st{{transform:rotate(-10deg)}}
.foot{{margin-top:16px;border-top:1px solid #e2e8f0;padding-top:6px;display:flex;justify-content:space-between;color:#64748b;font-size:10px}}
</style></head><body><div class="page"><div class="band"></div>
<div class="hdr"><div class="brand">{logo}<div><b>{e(cfg["sellerName"])}</b><span>نظام متكامل للمبيعات والمخزون والحسابات</span></div></div>
<div class="meta">رقم العقد: <b class="n">{e(c["no"])}</b><br>تاريخ العقد: <b class="n">{e(c["date"])}</b></div></div>
<h1>عقد اشتراك في نظام رواج لإدارة الأعمال</h1><div class="sub">Subscription Agreement — {e(c.get("planName"))}</div>
<h2>أطراف العقد</h2><div class="parties">
<div class="box"><h3>الطرف الأول (مزود الخدمة)</h3><table class="kv">{row("الاسم", e(cfg["sellerName"]))}{row("السجل التجاري", '<span class="n">' + e(cfg["sellerCr"]) + '</span>' if cfg["sellerCr"] else "")}{row("الرقم الضريبي", '<span class="n">' + e(cfg["sellerVat"]) + '</span>' if cfg["sellerVat"] else "")}{row("الجوال", '<span class="n">' + e(cfg["sellerPhone"]) + '</span>')}{row("البريد", '<span class="n">' + e(cfg["sellerEmail"]) + '</span>')}</table></div>
<div class="box"><h3>الطرف الثاني (العميل)</h3><table class="kv">{row("المنشأة", e(c.get("company")))}{row("المالك / المسؤول", e(c.get("ownerName")))}{row("الجوال", '<span class="n">' + e(c.get("mobile")) + '</span>')}{row("المدينة", e(c.get("city")))}{row("السجل التجاري", '<span class="n">' + e(c.get("crNumber")) + '</span>' if c.get("crNumber") else "")}{row("الرقم الضريبي", '<span class="n">' + e(c.get("vatNumber")) + '</span>' if c.get("vatNumber") else "")}</table></div></div>
<h2>تعريف بالنظام</h2><p class="para">{e(cfg["intro"])}</p>
<h2>تفاصيل الاشتراك</h2><table class="plan"><tr><th>الباقة</th><th>المدة</th><th>تاريخ البداية</th><th>تاريخ الانتهاء</th><th>طريقة الدفع</th></tr>
<tr><td>{e(c.get("planName"))}</td><td>{e(c.get("duration"))}</td><td class="n">{e(c.get("start"))}</td><td class="n">{e(c.get("end") or "دائم")}</td><td>{e(c.get("method"))}</td></tr></table>
<table class="plan" style="margin-top:6px"><tr><th>سعر الباقة</th><th>الخصم{(" (" + e(c.get("coupon")) + ")") if c.get("coupon") else ""}</th><th>عدد الأجهزة</th><th>الإجمالي المستحق</th></tr>
<tr class="total"><td>{money(c.get("price"))}</td><td>{money(c.get("discount"))}</td><td class="n">{e(c.get("devices", 1))}</td><td>{money(c.get("total"))}</td></tr></table>
<h2>بيانات الدخول للنظام</h2><div class="cred"><div><span>اسم المستخدم (رقم الجوال)</span><b>{e(c.get("username"))}</b></div><div><span>كلمة المرور</span><b>{e(c.get("password"))}</b></div></div>
<div style="font-size:10.5px;color:#64748b;margin-top:4px">من شاشة الدخول في النظام اكتب رقم الجوال وكلمة المرور. يُنصح بتغيير كلمة المرور بعد أول دخول والحفاظ على سريتها.</div>
<h2>مزايا الاشتراك</h2><ul class="feats">{"".join(f"<li>{e(f)}</li>" for f in feats)}</ul>
<h2>الضمان وخدمة العملاء</h2><p class="para">{e(cfg["guarantee"])}</p>
<div class="end-block"><h2>الشروط والأحكام</h2><ol>{"".join(f"<li>{e(t)}</li>" for t in terms)}</ol>
<div class="sigs"><div class="sig"><div class="sig-row">{sign}{stamp}</div><div class="line">الطرف الأول — {e(cfg["signerName"])}</div></div>
<div class="sig"><div style="height:150px"></div><div class="line">الطرف الثاني — {e(c.get("ownerName") or c.get("company"))}</div></div></div>
<div class="foot"><span>{e(cfg["sellerName"])} · <span class="n">{e(cfg["sellerPhone"])}</span> · <span class="n">{e(cfg["sellerEmail"])}</span></span><span>هذا العقد صادر إلكترونياً ومعتمد بختم الاشتراك</span></div></div>
</div></body></html>"""


def html_to_pdf(html_text: str, out_pdf: str, work_dir: str = None) -> bool:
    """يطبع HTML إلى PDF عبر Edge/Chrome — يعيد False إن لم يتوفر متصفح.
    مسارات العمل في مجلد مؤقت بأحرف إنجليزية (المتصفح لا يقبل المسارات العربية لملف الإخراج والملف الشخصي)"""
    browser = find_browser()
    if not browser:
        return False
    work = os.path.join(tempfile.gettempdir(), "rawaj-pdf")
    with _lock:
        os.makedirs(work, exist_ok=True)
        src = os.path.join(work, "contract.html")
        tmp_pdf = os.path.join(work, "contract.pdf")
        with open(src, "w", encoding="utf-8") as f:
            f.write(html_text)
        if os.path.exists(tmp_pdf):
            os.remove(tmp_pdf)
        extra = [] if os.name == "nt" else ["--no-sandbox", "--disable-dev-shm-usage"]
        proc = subprocess.Popen([browser, *extra, "--headless", "--disable-gpu", "--no-first-run", "--no-pdf-header-footer", "--print-to-pdf-no-header",
                                 f"--print-to-pdf={tmp_pdf}", f"--user-data-dir={os.path.join(work, 'profile')}", pathlib.Path(src).as_uri()],
                                stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, creationflags=0x08000000 if os.name == "nt" else 0)
        # المتصفح قد ينهي الطباعة في عملية مستقلة: ننتظر حتى يكتمل الملف
        last, stable, ok = -1, 0, False
        for _ in range(160):
            time.sleep(0.25)
            size = os.path.getsize(tmp_pdf) if os.path.exists(tmp_pdf) else -1
            if size > 0 and size == last:
                stable += 1
                if stable >= 3:
                    ok = True
                    break
            else:
                stable = 0
            last = size
        try:
            proc.kill()
        except Exception:
            pass
        if not ok:
            return False
        os.makedirs(os.path.dirname(out_pdf), exist_ok=True)
        shutil.copyfile(tmp_pdf, out_pdf)
        return True


def duration_label(plan_type: str, days) -> str:
    if plan_type == "lifetime" or not days:
        return "دائم"
    d = int(days)
    return {30: "شهر", 90: "3 أشهر", 180: "6 أشهر", 365: "سنة"}.get(d, f"{d} يوم")


def today() -> str:
    return datetime.date.today().strftime("%Y/%m/%d")
