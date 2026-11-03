/* ================= player: narration drives the clock ================= */
const $ = id => document.getElementById(id);
const RENDER = document.documentElement.classList.contains('render');
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
let SC = null, TOTAL = 0, Tg = 0, playing = false, booted = false, dirty = true, speed = 1, ccOn = false, curCh = -1, capIdx = -2;
const vo = $('vo'), HAS_VO = !!(vo && vo.getAttribute('src') && vo.getAttribute('src').indexOf('__') !== 0);
const ICON_PLAY = '<svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M3.5 1.8v10.4a.6.6 0 0 0 .9.5l8.2-5.2a.6.6 0 0 0 0-1L4.4 1.3a.6.6 0 0 0-.9.5z" fill="currentColor"/></svg>';
const ICON_PAUSE = '<svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><rect x="3" y="2" width="3" height="10" rx="1" fill="currentColor"/><rect x="8" y="2" width="3" height="10" rx="1" fill="currentColor"/></svg>';
const fmt = s => { s = Math.max(0, Math.round(s)); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); };
/* subtitles: one band at the bottom, off by default */
let capT = [], capBand = null;
function buildCC() {
  const L = $('caps');
  capBand = E('rect', { x: 160, y: 950, width: 1600, height: 110, rx: 18, fill: '#1A1A1A', 'fill-opacity': 0.78 }, L);
  capT = [0, 1].map(k => { const t = E('text', { x: 960, y: 0, 'font-family': HAND, 'font-size': 46, fill: '#F6F6EA', 'text-anchor': 'middle', 'dominant-baseline': 'central' }, L); return t; });
}
function showCue(i) {
  if (i === capIdx) return; capIdx = i;
  const L = $('caps');
  if (i < 0) { L.setAttribute('opacity', 0); return; }
  L.setAttribute('opacity', 1);
  const words = TM.cues[i][2].split(' '); let lines = [words.join(' ')];
  capT[0].textContent = lines[0];
  if (capT[0].getComputedTextLength() > 1500) { let best = null; for (let k = 1; k < words.length; k++) { capT[0].textContent = words.slice(0, k).join(' '); const wa = capT[0].getComputedTextLength(); capT[0].textContent = words.slice(k).join(' '); const w = Math.max(wa, capT[0].getComputedTextLength()); if (!best || w < best.w) best = { w, k }; } lines = [words.slice(0, best.k).join(' '), words.slice(best.k).join(' ')]; }
  const two = lines.length === 2;
  capBand.setAttribute('y', two ? 932 : 966); capBand.setAttribute('height', two ? 128 : 82);
  capT[0].textContent = lines[0]; capT[0].setAttribute('y', two ? 966 : 1007);
  capT[1].textContent = two ? lines[1] : ''; capT[1].setAttribute('y', 1026);
}
function cueAt(T) { const c = TM.cues; for (let i = 0; i < c.length; i++) if (T >= c[i][0] && T < c[i][1] + 0.25) return i; return -1; }
function setPlaying(p) {
  if (p && Tg >= TOTAL - 0.05) Tg = 0;
  playing = p; dirty = true;
  if (HAS_VO) { if (p && Tg < (vo.duration || 1e9) - 0.05) { vo.currentTime = Tg; vo.playbackRate = speed; vo.play().catch(() => {}); } else vo.pause(); }
  if (!RENDER) { $('play').innerHTML = p ? ICON_PAUSE : ICON_PLAY; $('play').setAttribute('aria-label', p ? 'Pause' : 'Play'); $('bigplay').hidden = p || Tg > 0.05; }
}
function seek(t) { Tg = clamp(t, 0, TOTAL); if (HAS_VO && playing) { if (Tg < (vo.duration || 1e9) - 0.05) { vo.currentTime = Tg; if (vo.paused) vo.play().catch(() => {}); } else vo.pause(); } dirty = true; }
function render() {
  SC.render(Tg);
  if (RENDER) return;
  if (ccOn) showCue(cueAt(Tg));
  const el = $('seek'); el.value = Math.round(Tg * 10); el.style.setProperty('--p', (Tg / TOTAL).toFixed(4)); $('clock').textContent = fmt(Tg) + ' / ' + fmt(TOTAL);
  let ch = 0; TM.chapters.forEach((c, i) => { if (Tg >= c[0] - 0.01) ch = i; });
  if (ch !== curCh) { curCh = ch; document.querySelectorAll('#chapters button').forEach((b, i) => { b.classList.toggle('on', i === ch); b.setAttribute('aria-current', i === ch ? 'true' : 'false'); }); }
}
let last = performance.now();
function frame(now) {
  const dt = Math.min(0.1, (now - last) / 1000); last = now;
  if (playing) {
    if (HAS_VO && !vo.paused && !vo.ended && vo.readyState >= 2) Tg = vo.currentTime; else Tg += dt * speed;
    if (Tg >= TOTAL) { Tg = TOTAL; setPlaying(false); }
    dirty = true;
  }
  if (dirty) { render(); dirty = false; }
  requestAnimationFrame(frame);
}
function boot(mjOK) {
  if (booted) return; booted = true;
  MJ = !!(mjOK && window.MathJax && MathJax.tex2svg);
  SC = build($("scenes")); window.__SC = SC; SC.finish(); SC.mobs.forEach(m => m.prep());
  TOTAL = Math.max(TM.total, SC.dur || 0);
  $('loading').hidden = true;
  window.__frame = t => { Tg = clamp(t, 0, TOTAL); render(); };
  window.__total = TOTAL; window.__ready = true;
  /* clutter probe: how many things are animating at time t (camera counted separately) */
  window.__stats = t => { const ms = new Set(); let cam = 0; for (const w of SC.tw) { if (w.dur <= 0 || t < w.t0 || t >= w.t0 + w.dur) continue; if (w.m instanceof Cam) { cam = 1; continue; } if (w.k === 'color' || w.from === w.to) continue; ms.add(w.k === 'o' && w.to <= 0.3 ? 'fade/dim' : (w.m.grp || w.m)); } return { movers: ms.size, cam }; };
  if (RENDER) { render(); return; }
  buildCC();
  $('seek').max = Math.round(TOTAL * 10);
  $('ticks').innerHTML = TM.chapters.slice(1).map(c => `<i style="left:${(c[0] / TOTAL * 100).toFixed(2)}%"></i>`).join('');
  $('chapters').innerHTML = '<div class="act">' + TM.chapters.map((c, i) => `<button type="button" data-k="${i}"><span class="n">${i ? i : '·'}</span>${i ? c[1] : 'Intro'}</button>`).join('') + '</div>';
  $('note').textContent = `${EP_LABEL}, ${fmt(TOTAL)}, narrated. Subtitles are off by default: press CC or C. Speed changes keep the voice in sync.`;
  $('chapters').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; seek(TM.chapters[+b.dataset.k][0] + 0.01); if (!playing) setPlaying(true); });
  const seekEl = $('seek'); seekEl.addEventListener('input', () => seek(seekEl.value / 10));
  $('play').addEventListener('click', () => setPlaying(!playing));
  $('bigplay').addEventListener('click', () => setPlaying(true));
  $('stage').addEventListener('click', () => setPlaying(!playing));
  const setCC = on => { ccOn = on; $('cc').setAttribute('aria-pressed', String(on)); $('caps').style.display = on ? '' : 'none'; capIdx = -2; dirty = true; };
  $('cc').addEventListener('click', () => setCC(!ccOn));
  $('speed').addEventListener('change', e => { speed = +e.target.value; if (HAS_VO) vo.playbackRate = speed; });
  addEventListener('keydown', e => {
    if (e.target.closest && e.target.closest('input,select') && e.code !== 'Space') return;
    if (e.code === 'Space') { e.preventDefault(); setPlaying(!playing); }
    else if (e.key === 'ArrowRight') seek(Tg + 5);
    else if (e.key === 'ArrowLeft') seek(Tg - 5);
    else if (e.key === 'c' || e.key === 'C') setCC(!ccOn);
  });
  setPlaying(false); $('bigplay').hidden = false; render();
  requestAnimationFrame(frame);
}
let mjState = (window.MathJax && window.MathJax.tex2svg) ? true : null, fontsOK = false;
const tryBoot = () => { if (!booted && mjState !== null && fontsOK) boot(mjState); };
window.__mj = ok => { if (mjState === null) mjState = ok; tryBoot(); };
Promise.race([Promise.all([document.fonts.load('400 40px "Patrick Hand"'), document.fonts.load('400 20px "JetBrains Mono"'), document.fonts.load('700 20px "JetBrains Mono"')]), new Promise(r => setTimeout(r, 4000))]).then(() => { fontsOK = true; tryBoot(); });
setTimeout(() => { if (mjState === null) mjState = !!(window.MathJax && window.MathJax.tex2svg); fontsOK = true; tryBoot(); }, 9000);
if (!RENDER) $('play').innerHTML = ICON_PLAY;
