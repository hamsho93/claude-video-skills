/* ================= kit 6: shared doodles for episodes 02 and 03 ================= */
/* a room as the camera sees it, drawn in a W x H frame (origin top-left); B holds the object boxes */
function roomScene(W, H, o = {}) {
  const g = E('g'), X = v => v * W, Y = v => v * H, sw = Math.max(2, W / 240), B = { bottles: [] };
  const dx = o.dx || 0, XX = v => X(v + dx);
  if (o.window !== false) pathEl(g, rrect(XX(0.53), Y(0.08), X(0.17), Y(0.18), { ov: 1 }) + rl(XX(0.615), Y(0.08), XX(0.615), Y(0.26), { ov: 0 }) + rl(XX(0.53), Y(0.17), XX(0.70), Y(0.17), { ov: 0 }), sw * 0.8, P.soft);
  pathEl(g, rl(0, Y(0.86), W, Y(0.86), { ov: 0 }), sw * 0.8, P.soft);
  pathEl(g, tableG(XX(0.28), XX(0.80), Y(0.62), Y(0.24)), sw);
  (o.bottles || [0.44]).forEach(bx => { const h = Y(0.30), gg = E('g', { transform: `translate(${f1(XX(bx))} ${f1(Y(0.62))})` }, g); gg.appendChild(bottleG(h)); const w = h * 0.42; B.bottles.push([XX(bx) - w / 2 - 3, Y(0.62) - h - 3, XX(bx) + w / 2 + 3, Y(0.62) + 2]); });
  if (o.occl !== undefined) { const b = B.bottles[o.occl], cx = (b[0] + b[2]) / 2; E('rect', { x: cx - X(0.075), y: Y(0.47), width: X(0.15), height: Y(0.15), fill: '#EFE3C4', stroke: 'none', 'data-nd': '' }, g); pathEl(g, rrect(cx - X(0.075), Y(0.47), X(0.15), Y(0.15), { ov: 1 }) + rl(cx - X(0.075), Y(0.52), cx + X(0.075), Y(0.52), { ov: 0 }), sw); }
  if (o.mug !== false) { pathEl(g, rrect(XX(0.595), Y(0.535), X(0.05), Y(0.085), { ov: 0.5 }) + `M${f1(XX(0.645))} ${f1(Y(0.555))}C${f1(XX(0.675))} ${f1(Y(0.555))} ${f1(XX(0.675))} ${f1(Y(0.60))} ${f1(XX(0.645))} ${f1(Y(0.60))}`, sw); B.mug = [XX(0.588), Y(0.525), XX(0.672), Y(0.625)]; }
  if (o.plant !== false) { pathEl(g, rpoly([[XX(0.085), Y(0.76)], [XX(0.155), Y(0.76)], [XX(0.145), Y(0.86)], [XX(0.095), Y(0.86)]], true, { ov: 0.5 }), sw); pathEl(g, catmull([[XX(0.12), Y(0.76)], [XX(0.10), Y(0.66)], [XX(0.07), Y(0.58)]]) + catmull([[XX(0.12), Y(0.76)], [XX(0.125), Y(0.64)], [XX(0.12), Y(0.55)]]) + catmull([[XX(0.12), Y(0.76)], [XX(0.15), Y(0.67)], [XX(0.175), Y(0.60)]]), sw, P.green); B.plant = [XX(0.055), Y(0.53), XX(0.185), Y(0.87)]; }
  if (o.person) { const px = o.person; pathEl(g, rell(XX(px), Y(0.36), Y(0.045), Y(0.045), { turn: 1.04 }) + rl(XX(px), Y(0.41), XX(px), Y(0.64), { ov: 0 }) + rl(XX(px), Y(0.64), XX(px - 0.03), Y(0.86), { ov: 0 }) + rl(XX(px), Y(0.64), XX(px + 0.03), Y(0.86), { ov: 0 }) + rl(XX(px), Y(0.47), XX(px - 0.045), Y(0.58), { ov: 0 }) + rl(XX(px), Y(0.47), XX(px + 0.045), Y(0.58), { ov: 0 }), sw * 1.1); B.person = [XX(px - 0.055), Y(0.30), XX(px + 0.055), Y(0.875)]; }
  return { g, B };
}
/* a white frame with a room in it */
function frameCard(W, H, o = {}) { const g = E('g'); E('rect', { x: 0, y: 0, width: W, height: H, rx: 4, fill: '#FFFFFC', stroke: 'none', 'data-nd': '' }, g); const sc = roomScene(W, H, o); g.appendChild(sc.g); pathEl(g, rrect(0, 0, W, H, { ov: 2, j: 0.6 }), 3.5); return { g, B: sc.B }; }
/* a detector box: a hand-drawn rectangle, optionally dashed */
function boxG(b, w = 4, col = 'currentColor', dash) { const g = E('g'); pathEl(g, rrect(b[0], b[1], b[2] - b[0], b[3] - b[1], { ov: 1.5, j: 0.5 }), w, col, dash ? { 'stroke-dasharray': dash } : {}); return g; }
/* a filled tag (id / class label) whose bottom-left sits at (x, y) */
function tagG(text, x, y, fill = C_BOX, size = 24, ink = P.ink) { const g = E('g'), w = text.length * size * 0.5 + 18, h = size + 12; E('rect', { x, y: y - h, width: w, height: h, rx: 4, fill, 'fill-opacity': 0.9, stroke: 'none', 'data-nd': '' }, g); txtEl(g, x + w / 2, y - h / 2, text, size, ink, 700); return g; }
/* a small eye: almond + pupil */
function eyeG(s = 1) { const g = E('g'); pathEl(g, `M${-46 * s} 0Q0 ${-40 * s} ${46 * s} 0Q0 ${40 * s} ${-46 * s} 0Z`, 4); E('circle', { r: 14 * s, fill: 'currentColor', 'data-nd': '' }, g); E('circle', { cx: 5 * s, cy: -5 * s, r: 4 * s, fill: P.paper, 'data-nd': '' }, g); return g; }

/* a rounded pill with a label */
function pillG(text, x, y, col = P.ink, fill = '#FFFFFC', z = 28) { const g = E('g'), w = text.length * z * 0.5 + 34; E('rect', { x: x - w / 2, y: y - 28, width: w, height: 56, rx: 28, fill, 'fill-opacity': 0.75, stroke: 'none', 'data-nd': '' }, g); pathEl(g, rrect(x - w / 2, y - 28, w, 56, { ov: 1.5, j: 0.5 }), 3, col); txtEl(g, x, y, text, z, col, 700); return g; }
/* a small cloud */
function cloudG(x, y, rx = 78, ry = 32, text = '', col = P.blue) { const g = E('g'); E('ellipse', { cx: x, cy: y, rx, ry, fill: '#FFFFFC', stroke: 'none', 'data-nd': '' }, g); pathEl(g, rell(x, y, rx, ry, { turn: 1.04 }), 3, col); if (text) txtEl(g, x, y, text, 26, col, 700); return g; }
/* stopwatch face; returns g with g._hand (rotate about centre) and g._t (readout) */
function watchG(x, y, r = 46) { const g = E('g'); E('circle', { cx: x, cy: y, r, fill: '#FFFFFC', stroke: 'none', 'data-nd': '' }, g); pathEl(g, rell(x, y, r, r, { turn: 1.03 }), 4); pathEl(g, rrect(x - 9, y - r - 16, 18, 12, { ov: 0.5 }), 3); for (let k = 0; k < 12; k++) { const a = k * 30 * D2R; pathEl(g, rl(x + Math.sin(a) * (r - 10), y - Math.cos(a) * (r - 10), x + Math.sin(a) * (r - 4), y - Math.cos(a) * (r - 4), { ov: 0, j: 0.2 }), 2.5, P.soft); } g._hand = E('path', { d: `M${x} ${y}L${x} ${y - r + 12}`, stroke: P.magenta, 'stroke-width': 4, 'stroke-linecap': 'round', fill: 'none', 'data-nd': '' }, g); E('circle', { cx: x, cy: y, r: 5, fill: P.ink, 'data-nd': '' }, g); g._t = txtEl(g, x, y + r + 30, '', 30, P.ink, 700); g._c = [x, y]; return g; }
/* a tick box (empty square; a check draws into it later) */
function tickBoxG(x, y, s = 34) { const g = E('g'); pathEl(g, rrect(x - s / 2, y - s / 2, s, s, { ov: 1 }), 3); return g; }

/* ================= kit 9: doodles for Arc 3 (episode 05 first) ================= */
/* inks for this episode: blue = Sonnet (the teacher, the ceiling), magenta = Qwen (the small model, the floor),
   olive = the exam and its missions, green = the grader / structure / answers, flame = cut-offs and failures (never red) */
const C_SON = P.blue, C_QW = P.magenta, C_EXAM = P.olive, C_OK = P.green, C_BAD = P.flame;

function coinG(r = 24) { const g = E('g'); E('circle', { r, fill: '#F9E7B0', stroke: 'none', 'data-nd': '' }, g); pathEl(g, rell(0, 0, r, r, { turn: 1.04 }), 3, '#A07A10'); txtEl(g, 0, 1, '$', r * 1.2, '#A07A10', 700); return g; }
function wifiG(s = 1) { const g = E('g'); E('circle', { cx: 0, cy: 0, r: 5 * s, fill: 'currentColor', 'data-nd': '' }, g); for (let i = 1; i <= 3; i++) { const r = 14 * i * s, a0 = -135 * D2R, a1 = -45 * D2R; pathEl(g, `M${f1(Math.cos(a0) * r)} ${f1(Math.sin(a0) * r)}A${r} ${r} 0 0 1 ${f1(Math.cos(a1) * r)} ${f1(Math.sin(a1) * r)}`, 4); } return g; }
/* a model: a rounded box of little weight dots with its name on top */
function modelBoxG(name, color, w = 220, h = 160, o = {}) {
  const g = E('g');
  E('rect', { x: -w / 2, y: -h / 2, width: w, height: h, rx: 18, fill: color, 'fill-opacity': 0.1, stroke: 'none', 'data-nd': '' }, g);
  pathEl(g, rrect(-w / 2, -h / 2, w, h, { ov: 2 }), 4, color);
  const n = o.dots ?? 7, m = 4; let d = '';
  for (let i = 0; i < n; i++) for (let j = 0; j < m; j++) { const x = -w / 2 + 28 + i * (w - 56) / (n - 1), y = -h / 2 + 62 + j * (h - 84) / (m - 1); d += `M${f1(x - 3)} ${f1(y)}h6`; }
  pathEl(g, d, 5, color, { opacity: 0.55 });
  txtEl(g, 0, -h / 2 + 30, name, 32, color, 700);
  return g;
}
function booksG() { const g = E('g'); [[-70, 0, 140, 30, 0], [-60, -30, 128, 30, 3], [-74, -60, 144, 30, -2], [-56, -90, 120, 30, 2]].forEach(([x, y, w, h, r]) => { const b = E('g', { transform: `rotate(${r} ${x + w / 2} ${y + h / 2})` }, g); E('rect', { x, y, width: w, height: h, rx: 3, fill: '#EFE3C4', stroke: 'none', 'data-nd': '' }, b); pathEl(b, rrect(x, y, w, h, { ov: 1 }), 3); pathEl(b, rl(x + 14, y + 4, x + 14, y + h - 4, { ov: 0 }), 2.5); }); return g; }
function hireG() { const g = E('g'); pathEl(g, rell(0, -120, 30, 30, { turn: 1.05 }) + rl(0, -88, 0, 10, { ov: 0 }) + rl(0, 10, -30, 100, { ov: 0 }) + rl(0, 10, 30, 100, { ov: 0 }) + rl(0, -60, -52, 0, { ov: 0 }) + rl(0, -60, 52, -10, { ov: 0 }), 4.5); E('rect', { x: 8, y: -62, width: 40, height: 28, rx: 3, fill: P.hlC, stroke: 'none', 'data-nd': '' }, g); pathEl(g, rrect(8, -62, 40, 28, { ov: 1 }), 2.5); pathEl(g, rl(14, -50, 42, -50, { ov: 0 }) + rl(14, -42, 34, -42, { ov: 0 }), 2, P.soft); return g; }
/* a station on the post-training map */
function stationG(label, col = P.ink, o = {}) { const g = E('g'); g._f = E('circle', { r: 46, fill: o.fill || col, 'fill-opacity': 0, stroke: 'none', 'data-nd': '' }, g); pathEl(g, rell(0, 0, 46, 46, { turn: 1.04 }), 4, col, o.dash ? { 'stroke-dasharray': o.dash } : {}); txtEl(g, 0, 82, label, 32, col, 700); return g; }
/* mission card icons, centred */
function compassG(r = 44) { const g = E('g'); pathEl(g, rell(0, 0, r, r, { turn: 1.04 }), 3.5); for (let k = 0; k < 8; k++) { const a = k * 45 * D2R, r0 = k % 2 ? r - 8 : r - 14; pathEl(g, rl(Math.sin(a) * r0, -Math.cos(a) * r0, Math.sin(a) * (r - 2), -Math.cos(a) * (r - 2), { ov: 0, j: 0.2 }), 2.5, P.soft); } pathEl(g, `M0 ${-r + 14}L8 0L0 6L-8 0Z`, 3, C_EXAM); txtEl(g, 0, -r - 18, 'N', 24, C_EXAM, 700); return g; }
function chairG(s = 1) { const g = E('g'); pathEl(g, rl(-22 * s, 0, 22 * s, 0, { ov: 0 }) + rl(22 * s, 0, 22 * s, -46 * s, { ov: 0 }) + rl(-20 * s, 0, -20 * s, 34 * s, { ov: 0 }) + rl(20 * s, 0, 20 * s, 34 * s, { ov: 0 }), 4); return g; }
function quadG(s = 44) { const g = E('g'); pathEl(g, hachure([[-s, -s], [0, -s], [0, 0], [-s, 0]], 10, -45, { inset: 2 }), 2.5, C_EXAM); pathEl(g, rrect(-s, -s, 2 * s, 2 * s, { ov: 1.5 }) + rl(0, -s, 0, s, { ov: 0 }) + rl(-s, 0, s, 0, { ov: 0 }), 3.5); return g; }
function cardG(w = 170, h = 220, o = {}) { const g = E('g'); E('rect', { x: -w / 2 + 5, y: -h / 2 + 6, width: w, height: h, rx: 10, fill: '#000', 'fill-opacity': 0.06, stroke: 'none', 'data-nd': '' }, g); E('rect', { x: -w / 2, y: -h / 2, width: w, height: h, rx: 10, fill: o.fill || '#FFFFFC', stroke: 'none', 'data-nd': '' }, g); pathEl(g, rrect(-w / 2, -h / 2, w, h, { ov: 1.5, j: 0.6 }), 3.5, o.col || C_EXAM); return g; }
function missionCardG(kind, w = 170, h = 220, o = {}) {
  const g = cardG(w, h, o), ic = E('g', { transform: `translate(0 ${-h * 0.08}) scale(${o.s ?? 1})` }, g);
  if (kind === 'compass') ic.appendChild(compassG(46));
  else if (kind === 'find') { const c = E('g', { transform: 'translate(-18 6)' }, ic); c.appendChild(chairG(1.1)); txtEl(ic, 34, -10, '?', 54, C_EXAM, 700); }
  else if (kind === 'cover') ic.appendChild(quadG(44));
  else { let d = ''; for (let i = 0; i < 4; i++) d += rl(-w * 0.32, -40 + i * 26, w * (i % 2 ? 0.18 : 0.32), -40 + i * 26, { ov: 0, j: 0.5 }); pathEl(ic, d, 3, P.soft); }
  if (o.text) txtEl(g, 0, h / 2 - 34, o.text, 26, P.ink, 700);
  return g;
}
/* a laptop running a plain top-view simulator */
function simLaptopG(w = 320, h = 210) { const g = laptopG(w, h); E('rect', { x: -w / 2 + 16, y: -h + 16, width: w - 32, height: h - 32, fill: '#FFFFFC', stroke: 'none', 'data-nd': '' }, g); pathEl(g, gridD(-w / 2 + 16, -h + 16, w - 32, h - 32, 8, 5), 1.2, P.soft, { opacity: 0.6 }); pathEl(g, rrect(-w / 2 + 40, -h + 36, w - 80, h - 72, { ov: 1 }), 2.5, C_EXAM); E('circle', { cx: 10, cy: -h / 2, r: 7, fill: P.ink, 'data-nd': '' }, g); pathEl(g, rl(10, -h / 2, 44, -h / 2 - 22, { ov: 0 }), 2.5, P.soft, { 'stroke-dasharray': '6 6' }); return g; }
/* a sheet of handwriting: lines = [[text, size?, color?]] */
function noteSheetG(w, h, lines, o = {}) { const g = sheetG(w, h, o); lines.forEach(([s, z, c], i) => txtEl(g, 34, 56 + i * (o.lh ?? 50), s, z || 30, c || P.ink, 400, 'start')); return g; }
/* the scripted pilot: a little robot with a gear for a head */
function pilotG() { const g = E('g'); const R = 30; let d = ''; for (let k = 0; k < 8; k++) { const a = k * 45 * D2R; d += rl(Math.cos(a) * R, -60 + Math.sin(a) * R, Math.cos(a) * (R + 12), -60 + Math.sin(a) * (R + 12), { ov: 0, j: 0.3 }); } pathEl(g, d, 7); pathEl(g, rell(0, -60, R, R, { turn: 1.04 }) + rell(0, -60, 10, 10), 4); pathEl(g, rrect(-36, -18, 72, 80, { ov: 1 }), 4); pathEl(g, rl(-12, 62, -14, 96, { ov: 0 }) + rl(12, 62, 14, 96, { ov: 0 }) + rl(-36, 0, -62, 34, { ov: 0 }) + rl(36, 0, 62, 34, { ov: 0 }), 4); txtEl(g, 0, 22, '{ }', 26, C_OK, 700); return g; }
/* the grader: a green box with a tick */
function graderG(w = 230, h = 150) { const g = E('g'); E('rect', { x: -w / 2, y: -h / 2, width: w, height: h, rx: 14, fill: C_OK, 'fill-opacity': 0.1, stroke: 'none', 'data-nd': '' }, g); pathEl(g, rrect(-w / 2, -h / 2, w, h, { ov: 2 }), 4.5, C_OK); txtEl(g, 0, -h / 2 + 32, 'grader', 32, C_OK, 700); pathEl(g, checkD(0, 18, 26), 6, C_OK); return g; }
/* a speech bubble with a tail at the bottom-left; origin at the tail tip */
function sayBubbleG(w, h, text, col = P.ink) { const g = E('g'); E('rect', { x: 10, y: -h - 28, width: w, height: h, rx: 22, fill: '#FFFFFC', stroke: 'none', 'data-nd': '' }, g); pathEl(g, rrect(10, -h - 28, w, h, { ov: 2 }) + rl(0, 0, 30, -30, { ov: 0 }) + rl(0, 0, 60, -30, { ov: 0 }), 3.5, col); txtEl(g, 10 + w / 2, -28 - h / 2, text, 28, col, 400); return g; }
/* a thinking bubble that grows to the right; origin at its left edge, centre height */
function thinkG(w, h, col = C_QW) { const g = E('g'); E('ellipse', { cx: w / 2, cy: 0, rx: w / 2, ry: h / 2, fill: '#FFFFFC', stroke: 'none', 'data-nd': '' }, g); pathEl(g, rell(w / 2, 0, w / 2, h / 2, { turn: 1.03, j: 0.05 }), 4, col); let d = ''; const rows = Math.max(1, Math.floor(h / 34) - 1); for (let r = 0; r < rows; r++) { const y = -((rows - 1) * 30) / 2 + r * 30, x0 = w * 0.16 + (r % 2) * 10, x1 = w * (0.84 - 0.08 * (r % 2)); for (let x = x0; x < x1 - 16; x += 30) d += `M${f1(x)} ${f1(y)}q7 -8 14 0t14 0`; } pathEl(g, d, 3, col, { opacity: 0.7 }); [[-26, h * 0.34, 11], [-48, h * 0.48, 7]].forEach(([x, y, r]) => pathEl(g, rell(x, y, r, r, { turn: 1.05 }), 3, col)); return g; }
/* scissors, pointing down */
function scissorsG(s = 1) { const g = E('g', { transform: `scale(${s})` }); pathEl(g, rell(-18, -60, 14, 18, { turn: 1.05 }) + rell(18, -60, 14, 18, { turn: 1.05 }), 4); pathEl(g, rl(-10, -44, 16, 40, { ov: 0 }) + rl(10, -44, -16, 40, { ov: 0 }), 5); E('circle', { cx: 0, cy: -16, r: 4, fill: 'currentColor', 'data-nd': '' }, g); return g; }
/* a takeaway card: cyan-tinted box with one or two lines */
function takeG(lines, w = 700, z = 38) { const h = 56 + lines.length * (z + 14); const g = E('g'); E('rect', { x: -w / 2, y: -h / 2, width: w, height: h, rx: 16, fill: P.hlC, 'fill-opacity': 0.35, stroke: 'none', 'data-nd': '' }, g); pathEl(g, rrect(-w / 2, -h / 2, w, h, { ov: 2 }), 3.5); lines.forEach((s, i) => txtEl(g, 0, -h / 2 + 28 + (z + 14) * (i + 0.5) + 4, s, z, P.ink, 700)); return g; }
/* an end card: "next · NN · title" */
function endCardG(next) { const g = E('g'); E('rect', { x: -420, y: -70, width: 840, height: 140, rx: 70, fill: C_OK, 'fill-opacity': 0.12, stroke: 'none', 'data-nd': '' }, g); pathEl(g, rrect(-420, -70, 840, 140, { ov: 2 }), 4, C_OK); txtEl(g, 0, 2, next, 44, C_OK, 700); return g; }

/* a code card: white sheet, file name above, one mono line per row. API: show(t), light(i, t), unlight(i, t), hide(t). */
function codeCard(S, add, x, y, lines, o = {}) {
  const z = o.z ?? 24, lh = o.lh ?? 40, w = o.w ?? Math.max(...lines.map(s => s.length)) * z * 0.6 + 64, h = lines.length * lh + 48, gname = 'code' + (++CLIPN);
  const sheet = add(new Mob(sheetG(w, h, { tape: false }), P.ink), x, y);
  const file = add(hand(o.file || '', 26, C_EXAM, { anchor: 'start', w: 700 }), x + 4, y - 26);
  const L = lines.map((s, i) => add(mono(s, z, P.ink), x + 32, y + 24 + lh * (i + 0.5)));
  const tag = o.tag ? add(hand(o.tag, 24, P.soft, { anchor: 'end', w: 700 }), x + w - 6, y - 26) : null;
  [sheet, file, tag, ...L].forEach(m => { if (m) m.grp = gname; });
  const H = {};
  const api = {
    sheet, L, w, h,
    show(t, d = 0.5) { S.fadeIn(sheet, t, d, { dy: 10 }); S.create(file, t + 0.1, 0.5); if (tag) S.create(tag, t + 0.2, 0.4); L.forEach(m => { S.set(m, t, 0, { draw: 1 }); S.set(m, t + 0.15, d, { o: o.dim ?? 0.5 }); }); return api; },
    light(i, t, d = 0.35) { if (!H[i]) { H[i] = hlSub(S, L[i], lines[i].trim(), o.hl || P.hlO, { pad: 6 }); H[i].grp = gname; } S.set(L[i], t, d, { o: 1 }); S.fadeIn(H[i], t, d); return api; },
    unlight(i, t, d = 0.3) { S.set(L[i], t, d, { o: o.dim ?? 0.5 }); if (H[i]) S.fadeOut(H[i], t, d); return api; },
    hide(t, d = 0.4) { [sheet, file, tag, ...L, ...Object.values(H)].forEach(m => m && S.fadeOut(m, t, d)); return api; },
  };
  return api;
}

/* a bar that grows from the left; API: grow(t, d, frac) */
function growBar(S, add, trk, x, y, wFull, h, col, o = {}) {
  const T = trk({ f: 0 }), g = E('g');
  const r = E('rect', { x: 0, y: -h / 2, width: 0, height: h, rx: 6, fill: col, 'fill-opacity': o.op ?? 0.55, stroke: col, 'stroke-width': 2.5, 'data-nd': '' }, g);
  const m = add(new Mob(g, col), x, y, { draw: 1 });
  S.drive(() => { r.setAttribute('width', f1(Math.max(0.01, wFull * T.v.f))); });
  m.T = T;  /* the tracker counts with the bar in the clutter probe */
  m.grow = (t, d, f) => { S.set(T, t, d, { f }); return m; };
  return m;
}

/* ================= kit 10: doodles for episode 06 (imitation) ================= */
/* new ink: teal = the student (Qwen after imitation training). Teacher stays blue, untrained Qwen stays magenta. */
const C_STU = '#0F8B8D';

/* a stack of cards seen edge-on: n cards, top card faces up; origin at the bottom centre */
function stackG(n, w = 220, h = 150, col = C_EXAM, o = {}) {
  const g = E('g'), gap = o.gap ?? 7;
  for (let i = 0; i < n; i++) {
    const y = -h - i * gap;
    E('rect', { x: -w / 2 + (i % 2 ? 3 : -3), y, width: w, height: h, rx: 8, fill: o.fill || '#FFFFFC', stroke: 'none', 'data-nd': '' }, g);
    pathEl(g, rrect(-w / 2 + (i % 2 ? 3 : -3), y, w, h, { ov: 1, j: 0.5 }), 2.5, col);
  }
  if (o.lines !== false) { let d = ''; const top = -h - (n - 1) * gap; for (let i = 0; i < 3; i++) d += rl(-w * 0.32, top + 40 + i * 30, w * (i % 2 ? 0.16 : 0.32), top + 40 + i * 30, { ov: 0, j: 0.5 }); pathEl(g, d, 3, P.soft); }
  return g;
}
/* a crescent moon */
function moonG(r = 34) { const g = E('g'); E('path', { d: `M0 ${-r}A${r} ${r} 0 1 0 0 ${r}A${r * 0.72} ${r} 0 1 1 0 ${-r}Z`, fill: '#F3E6B0', stroke: 'none', 'data-nd': '' }, g); pathEl(g, `M0 ${-r}A${r} ${r} 0 1 0 0 ${r}A${r * 0.72} ${r} 0 1 1 0 ${-r}`, 3, '#A07A10'); return g; }
/* a stopwatch-style clock */
function clockG(r = 34) { const g = E('g'); E('circle', { r, fill: '#FFFFFC', stroke: 'none', 'data-nd': '' }, g); pathEl(g, rell(0, 0, r, r, { turn: 1.04 }), 3.5); pathEl(g, rl(0, 0, 0, -r * 0.62, { ov: 0 }) + rl(0, 0, r * 0.45, r * 0.2, { ov: 0 }), 3.5); pathEl(g, rl(-8, -r - 10, 8, -r - 10, { ov: 0 }) + rl(0, -r - 10, 0, -r, { ov: 0 }), 3.5); return g; }
/* a grid of weights: small dashes in cells; origin top-left */
function weightGridG(cols, rows, cell = 40)  /* drawn in currentColor so the mob's colour can tween */ {
  const g = E('g'), W = cols * cell, Hh = rows * cell;
  g._bg = E('rect', { x: 0, y: 0, width: W, height: Hh, rx: 10, fill: 'currentColor', 'fill-opacity': 0.08, stroke: 'none', 'data-nd': '' }, g);
  pathEl(g, gridD(0, 0, W, Hh, cols, rows), 1, 'currentColor', { opacity: 0.35 });
  let d = ''; for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) { const x = i * cell + cell / 2, y = j * cell + cell / 2, a = ((i * 7 + j * 13) % 9 - 4) * 0.12; d += `M${f1(x - 8 * Math.cos(a))} ${f1(y - 8 * Math.sin(a))}L${f1(x + 8 * Math.cos(a))} ${f1(y + 8 * Math.sin(a))}`; }
  pathEl(g, d, 3, 'currentColor', { opacity: 0.7 });
  pathEl(g, rrect(0, 0, W, Hh, { ov: 2 }), 4, 'currentColor');
  return g;
}
/* a textbook with sticky notes */
function textbookG() {
  const g = E('g');
  E('path', { d: 'M-170 -110L0 -86L170 -110V110L0 134L-170 110Z', fill: '#FFFFFC', stroke: 'none', 'data-nd': '' }, g);
  pathEl(g, 'M-170 -110L0 -86L170 -110V110L0 134L-170 110Z', 4); pathEl(g, rl(0, -86, 0, 134, { ov: 0 }), 3);
  let d = ''; for (let i = 0; i < 6; i++) { d += rl(-146, -66 + i * 30 + 3, -24, -62 + i * 30 + 4, { ov: 0, j: 0.4 }); d += rl(24, -62 + i * 30 + 4, 146, -66 + i * 30 + 3, { ov: 0, j: 0.4 }); }
  pathEl(g, d, 2.5, P.soft);
  return g;
}
function stickyG(w = 70, h = 60, rot = 0, col = C_STU) { const g = E('g', { transform: `rotate(${rot})` }); E('rect', { x: -w / 2, y: -h / 2, width: w, height: h, fill: col, 'fill-opacity': 0.28, stroke: 'none', 'data-nd': '' }, g); pathEl(g, rrect(-w / 2, -h / 2, w, h, { ov: 1 }), 2.5, col); pathEl(g, rl(-w / 2 + 10, -6, w / 2 - 12, -8, { ov: 0, j: 0.5 }) + rl(-w / 2 + 10, 10, w / 4, 9, { ov: 0, j: 0.5 }), 2.5, col); return g; }
/* a flashcard; origin centre */
function flashG(w, h, title, col = P.ink, o = {}) {
  const g = E('g');
  E('rect', { x: -w / 2 + 6, y: -h / 2 + 8, width: w, height: h, rx: 14, fill: '#000', 'fill-opacity': 0.06, stroke: 'none', 'data-nd': '' }, g);
  g._bg = E('rect', { x: -w / 2, y: -h / 2, width: w, height: h, rx: 14, fill: o.fill || '#FFFFFC', stroke: 'none', 'data-nd': '' }, g);
  pathEl(g, rrect(-w / 2, -h / 2, w, h, { ov: 1.5, j: 0.6 }), 3.5, col);
  if (title) txtEl(g, 0, o.ty ?? -h / 2 + 34, title, o.z ?? 32, col, 700);
  if (o.lines) { let d = ''; for (let i = 0; i < o.lines; i++) d += rl(-w * 0.38, -h / 2 + 76 + i * 28, w * (i % 3 === 2 ? 0.1 : 0.38), -h / 2 + 76 + i * 28, { ov: 0, j: 0.5 }); pathEl(g, d, 2.5, P.soft); }
  return g;
}
/* a rubber stamp */
function stampG(text, col = C_OK, w = 300) { const g = E('g', { transform: 'rotate(-7)' }); pathEl(g, rrect(-w / 2, -30, w, 60, { ov: 1.5 }), 4, col); txtEl(g, 0, 0, text, 30, col, 700); return g; }
/* a row of n step boxes; returns a mob with .fill(t, d, k) that fills the first k boxes */
function stepCounter(S, add, trk, x, y, n, col, o = {}) {
  const T = trk({ f: 0 }), g = E('g'), bw = o.bw ?? 26, gap = o.gap ?? 6, boxes = [];
  for (let i = 0; i < n; i++) { const r = E('rect', { x: i * (bw + gap), y: -bw / 2, width: bw, height: bw, rx: 4, fill: col, 'fill-opacity': 0, stroke: 'none', 'data-nd': '' }, g); boxes.push(r); pathEl(g, rrect(i * (bw + gap), -bw / 2, bw, bw, { ov: 0.8, j: 0.4 }), 2.2, P.soft); }
  const m = add(new Mob(g, P.ink), x, y);
  S.drive(() => { const k = T.v.f; boxes.forEach((r, i) => r.setAttribute('fill-opacity', (0.6 * clamp(k - i)).toFixed(3))); });
  m.T = T; m.fill = (t, d, k) => { S.set(T, t, d, { f: k }, linear); return m; }; m.w = n * (bw + gap) - gap;
  return m;
}
/* a cloud icon (no label) centred at the origin */
function cloudIconG(rx = 70, ry = 34, col = C_SON) { const g = E('g'); E('ellipse', { cx: 0, cy: 0, rx, ry, fill: '#FFFFFC', stroke: 'none', 'data-nd': '' }, g); pathEl(g, rell(0, 0, rx, ry, { turn: 1.04 }), 3.5, col); pathEl(g, `M${-rx * 0.5} ${-ry * 0.5}a${rx * 0.3} ${ry * 0.7} 0 0 1 ${rx * 0.55} ${-ry * 0.4}a${rx * 0.32} ${ry * 0.7} 0 0 1 ${rx * 0.5} ${ry * 0.3}`, 3, col); return g; }
