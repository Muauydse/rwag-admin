"""
تجهيز أسرار الاستضافة — يُشغَّل على جهازك فقط.
ينشئ ملف «أسرار-الاستضافة.txt» داخل مجلد «لوحة التحكم - ملفات خاصة» (خارج مجلد اللوحة) يحتوي القيم التي تُلصق في متغيرات البيئة على Render أو غيرها.
"""
import base64
import hashlib
import hmac
import json
import os
import sys

ROOT = os.path.dirname(os.path.abspath(__file__))
# نفس المجلد الخاص الذي تستخدمه لوحة التحكم (بجانب مجلد اللوحة وليس داخله)
PRIVATE = os.environ.get("RAWAJ_PRIVATE_DIR") or os.path.join(os.path.dirname(ROOT), "لوحة التحكم - ملفات خاصة")
KEY_FILE = os.path.join(PRIVATE, "keys", "signing-key.json")
SECRET_FILE = os.path.join(PRIVATE, "keys", "secret.key")
MONGO_CFG = os.path.join(PRIVATE, "panel-data", "mongo.json")
OUT = os.path.join(PRIVATE, "أسرار-الاستضافة.txt")


def unseal(secret: bytes, blob: str) -> str:
    raw = base64.b64decode(blob)
    nonce, tag, ct = raw[:16], raw[16:32], raw[32:]
    if not hmac.compare_digest(tag, hmac.new(secret, b"tag" + nonce + ct, hashlib.sha256).digest()[:16]):
        return ""
    stream = b"".join(hmac.new(secret, nonce + i.to_bytes(4, "big"), hashlib.sha256).digest() for i in range(len(ct) // 32 + 1))
    return bytes(a ^ b for a, b in zip(ct, stream)).decode("utf-8")


def main():
    if not os.path.exists(KEY_FILE) or not os.path.exists(SECRET_FILE):
        sys.exit(f"لم يتم العثور على المفاتيح في «{PRIVATE}» — شغّل لوحة التحكم مرة واحدة على هذا الجهاز أولاً.")
    with open(KEY_FILE) as f:
        key = json.dumps(json.load(f), separators=(",", ":"))
    with open(SECRET_FILE) as f:
        secret = f.read().strip()
    mongo = ""
    try:
        with open(MONGO_CFG, encoding="utf-8") as f:
            cfg = json.load(f)
        if cfg.get("uri"):
            mongo = unseal(bytes.fromhex(secret), cfg["uri"])
        db = cfg.get("db") or "rawaj"
    except Exception:
        db = "rawaj"
    if not mongo:
        sys.exit("لم يُربط MongoDB بعد — اربطه من إعدادات اللوحة على هذا الجهاز ثم أعد تشغيل هذا الملف.")
    # القيم خام بدون أي رموز: سطر اسم المتغير (خانة Key في Render) ثم سطر القيمة كما هي (خانة Value)
    blocks = [("RAWAJ_SIGNING_KEY", key), ("RAWAJ_SECRET_KEY", secret), ("MONGODB_URI", mongo), ("MONGODB_DB", db)]
    with open(OUT, "w", encoding="utf-8", newline="\r\n") as f:
        f.write("\n\n".join(f"{name}\n{value}" for name, value in blocks) + "\n")
    print("تم إنشاء:", OUT)
    os.startfile(OUT) if os.name == "nt" else None


if __name__ == "__main__":
    main()
