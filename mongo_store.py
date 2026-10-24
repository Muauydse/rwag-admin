"""
لوحة تحكم رواج — التخزين السحابي في MongoDB (Atlas أو أي خادم MongoDB)

• البيانات تبقى في الذاكرة ويُحفظ نسخة محلية دائماً (panel-db.json) كاحتياط.
• MongoDB هو المصدر الرئيسي عند تفعيله: عند التشغيل تُحمّل البيانات منه، وكل تعديل يُرفع إليه
  في الخلفية (التغييرات فقط — مقارنة بصمة كل مستند).
• عند انقطاع الاتصال تستمر اللوحة بالعمل محلياً، وتُرفع التغييرات تلقائياً عند عودة الاتصال.
• رابط الاتصال (فيه كلمة المرور) يُحفظ مشفّراً في panel-data/mongo.json ولا يُرسل أبداً للنظام أو الموقع.
"""
import hashlib
import json
import os
import threading
import time

try:
    import pymongo
    from pymongo import ReplaceOne, DeleteMany
except ImportError:  # المكتبة غير مثبتة
    pymongo = None

# مجموعات المستندات: المفتاح في بيانات اللوحة ← (اسم المجموعة، حقل المعرّف)
LIST_COLLECTIONS = {
    "tickets": "id", "errors": "id", "notifications": "id", "updates": "id", "accounts": "id", "sales": "id", "requests": "id",
    "coupons": "id", "plans": "id", "staff": "id", "audit": "id", "visits": "sid", "manualLicenses": "serial",
}
DICT_COLLECTIONS = {"devices", "geoCache", "resetCodes"}  # {مفتاح: قيمة} ← مستند لكل مفتاح
CHUNKED = {"events": 2000, "contractsLog": 2000}           # قوائم بلا معرّف ← دفعات
META_PREFIX = "meta"


def _h(obj) -> str:
    return hashlib.sha1(json.dumps(obj, ensure_ascii=False, sort_keys=True, default=str).encode("utf-8")).hexdigest()


class MongoSync:
    def __init__(self, cfg_file: str, seal, unseal, lock):
        self.cfg_file, self.seal, self.unseal, self.lock = cfg_file, seal, unseal, lock
        self.client = None
        self.db = None
        self.hashes = {}          # {collection: {_id: hash}}
        self.orders = {}          # {collection: {_id: رقم ترتيب ثابت}} — الحذف لا يعيد ترقيم بقية المستندات
        self.pending = threading.Event()
        self.state = {"enabled": False, "connected": False, "lastSync": None, "lastError": "", "dbName": "rawaj", "uploaded": 0, "syncs": 0, "host": ""}
        self.get_data = None
        self._worker = None

    # ---------------- الإعدادات ----------------
    def load_cfg(self) -> dict:
        if os.environ.get("MONGODB_URI"):  # على الاستضافة: الرابط من متغيرات البيئة
            return {"uri": "env", "db": os.environ.get("MONGODB_DB", "rawaj"), "enabled": True, "env": True}
        try:
            with open(self.cfg_file, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            return {}

    def save_cfg(self, uri: str = None, db_name: str = None, enabled: bool = None) -> None:
        if os.environ.get("MONGODB_URI"):
            raise ValueError("رابط MongoDB مُدار من متغيرات البيئة في الاستضافة — عدّله من لوحة الاستضافة")
        cfg = self.load_cfg()
        if uri is not None:
            cfg["uri"] = self.seal(uri) if uri else ""
        if db_name is not None:
            cfg["db"] = db_name or "rawaj"
        if enabled is not None:
            cfg["enabled"] = bool(enabled)
        os.makedirs(os.path.dirname(self.cfg_file), exist_ok=True)
        with open(self.cfg_file, "w", encoding="utf-8") as f:
            json.dump(cfg, f)

    def uri(self) -> str:
        if os.environ.get("MONGODB_URI"):
            return os.environ["MONGODB_URI"]
        c = self.load_cfg()
        return self.unseal(c.get("uri", "")) if c.get("uri") else ""

    @staticmethod
    def mask(uri: str) -> str:
        """يخفي كلمة المرور عند العرض"""
        if "@" in uri and "://" in uri:
            scheme, rest = uri.split("://", 1)
            cred, host = rest.rsplit("@", 1)
            user = cred.split(":", 1)[0]
            return f"{scheme}://{user}:••••••@{host}"
        return uri

    # ---------------- الاتصال ----------------
    @staticmethod
    def test(uri: str, db_name: str = "rawaj") -> dict:
        if pymongo is None:
            return {"ok": False, "error": "مكتبة pymongo غير مثبتة على جهاز اللوحة"}
        if not uri.startswith(("mongodb://", "mongodb+srv://")):
            return {"ok": False, "error": "الرابط يجب أن يبدأ بـ mongodb+srv:// أو mongodb://"}
        try:
            c = pymongo.MongoClient(uri, serverSelectionTimeoutMS=8000, connectTimeoutMS=8000, appname="rawaj-panel")
            info = c.admin.command("ping")
            names = c[db_name].list_collection_names()
            host = ",".join(f"{h}:{p}" for h, p in (c.nodes or []))[:120]
            c.close()
            return {"ok": bool(info.get("ok")), "collections": len(names), "empty": not names, "host": host}
        except Exception as e:
            msg = str(e)
            if "Authentication failed" in msg or "bad auth" in msg:
                msg = "اسم المستخدم أو كلمة مرور قاعدة البيانات غير صحيحة"
            elif any(x in msg.lower() for x in ("timed out", "timeout", "refused", "10061", "serverselection")):
                msg = "تعذر الوصول للخادم — تحقق من الإنترنت ومن إضافة عنوان IP في Network Access (أو 0.0.0.0/0)"
            elif "DNS" in msg or "resolution" in msg:
                msg = "تعذر العثور على الخادم — تحقق من الرابط (اسم الـ Cluster)"
            return {"ok": False, "error": msg[:300]}

    def connect(self) -> bool:
        cfg = self.load_cfg()
        self.state["enabled"] = bool(cfg.get("enabled")) and bool(cfg.get("uri"))
        self.state["dbName"] = cfg.get("db") or "rawaj"
        if not self.state["enabled"] or pymongo is None:
            self.state["connected"] = False
            return False
        try:
            if self.client:
                self.client.close()
            self.client = pymongo.MongoClient(self.uri(), serverSelectionTimeoutMS=8000, connectTimeoutMS=8000, appname="rawaj-panel", retryWrites=True)
            self.client.admin.command("ping")
            self.db = self.client[self.state["dbName"]]
            self.state.update(connected=True, lastError="", host=",".join(f"{h}" for h, _ in (self.client.nodes or []))[:120])
            self.files_synced = False  # مطابقة الملفات من جديد بعد كل اتصال
            if getattr(self, "file_event", None):
                self.file_event.set()
            return True
        except Exception as e:
            self.state.update(connected=False, lastError=str(e)[:300])
            return False

    # ---------------- التحويل بين بيانات اللوحة والمستندات ----------------
    def to_docs(self, data: dict) -> dict:
        """{collection: {_id: doc}}"""
        out = {}
        for key, idf in LIST_COLLECTIONS.items():
            docs = {}
            for i, item in enumerate(data.get(key, [])):
                _id = str(item.get(idf) or f"{key}-{i}")
                docs[_id] = {"_id": _id, "d": item}
            out[key] = docs
        for key in DICT_COLLECTIONS:
            out[key] = {str(k): {"_id": str(k), "d": v} for k, v in (data.get(key) or {}).items()}
        for key, size in CHUNKED.items():
            lst = data.get(key, [])
            out[key] = {f"c{n:05d}": {"_id": f"c{n:05d}", "d": lst[n * size:(n + 1) * size]} for n in range((len(lst) + size - 1) // size)}
        meta = {}
        handled = set(LIST_COLLECTIONS) | DICT_COLLECTIONS | set(CHUNKED)
        for key, v in data.items():
            if key not in handled:
                meta[key] = {"_id": key, "d": v}
        out[META_PREFIX] = meta
        return out

    def from_db(self) -> dict:
        data = {}
        self.orders = {}
        for key in LIST_COLLECTIONS:
            rows = list(self.db[key].find({}, {"d": 1, "o": 1}).sort("o", 1))
            data[key] = [d["d"] for d in rows]
            self.orders[key] = {d["_id"]: d.get("o", 0) for d in rows}
        for key in DICT_COLLECTIONS:
            data[key] = {d["_id"]: d["d"] for d in self.db[key].find({})}
        for key in CHUNKED:
            data[key] = [x for d in self.db[key].find({}).sort("_id", 1) for x in d["d"]]
        for d in self.db[META_PREFIX].find({}):
            data[d["_id"]] = d["d"]
        return data

    def has_data(self) -> bool:
        return self.db is not None and self.db[META_PREFIX].count_documents({"_id": "owner"}, limit=1) > 0

    # ---------------- الرفع (التغييرات فقط) ----------------
    def push(self, data: dict, full: bool = False) -> int:
        docs = self.to_docs(data)
        written = 0
        for coll, items in docs.items():
            known = {} if full else self.hashes.get(coll, {})
            fresh = {k: _h(v) for k, v in items.items()}
            if coll in LIST_COLLECTIONS:  # رقم ترتيب ثابت لكل مستند (الجديد يأخذ رقماً بعد الأخير)
                order = {} if full else self.orders.setdefault(coll, {})
                nxt = max(order.values(), default=-1) + 1
                for k in items:
                    if k not in order:
                        order[k] = nxt
                        nxt += 1
                for k in [k for k in order if k not in items]:
                    del order[k]
                self.orders[coll] = order
                for k, d in items.items():
                    d["o"] = order[k]
            ops = [ReplaceOne({"_id": k}, items[k], upsert=True) for k, hv in fresh.items() if known.get(k) != hv]
            gone = [k for k in known if k not in fresh]
            if full:
                ops.append(DeleteMany({"_id": {"$nin": list(fresh)}}))
            elif gone:
                ops.append(DeleteMany({"_id": {"$in": gone}}))
            for i in range(0, len(ops), 1000):
                self.db[coll].bulk_write(ops[i:i + 1000], ordered=False)
            written += len(ops)
            self.hashes[coll] = fresh
        return written

    def remember(self, data: dict) -> None:
        """تسجيل البصمات الحالية بعد التحميل من MongoDB (لا حاجة لإعادة الرفع)"""
        docs = self.to_docs(data)
        self.hashes = {coll: {k: _h(v) for k, v in items.items()} for coll, items in docs.items()}
        for coll in LIST_COLLECTIONS:  # ترتيب مطابق لما حُمّل
            if coll not in self.orders or set(self.orders[coll]) != set(docs[coll]):
                self.orders[coll] = {k: i for i, k in enumerate(docs[coll])}

    # ---------------- التشغيل ----------------
    def start(self, get_data) -> None:
        self.get_data = get_data
        if not self._worker:
            self._worker = threading.Thread(target=self._loop, daemon=True)
            self._worker.start()

    def schedule(self) -> None:
        if self.state["enabled"]:
            self.pending.set()

    def sync_now(self, full: bool = False) -> dict:
        if not self.state["enabled"]:
            return {"ok": False, "error": "MongoDB غير مفعّل"}
        if not self.state["connected"] and not self.connect():
            return {"ok": False, "error": self.state["lastError"] or "تعذر الاتصال"}
        try:
            with self.lock:
                snapshot = json.loads(json.dumps(self.get_data(), ensure_ascii=False, default=str))
            n = self.push(snapshot, full=full)
            self.state.update(lastSync=time.time(), lastError="", connected=True, uploaded=self.state["uploaded"] + n, syncs=self.state["syncs"] + 1)
            return {"ok": True, "written": n}
        except Exception as e:
            self.state.update(connected=False, lastError=str(e)[:300])
            return {"ok": False, "error": str(e)[:300]}

    def _loop(self) -> None:
        while True:
            fired = self.pending.wait(timeout=60)
            if fired:
                time.sleep(3)  # تجميع التعديلات المتتالية في رفعة واحدة
                self.pending.clear()
            if self.state["enabled"] and (fired or not self.state["connected"]):
                r = self.sync_now()
                if not r.get("ok"):
                    self.pending.set() if self.state["connected"] else None

    # ---------------- الملفات (GridFS) ----------------
    # قرص الاستضافة مؤقت: نسخ العملاء، صور التذاكر، العقود وملفات التحديث تُحفظ أيضاً في MongoDB
    # وتُستعاد تلقائياً للقرص عند التشغيل. الملف المحلي يبقى هو المستخدم في القراءة.
    def init_files(self, base: str, dirs) -> None:
        self.files_base, self.files_dirs = base, tuple(dirs)
        self.file_ops = []
        self.file_event = threading.Event()
        threading.Thread(target=self._files_loop, daemon=True).start()
        self.file_event.set()  # مزامنة أولى عند التشغيل

    def _rel(self, path: str):
        rel = os.path.relpath(path, self.files_base).replace("\\", "/")
        if rel.startswith("..") or rel.split("/", 1)[0] not in self.files_dirs or rel.startswith("contracts/preview/") or rel.endswith(".part"):
            return None
        return rel

    def file_saved(self, path: str) -> None:
        self._file_op("put", path)

    def file_removed(self, path: str) -> None:
        self._file_op("del", path)

    def _file_op(self, op: str, path: str) -> None:
        if not getattr(self, "files_base", None) or not self.state["enabled"]:
            return
        rel = self._rel(path)
        if rel:
            with self.lock:
                self.file_ops.append((op, rel))
            self.file_event.set()

    def _bucket(self):
        import gridfs
        return gridfs.GridFSBucket(self.db, bucket_name="files")

    def _files_loop(self) -> None:
        while True:
            self.file_event.wait(timeout=120)
            self.file_event.clear()
            if not (self.state["enabled"] and self.state["connected"]):
                continue
            try:
                bucket = self._bucket()
                with self.lock:
                    ops, self.file_ops = self.file_ops, []
                try:
                    for op, rel in ops:
                        for old in self.db["files.files"].find({"filename": rel}, {"_id": 1}):
                            bucket.delete(old["_id"])
                        full = os.path.join(self.files_base, *rel.split("/"))
                        if op == "put" and os.path.isfile(full):
                            with open(full, "rb") as f:
                                bucket.upload_from_stream(rel, f)
                        ops = ops[1:]
                except Exception:
                    with self.lock:  # إعادة المحاولة لاحقاً
                        self.file_ops = ops + self.file_ops
                    raise
                if not getattr(self, "files_synced", False):
                    self.reconcile_files(bucket)
                    self.files_synced = True
                self.state["filesError"] = ""
            except Exception as e:
                self.state["filesError"] = str(e)[:300]

    def reconcile_files(self, bucket=None) -> dict:
        """تنزيل ما ينقص القرص من MongoDB، ورفع ما ينقص MongoDB من القرص"""
        bucket = bucket or self._bucket()
        remote = {d["filename"]: d["length"] for d in self.db["files.files"].find({}, {"filename": 1, "length": 1})}
        local = {}
        for top in self.files_dirs:
            for root, _, names in os.walk(os.path.join(self.files_base, top)):
                for n in names:
                    rel = self._rel(os.path.join(root, n))
                    if rel:
                        local[rel] = os.path.getsize(os.path.join(root, n))
        down = up = 0
        for rel in remote.keys() - local.keys():
            full = os.path.join(self.files_base, *rel.split("/"))
            os.makedirs(os.path.dirname(full), exist_ok=True)
            with open(full + ".part", "wb") as f:
                bucket.download_to_stream_by_name(rel, f)
            os.replace(full + ".part", full)
            down += 1
        for rel in local.keys() - remote.keys():
            with open(os.path.join(self.files_base, *rel.split("/")), "rb") as f:
                bucket.upload_from_stream(rel, f)
            up += 1
        self.state.update(filesDown=down, filesUp=up, files=len(remote) + up)
        return {"down": down, "up": up}

    def counts(self) -> dict:
        if not self.state["connected"]:
            return {}
        try:
            return {c: self.db[c].estimated_document_count() for c in self.db.list_collection_names()}
        except Exception:
            return {}
