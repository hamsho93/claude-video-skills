/* ================= engine ================= */
const NS = 'http://www.w3.org/2000/svg';
/* his notebook inks + highlighters */
const P = { paper:'#F6F6EA', rule:'#DCE2E3', margin:'#1E5631', ink:'#1A1A1A', soft:'#77766C', green:'#1E5631', blue:'#4F63E6', magenta:'#E0218A', lime:'#22B14C', olive:'#7A8F1C', flame:'#F2A33A', hlC:'#8EE6EE', hlO:'#F9C98A', hlL:'#8EF08E' };
const HAND = '"Patrick Hand", "Segoe Print", "Comic Sans MS", cursive';
const FS = 1.06; /* handwriting runs a touch larger than the nominal sizes below */
const clamp = (x, a = 0, b = 1) => x < a ? a : x > b ? b : x;
const lerp = (a, b, t) => a + (b - a) * t;
const smoothE = t => t <= 0 ? 0 : t >= 1 ? 1 : t * t * t * (t * (t * 6 - 15) + 10);
const linear = t => t;
const springE = t => t <= 0 ? 0 : t >= 1 ? 1 : 1 - Math.exp(-6 * t) * Math.cos(13 * t);
const ss = (a, b, x) => { const t = clamp((x - a) / (b - a)); return t * t * (3 - 2 * t); };
const hex2 = h => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
function lerpColor(a, b, t) { if (!a) return b; if (!b) return a; if (t <= 0) return a; if (t >= 1) return b; const A = hex2(a), B = hex2(b); return '#' + A.map((v, i) => Math.round(lerp(v, B[i], t)).toString(16).padStart(2, '0')).join(''); }
function E(tag, attrs, parent) { const e = document.createElementNS(NS, tag); if (attrs) for (const k in attrs) e.setAttribute(k, attrs[k]); if (parent) parent.appendChild(e); return e; }
const WRITE_SW = 34;
let MJ = false;
const DEFS = document.getElementById('defs');

function fallbackText(s) {
  return s.replace(/\\textcolor\{[^}]*\}/g, '').replace(/\^\\circ/g, '°').replace(/\\arctan/g, 'arctan')
    .replace(/\\(text|mathrm|textbf|mathbf|texttt|textit)\{([^}]*)\}/g, '$2')
    .replace(/\\frac\{([^}]*)\}\{([^}]*)\}/g, '$1/$2')
    .replace(/\\approx/g, '≈').replace(/\\cdot/g, '·').replace(/\\theta/g, 'θ').replace(/\\;|\\,|\\quad|\\!|\\ /g, ' ')
    .replace(/_\{([^}]*)\}/g, '$1').replace(/[{}]/g, '').replace(/\\/g, '');
}
function texNode(src, size = 36) {
  const g = E('g');
  let svg = null;
  if (MJ) { try { svg = MathJax.tex2svg(src, { display: false }).querySelector('svg'); } catch (e) { console.warn('tex fallback', src); } }
  if (svg) {
    const vb = svg.getAttribute('viewBox').split(/[\s,]+/).map(Number);
    const k = size / 1000, w = vb[2] * k, h = vb[3] * k;
    ['style', 'role', 'focusable'].forEach(a => svg.removeAttribute(a)); svg.setAttribute('aria-hidden', 'true'); svg.setAttribute('class', 'mj');
    svg.setAttribute('width', w.toFixed(2)); svg.setAttribute('height', h.toFixed(2));
    svg.setAttribute('x', (-w / 2).toFixed(2)); svg.setAttribute('y', (-h / 2).toFixed(2));
    svg.setAttribute('overflow', 'visible'); g.appendChild(svg); g._w = w; g._h = h;
  } else {
    const t = E('text', { 'text-anchor': 'middle', 'dominant-baseline': 'central', 'font-size': size * 0.9, fill: 'currentColor', 'font-family': HAND }, g);
    t.textContent = fallbackText(src); g._w = size * 0.5 * t.textContent.length; g._h = size;
  }
  return g;
}
const sLen = n => { try { return n.getTotalLength() || 1; } catch (e) { return 600; } };

class Mob {
  constructor(g, color = P.ink) { this.g = g; g.setAttribute('data-mob', ''); this.init = { x:0, y:0, s:1, r:0, o:0, draw:0, color }; this.cur = null; this.L = {}; }
  own(n) { return n.closest('[data-mob]') === this.g; }
  prep() {
    if (this.wipe) { const bb = this.wipe.t.getBBox(); this.wipe.bb = { x: bb.x - 10, w: bb.width + 20 }; const r = this.wipe.r; r.setAttribute('x', this.wipe.bb.x); r.setAttribute('y', bb.y - 16); r.setAttribute('height', bb.height + 32); }
    const shapes = [], glyphs = [];
    this.g.querySelectorAll('path,rect,circle,ellipse,line,polyline,polygon').forEach(n => { if (!this.own(n)) return; if (n.closest('svg.mj')) glyphs.push(n); else if (!n.hasAttribute('data-nd')) shapes.push(n); });
    this.shapes = shapes.map(n => { const f = n.getAttribute('fill'); return { n, len: sLen(n), fo: (!f || f === 'none') ? 0 : +(n.getAttribute('fill-opacity') ?? 1), st: n.getAttribute('stroke') && n.getAttribute('stroke') !== 'none' }; });
    this.glyphs = glyphs.map(n => ({ n, len: sLen(n) }));
    this.texts = [...this.g.querySelectorAll('text')].filter(n => this.own(n) && !n.hasAttribute('data-nd') && !n.closest('svg.mj'));
  }
  apply(st) {
    const L = this.L;
    if (st.x !== L.x || st.y !== L.y || st.s !== L.s || st.r !== L.r) this.g.setAttribute('transform', `translate(${st.x.toFixed(2)} ${st.y.toFixed(2)}) rotate(${st.r.toFixed(2)}) scale(${st.s.toFixed(4)})`);
    if (st.o !== L.o) { this.g.setAttribute('opacity', clamp(st.o).toFixed(3)); this.g.style.display = st.o <= 0.003 ? 'none' : ''; }
    if (st.color !== L.color && st.color) this.g.style.color = st.color;
    if (st.draw !== L.draw) this.setDraw(st.draw);
    L.x = st.x; L.y = st.y; L.s = st.s; L.r = st.r; L.o = st.o; L.color = st.color; L.draw = st.draw;
  }
  setDraw(p) {
    if (this.wipe) { const r = this.wipe.r; if (p >= 1) { r.setAttribute('x', -5000); r.setAttribute('width', 10000); } else { r.setAttribute('x', this.wipe.bb.x); r.setAttribute('width', (this.wipe.bb.w * clamp(p)).toFixed(1)); } }
    this.texts.forEach(n => { n.style.fillOpacity = ss(0.05, 1, p).toFixed(3); });
    const ns = this.shapes.length, lag = ns > 1 ? Math.min(0.55, 0.07 * ns) : 0;
    this.shapes.forEach((sh, i) => {
      const q = clamp((p - (ns > 1 ? i / (ns - 1) * lag : 0)) / (1 - lag)), n = sh.n;
      if (sh.st) {
        if (q >= 1) { n.style.strokeDasharray = ''; n.style.strokeDashoffset = ''; n.style.strokeOpacity = ''; }
        else { n.style.strokeDasharray = sh.len + ' ' + sh.len; n.style.strokeDashoffset = (sh.len * (1 - clamp(q / 0.8))).toFixed(1); n.style.strokeOpacity = q <= 0 ? '0' : ''; }
      }
      if (sh.fo > 0) n.style.fillOpacity = (sh.fo * (sh.st ? ss(0.5, 1, q) : ss(0, 1, q))).toFixed(3);
    });
    const ng = this.glyphs.length, w = Math.min(1, 0.22 + 3.5 / Math.max(1, ng));
    this.glyphs.forEach((gl, i) => {
      const q = clamp((p - (ng > 1 ? i / (ng - 1) * (1 - w) : 0)) / w), n = gl.n;
      if (q >= 1) { n.style.strokeWidth = '0'; n.style.strokeDasharray = ''; n.style.fillOpacity = '1'; }
      else if (q <= 0) { n.style.strokeWidth = '0'; n.style.fillOpacity = '0'; }
      else { n.style.strokeWidth = WRITE_SW; n.style.strokeDasharray = gl.len + ' ' + gl.len; n.style.strokeDashoffset = (gl.len * (1 - clamp(q / 0.6))).toFixed(1); n.style.fillOpacity = ss(0.45, 1, q).toFixed(3); }
    });
  }
}

class Scene {
  constructor(host) { this.root = E('g', { class: 'scene' }, host); this.mobs = []; this.tw = []; this.drv = []; this.dur = 1; }
  add(m, x = 0, y = 0, o, parent) { Object.assign(m.init, { x, y }, o || {}); m.cur = { ...m.init }; this.mobs.push(m); (parent || this.root).appendChild(m.g); return m; }
  behind(m, ref) { ref.g.parentNode.insertBefore(m.g, ref.g); return m; }
  set(m, t0, dur, to, ease = smoothE) { for (const k in to) { this.tw.push({ m, k, from: m.cur[k], to: to[k], t0, dur, ease }); m.cur[k] = to[k]; } this.dur = Math.max(this.dur, t0 + dur); return m; }
  create(m, t, d = 1.2) { this.set(m, t, 0, { o: 1 }); return this.set(m, t, d, { draw: 1 }, linear); }
  fadeIn(m, t, d = 0.6, sh = {}) { const x = m.cur.x, y = m.cur.y; this.set(m, t, 0, { draw: 1, x: x + (sh.dx || 0), y: y + (sh.dy || 0) }); return this.set(m, t, d, { o: sh.o ?? 1, x, y }); }
  fadeOut(m, t, d = 0.5, sh = {}) { return this.set(m, t, d, { o: 0, x: m.cur.x + (sh.dx || 0), y: m.cur.y + (sh.dy || 0) }); }
  move(m, t, d, x, y, ease) { return this.set(m, t, d, { x, y }, ease); }
  out(ms, t, d = 0.5) { ms.forEach(m => m && this.fadeOut(m, t, d)); }
  drive(fn) { this.drv.push(fn); }
  end(t) { this.dur = Math.max(this.dur, t); }
  finish() { this.tw.sort((a, b) => a.t0 - b.t0); }
  render(t) {
    const st = new Map();
    for (const m of this.mobs) st.set(m, { ...m.init });
    for (const w of this.tw) {
      if (t < w.t0) break;
      const p = w.dur > 0 ? clamp((t - w.t0) / w.dur) : 1, e = w.ease(p), s = st.get(w.m);
      s[w.k] = w.k === 'color' ? lerpColor(w.from, w.to, e) : lerp(w.from, w.to, e);
    }
    for (const m of this.mobs) m.apply(st.get(m));
    for (const f of this.drv) f(t);
  }
}

/* ================= notebook kit: wobbly pen strokes, handwriting, highlighters ================= */
const f1 = v => (Math.round(v * 10) / 10).toString();
let _s = 20261013; const rnd = () => (_s = (_s * 16807) % 2147483647) / 2147483647; const jit = a => (rnd() - 0.5) * 2 * a;
const D2R = Math.PI / 180;

/* one pen stroke: slight bow, slight overshoot past both ends */
function rl(x1, y1, x2, y2, o = {}) {
  const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy) || 1, ux = dx / L, uy = dy / L, nx = -uy, ny = ux;
  const ov = o.ov ?? Math.min(5, L * 0.035), j = o.j ?? 1.1;
  const bow = (o.bow ?? 0.012) * L * (rnd() < 0.5 ? -1 : 1) * (0.4 + rnd() * 0.6);
  const s0 = o.ov0 ?? ov * rnd(), e0 = ov * rnd();
  const sx = x1 - ux * s0 + jit(j), sy = y1 - uy * s0 + jit(j), ex = x2 + ux * e0 + jit(j), ey = y2 + uy * e0 + jit(j);
  const mx = (sx + ex) / 2 + nx * bow, my = (sy + ey) / 2 + ny * bow;
  return `M${f1(sx)} ${f1(sy)}Q${f1(mx)} ${f1(my)} ${f1(ex)} ${f1(ey)}`;
}
function rpoly(pts, close, o) { let d = ''; const n = pts.length; for (let i = 0; i < (close ? n : n - 1); i++) { const a = pts[i], b = pts[(i + 1) % n]; d += rl(a[0], a[1], b[0], b[1], o); } return d; }
const rrect = (x, y, w, h, o) => rpoly([[x, y], [x + w, y], [x + w, y + h], [x, y + h]], true, o);
function catmull(p) { let d = `M${f1(p[0][0])} ${f1(p[0][1])}`; for (let i = 0; i < p.length - 1; i++) { const p0 = p[i - 1] || p[i], p1 = p[i], p2 = p[i + 1], p3 = p[i + 2] || p2; d += `C${f1(p1[0] + (p2[0] - p0[0]) / 6)} ${f1(p1[1] + (p2[1] - p0[1]) / 6)} ${f1(p2[0] - (p3[0] - p1[0]) / 6)} ${f1(p2[1] - (p3[1] - p1[1]) / 6)} ${f1(p2[0])} ${f1(p2[1])}`; } return d; }
/* a loop drawn by hand: never quite closes, drifts a little */
function rell(cx, cy, rx, ry, o = {}) {
  const n = 22, a0 = rnd() * Math.PI * 2, turn = o.turn ?? 1.07, ph1 = rnd() * 6, ph2 = rnd() * 6, A = o.j ?? 0.03, pts = [];
  for (let i = 0; i <= n; i++) { const a = a0 + i / n * Math.PI * 2 * turn, k = 1 + A * Math.sin(2 * a + ph1) + A * 0.5 * Math.sin(3 * a + ph2) + 0.035 * (i / n); pts.push([cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k]); }
  return catmull(pts);
}
function rarrow(x1, y1, x2, y2, o = {}) {
  const hl = o.head ?? 22, a = Math.atan2(y2 - y1, x2 - x1), sp = 0.5;
  let d = rl(x1, y1, x2, y2, { ov: 0, ov0: 0, bow: o.bow ?? 0.008, j: 0.6 });
  for (const s of [-1, 1]) { const b = a + Math.PI + s * sp; d += rl(x2, y2, x2 + Math.cos(b) * hl, y2 + Math.sin(b) * hl, { ov: 0, ov0: 0, bow: 0.03, j: 0.5 }); }
  return d;
}
/* pencil shading inside a convex polygon */
function hachure(pts, gap = 14, ang = -45, o = {}) {
  const a = ang * D2R, ux = Math.cos(a), uy = Math.sin(a), nx = -uy, ny = ux;
  const pr = pts.map(p => p[0] * nx + p[1] * ny), lo = Math.min(...pr), hi = Math.max(...pr);
  let d = '';
  for (let c = lo + gap * 0.6; c < hi - gap * 0.3; c += gap) {
    const hits = [];
    for (let i = 0; i < pts.length; i++) { const A = pts[i], B = pts[(i + 1) % pts.length], dA = A[0] * nx + A[1] * ny - c, dB = B[0] * nx + B[1] * ny - c; if ((dA < 0) !== (dB < 0)) { const t = dA / (dA - dB); hits.push([A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t]); } }
    if (hits.length < 2) continue;
    hits.sort((p, q) => (p[0] * ux + p[1] * uy) - (q[0] * ux + q[1] * uy));
    const p = hits[0], q = hits[hits.length - 1], ins = o.inset ?? 3;
    d += rl(p[0] + ux * ins, p[1] + uy * ins, q[0] - ux * ins, q[1] - uy * ins, { ov: 0, ov0: 0, j: 0.7, bow: 0.02 });
  }
  return d;
}
function spring(x, y1, y2, w = 46, n = 7) {
  const lead = 12, seg = (y2 - y1 - 2 * lead) / (n * 2);
  let d = `M${x} ${f1(y1)}L${x} ${f1(y1 + lead)}`;
  for (let i = 0; i < n * 2; i++) d += `L${f1(x + (i % 2 ? -w / 2 : w / 2))} ${f1(y1 + lead + seg * (i + 0.5))}`;
  return d + `L${x} ${f1(y2 - lead)}L${x} ${f1(y2)}`;
}
function pathEl(g, d, w = 4.5, c = 'currentColor', extra = {}) { return E('path', { d, fill: 'none', stroke: c, 'stroke-width': w, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', ...extra }, g); }
/* an ink mob: one or more strokes in one colour */
function ink(d, color = P.ink, w = 4.5, o = {}) { const g = E('g'); (Array.isArray(d) ? d : [d]).forEach(dd => pathEl(g, dd, w, 'currentColor', o.dash ? { 'stroke-dasharray': o.dash } : {})); return new Mob(g, color); }

/* handwriting that writes itself on, left to right */
let CLIPN = 0;
function hand(str, size = 40, color = P.ink, o = {}) {
  const g = E('g'), id = 'wp' + (++CLIPN);
  const cp = E('clipPath', { id }, DEFS), r = E('rect', { x: 0, y: 0, width: 0, height: 0 }, cp);
  const inner = E('g', { 'clip-path': `url(#${id})` }, g);
  const t = E('text', { 'font-family': HAND, 'font-size': size * FS, 'font-weight': o.w || 400, fill: 'currentColor', 'text-anchor': o.anchor || 'middle', 'dominant-baseline': 'central', 'data-nd': '' }, inner);
  for (const [s, c] of (Array.isArray(str) ? str : [[str]])) { const ts = E('tspan', c ? { fill: c } : {}, t); ts.textContent = s; }
  const m = new Mob(g, color); m.wipe = { r, t }; m.textEl = t; return m;
}
/* highlighter swipe behind part of a hand mob (call after S.add so it can be measured) */
function hlBehind(S, m, sub, color = P.hlO, o = {}) {
  const t = m.textEl, s = t.textContent, i = s.indexOf(sub);
  const a = t.getExtentOfChar(i), b = t.getExtentOfChar(i + sub.length - 1);
  const pad = o.pad ?? 8, x0 = a.x - pad, x1 = b.x + b.width + pad, cy = a.y + a.height * (o.cy ?? 0.56), h = o.h ? o.h * FS : a.height * 0.5;
  const g = E('g'); pathEl(g, `M${f1(x0)} ${f1(cy + 2 + jit(1.5))}L${f1(x1)} ${f1(cy - 2 + jit(1.5))}`, h, 'currentColor', { 'stroke-linecap': 'butt', opacity: o.op ?? 0.8, style: 'mix-blend-mode:multiply' });
  const H = new Mob(g, color); S.add(H, m.init.x, m.init.y, { r: m.init.r, s: m.init.s }, m.g.parentNode); S.behind(H, m); return H;
}
/* free-standing highlighter bar (e.g. behind a formula) */
function hlBar(x0, x1, y, h, color = P.hlO) { const g = E('g'); pathEl(g, `M${f1(x0)} ${f1(y + 2 + jit(2))}L${f1(x1)} ${f1(y - 2 + jit(2))}`, h, 'currentColor', { 'stroke-linecap': 'butt', opacity: 0.8, style: 'mix-blend-mode:multiply' }); return new Mob(g, color); }
function tex(src, size = 60, color = P.ink) { return new Mob(texNode(src, size), color); }
function txtEl(g, x, y, s, size, color, w = 400, anchor = 'middle') { const t = E('text', { x, y, 'font-family': HAND, 'font-size': size * FS, 'font-weight': w, fill: color, 'text-anchor': anchor, 'dominant-baseline': 'central' }, g); t.textContent = s; return t; }

/* ---------- drawings ---------- */
/* side view of a small quad; origin = IMU chip at body centre; feet at y = 92 */
function droneG(o = {}) {
  const g = E('g');
  pathEl(g, rrect(-100, -26, 200, 52));
  pathEl(g, rl(-100, -12, -212, -44) + rl(100, -12, 212, -44));
  pathEl(g, rrect(-238, -64, 44, 22) + rrect(194, -64, 44, 22));
  pathEl(g, rell(-216, -74, 86, 7, { j: 0.01, turn: 1.02 }), 3.5);
  pathEl(g, rell(216, -74, 86, 7, { j: 0.01, turn: 1.02 }), 3.5);
  pathEl(g, rl(-56, 26, -88, 90) + rl(56, 26, 88, 90) + rl(-108, 92, -70, 92) + rl(70, 92, 108, 92));
  pathEl(g, rell(118, 2, 12, 12, { turn: 1.05 }), 4);
  E('rect', { x: -24, y: -17, width: 48, height: 34, rx: 3, fill: P.hlC, 'fill-opacity': 0.9, stroke: 'none' }, g);
  pathEl(g, rrect(-24, -17, 48, 34, { ov: 2 }), 3.5, P.blue);
  txtEl(g, 0, 1, 'IMU', 17, P.blue, 700);
  if (o.ground) { let d = rl(-330, 96, 330, 96); for (let x = -318; x <= 318; x += 30) d += rl(x, 99, x - 16, 117, { ov: 0, ov0: 0, j: 0.6 }); pathEl(g, d, 3.5, P.soft); }
  return g;
}
/* MEMS accelerometer cartoon: housing, two springs, proof mass (child mob that can sag) */
function mems(S, x, y, s, o = {}) {
  const g = E('g');
  pathEl(g, rrect(-150, -220, 300, 440), 5);
  pathEl(g, rl(-150, -200, 150, -200) + rl(-150, 200, 150, 200), 3);
  pathEl(g, hachure([[-150, -220], [150, -220], [150, -200], [-150, -200]], 13, -55, { inset: 1 }) + hachure([[-150, 200], [150, 200], [150, 220], [-150, 220]], 13, -55, { inset: 1 }), 2.5, P.soft);
  pathEl(g, 'M-144 0L-72 0M72 0L144 0', 2.5, P.soft, { 'stroke-dasharray': '8 8' });
  const top = pathEl(g, spring(0, -200, -60), 4), bot = pathEl(g, spring(0, 60, 200), 4);
  const M = S.add(new Mob(g, P.ink), x, y, { s, ...(o.init || {}) });
  const mg = E('g');
  E('rect', { x: -60, y: -60, width: 120, height: 120, fill: P.paper, stroke: 'none' }, mg);
  pathEl(mg, hachure([[-60, -60], [60, -60], [60, 60], [-60, 60]], 13, -45), 2.5, P.blue);
  pathEl(mg, rrect(-60, -60, 120, 120), 5);
  E('rect', { x: -22, y: -24, width: 44, height: 46, fill: P.paper, stroke: 'none' }, mg);
  txtEl(mg, 0, -2, 'm', 46, P.ink, 700);
  const mass = S.add(new Mob(mg, P.ink), 0, 0, {}, g);
  const gA = new Mob(E('g'), P.blue); pathEl(gA.g, rarrow(-102, -42, -102, 46, { head: 16 }), 4.5); txtEl(gA.g, -126, 2, 'g', 34, 'currentColor', 700); S.add(gA, 0, 0, {}, mg);
  const push = new Mob(E('g'), P.magenta); pathEl(push.g, rarrow(102, 46, 102, -46, { head: 16 }), 5); S.add(push, 0, 0, {}, mg);
  S.drive(() => { const yy = mass.L.y || 0; top.setAttribute('d', spring(0, -200, -60 + yy)); bot.setAttribute('d', spring(0, 60 + yy, 200)); });
  return { M, mass, gA, push };
}

/* ---------- more doodles for episode 00 ---------- */
function bottleG(h = 160, o = {}) { /* origin at the bottom centre */
  const g = E('g'), w = h * 0.42, n = h * 0.16, sh = h * 0.72;
  const pts = [[-w / 2, 0], [-w / 2, -sh], [-n / 2 - 2, -h * 0.84], [-n / 2, -h * 0.92], [n / 2, -h * 0.92], [n / 2 + 2, -h * 0.84], [w / 2, -sh], [w / 2, 0]];
  if (o.water !== false) pathEl(g, hachure([[-w / 2, -sh * 0.62], [w / 2, -sh * 0.62], [w / 2, 0], [-w / 2, 0]], Math.max(7, h * 0.07), -45, { inset: 2 }), Math.max(1.6, h * 0.014), P.blue);
  pathEl(g, rpoly(pts, true, { ov: 1.5 }), Math.max(2.5, h * 0.024));
  pathEl(g, rrect(-n / 2 - 2, -h, n + 4, h * 0.08, { ov: 1 }), Math.max(2.5, h * 0.022));
  return g;
}
function tableG(x0, x1, y, legH = 120) { return rl(x0, y, x1, y) + rl(x0 + 10, y + 12, x1 - 10, y + 12, { ov: 0 }) + rl(x0 + 30, y + 12, x0 + 30, y + legH) + rl(x1 - 30, y + 12, x1 - 30, y + legH); }
function miniFrame(w = 46, h = 34) { const g = E('g'); E('rect', { x: -w / 2, y: -h / 2, width: w, height: h, fill: P.paper, stroke: 'none', 'data-nd': '' }, g); pathEl(g, `M${-w / 2} ${-h / 2}h${w}v${h}h${-w}Z`, 3, 'currentColor', { 'data-nd': '' }); pathEl(g, `M${-w * 0.08} ${h * 0.36}v${-h * 0.42}l${w * 0.04} ${-h * 0.14}l${w * 0.04} ${h * 0.14}v${h * 0.42}Z`, 2, 'currentColor', { 'data-nd': '' }); return g; }
function laptopG(w = 260, h = 170) { const g = E('g'); pathEl(g, rrect(-w / 2, -h, w, h)); pathEl(g, rl(-w / 2, 0, -w / 2 - 30, 26) + rl(-w / 2 - 30, 26, w / 2 + 30, 26) + rl(w / 2 + 30, 26, w / 2, 0)); return g; }
function boardG(w = 190, h = 92) { const g = E('g'); pathEl(g, rrect(-w / 2, -h / 2, w, h), 4, P.green); pathEl(g, rrect(-w * 0.32, -h * 0.28, w * 0.26, h * 0.56, { ov: 1 }) + rrect(w * 0.02, -h * 0.22, w * 0.18, h * 0.3, { ov: 1 }) + rrect(w * 0.24, -h * 0.22, w * 0.14, h * 0.3, { ov: 1 }), 3, P.green); for (let i = 0; i < 9; i++) pathEl(g, rl(-w / 2 + 14 + i * (w - 28) / 8, h / 2 - 10, -w / 2 + 14 + i * (w - 28) / 8, h / 2 - 2, { ov: 0, j: 0.3 }), 2.5, P.green); return g; }
function remoteG() { const g = E('g'); pathEl(g, rrect(-70, -40, 140, 80)); pathEl(g, rell(-34, -2, 16, 16) + rell(34, -2, 16, 16), 3); pathEl(g, rl(-34, -2, -28, -14, { ov: 0 }) + rl(34, -2, 40, 8, { ov: 0 }), 3.5); pathEl(g, rl(48, -40, 64, -92, { ov: 0 }), 4); return g; }
function wavesG(x, y, dir = -1, n = 3, r0 = 26) { let d = ''; for (let i = 0; i < n; i++) { const r = r0 + i * 22, a0 = (dir < 0 ? 180 : 0) - 34, a1 = (dir < 0 ? 180 : 0) + 34; const p = [a0, a1].map(a => [x + Math.cos(a * D2R) * r, y + Math.sin(a * D2R) * r]); d += `M${f1(p[0][0])} ${f1(p[0][1])}A${r} ${r} 0 0 1 ${f1(p[1][0])} ${f1(p[1][1])}`; } return d; }
function bell(cx, sd, amp, x0, x1, base, k) { let d = ''; for (let x = x0; x <= x1; x += 1) { const y = base - amp * Math.exp(-0.5 * ((x - cx) / sd) ** 2); d += (d ? 'L' : 'M') + f1(k(x)) + ' ' + f1(y); } return d; }
/* margin zoom: a dashed sticky with a tag */
function zoomBox(S, x, y, w, h, tag) {
  const box = S.add(ink(rrect(x, y, w, h, { ov: 3 }), P.olive, 3, { dash: '12 9' }));
  const g = E('g'); pathEl(g, rell(0, 0, 13, 13, { turn: 1.05 }) + rl(9, 9, 20, 20, { ov: 0 }), 3); txtEl(g, 30, 0, tag, 26, 'currentColor', 700, 'start');
  const tg = S.add(new Mob(g, P.olive), x + 26, y + 30);
  return [box, tg];
}

/* ================= kit 4: camera, trackers, heat grids, printouts, code ================= */
const MONO = '"JetBrains Mono", ui-monospace, Menlo, Consolas, monospace';
const PW = 1920, PH = 1080, GUT = 200;
const pageO = (c, r) => [c * (PW + GUT), r * (PH + GUT)];
const pageC = (c, r) => [960 + c * (PW + GUT), 540 + r * (PH + GUT)];
const SPREAD = { x: (3 * PW + 2 * GUT) / 2, y: (3 * PH + 2 * GUT) / 2 };

/* the camera looks at (x, y) with zoom s; everything in `world` moves with it */
class Cam extends Mob {
  constructor(world) { super(E('g')); this.world = world; Object.assign(this.init, { x: 960, y: 540, s: 1, o: 1 }); this.v = this.init; }
  prep() {}
  apply(st) {
    this.v = st; const L = this.L; if (st.x === L.x && st.y === L.y && st.s === L.s) return;
    this.world.setAttribute('transform', `translate(960 540) scale(${st.s.toFixed(5)}) translate(${(-st.x).toFixed(2)} ${(-st.y).toFixed(2)})`);
    L.x = st.x; L.y = st.y; L.s = st.s;
  }
}
/* a bag of animatable numbers; drivers read .v */
class Trk extends Mob { constructor(init) { super(E('g')); Object.assign(this.init, init); this.v = { ...this.init }; } prep() {} apply(st) { this.v = st; } }

function camTo(S, cam, t, d, x, y, s = 1, dip = 0) {
  S.set(cam, t, d, { x, y }, smoothE);
  if (dip) { S.set(cam, t, d * 0.5, { s: dip }, smoothE); S.set(cam, t + d * 0.5, d * 0.5, { s }, smoothE); }
  else S.set(cam, t, d, { s }, smoothE);
}

/* monospace text that types on left to right (same wipe as handwriting) */
function mono(str, size = 22, color = P.ink, o = {}) {
  const g = E('g'), id = 'wp' + (++CLIPN);
  const cp = E('clipPath', { id }, DEFS), r = E('rect', { x: 0, y: 0, width: 0, height: 0 }, cp);
  const inner = E('g', { 'clip-path': `url(#${id})` }, g);
  const t = E('text', { 'font-family': MONO, 'font-size': size, 'font-weight': o.w || 400, fill: 'currentColor', 'text-anchor': o.anchor || 'start', 'dominant-baseline': 'central', 'data-nd': '', 'xml:space': 'preserve' }, inner);
  t.style.whiteSpace = 'pre';
  for (const [s, c, w] of (Array.isArray(str) ? str : [[str]])) { const ts = E('tspan', c ? { fill: c } : {}, t); if (w) ts.setAttribute('font-weight', w); ts.textContent = s; }
  const m = new Mob(g, color); m.wipe = { r, t }; m.textEl = t; return m;
}
/* highlight a substring of a mono/hand mob with a translucent bar (call after S.add) */
function hlSub(S, m, sub, color = P.hlO, o = {}) {
  const t = m.textEl, s = t.textContent, i = s.indexOf(sub); if (i < 0) throw new Error('hlSub: ' + sub);
  const a = t.getExtentOfChar(i), b = t.getExtentOfChar(i + sub.length - 1);
  const pad = o.pad ?? 5, x0 = a.x - pad, x1 = b.x + b.width + pad, cy = a.y + a.height * 0.52, h = o.h ?? a.height * 0.95;
  const g = E('g'); pathEl(g, `M${f1(x0)} ${f1(cy + 1.5)}L${f1(x1)} ${f1(cy - 1.5)}`, h, 'currentColor', { 'stroke-linecap': 'butt', opacity: o.op ?? 0.75, style: 'mix-blend-mode:multiply' });
  const H = new Mob(g, color); S.add(H, m.init.x, m.init.y, { s: m.init.s }, m.g.parentNode); S.behind(H, m); return H;
}

/* a taped printout: white sheet, soft shadow, two strips of tape */
function sheetG(w, h, o = {}) {
  const g = E('g');
  E('rect', { x: 6, y: 8, width: w, height: h, rx: 3, fill: '#000', 'fill-opacity': 0.07, stroke: 'none', 'data-nd': '' }, g);
  E('rect', { x: 0, y: 0, width: w, height: h, rx: 3, fill: o.fill || '#FFFFFC', stroke: '#CFCBB8', 'stroke-width': 1.5, 'data-nd': '' }, g);
  if (o.tape !== false) for (const [tx, rot] of [[w * 0.12, -4], [w * 0.86, 5]]) E('rect', { x: tx - 55, y: -16, width: 110, height: 32, fill: '#E8E1C2', 'fill-opacity': 0.82, stroke: 'none', transform: `rotate(${rot} ${tx} 0)`, 'data-nd': '' }, g);
  return g;
}

/* signed value -> colour: + magenta, - blue; |v| -> opacity */
const DIV = v => v >= 0 ? P.magenta : P.blue;
const greyOf = v => { const k = Math.round(lerp(232, 120, clamp((v + 1) / 2))), h = n => n.toString(16).padStart(2, '0'); return '#' + h(k) + h(k) + h(Math.round(k * 0.97)); };

/* heat grid: rows x cols cells; base(i,j) in [-1,1] (frozen grey) or null; overlay drawn by a driver.
   returns mob with .cell(i,j) -> {b, o} rect pair; origin = top-left */
function heatGrid(rows, cols, cs, o = {}) {
  const g = E('g'), gap = o.gap ?? Math.max(1, cs * 0.08), cells = [];
  for (let i = 0; i < rows; i++) for (let j = 0; j < cols; j++) {
    const x = j * cs + gap / 2, y = i * cs + gap / 2, w = cs - gap;
    const bv = o.base ? o.base(i, j) : null;
    const b = E('rect', { x, y, width: w, height: w, rx: Math.min(4, cs * 0.12), fill: bv === null ? 'none' : greyOf(bv), stroke: bv === null ? (o.empty || '#BFC6C8') : 'none', 'stroke-width': bv === null ? 1.5 : 0, 'stroke-dasharray': bv === null ? '4 4' : '', 'data-nd': '' }, g);
    const ov = E('rect', { x, y, width: w, height: w, rx: Math.min(4, cs * 0.12), fill: P.magenta, 'fill-opacity': 0, stroke: 'none', 'data-nd': '' }, g);
    cells.push({ i, j, b, ov, bv, lastO: -1, lastF: '', lastA: -1 });
  }
  if (o.frame !== false) pathEl(g, rrect(-2, -2, cols * cs + 4, rows * cs + 4, { ov: 2, j: 0.5 }), o.fw ?? 2.5, P.soft);
  const m = new Mob(g, P.ink); m.cells = cells; m.rows = rows; m.cols = cols; m.cs = cs;
  m.cell = (i, j) => cells[i * cols + j];
  /* set overlay: value v in [-1,1] (signed), alpha scale a, whole-cell opacity co */
  m.paint = (fn) => { for (const c of cells) { const [v, a, co] = fn(c.i, c.j, c); const fill = DIV(v), fa = clamp(Math.abs(v) * (a ?? 1), 0, 0.92); if (fill !== c.lastF) { c.ov.setAttribute('fill', fill); c.lastF = fill; } if (Math.abs(fa - c.lastA) > 0.004) { c.ov.setAttribute('fill-opacity', fa.toFixed(3)); c.lastA = fa; } const op = co ?? 1; if (Math.abs(op - c.lastO) > 0.004) { c.b.setAttribute('opacity', op.toFixed(3)); c.ov.setAttribute('opacity', op.toFixed(3)); c.lastO = op; } } };
  m.tint = (fn) => { for (const c of cells) { if (c.bv === null) continue; const col = fn(c.i, c.j, c); if (col !== c.lastT) { c.b.setAttribute('fill', col); c.lastT = col; } } };
  return m;
}

/* a vertical stack of layer slabs; .bars[i] (0 = bottom) */
function layerStack(n, w, h, gap) {
  const g = E('g'), bars = [];
  for (let i = 0; i < n; i++) { const y = -(i + 1) * (h + gap); bars.push(E('rect', { x: -w / 2, y, width: w, height: h, rx: 2, fill: '#C9CCC7', stroke: 'none', 'data-nd': '' }, g)); }
  const m = new Mob(g, P.ink); m.bars = bars; return m;
}

/* small token chip with mono text */
function chip(text, size = 22, fill = P.hlL) {
  const g = E('g'), w = text.length * size * 0.6 + 18, h = size + 18;
  E('rect', { x: -w / 2, y: -h / 2, width: w, height: h, rx: 7, fill, 'fill-opacity': 0.55, stroke: P.ink, 'stroke-width': 1.6, 'data-nd': '' }, g);
  const t = E('text', { x: 0, y: 1, 'font-family': MONO, 'font-size': size, fill: P.ink, 'text-anchor': 'middle', 'dominant-baseline': 'central', 'data-nd': '', 'xml:space': 'preserve' }, g); t.style.whiteSpace = 'pre'; t.textContent = text;
  const m = new Mob(g, P.ink); m.w = w; return m;
}
/* rounded stat chip with hand text */
function statChip(text, w, color = P.ink, fill = P.hlC) {
  const g = E('g');
  E('rect', { x: -w / 2, y: -34, width: w, height: 68, rx: 34, fill, 'fill-opacity': 0.45, stroke: 'none', 'data-nd': '' }, g);
  pathEl(g, rrect(-w / 2, -34, w, 68, { ov: 2, j: 0.6 }), 2.5, color);
  txtEl(g, 0, 0, text, 32, color, 700);
  return new Mob(g, color);
}
/* padlock doodle */
function lockG(s = 1) { const g = E('g'); pathEl(g, `M${-14 * s} ${-2 * s}V${-16 * s}A${14 * s} ${14 * s} 0 0 1 ${14 * s} ${-16 * s}V${-2 * s}`, 4); pathEl(g, rrect(-22 * s, -2 * s, 44 * s, 34 * s, { ov: 1 }), 4); E('circle', { cx: 0, cy: 13 * s, r: 4 * s, fill: 'currentColor' }, g); return g; }
/* a solid block (for real-size matrices) */
function blockG(w, h, fill, op = 0.35, o = {}) { const g = E('g'); E('rect', { x: 0, y: 0, width: w, height: h, fill, 'fill-opacity': op, stroke: 'none', 'data-nd': '' }, g); if (o.grid) pathEl(g, gridD(0, 0, w, h, o.grid[0], o.grid[1]), 1, P.soft, { opacity: 0.45 }); pathEl(g, rrect(0, 0, w, h, { ov: 1.5, j: 0.5 }), 3, o.stroke || P.ink); return g; }
function gridD(x, y, w, h, nx, ny) { let d = ''; for (let i = 0; i <= nx; i++) d += `M${f1(x + i * w / nx)} ${f1(y)}V${f1(y + h)}`; for (let j = 0; j <= ny; j++) d += `M${f1(x)} ${f1(y + j * h / ny)}H${f1(x + w)}`; return d; }
const checkD = (x, y, s = 14) => rl(x - s, y, x - s * 0.3, y + s * 0.7, { ov: 0 }) + rl(x - s * 0.3, y + s * 0.7, x + s, y - s * 0.9, { ov: 0 });
const crossD = (x, y, s = 12) => rl(x - s, y - s, x + s, y + s, { ov: 0 }) + rl(x + s, y - s, x - s, y + s, { ov: 0 });
function stampG(word, color) { const g = E('g'); pathEl(g, rrect(-92, -36, 184, 72, { ov: 3, j: 1 }) + rrect(-84, -29, 168, 58, { ov: 2, j: 0.8 }), 4, color); txtEl(g, 0, 1, word, 44, color, 700); return new Mob(g, color); }
