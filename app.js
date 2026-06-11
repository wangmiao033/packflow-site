
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
