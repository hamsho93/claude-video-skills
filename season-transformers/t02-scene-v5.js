/* ================= Margin Notes · Transformers · T02 · Why three matrices? (version 4) =================
   Spread 4 x 3, a snake. Row 0: (0,0) opening -> (1,0) the raw pair and the raw table -> (2,0) the raw recipe, worked
   -> (3,0) where queries and keys come from. Row 1: (3,1) the score formula both ways -> (2,1) the score table
   -> (1,1) the keys test and the third matrix -> (0,1) the two hires and their nudges. Row 2: (0,2) one step, then a
   hundred thousand -> (1,2) many heads -> (2,2) end card; (3,2) further reading, seen in the zoom-out.
   Season rules 1-7: the step strip on every page; real size first; every calculation in full; names before use;
   every number shown coming from somewhere; guided numbers (one row of boxes changing in place, one example aloud,
   the rest together, the formula on top as the map, zeros grey, one working line at a time); the toy's columns are
   just 1, 2 and 3.
   Inks: magenta = queries and lookers, blue = keys and targets, olive = values, teal = blends, flame = raw scores
   and the raw-score failure, orange = the training nudges, green = titles and answers. Hatched = learned weights.
   Every number comes from ~/mn-season/toy.py (ledger T02) at three decimals, each line following from the one above.
   Every time comes from TM. */
const EPN = 'T02', EPT = 'Why three matrices?', NEXT = 'next · T03 · What happens after attention?', TAB = 'EPISODE ' + EPN;
const SERIES = 'Margin Notes · Transformers · ' + EPN;
const COLS = 4, ROWS = 3;
const SPREAD_C = { x: (COLS * PW + (COLS - 1) * GUT) / 2, y: (ROWS * PH + (ROWS - 1) * GUT) / 2 };
const ZOOM_OUT = 1 / Math.max(COLS * 1.17, ROWS * 1.24);
const C_Q = P.magenta, C_K = P.blue, C_V = P.olive, C_Z = '#0F8B8D', C_FAIL = P.flame, C_TR = '#C06A12';

function build(host) {
  const S = new Scene(host);
  const world = E('g', {}, S.root), fixed = E('g', {}, S.root);
  const [cx0, cy0] = pageC(0, 0);
  const cam = S.add(new Cam(world), cx0, cy0, { s: 1, o: 1 }, fixed);
  /* ---------- helpers ---------- */
  const a = n => { const v = TM.a[n]; if (v === undefined) throw new Error('anchor ' + n); return v; };
  const bt = id => { const v = TM.beats[id]; if (!v) throw new Error('beat ' + id); return v; };
  const W = (m, t, d) => S.create(m, t, d), F = (m, t, d = 0.5, sh) => S.fadeIn(m, t, d, sh), O = (ms, t, d = 0.4) => S.out([].concat(ms).filter(Boolean), t, d);
  const H = (s, z, c, o) => hand(s, z, c, o);
  const pg = (c, r) => { const [ox, oy] = pageO(c, r); const f = (m, x, y, o) => S.add(m, ox + x, oy + y, o, world); f.ox = ox; f.oy = oy; f.mv = (m, t, d, x, y, e) => S.move(m, t, d, ox + x, oy + y, e); return f; };
  const dim = (ms, t, o = 0.28, d = 0.35) => [].concat(ms).forEach(m => m && S.set(m, t, d, { o }));
  const trk = init => S.add(new Trk(init), 0, 0, { ...init }, fixed);
  const go = (c, r, t, d = 1.1, dip = 0, s = 1) => { const [x, y] = pageC(c, r); camTo(S, cam, t, d, x, y, s, dip); };
  const grp = (ms, name) => ms.forEach(m => { if (m) { m.grp = name; if (m.T) m.T.grp = name; } });
  const pulse = (m, t, k = 1.15) => { const s = m.cur.s; S.set(m, t, 0.25, { s: s * k }); S.set(m, t + 0.25, 0.35, { s }); };
  const label = (p, s, x, y, c = P.ink, z = 32, anchor = 'middle', w = 700) => p(H(s, z, c, { anchor, w }), x, y);
  const txt = (p, s, x, y, z = 30, c = P.ink, anchor = 'middle') => label(p, s, x, y, c, z, anchor, 400);
  const arrowM = (p, x1, y1, x2, y2, c = P.ink, w = 4, o = {}) => p(ink(rarrow(x1, y1, x2, y2, { head: o.head ?? 16, bow: o.bow }), c, w, o.dash ? { dash: o.dash } : {}), 0, 0);
  const gm = (p, g, col = P.ink, x = 0, y = 0, o) => p(new Mob(g, col), x, y, o);
  const T = (p, src, x, y, z = 40, col = P.ink) => p(tex(src, z, col), x, y);
  const take = (p, lines, x, y, w, t) => { const m = gm(p, takeG(lines, w, 36), P.ink, x, y); F(m, t, 0.6, { dy: 14 }); return m; };
  const pageTitle = (p, text, t) => {
    const tag = p(H(SERIES + ' · ' + EPT, 24, P.olive, { anchor: 'start', w: 700 }), 150, 60);
    const ti = p(H(text, 46, P.green, { anchor: 'start', w: 700 }), 148, 110);
    const un = p(ink(rl(146, 142, 158 + ti.textEl.getComputedTextLength(), 140, { bow: 0.003 }), P.green, 4), 0, 0);
    W(tag, t, 0.4); W(ti, t + 0.1, 0.9); W(un, t + 0.9, 0.35);
    grp([tag, ti, un], 'title' + t);
    return [tag, ti, un];
  };
  /* the six training steps as a strip at the top right; lit = index or list, green (forward) or orange (training only) */
  const STEPS = ['initialize', 'forward', 'loss', 'backward', 'update', 'repeat'], SX = i => 1010 + i * 120, SY = 122;
  const stepStrip = (p, lit, t, hlCol = P.hlL) => {
    const L = [].concat(lit), g = E('g'), onCol = hlCol === P.hlL ? P.green : C_TR;
    STEPS.forEach((s, i) => { const on = L.includes(i); txtEl(g, SX(i), SY, s, 22, on ? onCol : P.soft, on ? 700 : 400); if (i < 5) txtEl(g, SX(i) + 60, SY, '›', 22, P.soft); });
    const m = gm(p, g, P.ink, 0, 0); F(m, t, 0.5);
    const hls = L.map(i => { const hl = p(hlBar(-56, 56, 0, 26, hlCol), SX(i), SY + 2); S.behind(hl, m); F(hl, t + 0.2, 0.4); return hl; });
    grp([m, ...hls], 'steps' + t);
    return { m, hls };
  };
  const hatchG = (w, h, name, col = P.ink, z = 30) => {
    const g = E('g');
    E('rect', { x: 0, y: 0, width: w, height: h, rx: 6, fill: '#FFFFFC', stroke: 'none', 'data-nd': '' }, g);
    pathEl(g, hachure([[0, 0], [w, 0], [w, h], [0, h]], 16, -45, { inset: 2 }), 2, P.soft, { opacity: 0.6 });
    pathEl(g, rrect(0, 0, w, h, { ov: 1.5, j: 0.5 }), 3.5, col);
    if (name) { E('rect', { x: w / 2 - name.length * 9 - 8, y: h / 2 - 20, width: name.length * 18 + 16, height: 40, rx: 6, fill: '#FFFFFC', stroke: 'none', 'data-nd': '' }, g); txtEl(g, w / 2, h / 2, name, z, col, 700); }
    return g;
  };
  const rowG = (w, h, col = P.ink) => { const g = E('g'); E('rect', { x: -w / 2, y: -h / 2, width: w, height: h, rx: 8, fill: '#FFFFFC', 'fill-opacity': 0.7, stroke: 'none', 'data-nd': '' }, g); pathEl(g, rrect(-w / 2, -h / 2, w, h, { ov: 1.5, j: 0.6 }), 3, col); pathEl(g, rl(-w / 6, -h / 2 + 6, -w / 6, h / 2 - 6, { ov: 0 }) + rl(w / 6, -h / 2 + 6, w / 6, h / 2 - 6, { ov: 0 }), 2, col, { opacity: 0.45 }); return g; };
  const barsG = (vals, w, col = P.ink) => {
    const g = E('g'), seg = w / 3, L = seg - 18;
    vals.forEach((v, i) => { const x0 = -w / 2 + i * seg + 9; E('rect', { x: x0, y: -11, width: Math.max(3, v * L), height: 22, rx: 4, fill: col, 'fill-opacity': 0.4, stroke: col, 'stroke-width': 2, 'data-nd': '' }, g); });
    return g;
  };
  const matG = (rows, cols, cw, ch, col = P.ink, hatch = false) => {
    const g = E('g'), w = cols * cw, h = rows * ch;
    E('rect', { x: 0, y: 0, width: w, height: h, fill: '#FFFFFC', 'fill-opacity': 0.85, stroke: 'none', 'data-nd': '' }, g);
    if (hatch) pathEl(g, hachure([[0, 0], [w, 0], [w, h], [0, h]], 18, -45, { inset: 2 }), 1.6, P.soft, { opacity: 0.22 });
    pathEl(g, gridD(0, 0, w, h, cols, rows), 1.2, P.soft, { opacity: 0.4 });
    pathEl(g, `M14 -5H-5V${f1(h + 5)}H14M${f1(w - 14)} -5H${f1(w + 5)}V${f1(h + 5)}H${f1(w - 14)}`, 3.5, col);
    return g;
  };
  /* a matrix whose cells are separate mobs, so single numbers can be lit, greyed, copied and moved */
  const matrix = (p, x, y, rows, cw, ch, o = {}) => {
    const n = rows.length, cols = rows[0].length;
    const frame = gm(p, matG(n, cols, cw, ch, o.col || P.ink, o.hatch), P.ink, x, y);
    const cells = rows.map((r, i) => r.map((v, j) => label(p, String(v), x + cw * (j + 0.5), y + ch * (i + 0.5), o.ccol ? o.ccol(i, j, v) : (o.vcol || P.ink), o.z || 30, 'middle', o.w || 400)));
    const rlab = (o.rlab || []).map((s, i) => o.rlabRight ? label(p, s, x + cols * cw + 16, y + ch * (i + 0.5), o.lcol || P.ink, o.lz || 28, 'start', 400) : label(p, s, x - 16, y + ch * (i + 0.5), o.lcol || P.ink, o.lz || 28, 'end', 400));
    const heads = (o.heads || []).map((s, j) => label(p, s, x + cw * (j + 0.5), y - 24, o.hcol || P.soft, o.hz || 22, 'middle', 400));
    return { frame, cells, rlab, heads, cw, ch, x, y, w: cw * cols, h: ch * n, cx: j => x + cw * (j + 0.5), cy: i => y + ch * (i + 0.5) };
  };
  const showM = (M, t, gap = 0.12, name = 'm' + t, cellsToo = true) => {
    W(M.frame, t, 0.5); M.rlab.forEach((m, i) => W(m, t + 0.1 + i * gap, 0.3)); M.heads.forEach((m, j) => W(m, t + 0.15 + j * gap, 0.3));
    if (cellsToo) M.cells.forEach((r, i) => r.forEach(m => F(m, t + 0.25 + i * gap, 0.3)));
    grp([M.frame, ...M.rlab, ...M.heads], name + 'f'); grp(M.cells.flat(), name + 'v');
  };
  const allM = M => [M.frame, ...M.cells.flat(), ...M.rlab, ...M.heads];
  const rowHl = (p, M, i, col = P.hlL) => { const m = p(hlBar(M.x + 8, M.x + M.w - 8, M.cy(i), M.ch - 18, col), 0, 0); S.behind(m, M.cells[0][0]); return m; };
  const colHl = (p, M, j, col = P.hlC) => { const g = E('g'); E('rect', { x: M.cx(j) - M.cw / 2 + 8, y: M.y + 6, width: M.cw - 16, height: M.h - 12, rx: 6, fill: 'currentColor', 'fill-opacity': 0.55, stroke: 'none', 'data-nd': '' }, g); const m = gm(p, g, col, 0, 0); S.behind(m, M.cells[0][0]); return m; };
  const cellHl = (p, M, i, j, col = P.hlO) => { const m = p(hlBar(M.cx(j) - M.cw / 2 + 8, M.cx(j) + M.cw / 2 - 8, M.cy(i), M.ch - 18, col), 0, 0); S.behind(m, M.cells[0][0]); return m; };
  const cellRing = (p, M, i, j, col = P.green) => p(ink(rell(M.cx(j), M.cy(i), M.cw / 2 - 2, M.ch / 2 - 1, { turn: 1.06 }), col, 3.5), 0, 0);
  /* a working line: parts laid out left to right and centred on cx; each part is hand text or tex ({tex:'..'}) */
  const wline = (p, parts, cx, y, z = 32) => {
    const ms = parts.map(pt => pt.tex ? T(p, pt.tex, 0, y, z + 2, pt.col || P.ink) : p(H(pt.s, z, pt.col || P.ink, { anchor: 'start', w: pt.w || 400 }), 0, y));
    const ws = ms.map((m, i) => parts[i].tex ? m.g._w : m.textEl.getComputedTextLength());
    const sp = z * 0.3, total = ws.reduce((s, v) => s + v, 0) + sp * (ms.length - 1);
    let x = cx - total / 2;
    ms.forEach((m, i) => { const X = p.ox + x + (parts[i].tex ? ws[i] / 2 : 0); m.init.x = X; m.cur.x = X; m.wid = ws[i]; m.isTex = !!parts[i].tex; m.mid = x + ws[i] / 2; m.lx = x; x += ws[i] + sp; });
    return ms;
  };
  /* a working-line part that flies in: it starts centred on (fx, fy) (page coords), is seen there, then slides into its slot */
  const flyIn = (p, m, fx, fy, t, d = 0.9) => {
    const sx = m.init.x, sy = m.init.y;
    m.init.x = p.ox + fx - (m.isTex ? 0 : m.wid / 2); m.init.y = p.oy + fy; m.cur.x = m.init.x; m.cur.y = m.init.y;
    S.set(m, t, 0, { draw: 1 }); S.set(m, t, 0.25, { o: 1 }); S.set(m, t + 0.3, d, { x: sx, y: sy });
  };
  /* a centred mob that flies in from (fx, fy) (page coords) to where it was placed */
  const flyC = (p, m, fx, fy, t, d = 0.8) => { const sx = m.init.x, sy = m.init.y; m.init.x = p.ox + fx; m.init.y = p.oy + fy; m.cur.x = m.init.x; m.cur.y = m.init.y; S.set(m, t, 0, { draw: 1 }); S.set(m, t, 0.2, { o: 1 }); S.set(m, t + 0.15, d, { x: sx, y: sy }); };
  const writeParts = (ms, t, gap = 0.24, d = 0.42) => ms.forEach((m, i) => W(m, t + i * gap, d));
  /* a working line's result drops into a slot (page coords, centre) and is replaced there by a fresh label */
  const dropTo = (p, m, x, y, t) => { p.mv(m, t, 0.7, x - (m.isTex ? 0 : m.wid / 2), y); O(m, t + 0.65, 0.15); };
  const sentence = (p, words, cx, y, z, col = P.ink) => {
    const out = []; let x = 0; const sp = z * 0.34;
    words.forEach(wd => { const m = p(H(wd, z, col, { anchor: 'start' }), 0, y); const w = m.textEl.getComputedTextLength(); out.push({ m, x0: x, w }); x += w + sp; });
    const total = x - sp, x0 = cx - total / 2;
    out.forEach(o => { const X = p.ox + x0 + o.x0; o.m.init.x = X; o.m.cur.x = X; o.x0 = x0 + o.x0; o.cx = o.x0 + o.w / 2; });
    return out;
  };
  const arc = (x1, y1, x2, y2, lift) => `M${f1(x1)} ${f1(y1)}Q${f1((x1 + x2) / 2)} ${f1(Math.min(y1, y2) - lift)} ${f1(x2)} ${f1(y2)}`;
  const loop = (x, y, r = 46) => `M${f1(x - 18)} ${f1(y)}C${f1(x - r - 10)} ${f1(y - r * 2.2)} ${f1(x + r + 10)} ${f1(y - r * 2.2)} ${f1(x + 18)} ${f1(y)}`;
  const headArrow = (x, y, ang, s = 16) => { const a1 = ang + 2.6, a2 = ang - 2.6; return `M${f1(x + s * Math.cos(a1))} ${f1(y + s * Math.sin(a1))}L${f1(x)} ${f1(y)}L${f1(x + s * Math.cos(a2))} ${f1(y + s * Math.sin(a2))}`; };
  const arcArrow = (x1, y1, x2, y2, lift) => {
    const cx = (x1 + x2) / 2, cy = lift > 0 ? Math.min(y1, y2) - lift : Math.max(y1, y2) - lift;
    const ang = Math.atan2(y2 - cy, x2 - cx);
    return `M${f1(x1)} ${f1(y1)}Q${f1(cx)} ${f1(cy)} ${f1(x2)} ${f1(y2)}` + headArrow(x2, y2, ang, 18);
  };
  /* a curly brace under x1..x2, its point at the bottom */
  const braceD = (x1, x2, y, h = 12) => { const m = (x1 + x2) / 2; return `M${f1(x1)} ${f1(y)}Q${f1(x1)} ${f1(y + h)} ${f1(x1 + h)} ${f1(y + h)}L${f1(m - h)} ${f1(y + h)}Q${f1(m)} ${f1(y + h)} ${f1(m)} ${f1(y + 2 * h)}Q${f1(m)} ${f1(y + h)} ${f1(m + h)} ${f1(y + h)}L${f1(x2 - h)} ${f1(y + h)}Q${f1(x2)} ${f1(y + h)} ${f1(x2)} ${f1(y)}`; };
  const noteG = (t_, col = C_Q, w = 96, h = 76, rot = -6) => { const g = E('g', { transform: `rotate(${rot})` }); E('rect', { x: -w / 2, y: -h / 2, width: w, height: h, fill: col, 'fill-opacity': 0.22, stroke: 'none', 'data-nd': '' }, g); pathEl(g, rrect(-w / 2, -h / 2, w, h, { ov: 1 }), 2.5, col); if (t_) txtEl(g, 0, 2, t_, 28, col, 700); return g; };
  const tagG = (t_, col = C_K, w = 140) => { const g = E('g'); E('rect', { x: -w / 2, y: -26, width: w, height: 52, rx: 8, fill: col, 'fill-opacity': 0.2, stroke: 'none', 'data-nd': '' }, g); pathEl(g, rrect(-w / 2, -26, w, 52, { ov: 1 }), 3, col); if (t_) txtEl(g, 0, 0, t_, 28, col, 700); return g; };
  const folderG = () => { const g = E('g'); E('rect', { x: -60, y: -40, width: 120, height: 84, rx: 6, fill: '#FFFFFC', stroke: 'none', 'data-nd': '' }, g); pathEl(g, rpoly([[-60, -40], [-20, -40], [-12, -52], [60, -52], [60, 44], [-60, 44]], true, { ov: 1 }), 3.5); return g; };
  const personG = () => { const g = E('g'); pathEl(g, rell(0, -120, 30, 30, { turn: 1.05 }) + rl(0, -88, 0, 10, { ov: 0 }) + rl(0, 10, -30, 100, { ov: 0 }) + rl(0, 10, 30, 100, { ov: 0 }) + rl(0, -60, -52, -10, { ov: 0 }) + rl(0, -60, 64, -118, { ov: 0 }), 4.5); return g; };
  const scribble = (x, y, w, h, n = 28, seed = 1) => { let d = ''; for (let i = 0; i < n; i++) { const u = ((i * 37 + seed * 11) % 97) / 97, v = ((i * 53 + seed * 7) % 89) / 89, ang = (((i * 13 + seed) % 11) - 5) * 0.3; const cx = x + 12 + u * (w - 24), cy = y + 12 + v * (h - 24); d += `M${f1(cx - 8 * Math.cos(ang))} ${f1(cy - 8 * Math.sin(ang))}L${f1(cx + 8 * Math.cos(ang))} ${f1(cy + 8 * Math.sin(ang))}`; } return d; };
  const boxG = (w, h) => { const g = E('g'); E('rect', { x: -w / 2, y: -h / 2, width: w, height: h, rx: 10, fill: '#FFFFFC', stroke: 'none', 'data-nd': '' }, g); pathEl(g, rrect(-w / 2, -h / 2, w, h, { ov: 1.2, j: 0.5 }), 3); return g; };
  const chipG = (w = 150, h = 90) => { const g = E('g'); E('rect', { x: -w / 2, y: -h / 2, width: w, height: h, rx: h / 2, fill: P.hlL, 'fill-opacity': 0.3, stroke: 'none', 'data-nd': '' }, g); pathEl(g, rrect(-w / 2, -h / 2, w, h, { ov: 1 }), 3, P.green); return g; };
  const shadeG = (w, h, op, col = C_Q) => { const g = E('g'); E('rect', { x: -w / 2 + 4, y: -h / 2 + 4, width: w - 8, height: h - 8, rx: 5, fill: col, 'fill-opacity': op, stroke: 'none', 'data-nd': '' }, g); return g; };
  const WN = ['the', 'river', 'bank'];
  const XV = [['0.1', '0.1', '0'], ['0', '0.9', '0.1'], ['0.1', '0.1', '0.9']];
  const xcol = (i, j, v) => v === '0' ? P.soft : P.ink;
  const mcol = (i, j, v) => v === '0' ? P.soft : P.ink;
  const zc = P.soft;
  const DX = PW + GUT, DY = PH + GUT;

  /* ---------- paper ---------- */
  const pat = E('pattern', { id: 'gp40', width: 40, height: 40, patternUnits: 'userSpaceOnUse' }, DEFS);
  E('path', { d: 'M40 0H0V40', fill: 'none', stroke: '#D9E3E6', 'stroke-width': 1.2 }, pat);
  const pat2 = E('pattern', { id: 'gp200', width: 200, height: 200, patternUnits: 'userSpaceOnUse' }, DEFS);
  E('path', { d: 'M200 0H0V200', fill: 'none', stroke: '#D3DEE2', 'stroke-width': 2.2 }, pat2);
  E('rect', { x: -4000, y: -4000, width: 24000, height: 14000, fill: '#E3DFCB' }, world);
  for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
    const [ox, oy] = pageO(c, r);
    E('rect', { x: ox + 8, y: oy + 10, width: PW, height: PH, fill: '#000', 'fill-opacity': 0.06 }, world);
    E('rect', { x: ox, y: oy, width: PW, height: PH, fill: P.paper }, world);
    E('rect', { x: ox, y: oy, width: PW, height: PH, fill: 'url(#gp40)' }, world);
    E('rect', { x: ox, y: oy, width: PW, height: PH, fill: 'url(#gp200)' }, world);
  }
  const tg = E('g'); E('rect', { x: -96, y: -30, width: 192, height: 60, fill: P.hlC, 'fill-opacity': 0.55, stroke: 'none' }, tg); pathEl(tg, rrect(-96, -30, 192, 60), 3, P.ink); txtEl(tg, 0, -1, TAB, 28, P.ink, 700);
  const tab = S.add(new Mob(tg, P.ink), 1750, 74, { r: 3 }, fixed); F(tab, 0.2, 0.4);

  /* ================= page (0,0) · opening ================= */
  const pA = pg(0, 0);
  const offP = gm(pA, personG(), P.ink, 360, 560);
  const offN = gm(pA, noteG('', C_Q), C_Q, 456, 408);
  const offL = label(pA, 'bank', 360, 700, P.ink, 38, 'middle', 400);
  const FXo = [820, 1100, 1380];
  const offF = FXo.map((x, i) => gm(pA, (() => { const g = folderG(); E('rect', { x: -54, y: -64, width: 56, height: 22, rx: 4, fill: C_K, 'fill-opacity': 0.35, stroke: 'none', 'data-nd': '' }, g); txtEl(g, 0, 78, WN[i], 30, C_K, 700); return g; })(), P.ink, x, 600));
  const tO1 = bt('c0_1').t;
  W(offP, tO1 - 0.2, 0.7); F(offN, tO1 + 0.3, 0.4, { dy: -8 }); W(offL, tO1 + 0.2, 0.4);
  offF.forEach((m, i) => F(m, a('note') - 0.4 + i * 0.15, 0.4, { dy: 8 }));
  grp([offP, offN, offL], 'offPerson'); grp(offF, 'offFolders');
  const noteTag = label(pA, 'note = query: what I’m looking for', 520, 330, C_Q, 28, 'start', 700);
  const labTag = label(pA, 'label = key: how to find me', 1100, 760, C_K, 28, 'middle', 700);
  const dO1 = bt('c0_1').end - tO1;
  W(noteTag, a('note') + 0.6, 0.8); W(labTag, tO1 + 0.55 * dO1, 0.8);
  const contG = E('g'); E('rect', { x: -30, y: -22, width: 60, height: 44, rx: 4, fill: C_V, 'fill-opacity': 0.3, stroke: 'none', 'data-nd': '' }, contG); pathEl(contG, rrect(-30, -22, 60, 44, { ov: 1 }), 2.5, C_V); pathEl(contG, rl(-18, -8, 18, -8, { ov: 0 }) + rl(-18, 4, 12, 4, { ov: 0 }), 2, C_V);
  const contM = gm(pA, contG, C_V, 1100, 590);
  const valTag = label(pA, 'contents = value: what gets handed over', 1100, 806, C_V, 28, 'middle', 700);
  F(contM, tO1 + 0.72 * dO1, 0.3); pA.mv(contM, tO1 + 0.72 * dO1 + 0.2, 0.9, 1100, 470); W(valTag, tO1 + 0.8 * dO1, 0.8);
  grp([contM], 'contents');
  const noteArrow = arrowM(pA, 520, 410, 1050, 520, C_Q, 3.5, { bow: -0.12 });
  W(noteArrow, a('note') + 0.2, 0.7);
  const bq0 = gm(pA, hatchG(170, 64, 'Wq', C_Q, 28), P.ink, 520, 190), bk0 = gm(pA, hatchG(170, 64, 'Wk', C_K, 28), P.ink, 875, 190), bv0 = gm(pA, hatchG(170, 64, 'Wv', C_V, 28), P.ink, 1230, 190);
  const tO2 = a('matrix');
  W(bq0, tO2 + 0.1, 0.6); W(bk0, tO2 + 0.7, 0.6); W(bv0, tO2 + 1.3, 0.6);
  grp([bq0, bk0, bv0], 'wqwk0');
  const why = label(pA, 'Why three matrices?', 960, 900, P.green, 52, 'middle', 400);
  W(why, a('directly') - 1.0, 1.4);
  /* the asymmetry in our own phrase */
  const tO4 = bt('c0_4').t;
  O([offP, offN, offL, ...offF, noteArrow, bq0, bk0, bv0, noteTag, labTag, valTag, contM], tO4 - 0.2, 0.4);
  S.move(why, tO4 - 0.2, 0.6, pA.ox + 960, pA.oy + 250);
  S.set(why, tO4 - 0.2, 0.6, { s: 0.8 });
  const RB = sentence(pA, ['the', 'river', 'bank'], 960, 600, 90);
  RB.forEach((o, i) => W(o.m, tO4 + 0.1 + i * 0.2, 0.5));
  grp(RB.map(o => o.m), 'riverbank');
  const rv = RB[1], bk = RB[2];
  const thick = pA(ink(arcArrow(bk.cx - 10, 545, rv.cx + 10, 545, 120), C_Q, 9), 0, 0);
  W(thick, a('far') - 0.2, 0.8);
  const thin = pA(ink(arcArrow(rv.cx + 10, 625, bk.cx - 10, 625, -90), C_Q, 2.5), 0, 0);
  W(thin, a('way') - 0.3, 0.7);
  /* the pronoun case, with its sentence */
  const PS = sentence(pA, ['The', 'animal', "didn't", 'cross', 'the', 'street', 'because', 'it', 'was', 'too', 'tired.'], 1340, 920, 28);
  const psX0 = PS[0].x0 - 26, psX1 = PS[10].x0 + PS[10].w + 26;
  const pBox = pA(ink(rrect(psX0, 836, psX1 - psX0, 146, { ov: 1 }), P.soft, 2.5), 0, 0);
  const itW = PS[7], anW = PS[1];
  const pThick = pA(ink(arcArrow(itW.cx, 896, anW.cx + 6, 896, 44), C_Q, 6), 0, 0);
  const pThin = pA(ink(arcArrow(anW.cx + 6, 946, itW.cx, 946, -20), C_Q, 2), 0, 0);
  const tO6 = bt('c0_6').t, tOpp = a('opposite');
  W(pBox, tO6 + 0.4, 0.6); PS.forEach((o, i) => W(o.m, tO6 + 0.6 + i * 0.12, 0.35));
  W(pThick, tOpp - 1.2, 0.6); W(pThin, tOpp - 0.2, 0.5);
  grp([pBox, ...PS.map(o => o.m)], 'pronoun'); grp([pThick, pThin], 'pronounArrows');
  /* both directions, said separately */
  const tO7 = a('both');
  O([why], tO7 - 0.8, 0.3);
  dim(RB.map(o => o.m), tO7 - 0.3, 0.3);
  S.move(thick, tO7 - 0.3, 0.8, pA.ox - 300, pA.oy - 200);
  S.move(thin, tO7 - 0.3, 0.8, pA.ox + 300, pA.oy - 330);
  grp([thick, thin], 'bothArrows');
  const neq = pA(tex('\\neq', 110, P.green), 960, 330);
  W(neq, tO7 + 0.4, 0.5);
  /* where we are: forward in chapters 1, 2 and 4; backward and update in chapter 3 */
  const tA8 = bt('c0_8').t;
  O([...RB.map(o => o.m), thick, thin, neq, pBox, ...PS.map(o => o.m), pThick, pThin], tA8 - 0.1, 0.4);
  const bigG = E('g'); STEPS.forEach((s, i) => { txtEl(bigG, i * 230, 0, s, 40, P.ink, 400); if (i < 5) txtEl(bigG, i * 230 + 115, 0, '›', 40, P.soft); });
  const bigSteps = gm(pA, bigG, P.ink, 390, 540);
  F(bigSteps, tA8 + 0.3, 0.6);
  const hF = pA(hlBar(560, 680, 540, 44, P.hlL), 0, 0); S.behind(hF, bigSteps);
  const hB = pA(hlBar(1012, 1378, 540, 44, P.hlO), 0, 0); S.behind(hB, bigSteps);
  const lF = label(pA, 'chapters 1, 2 and 4', 620, 610, P.green, 30);
  const lB = label(pA, 'chapter 3 · training only', 1195, 610, C_TR, 30);
  const tPs = a('pass');
  F(hF, tPs - 0.4, 0.4); W(lF, tPs, 0.7);
  F(hB, tPs + 1.6, 0.4); W(lB, tPs + 2.0, 0.8);
  grp([hF, lF], 'fwdLane'); grp([hB, lB], 'bwdLane');
  /* title card; the strip shrinks to the top */
  const tA9 = bt('c0_9').t;
  O([hF, hB, lF, lB], tA9 - 0.2, 0.3);
  pA.mv(bigSteps, tA9, 1.0, SX(0), SY); S.set(bigSteps, tA9, 1.0, { s: 120 / 230 });
  stepStrip(pA, 1, tA9 + 0.9); O(bigSteps, tA9 + 1.1, 0.3);
  const tiTag = label(pA, SERIES, 960, 330, P.olive, 38);
  const tiT = pA(H(EPT, 104, P.green, { w: 400 }), 960, 470);
  const tiU = pA(ink(rl(560, 535, 1360, 531, { bow: 0.004 }), P.green, 5), 0, 0);
  const tiQ = gm(pA, hatchG(150, 56, 'Wq', C_Q, 26), P.ink, 640, 640), tiK = gm(pA, hatchG(150, 56, 'Wk', C_K, 26), P.ink, 885, 640), tiV = gm(pA, hatchG(150, 56, 'Wv', C_V, 26), P.ink, 1130, 640);
  W(tiTag, tA9 + 0.5, 0.5); W(tiT, tA9 + 0.7, 1.2); W(tiU, tA9 + 1.8, 0.4);
  const tOv = a('over');
  [tiQ, tiK, tiV].forEach((m, i) => W(m, tA9 + 1.9 + i * 0.25, 0.5));
  const ch1Br = pA(ink(braceD(644, 1031, 706, 10), P.green, 3), 0, 0), ch2Br = pA(ink(braceD(1134, 1276, 706, 10), C_V, 3), 0, 0);
  const ch1L = label(pA, 'chapter 1: a one-way match', 838, 758, P.green, 24, 'middle', 700), ch2L = label(pA, 'chapter 2: what gets handed over', 1205, 790, C_V, 24, 'middle', 700);
  W(ch1Br, Math.max(tA9 + 2.8, tOv - 3.0), 0.4); W(ch1L, Math.max(tA9 + 3.0, tOv - 2.8), 0.6); W(ch2Br, Math.max(tA9 + 3.8, tOv - 1.2), 0.4); W(ch2L, Math.max(tA9 + 4.0, tOv - 1.0), 0.6);
  grp([tiTag, tiT, tiU], 'titleCard'); grp([tiQ, tiK, tiV], 'titleMats'); grp([ch1Br, ch1L], 'ch1L'); grp([ch2Br, ch2L], 'ch2L');

  /* ================= page (1,0) · chapter 1 · the raw pair both ways, and the raw table (1.1-1.10) ================= */
  const pB = pg(1, 0), tB1 = bt('c1_01').t;
  go(1, 0, tB1 - 1.0, 1.1);
  pageTitle(pB, '1 · Direction matters', tB1 - 0.3);
  stepStrip(pB, 1, tB1 + 1.6);
  /* X returns with T01's column names still on top */
  const XM = matrix(pB, 250, 300, XV, 100, 56, { rlab: WN, z: 30, lz: 28, heads: ['money', 'water', 'unsure'], ccol: xcol });
  showM(XM, tB1 + 1.2, 0.1, 'xm');
  const xLab = label(pB, 'X: the embeddings, from T01', 400, 512, P.ink, 28, 'middle', 400);
  W(xLab, a('vectors') - 0.6, 0.7);
  /* 1.2-1.3 · the names were a reading aid; the columns become 1, 2, 3 */
  const tB2 = bt('c1_02').t, tSp = a('spread'), tC3 = a('c123');
  XM.heads.forEach((m, j) => pulse(m, tB2 + 3.2 + j * 0.55, 1.2));
  const numHeads = ['1', '2', '3'].map((s, j) => label(pB, s, XM.cx(j), XM.y - 24, P.ink, 28, 'middle', 700));
  O(XM.heads, tSp + 0.2, 0.5);
  numHeads.forEach((m, j) => W(m, tC3 - 1.3 + j * 0.45, 0.35)); grp(numHeads, 'numHeads');
  XM.heads = numHeads;
  /* 1.4 · the toy stands for a model partway through training; at the very first step, random */
  const tTr = a('train'), tNz = a('noise');
  const trainTag = label(pB, 'toy values: a model partway through training', 400, 556, P.olive, 22, 'middle', 400);
  W(trainTag, tTr - 0.6, 1.2);
  const RV = [['0.37', '-0.82', '0.15'], ['-0.04', '0.61', '-0.53'], ['0.91', '-0.27', '0.08']];
  const RM = matrix(pB, 700, 330, RV, 76, 40, { z: 22, col: P.soft, ccol: () => P.soft });
  const RMl = txt(pB, 'at the very first step: random', 814, 304, 22, P.soft);
  showM(RM, tNz - 0.5, 0.06, 'rm'); W(RMl, tNz - 0.3, 0.6);
  O([...allM(RM), RMl], bt('c1_04').end + 0.3, 0.4);
  /* 1.5 · real size first: 512 pairs */
  const rulG = E('g'); E('rect', { x: 0, y: -22, width: 1100, height: 44, rx: 8, fill: '#FFFFFC', stroke: 'none', 'data-nd': '' }, rulG); pathEl(rulG, rrect(0, -22, 1100, 44, { ov: 1.5 }), 3); let rtk = ''; for (let i = 1; i < 64; i++) rtk += `M${f1(i * 1100 / 64)} ${i % 8 ? -8 : -18}V${i % 8 ? 8 : 18}`; pathEl(rulG, rtk, 1.6, P.soft);
  const ruler = gm(pB, rulG, P.ink, 680, 300);
  const rulL = txt(pB, 'one vector: 512 numbers · a raw comparison: 512 pairs, multiplied and added', 1230, 360, 28);
  const tW5 = a('w512'), tOurs = a('ours3');
  W(ruler, tW5 - 0.4, 0.8); W(rulL, tW5 + 0.3, 1.4);
  O(rulL, tOurs - 1.6, 0.3); pB.mv(ruler, tOurs - 1.4, 0.8, XM.x, XM.cy(2)); S.set(ruler, tOurs - 1.4, 0.8, { s: 0.27 }); O(ruler, tOurs - 0.7, 0.3);
  const oursL = label(pB, 'ours: 3 numbers, 3 pairs', 1230, 360, C_TR, 28, 'middle', 700);
  W(oursL, tOurs - 0.5, 0.6); O(oursL, bt('c1_06').t + 0.2, 0.3);
  /* 1.6 · bank against river, one term per spoken number, the matching column lit */
  const tB6 = bt('c1_06').t, tF = [a('f1'), a('f2'), a('f3')], tR18 = a('r018');
  const hlRb = rowHl(pB, XM, 2, P.hlL), hlRr = rowHl(pB, XM, 1, P.hlC);
  F(hlRb, tB6 + 0.4, 0.3); F(hlRr, tB6 + 1.4, 0.3); grp([hlRb, hlRr], 'hlRows');
  const LB6 = wline(pB, [{ s: 'bank · river =' }, { s: '0.1 × 0', col: zc }, { s: '+' }, { s: '0.1 × 0.9' }, { s: '+' }, { s: '0.9 × 0.1' }, { s: '=' }, { s: '0', col: zc }, { s: '+' }, { s: '0.09' }, { s: '+' }, { s: '0.09' }, { s: '=' }, { s: '0.18', col: P.green, w: 700 }], 1230, 330, 30);
  W(LB6[0], tB6 + 2.4, 0.5);
  [1, 3, 5].forEach((ix, k) => {
    if (k) W(LB6[ix - 1], tF[k] - 0.15, 0.2);
    W(LB6[ix], tF[k], 0.35);
    const ch = colHl(pB, XM, k, P.hlO); F(ch, tF[k] - 0.1, 0.25); O(ch, k < 2 ? tF[k + 1] - 0.1 : tR18 - 1.3, 0.25);
  });
  W(LB6[6], tR18 - 1.2, 0.2); writeParts(LB6.slice(7, 12), tR18 - 1.0, 0.1, 0.25); W(LB6[12], tR18 - 0.35, 0.2); W(LB6[13], tR18 - 0.15, 0.4);
  grp(LB6, 'LB6');
  /* 1.7 · river against bank: the same three products in a different order */
  const tB7 = bt('c1_07').t, tOrd = a('order');
  const LB7 = wline(pB, [{ s: 'river · bank =' }, { s: '0 × 0.1', col: zc }, { s: '+' }, { s: '0.9 × 0.1' }, { s: '+' }, { s: '0.1 × 0.9' }, { s: '=' }, { s: '0.18', col: P.green, w: 700 }], 1230, 400, 30);
  writeParts(LB7.slice(0, 7), tB7 + 0.9, 0.3); W(LB7[7], tOrd + 0.3, 0.4);
  grp(LB7, 'LB7');
  const DX1 = 1030, DX2 = 1430, DYa = 525;
  const dB = txt(pB, 'bank', DX1, DYa, 40), dR = txt(pB, 'river', DX2, DYa, 40);
  const dbl = pB(ink(rarrow(DX1 + 70, DYa, DX2 - 80, DYa, { head: 16 }) + headArrow(DX1 + 70, DYa, Math.PI, 16), P.ink, 3.5), 0, 0);
  const v18a = txt(pB, '0.18', DX1 + 125, DYa - 36, 30), v18b = txt(pB, '0.18', DX2 - 135, DYa - 36, 30);
  W(dB, tOrd + 0.8, 0.4); W(dR, tOrd + 0.9, 0.4); W(dbl, tOrd + 1.2, 0.5); W(v18a, bt('c1_07').end - 1.0, 0.3); W(v18b, bt('c1_07').end - 0.7, 0.3);
  grp([dB, dR], 'dWords'); grp([v18a, v18b], 'v18');
  /* 1.8 · the two directions can't differ: the opening's arrows, now equal */
  const tNdd = a('needed');
  O([dbl, v18a, v18b], tNdd - 1.6, 0.3);
  const eqTop = pB(ink(arcArrow(DX1 + 30, DYa - 26, DX2 - 30, DYa - 26, 46), C_FAIL, 4), 0, 0);
  const eqBot = pB(ink(arcArrow(DX2 - 30, DYa + 30, DX1 + 30, DYa + 30, -46), C_FAIL, 4), 0, 0);
  W(eqTop, tNdd - 1.4, 0.6); W(eqBot, tNdd - 1.0, 0.6);
  grp([eqTop, eqBot], 'eqArrows');
  /* 1.9 · the raw table: the same vectors on both edges, so it is its own mirror */
  const tB9 = bt('c1_09').t, tMr = a('mirror');
  O([...LB6, ...LB7, dB, dR, eqTop, eqBot, hlRb, hlRr], tB9 - 0.1, 0.4);
  const RTV = [['0.02', '0.09', '0.02'], ['0.09', '0.82', '0.18'], ['0.02', '0.18', '0.83']];
  const XW = WN.map(s => 'x(' + s + ')');
  const RT = matrix(pB, 1000, 330, RTV, 130, 70, { rlab: XW, z: 32, lz: 26, heads: XW, hz: 24, hcol: P.ink });
  const RTn = label(pB, 'raw table: x(word) on both edges', RT.x + RT.w / 2, 250, P.ink, 28);
  W(RTn, tB9 + 0.2, 0.6); showM(RT, tB9 + 0.4, 0.3, 'rt');
  grp([RTn], 'rtHead');
  const diagB = pB(ink(rl(RT.x + 8, RT.y + 8, RT.x + RT.w - 8, RT.y + RT.h - 8, { ov: 0 }), P.soft, 2.5, { dash: '10 10' }), 0, 0);
  W(diagB, tMr - 0.2, 0.5);
  const mPairs = [[[0, 1], [1, 0], C_V], [[0, 2], [2, 0], C_K], [[1, 2], [2, 1], C_Q]];
  const mRings = [];
  mPairs.forEach(([p1, p2, col], k) => { const r1 = cellRing(pB, RT, p1[0], p1[1], col), r2 = cellRing(pB, RT, p2[0], p2[1], col); W(r1, tMr + 0.3 + k * 0.5, 0.35); W(r2, tMr + 0.45 + k * 0.5, 0.35); mRings.push(r1, r2); grp([r1, r2], 'mpair' + k); });
  /* 1.10 · bank lines up best with itself */
  const tIt = a('itself');
  O([diagB, ...mRings], tIt - 0.5, 0.3);
  const hlBk = rowHl(pB, RT, 2, P.hlL); F(hlBk, tIt - 0.3, 0.3);
  const r83 = pB(ink(rell(RT.cx(2), RT.cy(2), 46, 28, { turn: 1.08 }), C_FAIL, 3.5), 0, 0); W(r83, tIt + 0.2, 0.5);
  const L83 = wline(pB, [{ s: 'bank · bank =' }, { s: '0.1 × 0.1' }, { s: '+' }, { s: '0.1 × 0.1' }, { s: '+' }, { s: '0.9 × 0.9' }, { s: '=' }, { s: '0.83', col: P.green, w: 700 }], RT.x + RT.w / 2, 600, 28);
  writeParts(L83, tIt + 0.6, 0.18); grp(L83, 'L83'); grp([hlBk, r83], 'bk83');
  pulse(RT.cells[2][1], tIt + 3.2, 1.25); pulse(RT.cells[2][0], tIt + 4.6, 1.25);

  /* ================= page (2,0) · chapter 1 · the raw recipe, worked (1.11-1.28) ================= */
  const pC = pg(2, 0), t01 = bt('c1_11').t;
  go(2, 0, t01 - 0.9, 1.2);
  /* X travels with the camera */
  const xTravel = [...allM(XM), xLab, trainTag];
  grp(xTravel, 'Xtravel');
  xTravel.forEach(m => S.move(m, t01 - 0.9, 1.2, m.cur.x + DX, m.cur.y));
  pageTitle(pC, '1 · The simple way: no Wq, Wk or Wv', t01 - 0.1);
  stepStrip(pC, 1, t01 + 0.6);
  /* 1.11-1.12 · T01's formula; the matrices come out */
  const t02 = bt('c1_12').t;
  const FX = 1240, FY = 215;
  const f01 = T(pC, '\\mathrm{softmax}\\!\\left(\\frac{\\textcolor{#E0218A}{Q}\\,\\textcolor{#4F63E6}{K}^{\\top}}{\\sqrt{d_k}}\\right)\\textcolor{#7A8F1C}{V}', FX, FY, 44);
  const f01t = label(pC, 'T01', FX - 250, FY, P.olive, 28, 'middle', 700);
  W(f01, t01 + 0.4, 1.6); W(f01t, t01 + 0.6, 0.4);
  grp([f01, f01t], 'f01');
  const FP = ['\\mathrm{softmax}\\Big(', 'X\\,X^{\\top}', '\\div\\sqrt{3}', '\\Big)', '\\cdot\\, X'];
  const fpm = FP.map(s => T(pC, s, 0, FY, 46));
  { const ws = fpm.map(m => m.g._w), gap = 10, tot = ws.reduce((s, v) => s + v, 0) + gap * (ws.length - 1); let x = FX - tot / 2; fpm.forEach((m, i) => { m.init.x = pC.ox + x + ws[i] / 2; m.cur.x = m.init.x; m.lx = x; m.wd = ws[i]; x += ws[i] + gap; }); }
  const QKV = ['\\textcolor{#E0218A}{Q} = X\\,W_q', '\\textcolor{#4F63E6}{K} = X\\,W_k', '\\textcolor{#7A8F1C}{V} = X\\,W_v'].map((src, i) => T(pC, src, FX - 300 + i * 300, 284, 32));
  QKV.forEach((m, i) => W(m, t01 + 2.6 + i * 0.5, 0.6)); grp(QKV, 'QKV');
  /* strike out each W: the right part of each little formula */
  const strikes = QKV.map((m, i) => { const cx = FX - 300 + i * 300, w = m.g._w; return pC(ink(rl(cx + w * 0.06, 298, cx + w * 0.52, 270, { ov: 0 }), C_FAIL, 4), 0, 0); });
  strikes.forEach((m, i) => W(m, t02 + 0.2 + i * 0.45, 0.35)); grp(strikes, 'strikes');
  O([f01, f01t], t02 + 1.4, 0.4);
  fpm.forEach((m, i) => W(m, t02 + 1.8 + i * 0.25, 0.6));
  grp(fpm, 'fpm');
  O([...QKV, ...strikes], a('stacked') - 1.4, 0.4);
  const fNote = txt(pC, 'no Wq, Wk or Wv: query, key and value are all X', FX, 280, 24, P.soft);
  W(fNote, a('stacked') - 1.0, 1.0);
  pulse(xLab, a('stacked') - 0.2, 1.08);
  const fHl = (idx, col = P.hlL) => [].concat(idx).map(i => { const m = fpm[i]; const h = pC(hlBar(m.lx - 4, m.lx + m.wd + 4, FY + 4, 46, col), 0, 0); S.behind(h, fpm[0]); return h; });

  /* 1.13-1.14 · bank's row of scores: q(bank) down the side, one k(word) across the top for each box */
  const t03 = bt('c1_13').t, tSc = a('scores'), tTop = a('top'), tXr = a('xrows'), tFF = a('ff'), tS18 = a('sc18'), tS83 = a('sc83');
  O(fNote, t03, 0.3);
  const q1 = label(pC, 'How much does bank listen to each word?', FX, 284, P.green, 34, 'middle', 700);
  W(q1, t03 + 0.1, 1.2);
  const hlSc = fHl(1); hlSc.forEach(h => F(h, tSc - 0.2, 0.4));
  const BX = [900, 1150, 1400], BY = 600, BW = 200, BH = 130, TGX = 700, TGY = BY - 118;
  const KPY = 362, KVY = 404, QPX = 700;
  const kPills = WN.map((s, j) => gm(pC, pillG('x(' + s + ')', 0, 0, P.ink, '#FFFFFC', 26), P.ink, BX[j], KPY));
  const kVec = WN.map((s, j) => matrix(pC, BX[j] - 78, KVY, [XV[j]], 52, 34, { z: 22, col: P.ink, ccol: xcol }));
  const qPill = gm(pC, pillG('x(bank)', 0, 0, P.ink, '#FFFFFC', 26), P.ink, QPX, BY - 16);
  const qVec = matrix(pC, QPX - 78, BY + 22, [XV[2]], 52, 34, { z: 22, col: P.ink, ccol: xcol });
  const qTag = label(pC, 'as its query: no Wq', QPX, BY + 86, C_Q, 22, 'middle', 700), kTag = label(pC, 'as keys: no Wk', BX[2] + 96, KPY, C_K, 22, 'start', 700);
  W(qPill, tTop - 3.0, 0.5); W(qVec.frame, tTop - 2.7, 0.4); W(qTag, tTop - 2.2, 0.6);
  grp([qPill, qVec.frame, qTag], 'qP'); grp(qVec.cells[0], 'qV');
  WN.forEach((s, j) => { W(kPills[j], tTop - 0.9 + j * 0.4, 0.4); W(kVec[j].frame, tTop - 0.8 + j * 0.4, 0.4); grp([kPills[j], kVec[j].frame], 'kP' + j); grp(kVec[j].cells[0], 'kV' + j); });
  W(kTag, tTop + 0.5, 0.6);
  /* with no matrices, those vectors are just rows of X: each flies in from its row */
  const hBk = rowHl(pC, XM, 2, P.hlL); F(hBk, tXr - 2.2, 0.3);
  [0, 1, 2].forEach(k => flyC(pC, qVec.cells[0][k], XM.cx(k), XM.cy(2), tXr - 2.0 + k * 0.08, 0.6));
  WN.forEach((s, j) => {
    const t = tXr - 1.4 + j * 0.4;
    const hr = j === 2 ? null : rowHl(pC, XM, j, P.hlC); if (hr) { F(hr, t - 0.15, 0.2); O(hr, t + 0.8, 0.2); }
    [0, 1, 2].forEach(k => flyC(pC, kVec[j].cells[0][k], XM.cx(k), XM.cy(j), t + k * 0.06, 0.55));
  });
  const boxes = BX.map(x => gm(pC, boxG(BW, BH), P.ink, x, BY));
  boxes.forEach((m, i) => F(m, tTop + 0.4 + i * 0.12, 0.4)); grp(boxes, 'boxes');
  /* the values in the boxes: the current one big, the previous one small and grey above it */
  let curV = [null, null, null], prevV = [null, null, null];
  const setVal = (i, s, t, col = P.ink) => {
    const m = label(pC, s, BX[i], BY + 4, col, 42, 'middle', 700);
    F(m, t, 0.35); m.grp = 'boxVals';
    if (prevV[i]) O(prevV[i], t, 0.3);
    if (curV[i]) { pC.mv(curV[i], t, 0.45, BX[i], BY - 44); S.set(curV[i], t, 0.45, { s: 0.55, color: P.soft }); }
    prevV[i] = curV[i]; curV[i] = m; return m;
  };
  const setAll = (vals, t, skip = -1, gap = 0.08) => { vals.forEach((s, i) => { if (i !== skip) setVal(i, s, t + i * gap); }); };
  const barT = [0, 1, 2].map(() => trk({ w: 0 })); grp(barT, 'bars');
  const bars = BX.map((x, i) => { const g = E('g'); const r = E('rect', { x: -80, y: -7, width: 1, height: 14, rx: 4, fill: C_FAIL, 'fill-opacity': 0.55, stroke: C_FAIL, 'stroke-width': 2, 'data-nd': '' }, g); const m = gm(pC, g, C_FAIL, x, BY + 46); S.drive(() => r.setAttribute('width', f1(Math.max(1, barT[i].v.w * 160)))); return m; });
  const setBars = (fr, t, d = 0.8) => fr.forEach((v, i) => S.set(barT[i], t, d, { w: v }));
  const stepTag = (s, t, isTex, sub) => { const m = isTex ? T(pC, s, TGX, TGY, 40, P.green) : label(pC, s, TGX, TGY, P.green, 34, 'middle', 700); W(m, t, 0.5); let sm = null; if (sub) { sm = sub.tex ? T(pC, sub.tex, TGX, TGY + 40, 26, P.soft) : txt(pC, sub, TGX, TGY + 40, 24, P.soft); W(sm, t + 0.3, 0.5); } return [m, sm]; };
  let tagNow = stepTag('scores', tTop + 0.9, false, 'row · row for each word');
  /* one score at a time: the word's key lights; position by position the pairs multiply; the sum drops into its box */
  const WLY = 720;
  const cmpLine = (j, terms, tts, tRes, quick) => {
    const hC = rowHl(pC, kVec[j], 0, P.hlC); F(hC, tts[0] - 0.9, 0.3);
    const parts = [{ s: 'x(bank) · x(' + WN[j] + ') =' }, terms[0], { s: '+' }, terms[1], { s: '+' }, terms[2], { s: '=' }, { s: terms[3], col: P.green, w: 700 }];
    const L = wline(pC, parts, 1150, WLY, 30), last = L[L.length - 1];
    W(L[0], tts[0] - 0.7, 0.4);
    const labs = [1, 3, 5].map((ix, k) => label(pC, String(k + 1), L[ix].mid, WLY - 38, P.soft, 22, 'middle', 700));
    [1, 3, 5].forEach((ix, k) => {
      if (k) W(L[ix - 1], tts[k] - 0.15, 0.2);
      W(L[ix], tts[k], quick ? 0.25 : 0.4); W(labs[k], tts[k], 0.3);
      if (!quick) {
        const b1 = cellHl(pC, qVec, 0, k, P.hlO), b2 = cellHl(pC, kVec[j], 0, k, P.hlO), tOff = k < 2 ? tts[k + 1] - 0.15 : tRes - 0.3;
        F(b1, tts[k] - 0.1, 0.25); F(b2, tts[k] - 0.1, 0.25); O([b1, b2], tOff, 0.25); grp([b1, b2], 'cmp' + j);
      }
    });
    W(L[6], tRes - 0.5, 0.2); W(last, tRes - 0.25, 0.4);
    pC.mv(last, tRes + 0.35, 0.55, BX[j] - last.wid / 2, BY + 4); O(last, tRes + 0.85, 0.15);
    setVal(j, last.textEl.textContent, tRes + 0.8);
    O([...L.slice(0, -1), ...labs, hC], tRes + 0.7, 0.35);
    grp(L, 'cmp' + j); grp(labs, 'cmp' + j); grp([hC], 'cmp' + j);
    return tRes + 1.2;
  };
  const tR = cmpLine(1, [{ s: '0.1 × 0', col: zc }, { s: '0.1 × 0.9' }, { s: '0.9 × 0.1' }, '0.18'], [tFF, tFF + 0.9, tFF + 1.8], Math.max(tS18, tFF + 2.7), false);
  const tB0 = tR + 0.1, tB = cmpLine(2, [{ s: '0.1 × 0.1' }, { s: '0.1 × 0.1' }, { s: '0.9 × 0.9' }, '0.83'], [tB0 + 0.8, tB0 + 1.15, tB0 + 1.5], Math.max(tS83, tB0 + 2.3), true);
  const tTh0 = tB + 0.1, tT = cmpLine(0, [{ s: '0.1 × 0.1' }, { s: '0.1 × 0.1' }, { s: '0.9 × 0', col: zc }, '0.02'], [tTh0 + 0.8, tTh0 + 1.15, tTh0 + 1.5], tTh0 + 2.3, true);
  bars.forEach((m, i) => F(m, tT + 0.1 + i * 0.1, 0.3)); grp(bars, 'bars');
  setBars([0.02 / 0.83, 0.18 / 0.83, 1], tT + 0.2);
  /* the vectors leave once the scores are made; the q and k pills stay to name the row and the boxes */
  const t04 = Math.max(bt('c1_15').t, tT) + 0.1;
  O([...kVec.flatMap(M => [M.frame, ...M.cells.flat()]), qVec.frame, ...qVec.cells.flat(), hBk, qTag, kTag], t04, 0.4);
  kPills.forEach((m, j) => pC.mv(m, t04 + 0.3, 0.7, BX[j], BY - BH / 2 - 36)); grp(kPills, 'kPills');
  const nextTag = (s, t, isTex, sub) => { O(tagNow.filter(Boolean), t - 0.3, 0.3); tagNow = stepTag(s, t, isTex, sub); };

  /* 1.15-1.16 · step one: divide by root three, and why */
  const tD = a('d479'), tSt1 = Math.max(bt('c1_15').t + 0.6, t04 + 0.6);
  hlSc.forEach(h => O(h, tSt1 - 0.1, 0.3));
  const hlD = fHl(2); hlD.forEach(h => F(h, tSt1, 0.4));
  nextTag('\\div\\sqrt{3}', tSt1 + 0.1, true, { tex: '\\sqrt{3} \\approx 1.732' });
  const dkN = T(pC, 'd_k = \\text{numbers per key: 3 here, 64 at real size}', FX, 334, 26, P.soft);
  W(dkN, a('length') - 0.2, 0.9); O(dkN, a('stalls') - 2.2, 0.3);
  const stallN = txt(pC, 'without it, softmax saturates and learning stalls', FX, 330, 24, P.soft);
  W(stallN, a('stalls') - 1.6, 1.0);
  const L1 = wline(pC, [{ s: '0.83' }, { tex: '\\div' }, { s: '1.732' }, { s: '=' }, { s: '0.479', col: P.green, w: 700 }], 1150, WLY, 34);
  flyIn(pC, L1[0], BX[2], BY + 4, tD - 2.6);
  writeParts(L1.slice(1, 4), tD - 1.5, 0.2);
  W(L1[4], tD - 0.3, 0.5);
  pC.mv(L1[4], tD + 0.5, 0.6, BX[2] - L1[4].wid / 2, BY + 4); O(L1[4], tD + 1.05, 0.15);
  setVal(2, '0.479', tD + 1.0);
  O(L1.slice(0, 4), tD + 0.9, 0.4);
  const same1 = txt(pC, 'the same for each: 0.02 ÷ 1.732, 0.18 ÷ 1.732', 1150, WLY, 26, P.soft);
  W(same1, tD + 1.4, 0.8); setAll(['0.012', '0.104', '0.479'], tD + 1.6, 2);
  O(same1, bt('c1_16').end + 0.2, 0.3);
  grp(L1, 'L1');

  /* 1.17 · step two: e to each (the step that reshapes the bars) */
  const t05 = bt('c1_17').t, tE = a('e1614');
  hlD.forEach(h => O(h, t05 - 0.1, 0.3));
  O(stallN, t05, 0.3);
  const hlS = fHl([0, 3]); hlS.forEach(h => F(h, t05, 0.4));
  nextTag('e^{x}', t05 + 0.1, true, 'softmax begins');
  const L2 = wline(pC, [{ tex: 'e^{0.479}' }, { s: '=' }, { s: '1.614', col: P.green, w: 700 }], 1150, WLY, 34);
  flyIn(pC, L2[0], BX[2], BY + 4, tE - 2.4);
  W(L2[1], tE - 1.0, 0.3); W(L2[2], tE - 0.3, 0.5);
  pC.mv(L2[2], tE + 0.5, 0.6, BX[2] - L2[2].wid / 2, BY + 4); O(L2[2], tE + 1.05, 0.15);
  setVal(2, '1.614', tE + 1.0);
  O(L2.slice(0, 2), tE + 0.9, 0.4);
  setAll(['1.012', '1.110', '1.614'], tE + 1.5, 2);
  setBars([1.012 / 1.614, 1.110 / 1.614, 1], tE + 1.6, 1.0);
  grp(L2, 'L2');

  /* 1.18 · step three: the total */
  const t06 = bt('c1_18').t, tTo = a('t3736'), tTog = t06 + 0.6;
  nextTag('total', tTog - 0.4, false);
  const L3 = wline(pC, [{ s: '1.012' }, { s: '+' }, { s: '1.110' }, { s: '+' }, { s: '1.614' }, { s: '=' }, { s: '3.736', col: P.green, w: 700 }], 1150, WLY, 34);
  [0, 2, 4].forEach((k, i) => flyIn(pC, L3[k], BX[i], BY + 4, tTog - 0.2 + i * 0.3, 0.6));
  W(L3[1], tTog + 0.8, 0.25); W(L3[3], tTog + 1.0, 0.25); W(L3[5], tTo - 0.6, 0.25); W(L3[6], tTo - 0.2, 0.5);
  const TCX = 1660;
  const totBox = gm(pC, chipG(), P.green, TCX, BY);
  const totLab = label(pC, 'total', TCX, BY - 72, P.green, 28, 'middle', 700);
  F(totBox, tTo + 0.5, 0.4); W(totLab, tTo + 0.6, 0.4);
  pC.mv(L3[6], tTo + 0.6, 0.7, TCX - L3[6].wid / 2, BY); O(L3.slice(0, 6), tTo + 0.9, 0.4);
  grp(L3, 'L3'); grp([totBox, totLab], 'tot');

  /* 1.19 · step four: divide by the total */
  const tS = a('s432'), t07 = bt('c1_19').t;
  nextTag('\\div\\ \\text{total}', t07 + 0.1, true, 'softmax ends');
  const L4 = wline(pC, [{ s: '1.614' }, { tex: '\\div' }, { s: '3.736' }, { s: '=' }, { s: '0.432', col: P.green, w: 700 }], 1150, WLY, 34);
  flyIn(pC, L4[0], BX[2], BY + 4, tS - 2.8);
  W(L4[1], tS - 1.9, 0.3);
  flyIn(pC, L4[2], TCX, BY, tS - 1.8);
  W(L4[3], tS - 0.6, 0.3); W(L4[4], tS - 0.3, 0.5);
  pC.mv(L4[4], tS + 0.5, 0.6, BX[2] - L4[4].wid / 2, BY + 4); O(L4[4], tS + 1.05, 0.15);
  setVal(2, '0.432', tS + 1.0);
  O(L4.slice(0, 4), tS + 0.9, 0.4);
  setAll(['0.271', '0.297', '0.432'], tS + 1.5, 2);
  const chk = txt(pC, 'check: 0.271 + 0.297 + 0.432 = 1', 1150, WLY, 26, P.soft);
  W(chk, tS + 2.0, 0.8);
  grp(L4, 'L4');

  /* 1.20 · shares as percentages; bank listens mostly to itself */
  const t08 = bt('c1_20').t, t43 = a('raw43');
  O([chk, totBox, totLab, L3[6]], t08, 0.35);
  hlS.forEach(h => O(h, t08 + 0.1, 0.3));
  nextTag('shares', t08 + 0.2, false);
  setVal(0, '27%', t08 + 1.2); setVal(1, '30%', t08 + 2.4); setVal(2, '43%', t43 - 0.3, C_FAIL);
  const ring = pC(ink(rell(BX[2], BY + 2, 122, 80, { turn: 1.06 }), C_FAIL, 4), 0, 0);
  W(ring, t43 + 0.1, 0.6);

  /* 1.21 · with Wq and Wk, T01's bank gave river 68 percent */
  const t1_21 = bt('c1_21').t, tT01 = a('t01r'), d21 = bt('c1_21').end - t1_21;
  const T01Y = 724;
  const t01L = label(pC, 'with Wq and Wk (T01):', TGX, T01Y, C_Z, 24, 'middle', 700);
  const t01V = ['16%', '68%', '16%'].map((s, j) => label(pC, s, BX[j], T01Y, C_Z, 32, 'middle', 700));
  W(t01L, t1_21 + 0.3, 0.8);
  t01V.forEach((m, j) => F(m, t1_21 + 0.42 * d21 + j * 0.15, 0.4)); grp(t01V, 't01V');
  const ring68 = pC(ink(rell(BX[1], T01Y, 62, 30, { turn: 1.06 }), C_Z, 3.5), 0, 0);
  W(ring68, t1_21 + 0.52 * d21, 0.5);
  pulse(t01V[2], tT01 - 0.1, 1.25);

  /* 1.27 · relevance is not similarity */
  const t12 = bt('c1_27').t, tNd = a('needs');
  O(q1, t12, 0.3);
  const relL = label(pC, 'relevance is not similarity', FX, 284, P.green, 34, 'middle', 700);
  W(relL, t12 + 0.2, 1.0);
  const simL = label(pC, 'most like bank', BX[2], 780, C_FAIL, 26, 'middle', 700), needL = label(pC, 'what bank needs', BX[1], 780, P.green, 26, 'middle', 700);
  const ringN = pC(ink(rell(BX[1], BY + 2, 122, 80, { turn: 1.06 }), P.green, 4), 0, 0);
  O(ring, tNd - 2.5, 0.3);
  const ringS = pC(ink(rell(BX[2], BY + 2, 122, 80, { turn: 1.06 }), C_FAIL, 4), 0, 0);
  W(ringS, tNd - 2.2, 0.5); W(simL, tNd - 2.0, 0.6); W(ringN, tNd - 0.2, 0.5); W(needL, tNd, 0.6);
  grp([ringS, simL], 'relS'); grp([ringN, needL], 'relN');

  /* 1.28 · a raw score has no matching rule to learn: the three problems, listed together */
  const t28 = bt('c1_28').t, tRows = a('rows');
  const prH = label(pC, 'the raw way: three problems', 1150, 846, P.ink, 30, 'middle', 700);
  const prL = ['1 · bank listens mostly to itself', '2 · both directions score the same', '3 · no matching rule to learn'].map((s, i) => label(pC, s, 960, 894 + i * 44, i === 2 ? C_FAIL : P.ink, 28, 'start', 400));
  W(prH, t28 + 0.3, 0.6); W(prL[0], t28 + 0.8, 0.6); W(prL[1], t28 + 1.6, 0.6); W(prL[2], tRows - 1.0, 0.6);
  grp([prH], 'prH');

  /* ================= page (3,0) · chapter 1 · where queries and keys come from (1.29-1.37) ================= */
  const pD = pg(3, 0), t13 = bt('c1_29').t;
  go(3, 0, t13 - 0.9, 1.2);
  xTravel.forEach(m => S.move(m, t13 - 0.9, 1.2, m.cur.x + DX, m.cur.y));
  pageTitle(pD, '1 · Where queries and keys come from', t13 - 0.1);
  stepStrip(pD, 1, t13 + 0.8);
  const fQ = T(pD, '\\textcolor{#E0218A}{Q} = X\\,\\textcolor{#E0218A}{W_q}', 1000, 215, 46), fK = T(pD, '\\textcolor{#4F63E6}{K} = X\\,\\textcolor{#4F63E6}{W_k}', 1450, 215, 46);
  W(fQ, a('back') - 0.4, 0.8); W(fK, a('back') + 0.8, 0.8);
  const hatchN = txt(pD, 'hatched = learned', 1225, 268, 22, P.soft);
  W(hatchN, a('learned') - 0.3, 0.6);
  grp([fQ, fK], 'fQK');
  /* 1.30 · real size first, with the shapes: x (1 × 512) times Wq (512 × 64) gives q (1 × 64) */
  const t14 = bt('c1_30').t, tM = a('m512'), tQ64 = a('q64'), tTh = a('three');
  const rsX = gm(pD, (() => { const g = E('g'); E('rect', { x: 0, y: 0, width: 420, height: 36, rx: 4, fill: '#FFFFFC', stroke: 'none', 'data-nd': '' }, g); let tk = ''; for (let i = 1; i < 64; i++) tk += `M${f1(i * 420 / 64)} ${i % 8 ? 12 : 4}V${i % 8 ? 24 : 32}`; pathEl(g, tk, 1, P.soft, { opacity: 0.6 }); pathEl(g, rrect(0, 0, 420, 36, { ov: 1.5 }), 3); return g; })(), P.ink, 620, 637);
  const rsXl = txt(pD, 'x: 1 × 512, one word', 830, 700, 26);
  const rsW = gm(pD, hatchG(64, 420, '', C_Q), P.ink, 1140, 445);
  const rsWl = label(pD, 'Wq: 512 × 64', 1172, 900, C_Q, 26, 'middle', 700);
  const rsQ = gm(pD, (() => { const g = E('g'); E('rect', { x: 0, y: 0, width: 64, height: 36, rx: 4, fill: C_Q, 'fill-opacity': 0.12, stroke: 'none', 'data-nd': '' }, g); pathEl(g, rrect(0, 0, 64, 36, { ov: 1.5 }), 3, C_Q); return g; })(), P.ink, 1330, 637);
  const rsQl = txt(pD, 'q: 1 × 64', 1362, 700, 26, C_Q);
  const rsOps = [T(pD, '\\times', 1090, 655, 44), T(pD, '=', 1260, 655, 44)];
  F(rsX, t14 + 0.4, 0.6); W(rsXl, t14 + 0.8, 0.6); W(rsW, tM - 0.6, 0.8); W(rsWl, tM + 0.2, 0.6);
  W(rsOps[0], tM - 0.7, 0.3); W(rsOps[1], tQ64 - 1.0, 0.3); F(rsQ, tQ64 - 0.8, 0.5); W(rsQl, tQ64 - 0.4, 0.6);
  grp([rsX, rsXl], 'rsX'); grp([rsW, rsWl], 'rsW'); grp([rsQ, rsQl], 'rsQ'); grp(rsOps, 'rsOps');
  const rsAll = [rsX, rsXl, rsW, rsWl, rsQ, rsQl, ...rsOps];
  grp(rsAll, 'rsAll');
  rsAll.forEach(m => { S.set(m, tTh - 0.2, 0.7, { s: 0.25, x: pD.ox + 940, y: pD.oy + 660, o: 0 }); });
  /* 1.31 · the toy Wq, and an empty Q waiting */
  const tCol = a('column');
  const WQV = [['0', '0', '0'], ['0', '0', '0'], ['4', '0', '0']];
  const WQ = matrix(pD, 820, 580, WQV, 80, 56, { rlab: ['1', '2', '3'], lcol: P.ink, lz: 24, heads: ['slot 1', 'slot 2', 'slot 3'], hz: 22, col: C_Q, hatch: true, ccol: mcol, w: 700 });
  const WQn = label(pD, 'Wq, toy', 940, 785, C_Q, 28, 'middle', 700);
  showM(WQ, tTh + 0.3, 0.1, 'wq'); W(WQn, tTh + 0.6, 0.4);
  const h4 = cellHl(pD, WQ, 2, 0, P.hlO); F(h4, tCol - 0.5, 0.4);
  pulse(WQ.cells[2][0], tCol - 0.4, 1.3);
  const QM = matrix(pD, 1450, 300, [['', '', ''], ['', '', ''], ['', '', '']], 80, 56, { rlab: WN.map(s => 'q(' + s + ')'), lcol: C_Q, rlabRight: true, heads: ['slot 1', 'slot 2', 'slot 3'], hz: 22, col: C_Q, lz: 28 });
  const QMn = T(pD, '\\textcolor{#E0218A}{Q}', 1570, 512, 40);
  showM(QM, bt('c1_31').end - 1.2, 0.08, 'qm', false); W(QMn, bt('c1_31').end - 0.8, 0.4);
  /* 1.32 · bank's query: its row stands beside Wq's first column; multiply the pairs; add */
  const t16 = bt('c1_32').t, tPr = a('pairs'), tQ36 = a('q36');
  O(h4, t16, 0.3);
  const hXb = rowHl(pD, XM, 2, P.hlL), hW1 = colHl(pD, WQ, 0, P.hlC);
  F(hXb, t16 + 0.2, 0.3); F(hW1, t16 + 3.0, 0.3);
  const WCX = 1240, WR = [608, 664, 720], WSUM = 784;
  /* a stacked dot product: one pair per row of the matrix, then the sum */
  const CN = ['1', '2', '3'];
  const dot = (p, xs, ws, col, tStart, quick, xRow, M, gap = 0.85) => {
    const lines = [];
    xs.forEach((xv, k) => {
      const zero = xv === '0' || ws[k] === '0';
      const parts = [{ s: k ? '+' : ' ', col: P.soft }, { s: xv, col: zero ? P.soft : P.ink, w: zero ? 400 : 700 }, { tex: '\\times' }, { s: ws[k], col: zero ? P.soft : col, w: zero ? 400 : 700 }];
      const L = wline(p, parts, WCX, WR[k], 30);
      const t = tStart + k * (quick ? 0.2 : gap);
      const nm = label(p, CN[k], WCX - 120, WR[k], P.soft, 22, 'end', 400);
      W(nm, t, 0.3); W(L[0], t, 0.2);
      if (quick) { W(L[1], t, 0.25); W(L[2], t + 0.1, 0.2); W(L[3], t + 0.15, 0.25); }
      else {
        const hx = p(hlBar(XM.cx(k) - 46, XM.cx(k) + 46, XM.y - 24, 28, P.hlO), 0, 0), hm = p(hlBar(M.x - 42, M.x - 6, M.cy(k), 28, P.hlO), 0, 0);
        S.behind(hx, XM.heads[k]); S.behind(hm, M.rlab[k]); F(hx, t - 0.1, 0.25); F(hm, t + 0.6, 0.25); O([hx, hm], t + 1.55, 0.3);
        flyIn(p, L[1], XM.cx(k), XM.cy(xRow), t, 0.6); W(L[2], t + 0.75, 0.2); flyIn(p, L[3], M.cx(0), M.cy(k), t + 0.75, 0.55);
      }
      L.push(nm);
      lines.push(L);
    });
    return lines;
  };
  const QL = dot(pD, ['0.1', '0.1', '0.9'], ['0', '0', '4'], C_Q, tPr - 4.6, false, 2, WQ, 1.1);
  const sRule = pD(ink(rl(WCX - 90, WSUM - 30, WCX + 90, WSUM - 31, { bow: 0.002 }), P.ink, 3), 0, 0);
  const qSum = wline(pD, [{ s: '=' }, { s: '3.6', col: C_Q, w: 700 }], WCX, WSUM, 34);
  W(sRule, tQ36 - 0.9, 0.3); W(qSum[0], tQ36 - 0.6, 0.2); W(qSum[1], tQ36 - 0.2, 0.5);
  const hlP = pD(hlBar(WCX - 70, WCX + 80, WR[2], 34, P.hlO), 0, 0); S.behind(hlP, QL[2][0]); F(hlP, tQ36 - 1.6, 0.3);
  /* 3.6 rises into Q's bank row, slot 1 */
  const tLand = tQ36 + 0.6;
  pD.mv(qSum[1], tLand, 0.7, QM.cx(0) - qSum[1].wid / 2, QM.cy(2));
  const qVals = [[null, null, null], [null, null, null], [null, null, null]];
  const qSet = (i, j, s, t, M = QM, store = qVals, col = C_Q) => { const m = label(pD, s, M.cx(j), M.cy(i), s === '0' ? P.soft : col, 30, 'middle', 700); F(m, t, 0.3); store[i][j] = m; return m; };
  qSet(2, 0, '3.6', tLand + 0.6); O(qSum[1], tLand + 0.65, 0.15);
  /* 1.33 · Wq's other columns are zero, so slots 2 and 3 are zero */
  const t17 = bt('c1_33').t, tZs = a('zeros');
  O([...QL.flat(), sRule, qSum[0], hlP, hW1], t17, 0.4);
  const hW23 = [1, 2].map(j => colHl(pD, WQ, j, '#D8D8D0')); hW23.forEach(m => F(m, tZs - 1.2, 0.3));
  qSet(2, 1, '0', tZs - 0.4); qSet(2, 2, '0', tZs - 0.2);
  O([...hW23, hXb], bt('c1_33').end, 0.3);
  /* 1.34 · the same rule for river and "the", quickly */
  const t18 = bt('c1_34').t, tR4 = a('riv04'), tT0 = a('the0');
  const hXr = rowHl(pD, XM, 1, P.hlL); F(hXr, t18, 0.3);
  const RL = dot(pD, ['0', '0.9', '0.1'], ['0', '0', '4'], C_Q, t18 + 0.2, true, 1, WQ);
  const rSum = wline(pD, [{ s: '=' }, { s: '0.4', col: C_Q, w: 700 }], WCX, WSUM, 34);
  S.set(sRule, tR4 - 1.0, 0.3, { o: 1 });
  W(rSum[0], tR4 - 0.8, 0.2); W(rSum[1], tR4 - 0.5, 0.4);
  pD.mv(rSum[1], tR4 + 0.1, 0.6, QM.cx(0) - rSum[1].wid / 2, QM.cy(1)); O(rSum[1], tR4 + 0.65, 0.15);
  qSet(1, 0, '0.4', tR4 + 0.6); qSet(1, 1, '0', tR4 + 0.8); qSet(1, 2, '0', tR4 + 0.9);
  O([...RL.flat(), rSum[0], hXr], tR4 + 0.7, 0.3);
  const hXt = rowHl(pD, XM, 0, P.hlL); F(hXt, tR4 + 0.9, 0.3);
  const TL = dot(pD, ['0.1', '0.1', '0'], ['0', '0', '4'], C_Q, tR4 + 1.0, true, 0, WQ);
  const tSumT = wline(pD, [{ s: '=' }, { s: '0', col: P.soft, w: 700 }], WCX, WSUM, 34);
  W(tSumT[0], tT0 - 0.6, 0.2); W(tSumT[1], tT0 - 0.3, 0.3);
  qSet(0, 0, '0', tT0 + 0.3); qSet(0, 1, '0', tT0 + 0.4); qSet(0, 2, '0', tT0 + 0.5);
  O([...TL.flat(), ...tSumT, hXt, sRule], tT0 + 0.6, 0.3);
  grp(QL.flat(), 'QL'); grp(RL.flat(), 'RL'); grp(TL.flat(), 'TL');
  /* 1.35 · Wk replaces Wq in the same place; an empty K waits under Q */
  const t19 = bt('c1_35').t, tCl = a('clear');
  dim(fQ, t19, 0.35);
  O([...allM(WQ), WQn], t19 + 0.1, 0.4);
  const WKV = [['1', '0', '0'], ['1', '0', '0'], ['0', '0', '0']];
  const WK = matrix(pD, 820, 580, WKV, 80, 56, { rlab: ['1', '2', '3'], lcol: P.ink, lz: 24, heads: ['slot 1', 'slot 2', 'slot 3'], hz: 22, col: C_K, hatch: true, ccol: mcol, w: 700 });
  const WKn = label(pD, 'Wk, toy', 940, 785, C_K, 28, 'middle', 700);
  showM(WK, t19 + 0.5, 0.1, 'wk'); W(WKn, t19 + 0.8, 0.4);
  const h1a = cellHl(pD, WK, 0, 0, P.hlO), h1b = cellHl(pD, WK, 1, 0, P.hlO);
  F(h1a, tCl - 3.0, 0.3); F(h1b, tCl - 2.8, 0.3); grp([h1a, h1b], 'h1ab');
  const KM = matrix(pD, 1450, 780, [['', '', ''], ['', '', ''], ['', '', '']], 80, 56, { rlab: WN.map(s => 'k(' + s + ')'), lcol: C_K, rlabRight: true, heads: ['slot 1', 'slot 2', 'slot 3'], hz: 22, col: C_K, lz: 28 });
  const KMn = T(pD, '\\textcolor{#4F63E6}{K}', 1570, 990, 40);
  showM(KM, tCl - 0.4, 0.08, 'km', false); W(KMn, tCl, 0.4);
  /* 1.36-1.37 · river's key in full, then bank and "the" */
  const t20 = bt('c1_36').t, t21 = bt('c1_37').t, tK9 = a('k09'), tK2 = a('k02');
  const kStart = Math.min(t20 + 0.1, tK9 - 3.4);
  O([h1a, h1b], kStart - 0.4, 0.3);
  const hXr2 = rowHl(pD, XM, 1, P.hlL), hK1 = colHl(pD, WK, 0, P.hlC);
  F(hXr2, kStart - 0.3, 0.3); F(hK1, kStart - 0.2, 0.3);
  const KL = dot(pD, ['0', '0.9', '0.1'], ['1', '1', '0'], C_K, kStart, false, 1, WK, 1.0);
  const kRule = pD(ink(rl(WCX - 90, WSUM - 30, WCX + 90, WSUM - 31, { bow: 0.002 }), P.ink, 3), 0, 0);
  const kSum = wline(pD, [{ s: '=' }, { s: '0.9', col: C_K, w: 700 }], WCX, WSUM, 34);
  W(kRule, tK9 - 0.5, 0.3); W(kSum[0], tK9 - 0.3, 0.2); W(kSum[1], tK9 - 0.1, 0.4);
  pD.mv(kSum[1], tK9 + 0.5, 0.7, KM.cx(0) - kSum[1].wid / 2, KM.cy(1));
  const kVals = [[null, null, null], [null, null, null], [null, null, null]];
  qSet(1, 0, '0.9', tK9 + 1.15, KM, kVals, C_K); O(kSum[1], tK9 + 1.2, 0.15);
  qSet(1, 1, '0', tK9 + 1.3, KM, kVals, C_K); qSet(1, 2, '0', tK9 + 1.4, KM, kVals, C_K);
  O([...KL.flat(), kSum[0], hXr2, kRule], t21 - 0.2, 0.3);
  const k2l = [txt(pD, 'bank: 0.1 × 1 + 0.1 × 1 + 0.9 × 0 = 0.2', 1330, 640, 26, P.ink), txt(pD, 'the: 0.1 × 1 + 0.1 × 1 + 0 × 0 = 0.2', 1330, 690, 26, P.ink)];
  W(k2l[0], t21 + 0.2, 0.9); W(k2l[1], t21 + 1.0, 0.9); grp(k2l, 'k2l');
  [2, 0].forEach((i, n) => { qSet(i, 0, '0.2', tK2 + 0.4 + n * 0.3, KM, kVals, C_K); qSet(i, 1, '0', tK2 + 0.6 + n * 0.3, KM, kVals, C_K); qSet(i, 2, '0', tK2 + 0.7 + n * 0.3, KM, kVals, C_K); });
  O([...k2l, hK1], bt('c1_37').end + 0.3, 0.4);
  grp(KL.flat(), 'KL');

  /* ================= page (3,1) · chapter 1 · one score, both ways (1.38-1.43) ================= */
  const pE = pg(3, 1), tE38 = bt('c1_38').t;
  go(3, 1, tE38 - 0.9, 1.2);
  /* Q and K slide down with the camera */
  const qkTravel = [...allM(QM), QMn, ...qVals.flat(), ...allM(KM), KMn, ...kVals.flat()].filter(Boolean);
  grp(qkTravel, 'QKtravel');
  qkTravel.forEach(m => S.move(m, tE38 - 0.9, 1.2, m.cur.x, m.cur.y + DY));
  pageTitle(pE, '1 · One score, both ways', tE38 - 0.1);
  stepStrip(pE, 1, tE38 + 0.6);
  /* the score formula with its braces: the looker's query and the target's key */
  const SFY = 300, tKr = a('keyr');
  const SF = wline(pE, [{ tex: 's(\\text{bank},\\,\\text{river}) =' }, { tex: '(x_{\\text{bank}}\\,\\textcolor{#E0218A}{W_q})' }, { tex: '\\cdot' }, { tex: '(x_{\\text{river}}\\,\\textcolor{#4F63E6}{W_k})' }], 760, SFY, 42);
  writeParts(SF, tE38 + 0.5, 0.35, 0.6); grp(SF, 'SF');
  const brQ = pE(ink(braceD(SF[1].lx + 4, SF[1].lx + SF[1].wid - 4, SFY + 34, 12), C_Q, 3), 0, 0);
  const brK = pE(ink(braceD(SF[3].lx + 4, SF[3].lx + SF[3].wid - 4, SFY + 34, 12), C_K, 3), 0, 0);
  const lbQ = wline(pE, [{ tex: 'q_i', col: C_Q }, { s: ': the looker’s query', col: C_Q, w: 700 }], SF[1].mid, SFY + 92, 26);
  const lbK = wline(pE, [{ tex: 'k_j', col: C_K }, { s: ': the target’s key', col: C_K, w: 700 }], SF[3].mid, SFY + 92, 26);
  W(brQ, tE38 + 2.2, 0.4); writeParts(lbQ, tE38 + 2.4, 0.2, 0.4);
  W(brK, tKr - 0.7, 0.4); writeParts(lbK, tKr - 0.5, 0.2, 0.4);
  grp([brQ, ...lbQ], 'brQ'); grp([brK, ...lbK], 'brK');
  /* 1.39 · bank looking at river: q(bank) and k(river) lit; the pairs multiply */
  const tE39 = bt('c1_39').t, tS324 = a('s324');
  const hQb = rowHl(pE, QM, 2, P.hlL), hKr = rowHl(pE, KM, 1, P.hlC);
  F(hQb, tE39 + 0.1, 0.3); F(hKr, tE39 + 0.5, 0.3); grp([hQb, hKr], 'hQK1');
  const LE1 = wline(pE, [{ s: 'i = bank, j = river:', col: P.soft }, { s: '3.6', w: 700 }, { tex: '\\times' }, { s: '0.9', w: 700 }, { s: '+' }, { s: '0 × 0', col: zc }, { s: '+' }, { s: '0 × 0', col: zc }, { s: '=' }, { s: '3.24', col: C_Q, w: 700 }], 760, 540, 32);
  W(LE1[0], tE39 + 0.2, 0.5);
  flyIn(pE, LE1[1], QM.cx(0), QM.cy(2), tE39 + 0.5, 0.6); W(LE1[2], tE39 + 1.3, 0.2); flyIn(pE, LE1[3], KM.cx(0), KM.cy(1), tE39 + 1.3, 0.6);
  writeParts(LE1.slice(4, 8), tE39 + 2.4, 0.12, 0.25); W(LE1[8], tS324 - 0.5, 0.2); W(LE1[9], tS324 - 0.25, 0.4);
  const hl324 = hlBehind(S, LE1[9], '3.24', P.hlO, { pad: 6 }); F(hl324, tS324 + 0.2, 0.3);
  grp(LE1, 'LE1');
  /* 1.40 · flip it: river looking at bank */
  const tE40 = bt('c1_40').t, tS008 = a('s008');
  O([hQb, hKr], tE40, 0.3);
  const hQr = rowHl(pE, QM, 1, P.hlL), hKb = rowHl(pE, KM, 2, P.hlC);
  F(hQr, tS008 - 4.6, 0.3); F(hKb, tS008 - 3.6, 0.3); grp([hQr, hKb], 'hQK2');
  const LE2 = wline(pE, [{ s: 'i = river, j = bank:', col: P.soft }, { s: '0.4', w: 700 }, { tex: '\\times' }, { s: '0.2', w: 700 }, { s: '+' }, { s: '0 × 0', col: zc }, { s: '+' }, { s: '0 × 0', col: zc }, { s: '=' }, { s: '0.08', col: P.ink, w: 700 }], 760, 620, 32);
  W(LE2[0], tE40 + 1.0, 0.5);
  flyIn(pE, LE2[1], QM.cx(0), QM.cy(1), tS008 - 4.2, 0.6); W(LE2[2], tS008 - 3.4, 0.2); flyIn(pE, LE2[3], KM.cx(0), KM.cy(2), tS008 - 3.3, 0.6);
  writeParts(LE2.slice(4, 8), tS008 - 1.9, 0.12, 0.25); W(LE2[8], tS008 - 0.5, 0.2); W(LE2[9], tS008 - 0.25, 0.4);
  grp(LE2, 'LE2');
  /* 1.41 · four vectors, two independent numbers */
  const tNm = a('numbers');
  O([hQr, hKb], tNm - 1.8, 0.3);
  const fv = (t_, col, w, x, y) => { const g = E('g'); E('rect', { x: 0, y: -16, width: w, height: 32, rx: 5, fill: col, 'fill-opacity': 0.4, stroke: col, 'stroke-width': 2, 'data-nd': '' }, g); const m = gm(pE, g, col, x, y); const l = label(pE, t_, x - 16, y, col, 28, 'end'); return [m, l]; };
  const [v1, v1l] = fv('q(bank) 3.6', C_Q, 180, 460, 740), [v2, v2l] = fv('k(river) 0.9', C_K, 45, 460, 790);
  const [v3, v3l] = fv('q(river) 0.4', C_Q, 20, 1050, 740), [v4, v4l] = fv('k(bank) 0.2', C_K, 10, 1050, 790);
  const r1 = label(pE, '= 3.24', 720, 765, C_Q, 34), r2 = label(pE, '= 0.08', 1160, 765, P.ink, 30);
  [[v1, v1l], [v2, v2l]].forEach(([m, l], i) => { F(m, tNm - 1.6 + i * 0.15, 0.3); W(l, tNm - 1.6 + i * 0.15, 0.3); });
  [[v3, v3l], [v4, v4l]].forEach(([m, l], i) => { F(m, tNm - 1.0 + i * 0.15, 0.3); W(l, tNm - 1.0 + i * 0.15, 0.3); });
  W(r1, tNm - 0.5, 0.4); W(r2, tNm, 0.4);
  grp([v1, v1l, v2, v2l, r1], 'fvA'); grp([v3, v3l, v4, v4l, r2], 'fvB');
  /* 1.42 · one-way, and learnable */
  const tE42 = bt('c1_42').t;
  const tkE = take(pE, ['Separate Wq and Wk make the match', 'one-way, and learnable.'], 760, 940, 900, tE42 + 0.1);
  /* 1.43 · that's one pair: everything but Q and K clears */
  const tWh = a('whole');
  O([tkE], tWh - 0.8, 0.5);
  dim([...SF, brQ, brK, ...lbQ, ...lbK, ...LE1, hl324, ...LE2, v1, v1l, v2, v2l, v3, v3l, v4, v4l, r1, r2], tWh - 0.8, 0.3, 0.5);

  /* ================= page (2,1) · chapter 2 · the whole table (2.1-2.16) ================= */
  const pF = pg(2, 1), t2 = bt('c2_01').t;
  go(2, 1, t2 - 0.9, 1.1);
  pageTitle(pF, '2 · The whole table', t2 - 0.3);
  stepStrip(pF, 1, t2 + 1.2);
  const TXc = [900, 1110, 1320], TYr = [470, 580, 690], CW = 190, CH = 100;
  const KPYt = 320, KVYt = 352, QPXt = 480, QVXt = 590;
  const QV = ['0', '0.4', '3.6'], KV = ['0.2', '0.9', '0.2'];
  /* 2.1 · Q and K slide in from chapter 1: Q's rows become the left edge, K's rows the top edge */
  O([QM.frame, ...QM.cells.flat(), ...QM.rlab, ...QM.heads, QMn, KM.frame, ...KM.cells.flat(), ...KM.rlab, ...KM.heads, KMn], t2 - 0.9, 0.3);
  const qVec2 = WN.map((s, i) => matrix(pF, QVXt, TYr[i] - 17, [['', '', '']], 46, 34, { col: C_Q }));
  const kVec2 = WN.map((s, j) => matrix(pF, TXc[j] - 69, KVYt, [['', '', '']], 46, 34, { col: C_K }));
  qVec2.forEach(M => S.behind(M.frame, qVals[2][0])); kVec2.forEach(M => S.behind(M.frame, qVals[2][0]));
  const qP2 = WN.map((s, i) => gm(pF, pillG('q(' + s + ')', 0, 0, C_Q, '#FFFFFC', 26), C_Q, QPXt, TYr[i]));
  const kP2 = WN.map((s, j) => gm(pF, pillG('k(' + s + ')', 0, 0, C_K, '#FFFFFC', 26), C_K, TXc[j], KPYt));
  const qkIn = [...qVals.flat(), ...kVals.flat()];
  grp(qkIn, 'QKtravel');
  qVals.forEach((r, i) => r.forEach((m, k) => { pF.mv(m, t2 - 0.9, 1.4, QVXt + 23 + 46 * k, TYr[i]); S.set(m, t2 - 0.9, 1.4, { s: 0.75 }); }));
  kVals.forEach((r, j) => r.forEach((m, k) => { pF.mv(m, t2 - 0.9, 1.4, TXc[j] - 46 + 46 * k, KVYt + 17); S.set(m, t2 - 0.9, 1.4, { s: 0.75 }); }));
  [...qVec2, ...kVec2].forEach(M => F(M.frame, t2 + 0.2, 0.4)); grp([...qVec2, ...kVec2].map(M => M.frame), 'edgeFrames');
  qP2.forEach((m, i) => F(m, t2 + 0.5 + i * 0.1, 0.4)); kP2.forEach((m, j) => F(m, t2 + 0.6 + j * 0.1, 0.4));
  grp(qP2, 'qP2'); grp(kP2, 'kP2');
  /* an empty 3 x 3 grid between */
  const gBox = TYr.map(y => TXc.map(x => gm(pF, boxG(CW - 10, CH - 10), P.ink, x, y)));
  const SCV = [[0, 0, 0], [0.08, 0.36, 0.08], [0.72, 3.24, 0.72]];
  const gShade = SCV.map((r, i) => r.map((v, j) => gm(pF, shadeG(CW - 10, CH - 10, 0.04 + 0.5 * v / 3.24), C_Q, TXc[j], TYr[i])));
  gBox.flat().forEach((m, k) => F(m, a('included') - 0.6 + k * 0.03, 0.3)); grp(gBox.flat(), 'grid');
  /* 2.2 · the map: Q times K-transpose, the rest of the formula waiting */
  const FX2 = 1110, FY2 = 215, tTb = a('table');
  const FP2 = ['\\mathrm{softmax}\\Big(', '\\textcolor{#E0218A}{Q}\\,\\textcolor{#4F63E6}{K}^{\\top}', '\\div\\sqrt{3}', '\\Big)'];
  const fp2 = FP2.map(s => T(pF, s, 0, FY2, 44));
  { const ws = fp2.map(m => m.g._w), gap = 10, tot = ws.reduce((s, v) => s + v, 0) + gap * (ws.length - 1); let x = FX2 - tot / 2; fp2.forEach((m, i) => { m.init.x = pF.ox + x + ws[i] / 2; m.cur.x = m.init.x; m.lx = x; m.wd = ws[i]; x += ws[i] + gap; }); }
  W(fp2[1], tTb - 0.3, 0.8);
  const fHl2 = (idx, col = P.hlL) => [].concat(idx).map(i => { const m = fp2[i]; const h = pF(hlBar(m.lx - 4, m.lx + m.wd + 4, FY2 + 4, 44, col), 0, 0); S.behind(h, fp2[0]); return h; });
  /* 2.3 · real size first: 30 x 30 per head, 48 per sentence */
  const t23 = bt('c2_03').t;
  const RGX = 1500, RGY = 290, RGS = 330;
  const bigGrid = gm(pF, (() => { const g = E('g'); E('rect', { x: 0, y: 0, width: RGS, height: RGS, fill: '#FFFFFC', stroke: 'none', 'data-nd': '' }, g); for (let i = 0; i < 30; i++) for (let j = 0; j < 30; j++) { const v = ((i * 7 + j * 13 + i * j) % 17) / 17; E('rect', { x: j * 11 + 0.5, y: i * 11 + 0.5, width: 10, height: 10, fill: C_Q, 'fill-opacity': 0.05 + 0.35 * v * v, stroke: 'none', 'data-nd': '' }, g); } pathEl(g, rrect(0, 0, RGS, RGS, { ov: 1 }), 2.5); return g; })(), P.ink, RGX, RGY);
  const bigL = txt(pF, 'a 30-token sentence, for example: 30 × 30', RGX + RGS / 2, RGY + RGS + 30, 24);
  F(bigGrid, t23 + 0.6, 0.6); W(bigL, t23 + 1.2, 0.8);
  const ghostsD = [1, 2, 3, 4, 5].map(k => { const m = gm(pF, (() => { const g = E('g'); E('rect', { x: 0, y: 0, width: RGS, height: RGS, fill: '#FFFFFC', stroke: 'none', 'data-nd': '' }, g); pathEl(g, rrect(0, 0, RGS, RGS, { ov: 1 }), 2.2, P.soft); return g; })(), P.soft, RGX + k * 12, RGY - k * 10); S.behind(m, bigGrid); return m; });
  const stackL = txt(pF, '× 8 heads × 6 layers = 48 tables', RGX + RGS / 2 - 30, RGY + RGS + 80, 26);
  ghostsD.forEach((m, k) => F(m, t23 + 6.0 + k * 0.1, 0.3, { o: 0.8 })); W(stackL, t23 + 6.4, 0.9);
  const oursL2 = label(pF, 'ours: 3 × 3', TXc[1], 800, C_TR, 30);
  W(oursL2, a('three2') - 0.6, 0.5);
  grp([bigGrid, bigL], 'bigGrid'); grp(ghostsD.concat(stackL), 'stack48');
  O([bigGrid, bigL, ...ghostsD, stackL, oursL2], bt('c2_03').end + 0.3, 0.4);
  /* 2.4-2.5 · the left edge is all queries (Wq), the top edge all keys (Wk) */
  const tQy = a('query'), tLe = a('leftedge'), tKy = a('key'), tTe = a('topedge');
  qP2.forEach((m, i) => pulse(m, tQy - 0.2 + i * 0.15, 1.1));
  const edgeQ = pF(ink(rrect(398, 416, 346, 328, { ov: 1 }), C_Q, 3), 0, 0);
  const rowCap = txt(pF, 'every row header made by Wq: the looking side', 480, 790, 22, C_Q);
  const iCap = label(pF, 'i = the row looking', 480, 826, C_Q, 24, 'middle', 700);
  W(edgeQ, tQy + 0.2, 0.6); W(rowCap, tLe - 1.6, 1.0); W(iCap, tLe - 0.4, 0.6);
  kP2.forEach((m, j) => pulse(m, tKy - 0.2 + j * 0.15, 1.1));
  const edgeK = pF(ink(rrect(800, 288, 620, 106, { ov: 1 }), C_K, 3), 0, 0);
  const colCap = txt(pF, 'every column header made by Wk: the looked-at side', 1110, 262, 22, C_K);
  const jCap = label(pF, 'j = the column looked at', 1440, 320, C_K, 24, 'start', 700);
  W(edgeK, tKy + 0.2, 0.6); W(colCap, tTe - 1.6, 1.0); W(jCap, tTe - 0.4, 0.6);
  grp([edgeQ, rowCap, iCap], 'capQ'); grp([edgeK, colCap, jCap], 'capK');
  /* 2.6 · bank shows up twice: two different vectors from one row of X */
  const t26 = bt('c2_06').t, tTw = a('twice'), tOr = a('onerow');
  O([edgeQ, edgeK], t26, 0.3);
  const ringQb = pF(ink(rrect(398, TYr[2] - 32, 346, 64, { ov: 1 }), C_TR, 4), 0, 0);
  const ringKb = pF(ink(rrect(TXc[2] - 82, 288, 164, 106, { ov: 1 }), C_TR, 4), 0, 0);
  const twCap = label(pF, 'one row of X, two matrices, two vectors', TXc[1], 800, C_TR, 26, 'middle', 700);
  W(ringQb, tTw + 1.0, 0.5); W(ringKb, tTw + 2.6, 0.5); W(twCap, tOr - 1.4, 0.9);
  grp([ringQb, ringKb], 'rings2');
  /* 2.7-2.10 · each cell is the row's query times the column's key */
  const t27 = bt('c2_07').t, tScr = a('score');
  O([ringQb, ringKb, twCap], t27, 0.3);
  const cellCap = wline(pF, [{ s: 'cell (row i, column j) =' }, { tex: 'q_i \\cdot k_j' }], TXc[1], 800, 26);
  writeParts(cellCap, tScr - 0.4, 0.3, 0.5);
  const tagZ = txt(pF, 'slots 2 and 3 are zero, so each score is one product', TXc[1], 840, 22, P.soft);
  const prodL = [[null, null, null], [null, null, null], [null, null, null]], resL = [[null, null, null], [null, null, null], [null, null, null]];
  const SCS = [['0', '0', '0'], ['0.08', '0.36', '0.08'], ['0.72', '3.24', '0.72']];
  const fillCell = (i, j, t, fly) => {
    let pr;
    if (fly) {
      pr = wline(pF, [{ s: QV[i] }, { s: '×' }, { s: KV[j] }], TXc[j], TYr[i] - 22, 24);
      flyIn(pF, pr[0], QVXt + 23, TYr[i], t, 0.6); W(pr[1], t + 0.8, 0.2); flyIn(pF, pr[2], TXc[j] - 46, KVYt + 17, t + 0.8, 0.6);
      grp(pr, 'pr' + i + j);
    } else { pr = [txt(pF, QV[i] + ' × ' + KV[j], TXc[j], TYr[i] - 22, 22, P.soft)]; W(pr[0], t, 0.4); }
    const tRes = t + (fly ? 1.9 : 0.45);
    const r = label(pF, SCS[i][j], TXc[j], TYr[i] + 16, SCS[i][j] === '0' ? P.soft : P.ink, 32, 'middle', 700);
    W(r, tRes, 0.4); F(gShade[i][j], tRes + 0.1, 0.4);
    prodL[i][j] = pr; resL[i][j] = r;
    return tRes + 0.4;
  };
  const hlC21 = pF(hlBar(TXc[1] - 84, TXc[1] + 84, TYr[2], CH - 24, P.hlO), 0, 0); S.behind(hlC21, gShade[0][0]);
  F(hlC21, tScr - 0.1, 0.3);
  const tC21 = fillCell(2, 1, tScr + 0.1, true);
  W(tagZ, tC21 + 0.1, 0.8);
  O(hlC21, bt('c2_07').end, 0.3);
  /* the row: all zero */
  const t28b = bt('c2_08').t;
  [0, 1, 2].forEach(j => fillCell(0, j, t28b + 0.6 + j * 0.4, false));
  /* river's row: the first cell worked aloud, the others by the same rule */
  const tR008 = a('r008');
  fillCell(1, 0, tR008 - 4.4, true); fillCell(1, 1, tR008 - 2.0, false); fillCell(1, 2, tR008 - 0.6, false);
  /* bank's row: 3.24 is chapter 1's score */
  const tB072 = a('b072');
  fillCell(2, 0, tB072 - 3.0, false); pulse(resL[2][1], tB072 - 1.7, 1.2); fillCell(2, 2, tB072 - 0.6, false);
  /* 2.11 · not a mirror; beside it, chapter 1's raw table, which was */
  const t211 = bt('c2_11').t, tNmr = a('notmirror');
  O([...cellCap, tagZ, rowCap, iCap, colCap, jCap], t211 - 0.2, 0.4);
  const diagF = pF(ink(rl(TXc[0] - CW / 2 + 12, TYr[0] - CH / 2 + 12, TXc[2] + CW / 2 - 12, TYr[2] + CH / 2 - 12, { ov: 0 }), P.soft, 2.5, { dash: '10 10' }), 0, 0);
  W(diagF, tNmr - 0.3, 0.6);
  const ringA = pF(ink(rrect(TXc[1] - CW / 2 + 2, TYr[2] - CH / 2 + 2, CW - 4, CH - 4, { ov: 1 }), C_Q, 4.5), 0, 0);
  const ringB = pF(ink(rrect(TXc[2] - CW / 2 + 2, TYr[1] - CH / 2 + 2, CW - 4, CH - 4, { ov: 1 }), P.soft, 4.5), 0, 0);
  W(ringA, tNmr + 1.0, 0.4); W(ringB, tNmr + 3.0, 0.4);
  const RSm = matrix(pF, 1540, 450, [['0.02', '0.09', '0.02'], ['0.09', '0.82', '0.18'], ['0.02', '0.18', '0.83']], 80, 40, { z: 22, rlab: XW, lz: 18, heads: XW, hz: 18 });
  const RSn = label(pF, 'chapter 1’s raw table: a mirror', 1660, 386, P.soft, 22, 'middle', 700);
  const diagS = pF(ink(rl(RSm.x + 6, RSm.y + 6, RSm.x + RSm.w - 6, RSm.y + RSm.h - 6, { ov: 0 }), P.soft, 2, { dash: '8 8' }), 0, 0);
  showM(RSm, tNmr + 0.4, 0.08, 'rs'); W(RSn, tNmr + 0.5, 0.5); W(diagS, tNmr + 1.0, 0.4);
  grp([diagF, ringA, ringB], 'mirrorF'); grp([RSn, diagS], 'rsN');

  /* 2.12-2.14 · softmax along each row, one row at a time in a row of boxes; the shares go into a table */
  const t212 = bt('c2_12').t;
  O([diagF, ringA, ringB, ...allM(RSm), RSn, diagS], t212 - 0.2, 0.4);
  [0, 2, 3].forEach((i, k) => W(fp2[i], t212 + 0.1 + k * 0.2, 0.5)); grp(fp2, 'fp2');
  const BYt = 900, WLY2 = 1012, TGX2 = 640;
  const sBox = TXc.map(x => gm(pF, boxG(170, 116), P.ink, x, BYt));
  sBox.forEach((m, i) => F(m, t212 + 0.3 + i * 0.1, 0.4)); grp(sBox, 'sBox');
  const RB2 = { cur: [null, null, null], prev: [null, null, null] };
  const sSet = (i, s, t, col = P.ink, from) => {
    const m = label(pF, s, TXc[i], BYt + 4, col, 38, 'middle', 700);
    if (from) flyC(pF, m, from[0], from[1], t, 0.6); else F(m, t, 0.35);
    m.grp = 'boxVals2';
    if (RB2.prev[i]) O(RB2.prev[i], t, 0.3);
    if (RB2.cur[i]) { pF.mv(RB2.cur[i], t, 0.45, TXc[i], BYt - 36); S.set(RB2.cur[i], t, 0.45, { s: 0.55, color: P.soft }); }
    RB2.prev[i] = RB2.cur[i]; RB2.cur[i] = m; return m;
  };
  const sAll = (vals, t, skip = -1, gap = 0.08, col = P.ink) => vals.forEach((s, i) => { if (i !== skip) sSet(i, s, t + i * gap, col); });
  const sClear = t => { [...RB2.cur, ...RB2.prev].forEach(m => m && O(m, t, 0.3)); RB2.cur = [null, null, null]; RB2.prev = [null, null, null]; };
  const bar2T = [0, 1, 2].map(() => trk({ w: 0 })); grp(bar2T, 'bars2');
  const bars2 = TXc.map((x, i) => { const g = E('g'); const r = E('rect', { x: -70, y: -6, width: 1, height: 12, rx: 4, fill: C_FAIL, 'fill-opacity': 0.55, stroke: C_FAIL, 'stroke-width': 2, 'data-nd': '' }, g); const m = gm(pF, g, C_FAIL, x, BYt + 42); S.drive(() => r.setAttribute('width', f1(Math.max(1, bar2T[i].v.w * 140)))); return m; });
  bars2.forEach((m, i) => F(m, t212 + 0.5, 0.3)); grp(bars2, 'bars2');
  const bars2To = (fr, t, d = 0.7) => fr.forEach((v, i) => S.set(bar2T[i], t, d, { w: v }));
  let tag2 = [];
  const tag2Set = (s, t, isTex, sub) => { O(tag2.filter(Boolean), t - 0.3, 0.3); const m = isTex ? T(pF, s, TGX2, BYt, 36, P.green) : label(pF, s, TGX2, BYt, P.green, 30, 'middle', 700); W(m, t, 0.5); let sm = null; if (sub) { sm = sub.tex ? T(pF, sub.tex, TGX2, BYt + 40, 24, P.soft) : txt(pF, sub, TGX2, BYt + 40, 22, P.soft); W(sm, t + 0.3, 0.5); } tag2 = [m, sm]; };
  let rowTag = null;
  const rowTagSet = (s, t) => { if (rowTag) O(rowTag, t - 0.3, 0.3); rowTag = label(pF, s, TGX2, BYt - 46, C_Q, 26, 'middle', 700); W(rowTag, t, 0.5); };
  let gHl = null;
  const gridHlSet = (i, t) => { if (gHl) O(gHl, t - 0.2, 0.3); gHl = pF(hlBar(TXc[0] - 90, TXc[2] + 90, TYr[i], CH - 28, P.hlL), 0, 0); S.behind(gHl, gShade[0][0]); F(gHl, t, 0.3); };
  const sLoad = (i, t) => { SCS[i].forEach((s, j) => sSet(j, s, t + j * 0.12, s === '0' ? P.soft : P.ink, [TXc[j], TYr[i] + 16])); };
  const tot2 = gm(pF, chipG(150, 80), P.green, 1560, BYt), tot2L = label(pF, 'total', 1560, BYt - 62, P.green, 26, 'middle', 700);
  let tot2V = null;
  const SHXc = [1545, 1655, 1765];
  const shFrame = gm(pF, matG(3, 3, 110, 110, P.ink), P.ink, 1490, 415);
  const shName = label(pF, 'shares, row by row', 1655, 372, P.ink, 24, 'middle', 700);
  const shHeads = WN.map((s, j) => txt(pF, s, SHXc[j], 400, 20, P.soft));
  W(shFrame, t212 + 1.7, 0.5); W(shName, t212 + 1.9, 0.5); shHeads.forEach((m, j) => W(m, t212 + 2.0 + j * 0.1, 0.3));
  grp([shFrame, shName, ...shHeads], 'shF');
  const shV = [[null, null, null], [null, null, null], [null, null, null]];
  const toShares = (i, vals, t) => { vals.forEach((s, j) => { const m = label(pF, s, SHXc[j], TYr[i], P.ink, 28, 'middle', 400); flyC(pF, m, TXc[j], BYt + 4, t + j * 0.08, 0.6); shV[i][j] = m; }); grp(shV[i], 'shV' + i); };
  /* one working line at a time at the bottom, cleared before the next */
  let wl2 = [];
  const wl2Set = (parts, t, z = 30) => { O(wl2, t - 0.15, 0.25); wl2 = wline(pF, parts, 1110, WLY2, z); grp(wl2, 'wl2' + t); return wl2; };
  /* the: zero everywhere; e to the zero is 1; a third each */
  const tEa = a('each');
  rowTagSet('the’s row', t212 + 0.8); gridHlSet(0, t212 + 0.8);
  sLoad(0, t212 + 1.1);
  const hlF1 = fHl2(2); hlF1.forEach(h => F(h, t212 + 2.2, 0.3));
  tag2Set('\\div\\sqrt{3}', t212 + 2.2, true, '0 ÷ 1.732 = 0');
  sAll(['0', '0', '0'], t212 + 2.9, -1, 0.08, P.soft);
  hlF1.forEach(h => O(h, tEa - 4.4, 0.3));
  const hlF2 = fHl2([0, 3]); hlF2.forEach(h => F(h, tEa - 4.3, 0.3));
  tag2Set('e^{x}', tEa - 4.2, true, 'softmax begins');
  { const L = wl2Set([{ tex: 'e^{0}' }, { s: '=' }, { s: '1', col: P.green, w: 700 }], tEa - 4.0); writeParts(L, tEa - 4.0, 0.2, 0.3); }
  sAll(['1', '1', '1'], tEa - 3.2); bars2To([1, 1, 1], tEa - 3.1);
  tag2Set('total', tEa - 2.5, false);
  { const L = wl2Set([{ s: '1' }, { s: '+' }, { s: '1' }, { s: '+' }, { s: '1' }, { s: '=' }, { s: '3', col: P.green, w: 700 }], tEa - 2.3); writeParts(L, tEa - 2.3, 0.08, 0.25); }
  F(tot2, tEa - 2.0, 0.4); W(tot2L, tEa - 1.9, 0.4); grp([tot2, tot2L], 'tot2');
  tot2V = label(pF, '3', 1560, BYt, P.green, 34, 'middle', 700); F(tot2V, tEa - 1.6, 0.3);
  tag2Set('\\div\\ \\text{total}', tEa - 1.3, true, 'softmax ends');
  { const L = wl2Set([{ s: '1' }, { tex: '\\div' }, { s: '3' }, { s: '=' }, { s: '0.333', col: P.green, w: 700 }], tEa - 1.1); writeParts(L, tEa - 1.1, 0.1, 0.25); }
  sAll(['0.333', '0.333', '0.333'], tEa - 0.4);
  toShares(0, ['0.333', '0.333', '0.333'], tEa + 0.3);
  /* river: divide by 1.732, e to each, divide by the total, 3.325 */
  const t213 = bt('c2_13').t, tRdv = a('rdiv'), tRex = a('rexp'), tRto = a('rtot'), tR31 = a('r31');
  sClear(t213 - 0.1); bars2To([0, 0, 0], t213 - 0.1, 0.3); O([tot2V, ...wl2], t213 - 0.1, 0.3); wl2 = [];
  hlF2.forEach(h => O(h, t213 - 0.1, 0.3));
  rowTagSet('river’s row', t213 + 0.1); gridHlSet(1, t213 + 0.1);
  sLoad(1, t213 + 0.3); bars2To([0.08 / 0.36, 1, 0.08 / 0.36], t213 + 1.0);
  const hlF3 = fHl2(2); hlF3.forEach(h => F(h, tRdv - 0.4, 0.3));
  tag2Set('\\div\\sqrt{3}', tRdv - 0.3, true);
  { const L = wl2Set([{ s: '0.36' }, { tex: '\\div' }, { s: '1.732' }, { s: '=' }, { s: '0.208', col: P.green, w: 700 }], tRdv - 0.2); flyIn(pF, L[0], TXc[1], BYt + 4, tRdv - 0.2, 0.5); writeParts(L.slice(1), tRdv + 0.7, 0.12, 0.25); }
  sSet(1, '0.208', tRdv + 1.4); sAll(['0.046', '0.208', '0.046'], tRdv + 1.7, 1);
  hlF3.forEach(h => O(h, tRex - 0.4, 0.3));
  const hlF4 = fHl2([0, 3]); hlF4.forEach(h => F(h, tRex - 0.3, 0.3));
  tag2Set('e^{x}', tRex - 0.3, true);
  { const L = wl2Set([{ tex: 'e^{0.208}' }, { s: '=' }, { s: '1.231', col: P.green, w: 700 }], tRex - 0.2); flyIn(pF, L[0], TXc[1], BYt + 4, tRex - 0.2, 0.5); writeParts(L.slice(1), tRex + 0.7, 0.15, 0.25); }
  sSet(1, '1.231', tRex + 1.3); sAll(['1.047', '1.231', '1.047'], tRex + 1.6, 1); bars2To([1.047 / 1.231, 1, 1.047 / 1.231], tRex + 1.6);
  tag2Set('total', tRto - 0.3, false);
  { const L = wl2Set([{ s: '1.047' }, { s: '+' }, { s: '1.231' }, { s: '+' }, { s: '1.047' }, { s: '=' }, { s: '3.325', col: P.green, w: 700 }], tRto - 0.2); [0, 2, 4].forEach((k, n) => flyIn(pF, L[k], TXc[n], BYt + 4, tRto - 0.2 + n * 0.2, 0.5)); writeParts([L[1], L[3], L[5], L[6]], tRto + 0.7, 0.12, 0.25);
    pF.mv(L[6], tRto + 1.4, 0.55, 1560 - L[6].wid / 2, BYt); O(L[6], tRto + 1.9, 0.15); }
  tot2V = label(pF, '3.325', 1560, BYt, P.green, 32, 'middle', 700); F(tot2V, tRto + 1.85, 0.25);
  tag2Set('\\div\\ \\text{total}', tRto + 2.2, true);
  { const L = wl2Set([{ s: '1.231' }, { tex: '\\div' }, { s: '3.325' }, { s: '=' }, { s: '0.370', col: P.green, w: 700 }], tRto + 2.3); flyIn(pF, L[0], TXc[1], BYt + 4, tRto + 2.3, 0.45); W(L[1], tRto + 3.05, 0.2); flyIn(pF, L[2], 1560, BYt, tRto + 3.05, 0.45); writeParts(L.slice(3), tRto + 3.8, 0.12, 0.25); }
  sSet(1, '0.370', tRto + 4.3); sAll(['0.315', '0.370', '0.315'], tRto + 4.6, 1);
  { const L = wl2Set([{ s: '≈ 31%, 37%, 31%', col: P.soft }], Math.max(tR31 - 0.5, tRto + 4.65)); W(L[0], Math.max(tR31 - 0.5, tRto + 4.65), 0.5); }
  toShares(1, ['0.315', '0.370', '0.315'], tR31 + 0.1);
  /* bank: the same steps, as in T01 */
  const t214 = bt('c2_14').t, tB68 = a('b68');
  sClear(t214 - 0.1); bars2To([0, 0, 0], t214 - 0.1, 0.3); O([tot2V, ...wl2], t214 - 0.1, 0.3); wl2 = [];
  hlF4.forEach(h => O(h, t214 - 0.1, 0.3));
  rowTagSet('bank’s row', t214 + 0.1); gridHlSet(2, t214 + 0.1);
  sLoad(2, t214 + 0.2); bars2To([0.72 / 3.24, 1, 0.72 / 3.24], t214 + 0.9);
  tag2Set('\\div\\sqrt{3}', t214 + 1.3, true);
  sAll(['0.416', '1.871', '0.416'], t214 + 1.7);
  tag2Set('e^{x}', t214 + 2.6, true);
  sAll(['1.516', '6.495', '1.516'], t214 + 3.0); bars2To([1.516 / 6.495, 1, 1.516 / 6.495], t214 + 3.0);
  tag2Set('total', t214 + 3.8, false);
  { const L = wl2Set([{ s: '1.516 + 6.495 + 1.516 =' }, { s: '9.527', col: P.green, w: 700 }], t214 + 3.9); writeParts(L, t214 + 3.9, 0.3, 0.4); pF.mv(L[1], t214 + 4.7, 0.5, 1560 - L[1].wid / 2, BYt); O(L[1], t214 + 5.15, 0.15); }
  tot2V = label(pF, '9.527', 1560, BYt, P.green, 32, 'middle', 700); F(tot2V, t214 + 5.1, 0.25);
  tag2Set('\\div\\ \\text{total}', t214 + 5.3, true);
  { const L = wl2Set([{ s: '6.495' }, { tex: '\\div' }, { s: '9.527' }, { s: '=' }, { s: '0.682', col: P.green, w: 700 }], t214 + 5.4); flyIn(pF, L[0], TXc[1], BYt + 4, t214 + 5.4, 0.45); W(L[1], t214 + 6.0, 0.2); flyIn(pF, L[2], 1560, BYt, t214 + 6.0, 0.45); writeParts(L.slice(3), t214 + 6.6, 0.12, 0.25); }
  sSet(1, '0.682', tB68 - 0.3); sAll(['0.159', '0.682', '0.159'], tB68 - 0.1, 1);
  toShares(2, ['0.159', '0.682', '0.159'], tB68 + 0.4);
  /* 2.15 · a key is made from its own word's vector alone */
  const t215 = bt('c2_15').t, tAl = a('alone');
  O([...sBox, ...bars2, ...tag2, rowTag, gHl, tot2, tot2L, tot2V, ...wl2, ...RB2.cur, ...RB2.prev], t215 - 0.2, 0.4);
  const kEq = WN.map((s, j) => T(pF, '\\textcolor{#4F63E6}{k} = x\\,W_k', TXc[j], 266, 26));
  kEq.forEach((m, j) => W(m, tAl - 0.8 + j * 0.2, 0.5)); kP2.forEach((m, j) => pulse(m, tAl - 0.4 + j * 0.2, 1.1));
  grp(kEq, 'kEq');
  /* 2.16 · it doesn't depend on who's asking: three notes visit k(river); it stays 0.9 */
  const tAsk = a('asking');
  [0, 1, 2].forEach(i => {
    const tv = tAsk - 0.8 + i * 1.0;
    const nt = gm(pF, noteG('', C_Q, 44, 34, -6), C_Q, QPXt + 90, TYr[i] - 20);
    F(nt, tv, 0.25); pF.mv(nt, tv + 0.25, 0.5, TXc[1] - 86, KPYt + 4); O(nt, tv + 0.85, 0.2);
    pulse(kVals[1][0], tv + 0.75, 1.3);
  });

  /* ================= page (1,1) · chapter 2 · the keys test, then the third matrix (2.17-2.27) ================= */
  const pG = pg(1, 1), t217 = bt('c2_17').t;
  go(1, 1, t217 - 0.9, 1.1);
  pageTitle(pG, '2 · The third matrix', t217 - 0.2);
  stepStrip(pG, 1, t217 + 1.0);
  const M3 = ['Wq', 'Wk'].map((s, i) => gm(pG, hatchG(170, 64, s, [C_Q, C_K][i], 28), P.ink, 640 + i * 220, 158));
  const slot3 = pG(ink(rrect(1080, 158, 170, 64, { ov: 1 }), P.soft, 2.5, { dash: '9 9' }), 0, 0);
  const qmk = label(pG, '?', 1165, 190, C_V, 48);
  const tIn = a('instead');
  W(M3[0], t217 + 0.2, 0.4); W(M3[1], t217 + 0.4, 0.4); W(slot3, tIn - 0.8, 0.5); W(qmk, tIn - 0.2, 0.4);
  grp(M3, 'm3a');
  /* the keys test: two phrases side by side, each with its keys, scores and shares */
  const LX = 480, RX = 1440, CXs = cx => [cx - 150, cx, cx + 150], KTY = { w: 330, k: 390, s: 440, h: 490 };
  const rowLabs = cx => [['key', KTY.k, C_K], ['score', KTY.s, P.ink], ['share', KTY.h, P.ink]].map(([s, y, c]) => txt(pG, s, cx - 236, y, 22, c, 'end'));
  const ktAll = [];
  /* 2.18 · the river phrase: keys from the top edge, scores from bank's row, shares from the shares table */
  const t218 = bt('c2_18').t, tK068 = a('k068');
  const wL = WN.map((s, j) => label(pG, s, CXs(LX)[j], KTY.w, P.ink, 32, 'middle', 700));
  wL.forEach((m, j) => W(m, t218 + 0.1 + j * 0.12, 0.35)); grp(wL, 'wL');
  const rlL = rowLabs(LX); rlL.forEach((m, i) => W(m, t218 + 0.2 + i * 0.1, 0.3)); grp(rlL, 'rlL');
  const kL = KV.map((s, j) => label(pG, s, CXs(LX)[j], KTY.k, C_K, 28, 'middle', 700));
  const sL = SCS[2].map((s, j) => label(pG, s, CXs(LX)[j], KTY.s, P.ink, 28, 'middle', 400));
  const hL = ['0.159', '0.682', '0.159'].map((s, j) => label(pG, s, CXs(LX)[j], KTY.h, P.ink, 28, 'middle', 400));
  kL.forEach((m, j) => flyC(pG, m, TXc[j] - 46 + DX, KVYt + 17, t218 + 0.3 + j * 0.08, 0.7));
  sL.forEach((m, j) => flyC(pG, m, TXc[j] + DX, TYr[2] + 16, t218 + 0.5 + j * 0.08, 0.7));
  hL.forEach((m, j) => flyC(pG, m, SHXc[j] + DX, TYr[2], t218 + 0.7 + j * 0.08, 0.7));
  grp([...kL, ...sL, ...hL], 'ktIn');
  const kb1 = wline(pG, [{ s: '0.159 × 0.2' }, { s: '+' }, { s: '0.682 × 0.9' }, { s: '+' }, { s: '0.159 × 0.2' }], LX, 570, 28);
  const kb2 = wline(pG, [{ s: '=' }, { s: '0.032 + 0.614 + 0.032' }, { s: '=' }, { s: '0.678', col: P.green, w: 700 }], LX, 620, 28);
  writeParts(kb1, Math.min(t218 + 1.6, tK068 - 1.4), 0.12, 0.3); writeParts(kb2, tK068 - 0.7, 0.15, 0.3);
  grp(kb1, 'kb1'); grp(kb2, 'kb2');
  const kRes1 = label(pG, 'bank gets (0.678, 0, 0)', LX, 690, P.ink, 32);
  W(kRes1, tK068 + 0.3, 0.7);
  ktAll.push(...wL, ...rlL, ...kL, ...sL, ...hL, ...kb1, ...kb2, kRes1);
  /* 2.19 · the loan phrase: loan's row is from T01's table; its key is 0.9 too */
  const t219 = bt('c2_19').t, tLk9 = a('lk09');
  const wR = ['the', 'bank', 'loan'].map((s, j) => label(pG, s, CXs(RX)[j], KTY.w, P.ink, 32, 'middle', 700));
  wR.forEach((m, j) => W(m, t219 + 0.3 + j * 0.12, 0.35)); grp(wR, 'wR');
  const rlR = rowLabs(RX); rlR.forEach((m, i) => W(m, t219 + 0.4 + i * 0.1, 0.3)); grp(rlR, 'rlR');
  const kR = ['0.2', '0.2', '0.9'].map((s, j) => label(pG, s, CXs(RX)[j], KTY.k, C_K, 28, 'middle', 700));
  flyC(pG, kR[0], CXs(LX)[0], KTY.k, t219 + 1.0, 0.8); flyC(pG, kR[1], CXs(LX)[2], KTY.k, t219 + 1.1, 0.8); grp([kR[0], kR[1]], 'kR01');
  const lnA = txt(pG, 'loan’s row, from T01’s table: (0.9, 0, 0.1)', RX, 570, 26);
  W(lnA, t219 + 3.0, 1.0);
  const lnB = wline(pG, [{ s: 'k(loan) =' }, { s: '0.9 × 1' }, { s: '+' }, { s: '0 × 1', col: zc }, { s: '+' }, { s: '0.1 × 0', col: zc }, { s: '=' }, { s: '0.9', col: C_K, w: 700 }], RX, 620, 28);
  writeParts(lnB.slice(0, 7), tLk9 - 3.4, 0.3); W(lnB[7], tLk9 - 0.2, 0.4);
  dropTo(pG, lnB[7], CXs(RX)[2], KTY.k, tLk9 + 0.4); F(kR[2], tLk9 + 0.85, 0.25);
  O([lnA, ...lnB.slice(0, 7)], tLk9 + 0.9, 0.35);
  grp(lnB, 'lnB');
  /* 2.20 · bank's query is still 3.6: the same shares in a new order, the same blend */
  const t220 = bt('c2_20').t, tAg = a('again');
  const scR = wline(pG, [{ s: '3.6 × 0.2 = 0.72' }, { s: '·', col: P.soft }, { s: '3.6 × 0.2 = 0.72' }, { s: '·', col: P.soft }, { s: '3.6 × 0.9 = 3.24' }], RX, 570, 26);
  const sR = ['0.72', '0.72', '3.24'].map((s, j) => label(pG, s, CXs(RX)[j], KTY.s, P.ink, 28, 'middle', 400));
  [0, 2, 4].forEach((ix, n) => { if (n) W(scR[ix - 1], t220 + 2.3 + n * 1.1, 0.2); W(scR[ix], t220 + 2.4 + n * 1.1, 0.6); F(sR[n], t220 + 3.0 + n * 1.1, 0.3); });
  grp(scR, 'scR'); grp(sR, 'sR');
  const hR = ['0.159', '0.159', '0.682'].map((s, j) => label(pG, s, CXs(RX)[j], KTY.h, P.ink, 28, 'middle', 400));
  flyC(pG, hR[0], CXs(LX)[0], KTY.h, t220 + 6.8, 0.9); flyC(pG, hR[1], CXs(LX)[2], KTY.h, t220 + 6.9, 0.9); flyC(pG, hR[2], CXs(LX)[1], KTY.h, t220 + 7.0, 0.9);
  grp(hR, 'hR');
  O(scR, t220 + 7.4, 0.35);
  const kb3 = wline(pG, [{ s: '0.159 × 0.2' }, { s: '+' }, { s: '0.159 × 0.2' }, { s: '+' }, { s: '0.682 × 0.9' }], RX, 570, 28);
  const kb4 = wline(pG, [{ s: '=' }, { s: '0.032 + 0.032 + 0.614' }, { s: '=' }, { s: '0.678', col: P.green, w: 700 }], RX, 620, 28);
  writeParts(kb3, t220 + 8.2, 0.15, 0.3); writeParts(kb4, tAg - 1.6, 0.2, 0.3);
  grp(kb3, 'kb3'); grp(kb4, 'kb4');
  const kRes2 = label(pG, 'bank gets (0.678, 0, 0)', RX, 690, P.ink, 32);
  W(kRes2, tAg - 0.4, 0.7);
  /* 2.21 · the same vector for both banks */
  const t221 = bt('c2_21').t;
  const eqO = label(pG, '=', 960, 690, C_TR, 60);
  const sameL = label(pG, 'same blend, two meanings', 960, 760, C_TR, 32);
  const keyNote = txt(pG, 'in the toy a key is one number; at real size it’s 64, but it’s still built to be found, not read', 960, 806, 22, P.soft);
  W(eqO, t221 + 0.3, 0.4); W(sameL, t221 + 0.8, 0.9); W(keyNote, a('meaning') - 1.4, 1.2);
  ktAll.push(...wR, ...rlR, ...kR, ...lnB, ...sR, ...hR, ...kb3, ...kb4, kRes2, eqO, sameL, keyNote);
  /* 2.22 · the third matrix: Wv passes the first two numbers and drops the third */
  const t222 = bt('c2_22').t, tThd = a('third'), tV0 = a('v0');
  O(ktAll, t222 - 0.2, 0.4);
  const kRem = [txt(pG, 'hand over the keys:', 1500, 330, 24, P.soft), txt(pG, 'both banks get (0.678, 0, 0)', 1500, 366, 24, P.soft)];
  kRem.forEach((m, i) => W(m, t222 + 0.4 + i * 0.3, 0.6)); grp(kRem, 'kRem');
  O([slot3, qmk], t222 + 0.4, 0.3);
  const M3v = gm(pG, hatchG(170, 64, 'Wv', C_V, 28), P.ink, 1080, 158);
  W(M3v, t222 + 0.6, 0.6);
  const fV = T(pG, '\\textcolor{#7A8F1C}{V} = X\\,\\textcolor{#7A8F1C}{W_v}', 316, 290, 36);
  const WVM = matrix(pG, 220, 360, [['1', '0', '0'], ['0', '1', '0'], ['0', '0', '0']], 64, 48, { rlab: ['1', '2', '3'], lz: 22, heads: ['slot 1', 'slot 2', 'slot 3'], hz: 20, col: C_V, hatch: true, ccol: mcol, w: 700 });
  const WVn = label(pG, 'Wv, toy', 316, 535, C_V, 26, 'middle', 700);
  const WVt = txt(pG, 'real size: 512 × 64, like Wq and Wk', 316, 572, 22, P.soft);
  W(fV, t222 + 0.8, 0.8); showM(WVM, t222 + 1.6, 0.1, 'wv'); W(WVn, t222 + 2.0, 0.4); W(WVt, t222 + 2.6, 0.8);
  const hv1 = cellHl(pG, WVM, 0, 0, P.hlO), hv2 = cellHl(pG, WVM, 1, 1, P.hlO), hv3 = rowHl(pG, WVM, 2, '#D8D8D0');
  F(hv1, tThd - 2.6, 0.3); F(hv2, tThd - 2.3, 0.3); F(hv3, tThd - 0.3, 0.3); grp([hv1, hv2], 'hv12');
  /* each value worked beside its row: river first, aloud; then the others */
  const VW = [['the', '(0.1, 0.1, 0)', '(0.1, 0.1, 0)'], ['river', '(0, 0.9, 0.1)', '(0, 0.9, 0)'], ['bank', '(0.1, 0.1, 0.9)', '(0.1, 0.1, 0)'], ['loan', '(0.9, 0, 0.1)', '(0.9, 0, 0)']];
  const VLY = [360, 410, 460, 510];
  const VL = VW.map(([w, x, v], i) => wline(pG, [{ s: w + ':' }, { s: x }, { tex: '\\to' }, { s: v, col: C_V, w: 700 }], 880, VLY[i], 28));
  writeParts(VL[1].slice(0, 3), tThd + 0.6, 0.4, 0.4); W(VL[1][3], tV0 - 0.4, 0.5);
  [0, 2, 3].forEach((i, n) => writeParts(VL[i], tV0 + 0.4 + n * 0.3, 0.08, 0.25));
  VL.forEach((L, i) => grp(L, 'VL' + i));
  /* 2.23 · hand over the values instead: one line per word, one phrase at a time */
  const t223 = bt('c2_23').t, tVc = a('vectors2');
  const bHead = [label(pG, 'the river bank', LX, 640, P.ink, 28), label(pG, 'the bank loan', RX, 640, P.ink, 28)];
  const BLY = [690, 735, 780], BSY = 840;
  const blendCol = (cx, rows, vIdx, sum, t0, gap) => {
    const Ls = rows.map(([sh, v, out], k) => wline(pG, [{ s: sh }, { tex: '\\times' }, { s: v }, { s: '=' }, { s: out }], cx, BLY[k], 26));
    Ls.forEach((L, k) => { const t = t0 + k * gap; W(L[0], t, 0.25); W(L[1], t + 0.1, 0.2); flyIn(pG, L[2], VL[vIdx[k]][3].mid, VLY[vIdx[k]], t + 0.1, 0.45); W(L[3], t + 0.6, 0.15); W(L[4], t + 0.7, 0.3); grp(L, 'bl' + cx + k); });
    const rule = pG(ink(rl(cx - 200, BSY - 28, cx + 200, BSY - 30, { bow: 0.002 }), P.ink, 3), 0, 0);
    const s = label(pG, sum, cx, BSY, C_Z, 32, 'middle', 700);
    return { Ls, rule, s };
  };
  W(bHead[0], t223, 0.4);
  const bcL = blendCol(LX, [['0.159', '(0.1, 0.1, 0)', '(0.016, 0.016, 0)'], ['0.682', '(0, 0.9, 0)', '(0, 0.614, 0)'], ['0.159', '(0.1, 0.1, 0)', '(0.016, 0.016, 0)']], [0, 1, 2], '(0.032, 0.646, 0)', t223 + 0.2, 0.5);
  W(bcL.rule, tVc - 1.2, 0.3); W(bcL.s, tVc - 0.9, 0.6);
  W(bHead[1], tVc - 0.6, 0.4);
  const bcR = blendCol(RX, [['0.159', '(0.1, 0.1, 0)', '(0.016, 0.016, 0)'], ['0.159', '(0.1, 0.1, 0)', '(0.016, 0.016, 0)'], ['0.682', '(0.9, 0, 0)', '(0.614, 0, 0)']], [0, 2, 3], '(0.646, 0.032, 0)', tVc - 0.4, 0.5);
  W(bcR.rule, tVc + 1.1, 0.3); W(bcR.s, tVc + 1.4, 0.6);
  /* 2.24 · read against rows we know */
  const tV58r = a('v58r'), tV58l = a('v58l');
  const rdHead = [label(pG, 'compared with rows we know:', LX, 874, P.soft, 22, 'middle', 700), label(pG, 'compared with rows we know:', RX, 874, P.soft, 22, 'middle', 700)];
  W(rdHead[0], tV58r - 2.6, 0.8); W(rdHead[1], tV58l - 3.2, 0.8);
  const rdLine = (cx, y, parts, t, tRes) => { const L = wline(pG, parts, cx, y, 24); writeParts(L.slice(0, -1), t, 0.25, 0.3); W(L[L.length - 1], tRes, 0.4); grp(L, 'rdl' + cx + y); return L; };
  const rd1 = rdLine(LX, 912, [{ s: '· river (0, 0.9, 0.1) =' }, { s: '0 + 0.581 + 0' }, { s: '=' }, { s: '0.581', col: P.green, w: 700 }], tV58r - 1.6, tV58r - 0.2);
  const rd2 = rdLine(LX, 956, [{ s: '· loan (0.9, 0, 0.1) =' }, { s: '0.029 + 0 + 0' }, { s: '=' }, { s: '0.029' }], tV58r + 0.6, tV58r + 1.5);
  const rd3 = rdLine(RX, 912, [{ s: '· loan (0.9, 0, 0.1) =' }, { s: '0.581 + 0 + 0' }, { s: '=' }, { s: '0.581', col: P.green, w: 700 }], tV58l - 2.8, tV58l - 1.6);
  const rd4 = rdLine(RX, 956, [{ s: '· river (0, 0.9, 0.1) =' }, { s: '0 + 0.029 + 0' }, { s: '=' }, { s: '0.029' }], tV58l - 1.3, tV58l - 0.4);
  const neqV = T(pG, '\\neq', 960, BSY, 60, P.green);
  W(neqV, tV58l + 0.2, 0.4);
  /* 2.25 · the label is tuned to be found; the contents, to be useful */
  const t225 = bt('c2_25').t, tFd = a('found');
  O(kRem, t225, 0.3);
  const kvL = [label(pG, 'k(river): 0.9, one number to match on', 1500, 330, C_K, 26, 'middle', 700), label(pG, 'v(river): (0, 0.9, 0), contents to use', 1500, 380, C_V, 26, 'middle', 700)];
  W(kvL[0], t225 + 0.4, 0.9); W(kvL[1], tFd - 1.6, 0.9);
  /* 2.26 · takeaway */
  const t226 = bt('c2_26').t;
  const blendAll = [...rdHead, ...bHead, ...bcL.Ls.flat(), bcL.rule, bcL.s, ...bcR.Ls.flat(), bcR.rule, bcR.s, ...rd1, ...rd2, ...rd3, ...rd4, neqV];
  O(blendAll, t226 - 0.1, 0.4);
  const tkG = take(pG, ['Wq writes the request, Wk writes the label,', 'Wv writes what gets handed over.'], 960, 780, 1100, t226 + 0.1);
  /* 2.27 · all three start as random noise */
  const t227 = bt('c2_27').t;
  O(tkG, t227, 0.4);
  const noiseM = [...M3, M3v].map((m, i) => pG(ink(scribble(640 + i * 220, 158, 170, 64, 12, i + 2), P.ink, 2.5), 0, 0));
  noiseM.forEach((m, i) => W(m, a('work') - 1.2 + i * 0.2, 0.6));
  grp(noiseM, 'noiseM');

  /* ================= page (0,1) · chapter 3 · two hires, and the nudges (3.1-3.12) ================= */
  const pH = pg(0, 1), t3 = bt('c3_01').t;
  go(0, 1, t3 - 1.1, 1.1);
  pageTitle(pH, '3 · Different jobs, different notebooks', t3 - 0.3);
  const tUp = a('update');
  stepStrip(pH, [3, 4], tUp - 0.6, P.hlO);
  const trainTagH = label(pH, 'training only', SX(3) + 60, SY + 34, C_TR, 22);
  W(trainTagH, tUp + 0.2, 0.5);
  const DXs = [470, 1450], NBW = 240, NBH = 170, NBY = 470;
  const hires = DXs.map(x => gm(pH, personG(), P.ink, x - 120, 560));
  hires.forEach((m, i) => W(m, a('hires') - 0.3 + i * 0.3, 0.7)); grp(hires, 'hires');
  const books = DXs.map(x => gm(pH, hatchG(NBW, NBH, '', P.ink), P.ink, x, NBY));
  const bookScr = DXs.map((x, i) => pH(ink(scribble(x, NBY, NBW, NBH, 30, i + 5), P.ink, 2.5), 0, 0));
  books.forEach((m, i) => W(m, a('notebook') - 0.3 + i * 0.2, 0.6)); bookScr.forEach((m, i) => W(m, a('notebook') + 0.1 + i * 0.2, 0.6));
  grp(books, 'books'); grp(bookScr, 'bookScr');
  const signs = [['Requests', C_Q, 'Wq'], ['Catalog', C_K, 'Wk']].map(([s, c, w], i) => [label(pH, s, DXs[i] + NBW / 2, NBY - 44, c, 40), label(pH, w, DXs[i] + NBW / 2, NBY + NBH + 34, c, 30)]);
  const tDk = a('desk');
  W(signs[0][0], tDk - 2.4, 0.6); W(signs[0][1], tDk - 2.1, 0.4); W(signs[1][0], tDk - 0.3, 0.6); W(signs[1][1], tDk + 0.5, 0.4);
  grp(signs[0], 'sign0'); grp(signs[1], 'sign1');
  /* 3.5 · one score wants more */
  const tMo = a('more');
  const cellF = gm(pH, (() => { const g = E('g'); E('rect', { x: -100, y: -48, width: 200, height: 96, rx: 6, fill: C_Q, 'fill-opacity': 0.5, stroke: 'none', 'data-nd': '' }, g); pathEl(g, rrect(-100, -48, 200, 96, { ov: 1 }), 2.8); txtEl(g, 0, 0, '3.24', 36, P.ink, 700); txtEl(g, 0, 72, 'bank to river', 26, P.ink, 400); return g; })(), P.ink, 960, 380);
  F(cellF, tMo - 0.8, 0.4);
  const upA = arrowM(pH, 1090, 410, 1090, 310, C_FAIL, 5, { head: 18 });
  W(upA, tMo - 0.1, 0.5);
  const wishT = txt(pH, 'where that wish comes from: T04 and T05', 960, 498, 22, P.soft);
  W(wishT, bt('c3_05').end - 1.6, 0.7);
  /* 3.6 · the score's two inputs, with the braces from chapter 1 */
  const t36 = bt('c3_06').t, tWk = a('wk');
  const SF2 = wline(pH, [{ tex: 's =' }, { tex: '(x_{\\text{bank}}\\,\\textcolor{#E0218A}{W_q})' }, { tex: '\\cdot' }, { tex: '(x_{\\text{river}}\\,\\textcolor{#4F63E6}{W_k})' }], 960, 196, 36);
  writeParts(SF2, t36 + 0.2, Math.max(0.3, (tWk - t36 - 0.6) / 4), 0.6); grp(SF2, 'SF2');
  const brQ2 = pH(ink(braceD(SF2[1].lx + 4, SF2[1].lx + SF2[1].wid - 4, 226, 10), C_Q, 3), 0, 0);
  const brK2 = pH(ink(braceD(SF2[3].lx + 4, SF2[3].lx + SF2[3].wid - 4, 226, 10), C_K, 3), 0, 0);
  const sQ = label(pH, 'bank’s query: 3.6', SF2[1].mid, 272, C_Q, 24, 'middle', 700), sK = label(pH, 'river’s key: 0.9', SF2[3].mid, 272, C_K, 24, 'middle', 700);
  W(brQ2, tWk - 0.9, 0.3); W(sQ, tWk - 0.7, 0.4); W(brK2, tWk - 0.1, 0.3); W(sK, tWk + 0.1, 0.4);
  grp([brQ2, sQ], 'sQ'); grp([brK2, sK], 'sK');
  /* 3.7 · two ways in */
  const tLb = a('label');
  O(wishT, tLb - 2.4, 0.3);
  const nbk = gm(pH, noteG('', C_Q, 70, 54), C_Q, 760, 380), tRv = gm(pH, tagG('river', C_K, 120), C_K, 1180, 380);
  F(nbk, tLb - 1.8, 0.3, { dy: -6 }); F(tRv, tLb - 0.5, 0.3, { dy: 6 });
  const pipeQ = pH(ink(`M860 380L800 380M752 414Q740 470 ${DXs[0] + NBW + 10} ${NBY + 24}`, C_FAIL, 4), 0, 0);
  const pipeK = pH(ink(`M1060 380L1120 380M1240 380Q1700 330 ${DXs[1] + NBW - 26} ${NBY - 6}`, C_FAIL, 4), 0, 0);
  W(pipeQ, tLb - 1.4, 0.7); W(pipeK, tLb - 0.2, 0.7);
  grp([nbk, tRv], 'waysIn'); grp([pipeQ, pipeK], 'pipes');
  /* 3.8 · real size first: each notebook (and each nudge) a 512 x 64 sheet; ours are 3 x 3 */
  const t38 = bt('c3_08').t, tNb3 = a('nb3');
  dim([pipeQ, pipeK, nbk, tRv, upA], t38 + 0.2, 0.25); dim(bookScr, t38 + 0.2, 0.12);
  const sheetsG = () => { const g = E('g'); E('rect', { x: -100, y: -64, width: 200, height: 128, rx: 4, fill: '#FFFFFC', 'fill-opacity': 0.9, stroke: 'none', 'data-nd': '' }, g); pathEl(g, gridD(-100, -64, 200, 128, 32, 20), 0.7, P.soft, { opacity: 0.55 }); pathEl(g, rrect(-100, -64, 200, 128, { ov: 1 }), 2); return g; };
  const sheetsH = DXs.map(x => gm(pH, sheetsG(), P.ink, x + NBW / 2, NBY + NBH / 2));
  const sheetsL = DXs.map((x, i) => label(pH, '512 × 64', x + NBW / 2, NBY + NBH / 2, [C_Q, C_K][i], 34, 'middle', 700));
  sheetsH.forEach((m, i) => F(m, t38 + 0.6 + i * 0.2, 0.4)); sheetsL.forEach((m, i) => W(m, t38 + 0.8 + i * 0.2, 0.5));
  const sheetCap = txt(pH, 'each nudge: a 512 × 64 sheet of numbers', 990, 584, 22, P.soft);
  W(sheetCap, t38 + 4.0, 0.9);
  grp([...sheetsH, ...sheetsL], 'sheets');
  O([...sheetsH, ...sheetsL, sheetCap, ...bookScr], tNb3 - 1.4, 0.4);
  const WQ3 = matrix(pH, DXs[0] + 24, NBY + 16, [['0', '0', '0'], ['0', '0', '0'], ['4', '0', '0']], 64, 46, { col: C_Q, ccol: mcol, w: 700, z: 28 });
  const WK3 = matrix(pH, DXs[1] + 24, NBY + 16, [['1', '0', '0'], ['1', '0', '0'], ['0', '0', '0']], 64, 46, { col: C_K, ccol: mcol, w: 700, z: 28 });
  showM(WQ3, tNb3 - 1.0, 0.08, 'toyM'); showM(WK3, tNb3 - 0.8, 0.08, 'toyM');
  const oursN = label(pH, 'ours: 3 × 3', 990, 584, C_TR, 28, 'middle', 700);
  W(oursN, tNb3 - 0.3, 0.5);
  /* 3.9-3.10 · one entry first: Wq's 4, in row 3 */
  const t39 = bt('c3_09').t, tB09 = a('b09');
  O(oursN, t39, 0.3);
  const hQ4 = cellHl(pH, WQ3, 2, 0, P.hlO); F(hQ4, t39 + 1.0, 0.3); pulse(WQ3.cells[2][0], t39 + 1.1, 1.3);
  const BR = matrix(pH, 880, 494, [XV[2]], 60, 40, { z: 24, col: P.ink, ccol: xcol });
  const BRl = label(pH, 'bank’s row', 866, 514, P.ink, 24, 'end', 400);
  showM(BR, t39 + 3.4, 0.05, 'br'); W(BRl, t39 + 3.5, 0.4);
  const cap1 = txt(pH, 'bank’s query grows by 0.9 × the little', 990, 584, 24);
  W(cap1, tB09 - 3.8, 1.2);
  const hB9 = cellHl(pH, BR, 0, 2, P.hlO); F(hB9, tB09 - 0.4, 0.3);
  const t310 = bt('c3_10').t, tE081 = a('e081');
  pulse(sK, t310 + 2.4, 1.15);
  const cap2 = wline(pH, [{ s: 'the score grows by' }, { s: '0.9 × 0.9' }, { s: '=' }, { s: '0.81', col: C_TR, w: 700 }, { s: '× the little' }], 990, 634, 26);
  writeParts(cap2.slice(0, 3), tE081 - 2.4, 0.4, 0.4); W(cap2[3], tE081 - 0.2, 0.4); W(cap2[4], tE081 + 0.2, 0.4);
  grp(cap2, 'cap2');
  const cap3 = txt(pH, 'so this entry’s nudge is 0.81', 990, 682, 22, P.soft);
  W(cap3, tE081 + 0.8, 0.7);
  /* 3.11 · every entry works the same way: the nudge to Wq is bank's row times river's key */
  const t311 = bt('c3_11').t, tLk = a('looker');
  O([hQ4], t311, 0.3);
  const NMX = [DXs[0] + 96, DXs[1] + 96], NMY = 770;
  const dQ = matrix(pH, NMX[0], NMY, [['0.09', '0', '0'], ['0.09', '0', '0'], ['0.81', '0', '0']], 64, 44, { z: 24, col: C_TR, ccol: (i, j, v) => v === '0' ? P.soft : C_TR, w: 700 });
  const dK = matrix(pH, NMX[1], NMY, [['0', '0', '0'], ['3.24', '0', '0'], ['0.36', '0', '0']], 64, 44, { z: 24, col: C_TR, ccol: (i, j, v) => v === '0' ? P.soft : C_TR, w: 700 });
  const dQe = T(pH, 'dW_q = x_{\\text{bank}}^{\\top}\\, k_{\\text{river}}', NMX[0] + 96, 728, 28);
  W(dQe, t311 + 0.3, 0.9); W(dQ.frame, t311 + 0.6, 0.5);
  const prQ = ['0.1 × 0.9 =', '0.1 × 0.9 =', '0.9 × 0.9 ='].map((s, i) => txt(pH, s, NMX[0] - 14, dQ.cy(i), 22, P.ink, 'end'));
  W(prQ[0], tLk - 6.0, 0.4); F(dQ.cells[0][0], tLk - 5.6, 0.3);
  W(prQ[1], tLk - 5.4, 0.4); F(dQ.cells[1][0], tLk - 5.0, 0.3);
  W(prQ[2], tLk - 4.6, 0.4); flyC(pH, dQ.cells[2][0], cap2[3].mid, 634, tLk - 4.3, 0.6); O(cap2[3], tLk - 4.2, 0.2);
  [1, 2].forEach(j => [0, 1, 2].forEach(i => F(dQ.cells[i][j], tLk - 3.4 + j * 0.1, 0.3)));
  grp(prQ, 'prQ'); grp([dQ.cells[0][1], dQ.cells[1][1], dQ.cells[2][1], dQ.cells[0][2], dQ.cells[1][2], dQ.cells[2][2]], 'dQz');
  const shQ = label(pH, 'the shape of bank’s row', NMX[0] + 96, 935, C_Q, 24, 'middle', 700);
  const dvQ = T(pH, '\\partial s / \\partial W_q = x_i^{\\top} k_j', NMX[0] + 96, 978, 24, P.soft);
  W(shQ, tLk - 1.2, 0.8); W(dvQ, tLk + 0.1, 0.7);
  /* 3.12 · the nudge to Wk, from the other side: river's row times bank's query */
  const t312 = bt('c3_12').t, tTg = a('target');
  O([BR.frame, ...BR.cells.flat(), BRl, hB9, cap1, ...cap2, cap3], t312, 0.4);
  pulse(sQ, t312 + 2.4, 1.15);
  const dKe = T(pH, 'dW_k = x_{\\text{river}}^{\\top}\\, q_{\\text{bank}}', NMX[1] + 96, 728, 28);
  W(dKe, t312 + 0.3, 0.9); W(dK.frame, t312 + 0.6, 0.5);
  const prK = ['0 × 3.6 =', '0.9 × 3.6 =', '0.1 × 3.6 ='].map((s, i) => txt(pH, s, NMX[1] - 14, dK.cy(i), 22, i ? P.ink : P.soft, 'end'));
  [0, 1, 2].forEach(i => { W(prK[i], tTg - 6.4 + i * 0.8, 0.4); F(dK.cells[i][0], tTg - 6.0 + i * 0.8, 0.3); });
  [1, 2].forEach(j => [0, 1, 2].forEach(i => F(dK.cells[i][j], tTg - 3.6 + j * 0.1, 0.3)));
  grp(prK, 'prK'); grp([dK.cells[0][1], dK.cells[1][1], dK.cells[2][1], dK.cells[0][2], dK.cells[1][2], dK.cells[2][2]], 'dKz');
  const shK = label(pH, 'the shape of river’s row', NMX[1] + 96, 935, C_K, 24, 'middle', 700);
  const dvK = T(pH, '\\partial s / \\partial W_k = x_j^{\\top} q_i', NMX[1] + 96, 978, 24, P.soft);
  W(shK, tTg - 1.2, 0.8); W(dvK, tTg + 0.1, 0.7);

  /* ================= page (0,2) · chapter 3 · one step, then a hundred thousand (3.13-3.21) ================= */
  const pI = pg(0, 2), t313 = bt('c3_13').t, tW1 = a('w10324');
  go(0, 2, t313 - 0.9, 1.2);
  /* the two nudges slide down from the page above */
  const NQX = 300, NKX = 1430, NTY = 250;
  const slideM = (M, x, y, name) => { const ms = [M.frame, ...M.cells.flat()]; grp(ms, name); pI.mv(M.frame, t313 - 0.9, 1.2, x, y); M.cells.forEach((r, i) => r.forEach((m, j) => pI.mv(m, t313 - 0.9, 1.2, x + M.cw * (j + 0.5), y + M.ch * (i + 0.5)))); return ms; };
  const dQs = slideM(dQ, NQX, NTY, 'dQtravel'), dKs = slideM(dK, NKX, NTY, 'dKtravel');
  O([dQe, dKe, ...prQ, ...prK, shQ, shK, dvQ, dvK], t313 - 0.9, 0.3);
  pageTitle(pI, '3 · One step, then a hundred thousand', t313 - 0.1);
  stepStrip(pI, [3, 4], t313 + 0.6, P.hlO);
  const nqL = label(pI, 'nudge to Wq', NQX + 96, 222, C_Q, 24, 'middle', 700), nkL = label(pI, 'nudge to Wk', NKX + 96, 222, C_K, 24, 'middle', 700);
  W(nqL, t313 + 0.4, 0.5); W(nkL, t313 + 0.6, 0.5); grp([nqL, nkL], 'nqk');
  const hCq = colHl(pI, { ...dQ, x: NQX, y: NTY, cx: j => NQX + dQ.cw * (j + 0.5) }, 0, P.hlO), hCk = colHl(pI, { ...dK, x: NKX, y: NTY, cx: j => NKX + dK.cw * (j + 0.5) }, 0, P.hlO);
  S.behind(hCq, dQ.cells[0][0]); S.behind(hCk, dK.cells[0][0]);
  /* 3.13 · one small step: add a hundredth of each nudge */
  const stp0 = label(pI, 'one step: add 0.01 × each nudge', 960, 470, P.ink, 32);
  W(stp0, t313 + 1.4, 0.9);
  const LQs = wline(pI, [{ s: 'Wq, slot 1:', col: C_Q, w: 700 }, { s: '(0, 0, 4)' }, { s: '+ 0.01 ×' }, { s: '(0.09, 0.09, 0.81)', col: C_TR, w: 700 }, { s: '=' }, { s: '(0.0009, 0.0009, 4.0081)', col: C_Q, w: 700 }], 960, 540, 28);
  writeParts(LQs.slice(0, 3), t313 + 2.6, 0.3); F(hCq, t313 + 3.4, 0.3); flyIn(pI, LQs[3], NQX + 32, NTY + 66, t313 + 3.6, 0.7);
  W(LQs[4], t313 + 4.8, 0.2); W(LQs[5], tW1 - 4.0, 0.6);
  const hl4 = hlBehind(S, LQs[5], '4.0081', P.hlO, { pad: 4 }); F(hl4, tW1 - 3.2, 0.3);
  const LKs = wline(pI, [{ s: 'Wk, slot 1:', col: C_K, w: 700 }, { s: '(1, 1, 0)' }, { s: '+ 0.01 ×' }, { s: '(0, 3.24, 0.36)', col: C_TR, w: 700 }, { s: '=' }, { s: '(1, 1.0324, 0.0036)', col: C_K, w: 700 }], 960, 600, 28);
  writeParts(LKs.slice(0, 3), tW1 - 3.0, 0.25); F(hCk, tW1 - 2.6, 0.3); flyIn(pI, LKs[3], NKX + 32, NTY + 66, tW1 - 2.4, 0.7);
  W(LKs[4], tW1 - 1.2, 0.2); W(LKs[5], tW1 - 0.9, 0.6);
  const hl1 = hlBehind(S, LKs[5], '1.0324', P.hlO, { pad: 4 }); F(hl1, tW1 + 0.2, 0.3);
  const stepNote = txt(pI, 'step size 0.01, for this example; the season’s toy keeps its numbers', 960, 652, 22, P.soft);
  W(stepNote, tW1 + 0.6, 0.9);
  grp(LQs, 'LQs'); grp(LKs, 'LKs');
  /* 3.14 · the new query and the new key */
  const t314 = bt('c3_14').t, tK930 = a('k930');
  const LQn = wline(pI, [{ s: 'bank’s new query:', col: C_Q, w: 700 }, { s: '0.1 × 0.0009 + 0.1 × 0.0009 + 0.9 × 4.0081' }, { s: '=' }, { s: '3.607', col: C_Q, w: 700 }], 960, 730, 26);
  writeParts(LQn.slice(0, 3), t314 + 0.1, 0.35, 0.5); W(LQn[3], t314 + 1.6, 0.4);
  const LKn = wline(pI, [{ s: 'river’s new key:', col: C_K, w: 700 }, { s: '0 × 1 + 0.9 × 1.0324 + 0.1 × 0.0036' }, { s: '=' }, { s: '0.930', col: C_K, w: 700 }], 960, 780, 26);
  writeParts(LKn.slice(0, 3), tK930 - 1.7, 0.3, 0.5); W(LKn[3], tK930 - 0.2, 0.4);
  grp(LQn, 'LQn'); grp(LKn, 'LKn');
  /* 3.15 · the score rises */
  const t315 = bt('c3_15').t, tS335 = a('s335');
  const NS = wline(pI, [{ s: 'new score:' }, { s: '3.607', col: C_Q, w: 700 }, { tex: '\\times' }, { s: '0.930', col: C_K, w: 700 }, { s: '=' }, { s: '3.35', col: P.ink, w: 700 }, { s: '(was 3.24)', col: P.soft }], 960, 870, 34);
  W(NS[0], t315 + 0.1, 0.4); flyIn(pI, NS[1], LQn[3].mid, 730, t315 + 0.2, 0.5); W(NS[2], t315 + 0.9, 0.2); flyIn(pI, NS[3], LKn[3].mid, 780, t315 + 0.9, 0.5);
  W(NS[4], tS335 - 0.6, 0.2); W(NS[5], tS335 - 0.3, 0.4); W(NS[6], tS335 + 0.4, 0.5);
  const hl335 = hlBehind(S, NS[5], '3.35', P.hlO, { pad: 6 }); F(hl335, tS335 + 0.2, 0.3);
  grp(NS, 'NS');
  /* 3.16 · the real size: 512 x 64 nudges, 25,000-token batches, 100,000 steps */
  const t316 = bt('c3_16').t, tSt = a('steps');
  O([...dQs, ...dKs, nqL, nkL, hCq, hCk, stp0, ...LQs, hl4, ...LKs, hl1, stepNote, ...LQn, ...LKn, ...NS, hl335], t316 - 0.1, 0.4);
  const sheet = gm(pI, hatchG(60, 220, '', C_TR), P.ink, 330, 400);
  const sheetL = label(pI, 'one nudge: 512 × 64', 360, 660, C_TR, 26);
  W(sheet, t316 + 0.6, 0.6); W(sheetL, t316 + 1.0, 0.6);
  let bl = ''; for (let i = 0; i < 8; i++) bl += rl(620, 420 + i * 26, 620 + 300 - ((i * 37) % 90), 420 + i * 26, { ov: 0, j: 0.5 });
  const batch = pI(ink(bl, P.soft, 3), 0, 0);
  let darr = ''; for (let i = 0; i < 6; i++) darr += rarrow(600 - i * 6, 440 + i * 30, 410, 440 + i * 28, { head: 10, bow: 0.08 });
  const batchA = pI(ink(darr, C_FAIL, 2), 0, 0);
  const batchL = label(pI, 'a batch: about 25,000 tokens', 770, 660, P.ink, 26, 'middle', 400);
  const tBt = Math.min(t316 + 4.4, tSt - 4.0);
  W(batch, tBt, 0.6); W(batchA, tBt + 0.4, 0.6); W(batchL, tBt + 0.3, 0.6);
  grp([batch, batchL], 'batch');
  const ctrTk = trk({ n: 0 }), ctrG = E('g'), ctrT = txtEl(ctrG, 0, 0, '0', 72, C_TR, 700);
  const ctr = gm(pI, ctrG, C_TR, 1420, 530);
  S.drive(() => { const n = Math.round(ctrTk.v.n); const s = n.toLocaleString('en-US'); if (ctrT.textContent !== s) ctrT.textContent = s; });
  const ctrL = label(pI, 'training steps', 1420, 620, P.ink, 28, 'middle', 400);
  F(ctr, tSt - 3.2, 0.3); W(ctrL, tSt - 3.0, 0.5); S.set(ctrTk, tSt - 3.1, 3.0, { n: 100000 });
  grp([ctr, ctrL], 'ctr');
  /* 3.17-3.19 · the notebooks fill with different patterns */
  const t317 = bt('c3_17').t;
  O([sheet, sheetL, batch, batchA, batchL, ctr, ctrL], t317 - 0.2, 0.4);
  const BKX = [420, 1260], BKY = 360, BKW = 320, BKH = 230;
  const books2 = BKX.map(x => gm(pI, hatchG(BKW, BKH, '', P.ink), P.ink, x, BKY));
  const signs2 = [['Requests · Wq', C_Q], ['Catalog · Wk', C_K]].map(([s, c], i) => label(pI, s, BKX[i] + BKW / 2, BKY - 40, c, 36));
  books2.forEach((m, i) => F(m, t317 + 0.1 + i * 0.15, 0.4)); signs2.forEach((m, i) => W(m, t317 + 0.2 + i * 0.15, 0.5));
  grp(books2, 'books2'); grp(signs2, 'signs2');
  const tSeat = a('seat'), tLook = a('looked');
  const fill = (vals, x, y) => gm(pI, barsG(vals, 240, C_FAIL), C_FAIL, x, y);
  const fillQ = [[0.1, 0.1, 0.9], [0, 0.9, 0.1], [0.9, 0, 0.1], [0.1, 0.1, 0]].map((v, i) => fill(v, BKX[0] + BKW / 2, BKY + 40 + i * 48));
  const fillK = [[0, 0.9, 0.1], [0.9, 0, 0.1], [0.1, 0.1, 0], [0, 0.9, 0.1]].map((v, i) => fill(v, BKX[1] + BKW / 2, BKY + 40 + i * 48));
  fillQ.forEach((m, i) => F(m, tSeat - 1.2 + i * 0.25, 0.3)); fillK.forEach((m, i) => F(m, tLook - 1.2 + i * 0.25, 0.3));
  grp(fillQ, 'fillQ'); grp(fillK, 'fillK');
  const seatQ = label(pI, 'from the lookers', BKX[0] + BKW / 2, BKY + BKH + 36, C_Q, 28), seatK = label(pI, 'from the targets', BKX[1] + BKW / 2, BKY + BKH + 36, C_K, 28);
  W(seatQ, tSeat + 0.1, 0.5); W(seatK, tLook + 0.1, 0.5);
  const tAk = a('alike');
  pulse(books2[0], tAk - 0.4, 1.04); pulse(books2[1], tAk - 0.1, 1.04);
  /* 3.20-3.21 · takeaway; then one pair of notebooks is one head among several */
  const t320 = bt('c3_20').t;
  const tk3 = take(pI, ['Not because the notebooks differed,', 'but because the jobs did.'], 960, 820, 1000, t320 + 0.1);
  const t321 = bt('c3_21').t;
  O([tk3], t321, 0.4);
  const pair = gm(pI, (() => { const g = E('g'); E('rect', { x: -110, y: -50, width: 220, height: 100, rx: 8, fill: '#FFFFFC', stroke: 'none', 'data-nd': '' }, g); pathEl(g, rrect(-110, -50, 220, 100, { ov: 1 }), 3); txtEl(g, -50, 0, 'Wq', 30, C_Q, 700); txtEl(g, 50, 0, 'Wk', 30, C_K, 700); return g; })(), P.ink, 960, 850);
  const ghosts = [1, 2, 3].map(i => gm(pI, (() => { const g = E('g'); pathEl(g, rrect(-110, -50, 220, 100, { ov: 1 }), 2.5, P.soft); return g; })(), P.soft, 960 + i * 22, 850 - i * 18));
  F(pair, t321 + 0.3, 0.5, { dy: 10 }); ghosts.forEach((m, i) => F(m, a('once') - 0.5 + i * 0.12, 0.3, { o: 0.6 }));
  ghosts.forEach(m => S.behind(m, pair)); grp(ghosts, 'ghosts');

  /* ================= page (1,2) · chapter 4 · many heads (4.1-4.15) ================= */
  const pJ = pg(1, 2), t4 = bt('c4_01').t;
  go(1, 2, t4 - 1.1, 1.1);
  pageTitle(pJ, '4 · Many heads', t4 - 0.3);
  stepStrip(pJ, 1, t4 + 0.2);
  const HX = 520, HY = 470, HW = 330, HH = 260;
  const miniTable = (op) => { const g = E('g'); E('rect', { x: -HW / 2, y: -HH / 2, width: HW, height: HH, rx: 8, fill: '#FFFFFC', stroke: 'none', 'data-nd': '' }, g); for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) { const v = op ? op[i][j] : SCV[i][j] / 3.24; E('rect', { x: -HW / 2 + 10 + j * (HW - 20) / 3, y: -HH / 2 + 10 + i * (HH - 20) / 3, width: (HW - 20) / 3 - 6, height: (HH - 20) / 3 - 6, rx: 4, fill: C_Q, 'fill-opacity': 0.04 + 0.5 * v, stroke: 'none', 'data-nd': '' }, g); } pathEl(g, rrect(-HW / 2, -HH / 2, HW, HH, { ov: 1 }), 3); return g; };
  const PAT = k => [0, 1, 2].map(i => [0, 1, 2].map(j => (((i * 3 + j) * 7 + k * 5) % 11) / 11));
  const head0 = gm(pJ, miniTable(null), P.ink, HX, HY);
  const sm3 = ['Wq', 'Wk', 'Wv'].map((s, i) => gm(pJ, hatchG(110, 48, s, [C_Q, C_K, C_V][i], 24), P.ink, HX - 165 + i * 120, HY + HH / 2 + 30));
  const tSet = a('set');
  F(head0, tSet - 0.6, 0.5); sm3.forEach((m, i) => W(m, tSet - 0.3 + i * 0.15, 0.4)); grp(sm3, 'sm3');
  const hds = [];
  for (let k = 1; k < 8; k++) { const m = gm(pJ, miniTable(PAT(k)), P.ink, HX + k * 34, HY - k * 26); hds.push(m); S.behind(m, head0); }
  const tEi = a('eight');
  hds.forEach((m, k) => F(m, tEi - 0.3 + k * 0.07, 0.3, { o: 0.9 })); grp(hds, 'hds');
  const eightL = label(pJ, '8 heads, each with its own Wq, Wk, Wv', 1010, 230, P.ink, 32, 'start');
  W(eightL, tEi + 0.6, 0.9);
  /* 4.3 · one head's matrix and its 64-number query */
  const tD64 = a('d64');
  const oneWq = gm(pJ, hatchG(48, 190, '', C_Q), P.ink, 1010, 300);
  const oneWqL = label(pJ, 'one head’s Wq: 512 × 64', 1080, 395, C_Q, 28, 'start');
  W(oneWq, tD64 - 2.8, 0.6); W(oneWqL, tD64 - 2.5, 0.8);
  const r64 = E('g'); E('rect', { x: 0, y: -16, width: 300, height: 32, rx: 6, fill: '#FFFFFC', stroke: 'none', 'data-nd': '' }, r64); pathEl(r64, rrect(0, -16, 300, 32, { ov: 1 }), 2.5, C_Q); let t64 = ''; for (let i = 1; i < 64; i++) t64 += `M${f1(i * 300 / 64)} ${i % 8 ? -5 : -12}V${i % 8 ? 5 : 12}`; pathEl(r64, t64, 1.3, P.soft);
  const r64M = gm(pJ, r64, C_Q, 1010, 560), r64L = label(pJ, '64 numbers per query, key, value', 1160, 610, C_Q, 26, 'middle', 400);
  W(r64M, tD64 - 0.4, 0.6); W(r64L, tD64 + 0.1, 0.6);
  grp([oneWq, oneWqL], 'oneWq'); grp([r64M, r64L], 'r64');
  /* 4.4-4.5 · each head can ask its own question */
  const tQu = a('question');
  hds.forEach((m, k) => pulse(m, tQu - 0.3 + k * 0.08, 1.03));
  const shadeL = txt(pJ, 'shading illustrative', HX + 60, HY + HH / 2 + 185, 22, P.olive);
  W(shadeL, tQu + 0.2, 0.4);
  const tNb = a('neighbour');
  const tagA = label(pJ, 'which sense?', HX - 40, HY + HH / 2 + 110, C_Q, 28), tagB = label(pJ, 'next door', 960, 160, C_Q, 28, 'start');
  const illus = label(pJ, 'examples, not assigned roles', HX + 60, HY + HH / 2 + 150, P.olive, 22);
  W(tagA, tNb - 2.4, 0.6); W(tagB, tNb - 0.4, 0.6); W(illus, tNb + 0.4, 0.5);
  grp([tagA, tagB, illus, shadeL], 'headTags');
  /* 4.6-4.8 · eight results of 64, glued to 512, mixed by one more matrix */
  const tRs = a('result');
  O([tagA, tagB, illus, shadeL, r64M, r64L, oneWq, oneWqL, eightL], tRs - 0.8, 0.3);
  const SW8 = 150, SX0 = 1000, SY8 = 520;
  const strips = [];
  for (let k = 0; k < 8; k++) strips.push(gm(pJ, rowG(SW8 - 10, 40, C_Z), C_Z, SX0 + (k % 4) * (SW8 + 10), SY8 + Math.floor(k / 4) * 60));
  strips.forEach((m, k) => F(m, tRs - 0.3 + k * 0.06, 0.25)); grp(strips, 'strips');
  const s64L = label(pJ, '64 each', SX0 + 2 * (SW8 + 10) - 80, SY8 + 110, C_Z, 26, 'middle', 400);
  W(s64L, tRs + 0.3, 0.4);
  const tW2 = a('w512b');
  O(s64L, tW2 - 1.0, 0.3);
  strips.forEach((m, k) => pJ.mv(m, tW2 - 0.8 + k * 0.04, 0.7, 260 + k * SW8 + SW8 / 2, 820));
  grp([head0, ...hds, ...sm3], 'headsAll');
  dim([head0, ...hds, ...sm3], tW2 - 0.8, 0.35);
  const l512 = label(pJ, '8 × 64 = 512', 260 + 4 * SW8, 880, P.ink, 38);
  W(l512, tW2 + 0.1, 0.6);
  const h512 = hlBehind(S, l512, '512', P.hlO, { pad: 6 }); F(h512, tW2 + 0.6, 0.3);
  const tMx = a('mixes');
  const wo = gm(pJ, hatchG(200, 70, 'Wo', P.ink, 28), P.ink, 1540, 785);
  const woL = label(pJ, '512 × 512', 1640, 885, P.ink, 26, 'middle', 400);
  W(wo, tMx - 2.2, 0.6); W(woL, tMx - 1.8, 0.5);
  const woA = arrowM(pJ, 260 + 8 * SW8 + 10, 820, 1530, 820, P.ink, 3.5);
  W(woA, tMx - 0.3, 0.4);
  grp([wo, woL, woA], 'wo');
  /* 4.9-4.10 · count it up, in two lines each */
  const t409 = bt('c4_09').t, tC786 = a('c786'), t410b = bt('c4_10').t, tLy = a('layer');
  O([l512, h512], t409, 0.3);
  const cnt = [txt(pJ, 'one 512 × 64 matrix: 32,768 numbers', 1420, 250, 30), txt(pJ, '× 3 matrices × 8 heads = 786,432', 1420, 302, 30), txt(pJ, '+ Wo: 512 × 512 = 262,144', 1420, 354, 30)];
  const cntT = label(pJ, '786,432 + 262,144 = 1,048,576: about a million', 1420, 412, P.ink, 30);
  W(cnt[0], t409 + 2.6, 1.0); W(cnt[1], tC786 - 2.4, 1.0); W(cnt[2], t410b + 0.8, 1.0); W(cntT, tLy - 2.8, 1.2);
  const cntH = hlBehind(S, cntT, 'about a million', P.hlO, { pad: 6 }); F(cntH, tLy + 0.2, 0.3);
  grp(cnt, 'cnt');
  /* 4.11 · the toy: one head, no mixer */
  const t411 = bt('c4_11').t;
  O(hds, t411 + 0.1, 0.5);
  dim([head0, ...sm3], t411 + 0.2, 1, 0.4);
  const toyH = label(pJ, 'toy: one head, 3 × 3 matrices', HX, HY + HH / 2 + 110, P.olive, 28);
  W(toyH, t411 + 0.5, 0.8);
  const woX = pJ(ink(crossD(1640, 820, 34), C_FAIL, 5), 0, 0);
  W(woX, a('out') - 0.4, 0.5);
  /* 4.12 · takeaway */
  const t412 = bt('c4_12').t;
  dim([...strips, wo, woL, woA, woX, head0, ...sm3, toyH, ...cnt, cntT, cntH], t412, 0.25);
  const tk4 = take(pJ, ['Eight heads, eight questions,', 'one mixed answer.'], 1390, 600, 860, t412 + 0.1);
  /* 4.13 · in the toy, bank's blend is added onto its own row, worked in full */
  const t413 = bt('c4_13').t, tBv9 = a('bv09');
  O([tk4, ...strips, wo, woL, woA, woX, head0, ...sm3, toyH, ...cnt, cntT, cntH], t413 - 0.1, 0.4);
  const BVX = 1120;
  const bvA = [label(pJ, 'bank’s row', 560, 420, P.ink, 30, 'start', 400), label(pJ, '(0.1, 0.1, 0.9)', BVX, 420, P.ink, 34, 'middle', 700)];
  const bvB = [label(pJ, '+ its blend, from chapter 2', 560, 480, C_Z, 30, 'start', 400), label(pJ, '(0.032, 0.646, 0)', BVX, 480, C_Z, 34, 'middle', 700)];
  const bvRule = pJ(ink(rl(BVX - 200, 516, BVX + 200, 514, { bow: 0.002 }), P.ink, 3), 0, 0);
  const bvC = [label(pJ, '= bank after attention', 560, 560, C_Z, 30, 'start', 700), label(pJ, '(0.132, 0.746, 0.9)', BVX, 560, C_Z, 36, 'middle', 700)];
  const bvAb = txt(pJ, 'about (0.13, 0.75, 0.9)', BVX, 612, 24, P.soft);
  const resTag = label(pJ, 'residual connection: add, don’t replace', 960, 330, C_V, 32, 'middle', 700);
  W(resTag, a('resid') - 0.6, 1.0);
  writeParts(bvA, t413 + 1.8, 0.3, 0.6); writeParts(bvB, t413 + 4.0, 0.3, 0.6);
  W(bvRule, tBv9 - 3.6, 0.3); writeParts(bvC, tBv9 - 3.3, 0.4, 0.8); W(bvAb, tBv9 - 0.6, 0.6);
  grp(bvA, 'bvA'); grp(bvB, 'bvB'); grp(bvC, 'bvC');
  /* 4.14 · read against rows we know */
  const tBv76 = a('bv76'), tBv21 = a('bv21');
  const rv1 = wline(pJ, [{ s: '(0.132, 0.746, 0.9) · river (0, 0.9, 0.1) =' }, { s: '0 + 0.671 + 0.090' }, { s: '=' }, { s: '0.761', col: P.green, w: 700 }], 960, 710, 28);
  writeParts(rv1.slice(0, 3), tBv76 - 2.0, 0.4, 0.4); W(rv1[3], tBv76 - 0.2, 0.4);
  const befL = txt(pJ, 'before attention, bank · river = 0.18', 960, 760, 24, P.soft);
  W(befL, tBv76 + 1.2, 0.8);
  const rv2 = wline(pJ, [{ s: '(0.132, 0.746, 0.9) · loan (0.9, 0, 0.1) =' }, { s: '0.119 + 0 + 0.090' }, { s: '=' }, { s: '0.209', col: P.ink, w: 700 }], 960, 820, 28);
  writeParts(rv2.slice(0, 3), tBv21 - 2.0, 0.4, 0.4); W(rv2[3], tBv21 - 0.2, 0.4);
  grp(rv1, 'rv1'); grp(rv2, 'rv2');
  /* 4.15 · bank's vector glows alone */
  const t415 = bt('c4_15').t, tThk = a('thinking');
  O([...bvA, ...bvB, bvRule, bvC[0], bvAb, ...rv1, befL, ...rv2, resTag], t415, 0.4);
  pJ.mv(bvC[1], t415 + 0.3, 0.8, 960, 560); S.set(bvC[1], t415 + 0.3, 0.8, { s: 1.2 });
  const glow = pJ(ink(rrect(960 - 230, 560 - 46, 460, 92, { ov: 1 }), C_Z, 5), 0, 0);
  W(glow, tThk - 0.6, 0.6);
  const qT = label(pJ, '?', 1240, 560, P.green, 64);
  W(qT, tThk + 0.1, 0.4);

  /* ================= page (2,2) · end card ================= */
  const pK = pg(2, 2), tFn = bt('e_01').t - 0.9;
  go(2, 2, tFn, 1.1);
  const eTag = label(pK, SERIES + ' · ' + EPT, 960, 360, P.olive, 34);
  const eCard = gm(pK, endCardG(NEXT), C_OK, 960, 540);
  W(eTag, tFn + 0.8, 0.6); F(eCard, a('heard') - 0.9, 0.6, { dy: 14 });

  /* ================= page (3,2) · further reading, seen in the zoom-out ================= */
  const pL = pg(3, 2);
  const frT = label(pL, 'Further reading', 160, 200, P.green, 60, 'start', 700);
  const FR = [
    ['Vaswani et al. (2017), Attention Is All You Need', '§3.2 attention and multi-head attention; §5 training'],
    ['Jay Alammar, The Illustrated Transformer', 'the pronoun example; queries, keys and values, drawn'],
    ['Jurafsky & Martin, Speech and Language Processing', 'the transformer chapter: attention as weighted comparison'],
    ['Elhage, Lasenby & Olah (2023), Privileged Bases in the Transformer Residual Stream', 'why single columns have no nameable meaning'],
  ];
  const frL = FR.flatMap(([h, s], i) => [label(pL, h, 160, 340 + i * 150, P.ink, 36, 'start', 700), label(pL, s, 160, 392 + i * 150, P.soft, 28, 'start', 400)]);
  const tFr = bt('e_01').t;
  F(frT, tFr, 0.5); frL.forEach(m => F(m, tFr + 0.2, 0.5)); grp([frT, ...frL], 'reading');

  /* ---------- the zoom-out over all twelve pages ---------- */
  const tZ = Math.max(TM.total - 0.4, bt('e_01').end + 1.6);
  camTo(S, cam, tZ, 3.2, SPREAD_C.x, SPREAD_C.y, ZOOM_OUT);
  S.end(tZ + 3.8);
  return S;
}
