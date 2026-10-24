"""
تحليلات موقع رواج — تسجيل الزوار والجلسات والأحداث، تحديد الموقع الجغرافي، والإحصاءات.
الموقع الجغرافي: من عنوان IP عبر خدمة ip-api.com (للعناوين العامة فقط)، وإلا من المنطقة الزمنية للمتصفح.
"""
import datetime
import ipaddress
import json
import re
import threading
import urllib.request
from collections import Counter

MAX_VISITS = 30000
_geo_lock = threading.Lock()
_pending = set()

TZ_COUNTRY = {
    "Asia/Riyadh": "السعودية", "Asia/Dubai": "الإمارات", "Asia/Kuwait": "الكويت", "Asia/Qatar": "قطر", "Asia/Bahrain": "البحرين",
    "Asia/Muscat": "عُمان", "Africa/Cairo": "مصر", "Asia/Amman": "الأردن", "Asia/Baghdad": "العراق", "Asia/Aden": "اليمن",
    "Africa/Khartoum": "السودان", "Asia/Beirut": "لبنان", "Asia/Damascus": "سوريا", "Africa/Casablanca": "المغرب", "Africa/Algiers": "الجزائر",
    "Africa/Tunis": "تونس", "Africa/Tripoli": "ليبيا", "Europe/Istanbul": "تركيا", "Europe/London": "بريطانيا", "America/New_York": "الولايات المتحدة",
}


def now_iso() -> str:
    return datetime.datetime.now(datetime.timezone.utc).isoformat(timespec="seconds")


def parse_ua(ua: str) -> dict:
    u = ua or ""
    device = "جوال" if re.search(r"Mobile|Android|iPhone", u) and not re.search(r"iPad|Tablet", u) else "جهاز لوحي" if re.search(r"iPad|Tablet", u) else "كمبيوتر"
    browser = ("Edge" if "Edg/" in u else "Opera" if "OPR/" in u else "Samsung" if "SamsungBrowser" in u else "Chrome" if "Chrome/" in u
               else "Firefox" if "Firefox/" in u else "Safari" if "Safari/" in u else "أخرى")
    os_ = ("Windows" if "Windows" in u else "Android" if "Android" in u else "iOS" if re.search(r"iPhone|iPad", u) else "macOS" if "Mac OS" in u
           else "Linux" if "Linux" in u else "أخرى")
    bot = bool(re.search(r"bot|crawl|spider|slurp|preview|facebookexternalhit|WhatsApp", u, re.I))
    return {"device": device, "browser": browser, "os": os_, "bot": bot}


def ref_source(ref: str, utm: str) -> str:
    if utm:
        return utm
    if not ref:
        return "مباشر"
    host = re.sub(r"^https?://(www\.)?", "", ref).split("/")[0].lower()
    for k, v in (("google", "Google"), ("bing", "Bing"), ("facebook", "Facebook"), ("instagram", "Instagram"), ("t.co", "X / تويتر"), ("twitter", "X / تويتر"),
                 ("x.com", "X / تويتر"), ("snapchat", "Snapchat"), ("tiktok", "TikTok"), ("whatsapp", "WhatsApp"), ("wa.me", "WhatsApp"), ("linkedin", "LinkedIn"),
                 ("youtube", "YouTube"), ("telegram", "Telegram")):
        if k in host:
            return v
    return host or "مباشر"


def is_public(ip: str) -> bool:
    try:
        return ipaddress.ip_address(ip).is_global
    except ValueError:
        return False


def geo_lookup(db: dict, ip: str, save) -> None:
    """يحدد الدولة والمدينة لعنوان IP في الخلفية ويخزّنه في ذاكرة مؤقتة"""
    cache = db.setdefault("geoCache", {})
    if not is_public(ip) or ip in cache or ip in _pending:
        return
    _pending.add(ip)

    def run():
        try:
            with urllib.request.urlopen(f"http://ip-api.com/json/{ip}?fields=status,country,countryCode,regionName,city&lang=ar", timeout=6) as r:
                g = json.loads(r.read().decode("utf-8"))
            if g.get("status") == "success":
                with _geo_lock:
                    cache[ip] = {"country": g.get("country", ""), "cc": g.get("countryCode", ""), "region": g.get("regionName", ""), "city": g.get("city", "")}
                    for v in db.get("visits", [])[-500:]:
                        if v.get("ip") == ip and not v.get("geoIp"):
                            v.update(country=cache[ip]["country"], city=cache[ip]["city"], region=cache[ip]["region"], cc=cache[ip]["cc"], geoIp=True)
                save()
        except Exception:
            pass
        finally:
            _pending.discard(ip)
    threading.Thread(target=run, daemon=True).start()


def track(db: dict, b: dict, ip: str, ua: str, save) -> dict:
    """يسجل حدثاً من الموقع: view / event / ping / leave"""
    vid = re.sub(r"[^a-zA-Z0-9_-]", "", str(b.get("vid", "")))[:40]
    sid = re.sub(r"[^a-zA-Z0-9_-]", "", str(b.get("sid", "")))[:40]
    if not vid or not sid:
        return {"ok": False}
    visits = db.setdefault("visits", [])
    v = next((x for x in reversed(visits[-400:]) if x["sid"] == sid), None)
    now = now_iso()
    typ = str(b.get("type", ""))[:20]
    if not v:
        info = parse_ua(ua)
        if info["bot"]:
            return {"ok": True}
        g = db.get("geoCache", {}).get(ip)
        tz = str(b.get("tz", ""))[:60]
        v = {"sid": sid, "vid": vid, "start": now, "last": now, "ip": ip, "ua": ua[:300], **{k: info[k] for k in ("device", "browser", "os")},
             "lang": str(b.get("lang", ""))[:20], "tz": tz, "screen": str(b.get("screen", ""))[:20], "ref": str(b.get("ref", ""))[:300],
             "source": ref_source(str(b.get("ref", "")), str(b.get("utm", ""))[:60]), "path": str(b.get("path", ""))[:200],
             "country": (g or {}).get("country") or TZ_COUNTRY.get(tz, ""), "city": (g or {}).get("city", ""), "region": (g or {}).get("region", ""),
             "cc": (g or {}).get("cc", ""), "geoIp": bool(g), "events": [], "sections": [], "returning": any(x["vid"] == vid for x in visits[-3000:])}
        visits.append(v)
        if len(visits) > MAX_VISITS:
            del visits[:-MAX_VISITS]
        geo_lookup(db, ip, save)
    v["last"] = now
    if typ == "event":
        name = str(b.get("name", ""))[:40]
        data = str(b.get("data", ""))[:120]
        if name == "section":
            if data and data not in v["sections"]:
                v["sections"].append(data)
        elif len(v["events"]) < 60:
            v["events"].append({"t": now, "name": name, "data": data})
    return {"ok": True}


def _ago(iso: str, now: datetime.datetime) -> float:
    try:
        return (now - datetime.datetime.fromisoformat(iso)).total_seconds()
    except Exception:
        return 1e12


def duration(v: dict) -> int:
    try:
        return max(0, int((datetime.datetime.fromisoformat(v["last"]) - datetime.datetime.fromisoformat(v["start"])).total_seconds()))
    except Exception:
        return 0


def stats(db: dict, days: int, requests: list) -> dict:
    now = datetime.datetime.now(datetime.timezone.utc)
    vs = [v for v in db.get("visits", []) if _ago(v["start"], now) <= days * 86400]
    has = lambda v, n: any(e["name"] == n for e in v["events"])
    top = lambda key: Counter(v.get(key) or "غير معروف" for v in vs).most_common(10)
    daily = []
    for i in range(min(days, 30) - 1, -1, -1):
        d = (now - datetime.timedelta(days=i)).date().isoformat()
        dv = [v for v in vs if v["start"][:10] == d]
        daily.append({"day": d, "visits": len(dv), "visitors": len({v["vid"] for v in dv})})
    site_reqs = [r for r in requests if r.get("source") == "website" and _ago(r["created"], now) <= days * 86400]
    hours = Counter(datetime.datetime.fromisoformat(v["start"]).astimezone().hour for v in vs)
    durs = [duration(v) for v in vs]
    return {
        "visits": len(vs), "visitors": len({v["vid"] for v in vs}), "returning": sum(1 for v in vs if v.get("returning")),
        "live": sum(1 for v in db.get("visits", [])[-500:] if _ago(v["last"], now) <= 90),
        "avgDuration": int(sum(durs) / len(durs)) if durs else 0, "bounce": round(sum(1 for v in vs if not v["sections"] and not v["events"]) / len(vs) * 100, 1) if vs else 0,
        "funnel": [["زيارة الموقع", len(vs)], ["شاهد الباقات", sum(1 for v in vs if "plans" in v["sections"])], ["فتح نموذج الاشتراك", sum(1 for v in vs if has(v, "open_signup"))],
                   ["أرسل طلب اشتراك", sum(1 for v in vs if has(v, "signup_sent"))]],
        "downloads": sum(1 for v in vs for e in v["events"] if e["name"] == "download"), "whatsapp": sum(1 for v in vs for e in v["events"] if e["name"] == "whatsapp"),
        "contacts": sum(1 for v in vs if has(v, "contact_sent")), "signups": len(site_reqs),
        "countries": top("country"), "cities": top("city"), "sources": top("source"), "devices": top("device"), "browsers": top("browser"), "oses": top("os"),
        "sections": Counter(s for v in vs for s in v["sections"]).most_common(10), "hours": [hours.get(h, 0) for h in range(24)], "daily": daily,
    }
