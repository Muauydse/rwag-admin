/* =====================================================================
   لوحة تحكم رواج — الواجهة
   ===================================================================== */
'use strict';

const I = {
  home: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/>',
  devices: '<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/>',
  key: '<circle cx="8" cy="15" r="4"/><path d="m11 12 9-9M17 6l3 3M15 8l2 2"/>',
  chat: '<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/>',
  bug: '<rect x="7" y="7" width="10" height="13" rx="5"/><path d="M12 7V4M8 4l2 3M16 4l-2 3M3 12h4M17 12h4M4 18l3-2M20 18l-3-2"/>',
  bell: '<path d="M6 16v-5a6 6 0 0 1 12 0v5l2 2H4z"/><path d="M10 21h4"/>',
  upload: '<path d="M12 16V4M7 9l5-5 5 5M4 21h16"/>',
  db: '<ellipse cx="12" cy="6" rx="8" ry="3"/><path d="M4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/>',
  users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 7M18 14.5a6.5 6.5 0 0 1 3.5 5.5"/>',
  settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
  history: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5M12 7v5l3 2"/>',
  logout: '<path d="M9 4H5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h4"/><path d="m14 17 5-5-5-5M19 12H9"/>',
  x: '<path d="M6 6l12 12M18 6 6 18"/>', plus: '<path d="M12 5v14M5 12h14"/>', check: '<path d="m5 12.5 4.5 4.5L19 7"/>',
  download: '<path d="M12 3v12M7 10l5 5 5-5M4 21h16"/>', trash: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',
  edit: '<path d="M4 20h4L19 9l-4-4L4 16z"/>', copy: '<rect x="8" y="8" width="13" height="13" rx="2"/><path d="M16 8V4a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h4"/>',
  refresh: '<path d="M20 11a8 8 0 1 0-2.3 5.7M20 4v7h-7"/>', moon: '<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>',
  menu: '<path d="M4 6h16M4 12h16M4 18h16"/>', alert: '<path d="M12 3.5 2.5 20h19z"/><path d="M12 10v4M12 17h.01"/>',
  shield: '<path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z"/><path d="m9 12 2 2 4-4"/>', send: '<path d="m22 2-7 20-4-9-9-4z"/><path d="M22 2 11 13"/>',
  lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>', mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
  eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  wallet: '<rect x="3" y="6" width="18" height="14" rx="2.5"/><path d="M16 13h2M3 10h18M6 6V5a2 2 0 0 1 2-2h9"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
  tool: '<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.4-.6-.6-2.4z"/>',
  inbox: '<path d="M3 13h5l2 3h4l2-3h5"/><path d="M5.5 5h13L21 13v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-6z"/>',
  tag: '<path d="M3 12V3h9l9 9-9 9z"/><circle cx="7.5" cy="7.5" r="1.5"/>',
  file: '<path d="M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8z"/><path d="M14 3v5h5M9 13h6M9 17h6"/>',
  wa: '<path d="M3 21l1.7-5A9 9 0 1 1 8 19.3z"/><path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1.5-1.5-2-1-1 1c-1 0-2.5-1.5-2.5-2.5l1-1-1-2z"/>'
};
const ic = (n, c) => `<svg class="ic ${c || ''}" viewBox="0 0 24 24">${I[n] || ''}</svg>`;
const $ = (s, el) => (el || document).querySelector(s);
const $$ = (s, el) => [...(el || document).querySelectorAll(s)];
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const pad = n => String(n).padStart(2, '0');
const fdate = d => { if (!d) return '—'; const x = new Date(d); return isNaN(x) ? '—' : `${x.getFullYear()}/${pad(x.getMonth() + 1)}/${pad(x.getDate())}`; };
const fdt = d => { if (!d) return '—'; const x = new Date(d); return isNaN(x) ? '—' : `${fdate(x)} ${pad(x.getHours())}:${pad(x.getMinutes())}`; };
const fnum = n => (Number(n) || 0).toLocaleString('en-US');
const fsize = b => b > 1048576 ? (b / 1048576).toFixed(1) + ' MB' : (b / 1024).toFixed(0) + ' KB';
function ago(d) {
  if (!d) return '—'; const s = (Date.now() - new Date(d)) / 1000;
  if (s < 60) return 'الآن'; if (s < 3600) return `قبل ${Math.floor(s / 60)} د`; if (s < 86400) return `قبل ${Math.floor(s / 3600)} س`; return `قبل ${Math.floor(s / 86400)} يوم`;
}
const online = d => d && (Date.now() - new Date(d)) < 15 * 60 * 1000;

/* ---------------- الاتصال بالخادم ---------------- */
async function api(path, body) {
  const opt = body === undefined ? {} : { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Panel': '1' }, body: JSON.stringify(body) };
  const r = await fetch('/api/' + path, { credentials: 'same-origin', ...opt });
  let j = {}; try { j = await r.json(); } catch (e) { }
  if (r.status === 401 && !path.startsWith('auth/')) { ME = null; renderAuth(); throw new Error(j.error || 'انتهت الجلسة'); }
  if (!r.ok || j.ok === false) throw new Error(j.error || 'تعذر تنفيذ الطلب');
  return j;
}
function toast(msg, err) { const t = document.createElement('div'); t.className = 'toast' + (err ? ' err' : ''); t.textContent = msg; $('#toasts').appendChild(t); setTimeout(() => t.remove(), err ? 5000 : 3000); }
const fail = e => toast(e.message || String(e), true);

/* ---------------- النوافذ ---------------- */
function modal({ title, body, footer, size, onMount }) {
  const bd = document.createElement('div'); bd.className = 'backdrop';
  bd.innerHTML = `<div class="modal ${size || ''}"><div class="modal-h"><h3>${title || ''}</h3><button class="ib" data-x>${ic('x')}</button></div><div class="modal-b">${body || ''}</div>${footer ? `<div class="modal-f">${footer}</div>` : ''}</div>`;
  const m = { el: bd.firstElementChild, close: () => bd.remove() };
  bd.addEventListener('mousedown', e => { if (e.target === bd) m.close(); });
  $$('[data-x]', bd).forEach(b => b.onclick = m.close);
  $('#modals').appendChild(bd); if (onMount) onMount(m.el, m); return m;
}
function confirmBox(title, text, danger) {
  return new Promise(res => {
    const m = modal({ title, body: `<p class="muted">${text}</p>`, size: '', footer: `<button class="btn ${danger ? 'dg' : 'pr'}" id="cOk">تأكيد</button><button class="btn sec" data-x>إلغاء</button>` });
    $('#cOk', m.el).onclick = () => { m.close(); res(true); }; $$('[data-x]', m.el).forEach(b => b.addEventListener('click', () => res(false)));
  });
}
function copy(text) { navigator.clipboard.writeText(text).then(() => toast('تم النسخ')).catch(() => toast('تعذر النسخ', true)); }
function fileToDataURL(f) { return new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(r.result); r.onerror = rej; r.readAsDataURL(f); }); }

/* =====================================================================
   الدخول
   ===================================================================== */
let ME = null, ROUTE = 'overview', CHARTS = [];
function renderAuth(mode = 'login', email = '', code = '') {
  const app = $('#app');
  const head = `<div class="logo"><div class="logo-mark">ر</div><div><b>لوحة تحكم رواج</b><span>إدارة الأنظمة والمشتركين</span></div></div>`;
  const wrapAuth = () => {
    const box = $('.auth-box'); if (!box) return;
    const w = document.createElement('div'); w.className = 'auth-wrap';
    box.parentNode.insertBefore(w, box);
    w.insertAdjacentHTML('beforeend', `${location.protocol === 'file:' ? `<div class="file-warn">⚠️ فتحت ملف اللوحة مباشرة — لن يعمل الدخول بهذه الطريقة. شغّل «تشغيل لوحة التحكم» ثم افتح <a href="http://127.0.0.1:8788/">http://127.0.0.1:8788</a></div>` : ''}
      <div class="auth-brand"><img src="logo.svg" alt=""><b>لوحة تحكم <span class="gold-txt">رواج</span></b><span>إدارة الأنظمة والمشتركين والموقع من مكان واحد</span></div>`);
    w.appendChild(box);
    w.insertAdjacentHTML('beforeend', `<div class="auth-foot">© ${new Date().getFullYear()} <b>رواج لإدارة الأعمال</b> · اتصال آمن ومشفّر</div>`);
  };
  setTimeout(wrapAuth);
  if (mode === 'login') {
    app.innerHTML = `<div class="auth"><form class="auth-box" id="f">${head}<h1>تسجيل الدخول</h1><p>دخول المالك وفريق العمل</p>
      <div class="field"><label>البريد الإلكتروني أو اسم الدخول</label><input class="in ltr" id="lg" autocomplete="username" autofocus></div>
      <div class="field"><label>كلمة المرور</label><input class="in ltr" id="pw" type="password" autocomplete="current-password"></div>
      <button class="btn pr block">${ic('lock', 'sm')} دخول</button>
      <div class="mt" style="text-align:center"><a href="#" id="fg">نسيت كلمة المرور؟</a></div></form></div>`;
    $('#f').onsubmit = async e => {
      e.preventDefault();
      try { await api('auth/login', { login: $('#lg').value, password: $('#pw').value }); await boot(); }
      catch (x) { fail(x); $('#pw').value = ''; $('#pw').focus(); }
    };
    $('#fg').onclick = e => { e.preventDefault(); renderAuth('forgot', $('#lg').value); };
  } else if (mode === 'forgot') {
    app.innerHTML = `<div class="auth"><form class="auth-box" id="f">${head}<h1>استعادة كلمة المرور</h1><p>سنرسل رابط تحقق آمناً إلى بريدك المسجّل</p>
      <div class="field"><label>البريد الإلكتروني</label><input class="in ltr" id="em" value="${esc(email.includes('@') ? email : '')}" autofocus></div>
      <button class="btn pr block" id="fgGo">${ic('mail', 'sm')} إرسال رابط الاستعادة</button><div class="mt" style="text-align:center"><a href="#" id="bk">رجوع لتسجيل الدخول</a></div></form></div>`;
    $('#bk').onclick = e => { e.preventDefault(); renderAuth(); };
    $('#f').onsubmit = async e => {
      e.preventDefault(); const em = $('#em').value.trim();
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(em)) return toast('اكتب بريداً صحيحاً', 'err');
      $('#fgGo').disabled = true;
      try {
        const r = await api('auth/forgot', { email: em });
        if (r.via === 'firebase') return renderAuth('sent', em);
        if (r.sent) { toast('تم إرسال رمز التحقق إلى بريدك'); return renderAuth('reset', em); }
        if (r.local) { toast('تم إنشاء رمز التحقق على جهاز اللوحة'); return renderAuth('reset', em); }
        toast(r.reason === 'quota' ? 'تم بلوغ الحد اليومي لرسائل الاستعادة — حاول مرة أخرى غداً' : 'تعذر إرسال رسالة الاستعادة حالياً — حاول بعد قليل أو تواصل مع الدعم الفني', 'err');
        $('#fgGo').disabled = false;
      } catch (x) { fail(x); $('#fgGo').disabled = false; }
    };
  } else if (mode === 'sent') {
    app.innerHTML = `<div class="auth"><div class="auth-box">${head}<h1>تحقق من بريدك 📩</h1>
      <p>إذا كان <b class="ltr">${esc(email)}</b> مسجّلاً في اللوحة فسيصله رابط لتعيين كلمة مرور جديدة خلال دقيقة.</p>
      <p class="xs muted">الرابط صالح لمدة 15 دقيقة ويُستخدم مرة واحدة. لم يصل؟ افحص مجلد الرسائل غير المرغوب فيها (Spam).</p>
      <button class="btn block mt" id="again">${ic('mail', 'sm')} إرسال مرة أخرى</button><div class="mt" style="text-align:center"><a href="#" id="bk">رجوع لتسجيل الدخول</a></div></div></div>`;
    $('#bk').onclick = e => { e.preventDefault(); renderAuth(); };
    $('#again').onclick = () => renderAuth('forgot', email);
  } else if (mode === 'link') {
    app.innerHTML = `<div class="auth"><form class="auth-box" id="f">${head}<h1>تعيين كلمة مرور جديدة</h1><p>تم التحقق من بريدك عبر الرابط — اختر كلمة مرور جديدة</p>
      <div class="field"><label>البريد الإلكتروني</label><input class="in ltr" id="em" value="${esc(email)}" ${email ? 'readonly' : 'autofocus'}></div>
      <div class="field"><label>كلمة المرور الجديدة</label><input class="in ltr" id="np" type="password" autocomplete="new-password" ${email ? 'autofocus' : ''}><span class="xs muted">10 أحرف على الأقل</span></div>
      <div class="field"><label>تأكيد كلمة المرور</label><input class="in ltr" id="np2" type="password" autocomplete="new-password"></div>
      <button class="btn pr block" id="lkGo">${ic('check', 'sm')} حفظ كلمة المرور</button><div class="mt" style="text-align:center"><a href="#" id="bk">رجوع لتسجيل الدخول</a></div></form></div>`;
    const clear = () => history.replaceState(null, '', location.pathname);
    $('#bk').onclick = e => { e.preventDefault(); clear(); renderAuth(); };
    $('#f').onsubmit = async e => {
      e.preventDefault();
      if ($('#np').value !== $('#np2').value) return toast('كلمتا المرور غير متطابقتين', 'err');
      $('#lkGo').disabled = true;
      try { await api('auth/reset', { email: $('#em').value.trim().toLowerCase(), oobCode: code, password: $('#np').value }); clear(); toast('تم تغيير كلمة المرور — سجّل الدخول'); renderAuth('login'); }
      catch (x) { fail(x); $('#lkGo').disabled = false; }
    };
  } else {
    app.innerHTML = `<div class="auth"><form class="auth-box" id="f">${head}<h1>تعيين كلمة مرور جديدة</h1><p>أدخل الرمز المرسل إلى <b class="ltr">${esc(email)}</b></p>
      <div class="field"><label>رمز التحقق</label><input class="in ltr" id="cd" maxlength="6" inputmode="numeric" autofocus style="letter-spacing:8px;text-align:center;font-size:20px"></div>
      <div class="field"><label>كلمة المرور الجديدة</label><input class="in ltr" id="np" type="password" autocomplete="new-password"><span class="xs muted">10 أحرف على الأقل</span></div>
      <button class="btn pr block">${ic('check', 'sm')} حفظ كلمة المرور</button><div class="mt" style="text-align:center"><a href="#" id="bk">رجوع</a></div></form></div>`;
    $('#bk').onclick = e => { e.preventDefault(); renderAuth(); };
    $('#f').onsubmit = async e => {
      e.preventDefault();
      try { await api('auth/reset', { email, code: $('#cd').value, password: $('#np').value }); toast('تم تغيير كلمة المرور — سجّل الدخول'); renderAuth(); } catch (x) { fail(x); }
    };
  }
}

/* =====================================================================
   الهيكل والتنقل
   ===================================================================== */
const NAV = [
  ['overview', 'home', 'الرئيسية', null],
  ['devices', 'devices', 'الأجهزة والمشتركون', 'devices'],
  ['requests', 'inbox', 'طلبات فتح الحسابات', 'requests'],
  ['accounts', 'user', 'حسابات العملاء', 'accounts'],
  ['licenses', 'key', 'الاشتراكات والتفعيل', 'licenses'],
  ['sales', 'wallet', 'مبيعات الاشتراكات', 'sales'],
  ['plans', 'tag', 'الباقات وأكواد الخصم', 'sales'],
  ['site', 'globe', 'الموقع والزوار', 'site'],
  ['maintenance', 'tool', 'الصيانة والإعلانات', 'system'],
  ['branding', 'shield', 'الهوية والدعم', 'system'],
  ['tickets', 'chat', 'الدعم الفني', 'tickets'],
  ['errors', 'bug', 'الأعطال', 'errors'],
  ['notifications', 'bell', 'الإشعارات', 'notifications'],
  ['updates', 'upload', 'تحديثات النظام', 'updates'],
  ['backups', 'db', 'النسخ الاحتياطية', 'backups'],
  ['staff', 'users', 'فريق العمل', 'staff'],
  ['audit', 'history', 'سجل العمليات', 'audit'],
  ['settings', 'settings', 'الإعدادات والحساب', null]
];
const can = p => !p || (ME && ME.perms.includes(p));
let BADGES = {};
function renderShell() {
  $('#app').innerHTML = `<div class="shell"><aside class="side" id="side"><div class="logo"><div class="logo-mark">ر</div><div><b>لوحة تحكم رواج</b><span>${ME.owner ? 'المالك — كل الصلاحيات' : 'حساب موظف'}</span></div></div>
    <nav class="nav" id="nav"></nav>
    <div class="me"><div class="av">${esc((ME.name || '?').slice(0, 1))}</div><div class="f1"><b>${esc(ME.name)}</b><span class="ltr">${esc(ME.email || ME.username || '')}</span></div><button class="ib" id="out" title="خروج" style="color:var(--side-text)">${ic('logout')}</button></div></aside>
    <div class="main"><header class="top"><button class="ib" id="mnu">${ic('menu')}</button><h2 id="ttl"></h2><span class="f1"></span>
      <button class="ib" id="rf" title="تحديث">${ic('refresh')}</button><button class="ib" id="th" title="الوضع الليلي">${ic('moon')}</button></header>
    <div class="content" id="view"></div></div></div>`;
  $('#out').onclick = async () => { await api('auth/logout', {}).catch(() => { }); ME = null; renderAuth(); };
  $('#th').onclick = () => { const t = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'; document.documentElement.dataset.theme = t; try { localStorage.setItem('rp_theme', t); } catch (e) { } go(ROUTE); };
  $('#rf').onclick = () => go(ROUTE);
  $('#mnu').onclick = () => $('#side').classList.toggle('open');
  drawNav();
}
function drawNav() {
  $('#nav').innerHTML = NAV.filter(n => can(n[3])).map(([id, i, l]) => `<a href="#" data-r="${id}" class="${ROUTE === id ? 'on' : ''}">${ic(i)} ${l}${BADGES[id] ? `<span class="cnt">${BADGES[id]}</span>` : ''}</a>`).join('');
  $$('#nav a').forEach(a => a.onclick = e => { e.preventDefault(); $('#side').classList.remove('open'); go(a.dataset.r); });
}
async function go(r) {
  const n = NAV.find(x => x[0] === r) || NAV[0]; if (!can(n[3])) r = 'overview';
  ROUTE = r; try { sessionStorage.setItem('rp_route', r); } catch (e) { }
  CHARTS.forEach(c => c.destroy()); CHARTS = [];
  $('#ttl').textContent = (NAV.find(x => x[0] === r) || NAV[0])[2];
  $('#view').innerHTML = '<div class="empty">جارٍ التحميل…</div>'; drawNav();
  try { await V[r]($('#view')); } catch (e) { $('#view').innerHTML = `<div class="card"><div class="empty"><b>تعذر تحميل الصفحة</b>${esc(e.message)}</div></div>`; }
}
async function refreshBadges() {
  try { const o = await api('admin/overview'); BADGES = { tickets: o.unreadTickets, errors: o.errors7, requests: o.newRequests }; drawNav(); } catch (e) { }
}

/* ---------------- مكوّنات ---------------- */
function statusBadge(st) {
  if (!st) return '<span class="badge b-ne">—</span>';
  if (st.active) return `<span class="badge b-su">${esc(st.label)}${st.remainingDays != null ? ` · ${fnum(Math.ceil(st.remainingDays))} يوم` : ''}</span>`;
  return `<span class="badge ${st.label === 'غير مفعّل' ? 'b-ne' : 'b-da'}">${esc(st.label)}</span>`;
}
function table(cols, rows, opts = {}) {
  if (!rows.length) return `<div class="empty"><b>${opts.empty || 'لا توجد بيانات'}</b>${opts.emptySub || ''}</div>`;
  return `<div class="tw" style="${opts.max ? 'max-height:' + opts.max : ''}"><table><thead><tr>${cols.map(c => `<th>${c[0]}</th>`).join('')}</tr></thead><tbody>
    ${rows.map((r, i) => `<tr class="${opts.click ? 'click' : ''}" data-i="${i}">${cols.map(c => `<td>${c[1](r)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
}
function bindRows(root, rows, fn) { $$('tr[data-i]', root).forEach(tr => tr.addEventListener('click', e => { if (e.target.closest('button,a,input')) return; fn(rows[+tr.dataset.i]); })); }
function chart(canvas, cfg) {
  const dark = document.documentElement.dataset.theme === 'dark';
  Chart.defaults.font.family = "'Plex','Segoe UI',sans-serif"; Chart.defaults.color = dark ? '#6f7c93' : '#8a94a6'; Chart.defaults.borderColor = dark ? '#1f2a3d' : '#e5e8ef';
  const c = new Chart(canvas, { ...cfg, options: { maintainAspectRatio: false, plugins: { legend: { display: !!cfg.legend, position: 'bottom' } }, ...(cfg.options || {}) } }); CHARTS.push(c); return c;
}
const PLAN_LBL = { monthly: 'شهري', quarterly: 'ربع سنوي', yearly: 'سنوي', lifetime: 'دائم', custom: 'مخصص', revoked: 'موقوف', trial: 'تجربة مجانية', none: 'غير مفعّل' };

/* =====================================================================
   الصفحات
   ===================================================================== */
const V = {};

V.overview = async el => {
  const o = await api('admin/overview');
  BADGES = { tickets: o.unreadTickets, errors: o.errors7, requests: o.newRequests }; drawNav();
  const k = (t, v, s, i, tone) => `<div class="card kpi"><div class="k">${t}<span class="ki ${tone}">${ic(i)}</span></div><div class="v num">${fnum(v)}</div><div class="s">${s}</div></div>`;
  el.innerHTML = `<div class="grid g4">${k('الأجهزة المسجلة', o.devices, `${fnum(o.newDevices30)} جهاز جديد خلال 30 يوماً`, 'devices', 't-pr')}${k('اشتراكات فعّالة', o.active, `${fnum(o.trial)} جهاز في الفترة التجريبية`, 'key', 't-su')}
    ${k('متصل خلال 24 ساعة', o.online24, 'أجهزة أرسلت بيانات اليوم', 'refresh', 't-in')}${k('تذاكر مفتوحة', o.openTickets, `${fnum(o.unreadTickets)} غير مقروءة · ${fnum(o.errors7)} عطل هذا الأسبوع`, 'chat', 't-wa')}</div>
    ${o.maintenance && (o.maintenance.system || o.maintenance.site) ? `<div class="note t-da mt">${ic('alert')} <div><b>وضع الصيانة مفعّل:</b> ${[o.maintenance.system && 'النظام', o.maintenance.site && 'الموقع'].filter(Boolean).join(' و ')} — <a href="#" data-go="maintenance">إدارة الصيانة</a></div></div>` : ''}
    <div class="grid g4 mt">${k('زوار الموقع اليوم', o.siteToday, `${fnum(o.siteLive)} متصل الآن على الموقع`, 'globe', 't-in')}${k('طلبات جديدة', o.newRequests, 'طلبات فتح حسابات بانتظارك', 'inbox', 't-wa')}${k('حسابات العملاء', o.accounts, 'حسابات دخول برقم الجوال', 'user', 't-vi')}${k('غير محصّل', o.unpaid, esc(o.currency), 'alert', 't-da')}</div>
    <div class="grid g4 mt">${k('مبيعات الاشتراكات هذا الشهر', o.revenueMonth, esc(o.currency), 'wallet', 't-su')}${k('إجمالي مبيعات الاشتراكات', o.revenueTotal, esc(o.currency), 'wallet', 't-pr')}${k('متوسط قيمة الاشتراك', o.revenueTotal && o.active ? Math.round(o.revenueTotal / Math.max(1, o.active)) : 0, esc(o.currency) + ' لكل اشتراك فعّال', 'tag', 't-vi')}${k('معدل التفعيل', o.devices ? Math.round(o.active / o.devices * 100) + '%' : '0%', 'من الأجهزة المسجلة لديها اشتراك فعّال', 'key', 't-su')}</div>
    <div class="grid mt" style="grid-template-columns:2fr 1fr"><div class="card"><div class="card-h"><h3>نشاط الأجهزة اليومي (30 يوماً)</h3></div><div class="card-b chart-box"><canvas id="c1"></canvas></div></div>
      <div class="card"><div class="card-h"><h3>توزيع الباقات</h3></div><div class="card-b chart-box"><canvas id="c2"></canvas></div></div></div>
    <div class="grid g3 mt"><div class="card"><div class="card-h"><h3>اشتراكات تنتهي قريباً</h3></div>${table([['الجهاز', r => `<b>${esc(r.company || '—')}</b><div class="xs muted ltr">${esc(r.serial)}</div>`], ['المتبقي', r => `<span class="badge b-wa">${Math.ceil(r.remainingDays)} يوم</span>`], ['', r => r.phone ? `<a class="ib" target="_blank" title="تذكير بالتجديد" href="https://wa.me/${String(r.phone).replace(/\D/g, '').replace(/^0/, '966')}?text=${encodeURIComponent(`مرحباً ${r.company || ''} 🌟\nنود تذكيركم بأن اشتراككم في نظام رواج ينتهي خلال ${Math.ceil(r.remainingDays)} يوم. للتجديد والاستمرار دون انقطاع تواصلوا معنا.`)}">${ic('wa', 'sm')}</a>` : '']], o.expiring, { empty: 'لا توجد اشتراكات قريبة الانتهاء', click: 1 })}</div>
      <div class="card"><div class="card-h"><h3>أحدث التذاكر</h3><a href="#" data-go="tickets" class="small">الكل</a></div>${table([['الموضوع', r => `<b>${esc(r.subject)}</b><div class="xs muted">${esc(r.company || r.userName || '')}</div>`], ['', r => ticketBadge(r.status)]], o.recentTickets, { empty: 'لا توجد تذاكر' })}</div>
      <div class="card"><div class="card-h"><h3>آخر الأعطال</h3><a href="#" data-go="errors" class="small">الكل</a></div>${table([['العطل', r => `<div class="small">${esc(r.message.slice(0, 80))}</div><div class="xs muted">${esc(r.company || r.serial || '')} · ${ago(r.received)}</div>`]], o.recentErrors, { empty: 'لا توجد أعطال 🎉' })}</div></div>`;
  $$('[data-go]', el).forEach(a => a.onclick = e => { e.preventDefault(); go(a.dataset.go); });
  chart($('#c1'), { type: 'bar', data: { labels: o.activity.map(x => x.day.slice(5)), datasets: [{ label: 'أجهزة نشطة', data: o.activity.map(x => x.count), backgroundColor: '#4f46e5', borderRadius: 5 }, { label: 'تسجيلات جديدة', data: o.signups.map(x => x.count), backgroundColor: '#f59e0b', borderRadius: 5 }] }, legend: 1, options: { scales: { y: { beginAtZero: true, ticks: { precision: 0 } } } } });
  const pk = Object.keys(o.plans);
  chart($('#c2'), { type: 'doughnut', data: { labels: pk.map(p => PLAN_LBL[p] || p), datasets: [{ data: pk.map(p => o.plans[p]), backgroundColor: ['#4f46e5', '#f59e0b', '#0284c7', '#7c3aed', '#dc2626', '#64748b', '#10b981'] }] }, legend: 1, options: { cutout: '64%' } });
};
const ticketBadge = s => ({ open: '<span class="badge b-wa">مفتوحة</span>', answered: '<span class="badge b-in">تم الرد</span>', closed: '<span class="badge b-ne">مغلقة</span>' }[s] || s);

/* ---------------- الأجهزة ---------------- */
const DF = { q: '', st: '' };
V.devices = async el => {
  const { items } = await api('admin/devices');
  el.innerHTML = `<div class="card"><div class="tb"><input class="in" id="q" placeholder="بحث: المنشأة، الرقم التسلسلي، رقم الاشتراك، الجهاز" value="${esc(DF.q)}" style="min-width:320px">
    <div class="chips" id="fs">${[['', 'الكل'], ['active', 'مفعّل'], ['trial', 'تجربة'], ['expired', 'منتهي / موقوف'], ['none', 'غير مفعّل'], ['online', 'متصل الآن']].map(([k, l]) => `<button class="chip ${DF.st === k ? 'on' : ''}" data-k="${k}">${l}</button>`).join('')}</div>
    <span class="f1"></span><span class="small muted" id="cnt"></span></div><div id="tbl"></div></div>`;
  const draw = () => {
    const q = DF.q.trim().toLowerCase();
    const rows = items.filter(d => {
      const hay = [d.serial, d.subscriptionNo, d.computer, d.winUser, (d.company || {}).name, (d.company || {}).phone, (d.account || {}).username].join(' ').toLowerCase();
      if (q && !hay.includes(q)) return false;
      const st = d.status || {};
      if (DF.st === 'active') return st.active; if (DF.st === 'none') return !d.license && d.mode !== 'guest';
      if (DF.st === 'trial') return !d.license && (d.mode === 'guest' || (d.trial || {}).started); if (DF.st === 'expired') return d.license && !st.active;
      if (DF.st === 'online') return online(d.lastSeen); return true;
    });
    $('#cnt').textContent = `${fnum(rows.length)} جهاز`;
    $('#tbl').innerHTML = table([
      ['المنشأة / الجهاز', d => `<div class="flex"><span class="dot ${online(d.lastSeen) ? 'on' : 'off'}"></span><div><b>${esc((d.company || {}).name || 'بدون اسم')}</b><div class="xs muted">${esc(d.computer || '')} · ${esc((d.company || {}).city || '')}</div></div></div>`],
      ['الرقم التسلسلي', d => `<span class="ltr small">${esc(d.serial)}</span><div class="xs muted ltr">${esc(d.subscriptionNo || '')}</div>`],
      ['الاشتراك', d => d.license ? statusBadge(d.status) : d.mode === 'guest' || (d.trial || {}).started ? `<span class="badge b-vi">تجربة${(d.trial || {}).expired ? ' منتهية' : ''}</span>` : statusBadge(d.status)],
      ['الاستخدام', d => `<span class="small">${fnum((d.stats || {}).sales)} فاتورة · ${fnum((d.stats || {}).products)} صنف</span><div class="xs muted">${fnum((d.stats || {}).users)} مستخدم</div>`],
      ['الإصدار', d => `<span class="ltr small">${esc(d.appVersion || '')}</span>`],
      ['آخر اتصال', d => `<span class="small">${ago(d.lastSeen)}</span>${d.blocked ? '<div><span class="badge b-da">محظور</span></div>' : ''}`],
      ['', d => d.openTickets ? `<span class="badge b-wa">${d.openTickets} تذكرة</span>` : '']
    ], rows, { click: 1, empty: 'لا توجد أجهزة مسجلة بعد', emptySub: 'تظهر الأجهزة هنا تلقائياً عند تشغيل النظام لدى العملاء' });
    bindRows($('#tbl'), rows, d => deviceModal(d.deviceId));
  };
  $('#q').oninput = e => { DF.q = e.target.value; draw(); };
  $$('#fs .chip').forEach(c => c.onclick = () => { DF.st = c.dataset.k; $$('#fs .chip').forEach(x => x.classList.toggle('on', x === c)); draw(); });
  draw();
};

/* الفوترة الإلكترونية للجهاز: التفعيل، السماح بالإعداد من النظام، والربط بالهيئة عن بُعد */
const ZENV_AR = { sandbox: 'بيئة المطورين (تجريبية)', simulation: 'المحاكاة', production: 'الإنتاج' };
function zatcaCardHTML(d) {
  const f = d.featuresOn || {}, z = d.zatca || {}, rr = d.zatcaRemote, rq = d.zatcaRequest, dis = can('devices') ? '' : 'disabled';
  const st = z.onboarded ? `<span class="badge b-su">مربوط — ${esc(ZENV_AR[z.env] || '')}</span> <span class="small">مرسلة ${fnum(z.sent || 0)} · بانتظار ${fnum(z.pending || 0)} · مرفوضة ${fnum(z.rejected || 0)} · ICV ${fnum(z.icv || 0)}</span>`
    : `<span class="badge b-ne">غير مربوط بالهيئة بعد</span>`;
  const rem = rr ? `<div class="small mt">${rr.status === 'pending' ? '⏳ طلب ربط عن بُعد بانتظار الجهاز' : rr.status === 'ok' ? '✅ تم الربط عن بُعد بنجاح' : '❌ تعذر الربط عن بُعد: ' + esc(rr.error || '')} — ${esc(ZENV_AR[rr.env] || '')} · ${fdt(rr.done || rr.time)}</div>` : '';
  return `<div class="card mt" style="padding:16px 18px"><h4 class="mb">الفوترة الإلكترونية — هيئة الزكاة (المرحلة الثانية)</h4>
    ${rq ? `<div class="note t-in mb" style="font-size:13px">📩 طلب العميل تفعيل الخدمة · ${fdt(rq.time)}</div>` : ''}
    <label class="check" style="display:flex;gap:10px;align-items:center"><input type="checkbox" id="fZatca" ${f.zatca ? 'checked' : ''} ${dis}> <b>تفعيل الفوترة الإلكترونية لهذا الجهاز</b></label>
    <label class="check mt" style="display:flex;gap:10px;align-items:center"><input type="checkbox" id="fZSetup" ${f.zatcaSetup !== false ? 'checked' : ''} ${dis}> السماح للعميل بفتح إعدادات الربط من النظام</label>
    <div class="mt">${st}</div>${rem}
    <div class="fg mt" style="grid-template-columns:repeat(4,minmax(0,1fr))">
      <div class="field"><label>البيئة</label><select class="in" id="zrEnv">${Object.entries(ZENV_AR).map(([k, v]) => `<option value="${k}" ${k === 'simulation' ? 'selected' : ''}>${v}</option>`).join('')}</select></div>
      <div class="field"><label>رمز OTP من بوابة فاتورة</label><input class="in ltr" id="zrOtp" maxlength="6" placeholder="6 أرقام"></div>
      <div class="field"><label>أنواع الفواتير</label><select class="in" id="zrTypes"><option value="1100">ضريبية + مبسطة</option><option value="0100">مبسطة فقط</option><option value="1000">ضريبية فقط</option></select></div>
      <div class="field"><label>اسم الفرع</label><input class="in" id="zrUnit" value="${esc((d.company || {}).city || 'الفرع الرئيسي')}"></div></div>
    <div class="flex"><button class="btn pr sm" id="zrGo" ${dis}>${ic('send', 'sm')} ربط الجهاز بالهيئة عن بُعد</button><span class="xs muted">يُنفَّذ على جهاز العميل عند أول اتصال (رمز OTP صالح ساعة). تأكد أن بيانات المنشأة والرقم الضريبي والعنوان الوطني مكتملة.</span></div></div>`;
}
function bindZatcaCard(el, d, reload) {
  const save = (body, msg) => api('admin/device/features', { deviceId: d.deviceId, ...body }).then(() => toast(msg)).catch(fail);
  $('#fZatca', el).onchange = e => save({ zatca: e.target.checked }, e.target.checked ? 'تم تفعيل الفوترة الإلكترونية — تظهر للعميل خلال ثوانٍ' : 'تم إيقاف الفوترة الإلكترونية');
  $('#fZSetup', el).onchange = e => save({ zatcaSetup: e.target.checked }, e.target.checked ? 'يستطيع العميل فتح إعدادات الربط' : 'إعدادات الربط تُدار من اللوحة فقط');
  $('#zrEnv', el).onchange = e => { if (e.target.value === 'sandbox') $('#zrOtp', el).value = '123345'; };
  $('#zrGo', el).onclick = async () => {
    const env = $('#zrEnv', el).value, otp = $('#zrOtp', el).value.trim();
    if (!/^\d{6}$/.test(otp)) return toast('أدخل رمز OTP من 6 أرقام', true);
    if (env === 'production' && !await confirmBox('الربط على بيئة الإنتاج', 'كل فاتورة بعد الربط تُرسل للهيئة كفاتورة حقيقية. متابعة؟')) return;
    try { await api('admin/device/zatca-onboard', { deviceId: d.deviceId, env, otp, types: $('#zrTypes', el).value, unit: $('#zrUnit', el).value }); toast('تم إرسال طلب الربط — يُنفَّذ على جهاز العميل خلال ثوانٍ إن كان متصلاً'); reload(); } catch (e) { fail(e); }
  };
}
async function deviceModal(id) {
  const { item: d } = await api('admin/device?id=' + id);
  const co = d.company || {}, st = d.stats || {};
  const kv = pairs => `<div class="kv">${pairs.filter(p => p[1] !== undefined).map(([k, v]) => `<div><div class="k">${k}</div><div class="v">${v || '—'}</div></div>`).join('')}</div>`;
  const m = modal({
    title: `${esc(co.name || 'جهاز بدون اسم')} <span class="badge b-ne ltr">${esc(d.serial)}</span>`, size: 'xl',
    body: `<div class="tabs" id="dt">${[['info', 'البيانات'], ['lic', 'الاشتراك'], ['use', 'الاستخدام'], ['tk', `التذاكر (${d.tickets.length})`], ['err', `الأعطال (${d.errors.length})`], ['bk', `النسخ (${d.backups.length})`]].map(([k, l], i) => `<button data-t="${k}" class="${i ? '' : 'on'}">${l}</button>`).join('')}</div><div id="dtb" class="mt"></div>`,
    footer: `${can('accounts') ? `<button class="btn sec" id="dBz">${ic('settings', 'sm')} إعداد النشاط التجاري</button>` : ''}${can('notifications') ? `<button class="btn sec" id="dN">${ic('bell', 'sm')} إشعار لهذا الجهاز</button>` : ''}${can('licenses') ? `<button class="btn sec" id="dLo" title="إنهاء جلسة الدخول على هذا الجهاز">${ic('logout', 'sm')} خروج عن بعد</button>` : ''}${can('licenses') ? `<button class="btn ${d.blocked ? 'pr' : 'dg'}" id="dB">${d.blocked ? 'إلغاء الحظر' : 'حظر الجهاز'}</button>` : ''}<span class="f1"></span>${ME.owner ? `<button class="btn dg" id="dDel">${ic('trash', 'sm')} حذف</button>` : ''}<button class="btn sec" data-x>إغلاق</button>`
  });
  const tabs = {
    info: () => kv([['المنشأة', esc(co.name)], ['النشاط', esc(co.activity)], ['الجوال', `<span class="ltr">${esc(co.phone)}</span>`], ['البريد', `<span class="ltr">${esc(co.email)}</span>`], ['المدينة', esc(co.city)], ['الرقم الضريبي', `<span class="ltr">${esc(co.vatNumber)}</span>`], ['السجل التجاري', `<span class="ltr">${esc(co.crNumber)}</span>`],
      ['الرقم التسلسلي', `<span class="ltr">${esc(d.serial)}</span>`], ['رقم الاشتراك', `<span class="ltr">${esc(d.subscriptionNo)}</span>`], ['اسم الجهاز', esc(d.computer)], ['مستخدم ويندوز', esc(d.winUser)], ['نظام التشغيل', `<span class="ltr small">${esc(d.os)}</span>`],
      ['إصدار النظام', `<span class="ltr">${esc(d.appVersion)}</span>`], ['عنوان IP', `<span class="ltr">${esc(d.ip)}</span>`], ['أول ظهور', fdt(d.firstSeen)], ['آخر اتصال', fdt(d.lastSeen) + ' · ' + ago(d.lastSeen)], ['آخر نسخة احتياطية', fdt(d.lastBackup)],
      ['الحساب الحالي', esc((d.account || {}).fullName || (d.mode === 'guest' ? 'زائر (تجربة مجانية)' : ''))]])
      + zatcaCardHTML(d)
      + `<div class="field mt"><label>ملاحظات داخلية</label><textarea class="ta" id="dNotes" rows="3">${esc(d.notes)}</textarea></div><button class="btn sec sm" id="dSaveN">${ic('check', 'sm')} حفظ الملاحظات</button>`,
    lic: () => `<div class="grid g2"><div><h4 class="mb">الحالة الحالية</h4>${kv([['الباقة', statusBadge(d.status)], ['بداية الاشتراك', fdate((d.license || {}).start)], ['نهاية الاشتراك', d.license ? (d.license.end ? fdate(d.license.end) : 'دائم') : '—'], ['المتبقي', d.status.remainingDays != null ? Math.ceil(d.status.remainingDays) + ' يوم' : d.license && d.status.active ? 'غير محدود' : '—'],
        ['الفترة التجريبية', d.trial && d.trial.started ? (d.trial.expired ? 'منتهية' : `متبقي ${Math.ceil(d.trial.remaining / 3600)} ساعة`) : 'لم تبدأ']])}
        ${(d.licenseHistory || []).length ? `<h4 class="mt mb">سجل الاشتراكات</h4>${table([['الباقة', r => esc(r.label)], ['من', r => fdate(r.start)], ['إلى', r => r.end ? fdate(r.end) : 'دائم'], ['بواسطة', r => esc(r.by || '')]], d.licenseHistory.slice().reverse(), { max: '220px' })}` : ''}</div>
      <div>${can('licenses') ? licenseForm(d) : '<div class="note t-wa">ليست لديك صلاحية تعديل الاشتراكات</div>'}</div></div>`,
    use: () => kv([['فواتير المبيعات', fnum(st.sales)], ['إجمالي المبيعات', fnum(st.salesTotal)], ['الأصناف', fnum(st.products)], ['العملاء', fnum(st.customers)], ['الموردون', fnum(st.suppliers)], ['فواتير المشتريات', fnum(st.purchases)], ['المستخدمون', fnum(st.users)], ['حجم البيانات', st.dbSize ? fsize(st.dbSize) : '—'], ['آخر عملية', fdt(st.lastActivity)], ['مرات المزامنة', fnum(d.syncCount)]])
      + `<h4 class="mt mb">مستخدمو النظام</h4>${table([['الاسم', u => esc(u.fullName)], ['اسم الدخول', u => `<span class="ltr">${esc(u.username)}</span>`], ['الدور', u => esc(u.role)], ['آخر دخول', u => fdt(u.lastLogin)],
        ['كلمة المرور', u => can('accounts') ? `<button class="btn sec sm" data-upw="${esc(u.username)}">${ic('key', 'sm')} تغيير</button>` : '<span class="muted">مشفّرة</span>']], d.users || [], { empty: 'لا يوجد' })}
      <div class="xs muted mt">كلمات مرور مستخدمي النظام مخزّنة مشفّرة بشكل لا يمكن عكسه (لحماية العميل)، لذلك يمكنك تعيين كلمة مرور جديدة لأي مستخدم وتصل للنظام عند المزامنة. حسابات العملاء التي تنشئها من «حسابات العملاء» يمكنك عرض كلمة مرورها.</div>
      <h4 class="mt mb">أيام النشاط (آخر 60)</h4><div class="chips">${d.activity.map(x => `<span class="badge b-pr">${x.slice(5)}</span>`).join('') || '<span class="muted">—</span>'}</div>`,
    tk: () => table([['الموضوع', t => `<b>${esc(t.subject)}</b>`], ['الحالة', t => ticketBadge(t.status)], ['آخر تحديث', t => fdt(t.updated)]], d.tickets, { click: 1, empty: 'لا توجد تذاكر' }),
    err: () => table([['الوقت', e => fdt(e.time)], ['العطل', e => `<div class="small">${esc(e.message)}</div><div class="xs muted">${esc(e.source)} · ${esc(e.user || '')}</div>`], ['', e => e.resolved ? '<span class="badge b-su">معالج</span>' : '<span class="badge b-da">جديد</span>']], d.errors.slice().reverse(), { empty: 'لا توجد أعطال' }),
    bk: () => can('backups') ? `<div class="note t-pr mb">${ic('upload')} <div><b>إرسال نسخة احتياطية لهذا الجهاز</b><br><span class="small">ارفع ملف نسخة (rawaj-….json أو .json.gz) من جهازك، أو اختر «استعادة» على نسخة من القائمة. يُطلب من العميل التأكيد، ويُحفظ نسخة من بياناته الحالية تلقائياً قبل الاستعادة.</span>
        <div style="display:flex;gap:8px;align-items:center;margin-top:10px"><input type="file" class="in" id="rbF" accept=".json,.gz" style="flex:1"><button class="btn pr" id="rbUp">${ic('send', 'sm')} إرسال للجهاز</button></div></div></div>`
      + table([['الملف', b => `<span class="ltr small">${esc(b.name)}</span>`], ['الحجم', b => fsize(b.size)], ['التاريخ', b => fdt(b.time)], ['', b => `<a class="btn sec sm" href="/api/admin/backup/download?device=${d.deviceId}&name=${encodeURIComponent(b.name)}">${ic('download', 'sm')} تنزيل</a> <button class="btn sec sm" data-rb="${esc(b.name)}">${ic('refresh', 'sm')} استعادة على الجهاز</button>`]], d.backups, { empty: 'لم تصل نسخ احتياطية من هذا الجهاز بعد' }) : '<div class="note t-wa">ليست لديك صلاحية النسخ الاحتياطية</div>'
  };
  const show = k => {
    $$('#dt button', m.el).forEach(b => b.classList.toggle('on', b.dataset.t === k)); $('#dtb', m.el).innerHTML = tabs[k]();
    if (k === 'info' && $('#fZatca', m.el)) bindZatcaCard(m.el, d, () => { m.close(); deviceModal(d.deviceId); });
    if (k === 'info') $('#dSaveN', m.el).onclick = () => api('admin/device/update', { deviceId: d.deviceId, notes: $('#dNotes', m.el).value }).then(() => toast('تم الحفظ')).catch(fail);
    if (k === 'lic' && can('licenses')) bindLicenseForm(m.el, { deviceId: d.deviceId, serial: d.serial, onDone: () => { m.close(); deviceModal(id); } });
    if (k === 'tk') bindRows($('#dtb', m.el), d.tickets, t => ticketModal(t.id));
    if (k === 'bk' && can('backups')) {
      const sendRb = async (body, label) => {
        if (!await confirmBox('إرسال نسخة احتياطية للجهاز', `سيُطلب من العميل استعادة «${esc(label)}» وتستبدل بياناته الحالية بعد حفظ نسخة منها تلقائياً.`, true)) return;
        api('admin/device/push-backup', { deviceId: d.deviceId, ...body }).then(() => toast('تم الإرسال — تظهر للعميل خلال ثوانٍ إذا كان النظام مفتوحاً')).catch(fail);
      };
      $('#rbUp', m.el).onclick = async () => {
        const f = $('#rbF', m.el).files[0]; if (!f) return toast('اختر ملف النسخة أولاً', true);
        if (f.size > 80 * 1048576) return toast('الحد الأقصى 80 MB', true);
        sendRb({ fileName: f.name, data: await fileToDataURL(f) }, f.name);
      };
      $$('[data-rb]', m.el).forEach(x => x.onclick = () => sendRb({ fromName: x.dataset.rb }, x.dataset.rb));
    }
    if (k === 'use') $$('[data-upw]', m.el).forEach(b => b.onclick = () => {
      const pm = modal({ title: `كلمة مرور جديدة — ${esc(b.dataset.upw)}`, body: `<div class="field"><label>كلمة المرور الجديدة</label><div class="flex"><input class="in ltr" id="npw"><button class="btn sec sm" id="npg">توليد</button></div></div>`, footer: `<button class="btn pr" id="nps">${ic('send', 'sm')} حفظ وإرسال للنظام</button><button class="btn sec" data-x>إلغاء</button>` });
      $('#npg', pm.el).onclick = () => { const v = genPassword(); $('#npw', pm.el).value = v; copy(v); };
      $('#nps', pm.el).onclick = () => api('admin/device/push-password', { deviceId: d.deviceId, username: b.dataset.upw, password: $('#npw', pm.el).value }).then(() => { toast('سيتم تطبيق كلمة المرور في النظام عند المزامنة التالية'); pm.close(); }).catch(fail);
    });
  };
  $$('#dt button', m.el).forEach(b => b.onclick = () => show(b.dataset.t)); show('info');
  if ($('#dBz', m.el)) $('#dBz', m.el).onclick = () => bizModal(`إعداد النشاط التجاري — ${esc(co.name || d.serial)}`, { company: co.name, legalName: co.legalName, activity: co.activity, mobile: co.phone, email: co.email, city: co.city, vatNumber: co.vatNumber, crNumber: co.crNumber, ownerName: co.owner }, data => api('admin/device/settings', { deviceId: d.deviceId, settings: data }));
  if ($('#dN', m.el)) $('#dN', m.el).onclick = () => notifyModal([d.deviceId], co.name || d.serial);
  if ($('#dLo', m.el)) $('#dLo', m.el).onclick = async () => { if (!await confirmBox('تسجيل خروج عن بعد', 'سيتم إنهاء جلسة الدخول على هذا الجهاز عند المزامنة التالية (مفيد عند فقدان الجهاز أو تغيير الموظف).', true)) return; await api('admin/device/logout', { deviceId: d.deviceId }).then(() => toast('سيُنفذ عند المزامنة التالية')).catch(fail); };
  if ($('#dB', m.el)) $('#dB', m.el).onclick = async () => { if (!await confirmBox(d.blocked ? 'إلغاء الحظر' : 'حظر الجهاز', d.blocked ? 'سيعود الجهاز للعمل بشكل طبيعي.' : 'سيتم منع النظام من العمل على هذا الجهاز عند المزامنة التالية.', !d.blocked)) return; await api('admin/device/update', { deviceId: d.deviceId, blocked: !d.blocked }).catch(fail); m.close(); go(ROUTE); };
  if ($('#dDel', m.el)) $('#dDel', m.el).onclick = async () => { if (!await confirmBox('حذف الجهاز', 'سيُحذف الجهاز من اللوحة (سيظهر مجدداً إذا اتصل).', true)) return; await api('admin/device/delete', { deviceId: d.deviceId }).catch(fail); m.close(); go(ROUTE); };
}

/* ---------------- نموذج الاشتراك ---------------- */
function licenseForm(d) {
  return `<h4 class="mb">${d ? 'تفعيل / تعديل الاشتراك' : 'إصدار رمز تفعيل'}</h4>
    ${d ? '' : `<div class="field"><label>الرقم التسلسلي للجهاز</label><input class="in ltr" id="lSerial" placeholder="RWJ-XXXX-XXXX-XXXX-XXXX"></div><div class="field"><label>اسم العميل (اختياري)</label><input class="in" id="lCust"></div>`}
    <div class="field"><label>الباقة</label><div class="chips" id="lPlan">${[['monthly', 'شهري'], ['quarterly', 'ربع سنوي'], ['yearly', 'سنوي'], ['lifetime', 'دائم'], ['custom', 'مدة مخصصة'], ['revoked', 'إيقاف']].map(([k, l], i) => `<button class="chip ${i ? '' : 'on'}" data-p="${k}">${l}</button>`).join('')}</div></div>
    <div class="fg"><div class="field" id="lDaysF" hidden><label>عدد الأيام</label><input class="in num" type="number" id="lDays" value="30" min="1"></div><div class="field"><label>تاريخ البداية</label><input class="in ltr" type="date" id="lStart" lang="en-GB"><span class="xs muted">فارغ = من الآن</span></div></div>
    ${d && d.license && d.status.active ? '<label class="check mb"><input type="checkbox" id="lExt" checked> تمديد من تاريخ نهاية الاشتراك الحالي</label>' : ''}
    <div class="fg"><div class="field" id="lPriceF"><label>المبلغ المدفوع</label><input class="in num" type="number" min="0" id="lPrice" placeholder="${esc(priceOf('monthly'))}"><span class="xs muted">فارغ = سعر الباقة</span></div>
      <div class="field"><label>طريقة الدفع</label><select class="sel" id="lMethod">${['تحويل بنكي', 'نقدي', 'مدى / بطاقة', 'STC Pay', 'مجاني / تجربة', 'أخرى'].map(x => `<option>${x}</option>`).join('')}</select></div></div>
    <label class="check mb"><input type="checkbox" id="lPaid" checked> تم تحصيل المبلغ</label>
    <div class="field"><label>ملاحظة</label><input class="in" id="lNote" placeholder="مثال: دفع تحويل بنكي رقم ..."></div>
    <button class="btn pr" id="lGo">${ic('key', 'sm')} ${d ? 'تفعيل الاشتراك' : 'إصدار الرمز'}</button><div id="lOut" class="mt"></div>`;
}
function bindLicenseForm(root, { deviceId, accountId, onDone }) {
  let plan = 'monthly';
  if (!PRICES) api('admin/sales').then(r => { PRICES = r.prices; $('#lPrice', root).placeholder = priceOf(plan); }).catch(() => { });
  $$('#lPlan .chip', root).forEach(c => c.onclick = () => {
    plan = c.dataset.p; $$('#lPlan .chip', root).forEach(x => x.classList.toggle('on', x === c)); $('#lDaysF', root).hidden = plan !== 'custom';
    $('#lPrice', root).placeholder = priceOf(plan); $('#lPriceF', root).style.visibility = plan === 'revoked' ? 'hidden' : '';
  });
  $('#lGo', root).onclick = async () => {
    const free = $('#lMethod', root).value === 'مجاني / تجربة';
    const body = { plan, days: plan === 'custom' ? Number($('#lDays', root).value) : undefined, start: $('#lStart', root).value ? new Date($('#lStart', root).value + 'T00:00:00').toISOString() : '', note: $('#lNote', root).value,
      price: free ? 0 : $('#lPrice', root).value === '' ? undefined : $('#lPrice', root).value, method: $('#lMethod', root).value, paid: $('#lPaid', root).checked };
    if (plan === 'revoked' && !await confirmBox('إيقاف الاشتراك', 'سيتوقف النظام لدى العميل عند المزامنة التالية.', true)) return;
    try {
      let r;
      if (accountId) { body.id = accountId; body.extend = $('#lExt', root) ? $('#lExt', root).checked : false; r = await api('admin/account/license', body); r.license = { ...r.license, token: null }; }
      else if (deviceId) { body.deviceId = deviceId; body.extend = $('#lExt', root) ? $('#lExt', root).checked : false; r = await api('admin/device/license', body); }
      else { body.serial = $('#lSerial', root).value; body.customer = $('#lCust', root).value; r = await api('admin/license/code', body); }
      const L = r.license;
      if (!L.token) { toast('تم تفعيل اشتراك الحساب — يصل لأجهزة العميل تلقائياً عند المزامنة'); if (onDone) onDone(); return; }
      const text = `رمز تفعيل نظام رواج\nالباقة: ${L.label}\nينتهي: ${L.end ? fdate(L.end) : 'دائم'}\n\n${L.token}`;
      $('#lOut', root).innerHTML = `<div class="note t-su">${ic('check')} <div>تم ${deviceId ? 'تفعيل الاشتراك — يصل للعميل تلقائياً عند المزامنة التالية (خلال دقائق)' : 'إصدار رمز التفعيل'}. يمكنك أيضاً إرسال الرمز للعميل ليدخله يدوياً:</div></div>
        <div class="code" id="lTok">${esc(L.token)}</div><div class="flex mt"><button class="btn sec sm" id="lCp">${ic('copy', 'sm')} نسخ الرمز</button><a class="btn wa sm" target="_blank" href="https://wa.me/?text=${encodeURIComponent(text)}">${ic('wa', 'sm')} إرسال عبر واتساب</a>${onDone ? '<button class="btn gh sm" id="lDone">تم</button>' : ''}</div>`;
      $('#lCp', root).onclick = () => copy(L.token);
      if ($('#lDone', root)) $('#lDone', root).onclick = onDone;
      toast('تم بنجاح');
    } catch (e) { fail(e); }
  };
}

V.licenses = async el => {
  const { items } = await api('admin/devices');
  const licensed = items.filter(d => d.license);
  el.innerHTML = `<div class="grid" style="grid-template-columns:1fr 1.6fr"><div class="card"><div class="card-b">${licenseForm(null)}</div></div>
    <div class="card"><div class="card-h"><h3>الاشتراكات الحالية</h3><span class="small muted">${fnum(licensed.length)} اشتراك</span></div>
    ${table([['المنشأة', d => `<b>${esc((d.company || {}).name || '—')}</b><div class="xs muted ltr">${esc(d.serial)}</div>`], ['الباقة', d => statusBadge(d.status)], ['من', d => fdate(d.license.start)], ['إلى', d => d.license.end ? fdate(d.license.end) : 'دائم'], ['', d => `<button class="btn sec sm">إدارة</button>`]],
    licensed.sort((a, b) => (a.status.remainingDays ?? 1e9) - (b.status.remainingDays ?? 1e9)), { click: 1, empty: 'لا توجد اشتراكات بعد' })}</div></div>
    <div class="note t-in mt">${ic('shield')} <div>كل رمز تفعيل موقّع رقمياً بمفتاح خاص موجود في لوحة التحكم فقط، ومرتبط بالرقم التسلسلي للجهاز — لا يعمل على جهاز آخر ولا يمكن تعديله أو تزويره.</div></div>`;
  bindLicenseForm(el, {});
  bindRows($$('.card', el)[1], licensed, d => deviceModal(d.deviceId));
};

/* ---------------- الدعم الفني ---------------- */
const TF = { st: 'open', q: '' };
V.tickets = async el => {
  const { items } = await api('admin/tickets');
  el.innerHTML = `<div class="card"><div class="tb"><div class="chips" id="ts">${[['open', 'مفتوحة'], ['answered', 'تم الرد'], ['closed', 'مغلقة'], ['', 'الكل']].map(([k, l]) => `<button class="chip ${TF.st === k ? 'on' : ''}" data-k="${k}">${l} <span class="num">(${fnum(k ? items.filter(t => t.status === k).length : items.length)})</span></button>`).join('')}</div>
    <input class="in" id="q" placeholder="بحث" value="${esc(TF.q)}"></div><div id="tbl"></div></div>`;
  const draw = () => {
    const q = TF.q.trim().toLowerCase();
    const rows = items.filter(t => (!TF.st || t.status === TF.st) && (!q || [t.subject, t.company, t.userName, t.phone, t.serial, t.last].join(' ').toLowerCase().includes(q)));
    $('#tbl').innerHTML = table([
      ['', t => t.unread ? '<span class="dot on" title="جديد"></span>' : ''],
      ['الموضوع', t => `<b>${esc(t.subject)}</b>${t.source === 'website' ? ' <span class="badge b-in">من الموقع</span>' : ''}<div class="xs muted">${esc(t.last)}</div>`],
      ['العميل', t => `${esc(t.userName)}<div class="xs muted">${esc(t.company || '')}</div>`],
      ['الجوال', t => `<span class="ltr small">${esc(t.phone)}</span>`],
      ['التصنيف', t => `<span class="badge b-ne">${esc(t.category || 'عام')}</span>`],
      ['الحالة', t => ticketBadge(t.status)], ['آخر تحديث', t => `<span class="small">${ago(t.updated)}</span>`]
    ], rows, { click: 1, empty: 'لا توجد تذاكر', emptySub: 'رسائل العملاء من «خدمة العملاء» داخل النظام تظهر هنا' });
    bindRows($('#tbl'), rows, t => ticketModal(t.id));
  };
  $('#q').oninput = e => { TF.q = e.target.value; draw(); };
  $$('#ts .chip').forEach(c => c.onclick = () => { TF.st = c.dataset.k; $$('#ts .chip').forEach(x => x.classList.toggle('on', x === c)); draw(); });
  draw();
};
async function ticketModal(id) {
  const { item: t, device: dv } = await api('admin/ticket?id=' + id);
  const phone = (t.phone || '').replace(/[^\d]/g, '').replace(/^0/, '966');
  const live = t.deviceId !== 'website';  // محادثة مباشرة مع النظام (رسائل الموقع يُرد عليها بواتساب أو البريد)
  const msgHTML = x => `<div class="msg ${x.from}" data-mid="${x.id}">${esc(x.text)}${(x.images || []).map(n => `<img src="/api/admin/file?name=${encodeURIComponent(n)}" data-img>`).join('')}<div class="meta">${esc(x.name || '')} · ${fdt(x.time)}<span class="seen"></span></div></div>`;
  const m = modal({
    title: esc(t.subject), size: 'lg',
    body: `<div class="flex wrap mb small"><span>${esc(t.userName)}</span>·<span>${esc(t.company || '')}</span>·<span class="ltr">${esc(t.serial)}</span>·<span id="tSt">${ticketBadge(t.status)}</span>·${statusBadge(dv.status)}<span class="f1"></span>
        ${phone ? `<a class="btn wa sm" target="_blank" href="https://wa.me/${phone}">${ic('wa', 'sm')} واتساب العميل</a>` : ''}${t.email ? `<a class="btn sec sm" href="mailto:${esc(t.email)}">${ic('mail', 'sm')} بريد</a>` : ''}</div>
      <div class="chat" id="chat">${t.messages.map(msgHTML).join('')}</div><div class="typing" id="tTy" hidden><i></i><i></i><i></i> العميل يكتب الآن…</div>
      <div class="chat-in mt"><textarea class="ta" id="rp" rows="2" placeholder="${live ? 'اكتب ردك — يصل للعميل فوراً داخل المحادثة (Enter للإرسال، Shift+Enter لسطر جديد)' : 'اكتب ردك'}"></textarea><button class="btn pr" id="sR" title="إرسال">${ic('send', 'sm')}</button></div>
      ${live ? '<div class="xs muted mt"><span class="live-dot"></span> محادثة مباشرة — تتحدث تلقائياً</div>' : ''}`,
    footer: `<button class="btn sec" id="sC">${t.status === 'closed' ? 'إعادة فتح' : 'إغلاق التذكرة'}</button><span class="f1"></span>${live ? '<button class="btn sec" id="sD">بيانات الجهاز</button>' : '<span class="small muted">رسالة من الموقع — الرد عبر واتساب أو البريد</span>'}`
  });
  const ch = $('#chat', m.el), rp = $('#rp', m.el); ch.scrollTop = ch.scrollHeight; rp.focus();
  const bindImgs = () => $$('[data-img]', m.el).forEach(img => img.onclick = () => window.open(img.src, '_blank'));
  const seen = at => $$('.msg.admin', ch).forEach(x => { const msg = t.messages.find(y => y.id === x.dataset.mid); x.querySelector('.seen').textContent = msg && at && at > msg.time ? ' · ✓✓ قرأها العميل' : ''; });
  const merge = list => {
    const near = ch.scrollHeight - ch.scrollTop - ch.clientHeight < 80; let added = 0;
    list.forEach(x => { if (!t.messages.some(y => y.id === x.id)) { t.messages.push(x); ch.insertAdjacentHTML('beforeend', msgHTML(x)); added++; } });
    if (added) { bindImgs(); if (near) ch.scrollTop = ch.scrollHeight; }
    return added;
  };
  bindImgs(); seen(t.clientSeen);
  const send = async () => {
    const text = rp.value.trim(); if (!text) return;
    rp.value = ''; rp.focus();
    try { await api('admin/ticket/reply', { id, text, status: 'answered' }); await poll(); ch.scrollTop = ch.scrollHeight; if (ROUTE === 'tickets') go('tickets'); }
    catch (e) { rp.value = text; fail(e); }
  };
  $('#sR', m.el).onclick = send;
  let lastType = 0;
  rp.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } });
  rp.addEventListener('input', () => { if (live && Date.now() - lastType > 3000) { lastType = Date.now(); api('admin/ticket/typing', { id }).catch(() => { }); } });
  $('#sC', m.el).onclick = async () => { await api('admin/ticket/reply', { id, text: '', status: t.status === 'closed' ? 'open' : 'closed' }).catch(fail); m.close(); go(ROUTE); };
  if ($('#sD', m.el)) $('#sD', m.el).onclick = () => { m.close(); deviceModal(t.deviceId); };
  const poll = async () => {
    const r = await api('admin/ticket?live=1&id=' + id).catch(() => null); if (!r) return;
    if (merge(r.messages)) refreshBadges();
    t.status = r.status; $('#tSt', m.el).innerHTML = ticketBadge(r.status);
    $('#tTy', m.el).hidden = !r.clientTyping; seen(r.clientSeen);
  };
  if (live) { const timer = setInterval(() => { if (!document.contains(m.el)) return clearInterval(timer); if (!document.hidden) poll(); }, 3000); }
  refreshBadges();
}

/* ---------------- الأعطال ---------------- */
V.errors = async el => {
  const { items } = await api('admin/errors');
  let showResolved = false;
  el.innerHTML = `<div class="card"><div class="tb"><label class="check"><input type="checkbox" id="rs"> عرض المعالجة</label><span class="f1"></span>
    <button class="btn sec sm" id="ra">${ic('check', 'sm')} تعليم الكل كمعالج</button><button class="btn dg sm" id="rc">${ic('trash', 'sm')} حذف المعالجة</button></div><div id="tbl"></div></div>`;
  const draw = () => {
    const rows = items.filter(e => showResolved || !e.resolved);
    $('#tbl').innerHTML = table([
      ['الوقت', e => `<span class="small">${fdt(e.time)}</span>`],
      ['الجهاز', e => `${esc(e.company || '—')}<div class="xs muted ltr">${esc(e.serial)}</div>`],
      ['العطل', e => `<div class="small" style="max-width:520px">${esc(e.message)}</div><div class="xs muted">${esc(e.source)} ${e.url ? '· ' + esc(e.url) : ''} · ${esc(e.user || '')} · v${esc(e.appVersion || '')}</div>`],
      ['المستوى', e => `<span class="badge ${e.level === 'error' ? 'b-da' : 'b-in'}">${esc(e.level)}</span>`],
      ['', e => e.resolved ? '<span class="badge b-su">معالج</span>' : `<button class="btn sec sm" data-r="${e.id}">معالج</button>`]
    ], rows, { click: 1, empty: 'لا توجد أعطال', emptySub: 'أخطاء النظام لدى العملاء تُرسل هنا تلقائياً' });
    $$('[data-r]').forEach(b => b.onclick = async () => { await api('admin/errors/resolve', { ids: [b.dataset.r] }).catch(fail); items.find(e => e.id === b.dataset.r).resolved = true; draw(); });
    bindRows($('#tbl'), rows, e => modal({ title: 'تفاصيل العطل', size: 'lg', body: `<div class="kv mb"><div><div class="k">الجهاز</div><div class="v">${esc(e.company || '')} <span class="ltr">${esc(e.serial)}</span></div></div><div><div class="k">الوقت</div><div class="v">${fdt(e.time)}</div></div><div><div class="k">المستخدم</div><div class="v">${esc(e.user)}</div></div></div><b>${esc(e.message)}</b><div class="code mt" style="max-height:340px;white-space:pre-wrap">${esc(e.stack || 'لا يوجد تتبع')}</div>` }));
  };
  $('#rs').onchange = e => { showResolved = e.target.checked; draw(); };
  $('#ra').onclick = async () => { await api('admin/errors/resolve', { all: true }).catch(fail); go('errors'); refreshBadges(); };
  $('#rc').onclick = async () => { if (await confirmBox('حذف الأعطال المعالجة', 'سيتم حذفها نهائياً.', true)) { await api('admin/errors/clear', {}).catch(fail); go('errors'); } };
  draw();
};

/* ---------------- الإشعارات ---------------- */
function notifyModal(targets, label) {
  const m = modal({
    title: 'إرسال إشعار', body: `<div class="note t-in">${ic('bell')} <div>إلى: <b>${esc(label || 'جميع الأجهزة')}</b> — يظهر في جرس الإشعارات داخل النظام عند المزامنة التالية.</div></div>
      <div class="field"><label>العنوان</label><input class="in" id="nT" maxlength="200"></div><div class="field"><label>النص</label><textarea class="ta" id="nB" rows="4"></textarea></div>
      <div class="field"><label>النوع</label><div class="chips" id="nL">${[['info', 'معلومة'], ['success', 'خبر سار'], ['warning', 'تنبيه'], ['danger', 'هام جداً']].map(([k, l], i) => `<button class="chip ${i ? '' : 'on'}" data-l="${k}">${l}</button>`).join('')}</div></div>`,
    footer: `<button class="btn pr" id="nS">${ic('send', 'sm')} إرسال</button><button class="btn sec" data-x>إلغاء</button>`
  });
  let level = 'info'; $$('#nL .chip', m.el).forEach(c => c.onclick = () => { level = c.dataset.l; $$('#nL .chip', m.el).forEach(x => x.classList.toggle('on', x === c)); });
  $('#nS', m.el).onclick = async () => { try { await api('admin/notifications/send', { title: $('#nT', m.el).value, body: $('#nB', m.el).value, level, targets: targets || ['all'] }); toast('تم إرسال الإشعار'); m.close(); if (ROUTE === 'notifications') go('notifications'); } catch (e) { fail(e); } };
}
V.notifications = async el => {
  const { items } = await api('admin/notifications');
  const { items: devs } = can('devices') ? await api('admin/devices') : { items: [] };
  const name = id => id === 'all' ? 'جميع الأجهزة' : esc(((devs.find(d => d.deviceId === id) || {}).company || {}).name || id.slice(0, 8));
  el.innerHTML = `<div class="flex mb"><button class="btn pr" id="nAll">${ic('send', 'sm')} إشعار لجميع الأجهزة</button>${can('devices') ? `<button class="btn sec" id="nSel">${ic('devices', 'sm')} إشعار لأجهزة محددة</button>` : ''}</div>
    <div class="card">${table([['العنوان', n => `<b>${esc(n.title)}</b><div class="xs muted">${esc(n.body).slice(0, 160)}</div>`], ['إلى', n => name(n.target)], ['النوع', n => `<span class="badge ${{ info: 'b-in', success: 'b-su', warning: 'b-wa', danger: 'b-da' }[n.level] || 'b-ne'}">${esc(n.level)}</span>`], ['بواسطة', n => esc(n.by)], ['التاريخ', n => fdt(n.created)], ['', n => `<button class="ib" data-d="${n.id}">${ic('trash', 'sm')}</button>`]], items, { empty: 'لم تُرسل إشعارات بعد' })}</div>`;
  $('#nAll').onclick = () => notifyModal(['all']);
  if ($('#nSel')) $('#nSel').onclick = () => {
    const m = modal({ title: 'اختر الأجهزة', size: 'lg', body: `<input class="in mb" id="sq" placeholder="بحث"><div id="sl" style="max-height:50vh;overflow:auto;display:grid;gap:6px"></div>`, footer: `<button class="btn pr" id="sN">التالي</button><button class="btn sec" data-x>إلغاء</button>` });
    const drawL = () => { const q = $('#sq', m.el).value.toLowerCase(); $('#sl', m.el).innerHTML = devs.filter(d => !q || JSON.stringify([d.serial, d.company]).toLowerCase().includes(q)).map(d => `<label class="check"><input type="checkbox" value="${d.deviceId}"> ${esc((d.company || {}).name || 'بدون اسم')} <span class="ltr xs muted">${esc(d.serial)}</span></label>`).join(''); };
    $('#sq', m.el).oninput = drawL; drawL();
    $('#sN', m.el).onclick = () => { const ids = $$('#sl input:checked', m.el).map(x => x.value); if (!ids.length) return toast('اختر جهازاً واحداً على الأقل', true); m.close(); notifyModal(ids, ids.length + ' جهاز'); };
  };
  $$('[data-d]').forEach(b => b.onclick = async () => { if (await confirmBox('حذف الإشعار', 'لن يظهر للأجهزة التي لم تستلمه بعد.', true)) { await api('admin/notifications/delete', { id: b.dataset.d }).catch(fail); go('notifications'); } });
};

/* ---------------- التحديثات ---------------- */
V.updates = async el => {
  const { items } = await api('admin/updates');
  el.innerHTML = `<div class="grid" style="grid-template-columns:1fr 1.6fr"><div class="card"><div class="card-h"><h3>رفع تحديث جديد</h3></div><div class="card-b">
      <div class="field"><label>رقم الإصدار</label><input class="in ltr" id="uV" placeholder="3.1.0"></div>
      <div class="field"><label>ملف التحديث (zip / exe)</label><input class="in" type="file" id="uF" style="padding-top:7px"></div>
      <div class="field"><label>ما الجديد؟</label><textarea class="ta" id="uN" rows="5" placeholder="• ميزة جديدة...&#10;• إصلاح..."></textarea></div>
      <label class="check mb"><input type="checkbox" id="uM"> تحديث إجباري (يظهر للعميل بشكل بارز)</label>
      <button class="btn pr" id="uGo">${ic('upload', 'sm')} نشر التحديث</button><div class="xs muted mt">يظهر إشعار «تحديث متوفر» لدى جميع العملاء الذين يعملون بإصدار أقدم.</div></div></div>
    <div class="card"><div class="card-h"><h3>الإصدارات المنشورة</h3></div>${table([['الإصدار', u => `<b class="ltr">${esc(u.version)}</b>${u.mandatory ? ' <span class="badge b-da">إجباري</span>' : ''}`], ['الملف', u => `<span class="small ltr">${esc(u.originalName)}</span><div class="xs muted">${fsize(u.size)}</div>`], ['التنزيلات', u => fnum(u.downloads)], ['التاريخ', u => fdt(u.created)], ['', u => `<a class="ib" href="/api/client/update/${u.id}">${ic('download', 'sm')}</a><button class="ib" data-d="${u.id}">${ic('trash', 'sm')}</button>`]], items, { empty: 'لا توجد تحديثات منشورة' })}</div></div>`;
  $('#uGo').onclick = async () => {
    const f = $('#uF').files[0]; if (!f) return toast('اختر الملف', true);
    if (f.size > 150 * 1048576) return toast('الحد الأقصى 150MB', true);
    $('#uGo').disabled = true; $('#uGo').textContent = 'جارٍ الرفع…';
    try { await api('admin/updates/upload', { version: $('#uV').value, notes: $('#uN').value, mandatory: $('#uM').checked, fileName: f.name, data: await fileToDataURL(f) }); toast('تم نشر التحديث'); go('updates'); }
    catch (e) { fail(e); $('#uGo').disabled = false; $('#uGo').textContent = 'نشر التحديث'; }
  };
  $$('[data-d]').forEach(b => b.onclick = async () => { if (await confirmBox('حذف التحديث', 'سيُحذف الملف ولن يظهر للعملاء.', true)) { await api('admin/updates/delete', { id: b.dataset.d }).catch(fail); go('updates'); } });
};

/* ---------------- النسخ الاحتياطية ---------------- */
V.backups = async el => {
  const { items } = await api('admin/backups');
  el.innerHTML = `<div class="note t-in">${ic('db')} <div>يرفع النظام لدى كل عميل آخر نسخة احتياطية مرة يومياً (مضغوطة)، ويُحتفظ بآخر 30 نسخة لكل جهاز. يمكن للعميل إيقاف هذه الميزة من إعداداته.</div></div>
    <div class="card">${table([['المنشأة', b => `<b>${esc(b.company || '—')}</b><div class="xs muted ltr">${esc(b.serial)}</div>`], ['آخر نسخة', b => `${fdt(b.latest.time)} <span class="xs muted">(${ago(b.latest.time)})</span>`], ['الحجم', b => fsize(b.latest.size)], ['عدد النسخ', b => fnum(b.count)],
    ['', b => `<a class="btn pr sm" href="/api/admin/backup/download?device=${b.deviceId}&name=${encodeURIComponent(b.latest.name)}">${ic('download', 'sm')} تنزيل الأحدث</a> <button class="btn sec sm" data-dv="${b.deviceId}">كل النسخ</button>`]], items, { empty: 'لم تصل نسخ احتياطية بعد' })}</div>`;
  $$('[data-dv]').forEach(b => b.onclick = () => deviceModal(b.dataset.dv).then(() => { const t = $('#dt button[data-t=bk]'); if (t) t.click(); }));
};

/* ---------------- فريق العمل ---------------- */
V.staff = async el => {
  const { items, perms } = await api('admin/staff');
  el.innerHTML = `<div class="flex mb"><button class="btn pr" id="sAdd">${ic('plus', 'sm')} موظف جديد</button><span class="small muted">الموظفون يدخلون بصلاحيات محددة فقط — إدارة الموظفين والإعدادات وسجل العمليات للمالك فقط.</span></div>
    <div class="card">${table([['الموظف', s => `<b>${esc(s.name)}</b><div class="xs muted ltr">${esc(s.username)}${s.email ? ' · ' + esc(s.email) : ''}</div>`], ['الصلاحيات', s => `<div class="chips">${s.perms.map(p => `<span class="badge b-pr">${esc(perms[p])}</span>`).join('') || '<span class="muted">لا شيء</span>'}</div>`], ['الحالة', s => s.active ? '<span class="badge b-su">نشط</span>' : '<span class="badge b-ne">موقوف</span>'], ['آخر دخول', s => fdt(s.lastLogin)], ['', s => `<button class="ib" data-e="${s.id}">${ic('edit', 'sm')}</button><button class="ib" data-d="${s.id}">${ic('trash', 'sm')}</button>`]], items, { empty: 'لا يوجد موظفون', emptySub: 'أضف حسابات لفريق الدعم بصلاحيات محددة' })}</div>`;
  const form = s => {
    const m = modal({
      title: s ? 'تعديل موظف' : 'موظف جديد', size: 'lg',
      body: `<div class="fg"><div class="field"><label>الاسم</label><input class="in" id="fN" value="${esc(s ? s.name : '')}"></div><div class="field"><label>اسم الدخول</label><input class="in ltr" id="fU" value="${esc(s ? s.username : '')}"></div>
        <div class="field"><label>البريد (لاستعادة كلمة المرور)</label><input class="in ltr" id="fE" value="${esc(s ? s.email : '')}"></div><div class="field"><label>كلمة المرور ${s ? '(فارغ = بدون تغيير)' : ''}</label><input class="in ltr" id="fP" type="password" autocomplete="new-password"></div></div>
        <div class="field"><label>الصلاحيات</label><div class="grid g2" style="gap:8px">${Object.entries(perms).map(([k, l]) => `<label class="check"><input type="checkbox" value="${k}" ${s && s.perms.includes(k) ? 'checked' : ''}> ${l}</label>`).join('')}</div></div>
        <label class="check"><input type="checkbox" id="fA" ${!s || s.active ? 'checked' : ''}> الحساب نشط</label>`,
      footer: `<button class="btn pr" id="fS">${ic('check', 'sm')} حفظ</button><button class="btn sec" data-x>إلغاء</button>`
    });
    $('#fS', m.el).onclick = async () => { try { await api('admin/staff/save', { id: s && s.id, name: $('#fN', m.el).value, username: $('#fU', m.el).value, email: $('#fE', m.el).value, password: $('#fP', m.el).value, active: $('#fA', m.el).checked, perms: $$('.grid input:checked', m.el).map(x => x.value) }); toast('تم الحفظ'); m.close(); go('staff'); } catch (e) { fail(e); } };
  };
  $('#sAdd').onclick = () => form(null);
  $$('[data-e]').forEach(b => b.onclick = () => form(items.find(s => s.id === b.dataset.e)));
  $$('[data-d]').forEach(b => b.onclick = async () => { if (await confirmBox('حذف الموظف', 'لن يتمكن من الدخول بعد الآن.', true)) { await api('admin/staff/delete', { id: b.dataset.d }).catch(fail); go('staff'); } });
};

/* ---------------- سجل العمليات ---------------- */
V.audit = async el => {
  const { items } = await api('admin/audit');
  el.innerHTML = `<div class="card">${table([['الوقت', a => `<span class="small">${fdt(a.time)}</span>`], ['المستخدم', a => esc(a.who)], ['العملية', a => `<span class="badge b-pr">${esc(a.action)}</span>`], ['التفاصيل', a => `<span class="small">${esc(a.details)}</span>`]], items, { empty: 'لا توجد عمليات' })}</div>`;
};

/* ---------------- الإعدادات والحساب ---------------- */
V.settings = async el => {
  const s = ME.owner ? await api('admin/settings') : null;
  el.innerHTML = `<div class="grid g2">
    <div class="card"><div class="card-h"><h3>${ic('lock')} تغيير كلمة المرور</h3></div><div class="card-b">
      <div class="field"><label>كلمة المرور الحالية</label><input class="in ltr" type="password" id="p0"></div>
      <div class="field"><label>كلمة المرور الجديدة</label><input class="in ltr" type="password" id="p1" autocomplete="new-password"><span class="xs muted">10 أحرف على الأقل</span></div>
      <div class="field"><label>تأكيد كلمة المرور</label><input class="in ltr" type="password" id="p2"></div>
      <div class="flex"><button class="btn pr" id="pS">حفظ</button><button class="btn sec" id="pG">توليد كلمة قوية</button></div>
      <div class="xs muted mt">نسيت كلمة المرور؟ من شاشة الدخول اضغط «نسيت كلمة المرور» ليصلك رابط استعادة آمن على بريدك (عبر Firebase).</div></div></div>
    ${s ? `<div class="card"><div class="card-h"><h3>${ic('mail')} البريد الإلكتروني للمالك</h3></div><div class="card-b">
      <div class="field"><label>البريد الحالي</label><input class="in ltr" value="${esc(s.email)}" disabled></div>
      <div class="field"><label>البريد الجديد</label><input class="in ltr" id="e1"></div><div class="field"><label>كلمة المرور الحالية للتأكيد</label><input class="in ltr" type="password" id="e0"></div>
      <button class="btn pr" id="eS">تغيير البريد</button></div></div>
    <div class="card"><div class="card-h"><h3>${ic('send')} إعداد البريد الصادر (رموز الاستعادة)</h3></div><div class="card-b">
      <div class="note t-in" style="font-size:12.5px">${ic('alert', 'sm')} <div>لـ Gmail: فعّل التحقق بخطوتين ثم أنشئ «كلمة مرور التطبيقات» من إعدادات حساب Google واستخدمها هنا. لاحقاً يمكن استبدال ذلك بـ Firebase Authentication.</div></div>
      <div class="fg"><div class="field"><label>خادم SMTP</label><input class="in ltr" id="sH" value="${esc(s.smtp.host)}"></div><div class="field"><label>المنفذ</label><input class="in ltr" id="sP" value="${esc(s.smtp.port)}"></div>
      <div class="field"><label>اسم المستخدم (البريد)</label><input class="in ltr" id="sU" value="${esc(s.smtp.user)}"></div><div class="field"><label>كلمة مرور التطبيقات</label><input class="in ltr" type="password" id="sW" value="${esc(s.smtp.password)}"></div></div>
      <div class="flex"><button class="btn pr" id="sS">حفظ</button><button class="btn sec" id="sT">إرسال بريد تجريبي</button></div></div></div>
    <div class="card"><div class="card-h"><h3>${ic('shield')} الأمان والبيانات</h3></div><div class="card-b">
      <div class="kv mb"><div><div class="k">بصمة مفتاح التوقيع</div><div class="v ltr">${esc(s.keyFingerprint)}</div></div><div><div class="k">عنوان اللوحة</div><div class="v ltr small">${esc(location.origin)}</div></div></div>
      <div class="field"><label>الاسم الظاهر للمالك</label><input class="in" id="oN" value="${esc(s.name || '')}"></div>
      <div class="flex"><button class="btn sec" id="oS">حفظ الاسم</button><a class="btn sec" href="/api/admin/export">${ic('download', 'sm')} تصدير بيانات اللوحة</a></div>
      <div class="xs muted mt">⚠️ احتفظ بنسخة من المجلد <span class="ltr">keys</span> في مكان آمن — بدونه لا يمكن إصدار رموز تفعيل يقبلها النظام.</div></div></div>
    <div class="card"><div class="card-h"><h3>${ic('shield')} الفوترة الإلكترونية (هيئة الزكاة)</h3></div><div class="card-b">
      <div class="field"><label>طلبات التفعيل من النظام تصل إلى</label><select class="in" id="zReqTo"><option value="panel" ${s.zatcaRequestTo !== 'whatsapp' ? 'selected' : ''}>لوحة التحكم (رسائل الدعم الفني)</option><option value="whatsapp" ${s.zatcaRequestTo === 'whatsapp' ? 'selected' : ''}>واتساب</option></select></div>
      <label class="check" style="display:flex;gap:10px;align-items:center"><input type="checkbox" id="zDefOn" ${s.featuresDefault.zatca ? 'checked' : ''}> تفعيل الفوترة الإلكترونية تلقائياً لكل الأجهزة الجديدة</label>
      <label class="check mt" style="display:flex;gap:10px;align-items:center"><input type="checkbox" id="zDefSetup" ${s.featuresDefault.zatcaSetup !== false ? 'checked' : ''}> السماح افتراضياً للعميل بفتح إعدادات الربط من النظام</label>
      <div class="xs muted mt">يمكن تخصيص كل جهاز من «الأجهزة ← بيانات الجهاز»، ومنها أيضاً ربط الجهاز بالهيئة عن بُعد.</div>
      <button class="btn pr mt" id="zSave">حفظ</button></div></div>
    <div class="card" id="mongoCard" style="grid-column:1/-1"></div><div class="card" id="pbCard"></div><div class="card" id="msgCard" style="grid-column:1/-1"></div>` : ''}</div>`;
  $('#pG').onclick = () => { const a = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%'; const v = Array.from(crypto.getRandomValues(new Uint32Array(22)), x => a[x % a.length]).join(''); $('#p1').type = $('#p2').type = 'text'; $('#p1').value = $('#p2').value = v; copy(v); };
  $('#pS').onclick = async () => { if ($('#p1').value !== $('#p2').value) return toast('كلمتا المرور غير متطابقتين', true); try { await api('admin/account/password', { current: $('#p0').value, password: $('#p1').value }); toast('تم تغيير كلمة المرور'); ['#p0', '#p1', '#p2'].forEach(x => $(x).value = ''); } catch (e) { fail(e); } };
  if (!s) return;
  mongoCard($('#mongoCard')).catch(fail);
  panelBackupCard($('#pbCard')).catch(fail);
  messagesCard($('#msgCard')).catch(fail);
  $('#eS').onclick = async () => { try { await api('admin/account/email', { email: $('#e1').value, current: $('#e0').value }); toast('تم تغيير البريد'); ME.email = $('#e1').value; renderShell(); go('settings'); } catch (e) { fail(e); } };
  const smtp = () => ({ smtp: { host: $('#sH').value, port: $('#sP').value, user: $('#sU').value, password: $('#sW').value, from: $('#sU').value } });
  $('#sS').onclick = () => api('admin/settings/save', smtp()).then(() => toast('تم الحفظ')).catch(fail);
  $('#zSave').onclick = () => api('admin/settings/save', { zatcaRequestTo: $('#zReqTo').value, featuresDefault: { zatca: $('#zDefOn').checked, zatcaSetup: $('#zDefSetup').checked } }).then(() => toast('تم الحفظ — يصل للأجهزة خلال ثوانٍ')).catch(fail);
  $('#sT').onclick = async () => { try { await api('admin/settings/save', smtp()); await api('admin/settings/test-mail', {}); toast('تم الإرسال — تحقق من بريدك'); } catch (e) { fail(e); } };
  $('#oS').onclick = () => api('admin/settings/save', { name: $('#oN').value }).then(() => { ME.name = $('#oN').value; renderShell(); go('settings'); toast('تم الحفظ'); }).catch(fail);
};

/* =====================================================================
   الإقلاع
   ===================================================================== */
async function boot() {
  // فتح رابط الاستعادة القادم من بريد Firebase
  const q = new URLSearchParams(location.search);
  if (q.get('oobCode') && q.get('reset')) return renderAuth('link', q.get('e') || '', q.get('oobCode'));
  try { const r = await api('auth/me'); ME = r.user; } catch (e) { ME = null; }
  if (!ME) return renderAuth();
  renderShell();
  let r = 'overview'; try { r = sessionStorage.getItem('rp_route') || 'overview'; } catch (e) { }
  go(r); refreshBadges();
}
setInterval(() => { if (ME) refreshBadges(); }, 60000);
boot();

/* =====================================================================
   إعداد النشاط التجاري للعميل (نموذج مشترك: حساب / جهاز)
   ===================================================================== */
const BIZ_GROUPS = [
  ['هوية المنشأة', [['company', 'الاسم التجاري *'], ['companyEn', 'الاسم بالإنجليزية', 1], ['legalName', 'الاسم القانوني'], ['activity', 'نوع النشاط'], ['ownerName', 'اسم المالك / المسؤول'], ['branchName', 'اسم الفرع']]],
  ['التواصل والعنوان', [['mobile', 'الجوال', 1], ['phone', 'الهاتف', 1], ['email', 'البريد', 1], ['website', 'الموقع', 1], ['country', 'الدولة'], ['city', 'المدينة'], ['district', 'الحي'], ['street', 'الشارع'], ['buildingNo', 'رقم المبنى', 1], ['additionalNo', 'الرقم الإضافي', 1], ['postalCode', 'الرمز البريدي', 1], ['address', 'تفاصيل العنوان']]],
  ['الرسمي والبنكي', [['vatNumber', 'الرقم الضريبي', 1], ['crNumber', 'السجل التجاري', 1], ['bankName', 'البنك'], ['accountName', 'اسم صاحب الحساب'], ['iban', 'الآيبان', 1]]]
];
function bizForm(cur) {
  cur = cur || {};
  return BIZ_GROUPS.map(([g, fields]) => `<h4 class="mt mb">${g}</h4><div class="fg">${fields.map(([k, l, ltr]) => `<div class="field"><label>${l}</label><input class="in ${ltr ? 'ltr' : ''}" data-bz="${k}" value="${esc(cur[k] == null ? '' : cur[k])}"></div>`).join('')}</div>`).join('')
    + `<h4 class="mt mb">الضريبة والعملة</h4><div class="fg"><div class="field"><label>العملة</label><select class="sel" data-bz="currency">${['ر.س', 'د.إ', 'د.ك', 'ر.ق', 'د.ب', 'ر.ع', 'ج.م', 'د.أ', '$'].map(c => `<option ${c === (cur.currency || 'ر.س') ? 'selected' : ''}>${c}</option>`).join('')}</select></div>
      <div class="field"><label>نسبة الضريبة %</label><input class="in num" type="number" data-bz="vatRate" value="${cur.vatRate == null ? 15 : esc(cur.vatRate)}"></div></div>
      <label class="check mb"><input type="checkbox" data-bz="vatEnabled" ${cur.vatEnabled === false ? '' : 'checked'}> تفعيل ضريبة القيمة المضافة</label>
      <label class="check"><input type="checkbox" data-bz="pricesIncludeVat" ${cur.pricesIncludeVat === false ? '' : 'checked'}> أسعار البيع شاملة الضريبة</label>`;
}
function readBiz(root) {
  const out = {};
  $$('[data-bz]', root).forEach(i => { out[i.dataset.bz] = i.type === 'checkbox' ? i.checked : i.type === 'number' ? Number(i.value) || 0 : i.value.trim(); });
  return out;
}
function bizModal(title, cur, onSave) {
  const m = modal({
    title, size: 'lg', body: `<div class="note t-in">${ic('settings')} <div>تُرسل البيانات للنظام لدى العميل عند المزامنة التالية (خلال دقائق) وتُعتمد كإعداد للمنشأة — لن يُطلب منه معالج الإعداد.</div></div>${bizForm(cur)}`,
    footer: `<button class="btn pr" id="bzS">${ic('send', 'sm')} حفظ وإرسال للنظام</button><button class="btn sec" data-x>إلغاء</button>`
  });
  $('#bzS', m.el).onclick = async () => { const d = readBiz(m.el); if (!d.company) return toast('اسم المنشأة مطلوب', true); try { await onSave(d); toast('تم الحفظ — سيُطبق لدى العميل عند المزامنة'); m.close(); } catch (e) { fail(e); } };
}

/* =====================================================================
   حسابات العملاء
   ===================================================================== */
let PRICES = null;
const priceOf = plan => PRICES && PRICES[plan] != null ? PRICES[plan] : '';
const money = v => `<span class="num">${(Number(v) || 0).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}</span> ${esc((PRICES || {}).currency || 'ر.س')}`;
function genPassword() { const a = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789'; return Array.from(crypto.getRandomValues(new Uint32Array(10)), x => a[x % a.length]).join(''); }
V.accounts = async el => {
  const { items, prices } = await api('admin/accounts'); PRICES = prices;
  let q = '';
  el.innerHTML = `<div class="flex mb"><button class="btn pr" id="aNew">${ic('plus', 'sm')} حساب عميل جديد</button><button class="btn sec" id="aCsv">${ic('download', 'sm')} تصدير Excel</button><span class="small muted">يدخل العميل للنظام برقم الجوال وكلمة المرور، ويُفعَّل اشتراكه مباشرة من هنا.</span></div>
    <div class="card"><div class="tb"><input class="in" id="aq" placeholder="بحث بالاسم أو الجوال" style="min-width:300px"><span class="f1"></span><span class="small muted">${fnum(items.length)} حساب</span></div><div id="tbl"></div></div>`;
  const draw = () => {
    const rows = items.filter(a => !q || (a.name + a.phone + (a.email || '')).toLowerCase().includes(q));
    $('#tbl').innerHTML = table([
      ['العميل', a => `<b>${esc(a.name)}</b>${a.active ? '' : ' <span class="badge b-da">موقوف</span>'}<div class="xs muted">${esc((a.settings || {}).company || 'لم يُعد النشاط بعد')}</div>`],
      ['رقم الجوال (الدخول)', a => `<span class="ltr">${esc(a.phone)}</span>`],
      ['كلمة المرور', a => ME.owner ? `<span class="pw-cell" data-pw="${a.id}"><span class="ltr">••••••••</span> <button class="ib" title="إظهار">${ic('eye', 'sm')}</button></span>` : '<span class="muted">مخفية</span>'],
      ['الاشتراك', a => a.license ? statusBadge(a.status) : '<span class="badge b-ne">غير مفعّل</span>'],
      ['الأجهزة', a => `${fnum(a.deviceList.length)} / ${fnum(a.maxDevices)}`],
      ['آخر دخول', a => `<span class="small">${ago(a.lastLogin)}</span>`],
      ['', a => `<button class="btn sec sm" data-m="${a.id}">إدارة</button>`]
    ], rows, { empty: 'لا توجد حسابات بعد', emptySub: 'أضف حساباً لعميل وفعّل اشتراكه — يدخل به من شاشة الدخول في النظام' });
    $$('[data-m]').forEach(b => b.onclick = () => accountModal(items.find(a => a.id === b.dataset.m)));
    $$('[data-pw] button').forEach(b => b.onclick = async () => { const c = b.closest('[data-pw]'); try { const r = await api('admin/account/password?id=' + c.dataset.pw); c.innerHTML = `<span class="ltr bold">${esc(r.password || '—')}</span> <button class="ib" title="نسخ">${ic('copy', 'sm')}</button>`; $('button', c).onclick = () => copy(r.password); } catch (e) { fail(e); } });
  };
  $('#aq').oninput = e => { q = e.target.value.trim().toLowerCase(); draw(); };
  $('#aNew').onclick = () => accountForm(null);
  $('#aCsv').onclick = () => {
    const qv = x => `"${String(x == null ? '' : x).replace(/"/g, '""')}"`;
    const csv = '\ufeff' + [['العميل', 'الجوال', 'البريد', 'المنشأة', 'الباقة', 'من', 'إلى', 'الأجهزة', 'آخر دخول', 'الحالة'], ...items.map(a => [a.name, a.phone, a.email, (a.settings || {}).company, (a.license || {}).label, fdate((a.license || {}).start), a.license ? (a.license.end ? fdate(a.license.end) : 'دائم') : '', a.deviceList.length + '/' + a.maxDevices, fdt(a.lastLogin), a.active ? 'نشط' : 'موقوف'])].map(r => r.map(qv).join(',')).join('\r\n');
    const x = document.createElement('a'); x.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' })); x.download = `حسابات-العملاء-${new Date().toISOString().slice(0, 10)}.csv`; x.click();
  };
  draw();
};
function accountForm(a) {
  const m = modal({
    title: a ? 'تعديل حساب العميل' : 'حساب عميل جديد', size: 'lg',
    body: `<div class="fg"><div class="field"><label>اسم العميل / المنشأة</label><input class="in" id="fN" value="${esc(a ? a.name : '')}"></div>
      <div class="field"><label>رقم الجوال (اسم الدخول)</label><input class="in ltr" id="fP" value="${esc(a ? a.phone : '')}" placeholder="05xxxxxxxx"></div>
      <div class="field"><label>كلمة المرور ${a ? '(فارغ = بدون تغيير)' : ''}</label><div class="flex"><input class="in ltr" id="fW" autocomplete="new-password"><button class="btn sec sm" id="fG" type="button">توليد</button></div></div>
      <div class="field"><label>البريد الإلكتروني</label><input class="in ltr" id="fE" value="${esc(a ? a.email || '' : '')}"></div>
      <div class="field"><label>عدد الأجهزة المسموح</label><input class="in num" type="number" min="1" max="50" id="fD" value="${a ? a.maxDevices : 1}"></div>
      <div class="field"><label>ملاحظات</label><input class="in" id="fNo" value="${esc(a ? a.notes || '' : '')}"></div></div>
      <label class="check mb"><input type="checkbox" id="fA" ${!a || a.active ? 'checked' : ''}> الحساب نشط</label>
      ${a ? '' : `<h4 class="mt mb">تفعيل الاشتراك مباشرة</h4><div class="chips" id="fPl">${[['', 'لاحقاً'], ['monthly', 'شهري'], ['quarterly', 'ربع سنوي'], ['yearly', 'سنوي'], ['lifetime', 'دائم']].map(([k, l], i) => `<button type="button" class="chip ${i ? '' : 'on'}" data-p="${k}">${l}</button>`).join('')}</div>
        <div class="fg mt"><div class="field"><label>المبلغ المدفوع</label><input class="in num" type="number" id="fPr" placeholder="حسب الباقة"></div><div class="field"><label>طريقة الدفع</label><select class="sel" id="fMt">${['تحويل بنكي', 'نقدي', 'مدى / بطاقة', 'STC Pay', 'أخرى'].map(x => `<option>${x}</option>`).join('')}</select></div></div>`}`,
    footer: `<button class="btn pr" id="fS">${ic('check', 'sm')} حفظ</button><button class="btn sec" data-x>إلغاء</button>`
  });
  let plan = '';
  $('#fG', m.el).onclick = () => { const v = genPassword(); $('#fW', m.el).value = v; copy(v); };
  $$('#fPl .chip', m.el).forEach(c => c.onclick = () => { plan = c.dataset.p; $$('#fPl .chip', m.el).forEach(x => x.classList.toggle('on', x === c)); $('#fPr', m.el).placeholder = plan ? priceOf(plan) : 'حسب الباقة'; });
  $('#fS', m.el).onclick = async () => {
    const body = { id: a && a.id, name: $('#fN', m.el).value, phone: $('#fP', m.el).value, password: $('#fW', m.el).value, email: $('#fE', m.el).value, maxDevices: $('#fD', m.el).value, notes: $('#fNo', m.el).value, active: $('#fA', m.el).checked };
    if (!a && plan) Object.assign(body, { plan, price: $('#fPr', m.el).value === '' ? undefined : $('#fPr', m.el).value, method: $('#fMt', m.el).value, paid: true });
    try {
      await api('admin/account/save', body); m.close();
      if (!a) {
        const text = `مرحباً ${body.name}\nبيانات الدخول لنظام رواج لإدارة الأعمال:\nرقم الجوال: ${body.phone}\nكلمة المرور: ${body.password}\n\nمن شاشة الدخول اكتب رقم الجوال وكلمة المرور.`;
        modal({ title: 'تم إنشاء الحساب', body: `<div class="note t-su">${ic('check')} <div>أرسل بيانات الدخول للعميل:</div></div><div class="code" style="white-space:pre-wrap;direction:rtl;text-align:right">${esc(text)}</div>`,
          footer: `<button class="btn sec" id="cpT">${ic('copy', 'sm')} نسخ</button><a class="btn wa" target="_blank" href="https://wa.me/${body.phone.replace(/\D/g, '').replace(/^0/, '966')}?text=${encodeURIComponent(text)}">${ic('wa', 'sm')} إرسال للعميل عبر واتساب</a><button class="btn gh" data-x>إغلاق</button>`,
          onMount: el => { $('#cpT', el).onclick = () => copy(text); } });
      } else toast('تم الحفظ');
      go('accounts');
    } catch (e) { fail(e); }
  };
}
function accountModal(a) {
  const m = modal({
    title: `${esc(a.name)} <span class="badge b-ne ltr">${esc(a.phone)}</span>`, size: 'xl',
    body: `<div class="grid g2"><div>
        <h4 class="mb">الاشتراك</h4><div class="kv mb"><div><div class="k">الحالة</div><div class="v">${a.license ? statusBadge(a.status) : 'غير مفعّل'}</div></div><div><div class="k">من</div><div class="v">${fdate((a.license || {}).start)}</div></div>
          <div><div class="k">إلى</div><div class="v">${a.license ? (a.license.end ? fdate(a.license.end) : 'دائم') : '—'}</div></div><div><div class="k">الأجهزة</div><div class="v">${fnum(a.deviceList.length)} / ${fnum(a.maxDevices)}</div></div></div>
        <h4 class="mb">الأجهزة المرتبطة</h4>${table([['الجهاز', d => `<span class="ltr small">${esc(d.serial || '')}</span><div class="xs muted">${esc(d.computer || '')}</div>`], ['آخر اتصال', d => `<span class="small">${ago(d.lastSeen)}</span>`], ['', d => `<button class="btn sec sm" data-dv="${d.deviceId}">فتح</button> <button class="btn dg sm" data-ub="${d.deviceId}">فك الربط</button>`]], a.deviceList, { empty: 'لم يسجّل الدخول من أي جهاز بعد' })}
        <h4 class="mt mb">عقود الاشتراك</h4>${table([['العقد', c => `<b class="ltr">${esc(c.no)}</b><div class="xs muted">${esc(c.plan || '')}</div>`], ['التاريخ', c => `<span class="small">${fdt(c.created)}</span>`], ['', c => `<a class="ib" href="/api/admin/contract/file?account=${a.id}&id=${c.id}" title="تنزيل">${ic('download', 'sm')}</a><a class="ib" target="_blank" href="/api/admin/contract/file?account=${a.id}&id=${c.id}&view=1" title="عرض">${ic('eye', 'sm')}</a><button class="ib" data-cwa="${c.id}" title="إرسال واتساب">${ic('wa', 'sm')}</button>`]], a.contracts || [], { empty: 'لا توجد عقود' })}
        ${a.license ? `<button class="btn sec sm mt" id="aCt">${ic('file', 'sm')} إنشاء عقد اشتراك PDF</button>` : ''}
        <h4 class="mt mb">النشاط التجاري</h4>${a.settings ? `<div class="kv">${[['المنشأة', a.settings.company], ['النشاط', a.settings.activity], ['المدينة', a.settings.city], ['الرقم الضريبي', a.settings.vatNumber]].map(([k, v]) => `<div><div class="k">${k}</div><div class="v">${esc(v || '—')}</div></div>`).join('')}</div>` : '<div class="muted small">لم يُعد من اللوحة — سيقوم العميل بإعداده من النظام عند أول دخول.</div>'}
      </div><div>${can('licenses') ? licenseForm({ license: a.license, status: a.status }) : ''}</div></div>`,
    footer: `<button class="btn sec" id="aE">${ic('edit', 'sm')} تعديل البيانات / كلمة المرور</button>${can('accounts') ? `<button class="btn sec" id="aB">${ic('settings', 'sm')} إعداد النشاط التجاري</button>` : ''}<span class="f1"></span>${ME.owner ? `<button class="btn dg" id="aD">${ic('trash', 'sm')} حذف</button>` : ''}<button class="btn sec" data-x>إغلاق</button>`
  });
  if (can('licenses')) bindLicenseForm(m.el, { accountId: a.id, onDone: () => { m.close(); go('accounts'); } });
  $('#aE', m.el).onclick = () => { m.close(); accountForm(a); };
  if ($('#aCt', m.el)) $('#aCt', m.el).onclick = async () => { const b = $('#aCt', m.el); b.disabled = true; b.textContent = 'جارٍ إنشاء العقد…'; try { const r = await api('admin/contract/create', { accountId: a.id }); m.close(); contractResult(a.id, r.contract, r.waText, a.phone); go('accounts'); } catch (e) { fail(e); b.disabled = false; } };
  $$('[data-cwa]', m.el).forEach(b => b.onclick = async () => { let pw = ''; try { pw = ME.owner ? (await api('admin/account/password?id=' + a.id)).password : ''; } catch (e) { }
    const c = a.contracts.find(x => x.id === b.dataset.cwa);
    contractResult(a.id, c, `مرحباً ${a.name} 🌟\nمرفق لك عقد الاشتراك في رواج لإدارة الأعمال (${c.no}).\n👤 اسم المستخدم: ${a.phone}${pw ? '\n🔑 كلمة المرور: ' + pw : ''}\n🎧 خدمة العملاء معك طوال مدة الاشتراك.`, a.phone); });
  if ($('#aB', m.el)) $('#aB', m.el).onclick = () => bizModal(`إعداد النشاط التجاري — ${esc(a.name)}`, a.settings || { mobile: a.phone, email: a.email, company: a.name }, d => api('admin/account/settings', { id: a.id, settings: d }).then(() => { m.close(); go('accounts'); }));
  if ($('#aD', m.el)) $('#aD', m.el).onclick = async () => { if (await confirmBox('حذف الحساب', 'لن يتمكن العميل من الدخول برقم الجوال بعد الآن (يبقى المستخدم المحلي في أجهزته).', true)) { await api('admin/account/delete', { id: a.id }).catch(fail); m.close(); go('accounts'); } };
  $$('[data-dv]', m.el).forEach(b => b.onclick = () => { m.close(); deviceModal(b.dataset.dv); });
  $$('[data-ub]', m.el).forEach(b => b.onclick = async () => { if (await confirmBox('فك ربط الجهاز', 'سيتمكن العميل من ربط جهاز آخر بدلاً منه.', true)) { await api('admin/account/unbind', { id: a.id, deviceId: b.dataset.ub }).catch(fail); m.close(); go('accounts'); } });
}

/* =====================================================================
   مبيعات الاشتراكات
   ===================================================================== */
V.sales = async el => {
  const { items, prices } = await api('admin/sales'); PRICES = prices;
  const month = new Date().toISOString().slice(0, 7);
  const tot = f => items.filter(f).reduce((a, x) => a + (Number(x.amount) || 0), 0);
  const now = new Date(), months = []; // أوقات المبيعات مخزنة بتوقيت UTC
  for (let i = 11; i >= 0; i--) months.push(new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - i, 1)).toISOString().slice(0, 7));
  el.innerHTML = `<div class="grid g4">${[['مبيعات هذا الشهر', tot(x => x.time.slice(0, 7) === month), 'key', 't-su'], ['إجمالي المبيعات', tot(() => true), 'db', 't-pr'], ['غير محصّلة', tot(x => !x.paid), 'alert', 't-da'], ['عدد العمليات', null, 'history', 't-in']].map(([k, v, i, t]) => `<div class="card kpi"><div class="k">${k}<span class="ki ${t}">${ic(i)}</span></div><div class="v">${v == null ? fnum(items.length) : money(v)}</div></div>`).join('')}</div>
    <div class="grid mt" style="grid-template-columns:2fr 1fr"><div class="card"><div class="card-h"><h3>المبيعات الشهرية</h3></div><div class="card-b chart-box"><canvas id="c1"></canvas></div></div>
      <div class="card"><div class="card-h"><h3>الباقات الحالية</h3><button class="btn sec sm" id="toPlans">إدارة الباقات والخصومات</button></div><div class="card-b" id="plSum"></div></div></div>
    <div class="card mt"><div class="card-h"><h3>سجل المبيعات</h3><div class="flex"><button class="btn sec sm" id="sCsv">${ic('download', 'sm')} تصدير</button><button class="btn pr sm" id="sAdd">${ic('plus', 'sm')} عملية يدوية</button></div></div>
      ${table([['التاريخ', x => `<span class="small">${fdt(x.time)}</span>`], ['العميل', x => `<b>${esc(x.customer || '—')}</b><div class="xs muted ltr">${esc(x.ref || '')}</div>`], ['الباقة', x => `<span class="badge b-pr">${esc(x.label || PLAN_LBL[x.plan] || '')}</span>`],
        ['المبلغ', x => money(x.amount)], ['الدفع', x => `${x.paid ? '<span class="badge b-su">محصّل</span>' : '<span class="badge b-da">غير محصّل</span>'}<div class="xs muted">${esc(x.method || '')}</div>`], ['بواسطة', x => `<span class="small">${esc(x.by || '')}</span>`],
        ['', x => `<button class="ib" data-e="${x.id}">${ic('edit', 'sm')}</button><button class="ib" data-d="${x.id}">${ic('trash', 'sm')}</button>`]], items, { empty: 'لا توجد مبيعات بعد', emptySub: 'تُسجّل تلقائياً عند تفعيل أي اشتراك بسعر الباقة' })}</div>`;
  chart($('#c1'), { type: 'bar', data: { labels: months.map(x => x.slice(2)), datasets: [{ label: 'المبيعات', data: months.map(mo => tot(x => x.time.slice(0, 7) === mo)), backgroundColor: '#4f46e5', borderRadius: 6 }] }, options: { scales: { y: { beginAtZero: true } } } });
  $('#toPlans').onclick = () => go('plans');
  api('admin/plans').then(r => { $('#plSum').innerHTML = r.plans.filter(x => x.active).map(x => `<div class="flex between" style="padding:7px 0;border-bottom:1px dashed var(--border)"><span>${esc(x.name)}${x.highlight ? ' <span class="badge b-vi">مميزة</span>' : ''}</span><b>${fnum(x.price)} ${esc(r.currency)}</b></div>`).join('') || '<div class="muted">لا توجد باقات</div>'; }).catch(() => { });
  const form = x => {
    const m = modal({ title: x ? 'تعديل عملية' : 'عملية بيع يدوية', body: `<div class="fg"><div class="field"><label>العميل</label><input class="in" id="xC" value="${esc(x ? x.customer : '')}"></div><div class="field"><label>المرجع (جوال / رقم تسلسلي)</label><input class="in ltr" id="xR" value="${esc(x ? x.ref : '')}"></div>
      <div class="field"><label>الباقة</label><select class="sel" id="xP">${Object.entries(PLAN_LBL).filter(([k]) => !['trial', 'none', 'revoked'].includes(k)).map(([k, l]) => `<option value="${k}" ${x && x.plan === k ? 'selected' : ''}>${l}</option>`).join('')}</select></div><div class="field"><label>المبلغ</label><input class="in num" type="number" id="xA" value="${x ? x.amount : ''}"></div>
      <div class="field"><label>طريقة الدفع</label><input class="in" id="xM" value="${esc(x ? x.method || '' : 'تحويل بنكي')}"></div><div class="field"><label>ملاحظة</label><input class="in" id="xN" value="${esc(x ? x.note || '' : '')}"></div></div>
      <label class="check"><input type="checkbox" id="xPd" ${!x || x.paid ? 'checked' : ''}> تم التحصيل</label>`, footer: `<button class="btn pr" id="xS">حفظ</button><button class="btn sec" data-x>إلغاء</button>` });
    $('#xP', m.el).onchange = e => { if (!$('#xA', m.el).value) $('#xA', m.el).value = priceOf(e.target.value); };
    $('#xS', m.el).onclick = async () => { try { await api('admin/sale/save', { id: x && x.id, customer: $('#xC', m.el).value, ref: $('#xR', m.el).value, plan: $('#xP', m.el).value, label: PLAN_LBL[$('#xP', m.el).value], amount: $('#xA', m.el).value, method: $('#xM', m.el).value, note: $('#xN', m.el).value, paid: $('#xPd', m.el).checked }); m.close(); go('sales'); } catch (e) { fail(e); } };
  };
  $('#sAdd').onclick = () => form(null);
  $$('[data-e]').forEach(b => b.onclick = () => form(items.find(x => x.id === b.dataset.e)));
  $$('[data-d]').forEach(b => b.onclick = async () => { if (await confirmBox('حذف العملية', 'سيتم حذفها من سجل المبيعات.', true)) { await api('admin/sale/delete', { id: b.dataset.d }).catch(fail); go('sales'); } });
  $('#sCsv').onclick = () => {
    const q = v => `"${String(v == null ? '' : v).replace(/"/g, '""')}"`;
    const csv = '﻿' + [['التاريخ', 'العميل', 'المرجع', 'الباقة', 'المبلغ', 'محصّل', 'طريقة الدفع', 'ملاحظة', 'بواسطة'], ...items.map(x => [fdt(x.time), x.customer, x.ref, x.label, x.amount, x.paid ? 'نعم' : 'لا', x.method, x.note, x.by])].map(r => r.map(q).join(',')).join('\r\n');
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' })); a.download = `مبيعات-الاشتراكات-${new Date().toISOString().slice(0, 10)}.csv`; a.click();
  };
};

/* =====================================================================
   النسخ الاحتياطي اليومي للوحة التحكم (في الإعدادات)
   ===================================================================== */
async function panelBackupCard(box) {
  const r = await api('admin/panel-backup'); const c = r.config;
  box.innerHTML = `<div class="card-h"><h3>${ic('db')} النسخ الاحتياطي اليومي للوحة</h3></div><div class="card-b">
    <label class="check mb"><input type="checkbox" id="pbE" ${c.enabled ? 'checked' : ''}> نسخة احتياطية تلقائية يومياً (آخر 10 نسخ)</label>
    <div class="field"><label>مجلد الحفظ</label><div class="flex"><input class="in ltr" id="pbD" value="${esc(c.dir || r.default)}"><button class="btn sec sm" id="pbP">اختيار…</button></div><span class="xs muted">يُفضّل مجلد على فلاشة أو OneDrive أو قرص آخر</span></div>
    <div class="flex"><button class="btn pr" id="pbS">حفظ</button><button class="btn sec" id="pbN">${ic('db', 'sm')} نسخة الآن</button></div>
    <div class="xs muted mt">آخر نسخة: ${fdt(c.last)} — تشمل بيانات اللوحة ومفاتيح التوقيع.</div>
    <div class="mt">${table([['الملف', x => `<span class="ltr small">${esc(x.name)}</span>`], ['الحجم', x => fsize(x.size)], ['', x => `<a class="ib" href="/api/admin/panel-backup/download?name=${encodeURIComponent(x.name)}">${ic('download', 'sm')}</a>`]], r.items, { empty: 'لا توجد نسخ بعد', max: '220px' })}</div></div>`;
  $('#pbP', box).onclick = async () => { toast('اختر المجلد من النافذة التي ستظهر على جهاز الخادم…'); const x = await api('admin/panel-backup/pick', {}).catch(fail); if (x && x.path) $('#pbD', box).value = x.path; };
  $('#pbS', box).onclick = () => api('admin/panel-backup/save', { enabled: $('#pbE', box).checked, dir: $('#pbD', box).value }).then(() => { toast('تم الحفظ'); panelBackupCard(box); }).catch(fail);
  $('#pbN', box).onclick = () => api('admin/panel-backup/now', {}).then(x => { toast('تم إنشاء النسخة: ' + x.name); panelBackupCard(box); }).catch(fail);
}

/* =====================================================================
   طلبات فتح الحسابات
   ===================================================================== */
const REQ_ST = { new: ['جديد', 'b-wa'], contacted: ['تم التواصل', 'b-in'], accepted: ['مقبول', 'b-su'], rejected: ['مرفوض', 'b-ne'] };
const reqBadge = s => `<span class="badge ${(REQ_ST[s] || [])[1] || 'b-ne'}">${(REQ_ST[s] || [s])[0]}</span>`;
let RF_ = 'new';
V.requests = async el => {
  const { items } = await api('admin/requests');
  el.innerHTML = `<div class="card"><div class="tb"><div class="chips" id="rs">${[['new', 'جديدة'], ['contacted', 'تم التواصل'], ['accepted', 'مقبولة'], ['rejected', 'مرفوضة'], ['', 'الكل']].map(([k, l]) => `<button class="chip ${RF_ === k ? 'on' : ''}" data-k="${k}">${l} <span class="num">(${fnum(k ? items.filter(r => r.status === k).length : items.length)})</span></button>`).join('')}</div></div><div id="tbl"></div></div>`;
  const draw = () => {
    const rows = items.filter(r => !RF_ || r.status === RF_);
    $('#tbl').innerHTML = table([
      ['التاريخ', r => `<span class="small">${fdt(r.created)}</span><div class="xs muted">${ago(r.created)}</div>`],
      ['المنشأة', r => `<b>${esc(r.customer.company)}</b>${r.source === 'website' ? ' <span class="badge b-in">من الموقع</span>' : ''}<div class="xs muted ltr">${esc(r.serial || 'بدون رقم تسلسلي')}</div>`],
      ['التواصل', r => `<span class="ltr">${esc(r.customer.mobile)}</span><div class="xs muted ltr">${esc(r.customer.email || '')}</div>`],
      ['الباقة', r => `<span class="badge b-pr">${esc(r.planName)}</span>${r.coupon ? ` <span class="badge b-vi">${esc(r.coupon)}</span>` : ''}`],
      ['المبلغ', r => `<b>${money(r.final)}</b>${r.discount ? `<div class="xs muted" style="text-decoration:line-through">${money(r.price)}</div>` : ''}`],
      ['الحالة', r => reqBadge(r.status)], ['', r => `<button class="btn wa sm" data-wa="${r.id}">${ic('wa', 'sm')}</button> <button class="btn sec sm" data-o="${r.id}">فتح</button>`]
    ], rows, { click: 1, empty: 'لا توجد طلبات', emptySub: 'طلبات «اشترك الآن» من النظام والموقع تظهر هنا: اسم النشاط والجوال والبريد مع الرقم التسلسلي' });
    bindRows($('#tbl'), rows, r => requestModal(r));
    $$('[data-wa]').forEach(b => b.onclick = () => waComposer(items.find(r => r.id === b.dataset.wa)));
    $$('[data-o]').forEach(b => b.onclick = () => requestModal(items.find(r => r.id === b.dataset.o)));
  };
  $$('#rs .chip').forEach(c => c.onclick = () => { RF_ = c.dataset.k; $$('#rs .chip').forEach(x => x.classList.toggle('on', x === c)); draw(); });
  draw();
};
/* اختيار ما يُرفق برسالة الواتساب ثم فتح محادثة العميل */
async function waComposer(r) {
  const { sections } = await api('admin/requests');
  const m = modal({
    title: `رسالة واتساب — ${esc(r.customer.ownerName)}`, size: 'lg',
    body: `<div class="field"><label>اختر ما يُرفق بالرسالة</label><div class="grid g3" style="gap:6px">${sections.map(s => `<label class="check"><input type="checkbox" value="${s.key}" ${s.on ? 'checked' : ''}> ${esc(s.title)}</label>`).join('')}</div></div>
      <div class="field"><label>معاينة الرسالة (يمكنك التعديل قبل الإرسال)</label><textarea class="ta" id="waT" rows="14"></textarea></div>`,
    footer: `<button class="btn wa" id="waGo">${ic('wa', 'sm')} فتح واتساب العميل</button><button class="btn sec" id="waCp">${ic('copy', 'sm')} نسخ</button><span class="f1"></span><button class="btn sec" data-x>إغلاق</button>`
  });
  let url = '';
  const build = async () => { const keys = $$('.check input:checked', m.el).map(x => x.value); const res = await api('admin/request/wa', { id: r.id, keys }); $('#waT', m.el).value = res.text; url = res.url.split('?')[0]; };
  $$('.check input', m.el).forEach(c => c.onchange = build);
  await build();
  $('#waCp', m.el).onclick = () => copy($('#waT', m.el).value);
  $('#waGo', m.el).onclick = () => { window.open(url + '?text=' + encodeURIComponent($('#waT', m.el).value), '_blank'); if (ROUTE === 'requests') go('requests'); };
}
function requestModal(r) {
  const c = r.customer;
  const kv = pairs => `<div class="kv">${pairs.filter(p => p[1] && String(p[1]).replace(/<[^>]+>/g, '').trim()).map(([k, v]) => `<div><div class="k">${k}</div><div class="v">${v}</div></div>`).join('')}</div>`;
  const m = modal({
    title: `طلب فتح حساب — ${esc(c.company)} ${reqBadge(r.status)}`, size: 'xl',
    body: `<div class="grid g2"><div>
        <h4 class="mb">بيانات العميل والمنشأة</h4>${kv([['اسم النشاط', esc(c.company)], ['الاسم', c.ownerName !== c.company ? esc(c.ownerName) : ''], ['الجوال (رقم التفعيل)', `<span class="ltr">${esc(c.mobile)}</span>`], ['البريد', `<span class="ltr">${esc(c.email)}</span>`], ['الاسم الإنجليزي', esc(c.companyEn)], ['النشاط', esc(c.activity)],
          ['المدينة', esc(c.city)], ['الحي', esc(c.district)], ['العنوان', esc(c.address)], ['الرقم الضريبي', `<span class="ltr">${esc(c.vatNumber)}</span>`], ['السجل التجاري', `<span class="ltr">${esc(c.crNumber)}</span>`], ['عدد الموظفين', esc(c.employees)], ['عدد الفروع', esc(c.branches)],
          ['طريقة الدفع المفضلة', esc(c.payMethod)], ['وقت التواصل', esc(c.contactTime)], ['ملاحظات العميل', esc(c.notes)], ['الرقم التسلسلي للجهاز', r.serial ? `<span class="ltr small">${esc(r.serial)}</span>${r.deviceId ? '' : ' <span class="badge b-wa">لم يُربط بجهاز</span>'}` : '']].filter(([, v]) => v && v !== '<span class="ltr"></span>'))}
        <h4 class="mt mb">الباقة</h4>${kv([['الباقة', esc(r.planName)], ['السعر', money(r.price)], ['كود الخصم', esc(r.coupon)], ['الخصم', r.discount ? money(r.discount) : ''], ['الإجمالي', `<b>${money(r.final)}</b>`]])}
        <h4 class="mt mb">السجل</h4>${(r.history || []).map(h => `<div class="small">${fdt(h.time)} — ${esc(h.by)}: ${esc(h.action)}</div>`).join('')}
        <div class="field mt"><label>ملاحظات داخلية</label><textarea class="ta" id="rN" rows="2">${esc(r.notes)}</textarea></div></div>
      <div>${r.status === 'accepted' ? `<div class="note t-su">${ic('check')} <div>تم قبول الطلب وإنشاء الحساب.</div></div><button class="btn sec" id="rAcc">فتح حساب العميل</button>` : `<h4 class="mb">قبول الطلب وإنشاء الحساب</h4>
        <div class="fg"><div class="field"><label>كلمة مرور العميل</label><div class="flex"><input class="in ltr" id="aPw" value="${genPassword()}"><button class="btn sec sm" id="aPg" type="button">توليد</button></div></div>
        <div class="field"><label>عدد الأجهزة</label><input class="in num" type="number" min="1" id="aDv" value="1"></div>
        <div class="field"><label>المبلغ المحصّل</label><input class="in num" type="number" id="aPr" value="${r.final}"></div>
        <div class="field"><label>طريقة الدفع</label><input class="in" id="aMt" value="${esc(c.payMethod || 'تحويل بنكي')}"></div></div>
        <label class="check mb"><input type="checkbox" id="aPd" checked> تم تحصيل المبلغ</label>
        <div class="xs muted mb">يُنشأ حساب برقم الجوال، ويُفعّل الاشتراك، وتُرسل بيانات المنشأة للنظام تلقائياً، ويُنشأ عقد PDF.</div>
        <button class="btn pr block" id="rOk">${ic('check', 'sm')} قبول وإنشاء الحساب والعقد</button>`}</div></div>`,
    footer: `<button class="btn wa" id="rWa">${ic('wa', 'sm')} تواصل عبر واتساب</button>${r.status !== 'accepted' ? `<button class="btn sec" id="rCt">تم التواصل</button><button class="btn dg" id="rRj">رفض</button>` : ''}<span class="f1"></span><button class="btn sec" id="rSv">حفظ الملاحظات</button><button class="btn sec" data-x>إغلاق</button>`
  });
  const upd = body => api('admin/request/update', { id: r.id, ...body }).then(() => { m.close(); go('requests'); }).catch(fail);
  $('#rWa', m.el).onclick = () => waComposer(r);
  $('#rSv', m.el).onclick = () => api('admin/request/update', { id: r.id, notes: $('#rN', m.el).value }).then(() => toast('تم الحفظ')).catch(fail);
  if ($('#rCt', m.el)) $('#rCt', m.el).onclick = () => upd({ status: 'contacted' });
  if ($('#rRj', m.el)) $('#rRj', m.el).onclick = async () => { const reason = prompt('سبب الرفض (اختياري):') ; if (reason === null) return; upd({ status: 'rejected', reason }); };
  if ($('#rAcc', m.el)) $('#rAcc', m.el).onclick = () => { m.close(); go('accounts'); };
  if ($('#aPg', m.el)) $('#aPg', m.el).onclick = () => { $('#aPw', m.el).value = genPassword(); };
  if ($('#rOk', m.el)) $('#rOk', m.el).onclick = async () => {
    const btn = $('#rOk', m.el); btn.disabled = true; btn.textContent = 'جارٍ الإنشاء وتوليد العقد…';
    try {
      const res = await api('admin/request/accept', { id: r.id, password: $('#aPw', m.el).value, maxDevices: $('#aDv', m.el).value, price: $('#aPr', m.el).value, method: $('#aMt', m.el).value, paid: $('#aPd', m.el).checked });
      m.close(); contractResult(res.accountId, res.contract, res.waText, c.mobile, res.contractError); go('requests');
    } catch (e) { fail(e); btn.disabled = false; btn.textContent = 'قبول وإنشاء الحساب والعقد'; }
  };
}
/* نافذة العقد: تنزيل / عرض / إرسال واتساب */
function contractResult(accountId, contract, waText, mobile, err) {
  const intl = String(mobile || '').replace(/\D/g, '').replace(/^0/, '966');
  const href = contract ? `/api/admin/contract/file?account=${accountId}&id=${contract.id}` : '';
  const m = modal({
    title: contract ? `عقد الاشتراك ${esc(contract.no)}` : 'تم إنشاء الحساب', size: 'lg',
    body: `${err ? `<div class="note t-wa">${ic('alert')} <div>${esc(err)}</div></div>` : `<div class="note t-su">${ic('check')} <div>تم إنشاء العقد وحفظه في حساب العميل (خانة «حسابات العملاء»)، ويستطيع العميل تنزيله من داخل النظام من «حسابي واشتراكي».</div></div>`}
      <div class="field"><label>رسالة الترحيب وبيانات الدخول</label><textarea class="ta" id="wT" rows="10">${esc(waText)}</textarea></div>
      <div class="xs muted">واتساب لا يسمح بإرفاق الملفات عبر الرابط: نزّل العقد ثم اسحبه إلى محادثة العميل بعد فتحها.</div>`,
    footer: `${contract ? `<a class="btn pr" href="${href}">${ic('download', 'sm')} تنزيل العقد PDF</a><a class="btn sec" target="_blank" href="${href}&view=1">${ic('eye', 'sm')} عرض</a>` : ''}<button class="btn wa" id="wGo">${ic('wa', 'sm')} إرسال للعميل عبر واتساب</button><span class="f1"></span><button class="btn sec" data-x>إغلاق</button>`
  });
  $('#wGo', m.el).onclick = () => window.open(`https://wa.me/${intl}?text=${encodeURIComponent($('#wT', m.el).value)}`, '_blank');
}

/* =====================================================================
   الباقات وأكواد الخصم
   ===================================================================== */
V.plans = async el => {
  const { plans, coupons, currency } = await api('admin/plans');
  const TYPES = { monthly: 'شهري', quarterly: 'ربع سنوي', yearly: 'سنوي', lifetime: 'دائم', custom: 'مدة مخصصة' };
  el.innerHTML = `<div class="card"><div class="card-h"><h3>${ic('key')} الباقات</h3><button class="btn pr sm" id="pAdd">${ic('plus', 'sm')} باقة جديدة</button></div>
    ${table([['الباقة', x => `<b>${esc(x.name)}</b>${x.highlight ? ' <span class="badge b-vi">مميزة</span>' : ''}${x.active ? '' : ' <span class="badge b-ne">مخفية</span>'}<div class="xs muted">${(x.features || []).slice(0, 3).map(esc).join(' · ')}</div>`], ['النوع والمدة', x => `${TYPES[x.type]} · ${x.type === 'lifetime' ? 'دائم' : fnum(x.days) + ' يوم'}`], ['السعر', x => `<b>${fnum(x.price)}</b> ${esc(currency)}`], ['الترتيب', x => fnum(x.order)], ['', x => `<button class="ib" data-pe="${x.id}">${ic('edit', 'sm')}</button><button class="ib" data-pd="${x.id}">${ic('trash', 'sm')}</button>`]], plans, { empty: 'لا توجد باقات' })}
    <div class="xs muted" style="padding:10px 18px">الباقات النشطة تظهر للعملاء في زر «اشترك الآن» بشاشة الدخول وفي صفحة الاشتراك داخل النظام.</div></div>
    <div class="card mt"><div class="card-h"><h3>${ic('wallet')} أكواد الخصم</h3><button class="btn pr sm" id="cAdd">${ic('plus', 'sm')} كود جديد</button></div>
    ${table([['الكود', x => `<b class="ltr">${esc(x.code)}</b>${x.active ? '' : ' <span class="badge b-ne">موقوف</span>'}<div class="xs muted">${esc(x.note || '')}</div>`], ['الخصم', x => x.kind === 'percent' ? `${fnum(x.value)}%` : `${fnum(x.value)} ${esc(currency)}`],
      ['الاستخدام', x => `${fnum(x.used)} / ${x.maxUses ? fnum(x.maxUses) : '∞'}`], ['ينتهي', x => x.expires ? fdate(x.expires) : 'بدون'], ['الباقات', x => x.plans && x.plans.length ? x.plans.map(id => esc((plans.find(p => p.id === id) || {}).name || '')).join('، ') : 'الكل'],
      ['', x => `<button class="ib" data-ce="${x.id}">${ic('edit', 'sm')}</button><button class="ib" data-cd="${x.id}">${ic('trash', 'sm')}</button>`]], coupons, { empty: 'لا توجد أكواد خصم' })}</div>`;
  const planForm = x => {
    const m = modal({
      title: x ? 'تعديل الباقة' : 'باقة جديدة', size: 'lg',
      body: `<div class="fg"><div class="field"><label>اسم الباقة</label><input class="in" id="fN" value="${esc(x ? x.name : '')}"></div>
        <div class="field"><label>النوع</label><select class="sel" id="fT">${Object.entries(TYPES).map(([k, l]) => `<option value="${k}" ${x && x.type === k ? 'selected' : ''}>${l}</option>`).join('')}</select></div>
        <div class="field"><label>المدة بالأيام</label><input class="in num" type="number" id="fD" value="${x && x.days ? x.days : 30}"></div>
        <div class="field"><label>السعر (${esc(currency)})</label><input class="in num" type="number" id="fP" value="${x ? x.price : ''}"></div>
        <div class="field"><label>الترتيب</label><input class="in num" type="number" id="fO" value="${x ? x.order : plans.length + 1}"></div></div>
        <div class="field"><label>المزايا (سطر لكل ميزة)</label><textarea class="ta" id="fF" rows="6">${esc((x ? x.features : []).join('\n'))}</textarea></div>
        <label class="check mb"><input type="checkbox" id="fH" ${x && x.highlight ? 'checked' : ''}> باقة مميزة (الأوفر)</label><label class="check"><input type="checkbox" id="fA" ${!x || x.active ? 'checked' : ''}> ظاهرة للعملاء</label>`,
      footer: `<button class="btn pr" id="fS">حفظ</button><button class="btn sec" data-x>إلغاء</button>`
    });
    const sync = () => { const t = $('#fT', m.el).value; $('#fD', m.el).disabled = t === 'lifetime'; if (!x) $('#fD', m.el).value = { monthly: 30, quarterly: 90, yearly: 365 }[t] || $('#fD', m.el).value; };
    $('#fT', m.el).onchange = sync; sync();
    $('#fS', m.el).onclick = () => api('admin/plans/save', { id: x && x.id, name: $('#fN', m.el).value, type: $('#fT', m.el).value, days: $('#fD', m.el).value, price: $('#fP', m.el).value, order: $('#fO', m.el).value, features: $('#fF', m.el).value.split('\n'), highlight: $('#fH', m.el).checked, active: $('#fA', m.el).checked }).then(() => { m.close(); go('plans'); }).catch(fail);
  };
  const couponForm = x => {
    const m = modal({
      title: x ? 'تعديل كود الخصم' : 'كود خصم جديد',
      body: `<div class="fg"><div class="field"><label>الكود (إنجليزي)</label><input class="in ltr" id="cC" value="${esc(x ? x.code : '')}" placeholder="WELCOME10"></div>
        <div class="field"><label>نوع الخصم</label><select class="sel" id="cK"><option value="percent" ${!x || x.kind === 'percent' ? 'selected' : ''}>نسبة %</option><option value="amount" ${x && x.kind === 'amount' ? 'selected' : ''}>مبلغ ثابت</option></select></div>
        <div class="field"><label>القيمة</label><input class="in num" type="number" id="cV" value="${x ? x.value : ''}"></div>
        <div class="field"><label>عدد مرات الاستخدام (0 = غير محدود)</label><input class="in num" type="number" id="cM" value="${x ? x.maxUses : 0}"></div>
        <div class="field"><label>تاريخ الانتهاء (اختياري)</label><input class="in ltr" type="date" lang="en-GB" id="cE" value="${esc(x ? x.expires : '')}"></div>
        <div class="field"><label>ملاحظة</label><input class="in" id="cN" value="${esc(x ? x.note || '' : '')}"></div></div>
        <div class="field"><label>ينطبق على (بدون اختيار = كل الباقات)</label><div class="chips">${plans.map(p => `<label class="check"><input type="checkbox" value="${p.id}" ${x && (x.plans || []).includes(p.id) ? 'checked' : ''}> ${esc(p.name)}</label>`).join('')}</div></div>
        <label class="check"><input type="checkbox" id="cA" ${!x || x.active ? 'checked' : ''}> الكود فعّال</label>`,
      footer: `<button class="btn pr" id="cS">حفظ</button><button class="btn sec" data-x>إلغاء</button>`
    });
    $('#cS', m.el).onclick = () => api('admin/coupons/save', { id: x && x.id, code: $('#cC', m.el).value, kind: $('#cK', m.el).value, value: $('#cV', m.el).value, maxUses: $('#cM', m.el).value, expires: $('#cE', m.el).value, note: $('#cN', m.el).value, active: $('#cA', m.el).checked, plans: $$('.chips input:checked', m.el).map(i => i.value) }).then(() => { m.close(); go('plans'); }).catch(fail);
  };
  $('#pAdd').onclick = () => planForm(null);
  $('#cAdd').onclick = () => couponForm(null);
  $$('[data-pe]').forEach(b => b.onclick = () => planForm(plans.find(x => x.id === b.dataset.pe)));
  $$('[data-ce]').forEach(b => b.onclick = () => couponForm(coupons.find(x => x.id === b.dataset.ce)));
  $$('[data-pd]').forEach(b => b.onclick = async () => { if (await confirmBox('حذف الباقة', 'لن تظهر للعملاء بعد الآن (الاشتراكات الحالية لا تتأثر).', true)) { await api('admin/plans/delete', { id: b.dataset.pd }).catch(fail); go('plans'); } });
  $$('[data-cd]').forEach(b => b.onclick = async () => { if (await confirmBox('حذف كود الخصم', 'سيتم حذفه نهائياً.', true)) { await api('admin/coupons/delete', { id: b.dataset.cd }).catch(fail); go('plans'); } });
};

/* =====================================================================
   الإعدادات: رسالة الواتساب وطرق الدفع والعقد
   ===================================================================== */
async function messagesCard(box) {
  const r = await api('admin/messages'); const C = r.contract;
  box.innerHTML = `<div class="card-h"><h3>${ic('wa')} رسالة العملاء وطرق الدفع وعقد الاشتراك</h3></div><div class="card-b">
    <h4 class="mb">أقسام رسالة الواتساب</h4><div class="xs muted mb">المتغيرات: {name} {company} {plan} {price} {final} {currency} {plans} {payment} {bank} {discount_line}</div>
    ${r.sections.map((s, i) => `<div class="box-sec"><label class="check" style="border:0;padding:0"><input type="checkbox" data-son="${i}" ${s.on ? 'checked' : ''}> <b>${esc(s.title)}</b> <span class="xs muted">(مرفق افتراضياً)</span></label><textarea class="ta mt" rows="3" data-stx="${i}">${esc(s.text)}</textarea></div>`).join('')}
    <div class="fg mt"><div class="field"><label>طرق الدفع (سطر لكل طريقة)</label><textarea class="ta" id="mPm" rows="4">${esc(r.payMethods.join('\n'))}</textarea></div>
    <div class="field"><label>بيانات الحساب البنكي (تظهر في الرسالة)</label><textarea class="ta" id="mBk" rows="4" placeholder="البنك: ...&#10;الآيبان: SA...">${esc(r.bankInfo)}</textarea></div></div>
    <h4 class="mt mb">عقد الاشتراك (PDF)</h4>
    <div class="fg">${[['sellerName', 'اسم مزود الخدمة'], ['signerName', 'اسم الموقّع'], ['sellerCr', 'السجل التجاري', 1], ['sellerVat', 'الرقم الضريبي', 1], ['sellerPhone', 'الجوال', 1], ['sellerEmail', 'البريد', 1]].map(([k, l, ltr]) => `<div class="field"><label>${l}</label><input class="in ${ltr ? 'ltr' : ''}" data-ck="${k}" value="${esc(C[k])}"></div>`).join('')}</div>
    ${[['intro', 'تعريف بالنظام'], ['guarantee', 'الضمان وخدمة العملاء'], ['terms', 'الشروط والأحكام (سطر لكل بند)']].map(([k, l]) => `<div class="field"><label>${l}</label><textarea class="ta" rows="4" data-ck="${k}">${esc(C[k])}</textarea></div>`).join('')}
    <div class="fg"><div class="field"><label>صورة التوقيع (اختياري — PNG شفاف)</label><input type="file" accept="image/*" id="mSig" class="in" style="padding-top:7px">${C.signature ? `<img src="${C.signature}" style="height:50px;margin-top:6px">` : ''}</div>
      <div class="field"><label>صورة الختم (اختياري — وإلا يُرسم ختم تلقائي)</label><input type="file" accept="image/*" id="mStp" class="in" style="padding-top:7px">${C.stamp ? `<img src="${C.stamp}" style="height:70px;margin-top:6px">` : ''}</div></div>
    <div class="flex wrap"><button class="btn pr" id="mS">${ic('check', 'sm')} حفظ</button><a class="btn sec" target="_blank" id="mPv">${ic('eye', 'sm')} معاينة العقد</a><button class="btn gh" id="mR">استعادة نص الرسالة الافتراضي</button>${C.signature || C.stamp ? '<button class="btn gh" id="mClr">إزالة التوقيع والختم</button>' : ''}</div></div>`;
  let sig = null, stp = null;
  $('#mSig', box).onchange = async e => { if (e.target.files[0]) sig = await fileToDataURL(e.target.files[0]); };
  $('#mStp', box).onchange = async e => { if (e.target.files[0]) stp = await fileToDataURL(e.target.files[0]); };
  const payload = () => {
    const sections = r.sections.map((s, i) => ({ ...s, on: $(`[data-son="${i}"]`, box).checked, text: $(`[data-stx="${i}"]`, box).value }));
    const contract = {}; $$('[data-ck]', box).forEach(i => { contract[i.dataset.ck] = i.value; });
    if (sig) contract.signature = sig; if (stp) contract.stamp = stp;
    return { sections, payMethods: $('#mPm', box).value.split('\n'), bankInfo: $('#mBk', box).value, contract };
  };
  $('#mS', box).onclick = () => api('admin/messages/save', payload()).then(() => { toast('تم الحفظ'); messagesCard(box); }).catch(fail);
  $('#mPv', box).onclick = async e => { e.preventDefault(); await api('admin/messages/save', payload()).catch(fail); window.open('/api/admin/contract/preview', '_blank'); };
  $('#mR', box).onclick = () => api('admin/messages/save', { resetSections: true }).then(() => messagesCard(box)).catch(fail);
  if ($('#mClr', box)) $('#mClr', box).onclick = () => api('admin/messages/save', { contract: { signature: '', stamp: '' } }).then(() => messagesCard(box)).catch(fail);
}

/* =====================================================================
   الموقع: الإحصائيات، الزوار، الإعدادات
   ===================================================================== */
let SITE_TAB = 'stats', SITE_DAYS = 30, VISIT_F = '';
const fdur = s => s >= 3600 ? `${Math.floor(s / 3600)} س ${Math.floor(s % 3600 / 60)} د` : s >= 60 ? `${Math.floor(s / 60)} د ${s % 60} ث` : `${s} ث`;
const EV_LBL = { download: 'تحميل النظام', open_signup: 'فتح نموذج الاشتراك', signup_sent: 'أرسل طلب اشتراك', contact_sent: 'أرسل رسالة', whatsapp: 'ضغط واتساب', plan: 'اختار باقة', coupon: 'جرّب كود خصم' };
const SEC_LBL = { features: 'المزايا', showcase: 'استعراض النظام', security: 'الأمان', plans: 'الباقات', download: 'التحميل', faq: 'الأسئلة', support: 'خدمة العملاء' };
/* ---------- الموقع: الشروحات والإعلانات (يوتيوب) + حسابات التواصل ---------- */
const SOCIAL = { youtube: 'يوتيوب', tiktok: 'تيك توك', instagram: 'إنستقرام', snapchat: 'سناب شات', x: 'إكس (تويتر)', facebook: 'فيسبوك', linkedin: 'لينكدإن', telegram: 'تيليجرام' };
const ytId = u => { u = String(u || '').trim(); if (/^[\w-]{11}$/.test(u)) return u; const m = u.match(/(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/|v\/))([\w-]{11})/); return m ? m[1] : ''; };
async function siteMedia(box) {
  const { config: C } = await api('admin/site?days=1');
  let V = (C.videos || []).map(v => ({ ...v })); const S = C.social || {};
  const save = async () => { try { const r = await api('admin/site/videos/save', { items: V }); V = r.items; draw(); toast('تم الحفظ — يظهر في الموقع فوراً'); } catch (e) { fail(e); } };
  box.innerHTML = `<div class="grid" style="grid-template-columns:minmax(0,1.5fr) minmax(0,1fr);gap:16px;align-items:start">
    <div class="card"><div class="card-h"><h3>${ic('eye')} الشروحات والإعلانات</h3><span class="f1"></span><span class="xs muted">روابط يوتيوب تظهر في قسم «الشروحات» بالموقع بمشغّل احترافي</span></div><div class="card-b">
      <div class="fg" style="grid-template-columns:minmax(0,1.4fr) minmax(0,1fr) 150px"><div class="field"><label>رابط يوتيوب</label><input class="in ltr" id="vU" placeholder="https://youtu.be/…"></div>
        <div class="field"><label>العنوان</label><input class="in" id="vT" placeholder="مثال: إصدار فاتورة ضريبية"></div>
        <div class="field"><label>النوع</label><select class="in" id="vK"><option value="tutorial">شرح</option><option value="ad">إعلان</option></select></div></div>
      <div class="field"><label>وصف مختصر (اختياري)</label><input class="in" id="vD" maxlength="600"></div>
      <div class="flex"><div id="vPrev" class="vprev"></div><button class="btn pr" id="vAdd">${ic('plus', 'sm')} إضافة للموقع</button></div>
      <div id="vList" class="mt"></div></div></div>
    <div class="card"><div class="card-h"><h3>${ic('send')} حسابات التواصل الاجتماعي</h3></div><div class="card-b">
      ${Object.entries(SOCIAL).map(([k, n]) => `<div class="soc-row"><label class="check" style="display:flex;gap:8px;align-items:center;min-width:140px"><input type="checkbox" data-ss="${k}" ${S[k] && S[k].show ? 'checked' : ''}> <b>${n}</b></label>
        <input class="in ltr" data-su="${k}" value="${esc((S[k] || {}).url || '')}" placeholder="https://"></div>`).join('')}
      <div class="xs muted mt">المعلَّم فقط يظهر في الموقع (أسفل الصفحة وقسم خدمة العملاء). اترك الرابط فارغاً لإخفاء المنصة.</div>
      <button class="btn pr mt" id="sSoc">حفظ الحسابات</button></div></div></div>`;
  const prev = () => { const id = ytId($('#vU').value); $('#vPrev').innerHTML = id ? `<img src="https://i.ytimg.com/vi/${id}/mqdefault.jpg" alt="">` : ''; };
  $('#vU').oninput = prev;
  $('#vAdd').onclick = () => {
    const id = ytId($('#vU').value); if (!id) return toast('رابط يوتيوب غير صحيح', true);
    if (!$('#vT').value.trim()) return toast('اكتب عنوان الفيديو', true);
    V.unshift({ url: $('#vU').value.trim(), yt: id, title: $('#vT').value.trim(), desc: $('#vD').value.trim(), kind: $('#vK').value, show: true });
    ['#vU', '#vT', '#vD'].forEach(x => { $(x).value = ''; }); prev(); save();
  };
  const draw = () => {
    $('#vList').innerHTML = V.length ? V.map((v, i) => `<div class="vrow ${v.show ? '' : 'off'}"><img src="https://i.ytimg.com/vi/${v.yt}/mqdefault.jpg" alt="">
      <div class="f1"><b>${esc(v.title)}</b> <span class="badge ${v.kind === 'ad' ? 'b-wa' : 'b-pr'}">${v.kind === 'ad' ? 'إعلان' : 'شرح'}</span><div class="xs muted">${esc(v.desc || '')}</div><a class="xs ltr" href="https://youtu.be/${v.yt}" target="_blank">youtu.be/${v.yt}</a></div>
      <div class="flex"><button class="ib" data-up="${i}" title="أعلى" ${i ? '' : 'disabled'}>▲</button><button class="ib" data-dn="${i}" title="أسفل" ${i < V.length - 1 ? '' : 'disabled'}>▼</button>
      <button class="btn sec sm" data-sh="${i}">${v.show ? 'إخفاء' : 'إظهار'}</button><button class="btn dg sm" data-rm="${i}">${ic('trash', 'sm')}</button></div></div>`).join('')
      : '<div class="muted small" style="padding:18px;text-align:center">لا توجد فيديوهات بعد — أضف أول رابط يوتيوب</div>';
    $$('[data-up]', box).forEach(b => b.onclick = () => { const i = +b.dataset.up; [V[i - 1], V[i]] = [V[i], V[i - 1]]; save(); });
    $$('[data-dn]', box).forEach(b => b.onclick = () => { const i = +b.dataset.dn; [V[i + 1], V[i]] = [V[i], V[i + 1]]; save(); });
    $$('[data-sh]', box).forEach(b => b.onclick = () => { V[+b.dataset.sh].show = !V[+b.dataset.sh].show; save(); });
    $$('[data-rm]', box).forEach(b => b.onclick = async () => { if (await confirmBox('حذف الفيديو', 'سيُحذف من الموقع.', true)) { V.splice(+b.dataset.rm, 1); save(); } });
  };
  draw();
  $('#sSoc').onclick = async () => {
    const social = {}; Object.keys(SOCIAL).forEach(k => { social[k] = { url: $(`[data-su="${k}"]`, box).value.trim(), show: $(`[data-ss="${k}"]`, box).checked }; });
    try { await api('admin/site/social/save', { social }); toast('تم حفظ حسابات التواصل'); } catch (e) { fail(e); }
  };
}
V.site = async el => {
  el.innerHTML = `<div class="card"><div class="tabs" id="stT">${[['stats', 'الإحصائيات'], ['visits', 'الزوار بالتفصيل'], ['media', 'الشروحات والتواصل'], ['settings', 'إعدادات الموقع']].map(([k, l]) => `<button data-t="${k}" class="${SITE_TAB === k ? 'on' : ''}">${l}</button>`).join('')}
    <span class="f1"></span><div class="chips" style="align-self:center">${[[1, 'اليوم'], [7, '7 أيام'], [30, '30 يوماً'], [90, '90 يوماً']].map(([d, l]) => `<button class="chip ${SITE_DAYS === d ? 'on' : ''}" data-d="${d}">${l}</button>`).join('')}</div></div><div id="stB" class="card-b"></div></div>`;
  $$('#stT [data-t]').forEach(b => b.onclick = () => { SITE_TAB = b.dataset.t; go('site'); });
  $$('#stT [data-d]').forEach(b => b.onclick = () => { SITE_DAYS = +b.dataset.d; go('site'); });
  const box = $('#stB');
  if (SITE_TAB === 'media') return siteMedia(box);
  if (SITE_TAB === 'stats') {
    const { stats: S } = await api('admin/site?days=' + SITE_DAYS);
    const k = (t, v, s, i, tone) => `<div class="card kpi"><div class="k">${t}<span class="ki ${tone}">${ic(i)}</span></div><div class="v num">${v}</div><div class="s">${s}</div></div>`;
    const list = (title, rows) => `<div class="card"><div class="card-h"><h3>${title}</h3></div><div class="card-b">${rows.length ? rows.map(([n, c]) => { const mx = rows[0][1] || 1; return `<div class="bar-row"><span>${esc(n)}</span><i style="width:${Math.max(4, c / mx * 100)}%"></i><b class="num">${fnum(c)}</b></div>`; }).join('') : '<div class="muted small">لا توجد بيانات</div>'}</div></div>`;
    box.innerHTML = `<div class="grid g4">${k('متصل الآن', `<span class="live-dot"></span> ${fnum(S.live)}`, 'زوار على الموقع خلال آخر دقيقة ونصف', 'eye', 't-su')}${k('الزوار', fnum(S.visitors), `${fnum(S.visits)} زيارة · ${fnum(S.returning)} عائد`, 'user', 't-pr')}
      ${k('طلبات الاشتراك', fnum(S.signups), `من الموقع · ${fnum(S.contacts)} رسالة تواصل`, 'inbox', 't-vi')}${k('تحميل النظام', fnum(S.downloads), `${fnum(S.whatsapp)} ضغطة واتساب`, 'download', 't-in')}</div>
      <div class="grid g4 mt">${k('متوسط مدة الزيارة', fdur(S.avgDuration), 'من أول دخول حتى آخر نشاط', 'history', 't-wa')}${k('معدل الارتداد', S.bounce + '%', 'زيارات بدون أي تفاعل', 'alert', 't-da')}
      ${k('معدل التحويل', (S.visits ? (S.signups / S.visits * 100).toFixed(1) : 0) + '%', 'طلبات الاشتراك ÷ الزيارات', 'key', 't-su')}${k('شاهدوا الباقات', fnum(S.funnel[1][1]), 'زيارات وصلت لقسم الباقات', 'tag', 't-pr')}</div>
      <div class="grid mt" style="grid-template-columns:2fr 1fr"><div class="card"><div class="card-h"><h3>الزيارات اليومية</h3></div><div class="card-b chart-box"><canvas id="sc1"></canvas></div></div>
        <div class="card"><div class="card-h"><h3>مسار التحويل</h3></div><div class="card-b">${S.funnel.map(([n, c], i) => `<div class="funnel" style="--w:${S.funnel[0][1] ? Math.max(6, c / S.funnel[0][1] * 100) : 6}%"><span>${n}</span><b class="num">${fnum(c)}</b>${i ? `<small>${S.funnel[i - 1][1] ? (c / S.funnel[i - 1][1] * 100).toFixed(0) : 0}%</small>` : ''}</div>`).join('')}</div></div></div>
      <div class="grid g3 mt">${list('الدول', S.countries)}${list('المدن', S.cities)}${list('مصادر الزيارات', S.sources)}</div>
      <div class="grid g3 mt">${list('الأجهزة', S.devices)}${list('المتصفحات', S.browsers)}${list('أنظمة التشغيل', S.oses)}</div>
      <div class="grid mt" style="grid-template-columns:1fr 2fr">${list('الأقسام الأكثر مشاهدة', S.sections.map(([n, c]) => [SEC_LBL[n] || n, c]))}<div class="card"><div class="card-h"><h3>الزيارات حسب الساعة</h3></div><div class="card-b chart-box"><canvas id="sc2"></canvas></div></div></div>
      <div class="xs muted mt">الموقع الجغرافي يُحدد من عنوان IP للزائر (يحتاج نشر اللوحة أونلاين)، وإلا من المنطقة الزمنية لجهازه.</div>`;
    chart($('#sc1'), { type: 'line', data: { labels: S.daily.map(d => d.day.slice(5)), datasets: [{ label: 'زيارات', data: S.daily.map(d => d.visits), borderColor: '#4f46e5', backgroundColor: 'rgba(79,70,229,.12)', fill: true, tension: .35 }, { label: 'زوار', data: S.daily.map(d => d.visitors), borderColor: '#f59e0b', tension: .35 }] }, legend: 1, options: { scales: { y: { beginAtZero: true, ticks: { precision: 0 } } } } });
    chart($('#sc2'), { type: 'bar', data: { labels: S.hours.map((_, h) => String(h).padStart(2, '0')), datasets: [{ data: S.hours, backgroundColor: '#4f46e5', borderRadius: 4 }] }, options: { scales: { y: { beginAtZero: true, ticks: { precision: 0 } } } } });
  } else if (SITE_TAB === 'visits') {
    const { items } = await api(`admin/site/visits?days=${SITE_DAYS}&f=${VISIT_F}`);
    box.innerHTML = `<div class="flex wrap mb"><div class="chips" id="vf">${[['', 'كل الزيارات'], ['live', 'متصل الآن'], ['signup', 'أرسلوا طلب اشتراك'], ['download', 'حمّلوا النظام']].map(([k, l]) => `<button class="chip ${VISIT_F === k ? 'on' : ''}" data-k="${k}">${l}</button>`).join('')}</div><span class="f1"></span>
      <button class="btn sec sm" id="vCsv">${ic('download', 'sm')} تصدير Excel</button>${ME.owner ? `<button class="btn dg sm" id="vClr">${ic('trash', 'sm')} مسح السجل</button>` : ''}</div>
      ${table([['الوقت', v => `<span class="small">${fdt(v.start)}</span><div class="xs muted">${ago(v.last)}</div>`], ['الموقع', v => `<b>${esc(v.country || 'غير معروف')}</b><div class="xs muted">${esc([v.city, v.region].filter(Boolean).join('، '))}</div>`],
        ['الجهاز', v => `${esc(v.device)}<div class="xs muted">${esc(v.browser)} · ${esc(v.os)}</div>`], ['المصدر', v => esc(v.source)], ['المدة', v => fdur(v.duration)],
        ['التفاعل', v => `<span class="small">${v.sections.length} قسم</span>${v.events.map(e => `<span class="badge ${e.name === 'signup_sent' ? 'b-su' : e.name === 'download' ? 'b-in' : 'b-ne'}" style="margin:1px">${esc(EV_LBL[e.name] || e.name)}</span>`).join('')}`],
        ['', v => v.returning ? '<span class="badge b-vi">عائد</span>' : '<span class="badge b-pr">جديد</span>']], items, { click: 1, empty: 'لا توجد زيارات في هذه الفترة', emptySub: 'تُسجل الزيارات تلقائياً عند فتح الموقع' })}`;
    $$('#vf .chip').forEach(c => c.onclick = () => { VISIT_F = c.dataset.k; go('site'); });
    bindRows(box, items, v => modal({
      title: `تفاصيل الزيارة — ${esc(v.country || 'زائر')}`, size: 'lg',
      body: `<div class="kv">${[['بداية الزيارة', fdt(v.start)], ['آخر نشاط', fdt(v.last)], ['المدة', fdur(v.duration)], ['الدولة', esc(v.country)], ['المدينة', esc(v.city)], ['المنطقة', esc(v.region)], ['عنوان IP', `<span class="ltr">${esc(v.ip)}</span>`],
        ['الجهاز', esc(v.device)], ['المتصفح', esc(v.browser)], ['النظام', esc(v.os)], ['دقة الشاشة', `<span class="ltr">${esc(v.screen)}</span>`], ['اللغة', esc(v.lang)], ['المنطقة الزمنية', `<span class="ltr small">${esc(v.tz)}</span>`],
        ['المصدر', esc(v.source)], ['الرابط المُحيل', `<span class="ltr small">${esc(v.ref || 'مباشر')}</span>`], ['نوع الزائر', v.returning ? 'عائد' : 'جديد'], ['معرّف الزائر', `<span class="ltr small">${esc(v.vid)}</span>`]].filter(p => p[1]).map(([k, x]) => `<div><div class="k">${k}</div><div class="v">${x}</div></div>`).join('')}</div>
        <h4 class="mt mb">الأقسام التي شاهدها</h4><div class="chips">${v.sections.map(s => `<span class="badge b-pr">${esc(SEC_LBL[s] || s)}</span>`).join('') || '<span class="muted">لم يتصفح أقساماً</span>'}</div>
        <h4 class="mt mb">التسلسل الزمني للأحداث</h4>${v.events.length ? v.events.map(e => `<div class="small">${fdt(e.t)} — <b>${esc(EV_LBL[e.name] || e.name)}</b> ${esc(e.data || '')}</div>`).join('') : '<div class="muted small">لا توجد أحداث</div>'}`
    }));
    $('#vCsv').onclick = () => {
      const qv = x => `"${String(x == null ? '' : x).replace(/"/g, '""')}"`;
      const csv = '﻿' + [['البداية', 'المدة (ث)', 'الدولة', 'المدينة', 'IP', 'الجهاز', 'المتصفح', 'النظام', 'المصدر', 'الأقسام', 'الأحداث', 'عائد'], ...items.map(v => [fdt(v.start), v.duration, v.country, v.city, v.ip, v.device, v.browser, v.os, v.source, v.sections.join(' '), v.events.map(e => EV_LBL[e.name] || e.name).join(' | '), v.returning ? 'نعم' : 'لا'])].map(r => r.map(qv).join(',')).join('\r\n');
      const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' })); a.download = `زوار-الموقع-${new Date().toISOString().slice(0, 10)}.csv`; a.click();
    };
    if ($('#vClr')) $('#vClr').onclick = async () => { if (await confirmBox('مسح سجل الزوار', 'سيتم حذف كل بيانات الزيارات نهائياً.', true)) { await api('admin/site/clear-visits', {}).catch(fail); go('site'); } };
  } else {
    const { config: S } = await api('admin/site?days=1');
    const D = S.download || { mode: 'url' };
    box.innerHTML = `<div class="grid g2">
      <div><h4 class="mb">زر التحميل في الموقع</h4>
        <div class="field"><label>عند ضغط الزائر على «تحميل»</label><select class="in" id="sDm">
          <option value="file" ${D.mode === 'file' ? 'selected' : ''}>تحميل ملف التثبيت المرفوع على اللوحة</option>
          <option value="url" ${D.mode === 'url' ? 'selected' : ''}>فتح رابط أحدده (Google Drive، Dropbox...)</option>
          <option value="contact" ${D.mode === 'contact' ? 'selected' : ''}>تواصل عبر واتساب لاستلام النسخة</option></select></div>
        <div data-dm="file"><div class="note t-pr mb">${ic('download')} <div id="sDfInfo">${D.file ? `<b class="ltr">${esc(D.originalName)}</b> — ${fsize(D.size)}<br><span class="small muted">رُفع ${fdt(D.uploaded)} · عدد التحميلات: <b>${D.downloads || 0}</b></span>` : 'لا يوجد ملف مرفوع بعد'}</div></div>
          <div style="display:flex;gap:8px;align-items:center"><input type="file" class="in" id="sDf" accept=".exe,.msi,.zip" style="flex:1"><button class="btn pr" id="sDfUp">${ic('upload', 'sm')} رفع الملف</button>${D.file ? `<button class="btn dg" id="sDfDel" title="حذف الملف">${ic('trash', 'sm')}</button>` : ''}</div>
          <div class="small muted mt">ملف التثبيت RawajSetup.exe — يُحفظ في اللوحة ونسخته في MongoDB، والحجم يُحسب تلقائياً.</div></div>
        <div data-dm="url"><div class="field"><label>رابط التحميل المباشر</label><input class="in ltr" id="sDl" value="${esc(S.downloadUrl)}" placeholder="https://..."></div></div>
        <div data-dm="contact"><div class="note t-wa">${ic('alert')} <div>يظهر زر «تواصل لاستلام نسخة التحميل» ويفتح واتساب برسالة جاهزة.</div></div></div>
        <div class="fg mt"><div class="field"><label>رقم الإصدار</label><input class="in ltr" id="sVer" value="${esc(S.version)}" placeholder="3.0"></div><div class="field"><label>حجم الملف (فارغ = تلقائي)</label><input class="in ltr" id="sSize" value="${esc(S.fileSize)}" placeholder="${D.file ? fsize(D.size) : '18 MB'}"></div></div>
        <h4 class="mt mb">التواصل (فارغ = من config.js)</h4><div class="fg"><div class="field"><label>رقم واتساب (دولي)</label><input class="in ltr" id="sWa" value="${esc(S.whatsapp)}" placeholder="9665xxxxxxxx"></div><div class="field"><label>البريد</label><input class="in ltr" id="sEm" value="${esc(S.email)}"></div></div>
        <h4 class="mt mb">نص الواجهة الرئيسية (فارغ = النص الافتراضي)</h4>
        <div class="field"><label>العنوان الرئيسي</label><input class="in" id="sHt" value="${esc(S.hero.title)}" placeholder="أدِر أعمالك بقوة وفخامة من نظام واحد متكامل"></div>
        <div class="field"><label>الوصف</label><textarea class="ta" id="sHs" rows="3">${esc(S.hero.subtitle)}</textarea></div></div>
      <div><h4 class="mb">إظهار الأقسام</h4><div class="grid g2" style="gap:6px">${Object.entries(SEC_LBL).map(([k, l]) => `<label class="check"><input type="checkbox" data-sec="${k}" ${S.sections[k] !== false ? 'checked' : ''}> ${l}</label>`).join('')}</div>
        <h4 class="mt mb">شريط إعلان أعلى الموقع</h4><label class="check mb"><input type="checkbox" id="sAOn" ${S.announcement.on ? 'checked' : ''}> إظهار الإعلان</label>
        <div class="field"><label>نص الإعلان</label><input class="in" id="sAT" value="${esc(S.announcement.text)}" placeholder="🎉 خصم 20% على الباقة السنوية بكود RAWAJ20"></div>
        <div class="field"><label>رابط (اختياري)</label><input class="in ltr" id="sAL" value="${esc(S.announcement.link)}" placeholder="#plans"></div>
        <div class="note t-wa mt">${ic('alert')} <div>وضع صيانة الموقع من صفحة «الصيانة والإعلانات».</div></div></div></div>
      <button class="btn pr mt" id="sSave">${ic('check', 'sm')} حفظ ونشر على الموقع</button>`;
    const showDm = () => $$('[data-dm]').forEach(x => { x.hidden = x.dataset.dm !== $('#sDm').value; });
    $('#sDm').onchange = showDm; showDm();
    $('#sDfUp').onclick = async () => {
      const f = $('#sDf').files[0]; if (!f) return toast('اختر ملف التثبيت أولاً', true);
      if (f.size > 150 * 1048576) return toast('الحد الأقصى 150 MB', true);
      const b = $('#sDfUp'); b.disabled = true; b.textContent = 'جارٍ الرفع…';
      try {
        await api('admin/site/download-upload', { fileName: f.name, data: await fileToDataURL(f) });
        await api('admin/site/save', { downloadMode: 'file' });
        toast('تم رفع الملف — زر التحميل في الموقع يحمّله الآن'); go('site');
      } catch (e) { fail(e); b.disabled = false; b.textContent = 'رفع الملف'; }
    };
    if ($('#sDfDel')) $('#sDfDel').onclick = async () => { if (await confirmBox('حذف ملف التحميل', 'سيُحذف الملف من اللوحة ويعود الزر لرابط التحميل.', true)) { await api('admin/site/download-delete', {}).catch(fail); go('site'); } };
    $('#sSave').onclick = () => {
      if ($('#sDm').value === 'file' && !D.file) return toast('ارفع ملف التثبيت أولاً أو اختر وضعاً آخر', true);
      const sections = {}; $$('[data-sec]').forEach(i => { sections[i.dataset.sec] = i.checked; });
      api('admin/site/save', { downloadMode: $('#sDm').value, downloadUrl: $('#sDl').value, version: $('#sVer').value, fileSize: $('#sSize').value, whatsapp: $('#sWa').value, email: $('#sEm').value,
        hero: { title: $('#sHt').value, subtitle: $('#sHs').value }, sections, announcement: { on: $('#sAOn').checked, text: $('#sAT').value, link: $('#sAL').value } })
        .then(() => toast('تم الحفظ — يظهر في الموقع فوراً')).catch(fail);
    };
  }
};

/* =====================================================================
   الصيانة والإعلانات
   ===================================================================== */
/* =====================================================================
   الهوية والدعم — شعار النظام والموقع وأرقام الدعم (تصل فوراً للنظام والموقع)
   ===================================================================== */
V.branding = async el => {
  const { branding: B } = await api('admin/branding');
  let logo = B.logo;
  el.innerHTML = `<div class="grid g2"><div class="card" style="padding:22px"><h4 class="mb">الشعار</h4>
      <div style="display:flex;gap:18px;align-items:center"><div style="width:120px;height:120px;border-radius:28px;background:var(--bg2,#f1f2f7);display:grid;place-items:center;flex:none;overflow:hidden"><img id="bLogo" src="${esc(logo || '/logo.svg')}" style="width:100%;height:100%;object-fit:contain"></div>
        <div class="small muted">يظهر في النظام عند كل العملاء (الشريط الجانبي، شاشة الدخول، أيقونة النافذة) وفي الموقع (الشعار والأيقونة).<br>PNG أو SVG مربع، حتى 400KB. الأفضل 512×512 بخلفية شفافة.</div></div>
      <div style="display:flex;gap:8px;align-items:center;margin-top:14px"><input type="file" class="in" id="bFile" accept="image/png,image/svg+xml,image/jpeg,image/webp" style="flex:1"><button class="btn sec" id="bReset">${ic('refresh', 'sm')} الشعار الافتراضي</button></div>
      <div class="note t-wa mt">${ic('alert')} <div class="small">أيقونة ملف التثبيت وأيقونة البرنامج في ويندوز تُحدَّث عند بناء نسخة تثبيت جديدة فقط.</div></div></div>
    <div class="card" style="padding:22px"><h4 class="mb">بيانات الدعم الفني</h4>
      <div class="field"><label>رقم الواتساب (دولي بدون +)</label><input class="in ltr" id="bWa" value="${esc(B.whatsapp)}" placeholder="967735999135"></div>
      <div class="field"><label>الرقم كما يظهر للعملاء</label><input class="in ltr" id="bPl" value="${esc(B.phoneLabel)}" placeholder="+967 735 999 135"></div>
      <div class="field"><label>بريد الدعم</label><input class="in ltr" id="bEm" value="${esc(B.email)}" placeholder="support@example.com"></div>
      <div class="small muted">تُستخدم في النظام (خدمة العملاء، التفعيل، رسائل واتساب) وفي الموقع (أزرار التواصل).</div></div></div>
    <div class="flex mt"><button class="btn pr" id="bSave">${ic('check', 'sm')} حفظ ونشر</button><span class="small muted" style="align-self:center">آخر تحديث: ${fdt(B.updated)} · الإصدار ${B.ver}</span></div>`;
  $('#bFile').onchange = async e => {
    const f = e.target.files[0]; if (!f) return;
    if (f.size > 400 * 1024) { e.target.value = ''; return toast('حجم الشعار كبير — الحد 400KB', true); }
    logo = await fileToDataURL(f); $('#bLogo').src = logo;
  };
  $('#bReset').onclick = () => { logo = ''; $('#bLogo').src = '/logo.svg'; $('#bFile').value = ''; };
  $('#bSave').onclick = () => {
    const body = { whatsapp: $('#bWa').value, phoneLabel: $('#bPl').value, email: $('#bEm').value };
    if (logo !== B.logo) body.logo = logo;
    api('admin/branding/save', body).then(() => { toast('تم الحفظ — يظهر في النظام والموقع خلال ثوانٍ'); go('branding'); }).catch(fail);
  };
};

V.maintenance = async el => {
  const r = await api('admin/system'); const Y = r.system, W = r.site;
  const card = (id, title, sub, m, extra) => `<div class="card mnt ${m.on ? 'on' : ''}"><div class="card-h"><h3>${ic('settings')} ${title}</h3>${m.on ? '<span class="badge b-da">الصيانة مفعّلة</span>' : '<span class="badge b-su">يعمل بشكل طبيعي</span>'}</div><div class="card-b">
    <p class="small muted mb">${sub}</p><label class="switch-row"><input type="checkbox" id="${id}On" ${m.on ? 'checked' : ''}> <b>تفعيل وضع الصيانة</b></label>
    <div class="field mt"><label>رسالة الصيانة</label><textarea class="ta" id="${id}Msg" rows="3">${esc(m.message)}</textarea></div>
    <div class="field"><label>العودة المتوقعة (اختياري)</label><input class="in" id="${id}Until" value="${esc(m.until)}" placeholder="مثال: الساعة 10 مساءً"></div>${extra || ''}</div></div>`;
  el.innerHTML = `<div class="grid g2">${card('sy', 'صيانة النظام', 'يظهر للعملاء داخل النظام شاشة صيانة تمنع الاستخدام حتى إيقافها (تصل عند المزامنة خلال دقائق، وتُطبق عند الاتصال بالإنترنت).', Y.maintenance)}
    ${card('st', 'صيانة الموقع', 'يظهر لزوار الموقع صفحة «الموقع تحت الصيانة» مع وسائل التواصل بدلاً من المحتوى.', W.maintenance)}
    <div class="card"><div class="card-h"><h3>${ic('bell')} إعلان داخل النظام</h3></div><div class="card-b"><p class="small muted mb">شريط ملوّن أعلى النظام لدى كل العملاء (عرض، تحديث، تنبيه...) — يمكن للعميل إغلاقه.</p>
      <label class="switch-row"><input type="checkbox" id="anOn" ${Y.announcement.on ? 'checked' : ''}> <b>إظهار الإعلان</b></label>
      <div class="field mt"><label>نص الإعلان</label><input class="in" id="anT" value="${esc(Y.announcement.text)}"></div>
      <div class="fg"><div class="field"><label>النوع</label><select class="sel" id="anL">${[['info', 'معلومة'], ['success', 'خبر سار'], ['warning', 'تنبيه'], ['danger', 'هام']].map(([k, l]) => `<option value="${k}" ${Y.announcement.level === k ? 'selected' : ''}>${l}</option>`).join('')}</select></div>
      <div class="field"><label>رابط (اختياري)</label><input class="in ltr" id="anK" value="${esc(Y.announcement.link)}"></div></div></div></div>
    <div class="card"><div class="card-h"><h3>${ic('bell')} إعلان أعلى الموقع</h3></div><div class="card-b"><label class="switch-row"><input type="checkbox" id="saOn" ${W.announcement.on ? 'checked' : ''}> <b>إظهار الإعلان</b></label>
      <div class="field mt"><label>نص الإعلان</label><input class="in" id="saT" value="${esc(W.announcement.text)}"></div><div class="field"><label>رابط (اختياري)</label><input class="in ltr" id="saK" value="${esc(W.announcement.link)}"></div></div></div></div>
    <button class="btn pr mt" id="mSave">${ic('check', 'sm')} حفظ وتطبيق</button>`;
  $('#mSave').onclick = async () => {
    const on1 = $('#syOn').checked, on2 = $('#stOn').checked;
    if ((on1 && !Y.maintenance.on) && !await confirmBox('تفعيل صيانة النظام', 'سيتوقف النظام لدى جميع العملاء المتصلين حتى إيقاف الصيانة. متأكد؟', true)) return;
    try {
      await api('admin/system/save', { maintenance: { on: on1, message: $('#syMsg').value, until: $('#syUntil').value }, announcement: { on: $('#anOn').checked, text: $('#anT').value, level: $('#anL').value, link: $('#anK').value } });
      await api('admin/site/save', { maintenance: { on: on2, message: $('#stMsg').value, until: $('#stUntil').value }, announcement: { on: $('#saOn').checked, text: $('#saT').value, link: $('#saK').value } });
      toast('تم الحفظ والتطبيق'); go('maintenance');
    } catch (e) { fail(e); }
  };
};

/* =====================================================================
   الإعدادات: قاعدة البيانات السحابية MongoDB
   ===================================================================== */
async function mongoCard(box) {
  const r = await api('admin/mongo'); const S = r.state;
  const status = !S.enabled ? '<span class="badge b-ne">غير مفعّل — التخزين محلي</span>' : S.connected ? '<span class="badge b-su">متصل</span>' : '<span class="badge b-da">غير متصل — يعمل محلياً مؤقتاً</span>';
  const total = Object.values(r.counts || {}).reduce((a, b) => a + b, 0);
  box.innerHTML = `<div class="card-h"><h3>${ic('db')} قاعدة البيانات السحابية (MongoDB)</h3>${status}</div><div class="card-b">
    ${!r.installed ? `<div class="note t-da">${ic('alert')} <div>مكتبة pymongo غير مثبتة على جهاز اللوحة — نفّذ: <span class="ltr">python -m pip install pymongo</span></div></div>` : ''}
    <p class="small muted mb">عند الربط تصبح MongoDB المصدر الرئيسي لبيانات اللوحة (الأجهزة، الحسابات، الطلبات، المبيعات، الزوار...)، وتُرفع كل التعديلات تلقائياً.
      تبقى نسخة محلية احتياطية تعمل بها اللوحة عند انقطاع الاتصال. الرابط يُحفظ مشفّراً على جهاز اللوحة فقط ولا يصل للنظام أو الموقع.</p>
    ${r.hasUri ? `<div class="kv mb"><div><div class="k">الرابط الحالي</div><div class="v ltr small">${esc(r.uri)}</div></div><div><div class="k">قاعدة البيانات</div><div class="v ltr">${esc(r.db)}</div></div>
      <div><div class="k">آخر مزامنة</div><div class="v">${r.lastSync ? fdt(r.lastSync) + ' · ' + ago(r.lastSync) : '—'}</div></div><div><div class="k">المستندات في السحابة</div><div class="v num">${fnum(total)}</div></div>
      <div><div class="k">مصدر البيانات عند التشغيل</div><div class="v">${r.loadedFrom === 'mongo' ? 'MongoDB' : 'الملف المحلي'}</div></div>${S.host ? `<div><div class="k">الخادم</div><div class="v ltr small">${esc(S.host)}</div></div>` : ''}</div>` : ''}
    ${S.lastError && S.enabled ? `<div class="note t-wa">${ic('alert')} <div class="small ltr" style="text-align:right">${esc(S.lastError)}</div></div>` : ''}
    <div class="field"><label>${r.hasUri ? 'تغيير رابط الاتصال (اختياري)' : 'رابط الاتصال (Connection String)'}</label><input class="in ltr" id="mgUri" type="password" autocomplete="off" placeholder="mongodb+srv://user:password@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority"></div>
    <div class="fg"><div class="field"><label>اسم قاعدة البيانات</label><input class="in ltr" id="mgDb" value="${esc(r.db)}"></div><div class="field"><label>&nbsp;</label><label class="check"><input type="checkbox" id="mgShow"> إظهار الرابط أثناء الكتابة</label></div></div>
    <div class="flex wrap"><button class="btn sec" id="mgTest">${ic('refresh', 'sm')} اختبار الاتصال</button><button class="btn pr" id="mgSave">${ic('check', 'sm')} حفظ وتفعيل الربط</button>
      ${S.enabled ? `<button class="btn sec" id="mgSync">${ic('upload', 'sm')} مزامنة كاملة الآن</button><button class="btn sec" id="mgPull">${ic('download', 'sm')} تحميل من MongoDB</button><button class="btn dg" id="mgOff">إيقاف الربط</button>` : ''}
      ${r.hasUri && !S.enabled ? `<button class="btn gh" id="mgForget">حذف الرابط</button>` : ''}</div>
    <div id="mgMsg" class="small mt"></div>
    <details class="mt"><summary class="small bold" style="cursor:pointer">كيف أحصل على الرابط من MongoDB Atlas؟</summary><ol class="small muted" style="padding-right:18px;margin-top:8px;line-height:2">
      <li>ادخل <span class="ltr">mongodb.com/atlas</span> وأنشئ حساباً و Cluster (الخطة المجانية M0 تكفي للبداية).</li>
      <li>Database Access ← أنشئ مستخدماً بكلمة مرور قوية وصلاحية Read and write.</li>
      <li>Network Access ← أضف عنوان IP جهاز/خادم اللوحة (أو 0.0.0.0/0 للسماح من أي مكان).</li>
      <li>Connect ← Drivers ← انسخ الرابط واستبدل &lt;password&gt; بكلمة مرور المستخدم، ثم الصقه هنا.</li></ol></details></div>`;
  const msg = (t, ok) => { $('#mgMsg', box).innerHTML = `<span class="${ok ? 'success' : 'danger'}">${t}</span>`; };
  $('#mgShow', box).onchange = e => { $('#mgUri', box).type = e.target.checked ? 'text' : 'password'; };
  $('#mgTest', box).onclick = async () => {
    msg('<span class="muted">جارٍ الاختبار…</span>', true);
    const t = await api('admin/mongo/test', { uri: $('#mgUri', box).value, db: $('#mgDb', box).value }).catch(e => ({ ok: false, error: e.message }));
    t.ok ? msg(`✓ الاتصال ناجح${t.host ? ' — ' + esc(t.host) : ''} · ${t.empty ? 'قاعدة البيانات فارغة (ستُرفع بياناتك الحالية)' : 'تحتوي ' + t.collections + ' مجموعة'}`, true) : msg('✗ ' + esc(t.error), false);
  };
  $('#mgSave', box).onclick = async () => {
    const b = $('#mgSave', box); b.disabled = true; msg('<span class="muted">جارٍ الاتصال والحفظ…</span>', true);
    try {
      const s = await api('admin/mongo/save', { uri: $('#mgUri', box).value, db: $('#mgDb', box).value });
      if (s.needsChoice) {
        const m = modal({ title: 'قاعدة MongoDB تحتوي بيانات مسبقاً', body: `<p class="muted">اختر أي البيانات تُعتمد:</p>
          <div class="grid g2 mt"><button class="btn sec" id="chPull" style="height:auto;padding:14px;flex-direction:column">${ic('download')}<b>استخدام بيانات MongoDB</b><span class="xs muted">تستبدل بيانات اللوحة الحالية (تُحفظ نسخة احتياطية أولاً)</span></button>
          <button class="btn sec" id="chPush" style="height:auto;padding:14px;flex-direction:column">${ic('upload')}<b>رفع بيانات اللوحة الحالية</b><span class="xs muted">تستبدل ما في MongoDB ببيانات هذه اللوحة</span></button></div>` });
        $('#chPull', m.el).onclick = async () => { await api('admin/mongo/pull', {}).catch(fail); m.close(); toast('تم التحميل من MongoDB'); location.reload(); };
        $('#chPush', m.el).onclick = async () => { const x = await api('admin/mongo/push', {}).catch(fail); m.close(); if (x) toast(`تم رفع البيانات (${fnum(x.written)} مستند)`); mongoCard(box); };
      } else { toast(s.ok ? `تم الربط ورفع البيانات الحالية (${fnum(s.migrated)} مستند)` : 'تم الحفظ'); }
      mongoCard(box);
    } catch (e) { msg('✗ ' + esc(e.message), false); b.disabled = false; }
  };
  if ($('#mgSync', box)) $('#mgSync', box).onclick = async () => { const x = await api('admin/mongo/push', {}).catch(fail); if (x) toast(`تمت المزامنة (${fnum(x.written)} مستند)`); mongoCard(box); };
  if ($('#mgPull', box)) $('#mgPull', box).onclick = async () => { if (!await confirmBox('تحميل من MongoDB', 'ستُستبدل بيانات اللوحة الحالية بما في MongoDB (تُحفظ نسخة احتياطية محلية أولاً).', true)) return; await api('admin/mongo/pull', {}).then(() => location.reload()).catch(fail); };
  if ($('#mgOff', box)) $('#mgOff', box).onclick = async () => { if (!await confirmBox('إيقاف الربط', 'ستعمل اللوحة بالتخزين المحلي فقط ولن تُرفع التعديلات. البيانات الموجودة في MongoDB لن تُحذف.', true)) return; await api('admin/mongo/disable', {}).catch(fail); mongoCard(box); };
  if ($('#mgForget', box)) $('#mgForget', box).onclick = async () => { await api('admin/mongo/forget', {}).catch(fail); mongoCard(box); };
}
