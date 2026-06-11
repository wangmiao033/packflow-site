
// page visit tracking -> Supabase page_visit_logs (admin.hnchpower.cn 后台监测)
(function () {
  var SUPA_URL = 'https://bypekqxsnuvqbgvdosdl.supabase.co';
  var SUPA_KEY = 'sb_publishable_TFfmF3_7t8ceSwP1B0iKxA_sfcb5kca';
  var THROTTLE_MS = 45000;
  var VID_KEY = 'pf_visitor_key';

  function randomId() {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
    return 'pf_' + Date.now() + '_' + String(Math.random()).slice(2, 12);
  }
  function visitorKey() {
    try {
      var v = localStorage.getItem(VID_KEY);
      if (v && v.length >= 8) return v;
      v = randomId();
      localStorage.setItem(VID_KEY, v);
      return v;
    } catch (e) { return randomId(); }
  }
  function throttled(path) {
    try {
      var key = 'pf_pvl:' + path;
      var now = Date.now();
      var last = parseInt(sessionStorage.getItem(key) || '0', 10);
      if (now - last < THROTTLE_MS) return true;
      sessionStorage.setItem(key, String(now));
      return false;
    } catch (e) { return false; }
  }
  var path = (location.pathname || '/') + (location.search || '');
  if (path.length > 2048) path = path.slice(0, 2048);
  if (throttled(path)) return;
  var row = {
    path: path,
    url: location.href.slice(0, 2048),
    page_type: 'packflow',
    referrer: (document.referrer || '').slice(0, 2048) || null,
    ua: (navigator.userAgent || '').slice(0, 4096) || null,
    visitor_key: visitorKey(),
    is_logged_in: false
  };
  try {
    fetch(SUPA_URL + '/rest/v1/page_visit_logs', {
      method: 'POST',
      headers: {
        apikey: SUPA_KEY,
        Authorization: 'Bearer ' + SUPA_KEY,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal'
      },
      body: JSON.stringify(row),
      keepalive: true
    }).catch(function () {});
  } catch (e) {}
})();

const root = document.documentElement;
const glow = document.querySelector('.cursor-glow');
window.addEventListener('mousemove', e => {
  if (glow) { glow.style.left = e.clientX + 'px'; glow.style.top = e.clientY + 'px'; }
});
const themeToggle = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('pf-theme');
if (savedTheme) root.dataset.theme = savedTheme;
if (themeToggle) themeToggle.onclick = () => {
  root.dataset.theme = root.dataset.theme === 'light' ? '' : 'light';
  localStorage.setItem('pf-theme', root.dataset.theme || 'dark');
};
const io = new IntersectionObserver(entries => {
  entries.forEach(entry => { if(entry.isIntersecting) entry.target.classList.add('visible'); });
},{threshold:.12});
document.querySelectorAll('.reveal').forEach(el => io.observe(el));
const counters = document.querySelectorAll('[data-count]');
const countIo = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting || entry.target.dataset.done) return;
    entry.target.dataset.done = '1';
    const target = Number(entry.target.dataset.count); let n = 0;
    const timer = setInterval(() => { n += Math.ceil(target / 32); if(n >= target){n = target; clearInterval(timer)} entry.target.textContent = n + '+'; }, 24);
  });
},{threshold:.7});
counters.forEach(c => countIo.observe(c));
const runBtn = document.getElementById('runDemo');
const factory = document.getElementById('factory');
const log = document.getElementById('demoLog');
const steps = [...document.querySelectorAll('#stepper span')];
const dropZone = document.getElementById('dropZone');
const lines = [
  '开工：小人拖进 16 个素材包。',
  '扫描完成：zip / rar / 7z 混合包已识别。',
  '深度解压：发现二级压缩包 3 个，继续拆。',
  '识别尺寸：1024x1024、1080x1920、1920x1080。',
  '重命名：001.jpg / 002.jpg；生成 CSV 清单。',
  '完成：final_materials.zip 已打包，开香槟。'
];
function setStep(i){steps.forEach((s,idx)=>s.classList.toggle('active', idx <= i)); document.querySelectorAll('.stage').forEach((s,idx)=>s.classList.toggle('on', idx <= i));}
function runDemo(){
  if (!factory || !log) return;
  factory.classList.remove('running','done'); void factory.offsetWidth; factory.classList.add('running');
  if (dropZone) dropZone.classList.add('active');
  log.textContent = '';
  setStep(0);
  lines.forEach((line, idx) => {
    setTimeout(() => {
      log.textContent += (idx ? '\n' : '') + line;
      if (idx > 0 && idx < 5) setStep(Math.min(idx - 1, 3));
      if (idx === 5) { setStep(3); factory.classList.add('done'); if(dropZone) dropZone.classList.remove('active'); }
    }, idx * 900);
  });
}
if (runBtn) runBtn.onclick = runDemo;
if (dropZone) {
  ['dragenter','dragover'].forEach(evt => dropZone.addEventListener(evt, e => {e.preventDefault(); dropZone.classList.add('active')}));
  ['dragleave','drop'].forEach(evt => dropZone.addEventListener(evt, e => {e.preventDefault(); dropZone.classList.remove('active'); if(evt === 'drop') runDemo()}));
}


// floating support widget (email + wechat)
const PF_CONTACT = {
  email: 'wangmiao@dxyx6888.com',
  emailSubject: 'PackFlow 用户反馈',
  wechat: 'yiwa033',
  wechatName: '伊娃Chloe'
};
(function () {
  const fab = document.createElement('div');
  fab.className = 'support-fab';
  fab.innerHTML = `
    <div class="support-panel" role="dialog" aria-label="联系客服">
      <h3>联系我们</h3>
      <a class="support-item" href="mailto:${PF_CONTACT.email}?subject=${encodeURIComponent(PF_CONTACT.emailSubject)}">
        <i class="mail-ic">✉</i>
        <span>发邮件反馈<small>${PF_CONTACT.email}</small></span>
      </a>
      <button class="support-item" type="button" id="pfWechatBtn">
        <i class="wx-ic">微</i>
        <span>微信联系 ${PF_CONTACT.wechatName}<small>点击复制微信号：${PF_CONTACT.wechat}</small></span>
      </button>
      <p class="support-tip" id="pfSupportTip">微信号已复制，去微信添加好友</p>
    </div>
    <button class="support-fab-btn" type="button" aria-label="联系客服" aria-expanded="false">💬</button>
  `;
  document.body.appendChild(fab);
  const fabBtn = fab.querySelector('.support-fab-btn');
  fabBtn.addEventListener('click', () => {
    const open = fab.classList.toggle('open');
    fabBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (!open) fab.classList.remove('tip-on');
  });
  document.addEventListener('click', e => {
    if (!fab.contains(e.target)) { fab.classList.remove('open', 'tip-on'); fabBtn.setAttribute('aria-expanded', 'false'); }
  });
  const wxBtn = fab.querySelector('#pfWechatBtn');
  const tip = fab.querySelector('#pfSupportTip');
  wxBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(PF_CONTACT.wechat);
      tip.textContent = '微信号已复制，去微信添加好友';
    } catch (e) {
      tip.textContent = '复制失败，微信号：' + PF_CONTACT.wechat;
    }
    fab.classList.add('tip-on');
  });
})();

// v13: copy SHA256 from advanced download section
document.querySelectorAll('[data-copy]').forEach(btn => {
  btn.addEventListener('click', async () => {
    const value = btn.getAttribute('data-copy') || '';
    try {
      await navigator.clipboard.writeText(value);
      const old = btn.textContent;
      btn.textContent = '已复制';
      setTimeout(() => btn.textContent = old, 1300);
    } catch (e) {
      const old = btn.textContent;
      btn.textContent = '请手动复制';
      setTimeout(() => btn.textContent = old, 1300);
    }
  });
});
