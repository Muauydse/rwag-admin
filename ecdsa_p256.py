"""
توقيع ECDSA P-256 / SHA-256 بلغة بايثون فقط (بدون مكتبات خارجية).
لوحة التحكم توقّع التراخيص بالمفتاح الخاص، والنظام يتحقق منها بالمفتاح العام عبر WebCrypto.
التوقيع بصيغة r||s (64 بايت) المتوافقة مع WebCrypto.
"""
import base64
import hashlib
import hmac
import json
import secrets

P = 0xFFFFFFFF00000001000000000000000000000000FFFFFFFFFFFFFFFFFFFFFFFF
A = P - 3
B = 0x5AC635D8AA3A93E7B3EBBD55769886BC651D06B0CC53B0F63BCE3C3E27D2604B
N = 0xFFFFFFFF00000000FFFFFFFFFFFFFFFFBCE6FAADA7179E84F3B9CAC2FC632551
G = (0x6B17D1F2E12C4247F8BCE6E563A440F277037D812DEB33A0F4A13945D898C296,
     0x4FE342E2FE1A7F9B8EE7EB4A7C0F9E162BCE33576B315ECECBB6406837BF51F5)


def _add(p1, p2):
    if p1 is None:
        return p2
    if p2 is None:
        return p1
    x1, y1 = p1
    x2, y2 = p2
    if x1 == x2 and (y1 + y2) % P == 0:
        return None
    if p1 == p2:
        lam = (3 * x1 * x1 + A) * pow(2 * y1, -1, P) % P
    else:
        lam = (y2 - y1) * pow(x2 - x1, -1, P) % P
    x3 = (lam * lam - x1 - x2) % P
    return x3, (lam * (x1 - x3) - y1) % P


def _mul(k, pt):
    out = None
    while k:
        if k & 1:
            out = _add(out, pt)
        pt = _add(pt, pt)
        k >>= 1
    return out


def b64u(b: bytes) -> str:
    return base64.urlsafe_b64encode(b).rstrip(b"=").decode()


def b64u_dec(s: str) -> bytes:
    return base64.urlsafe_b64decode(s + "=" * (-len(s) % 4))


def generate_key() -> dict:
    d = secrets.randbelow(N - 1) + 1
    x, y = _mul(d, G)
    return {"kty": "EC", "crv": "P-256",
            "x": b64u(x.to_bytes(32, "big")), "y": b64u(y.to_bytes(32, "big")),
            "d": b64u(d.to_bytes(32, "big"))}


def public_jwk(key: dict) -> dict:
    return {"kty": "EC", "crv": "P-256", "x": key["x"], "y": key["y"]}


def _rfc6979_k(d: int, h: bytes) -> int:
    """k حتمي حسب RFC 6979 حتى لا يعتمد الأمان على جودة العشوائية"""
    x = d.to_bytes(32, "big")
    h1 = (int.from_bytes(h, "big") % N).to_bytes(32, "big")
    v, k = b"\x01" * 32, b"\x00" * 32
    k = hmac.new(k, v + b"\x00" + x + h1, hashlib.sha256).digest()
    v = hmac.new(k, v, hashlib.sha256).digest()
    k = hmac.new(k, v + b"\x01" + x + h1, hashlib.sha256).digest()
    v = hmac.new(k, v, hashlib.sha256).digest()
    while True:
        v = hmac.new(k, v, hashlib.sha256).digest()
        cand = int.from_bytes(v, "big")
        if 1 <= cand < N:
            return cand
        k = hmac.new(k, v + b"\x00", hashlib.sha256).digest()
        v = hmac.new(k, v, hashlib.sha256).digest()


def sign(key: dict, data: bytes) -> bytes:
    d = int.from_bytes(b64u_dec(key["d"]), "big")
    h = hashlib.sha256(data).digest()
    z = int.from_bytes(h, "big")
    while True:
        k = _rfc6979_k(d, h)
        r = _mul(k, G)[0] % N
        s = pow(k, -1, N) * (z + r * d) % N
        if r and s:
            return r.to_bytes(32, "big") + s.to_bytes(32, "big")
        h = hashlib.sha256(h).digest()


def verify(pub: dict, data: bytes, sig: bytes) -> bool:
    if len(sig) != 64:
        return False
    r, s = int.from_bytes(sig[:32], "big"), int.from_bytes(sig[32:], "big")
    if not (1 <= r < N and 1 <= s < N):
        return False
    q = (int.from_bytes(b64u_dec(pub["x"]), "big"), int.from_bytes(b64u_dec(pub["y"]), "big"))
    z = int.from_bytes(hashlib.sha256(data).digest(), "big")
    w = pow(s, -1, N)
    pt = _add(_mul(z * w % N, G), _mul(r * w % N, q))
    return pt is not None and pt[0] % N == r


def sign_token(key: dict, payload: dict) -> str:
    """رمز ترخيص: base64url(JSON) + '.' + base64url(signature)"""
    body = b64u(json.dumps(payload, ensure_ascii=False, separators=(",", ":"), sort_keys=True).encode("utf-8"))
    return body + "." + b64u(sign(key, body.encode("ascii")))
