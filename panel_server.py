"""
لوحة تحكم رواج — الخادم (منفصل تماماً عن النظام)
• واجهة المالك وفريق العمل: الأجهزة والمشتركين، الاشتراكات، الدعم الفني، الأعطال،
  الإشعارات، التحديثات، النسخ الاحتياطية للعملاء، الموظفين والصلاحيات، سجل العمليات.
• واجهة العملاء (/api/client/*): يتصل بها خادم النظام لدى كل عميل (مزامنة، تذاكر، أعطال، نسخ).
• يعمل حالياً على هذا الجهاز؛ لنقله أونلاين: ارفع هذا المجلد على خادم (VPS) وغيّر عنوان
  «الخادم السحابي» في إعدادات النظام لدى العملاء — أو استبدل طبقة التخزين بـ Firebase.
"""
import base64
import datetime
import gzip
import hashlib
import hmac
import http.server
import json
import os
import re
import secrets
import smtplib
import socketserver
import subprocess
import sys
import threading
import time
import urllib.parse
import zipfile
from email.message import EmailMessage

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import ecdsa_p256 as ec  # noqa: E402
import contracts as ct  # noqa: E402
import analytics as an  # noqa: E402
import mongo_store  # noqa: E402

ROOT = os.path.dirname(os.path.abspath(__file__))
# على الاستضافة (Render/Railway...) يُحدَّد PORT تلقائياً ويستمع الخادم لكل العناوين
PORT = int(os.environ.get("PORT") or os.environ.get("RAWAJ_PANEL_PORT", "8788"))
HOSTED = bool(os.environ.get("PORT") or os.environ.get("RAWAJ_HOSTED"))
# الملفات الخاصة (مفاتيح التوقيع والتشفير، بيانات اللوحة والعملاء، كلمات المرور) في مجلد منفصل
# بجانب مجلد اللوحة وليس داخله — فمجلد اللوحة كله كود يمكن رفعه أو نشره بأمان
PRIVATE = os.environ.get("RAWAJ_PRIVATE_DIR") or (os.path.join(ROOT, "private") if HOSTED else os.path.join(os.path.dirname(ROOT), "لوحة التحكم - ملفات خاصة"))
DATA = os.path.join(PRIVATE, "panel-data")
DB_FILE = os.path.join(DATA, "panel-db.json")
UPLOADS = os.path.join(DATA, "uploads")
BACKUPS = os.path.join(DATA, "client-backups")
UPDATES = os.path.join(DATA, "updates")
KEY_FILE = os.path.join(PRIVATE, "keys", "signing-key.json")
SECRET_FILE = os.path.join(PRIVATE, "keys", "secret.key")
CREDENTIALS_FILE = os.path.join(PRIVATE, "بيانات الدخول — احذف هذا الملف بعد حفظها.txt")
PANEL_BACKUPS = os.path.join(DATA, "panel-backups")
CONTRACTS = os.path.join(DATA, "contracts")
MONGO_CFG = os.path.join(DATA, "mongo.json")
KEEP_PANEL_BACKUPS = 10
HOST = os.environ.get("RAWAJ_PANEL_HOST", "0.0.0.0" if HOSTED else "127.0.0.1")
OWNER_EMAIL = "aspreim@gmail.com"
SESSION_TTL = 12 * 3600
MAX_BODY = 200 * 1024 * 1024

PERMS = {
    "devices": "عرض الأجهزة والمشتركين",
    "licenses": "تفعيل وتعديل الاشتراكات",
    "tickets": "الدعم الفني والرد على العملاء",
    "errors": "سجل الأعطال",
    "notifications": "إرسال الإشعارات",
    "updates": "رفع تحديثات النظام",
    "backups": "تنزيل نسخ العملاء الاحتياطية",
    "accounts": "حسابات العملاء وإعداد أنشطتهم",
    "sales": "مبيعات الاشتراكات والأسعار",
    "requests": "طلبات فتح الحسابات",
    "site": "الموقع والزوار",
    "system": "الصيانة والإعلانات",
}
DEFAULT_SITE = {"maintenance": {"on": False, "message": "نعمل حالياً على تحسين الموقع — سنعود قريباً.", "until": ""},
                "announcement": {"on": False, "text": "", "link": ""},
                "hero": {"title": "", "subtitle": ""}, "downloadUrl": "", "version": "", "fileSize": "", "whatsapp": "", "email": "",
                "sections": {"features": True, "showcase": True, "security": True, "plans": True, "download": True, "faq": True, "support": True}}
DEFAULT_SYSTEM = {"maintenance": {"on": False, "message": "النظام في وضع الصيانة لتحسين الخدمة — سيعود خلال وقت قصير.", "until": ""},
                  "announcement": {"on": False, "text": "", "level": "info", "link": "", "id": ""}}
# حقول بيانات المنشأة التي يمكن إعدادها للعميل من اللوحة
BIZ_KEYS = ["company", "companyEn", "legalName", "activity", "ownerName", "branchName", "mobile", "phone", "email", "website", "country", "city", "district",
            "street", "buildingNo", "additionalNo", "postalCode", "address", "vatNumber", "crNumber", "bankName", "accountName", "iban", "currency", "vatRate",
            "vatEnabled", "pricesIncludeVat"]
DEFAULT_PRICES = {"currency": "ر.س", "monthly": 99, "quarterly": 269, "yearly": 899, "lifetime": 2499}
BASE_FEATURES = ["نقطة بيع وفواتير ضريبية مع QR", "مخزون وجرد وتقارير لحظية", "حسابات العملاء والموردين", "نسخ احتياطية محمية", "دعم فني طوال الاشتراك"]
DEFAULT_PAY_METHODS = ["تحويل بنكي", "STC Pay", "مدى / بطاقة", "نقدي"]
# أقسام رسالة الواتساب للعميل — يختار المالك ما يُرفق منها
DEFAULT_WA_SECTIONS = [
    {"key": "greeting", "title": "الترحيب", "on": True, "text": "السلام عليكم {name} 👋\nمعك خدمة العملاء في *رواج لإدارة الأعمال* بخصوص طلبك لفتح حساب لمنشأة *{company}*."},
    {"key": "intro", "title": "تعريف بالنظام", "on": True, "text": "✨ *عن النظام*\nرواج نظام متكامل لإدارة المبيعات والمخزون والحسابات، صُمم ليمنح منشأتك أدوات احترافية تختصر الوقت وتضبط العمليات وتعطيك تقارير لحظية تساعدك على اتخاذ القرار."},
    {"key": "features", "title": "المزايا", "on": True, "text": "✅ نقطة بيع سريعة بالباركود\n✅ فواتير ضريبية متوافقة مع هيئة الزكاة (QR)\n✅ مخزون دقيق وجرد وتسويات\n✅ حسابات العملاء والموردين وكشوف الحساب\n✅ تقارير الأرباح والضريبة والمبيعات\n✅ صلاحيات للموظفين وسجل كامل للعمليات\n✅ قوالب فواتير احترافية قابلة للتخصيص"},
    {"key": "security", "title": "أمان البيانات", "on": True, "text": "🛡️ *بياناتك في أمان*: حفظ تلقائي ونسخ احتياطية متعددة ومحمية ضد الحذف، وكلمات مرور مشفّرة."},
    {"key": "support", "title": "خدمة العملاء", "on": True, "text": "🎧 *دعم فني متواصل*: خدمة عملاء وحل مشاكل المستخدمين طوال مدة الاشتراك عبر الواتساب والدعم عن بعد."},
    {"key": "plans", "title": "أسعار الباقات", "on": True, "text": "💳 *الباقات*\n{plans}"},
    {"key": "selected", "title": "الباقة المختارة", "on": True, "text": "📦 باقتك المختارة: *{plan}* — *{final} {currency}*{discount_line}"},
    {"key": "payment", "title": "طرق الدفع", "on": True, "text": "💰 *طرق الدفع*\n{payment}\n{bank}"},
    {"key": "closing", "title": "الختام", "on": True, "text": "بعد إتمام الدفع نرسل لك عقد الاشتراك وبيانات الدخول مباشرة. يسعدنا خدمتك 🌟"},
]
OWNER_ONLY = {"staff", "settings", "audit"}  # صلاحيات للمالك فقط
PLANS = {"monthly": ("شهري", 30), "quarterly": ("ربع سنوي", 90), "yearly": ("سنوي", 365), "lifetime": ("دائم", None), "custom": ("مخصص", None), "revoked": ("موقوف", 0)}

lock = threading.RLock()
DB = None
SESSIONS = {}
LOGIN_FAILS = {}
SIGNING_KEY = None
SECRET = b""
MONGO = None
MONGO_INFO = {"loadedFrom": "local"}


# =====================================================================
#   التخزين
# =====================================================================
def now_iso() -> str:
    return datetime.datetime.now(datetime.timezone.utc).isoformat(timespec="seconds")


def uid(p: str) -> str:
    return f"{p}_{int(time.time() * 1000):x}{secrets.token_hex(3)}"


def atomic_write(path: str, data: bytes) -> None:
    os.makedirs(os.path.dirname(path), exist_ok=True)
    tmp = path + ".tmp"
    with open(tmp, "wb") as f:
        f.write(data)
        f.flush()
        os.fsync(f.fileno())
    if os.path.exists(path):
        try:
            os.replace(path, path + ".prev")
        except OSError:
            pass
    os.replace(tmp, path)


def save():
    with lock:
        atomic_write(DB_FILE, json.dumps(DB, ensure_ascii=False).encode("utf-8"))
        DIRTY["v"] = False
    if MONGO:
        MONGO.schedule()  # رفع التغييرات إلى MongoDB في الخلفية


DIRTY = {"v": False}


def mark_dirty():
    DIRTY["v"] = True


def flush_worker():
    while True:
        time.sleep(15)
        if DIRTY["v"]:
            try:
                save()
            except Exception as e:
                print("flush error:", e)


def hash_pw(pw: str, salt: str = None):
    salt = salt or secrets.token_hex(16)
    return hashlib.pbkdf2_hmac("sha256", pw.encode("utf-8"), bytes.fromhex(salt), 200_000).hex(), salt


def check_pw(rec: dict, pw: str) -> bool:
    return bool(rec.get("passHash")) and hmac.compare_digest(hash_pw(pw, rec["salt"])[0], rec["passHash"])


def strong_password() -> str:
    alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789"
    core = "".join(secrets.choice(alphabet) for _ in range(20))
    return f"{core[:5]}-{core[5:10]}#{core[10:15]}@{core[15:]}"


def load():
    global DB, SIGNING_KEY
    os.makedirs(DATA, exist_ok=True)
    for d in (UPLOADS, BACKUPS, UPDATES):
        os.makedirs(d, exist_ok=True)
    # مفتاح التوقيع: من متغير البيئة على الاستضافة، أو من مجلد keys محلياً (لا يُرفع أبداً إلى GitHub)
    if os.environ.get("RAWAJ_SIGNING_KEY"):
        SIGNING_KEY = json.loads(os.environ["RAWAJ_SIGNING_KEY"])
    elif os.path.exists(KEY_FILE):
        with open(KEY_FILE) as f:
            SIGNING_KEY = json.load(f)
    elif HOSTED:
        # مفتاح جديد على الاستضافة سيجعل كل رموز التفعيل مرفوضة في أنظمة العملاء — نرفض التشغيل
        sys.exit("خطأ: متغير البيئة RAWAJ_SIGNING_KEY غير مضبوط. شغّل «تجهيز أسرار الاستضافة.bat» محلياً وانسخ القيمة إلى الاستضافة.")
    else:
        os.makedirs(os.path.dirname(KEY_FILE), exist_ok=True)
        with open(KEY_FILE, "w") as f:
            json.dump(ec.generate_key(), f)
        with open(KEY_FILE) as f:
            SIGNING_KEY = json.load(f)
        print("تحذير: تم إنشاء مفتاح توقيع جديد — يجب تحديث المفتاح العام في rawaj_license.py و license.js")
    global SECRET, MONGO
    if os.environ.get("RAWAJ_SECRET_KEY"):
        SECRET = bytes.fromhex(os.environ["RAWAJ_SECRET_KEY"].strip())
    else:
        if not os.path.exists(SECRET_FILE):
            if HOSTED:
                sys.exit("خطأ: متغير البيئة RAWAJ_SECRET_KEY غير مضبوط (يلزم لفك تشفير كلمات مرور حسابات العملاء).")
            os.makedirs(os.path.dirname(SECRET_FILE), exist_ok=True)
            with open(SECRET_FILE, "w") as f:
                f.write(secrets.token_hex(32))
        with open(SECRET_FILE) as f:
            SECRET = bytes.fromhex(f.read().strip())
    for p in (DB_FILE, DB_FILE + ".prev"):
        try:
            with open(p, "r", encoding="utf-8") as f:
                DB = json.load(f)
            break
        except Exception:
            DB = None
    # MongoDB هو المصدر الرئيسي عند تفعيله؛ الملف المحلي احتياط عند انقطاع الاتصال
    MONGO = mongo_store.MongoSync(MONGO_CFG, seal, unseal, lock)
    MONGO.get_data = lambda: DB
    if MONGO.connect():
        try:
            if MONGO.has_data():
                DB = MONGO.from_db()
                MONGO_INFO["loadedFrom"] = "mongo"
                print("تم تحميل البيانات من MongoDB")
        except Exception as e:
            MONGO.state.update(connected=False, lastError=str(e)[:300])
            print("تعذر التحميل من MongoDB — العمل بالنسخة المحلية:", e)
    if DB is None:
        pw = os.environ.get("RAWAJ_PANEL_PASSWORD") or strong_password()
        ph, salt = hash_pw(pw)
        DB = {"owner": {"id": "owner", "name": "المالك", "email": OWNER_EMAIL, "passHash": ph, "salt": salt, "created": now_iso(), "lastLogin": None},
              "staff": [], "devices": {}, "tickets": [], "errors": [], "notifications": [], "updates": [], "events": [], "audit": [],
              "settings": {"smtp": {"host": "smtp.gmail.com", "port": 587, "user": "", "password": "", "from": ""}, "publicUrl": f"http://127.0.0.1:{PORT}"},
              "resetCodes": {}, "manualLicenses": []}
        save()
        with open(CREDENTIALS_FILE, "w", encoding="utf-8") as f:
            f.write(f"لوحة تحكم رواج\nالرابط: http://127.0.0.1:{PORT}/\nالبريد: {OWNER_EMAIL}\nكلمة المرور: {pw}\n\n"
                    "غيّر كلمة المرور من الإعدادات أو عبر «نسيت كلمة المرور» (رمز يصل للبريد).\n")
        print(f"تم إنشاء حساب المالك: {OWNER_EMAIL} / {pw}")
    for k, v in {"staff": [], "devices": {}, "tickets": [], "errors": [], "notifications": [], "updates": [], "events": [], "audit": [], "resetCodes": {}, "manualLicenses": [],
                 "accounts": [], "sales": [], "prices": dict(DEFAULT_PRICES), "coupons": [], "requests": []}.items():
        DB.setdefault(k, v)
    if "plans" not in DB:
        P = DB["prices"]
        DB["plans"] = [
            {"id": "pl_monthly", "name": "الباقة الشهرية", "type": "monthly", "days": 30, "price": P.get("monthly", 99), "features": BASE_FEATURES, "highlight": False, "active": True, "order": 1},
            {"id": "pl_quarterly", "name": "باقة 3 أشهر", "type": "quarterly", "days": 90, "price": P.get("quarterly", 269), "features": BASE_FEATURES, "highlight": False, "active": True, "order": 2},
            {"id": "pl_yearly", "name": "الباقة السنوية", "type": "yearly", "days": 365, "price": P.get("yearly", 899), "features": BASE_FEATURES + ["توفير أكثر من شهرين"], "highlight": True, "active": True, "order": 3},
            {"id": "pl_lifetime", "name": "الباقة الدائمة", "type": "lifetime", "days": None, "price": P.get("lifetime", 2499), "features": BASE_FEATURES + ["دفعة واحدة مدى الحياة"], "highlight": False, "active": True, "order": 4}]
    DB["settings"].setdefault("waSections", json.loads(json.dumps(DEFAULT_WA_SECTIONS)))
    DB["settings"].setdefault("payMethods", list(DEFAULT_PAY_METHODS))
    DB["settings"].setdefault("bankInfo", "")
    DB["settings"].setdefault("contract", {})
    DB.setdefault("site", json.loads(json.dumps(DEFAULT_SITE)))
    for k, v in DEFAULT_SITE.items():
        DB["site"].setdefault(k, json.loads(json.dumps(v)))
    DB.setdefault("system", json.loads(json.dumps(DEFAULT_SYSTEM)))
    DB.setdefault("visits", [])
    os.makedirs(CONTRACTS, exist_ok=True)
    DB["settings"].setdefault("backup", {"enabled": True, "dir": PANEL_BACKUPS, "last": ""})
    old_data = os.path.join(ROOT, "panel-data")  # المسار القديم قبل نقل الملفات الخاصة خارج مجلد اللوحة
    if DB["settings"]["backup"].get("dir", "").startswith(old_data):
        DB["settings"]["backup"]["dir"] = DATA + DB["settings"]["backup"]["dir"][len(old_data):]
    if MONGO.state["connected"]:
        if MONGO_INFO["loadedFrom"] == "mongo":
            MONGO.remember(DB)            # البيانات مطابقة لما في MongoDB
            atomic_write(DB_FILE, json.dumps(DB, ensure_ascii=False).encode("utf-8"))  # تحديث النسخة المحلية
        else:
            MONGO.sync_now(full=True)    # قاعدة فارغة: رفع البيانات الحالية لأول مرة
    MONGO.start(lambda: DB)
    MONGO.init_files(DATA, ("uploads", "client-backups", "updates", "contracts"))


def audit(who: dict, action: str, details: str = "") -> None:
    DB["audit"].append({"id": uid("log"), "time": now_iso(), "who": who.get("name") or who.get("email"), "action": action, "details": details})
    if len(DB["audit"]) > 5000:
        del DB["audit"][:-5000]


# =====================================================================
#   التراخيص
# =====================================================================
def issue_license(serial: str, plan: str, days=None, start=None, customer: str = "", note: str = "", end_at="__calc__") -> dict:
    start_dt = datetime.datetime.fromisoformat(start) if start else datetime.datetime.now(datetime.timezone.utc)
    if start_dt.tzinfo is None:
        start_dt = start_dt.replace(tzinfo=datetime.timezone.utc)
    label, default_days = PLANS.get(plan, PLANS["custom"])
    if plan == "revoked":
        end = start_dt.isoformat(timespec="seconds")
    elif plan == "lifetime":
        end = None
    else:
        n = int(days or default_days or 30)
        end = (start_dt + datetime.timedelta(days=n)).isoformat(timespec="seconds")
    if end_at != "__calc__":
        end = end_at
    payload = {"v": 1, "d": serial, "p": plan, "pl": label, "s": start_dt.isoformat(timespec="seconds"), "e": end,
               "i": now_iso() + f".{secrets.randbelow(1000):03d}", "c": customer[:80], "n": secrets.token_hex(4)}
    token = ec.sign_token(SIGNING_KEY, payload)
    return {"plan": plan, "label": label, "start": payload["s"], "end": end, "issued": payload["i"], "token": token, "note": note}


def license_status(licrec) -> dict:
    if not licrec:
        return {"active": False, "label": "غير مفعّل", "remainingDays": None}
    if licrec["plan"] == "revoked":
        return {"active": False, "label": "موقوف", "remainingDays": 0}
    if not licrec.get("end"):
        return {"active": True, "label": licrec["label"], "remainingDays": None}
    end = datetime.datetime.fromisoformat(licrec["end"])
    rem = (end - datetime.datetime.now(datetime.timezone.utc)).total_seconds() / 86400
    return {"active": rem > 0, "label": licrec["label"] if rem > 0 else "منتهي", "remainingDays": max(0, round(rem, 1))}


def device_by_serial(serial: str):
    for d in DB["devices"].values():
        if d.get("serial") == serial:
            return d
    return None


# =====================================================================
#   حسابات العملاء، الدفعات للأجهزة، المبيعات
# =====================================================================
def seal(text: str) -> str:
    """تشفير كلمة مرور الحساب ليتمكن المالك من عرضها (HMAC-SHA256 CTR + وسم سلامة)"""
    nonce = secrets.token_bytes(16)
    data = text.encode("utf-8")
    stream = b"".join(hmac.new(SECRET, nonce + i.to_bytes(4, "big"), hashlib.sha256).digest() for i in range(len(data) // 32 + 1))
    ct = bytes(a ^ b for a, b in zip(data, stream))
    tag = hmac.new(SECRET, b"tag" + nonce + ct, hashlib.sha256).digest()[:16]
    return base64.b64encode(nonce + tag + ct).decode()


def unseal(blob: str) -> str:
    try:
        raw = base64.b64decode(blob)
        nonce, tag, ct = raw[:16], raw[16:32], raw[32:]
        if not hmac.compare_digest(tag, hmac.new(SECRET, b"tag" + nonce + ct, hashlib.sha256).digest()[:16]):
            return ""
        stream = b"".join(hmac.new(SECRET, nonce + i.to_bytes(4, "big"), hashlib.sha256).digest() for i in range(len(ct) // 32 + 1))
        return bytes(a ^ b for a, b in zip(ct, stream)).decode("utf-8")
    except Exception:
        return ""


def js_hash(pw: str, salt: str = None):
    """نفس خوارزمية النظام (PBKDF2-SHA256، 120000 تكرار، الملح نص) — تُرسل البصمة فقط وليس كلمة المرور"""
    salt = salt or secrets.token_hex(16)
    return hashlib.pbkdf2_hmac("sha256", pw.encode("utf-8"), salt.encode("utf-8"), 120000).hex(), salt


def norm_phone(p: str) -> str:
    d = re.sub(r"[^\d]", "", str(p or ""))
    if d.startswith("00"):
        d = d[2:]
    if d.startswith("966"):
        d = "0" + d[3:]
    if len(d) == 9 and d.startswith("5"):
        d = "0" + d
    return d


def push(dev: dict, item: dict) -> None:
    dev.setdefault("pushes", [])
    if item["type"] == "settings":  # إعداد واحد فقط بانتظار التطبيق
        dev["pushes"] = [x for x in dev["pushes"] if x["type"] != "settings"]
    if item["type"] == "password":
        dev["pushes"] = [x for x in dev["pushes"] if not (x["type"] == "password" and x["username"] == item["username"])]
    dev["pushes"].append({"id": uid("psh"), "time": now_iso(), **item})


def account_license_for(acc: dict, dev: dict):
    """ترخيص الجهاز المرتبط بحساب = نفس باقة وتاريخ انتهاء الحساب"""
    L = acc.get("license")
    if not L or not dev.get("serial"):
        return
    if dev.get("license") and dev.get("accLicVer") == acc.get("licVer"):
        return
    dev["license"] = issue_license(dev["serial"], L["plan"], None, L["start"], acc["name"], "حساب " + acc["phone"], end_at=L["end"] if L["plan"] != "revoked" else L["start"])
    dev["accLicVer"] = acc.get("licVer")
    dev["accountId"] = acc["id"]


def change_stamp(did: str) -> str:
    """بصمة لكل ما يصل للجهاز في المزامنة: إذا تغيّرت يعرف النظام المفتوح أن هناك تعديلاً فيزامن فوراً"""
    dev = DB["devices"].get(did) or {}
    acc = next((a for a in DB["accounts"] if did in a.get("devices", [])), None) or {}
    lic = dev.get("license") or {}
    parts = [
        {k: lic.get(k) for k in ("plan", "label", "start", "end", "issued")}, dev.get("blocked", False),
        [x["id"] for x in dev.get("pushes", [])],
        acc.get("active", True), acc.get("licVer"), acc.get("settingsVer"), acc.get("license"),
        max((n["created"] for n in DB["notifications"] if n["target"] in ("all", did)), default=""),
        max((m["time"] for t in DB["tickets"] if t["deviceId"] == did for m in t["messages"] if m["from"] == "admin"), default=""),
        max((u["created"] for u in DB["updates"]), default=""),
        DB["system"], DB["prices"], [plan_public(x) for x in active_plans()], DB["settings"].get("payMethods", []),
        [x.get("id") for x in acc.get("contracts", [])],
    ]
    return hashlib.sha1(json.dumps(parts, ensure_ascii=False, sort_keys=True, default=str).encode("utf-8")).hexdigest()[:16]


def record_sale(u: dict, b: dict, kind: str, ref: str, customer: str, plan: str, label: str):
    if plan == "revoked":
        return None
    price = b.get("price")
    amount = float(price) if price not in (None, "") else float(DB["prices"].get(plan, 0) or 0)
    sale = {"id": uid("sale"), "time": now_iso(), "kind": kind, "ref": ref, "customer": customer[:120], "plan": plan, "label": label,
            "amount": round(amount, 2), "paid": bool(b.get("paid", True)), "method": clean(b.get("method") or "تحويل بنكي", 40),
            "note": clean(b.get("note"), 300), "by": u["name"]}
    DB["sales"].append(sale)
    return sale


def acc_public(a: dict, owner: bool) -> dict:
    x = {k: v for k, v in a.items() if k not in ("passHash", "salt", "passEnc", "jsHash", "jsSalt")}
    x["status"] = license_status(a.get("license"))
    x["deviceList"] = [{"deviceId": d, "serial": (DB["devices"].get(d) or {}).get("serial"), "computer": (DB["devices"].get(d) or {}).get("computer"),
                        "lastSeen": (DB["devices"].get(d) or {}).get("lastSeen")} for d in a.get("devices", [])]
    x["hasPassword"] = bool(a.get("passEnc"))
    x["contracts"] = a.get("contracts", [])
    return x


# =====================================================================
#   الباقات، أكواد الخصم، الطلبات، العقود
# =====================================================================
def active_plans():
    return sorted([x for x in DB["plans"] if x.get("active", True)], key=lambda x: x.get("order", 0))


def plan_public(x: dict) -> dict:
    return {k: x.get(k) for k in ("id", "name", "type", "days", "price", "features", "highlight")} | {"duration": ct.duration_label(x.get("type"), x.get("days"))}


def coupon_apply(code: str, plan: dict):
    """يعيد (الكوبون، الخصم، الصافي) أو يرفع ValueError برسالة مناسبة"""
    code = clean(code, 40).strip().upper()
    if not code:
        return None, 0.0, float(plan["price"])
    c = next((x for x in DB["coupons"] if x["code"] == code), None)
    if not c or not c.get("active", True):
        raise ValueError("كود الخصم غير صحيح")
    if c.get("expires") and c["expires"] < datetime.date.today().isoformat():
        raise ValueError("انتهت صلاحية كود الخصم")
    if int(c.get("maxUses") or 0) and int(c.get("used", 0)) >= int(c["maxUses"]):
        raise ValueError("تم استخدام كود الخصم بالكامل")
    if c.get("plans") and plan["id"] not in c["plans"]:
        raise ValueError("كود الخصم لا ينطبق على هذه الباقة")
    price = float(plan["price"])
    disc = price * float(c["value"]) / 100 if c["kind"] == "percent" else float(c["value"])
    disc = round(max(0.0, min(disc, price)), 2)
    return c, disc, round(price - disc, 2)


def fmt_money(v) -> str:
    v = float(v or 0)
    return f"{v:,.0f}" if v == int(v) else f"{v:,.2f}"


def wa_message(req: dict, keys=None) -> str:
    cur = DB["prices"].get("currency", "ر.س")
    plans = "\n".join(f"• {x['name']} ({ct.duration_label(x['type'], x.get('days'))}): {fmt_money(x['price'])} {cur}" for x in active_plans())
    vars_ = {"name": req["customer"].get("ownerName", ""), "company": req["customer"].get("company", ""), "plan": req.get("planName", ""),
             "price": fmt_money(req.get("price")), "final": fmt_money(req.get("final")), "currency": cur, "plans": plans,
             "discount_line": f"\n🎁 بعد خصم {fmt_money(req.get('discount'))} {cur} (كود {req.get('coupon')})" if req.get("discount") else "",
             "payment": "\n".join("• " + m for m in DB["settings"].get("payMethods", [])), "bank": DB["settings"].get("bankInfo", ""),
             "phone": "+967735999135", "email": OWNER_EMAIL}
    parts = []
    for sec in DB["settings"]["waSections"]:
        if (keys is None and sec.get("on")) or (keys is not None and sec["key"] in keys):
            t = sec["text"]
            for k, v in vars_.items():
                t = t.replace("{" + k + "}", str(v))
            parts.append(t.strip())
    return "\n\n".join(p for p in parts if p)


def make_contract(acc: dict, by: str, extra: dict = None) -> dict:
    """ينشئ عقد PDF للحساب ويحفظه في سجلّه"""
    extra = extra or {}
    L = acc.get("license") or {}
    S = acc.get("settings") or {}
    n = len(DB.get("contractsLog", [])) + 1
    DB.setdefault("contractsLog", []).append({"accountId": acc["id"], "time": now_iso()})
    no = f"RWJ-C-{datetime.date.today():%Y}-{n:04d}"
    fmt = lambda iso: datetime.datetime.fromisoformat(iso).astimezone().strftime("%Y/%m/%d") if iso else ""
    plan_name = extra.get("planName") or L.get("label", "")
    price = extra.get("price")
    if price is None:
        last = next((x for x in reversed(DB["sales"]) if x.get("ref") == acc["phone"]), None)
        price = last["amount"] if last else 0
    data = {"no": no, "date": ct.today(), "company": S.get("company") or acc["name"], "ownerName": S.get("ownerName") or acc["name"], "mobile": acc["phone"],
            "city": S.get("city", ""), "crNumber": S.get("crNumber", ""), "vatNumber": S.get("vatNumber", ""), "planName": plan_name,
            "duration": ct.duration_label(L.get("plan"), (datetime.datetime.fromisoformat(L["end"]) - datetime.datetime.fromisoformat(L["start"])).days if L.get("end") else None),
            "start": fmt(L.get("start")), "end": fmt(L.get("end")), "method": extra.get("method", "تحويل بنكي"),
            "price": extra.get("listPrice", price), "discount": extra.get("discount", 0), "coupon": extra.get("coupon", ""), "total": price,
            "devices": acc.get("maxDevices", 1), "username": acc["phone"], "password": unseal(acc.get("passEnc", "")), "currency": DB["prices"].get("currency", "ر.س"),
            "features": list(dict.fromkeys((extra.get("features") or []) + ct.FEATURES))[:12]}
    cid = uid("ctr")
    fname = f"{no}.pdf"
    out = os.path.join(CONTRACTS, acc["id"], fname)
    os.makedirs(os.path.dirname(out), exist_ok=True)
    ok = ct.html_to_pdf(ct.contract_html(data, DB["settings"].get("contract")), out, os.path.join(DATA, ".pdf-work"))
    if not ok:
        raise ValueError("تعذر إنشاء ملف PDF — يلزم وجود متصفح Microsoft Edge على جهاز اللوحة")
    MONGO.file_saved(out)
    rec = {"id": cid, "no": no, "file": fname, "created": now_iso(), "plan": plan_name, "total": price, "by": by}
    acc.setdefault("contracts", []).append(rec)
    return rec


# =====================================================================
#   النسخ الاحتياطي للوحة التحكم
# =====================================================================
def panel_backup(reason: str = "auto") -> dict:
    cfg = DB["settings"].get("backup", {})
    folder = cfg.get("dir") or PANEL_BACKUPS
    os.makedirs(folder, exist_ok=True)
    name = f"rawaj-panel-{datetime.datetime.now():%Y-%m-%d_%H-%M-%S}.zip"
    path = os.path.join(folder, name)
    with lock:
        data = json.dumps(DB, ensure_ascii=False).encode("utf-8")
    with zipfile.ZipFile(path, "w", zipfile.ZIP_DEFLATED) as z:
        z.writestr("panel-db.json", data)
        for f in (KEY_FILE, SECRET_FILE):
            if os.path.exists(f):
                z.write(f, "keys/" + os.path.basename(f))
    files = sorted(f for f in os.listdir(folder) if f.startswith("rawaj-panel-") and f.endswith(".zip"))
    for old in files[:-KEEP_PANEL_BACKUPS]:
        try:
            os.remove(os.path.join(folder, old))
        except OSError:
            pass
    with lock:
        DB["settings"]["backup"]["last"] = now_iso()
        save()
    return {"ok": True, "name": name, "dir": folder}


def panel_backup_list():
    folder = DB["settings"].get("backup", {}).get("dir") or PANEL_BACKUPS
    if not os.path.isdir(folder):
        return []
    out = []
    for n in sorted(os.listdir(folder), reverse=True):
        if n.startswith("rawaj-panel-") and n.endswith(".zip"):
            st = os.stat(os.path.join(folder, n))
            out.append({"name": n, "size": st.st_size, "time": datetime.datetime.fromtimestamp(st.st_mtime).isoformat(timespec="seconds")})
    return out


def backup_worker():
    while True:
        try:
            cfg = DB["settings"].get("backup", {})
            if cfg.get("enabled", True) and (cfg.get("last") or "")[:10] != datetime.datetime.now(datetime.timezone.utc).date().isoformat():
                panel_backup("auto")
        except Exception as e:
            print("panel backup error:", e)
        time.sleep(1800)


def pick_folder() -> str:
    ps = ("Add-Type -AssemblyName System.Windows.Forms;$f=New-Object System.Windows.Forms.FolderBrowserDialog;"
          "$f.Description='اختر مجلد النسخ الاحتياطية للوحة التحكم';$w=New-Object System.Windows.Forms.Form;$w.TopMost=$true;"
          "if($f.ShowDialog($w) -eq 'OK'){[Console]::OutputEncoding=[Text.Encoding]::UTF8;Write-Output $f.SelectedPath}")
    try:
        r = subprocess.run(["powershell", "-NoProfile", "-STA", "-Command", ps], capture_output=True, timeout=600, creationflags=0x08000000 if os.name == "nt" else 0)
        return r.stdout.decode("utf-8", "ignore").strip()
    except Exception:
        return ""


# =====================================================================
#   البريد (رموز استعادة كلمة المرور)
# =====================================================================
def send_mail(to: str, subject: str, body: str) -> bool:
    smtp = DB["settings"].get("smtp", {})
    if not smtp.get("user") or not smtp.get("password"):
        return False
    try:
        msg = EmailMessage()
        msg["Subject"], msg["From"], msg["To"] = subject, smtp.get("from") or smtp["user"], to
        msg.set_content(body)
        with smtplib.SMTP(smtp.get("host", "smtp.gmail.com"), int(smtp.get("port", 587)), timeout=20) as s:
            s.starttls()
            s.login(smtp["user"], smtp["password"])
            s.send_message(msg)
        return True
    except Exception as e:
        print("SMTP error:", e)
        return False


# =====================================================================
#   أدوات الطلبات
# =====================================================================
def clean(s, n=2000) -> str:
    return str(s or "")[:n]


def save_image(data_url: str, prefix: str):
    m = re.match(r"^data:image/(png|jpeg|jpg|webp|gif);base64,(.+)$", data_url or "", re.S)
    if not m:
        return None
    raw = base64.b64decode(m.group(2))
    if len(raw) > 8 * 1024 * 1024:
        return None
    name = f"{prefix}_{secrets.token_hex(8)}.{m.group(1).replace('jpeg', 'jpg')}"
    with open(os.path.join(UPLOADS, name), "wb") as f:
        f.write(raw)
    MONGO.file_saved(os.path.join(UPLOADS, name))
    return name


def touch_device(dev: dict, ip: str) -> dict:
    did = clean(dev.get("deviceId"), 64)
    if not re.fullmatch(r"[0-9A-F]{32}", did):
        raise ValueError("bad device")
    rec = DB["devices"].setdefault(did, {"deviceId": did, "firstSeen": now_iso(), "license": None, "notes": "", "syncCount": 0})
    for k in ("serial", "subscriptionNo", "computer", "os", "winUser", "appVersion"):
        if dev.get(k):
            rec[k] = clean(dev[k], 200)
    rec["lastSeen"] = now_iso()
    rec["ip"] = ip
    # ترخيص أُصدر يدوياً (رمز تفعيل) قبل أن يتصل الجهاز لأول مرة
    if not rec.get("license"):
        for m in DB["manualLicenses"]:
            if m.get("serial") == rec.get("serial"):
                rec["license"] = m["license"]
    return rec


# =====================================================================
#   الخادم
# =====================================================================
class Handler(http.server.SimpleHTTPRequestHandler):
    server_version = "RawajPanel"

    def __init__(self, *a, **kw):
        super().__init__(*a, directory=os.path.join(ROOT, "www"), **kw)

    def log_message(self, *a):
        pass

    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        self.send_header("X-Content-Type-Options", "nosniff")
        self.send_header("X-Frame-Options", "DENY")
        self.send_header("Referrer-Policy", "no-referrer")
        super().end_headers()

    # ---------- أدوات ----------
    def send_json(self, code, obj, headers=None):
        data = json.dumps(obj, ensure_ascii=False).encode("utf-8")
        self.send_response(code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(data)))
        for k, v in (headers or {}).items():
            self.send_header(k, v)
        self.end_headers()
        self.wfile.write(data)

    def send_file(self, path, name, ctype="application/octet-stream", inline=False):
        if not os.path.isfile(path):
            return self.send_json(404, {"ok": False, "error": "الملف غير موجود"})
        with open(path, "rb") as f:
            data = f.read()
        self.send_response(200)
        self.send_header("Content-Type", ctype)
        self.send_header("Content-Length", str(len(data)))
        disp = "inline" if inline else "attachment"
        self.send_header("Content-Disposition", f"{disp}; filename*=UTF-8''{urllib.parse.quote(name)}")
        self.end_headers()
        self.wfile.write(data)

    def body(self) -> dict:
        n = int(self.headers.get("Content-Length", 0) or 0)
        if n > MAX_BODY:
            raise ValueError("الطلب كبير جداً")
        raw = self.rfile.read(n) if n else b""
        return json.loads(raw.decode("utf-8")) if raw else {}

    def query(self) -> dict:
        return {k: v[0] for k, v in urllib.parse.parse_qs(urllib.parse.urlparse(self.path).query).items()}

    def ip(self) -> str:
        return self.headers.get("X-Forwarded-For", self.client_address[0]).split(",")[0].strip()

    def session(self):
        m = re.search(r"rp_session=([A-Za-z0-9_-]+)", self.headers.get("Cookie", ""))
        s = SESSIONS.get(m.group(1)) if m else None
        if not s or s["exp"] < time.time():
            return None
        s["exp"] = time.time() + SESSION_TTL
        return s

    def current_user(self):
        s = self.session()
        if not s:
            return None
        if s["uid"] == "owner":
            u = DB["owner"]
            return {"id": "owner", "name": u.get("name", "المالك"), "email": u["email"], "owner": True, "perms": list(PERMS) + list(OWNER_ONLY)}
        u = next((x for x in DB["staff"] if x["id"] == s["uid"] and x.get("active", True)), None)
        if not u:
            return None
        return {"id": u["id"], "name": u["name"], "email": u.get("email", ""), "username": u.get("username", ""), "owner": False, "perms": [p for p in u.get("perms", []) if p in PERMS]}

    # ---------- التوجيه ----------
    def do_GET(self):
        path = urllib.parse.urlparse(self.path).path
        if path.startswith("/api/"):
            return self.dispatch("GET", path)
        return super().do_GET()

    def do_POST(self):
        path = urllib.parse.urlparse(self.path).path
        return self.dispatch("POST", path)

    def do_OPTIONS(self):
        # طلبات CORS التمهيدية لموقع النظام (واجهة /api/public فقط)
        if urllib.parse.urlparse(self.path).path.startswith("/api/public/"):
            self.send_response(204)
            self.send_header("Access-Control-Allow-Origin", "*")
            self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
            self.send_header("Access-Control-Allow-Headers", "Content-Type")
            self.send_header("Access-Control-Max-Age", "86400")
            self.end_headers()
        else:
            self.send_response(405)
            self.end_headers()

    def public_json(self, code, obj):
        data = json.dumps(obj, ensure_ascii=False).encode("utf-8")
        self.send_response(code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(data)))
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        self.wfile.write(data)

    def public_api(self, method, path):
        """واجهة موقع النظام: الباقات، كود الخصم، طلب فتح حساب، رسالة خدمة العملاء"""
        ip = self.ip()
        if path == "/api/public/site":
            S = DB["site"]
            m = S["maintenance"]
            return self.public_json(200, {"ok": True, "maintenance": m if m.get("on") else {"on": False}, "announcement": S["announcement"] if S["announcement"].get("on") else {"on": False},
                                          "hero": S["hero"], "downloadUrl": S.get("downloadUrl", ""), "version": S.get("version", ""), "fileSize": S.get("fileSize", ""),
                                          "whatsapp": S.get("whatsapp", ""), "email": S.get("email", ""), "sections": S["sections"]})
        if path == "/api/public/track" and method == "POST":
            n = int(self.headers.get("Content-Length", 0) or 0)
            if n > 4000:
                return self.public_json(413, {"ok": False})
            try:
                b = json.loads(self.rfile.read(n).decode("utf-8") or "{}")
            except Exception:
                return self.public_json(400, {"ok": False})
            with lock:
                r = an.track(DB, b, ip, self.headers.get("User-Agent", ""), mark_dirty)
                mark_dirty()
            return self.public_json(200, r)
        if path == "/api/public/plans":
            return self.public_json(200, {"ok": True, "plans": [plan_public(x) for x in active_plans()], "currency": DB["prices"].get("currency", "ر.س"),
                                          "payMethods": DB["settings"].get("payMethods", [])})
        if method != "POST":
            return self.public_json(405, {"ok": False})
        b = self.body()
        with lock:
            if path == "/api/public/coupon":
                plan = next((x for x in active_plans() if x["id"] == b.get("planId")), None)
                if not plan:
                    return self.public_json(400, {"ok": False, "error": "اختر الباقة"})
                try:
                    c, disc, final = coupon_apply(b.get("code"), plan)
                except ValueError as ex:
                    return self.public_json(200, {"ok": False, "error": str(ex)})
                return self.public_json(200, {"ok": True, "discount": disc, "final": final, "label": (f"خصم {fmt_money(c['value'])}%" if c["kind"] == "percent" else f"خصم {fmt_money(c['value'])}") if c else ""})
            today = now_iso()[:10]
            if path == "/api/public/signup":
                if sum(1 for r in DB["requests"] if r.get("ip") == ip and r["created"][:10] == today) >= 5:
                    return self.public_json(429, {"ok": False, "error": "تم استلام طلباتك اليوم — سنتواصل معك قريباً"})
                cu = {k: clean((b.get("customer") or {}).get(k), 300).strip() for k in ("ownerName", "mobile", "email", "company", "companyEn", "activity", "city", "district", "address",
                                                                                         "vatNumber", "crNumber", "employees", "branches", "payMethod", "contactTime", "notes", "legalName", "postalCode", "buildingNo", "street")}
                cu["mobile"] = norm_phone(cu["mobile"])
                plan = next((x for x in active_plans() if x["id"] == b.get("planId")), None)
                missing = [n for k, n in (("ownerName", "الاسم"), ("mobile", "رقم الجوال"), ("company", "اسم المنشأة"), ("activity", "النشاط"), ("city", "المدينة")) if not cu[k]]
                if missing or not plan or not re.fullmatch(r"\d{9,15}", cu["mobile"]):
                    return self.public_json(400, {"ok": False, "error": "أكمل: " + "، ".join(missing or (["الباقة"] if not plan else ["رقم جوال صحيح"]))})
                try:
                    c, disc, final = coupon_apply(b.get("coupon"), plan)
                except ValueError:
                    c, disc, final = None, 0.0, float(plan["price"])
                req = {"id": uid("req"), "created": now_iso(), "status": "new", "source": "website", "planId": plan["id"], "planName": plan["name"], "planType": plan["type"], "days": plan.get("days"),
                       "price": float(plan["price"]), "coupon": c["code"] if c else "", "discount": disc, "final": final, "currency": DB["prices"].get("currency", "ر.س"),
                       "customer": cu, "deviceId": None, "serial": "", "ip": ip, "notes": "", "history": [{"time": now_iso(), "by": "العميل", "action": "إرسال الطلب من الموقع"}]}
                DB["requests"].append(req)
                save()
                return self.public_json(200, {"ok": True, "requestId": req["id"]})
            if path == "/api/public/contact":
                if sum(1 for t in DB["tickets"] if t.get("ip") == ip and t["created"][:10] == today) >= 10:
                    return self.public_json(429, {"ok": False, "error": "تم استلام رسائلك — سنرد عليك قريباً"})
                name, phone, msg = clean(b.get("name"), 120).strip(), norm_phone(b.get("phone")), clean(b.get("message"), 5000).strip()
                if not name or not msg or not re.fullmatch(r"\d{9,15}", phone):
                    return self.public_json(400, {"ok": False, "error": "أكمل الاسم ورقم الجوال والرسالة"})
                t = {"id": uid("tk"), "deviceId": "website", "serial": "الموقع", "company": clean(b.get("company"), 200), "userName": name, "phone": phone, "email": clean(b.get("email"), 120),
                     "category": clean(b.get("category") or "استفسار من الموقع", 40), "subject": clean(b.get("subject"), 200) or "رسالة من الموقع", "status": "open", "priority": "normal",
                     "created": now_iso(), "updated": now_iso(), "unread": True, "ip": ip, "source": "website",
                     "messages": [{"id": uid("m"), "from": "client", "name": name, "text": msg, "images": [], "time": now_iso()}]}
                DB["tickets"].append(t)
                save()
                return self.public_json(200, {"ok": True})
        return self.public_json(404, {"ok": False})

    def dispatch(self, method, path):
        try:
            if path.startswith("/api/public/"):
                return self.public_api(method, path)
            if path.startswith("/api/client/"):
                return self.client_api(method, path)
            if path.startswith("/api/auth/"):
                return self.auth_api(method, path)
            if path.startswith("/api/admin/"):
                if method == "POST" and self.headers.get("X-Panel") != "1":
                    return self.send_json(403, {"ok": False, "error": "طلب مرفوض"})
                u = self.current_user()
                if not u:
                    return self.send_json(401, {"ok": False, "error": "انتهت الجلسة — سجّل الدخول"})
                return self.admin_api(method, path, u)
            return self.send_json(404, {"ok": False})
        except PermissionError as e:
            return self.send_json(403, {"ok": False, "error": str(e) or "ليست لديك صلاحية"})
        except (ValueError, KeyError) as e:
            return self.send_json(400, {"ok": False, "error": str(e)})
        except Exception as e:  # pragma: no cover
            import traceback
            traceback.print_exc()
            return self.send_json(500, {"ok": False, "error": "خطأ في الخادم: " + str(e)})

    # =================================================================
    #   واجهة العملاء
    # =================================================================
    def client_api(self, method, path):
        if method == "GET" and path.startswith("/api/client/update/"):
            up = next((u for u in DB["updates"] if u["id"] == path.rsplit("/", 1)[-1]), None)
            if not up:
                return self.send_json(404, {"ok": False})
            up["downloads"] = up.get("downloads", 0) + 1
            save()
            return self.send_file(os.path.join(UPDATES, up["file"]), up["originalName"])
        if method != "POST":
            return self.send_json(405, {"ok": False})
        b = self.body()
        if path == "/api/client/poll":
            # فحص خفيف كل بضع ثوانٍ من النظام المفتوح: بصمة لكل ما قد يصل للجهاز — لا يكتب شيئاً
            did = clean((b.get("device") or {}).get("deviceId"), 64)
            with lock:
                stamp = change_stamp(did)
            return self.send_json(200, {"ok": True, "stamp": stamp})
        with lock:
            dev = touch_device(b.get("device") or {}, self.ip())
            did = dev["deviceId"]
            if path == "/api/client/plans":
                save()
                return self.send_json(200, {"ok": True, "plans": [plan_public(x) for x in active_plans()], "currency": DB["prices"].get("currency", "ر.س"),
                                            "payMethods": DB["settings"].get("payMethods", [])})
            if path == "/api/client/coupon":
                plan = next((x for x in active_plans() if x["id"] == b.get("planId")), None)
                if not plan:
                    return self.send_json(400, {"ok": False, "error": "اختر الباقة"})
                try:
                    c, disc, final = coupon_apply(b.get("code"), plan)
                except ValueError as ex:
                    return self.send_json(200, {"ok": False, "error": str(ex)})
                return self.send_json(200, {"ok": True, "discount": disc, "final": final, "label": (f"خصم {fmt_money(c['value'])}%" if c["kind"] == "percent" else f"خصم {fmt_money(c['value'])}") if c else ""})
            if path == "/api/client/signup":
                recent = [r for r in DB["requests"] if r.get("deviceId") == did and r["created"][:10] == now_iso()[:10]]
                if len(recent) >= 5:
                    return self.send_json(429, {"ok": False, "error": "تم إرسال طلبات كثيرة اليوم — سنتواصل معك قريباً"})
                cu = {k: clean((b.get("customer") or {}).get(k), 300).strip() for k in ("ownerName", "mobile", "email", "company", "companyEn", "activity", "city", "district", "address",
                                                                                         "vatNumber", "crNumber", "employees", "branches", "payMethod", "contactTime", "notes", "legalName", "postalCode", "buildingNo", "street")}
                cu["mobile"] = norm_phone(cu["mobile"])
                plan = next((x for x in active_plans() if x["id"] == b.get("planId")), None)
                missing = [n for k, n in (("ownerName", "الاسم"), ("mobile", "رقم الجوال"), ("company", "اسم المنشأة"), ("activity", "النشاط"), ("city", "المدينة")) if not cu[k]]
                if missing or not plan:
                    return self.send_json(400, {"ok": False, "error": "أكمل: " + "، ".join(missing or ["الباقة"])})
                try:
                    c, disc, final = coupon_apply(b.get("coupon"), plan)
                except ValueError:
                    c, disc, final = None, 0.0, float(plan["price"])
                req = {"id": uid("req"), "created": now_iso(), "status": "new", "planId": plan["id"], "planName": plan["name"], "planType": plan["type"], "days": plan.get("days"),
                       "price": float(plan["price"]), "coupon": c["code"] if c else "", "discount": disc, "final": final, "currency": DB["prices"].get("currency", "ر.س"),
                       "customer": cu, "deviceId": did, "serial": dev.get("serial"), "ip": self.ip(), "notes": "", "history": [{"time": now_iso(), "by": "العميل", "action": "إرسال الطلب"}]}
                DB["requests"].append(req)
                save()
                return self.send_json(200, {"ok": True, "requestId": req["id"]})
            if path == "/api/client/contracts":
                acc = next((a for a in DB["accounts"] if did in a.get("devices", [])), None)
                save()
                return self.send_json(200, {"ok": True, "items": [{k: x[k] for k in ("id", "no", "created", "plan")} for x in (acc or {}).get("contracts", [])]})
            if path == "/api/client/contract":
                acc = next((a for a in DB["accounts"] if did in a.get("devices", [])), None)
                rec = next((x for x in (acc or {}).get("contracts", []) if x["id"] == b.get("id")), None)
                if not rec:
                    return self.send_json(404, {"ok": False, "error": "العقد غير موجود"})
                return self.send_file(os.path.join(CONTRACTS, acc["id"], rec["file"]), rec["file"], "application/pdf")
            if path == "/api/client/sync":
                dev["syncCount"] = dev.get("syncCount", 0) + 1
                for k in ("company", "stats", "users", "trial", "mode", "account", "localLicense"):
                    if k in b:
                        dev[k] = b[k]
                acks = set(b.get("acks") or [])
                if acks:
                    dev["pushes"] = [x for x in dev.get("pushes", []) if x["id"] not in acks]
                acc = next((a for a in DB["accounts"] if did in a.get("devices", [])), None)
                if acc:
                    account_license_for(acc, dev)
                DB["events"].append({"d": did, "t": now_iso(), "m": clean(b.get("mode"), 20)})
                if len(DB["events"]) > 20000:
                    del DB["events"][:-20000]
                since = clean(b.get("since"), 40)
                msgs = [n for n in DB["notifications"] if (n["target"] in ("all", did)) and n["created"] > since]
                replies = []
                for t in DB["tickets"]:
                    if t["deviceId"] != did:
                        continue
                    for m in t["messages"]:
                        if m["from"] == "admin" and m["time"] > since:
                            replies.append({"ticketId": t["id"], "subject": t["subject"], "status": t["status"], **m})
                latest = sorted(DB["updates"], key=lambda u: u["created"])[-1:] if DB["updates"] else []
                update = None
                if latest:
                    u = latest[0]
                    update = {"id": u["id"], "version": u["version"], "notes": u["notes"], "mandatory": u.get("mandatory", False),
                              "created": u["created"], "size": u.get("size", 0), "url": f"/api/client/update/{u['id']}"}
                save()
                lic = dev.get("license")
                return self.send_json(200, {"ok": True, "serverTime": now_iso(), "licenseToken": lic["token"] if lic else None,
                                            "license": {k: v for k, v in lic.items() if k != "token"} if lic else None,
                                            "notifications": msgs, "replies": replies, "update": update,
                                            "blocked": dev.get("blocked", False) or bool(acc and not acc.get("active", True)),
                                            "pushes": dev.get("pushes", []), "prices": DB["prices"],
                                            "system": {"maintenance": DB["system"]["maintenance"] if DB["system"]["maintenance"].get("on") else {"on": False},
                                                       "announcement": DB["system"]["announcement"] if DB["system"]["announcement"].get("on") else {"on": False}},
                                            "plans": [plan_public(x) for x in active_plans()], "payMethods": DB["settings"].get("payMethods", []),
                                            "contracts": [{k: x[k] for k in ("id", "no", "created", "plan")} for x in (acc or {}).get("contracts", [])]})
            if path == "/api/client/account-login":
                ip = self.ip()
                fails = [t for t in LOGIN_FAILS.get("acc" + ip, []) if t > time.time() - 900]
                if len(fails) >= 8:
                    return self.send_json(429, {"ok": False, "error": "محاولات كثيرة — حاول بعد 15 دقيقة"})
                phone = norm_phone(b.get("phone"))
                acc = next((a for a in DB["accounts"] if a["phone"] == phone), None)
                if not acc or not check_pw(acc, clean(b.get("password"), 200)):
                    LOGIN_FAILS["acc" + ip] = fails + [time.time()]
                    save()
                    return self.send_json(401, {"ok": False, "error": "رقم الجوال أو كلمة المرور غير صحيحة"})
                if not acc.get("active", True):
                    return self.send_json(403, {"ok": False, "error": "هذا الحساب موقوف — تواصل مع الدعم الفني"})
                if did not in acc.setdefault("devices", []):
                    if len(acc["devices"]) >= int(acc.get("maxDevices", 1) or 1):
                        return self.send_json(403, {"ok": False, "error": f"تجاوزت عدد الأجهزة المسموح بها لهذا الحساب ({acc.get('maxDevices', 1)}) — تواصل مع الدعم الفني"})
                    acc["devices"].append(did)
                    audit({"name": acc["name"]}, "ربط جهاز بحساب عميل", f"{acc['phone']} ← {dev.get('serial')}")
                account_license_for(acc, dev)
                if acc.get("settings") and not dev.get("accSettingsApplied") == acc.get("settingsVer"):
                    push(dev, {"type": "settings", "data": acc["settings"]})
                    dev["accSettingsApplied"] = acc.get("settingsVer")
                acc["lastLogin"] = now_iso()
                save()
                lic = dev.get("license")
                return self.send_json(200, {"ok": True, "account": {"id": acc["id"], "name": acc["name"], "phone": acc["phone"], "email": acc.get("email", "")},
                                            "licenseToken": lic["token"] if lic else None, "pushes": dev.get("pushes", []), "prices": DB["prices"]})
            if path == "/api/client/ticket":
                imgs = [n for n in (save_image(x, "tk") for x in (b.get("images") or [])[:6]) if n]
                t = {"id": uid("tk"), "deviceId": did, "serial": dev.get("serial"), "company": clean((dev.get("company") or {}).get("name") or b.get("company"), 200),
                     "userName": clean(b.get("userName"), 120), "phone": clean(b.get("phone"), 40), "email": clean(b.get("email"), 120),
                     "category": clean(b.get("category"), 40), "subject": clean(b.get("subject"), 200) or "بدون عنوان", "status": "open", "priority": clean(b.get("priority") or "normal", 20),
                     "created": now_iso(), "updated": now_iso(), "unread": True,
                     "messages": [{"id": uid("m"), "from": "client", "name": clean(b.get("userName"), 120), "text": clean(b.get("message"), 8000), "images": imgs, "time": now_iso()}]}
                DB["tickets"].append(t)
                save()
                return self.send_json(200, {"ok": True, "ticketId": t["id"]})
            if path == "/api/client/ticket-reply":
                t = next((x for x in DB["tickets"] if x["id"] == b.get("ticketId") and x["deviceId"] == did), None)
                if not t:
                    return self.send_json(404, {"ok": False, "error": "التذكرة غير موجودة"})
                imgs = [n for n in (save_image(x, "tk") for x in (b.get("images") or [])[:6]) if n]
                t["messages"].append({"id": uid("m"), "from": "client", "name": clean(b.get("userName"), 120), "text": clean(b.get("message"), 8000), "images": imgs, "time": now_iso()})
                t["status"], t["updated"], t["unread"] = "open", now_iso(), True
                save()
                return self.send_json(200, {"ok": True})
            if path == "/api/client/error":
                DB["errors"].append({"id": uid("err"), "deviceId": did, "serial": dev.get("serial"), "company": clean((dev.get("company") or {}).get("name"), 200),
                                     "level": clean(b.get("level") or "error", 20), "source": clean(b.get("source"), 60), "message": clean(b.get("message"), 1000),
                                     "stack": clean(b.get("stack"), 4000), "url": clean(b.get("url"), 300), "user": clean(b.get("user"), 120),
                                     "appVersion": dev.get("appVersion"), "time": clean(b.get("time"), 40) or now_iso(), "received": now_iso(), "resolved": False})
                if len(DB["errors"]) > 5000:
                    del DB["errors"][:-5000]
                save()
                return self.send_json(200, {"ok": True})
            if path == "/api/client/event":
                DB["events"].append({"d": did, "t": now_iso(), "m": clean(b.get("type"), 40)})
                save()
                return self.send_json(200, {"ok": True})
            if path == "/api/client/backup":
                raw = base64.b64decode(b.get("data", ""))
                gzip.decompress(raw)  # تحقق من سلامة الملف
                folder = os.path.join(BACKUPS, did)
                os.makedirs(folder, exist_ok=True)
                name = re.sub(r"[^A-Za-z0-9_.-]", "", clean(b.get("name"), 80)) or f"rawaj-{datetime.date.today()}.json.gz"
                with open(os.path.join(folder, name), "wb") as f:
                    f.write(raw)
                MONGO.file_saved(os.path.join(folder, name))
                files = sorted(os.listdir(folder))
                for old in files[:-30]:  # آخر 30 نسخة لكل عميل
                    os.remove(os.path.join(folder, old))
                    MONGO.file_removed(os.path.join(folder, old))
                dev["lastBackup"] = now_iso()
                save()
                return self.send_json(200, {"ok": True})
        return self.send_json(404, {"ok": False})

    # =================================================================
    #   الدخول واستعادة كلمة المرور
    # =================================================================
    def auth_api(self, method, path):
        if path == "/api/auth/me":
            u = self.current_user()
            return self.send_json(200 if u else 401, {"ok": bool(u), "user": u, "perms": PERMS})
        if method != "POST":
            return self.send_json(405, {"ok": False})
        b = self.body()
        ip = self.ip()
        if path == "/api/auth/login":
            fails = [t for t in LOGIN_FAILS.get(ip, []) if t > time.time() - 900]
            if len(fails) >= 6:
                return self.send_json(429, {"ok": False, "error": "محاولات كثيرة — حاول بعد 15 دقيقة"})
            login = clean(b.get("login"), 120).strip().lower()
            pw = clean(b.get("password"), 200)
            uid_ = None
            if login == DB["owner"]["email"].lower() and check_pw(DB["owner"], pw):
                uid_ = "owner"
                DB["owner"]["lastLogin"] = now_iso()
            else:
                st = next((x for x in DB["staff"] if login in (x.get("email", "").lower(), x.get("username", "").lower()) and x.get("active", True)), None)
                if st and check_pw(st, pw):
                    uid_ = st["id"]
                    st["lastLogin"] = now_iso()
            if not uid_:
                LOGIN_FAILS[ip] = fails + [time.time()]
                time.sleep(0.6)
                return self.send_json(401, {"ok": False, "error": "البريد أو كلمة المرور غير صحيحة"})
            LOGIN_FAILS.pop(ip, None)
            sid = secrets.token_urlsafe(32)
            SESSIONS[sid] = {"uid": uid_, "exp": time.time() + SESSION_TTL}
            u = self.current_user_by(uid_)
            with lock:
                audit(u, "تسجيل دخول", ip)
                save()
            return self.send_json(200, {"ok": True}, {"Set-Cookie": f"rp_session={sid}; HttpOnly; SameSite=Strict; Path=/; Max-Age={SESSION_TTL}" + ("; Secure" if self.headers.get("X-Forwarded-Proto") == "https" else "")})
        if path == "/api/auth/logout":
            m = re.search(r"rp_session=([A-Za-z0-9_-]+)", self.headers.get("Cookie", ""))
            if m:
                SESSIONS.pop(m.group(1), None)
            return self.send_json(200, {"ok": True}, {"Set-Cookie": "rp_session=; Path=/; Max-Age=0"})
        if path == "/api/auth/forgot":
            email = clean(b.get("email"), 120).strip().lower()
            target = None
            if email == DB["owner"]["email"].lower():
                target = "owner"
            else:
                st = next((x for x in DB["staff"] if x.get("email", "").lower() == email and email), None)
                target = st["id"] if st else None
            sent = False
            if target:
                code = f"{secrets.randbelow(10 ** 6):06d}"
                with lock:
                    DB["resetCodes"][email] = {"hash": hashlib.sha256(code.encode()).hexdigest(), "exp": time.time() + 900, "uid": target, "tries": 0}
                    save()
                sent = send_mail(email, "رمز استعادة كلمة المرور — لوحة تحكم رواج",
                                 f"رمز التحقق الخاص بك: {code}\nصالح لمدة 15 دقيقة.\nإذا لم تطلب هذا الرمز فتجاهل الرسالة.")
                if not sent:  # البريد غير مُعد بعد: يُكتب الرمز في ملف محلي لا يصل إليه إلا صاحب الجهاز
                    with open(os.path.join(DATA, "reset-code.txt"), "w", encoding="utf-8") as f:
                        f.write(f"{email}\n{code}\nصالح حتى {datetime.datetime.fromtimestamp(time.time() + 900):%H:%M}\n")
            return self.send_json(200, {"ok": True, "mailConfigured": bool(DB["settings"]["smtp"].get("user")), "sent": sent})
        if path == "/api/auth/reset":
            email = clean(b.get("email"), 120).strip().lower()
            rec = DB["resetCodes"].get(email)
            pw = clean(b.get("password"), 200)
            if not rec or rec["exp"] < time.time() or rec["tries"] >= 5:
                return self.send_json(400, {"ok": False, "error": "الرمز منتهي — اطلب رمزاً جديداً"})
            if not hmac.compare_digest(rec["hash"], hashlib.sha256(clean(b.get("code"), 10).strip().encode()).hexdigest()):
                rec["tries"] += 1
                save()
                return self.send_json(400, {"ok": False, "error": "رمز التحقق غير صحيح"})
            if len(pw) < 10:
                return self.send_json(400, {"ok": False, "error": "كلمة المرور 10 أحرف على الأقل"})
            with lock:
                target = DB["owner"] if rec["uid"] == "owner" else next((x for x in DB["staff"] if x["id"] == rec["uid"]), None)
                target["passHash"], target["salt"] = hash_pw(pw)
                DB["resetCodes"].pop(email, None)
                for sid in [k for k, v in SESSIONS.items() if v["uid"] == rec["uid"]]:
                    SESSIONS.pop(sid, None)
                audit({"name": email}, "استعادة كلمة المرور", "")
                save()
            try:
                os.remove(os.path.join(DATA, "reset-code.txt"))
            except OSError:
                pass
            return self.send_json(200, {"ok": True})
        return self.send_json(404, {"ok": False})

    def current_user_by(self, uid_):
        if uid_ == "owner":
            return {"name": DB["owner"].get("name", "المالك"), "email": DB["owner"]["email"]}
        st = next((x for x in DB["staff"] if x["id"] == uid_), {})
        return {"name": st.get("name"), "email": st.get("email")}

    # =================================================================
    #   واجهة الإدارة
    # =================================================================
    def admin_api(self, method, path, u):
        def need(p):
            if p in OWNER_ONLY and not u["owner"]:
                raise PermissionError("هذه الصلاحية للمالك فقط")
            if p not in u["perms"]:
                raise PermissionError("ليست لديك صلاحية لهذا القسم")

        q = self.query()
        b = self.body() if method == "POST" else {}
        name = path[len("/api/admin/"):]

        # ---------------- لوحة المؤشرات ----------------
        if name == "overview":
            devs = list(DB["devices"].values())
            now = datetime.datetime.now(datetime.timezone.utc)

            def ago(iso, days):
                try:
                    return (now - datetime.datetime.fromisoformat(iso)).total_seconds() < days * 86400
                except Exception:
                    return False
            plans = {}
            active = 0
            for d in devs:
                st = license_status(d.get("license"))
                if st["active"]:
                    active += 1
                key = d["license"]["plan"] if d.get("license") else ("trial" if (d.get("mode") == "guest" or (d.get("trial") or {}).get("started")) else "none")
                plans[key] = plans.get(key, 0) + 1
            days = {}
            for e in DB["events"]:
                k = e["t"][:10]
                days.setdefault(k, set()).add(e["d"])
            last30 = [(now - datetime.timedelta(days=i)).date().isoformat() for i in range(29, -1, -1)]
            expiring = []
            for d in devs:
                st = license_status(d.get("license"))
                if st["active"] and st["remainingDays"] is not None and st["remainingDays"] <= 7:
                    expiring.append({"deviceId": d["deviceId"], "company": (d.get("company") or {}).get("name"), "serial": d.get("serial"), "remainingDays": st["remainingDays"],
                                     "phone": next((x["phone"] for x in DB["accounts"] if d["deviceId"] in x.get("devices", [])), (d.get("company") or {}).get("phone", ""))})
            month = now.strftime("%Y-%m")
            return self.send_json(200, {"ok": True,
                "newRequests": sum(1 for r in DB["requests"] if r["status"] == "new"),
                "siteLive": an.stats(DB, 1, DB["requests"])["live"], "siteToday": an.stats(DB, 1, DB["requests"])["visitors"],
                "maintenance": {"system": DB["system"]["maintenance"].get("on"), "site": DB["site"]["maintenance"].get("on")}, "accounts": len(DB["accounts"]), "revenueMonth": round(sum(x["amount"] for x in DB["sales"] if x["time"][:7] == month), 2),
                "revenueTotal": round(sum(x["amount"] for x in DB["sales"]), 2), "unpaid": round(sum(x["amount"] for x in DB["sales"] if not x.get("paid", True)), 2),
                "currency": DB["prices"].get("currency", "ر.س"),
                "devices": len(devs), "online24": sum(1 for d in devs if ago(d.get("lastSeen", ""), 1)), "active": active,
                "trial": plans.get("trial", 0), "plans": plans,
                "openTickets": sum(1 for t in DB["tickets"] if t["status"] == "open"), "unreadTickets": sum(1 for t in DB["tickets"] if t.get("unread")),
                "errors7": sum(1 for e in DB["errors"] if ago(e["received"], 7) and not e["resolved"]),
                "newDevices30": sum(1 for d in devs if ago(d.get("firstSeen", ""), 30)),
                "activity": [{"day": k, "count": len(days.get(k, ()))} for k in last30],
                "signups": [{"day": k, "count": sum(1 for d in devs if d.get("firstSeen", "")[:10] == k)} for k in last30],
                "expiring": sorted(expiring, key=lambda x: x["remainingDays"]),
                "recentTickets": [{k: t[k] for k in ("id", "subject", "company", "userName", "status", "updated")} for t in sorted(DB["tickets"], key=lambda t: t["updated"], reverse=True)[:6]],
                "recentErrors": sorted(DB["errors"], key=lambda e: e["received"], reverse=True)[:6]})

        # ---------------- الأجهزة والمشتركون ----------------
        if name == "devices":
            need("devices")
            out = []
            for d in DB["devices"].values():
                x = {k: v for k, v in d.items() if k not in ("users",)}
                if x.get("license"):
                    x["license"] = {k: v for k, v in x["license"].items() if k != "token"}
                x["status"] = license_status(d.get("license"))
                x["openTickets"] = sum(1 for t in DB["tickets"] if t["deviceId"] == d["deviceId"] and t["status"] == "open")
                out.append(x)
            return self.send_json(200, {"ok": True, "items": sorted(out, key=lambda x: x.get("lastSeen", ""), reverse=True), "plans": {k: v[0] for k, v in PLANS.items()}})
        if name == "device":
            need("devices")
            d = DB["devices"].get(q.get("id", ""))
            if not d:
                return self.send_json(404, {"ok": False, "error": "الجهاز غير موجود"})
            x = json.loads(json.dumps(d))
            x["status"] = license_status(d.get("license"))
            x["tickets"] = [{k: t[k] for k in ("id", "subject", "status", "updated")} for t in DB["tickets"] if t["deviceId"] == d["deviceId"]]
            x["errors"] = [e for e in DB["errors"] if e["deviceId"] == d["deviceId"]][-30:]
            x["backups"] = self.backups_of(d["deviceId"])
            x["activity"] = sorted({e["t"][:10] for e in DB["events"] if e["d"] == d["deviceId"]})[-60:]
            if not u["owner"] and "licenses" not in u["perms"] and x.get("license"):
                x["license"].pop("token", None)
            return self.send_json(200, {"ok": True, "item": x})
        if name == "device/license":
            need("licenses")
            with lock:
                d = DB["devices"].get(b.get("deviceId", ""))
                if not d:
                    return self.send_json(404, {"ok": False, "error": "الجهاز غير موجود"})
                plan = b.get("plan")
                if plan not in PLANS:
                    raise ValueError("باقة غير صحيحة")
                start = b.get("start") or None
                if b.get("extend") and d.get("license") and d["license"].get("end") and plan not in ("lifetime", "revoked"):
                    cur_end = datetime.datetime.fromisoformat(d["license"]["end"])
                    if cur_end > datetime.datetime.now(datetime.timezone.utc):
                        start = cur_end.isoformat()
                d["license"] = issue_license(d["serial"], plan, b.get("days"), start, (d.get("company") or {}).get("name", ""), clean(b.get("note"), 300))
                d.setdefault("licenseHistory", []).append({k: v for k, v in d["license"].items() if k != "token"} | {"by": u["name"]})
                d.pop("accLicVer", None)
                record_sale(u, b, "device", d.get("serial", ""), (d.get("company") or {}).get("name") or d.get("computer", ""), plan, d["license"]["label"])
                audit(u, "تفعيل اشتراك" if plan != "revoked" else "إيقاف اشتراك", f"{d.get('serial')} — {d['license']['label']}")
                save()
            return self.send_json(200, {"ok": True, "license": d["license"]})
        if name == "device/update":
            need("devices")
            with lock:
                d = DB["devices"].get(b.get("deviceId", ""))
                if not d:
                    return self.send_json(404, {"ok": False})
                if "notes" in b:
                    d["notes"] = clean(b["notes"], 2000)
                if "blocked" in b:
                    need("licenses")
                    d["blocked"] = bool(b["blocked"])
                    audit(u, "حظر جهاز" if d["blocked"] else "إلغاء حظر جهاز", d.get("serial", ""))
                save()
            return self.send_json(200, {"ok": True})
        if name == "device/delete":
            if not u["owner"]:
                raise PermissionError("حذف الأجهزة للمالك فقط")
            with lock:
                d = DB["devices"].pop(b.get("deviceId", ""), None)
                audit(u, "حذف جهاز", (d or {}).get("serial", ""))
                save()
            return self.send_json(200, {"ok": True})
        if name == "license/code":
            need("licenses")
            serial = clean(b.get("serial"), 40).strip().upper()
            if not re.fullmatch(r"RWJ-[A-Z2-7]{4}-[A-Z2-7]{4}-[A-Z2-7]{4}-[A-Z2-7]{4}", serial):
                raise ValueError("الرقم التسلسلي غير صحيح (مثال: RWJ-ABCD-EFGH-IJKL-MNOP)")
            with lock:
                licrec = issue_license(serial, b.get("plan", "monthly"), b.get("days"), b.get("start") or None, clean(b.get("customer"), 80), clean(b.get("note"), 300))
                d = device_by_serial(serial)
                if d:
                    d["license"] = licrec
                    d.setdefault("licenseHistory", []).append({k: v for k, v in licrec.items() if k != "token"} | {"by": u["name"], "code": True})
                else:
                    DB["manualLicenses"] = [m for m in DB["manualLicenses"] if m["serial"] != serial] + [{"serial": serial, "license": licrec, "customer": clean(b.get("customer"), 80), "by": u["name"], "created": now_iso()}]
                record_sale(u, b, "code", serial, clean(b.get("customer"), 80) or ((d or {}).get("company") or {}).get("name", ""), licrec["plan"], licrec["label"])
                audit(u, "إصدار رمز تفعيل", f"{serial} — {licrec['label']}")
                save()
            return self.send_json(200, {"ok": True, "license": licrec})

        # ---------------- إدارة الأجهزة عن بعد: كلمات المرور وإعداد النشاط ----------------
        if name == "device/push-password":
            need("accounts")
            pw = clean(b.get("password"), 200)
            if len(pw) < 6:
                raise ValueError("كلمة المرور 6 أحرف على الأقل")
            with lock:
                d = DB["devices"].get(b.get("deviceId", ""))
                if not d:
                    return self.send_json(404, {"ok": False, "error": "الجهاز غير موجود"})
                username = clean(b.get("username"), 80)
                h, salt = js_hash(pw)
                push(d, {"type": "password", "username": username, "passHash": h, "salt": salt})
                acc = next((a for a in DB["accounts"] if d["deviceId"] in a.get("devices", []) and a["phone"] == username), None)
                if acc:
                    acc["passHash"], acc["salt"] = hash_pw(pw)
                    acc["passEnc"] = seal(pw)
                audit(u, "تغيير كلمة مرور مستخدم في نظام عميل", f"{d.get('serial')} — {username}")
                save()
            return self.send_json(200, {"ok": True})
        if name == "device/settings":
            need("accounts")
            with lock:
                d = DB["devices"].get(b.get("deviceId", ""))
                if not d:
                    return self.send_json(404, {"ok": False, "error": "الجهاز غير موجود"})
                data = {k: b["settings"][k] for k in BIZ_KEYS if k in (b.get("settings") or {})}
                if not str(data.get("company", "")).strip():
                    raise ValueError("اسم المنشأة مطلوب")
                push(d, {"type": "settings", "data": data})
                audit(u, "إعداد نشاط تجاري لعميل", f"{d.get('serial')} — {data.get('company')}")
                save()
            return self.send_json(200, {"ok": True})

        # ---------------- حسابات العملاء ----------------
        if name == "accounts":
            need("accounts")
            return self.send_json(200, {"ok": True, "items": [acc_public(a, u["owner"]) for a in sorted(DB["accounts"], key=lambda a: a["created"], reverse=True)],
                                        "prices": DB["prices"], "bizKeys": BIZ_KEYS})
        if name == "account/password":
            if not u["owner"]:
                raise PermissionError("عرض كلمات المرور للمالك فقط")
            a = next((x for x in DB["accounts"] if x["id"] == q.get("id")), None)
            if not a:
                return self.send_json(404, {"ok": False})
            with lock:
                audit(u, "عرض كلمة مرور حساب عميل", a["phone"])
                save()
            return self.send_json(200, {"ok": True, "password": unseal(a.get("passEnc", ""))})
        if name == "account/save":
            need("accounts")
            with lock:
                aid = b.get("id")
                a = next((x for x in DB["accounts"] if x["id"] == aid), None) if aid else None
                phone = norm_phone(b.get("phone"))
                if not clean(b.get("name")).strip():
                    raise ValueError("اسم العميل مطلوب")
                if not re.fullmatch(r"\d{9,15}", phone):
                    raise ValueError("رقم الجوال غير صحيح")
                if any(x["phone"] == phone and x["id"] != aid for x in DB["accounts"]):
                    raise ValueError("رقم الجوال مسجل لحساب آخر")
                pw = clean(b.get("password"), 200)
                if (not a or pw) and len(pw) < 6:
                    raise ValueError("كلمة المرور 6 أحرف على الأقل")
                data = {"name": clean(b.get("name"), 120).strip(), "phone": phone, "email": clean(b.get("email"), 120).strip(),
                        "maxDevices": max(1, min(50, int(b.get("maxDevices") or 1))), "active": bool(b.get("active", True)), "notes": clean(b.get("notes"), 1000)}
                if a:
                    old_phone = a["phone"]
                    a.update(data)
                    target = a
                else:
                    target = {"id": uid("acc"), "created": now_iso(), "devices": [], "license": None, "licVer": 0, "settings": None, "settingsVer": 0, "lastLogin": None, **data}
                    DB["accounts"].append(target)
                    old_phone = phone
                if pw:
                    target["passHash"], target["salt"] = hash_pw(pw)
                    target["passEnc"] = seal(pw)
                    for did in target.get("devices", []):  # تحديث كلمة المرور في أجهزة العميل
                        if did in DB["devices"]:
                            h, salt = js_hash(pw)
                            push(DB["devices"][did], {"type": "password", "username": old_phone, "passHash": h, "salt": salt, "newUsername": phone})
                plan = b.get("plan")
                if not a and plan and plan in PLANS and plan != "revoked":
                    self.set_account_license(u, target, b)
                audit(u, "تعديل حساب عميل" if a else "إضافة حساب عميل", f"{target['name']} — {phone}")
                save()
            return self.send_json(200, {"ok": True, "id": target["id"]})
        if name == "account/license":
            need("licenses")
            with lock:
                a = next((x for x in DB["accounts"] if x["id"] == b.get("id")), None)
                if not a:
                    return self.send_json(404, {"ok": False})
                if b.get("plan") not in PLANS:
                    raise ValueError("باقة غير صحيحة")
                self.set_account_license(u, a, b)
                save()
            return self.send_json(200, {"ok": True, "license": a["license"]})
        if name == "account/settings":
            need("accounts")
            with lock:
                a = next((x for x in DB["accounts"] if x["id"] == b.get("id")), None)
                if not a:
                    return self.send_json(404, {"ok": False})
                data = {k: b["settings"][k] for k in BIZ_KEYS if k in (b.get("settings") or {})}
                if not str(data.get("company", "")).strip():
                    raise ValueError("اسم المنشأة مطلوب")
                a["settings"], a["settingsVer"] = data, a.get("settingsVer", 0) + 1
                for did in a.get("devices", []):
                    if did in DB["devices"]:
                        push(DB["devices"][did], {"type": "settings", "data": data})
                        DB["devices"][did]["accSettingsApplied"] = a["settingsVer"]
                audit(u, "إعداد نشاط تجاري لحساب عميل", f"{a['phone']} — {data.get('company')}")
                save()
            return self.send_json(200, {"ok": True})
        if name == "account/unbind":
            need("accounts")
            with lock:
                a = next((x for x in DB["accounts"] if x["id"] == b.get("id")), None)
                if a:
                    a["devices"] = [d for d in a.get("devices", []) if d != b.get("deviceId")]
                    audit(u, "فك ربط جهاز من حساب", a["phone"])
                save()
            return self.send_json(200, {"ok": True})
        if name == "account/delete":
            if not u["owner"]:
                raise PermissionError("حذف الحسابات للمالك فقط")
            with lock:
                a = next((x for x in DB["accounts"] if x["id"] == b.get("id")), None)
                DB["accounts"] = [x for x in DB["accounts"] if x["id"] != b.get("id")]
                audit(u, "حذف حساب عميل", (a or {}).get("phone", ""))
                save()
            return self.send_json(200, {"ok": True})

        # ---------------- الأسعار والمبيعات ----------------
        if name == "sales":
            need("sales")
            return self.send_json(200, {"ok": True, "items": sorted(DB["sales"], key=lambda x: x["time"], reverse=True), "prices": DB["prices"]})
        if name == "sale/save":
            need("sales")
            with lock:
                x = next((s_ for s_ in DB["sales"] if s_["id"] == b.get("id")), None)
                if not x:
                    x = {"id": uid("sale"), "time": b.get("time") or now_iso(), "kind": "manual", "by": u["name"]}
                    DB["sales"].append(x)
                for k in ("customer", "ref", "label", "method", "note"):
                    if k in b:
                        x[k] = clean(b[k], 300)
                if "plan" in b:
                    x["plan"] = b["plan"] if b["plan"] in PLANS else "custom"
                    x.setdefault("label", PLANS[x["plan"]][0])
                if "amount" in b:
                    x["amount"] = round(float(b["amount"] or 0), 2)
                if "paid" in b:
                    x["paid"] = bool(b["paid"])
                audit(u, "تعديل عملية بيع اشتراك", f"{x.get('customer')} — {x.get('amount')}")
                save()
            return self.send_json(200, {"ok": True})
        if name == "sale/delete":
            need("sales")
            with lock:
                DB["sales"] = [x for x in DB["sales"] if x["id"] != b.get("id")]
                audit(u, "حذف عملية بيع اشتراك")
                save()
            return self.send_json(200, {"ok": True})
        if name == "prices/save":
            need("sales")
            with lock:
                for k in ("monthly", "quarterly", "yearly", "lifetime"):
                    if k in b:
                        DB["prices"][k] = max(0, round(float(b[k] or 0), 2))
                if b.get("currency"):
                    DB["prices"]["currency"] = clean(b["currency"], 10)
                audit(u, "تعديل أسعار الاشتراكات", json.dumps({k: DB["prices"][k] for k in ("monthly", "quarterly", "yearly", "lifetime")}))
                save()
            return self.send_json(200, {"ok": True})

        # ---------------- الموقع والزوار ----------------
        if name == "site":
            need("site")
            days = max(1, min(365, int(q.get("days", 30))))
            return self.send_json(200, {"ok": True, "config": DB["site"], "stats": an.stats(DB, days, DB["requests"])})
        if name == "site/visits":
            need("site")
            now = datetime.datetime.now(datetime.timezone.utc)
            days = max(1, min(365, int(q.get("days", 30))))
            fl = q.get("f", "")
            out = []
            for v in reversed(DB.get("visits", [])):
                if (now - datetime.datetime.fromisoformat(v["start"])).total_seconds() > days * 86400:
                    break
                names = {e["name"] for e in v["events"]}
                if fl == "live" and (now - datetime.datetime.fromisoformat(v["last"])).total_seconds() > 90:
                    continue
                if fl == "signup" and "signup_sent" not in names:
                    continue
                if fl == "download" and "download" not in names:
                    continue
                out.append({k: v.get(k) for k in ("sid", "vid", "start", "last", "ip", "device", "browser", "os", "lang", "tz", "screen", "source", "ref", "country", "city", "region", "returning", "sections", "events")}
                           | {"duration": an.duration(v)})
                if len(out) >= 500:
                    break
            return self.send_json(200, {"ok": True, "items": out})
        if name == "site/save":
            need("site")
            with lock:
                S = DB["site"]
                for k in ("maintenance", "announcement", "hero", "sections"):
                    if isinstance(b.get(k), dict):
                        for kk, vv in b[k].items():
                            if kk in S[k]:
                                S[k][kk] = bool(vv) if isinstance(S[k][kk], bool) else clean(vv, 1000)
                for k in ("downloadUrl", "version", "fileSize", "whatsapp", "email"):
                    if k in b:
                        S[k] = clean(b[k], 600).strip()
                audit(u, "تعديل إعدادات الموقع", ("صيانة الموقع مفعّلة" if S["maintenance"]["on"] else ""))
                save()
            return self.send_json(200, {"ok": True})
        if name == "site/clear-visits":
            if not u["owner"]:
                raise PermissionError("للمالك فقط")
            with lock:
                DB["visits"] = []
                audit(u, "مسح سجل الزوار")
                save()
            return self.send_json(200, {"ok": True})

        # ---------------- الصيانة والإعلانات للنظام ----------------
        if name == "system":
            need("system")
            return self.send_json(200, {"ok": True, "system": DB["system"], "site": {"maintenance": DB["site"]["maintenance"], "announcement": DB["site"]["announcement"]}})
        if name == "system/save":
            need("system")
            with lock:
                Y = DB["system"]
                for k in ("maintenance", "announcement"):
                    if isinstance(b.get(k), dict):
                        for kk, vv in b[k].items():
                            if kk in Y[k] and kk != "id":
                                Y[k][kk] = bool(vv) if isinstance(Y[k][kk], bool) else clean(vv, 1000)
                if isinstance(b.get("announcement"), dict):
                    Y["announcement"]["id"] = uid("ann")  # إعلان جديد يظهر حتى لمن أغلق السابق
                audit(u, "تعديل الصيانة والإعلانات", ("صيانة النظام مفعّلة" if Y["maintenance"]["on"] else "صيانة النظام متوقفة"))
                save()
            return self.send_json(200, {"ok": True})
        if name == "device/logout":
            need("licenses")
            with lock:
                d = DB["devices"].get(b.get("deviceId", ""))
                if not d:
                    return self.send_json(404, {"ok": False})
                push(d, {"type": "logout"})
                audit(u, "تسجيل خروج جهاز عن بعد", d.get("serial", ""))
                save()
            return self.send_json(200, {"ok": True})

        # ---------------- الباقات وأكواد الخصم ----------------
        if name == "plans":
            need("sales")
            return self.send_json(200, {"ok": True, "plans": sorted(DB["plans"], key=lambda x: x.get("order", 0)), "coupons": DB["coupons"], "currency": DB["prices"].get("currency", "ر.س")})
        if name == "plans/save":
            need("sales")
            with lock:
                x = next((p_ for p_ in DB["plans"] if p_["id"] == b.get("id")), None)
                typ = b.get("type") if b.get("type") in ("monthly", "quarterly", "yearly", "lifetime", "custom") else "custom"
                if not clean(b.get("name")).strip():
                    raise ValueError("اسم الباقة مطلوب")
                data = {"name": clean(b.get("name"), 80).strip(), "type": typ, "days": None if typ == "lifetime" else max(1, int(b.get("days") or {"monthly": 30, "quarterly": 90, "yearly": 365}.get(typ, 30))),
                        "price": max(0.0, round(float(b.get("price") or 0), 2)), "features": [clean(f, 120).strip() for f in (b.get("features") or []) if str(f).strip()][:15],
                        "highlight": bool(b.get("highlight")), "active": bool(b.get("active", True)), "order": int(b.get("order") or 0)}
                if x:
                    x.update(data)
                else:
                    DB["plans"].append({"id": uid("pl"), **data})
                if typ in DB["prices"] and data["active"]:
                    DB["prices"][typ] = data["price"]
                audit(u, "تعديل باقة" if x else "إضافة باقة", f"{data['name']} — {data['price']}")
                save()
            return self.send_json(200, {"ok": True})
        if name == "plans/delete":
            need("sales")
            with lock:
                DB["plans"] = [x for x in DB["plans"] if x["id"] != b.get("id")]
                audit(u, "حذف باقة")
                save()
            return self.send_json(200, {"ok": True})
        if name == "coupons/save":
            need("sales")
            with lock:
                code = re.sub(r"[^A-Z0-9_-]", "", clean(b.get("code"), 40).upper())
                if len(code) < 3:
                    raise ValueError("كود الخصم 3 أحرف/أرقام إنجليزية على الأقل")
                if any(c["code"] == code and c["id"] != b.get("id") for c in DB["coupons"]):
                    raise ValueError("الكود موجود مسبقاً")
                kind = "amount" if b.get("kind") == "amount" else "percent"
                value = float(b.get("value") or 0)
                if value <= 0 or (kind == "percent" and value > 100):
                    raise ValueError("قيمة الخصم غير صحيحة")
                data = {"code": code, "kind": kind, "value": value, "maxUses": max(0, int(b.get("maxUses") or 0)), "expires": clean(b.get("expires"), 10),
                        "plans": [x for x in (b.get("plans") or []) if isinstance(x, str)], "active": bool(b.get("active", True)), "note": clean(b.get("note"), 200)}
                x = next((c for c in DB["coupons"] if c["id"] == b.get("id")), None)
                if x:
                    x.update(data)
                else:
                    DB["coupons"].append({"id": uid("cpn"), "used": 0, "created": now_iso(), **data})
                audit(u, "حفظ كود خصم", code)
                save()
            return self.send_json(200, {"ok": True})
        if name == "coupons/delete":
            need("sales")
            with lock:
                DB["coupons"] = [x for x in DB["coupons"] if x["id"] != b.get("id")]
                save()
            return self.send_json(200, {"ok": True})

        # ---------------- طلبات فتح الحسابات ----------------
        if name == "requests":
            need("requests")
            return self.send_json(200, {"ok": True, "items": sorted(DB["requests"], key=lambda r: r["created"], reverse=True), "sections": DB["settings"]["waSections"]})
        if name == "request/wa":
            need("requests")
            r = next((x for x in DB["requests"] if x["id"] == b.get("id")), None)
            if not r:
                return self.send_json(404, {"ok": False})
            text = wa_message(r, b.get("keys"))
            with lock:
                if r["status"] == "new":
                    r["status"] = "contacted"
                r["history"].append({"time": now_iso(), "by": u["name"], "action": "تواصل عبر واتساب"})
                save()
            phone = norm_phone(r["customer"]["mobile"])
            intl = ("966" + phone[1:]) if phone.startswith("0") else phone
            return self.send_json(200, {"ok": True, "text": text, "url": f"https://wa.me/{intl}?text={urllib.parse.quote(text)}"})
        if name == "request/update":
            need("requests")
            with lock:
                r = next((x for x in DB["requests"] if x["id"] == b.get("id")), None)
                if not r:
                    return self.send_json(404, {"ok": False})
                if b.get("status") in ("new", "contacted", "accepted", "rejected"):
                    r["status"] = b["status"]
                    r["history"].append({"time": now_iso(), "by": u["name"], "action": {"new": "إعادة فتح", "contacted": "تم التواصل", "accepted": "مقبول", "rejected": "مرفوض"}[b["status"]] + (" — " + clean(b.get("reason"), 200) if b.get("reason") else "")})
                if "notes" in b:
                    r["notes"] = clean(b["notes"], 2000)
                save()
            return self.send_json(200, {"ok": True})
        if name == "request/accept":
            need("requests")
            need("licenses")
            with lock:
                r = next((x for x in DB["requests"] if x["id"] == b.get("id")), None)
                if not r:
                    return self.send_json(404, {"ok": False})
                cu = r["customer"]
                phone = norm_phone(cu["mobile"])
                pw = clean(b.get("password"), 200)
                if len(pw) < 6:
                    raise ValueError("كلمة المرور 6 أحرف على الأقل")
                if any(x["phone"] == phone for x in DB["accounts"]):
                    raise ValueError("رقم الجوال مسجل لحساب موجود — افتح الحساب من «حسابات العملاء»")
                plan = next((x for x in DB["plans"] if x["id"] == (b.get("planId") or r["planId"])), None)
                if not plan:
                    raise ValueError("الباقة غير موجودة")
                price = float(b.get("price") if b.get("price") not in (None, "") else r["final"])
                acc = {"id": uid("acc"), "created": now_iso(), "devices": [], "license": None, "licVer": 0, "settings": None, "settingsVer": 0, "lastLogin": None,
                       "name": cu.get("company") or cu.get("ownerName"), "phone": phone, "email": cu.get("email", ""), "maxDevices": max(1, int(b.get("maxDevices") or 1)),
                       "active": True, "notes": "من طلب فتح حساب " + r["id"], "requestId": r["id"]}
                acc["passHash"], acc["salt"] = hash_pw(pw)
                acc["passEnc"] = seal(pw)
                biz = {"company": cu.get("company"), "companyEn": cu.get("companyEn"), "legalName": cu.get("legalName"), "activity": cu.get("activity"), "ownerName": cu.get("ownerName"),
                       "mobile": phone, "email": cu.get("email"), "city": cu.get("city"), "district": cu.get("district"), "street": cu.get("street"), "buildingNo": cu.get("buildingNo"),
                       "postalCode": cu.get("postalCode"), "address": cu.get("address"), "vatNumber": cu.get("vatNumber"), "crNumber": cu.get("crNumber"),
                       "currency": DB["prices"].get("currency", "ر.س"), "vatRate": 15, "vatEnabled": True, "pricesIncludeVat": True}
                acc["settings"] = {k: v for k, v in biz.items() if v not in (None, "")}
                acc["settingsVer"] = 1
                DB["accounts"].append(acc)
                self.set_account_license(u, acc, {"plan": plan["type"] if plan["type"] in PLANS else "custom", "days": plan.get("days"), "price": price,
                                                  "method": clean(b.get("method"), 40) or cu.get("payMethod") or "تحويل بنكي", "paid": bool(b.get("paid", True)), "note": "طلب " + r["planName"]})
                acc["license"]["label"] = plan["name"]
                if r.get("coupon"):
                    c = next((x for x in DB["coupons"] if x["code"] == r["coupon"]), None)
                    if c:
                        c["used"] = int(c.get("used", 0)) + 1
                r.update(status="accepted", accountId=acc["id"])
                r["history"].append({"time": now_iso(), "by": u["name"], "action": "قبول الطلب وإنشاء الحساب"})
                audit(u, "قبول طلب فتح حساب", f"{acc['name']} — {phone}")
                save()
            contract = None
            err = None
            try:
                contract = make_contract(acc, u["name"], {"planName": plan["name"], "price": price, "listPrice": r["price"], "discount": round(r["price"] - price, 2) if price < r["price"] else 0,
                                                          "coupon": r.get("coupon"), "method": clean(b.get("method"), 40) or cu.get("payMethod") or "تحويل بنكي", "features": plan.get("features")})
                save()
            except Exception as ex:
                err = str(ex)
            return self.send_json(200, {"ok": True, "accountId": acc["id"], "contract": contract, "contractError": err, "waText": self.welcome_text(acc, pw, plan["name"])})
        if name == "contract/create":
            need("accounts")
            with lock:
                acc = next((a for a in DB["accounts"] if a["id"] == b.get("accountId")), None)
                if not acc:
                    return self.send_json(404, {"ok": False})
                if not acc.get("license"):
                    raise ValueError("فعّل اشتراك الحساب أولاً")
                extra = {}
                req = next((x for x in DB["requests"] if x["id"] == acc.get("requestId")), None)
                if req:  # عقد مُعاد إنشاؤه لحساب من طلب: نفس تفاصيل الخصم والدفع
                    pl = next((x for x in DB["plans"] if x["id"] == req["planId"]), {})
                    extra = {"planName": req["planName"], "listPrice": req["price"], "price": req["final"], "discount": req["discount"], "coupon": req["coupon"],
                             "method": req["customer"].get("payMethod") or "تحويل بنكي", "features": pl.get("features")}
                if b.get("price") not in (None, ""):
                    extra["price"] = float(b["price"])
                if b.get("method"):
                    extra["method"] = clean(b["method"], 40)
                rec = make_contract(acc, u["name"], extra)
                audit(u, "إنشاء عقد اشتراك", f"{acc['phone']} — {rec['no']}")
                save()
            return self.send_json(200, {"ok": True, "contract": rec, "waText": self.welcome_text(acc, unseal(acc.get("passEnc", "")), rec["plan"])})
        if name == "contract/file":
            need("accounts")
            acc = next((a for a in DB["accounts"] if a["id"] == q.get("account")), None)
            rec = next((x for x in (acc or {}).get("contracts", []) if x["id"] == q.get("id")), None)
            if not rec:
                return self.send_json(404, {"ok": False})
            return self.send_file(os.path.join(CONTRACTS, acc["id"], rec["file"]), rec["file"], "application/pdf", inline=q.get("view") == "1")
        if name == "messages":
            need("settings")
            return self.send_json(200, {"ok": True, "sections": DB["settings"]["waSections"], "payMethods": DB["settings"]["payMethods"], "bankInfo": DB["settings"]["bankInfo"],
                                        "contract": {**ct.DEFAULT_CONTRACT, **DB["settings"]["contract"]}})
        if name == "messages/save":
            need("settings")
            with lock:
                if isinstance(b.get("sections"), list):
                    keys = {x["key"] for x in DEFAULT_WA_SECTIONS}
                    DB["settings"]["waSections"] = [{"key": x["key"], "title": clean(x.get("title"), 60), "on": bool(x.get("on")), "text": clean(x.get("text"), 3000)}
                                                    for x in b["sections"] if x.get("key") in keys]
                if b.get("resetSections"):
                    DB["settings"]["waSections"] = json.loads(json.dumps(DEFAULT_WA_SECTIONS))
                if isinstance(b.get("payMethods"), list):
                    DB["settings"]["payMethods"] = [clean(x, 60).strip() for x in b["payMethods"] if str(x).strip()][:10]
                if "bankInfo" in b:
                    DB["settings"]["bankInfo"] = clean(b["bankInfo"], 600)
                if isinstance(b.get("contract"), dict):
                    for k in ct.DEFAULT_CONTRACT:
                        if k in b["contract"]:
                            v = b["contract"][k]
                            DB["settings"]["contract"][k] = v[:400000] if k in ("signature", "stamp") and isinstance(v, str) and v.startswith("data:image/") else clean(v, 3000)
                audit(u, "تعديل رسائل العملاء والعقد")
                save()
            return self.send_json(200, {"ok": True})
        if name == "contract/preview":
            need("settings")
            acc = {"id": "preview", "name": "مؤسسة تجريبية", "phone": "0500000000", "maxDevices": 1, "passEnc": seal("Example@123"),
                   "license": {"plan": "yearly", "label": "الباقة السنوية", "start": now_iso(), "end": (datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(days=365)).isoformat(timespec="seconds")},
                   "settings": {"company": "مؤسسة تجريبية", "ownerName": "اسم العميل", "city": "الرياض"}}
            with lock:
                rec = make_contract(acc, u["name"], {"price": 899, "planName": "الباقة السنوية"})
                acc_dir = os.path.join(CONTRACTS, "preview")
                DB["contractsLog"].pop()
                save()
            return self.send_file(os.path.join(acc_dir, rec["file"]), "معاينة-العقد.pdf", "application/pdf", inline=True)

        # ---------------- النسخ الاحتياطي للوحة ----------------
        # ---------------- قاعدة البيانات السحابية MongoDB ----------------
        if name == "mongo":
            need("settings")
            cfg = MONGO.load_cfg()
            st = dict(MONGO.state)
            return self.send_json(200, {"ok": True, "installed": mongo_store.pymongo is not None, "uri": MONGO.mask(MONGO.uri()), "hasUri": bool(cfg.get("uri")),
                                        "db": cfg.get("db") or "rawaj", "state": st, "loadedFrom": MONGO_INFO["loadedFrom"],
                                        "lastSync": datetime.datetime.fromtimestamp(st["lastSync"], datetime.timezone.utc).isoformat(timespec="seconds") if st.get("lastSync") else None,
                                        "counts": MONGO.counts()})
        if name == "mongo/test":
            need("settings")
            uri = clean(b.get("uri"), 1000).strip() or MONGO.uri()
            return self.send_json(200, mongo_store.MongoSync.test(uri, clean(b.get("db"), 60).strip() or "rawaj"))
        if name == "mongo/save":
            need("settings")
            uri = clean(b.get("uri"), 1000).strip()
            db_name = re.sub(r"[^A-Za-z0-9_-]", "", clean(b.get("db"), 60)) or "rawaj"
            if uri:
                t = mongo_store.MongoSync.test(uri, db_name)
                if not t["ok"]:
                    raise ValueError(t["error"])
            elif not MONGO.uri():
                raise ValueError("الصق رابط الاتصال أولاً")
            MONGO.save_cfg(uri=uri or None, db_name=db_name, enabled=True)
            if not MONGO.connect():
                raise ValueError(MONGO.state["lastError"] or "تعذر الاتصال")
            with lock:
                audit(u, "ربط MongoDB", MONGO.state.get("host", ""))
            if MONGO.has_data():
                return self.send_json(200, {"ok": True, "needsChoice": True})  # المالك يختار: رفع المحلية أو استخدام السحابية
            r = MONGO.sync_now(full=True)
            MONGO_INFO["loadedFrom"] = "mongo"
            return self.send_json(200, {"ok": r["ok"], "migrated": r.get("written", 0), "error": r.get("error")})
        if name == "mongo/push":
            need("settings")
            with lock:
                audit(u, "رفع بيانات اللوحة إلى MongoDB (استبدال)")
            r = MONGO.sync_now(full=True)
            return self.send_json(200 if r["ok"] else 400, r)
        if name == "mongo/pull":
            need("settings")
            if not (MONGO.state["connected"] or MONGO.connect()):
                raise ValueError("تعذر الاتصال بـ MongoDB")
            panel_backup("before-mongo-pull")
            data = MONGO.from_db()
            if not data.get("owner"):
                raise ValueError("لا توجد بيانات لوحة في قاعدة MongoDB هذه")
            with lock:
                DB.clear()
                DB.update(data)
                MONGO.remember(DB)
                atomic_write(DB_FILE, json.dumps(DB, ensure_ascii=False).encode("utf-8"))
                MONGO_INFO["loadedFrom"] = "mongo"
            return self.send_json(200, {"ok": True, "relogin": True})
        if name == "mongo/disable":
            need("settings")
            MONGO.save_cfg(enabled=False)
            MONGO.connect()
            with lock:
                audit(u, "إيقاف ربط MongoDB")
                save()
            return self.send_json(200, {"ok": True})
        if name == "mongo/forget":
            need("settings")
            MONGO.save_cfg(uri="", enabled=False)
            MONGO.connect()
            with lock:
                audit(u, "حذف رابط MongoDB")
                save()
            return self.send_json(200, {"ok": True})

        if name == "panel-backup":
            need("settings")
            return self.send_json(200, {"ok": True, "config": DB["settings"]["backup"], "items": panel_backup_list(), "default": PANEL_BACKUPS})
        if name == "panel-backup/save":
            need("settings")
            folder = clean(b.get("dir"), 400).strip() or PANEL_BACKUPS
            if not os.path.isabs(folder):
                raise ValueError("اختر مساراً كاملاً للمجلد")
            os.makedirs(folder, exist_ok=True)
            with lock:
                DB["settings"]["backup"].update({"enabled": bool(b.get("enabled", True)), "dir": folder})
                audit(u, "تعديل النسخ الاحتياطي للوحة", folder)
                save()
            return self.send_json(200, {"ok": True})
        if name == "panel-backup/now":
            need("settings")
            r = panel_backup("manual")
            with lock:
                audit(u, "نسخة احتياطية للوحة", r["name"])
                save()
            return self.send_json(200, r)
        if name == "panel-backup/pick":
            need("settings")
            return self.send_json(200, {"ok": True, "path": pick_folder()})
        if name == "panel-backup/download":
            need("settings")
            n = os.path.basename(q.get("name", ""))
            folder = DB["settings"]["backup"].get("dir") or PANEL_BACKUPS
            return self.send_file(os.path.join(folder, n), n, "application/zip")

        # ---------------- الدعم الفني ----------------
        if name == "tickets":
            need("tickets")
            items = [{k: t[k] for k in t if k != "messages"} | {"last": t["messages"][-1]["text"][:140] if t["messages"] else "", "count": len(t["messages"])} for t in DB["tickets"]]
            return self.send_json(200, {"ok": True, "items": sorted(items, key=lambda t: t["updated"], reverse=True)})
        if name == "ticket":
            need("tickets")
            t = next((x for x in DB["tickets"] if x["id"] == q.get("id")), None)
            if not t:
                return self.send_json(404, {"ok": False})
            if t.get("unread"):
                t["unread"] = False
                save()
            dev = DB["devices"].get(t["deviceId"], {})
            return self.send_json(200, {"ok": True, "item": t, "device": {k: dev.get(k) for k in ("serial", "subscriptionNo", "company", "computer", "lastSeen")} | {"status": license_status(dev.get("license"))}})
        if name == "ticket/reply":
            need("tickets")
            with lock:
                t = next((x for x in DB["tickets"] if x["id"] == b.get("id")), None)
                if not t:
                    return self.send_json(404, {"ok": False})
                if clean(b.get("text")).strip():
                    t["messages"].append({"id": uid("m"), "from": "admin", "name": u["name"], "text": clean(b.get("text"), 8000), "images": [], "time": now_iso()})
                t["status"] = b.get("status") or "answered"
                t["updated"] = now_iso()
                audit(u, "رد على تذكرة", t["subject"])
                save()
            return self.send_json(200, {"ok": True})
        if name == "file":
            n = os.path.basename(q.get("name", ""))
            ext = n.rsplit(".", 1)[-1].lower()
            return self.send_file(os.path.join(UPLOADS, n), n, {"png": "image/png", "jpg": "image/jpeg", "webp": "image/webp", "gif": "image/gif"}.get(ext, "application/octet-stream"), inline=True)

        # ---------------- الأعطال ----------------
        if name == "errors":
            need("errors")
            return self.send_json(200, {"ok": True, "items": sorted(DB["errors"], key=lambda e: e["received"], reverse=True)[:2000]})
        if name == "errors/resolve":
            need("errors")
            with lock:
                ids = set(b.get("ids") or [])
                for e in DB["errors"]:
                    if e["id"] in ids or b.get("all"):
                        e["resolved"] = True
                save()
            return self.send_json(200, {"ok": True})
        if name == "errors/clear":
            need("errors")
            with lock:
                DB["errors"] = [e for e in DB["errors"] if not e["resolved"]]
                audit(u, "حذف الأعطال المعالجة")
                save()
            return self.send_json(200, {"ok": True})

        # ---------------- الإشعارات ----------------
        if name == "notifications":
            need("notifications")
            return self.send_json(200, {"ok": True, "items": sorted(DB["notifications"], key=lambda n: n["created"], reverse=True)})
        if name == "notifications/send":
            need("notifications")
            title = clean(b.get("title"), 200).strip()
            if not title:
                raise ValueError("اكتب عنوان الإشعار")
            targets = b.get("targets") or ["all"]
            with lock:
                for tg in targets[:500]:
                    DB["notifications"].append({"id": uid("ntf"), "target": tg if tg == "all" or tg in DB["devices"] else "all", "title": title,
                                                "body": clean(b.get("body"), 4000), "level": clean(b.get("level") or "info", 20), "created": now_iso(), "by": u["name"]})
                audit(u, "إرسال إشعار", f"{title} ← {'الجميع' if targets == ['all'] else str(len(targets)) + ' جهاز'}")
                save()
            return self.send_json(200, {"ok": True})
        if name == "notifications/delete":
            need("notifications")
            with lock:
                DB["notifications"] = [n for n in DB["notifications"] if n["id"] != b.get("id")]
                save()
            return self.send_json(200, {"ok": True})

        # ---------------- التحديثات ----------------
        if name == "updates":
            need("updates")
            return self.send_json(200, {"ok": True, "items": sorted(DB["updates"], key=lambda x: x["created"], reverse=True)})
        if name == "updates/upload":
            need("updates")
            version = clean(b.get("version"), 30).strip()
            if not re.fullmatch(r"\d+(\.\d+){1,3}", version):
                raise ValueError("رقم الإصدار بصيغة 3.1.0")
            raw = base64.b64decode(b.get("data", "").split(",")[-1])
            if not raw:
                raise ValueError("اختر ملف التحديث")
            orig = os.path.basename(clean(b.get("fileName"), 120)) or f"rawaj-{version}.zip"
            fid = uid("upd")
            fname = fid + "_" + re.sub(r"[^A-Za-z0-9_.-]", "_", orig)
            with open(os.path.join(UPDATES, fname), "wb") as f:
                f.write(raw)
            MONGO.file_saved(os.path.join(UPDATES, fname))
            with lock:
                DB["updates"].append({"id": fid, "version": version, "notes": clean(b.get("notes"), 5000), "file": fname, "originalName": orig,
                                      "size": len(raw), "sha256": hashlib.sha256(raw).hexdigest(), "mandatory": bool(b.get("mandatory")),
                                      "created": now_iso(), "by": u["name"], "downloads": 0})
                audit(u, "رفع تحديث", version)
                save()
            return self.send_json(200, {"ok": True})
        if name == "updates/delete":
            need("updates")
            with lock:
                up = next((x for x in DB["updates"] if x["id"] == b.get("id")), None)
                if up:
                    DB["updates"].remove(up)
                    try:
                        os.remove(os.path.join(UPDATES, up["file"]))
                    except OSError:
                        pass
                    MONGO.file_removed(os.path.join(UPDATES, up["file"]))
                    audit(u, "حذف تحديث", up["version"])
                save()
            return self.send_json(200, {"ok": True})

        # ---------------- النسخ الاحتياطية ----------------
        if name == "backups":
            need("backups")
            out = []
            for did, d in DB["devices"].items():
                files = self.backups_of(did)
                if files:
                    out.append({"deviceId": did, "serial": d.get("serial"), "company": (d.get("company") or {}).get("name"), "latest": files[0], "count": len(files)})
            return self.send_json(200, {"ok": True, "items": sorted(out, key=lambda x: x["latest"]["time"], reverse=True)})
        if name == "backup/download":
            need("backups")
            did = re.sub(r"[^0-9A-F]", "", q.get("device", ""))
            n = os.path.basename(q.get("name", ""))
            path = os.path.join(BACKUPS, did, n)
            if q.get("raw") == "1":
                return self.send_file(path, n)
            with open(path, "rb") as f:
                data = gzip.decompress(f.read())
            with lock:
                audit(u, "تنزيل نسخة احتياطية لعميل", f"{(DB['devices'].get(did) or {}).get('serial')} — {n}")
                save()
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Content-Length", str(len(data)))
            self.send_header("Content-Disposition", f"attachment; filename*=UTF-8''{urllib.parse.quote(n.replace('.gz', ''))}")
            self.end_headers()
            self.wfile.write(data)
            return None

        # ---------------- الموظفون (للمالك فقط) ----------------
        if name == "staff":
            need("staff")
            return self.send_json(200, {"ok": True, "items": [{k: v for k, v in s.items() if k not in ("passHash", "salt")} for s in DB["staff"]], "perms": PERMS})
        if name == "staff/save":
            need("staff")
            with lock:
                sid = b.get("id")
                rec = next((x for x in DB["staff"] if x["id"] == sid), None) if sid else None
                username = clean(b.get("username"), 60).strip().lower()
                email = clean(b.get("email"), 120).strip().lower()
                if not clean(b.get("name")).strip() or not username:
                    raise ValueError("الاسم واسم الدخول مطلوبان")
                if username == DB["owner"]["email"].lower() or email == DB["owner"]["email"].lower():
                    raise ValueError("لا يمكن استخدام بريد المالك")
                if any(x["id"] != sid and (x.get("username") == username or (email and x.get("email") == email)) for x in DB["staff"]):
                    raise ValueError("اسم الدخول أو البريد مستخدم لموظف آخر")
                pw = clean(b.get("password"), 200)
                if (not rec or pw) and len(pw) < 8:
                    raise ValueError("كلمة المرور 8 أحرف على الأقل")
                data = {"name": clean(b.get("name"), 120).strip(), "username": username, "email": email,
                        "perms": [p for p in (b.get("perms") or []) if p in PERMS], "active": bool(b.get("active", True))}
                if pw:
                    data["passHash"], data["salt"] = hash_pw(pw)
                if rec:
                    rec.update(data)
                    if not rec["active"]:
                        for k in [k for k, v in SESSIONS.items() if v["uid"] == rec["id"]]:
                            SESSIONS.pop(k, None)
                else:
                    DB["staff"].append({"id": uid("stf"), "created": now_iso(), "lastLogin": None, **data})
                audit(u, "تعديل موظف" if rec else "إضافة موظف", username)
                save()
            return self.send_json(200, {"ok": True})
        if name == "staff/delete":
            need("staff")
            with lock:
                DB["staff"] = [x for x in DB["staff"] if x["id"] != b.get("id")]
                for k in [k for k, v in SESSIONS.items() if v["uid"] == b.get("id")]:
                    SESSIONS.pop(k, None)
                audit(u, "حذف موظف", b.get("id", ""))
                save()
            return self.send_json(200, {"ok": True})

        # ---------------- الإعدادات والحساب ----------------
        if name == "settings":
            need("settings")
            smtp = dict(DB["settings"].get("smtp", {}))
            smtp["password"] = "••••••••" if smtp.get("password") else ""
            return self.send_json(200, {"ok": True, "email": DB["owner"]["email"], "name": DB["owner"].get("name"), "smtp": smtp,
                                        "publicUrl": DB["settings"].get("publicUrl"), "keyFingerprint": hashlib.sha256((SIGNING_KEY["x"] + SIGNING_KEY["y"]).encode()).hexdigest()[:16]})
        if name == "settings/save":
            need("settings")
            with lock:
                smtp = DB["settings"].setdefault("smtp", {})
                for k in ("host", "port", "user", "from"):
                    if k in (b.get("smtp") or {}):
                        smtp[k] = clean(b["smtp"][k], 200)
                if (b.get("smtp") or {}).get("password") and b["smtp"]["password"] != "••••••••":
                    smtp["password"] = clean(b["smtp"]["password"], 200)
                if "publicUrl" in b:
                    DB["settings"]["publicUrl"] = clean(b["publicUrl"], 200)
                if b.get("name"):
                    DB["owner"]["name"] = clean(b["name"], 80)
                audit(u, "تعديل الإعدادات")
                save()
            return self.send_json(200, {"ok": True})
        if name == "settings/test-mail":
            need("settings")
            ok = send_mail(DB["owner"]["email"], "اختبار البريد — لوحة تحكم رواج", "تم إعداد البريد بنجاح ✓")
            return self.send_json(200 if ok else 400, {"ok": ok, "error": None if ok else "تعذر الإرسال — تحقق من البيانات (استخدم كلمة مرور التطبيقات من Google)"})
        if name == "account/password":
            rec = DB["owner"] if u["owner"] else next(x for x in DB["staff"] if x["id"] == u["id"])
            if not check_pw(rec, clean(b.get("current"), 200)):
                raise ValueError("كلمة المرور الحالية غير صحيحة")
            pw = clean(b.get("password"), 200)
            if len(pw) < 10:
                raise ValueError("كلمة المرور الجديدة 10 أحرف على الأقل")
            with lock:
                rec["passHash"], rec["salt"] = hash_pw(pw)
                audit(u, "تغيير كلمة المرور")
                save()
            return self.send_json(200, {"ok": True})
        if name == "account/email":
            need("settings")
            if not check_pw(DB["owner"], clean(b.get("current"), 200)):
                raise ValueError("كلمة المرور الحالية غير صحيحة")
            email = clean(b.get("email"), 120).strip().lower()
            if not re.fullmatch(r"[^@\s]+@[^@\s]+\.[^@\s]+", email):
                raise ValueError("البريد الإلكتروني غير صحيح")
            with lock:
                old = DB["owner"]["email"]
                DB["owner"]["email"] = email
                audit(u, "تغيير بريد المالك", f"{old} ← {email}")
                save()
            return self.send_json(200, {"ok": True})
        if name == "audit":
            need("audit")
            return self.send_json(200, {"ok": True, "items": DB["audit"][-3000:][::-1]})
        if name == "export":
            need("settings")
            data = json.dumps({k: v for k, v in DB.items() if k not in ("resetCodes",)}, ensure_ascii=False, indent=1).encode("utf-8")
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Content-Length", str(len(data)))
            self.send_header("Content-Disposition", f"attachment; filename=rawaj-panel-{datetime.date.today()}.json")
            self.end_headers()
            self.wfile.write(data)
            return None
        return self.send_json(404, {"ok": False, "error": "غير موجود"})

    def welcome_text(self, acc: dict, pw: str, plan_name: str) -> str:
        S = acc.get("settings") or {}
        return (f"مرحباً {S.get('ownerName') or acc['name']} 🌟\nتم تفعيل اشتراكك في *رواج لإدارة الأعمال* لمنشأة *{S.get('company') or acc['name']}*.\n\n"
                f"📦 الباقة: *{plan_name}*\n👤 اسم المستخدم (رقم الجوال): *{acc['phone']}*\n🔑 كلمة المرور: *{pw}*\n\n"
                "من شاشة الدخول في النظام اكتب رقم الجوال وكلمة المرور. مرفق لك عقد الاشتراك (PDF)، ويمكنك أيضاً تنزيله من داخل النظام من «حسابي واشتراكي».\n"
                "🎧 خدمة العملاء معك طوال مدة الاشتراك — نسعد بخدمتك.")

    def set_account_license(self, u, a, b):
        plan = b.get("plan")
        start = b.get("start") or None
        cur = a.get("license")
        if b.get("extend") and cur and cur.get("end") and plan not in ("lifetime", "revoked"):
            cur_end = datetime.datetime.fromisoformat(cur["end"])
            if cur_end > datetime.datetime.now(datetime.timezone.utc):
                start = cur_end.isoformat()
        tmp = issue_license("ACCOUNT", plan, b.get("days"), start)  # لحساب التواريخ فقط
        a["license"] = {"plan": plan, "label": tmp["label"], "start": tmp["start"], "end": tmp["end"]}
        a["licVer"] = a.get("licVer", 0) + 1
        a.setdefault("licenseHistory", []).append(dict(a["license"], by=u["name"], time=now_iso()))
        for did in a.get("devices", []):
            if did in DB["devices"]:
                account_license_for(a, DB["devices"][did])
        record_sale(u, b, "account", a["phone"], a["name"], plan, tmp["label"])
        audit(u, "تفعيل اشتراك حساب" if plan != "revoked" else "إيقاف اشتراك حساب", f"{a['phone']} — {tmp['label']}")

    def backups_of(self, did: str):
        folder = os.path.join(BACKUPS, did)
        if not os.path.isdir(folder):
            return []
        out = []
        for n in sorted(os.listdir(folder), reverse=True):
            st = os.stat(os.path.join(folder, n))
            out.append({"name": n, "size": st.st_size, "time": datetime.datetime.fromtimestamp(st.st_mtime).isoformat(timespec="seconds")})
        return out


class Server(socketserver.ThreadingMixIn, http.server.HTTPServer):
    daemon_threads = True


def main():
    load()
    try:
        httpd = Server((HOST, PORT), Handler)
    except OSError:
        print(f"المنفذ {PORT} مستخدم — لوحة التحكم تعمل بالفعل.")
        sys.exit(0)
    threading.Thread(target=backup_worker, daemon=True).start()
    threading.Thread(target=flush_worker, daemon=True).start()
    print(f"Rawaj control panel: http://127.0.0.1:{PORT}/")
    httpd.serve_forever()


if __name__ == "__main__":
    main()
