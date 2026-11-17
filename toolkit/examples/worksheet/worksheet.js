/* Worksheet kit: paste inside a scene's build(), after the standard helpers (label, monoL, boxMob, grp, W, F, O, bt, hlBar,
   frame from the map-and-strip pattern) are defined. It expects, above build():
     WD   the row names, e.g. ['the', 'river', 'bank']          fm  number -> screen text, e.g. 0.46 -> "0.46", −0.75 -> "−0.75"
   Used in Transformer: Unraveling the blackbox, Episode 2 (the encoder, by hand). See README.md for the rules it serves. */
  /* write so the label has landed before its line ends */
  const Wb = (m, t, d, id) => W(m, Math.min(t, bt(id).end - d - 0.25), d);
  /* an outline that marks a number or a word (cleaner than a hand-drawn loop over digits) */
  const ringM = (p, x, y, w, h, c) => boxMob(p, x, y, w, h, c, 0, { w: 5 });
  /* ---------- the worksheet ---------- */
  const WCOL = ['#A0522D', '#00838F', '#3949AB'];                /* the, river, bank: one colour per word, everywhere */
  const tx = (p, src, x, y, z = 44, c = P.ink) => p(tex(src, z, c), x, y);   /* typeset math; show with F() */
  /* a matrix in the left column: tex title, then one row per word, row name in the word's colour */
  let blkN = 0;
  const block = (p, name, Mx, y0, o = {}) => {
    const id = ++blkN, d = o.d ?? 2, z = o.z ?? 32, dx = o.dx ?? (Mx[0].length > 2 ? 88 : 104), x0 = o.x0 ?? 200, dy = o.dy ?? 48;
    const TX = o.tx ?? 70, ttl = tx(p, name, TX, y0 + dy, 40, P.ink);
    const shp_ = label(p, Mx.length + ' × ' + Mx[0].length, TX, y0 + dy * 2 + 6, P.soft, 26);
    const nm = WD.map((w, i) => label(p, w, x0 - 20, y0 + i * dy + dy / 2 + 24, WCOL[i], 28, 'end'));
    const cells = Mx.map((r, i) => r.map((v, j) => monoL(p, fm(v, d), x0 + 40 + j * dx, y0 + i * dy + dy / 2 + 24, z, WCOL[i], 'middle')));
    const all = [ttl, shp_, ...nm, ...cells.flat()]; grp(all, 'blk' + id);
    const w = 40 + (Mx[0].length - 1) * dx + 50;
    return { all, cells, nm, ttl, y0, dy, x0, w,
      show(t, gap = 0.04) { F(ttl, t, 0.3); W(shp_, t + 0.1, 0.25); nm.forEach((m, i) => W(m, t + 0.15 + i * 0.05, 0.25)); cells.flat().forEach((m, i) => W(m, t + 0.3 + i * gap, 0.25)); },
      rowY: i => y0 + i * dy + dy / 2 + 24,
      hl(i, t, d_ = 1.2, gname) { const y = y0 + i * dy + dy / 2 + 24, m = p(hlBar(x0 - 100, x0 + w, y, dy - 6, P.hlO), 0, 0); m.grp = gname || ('hlb' + id + '_' + i + '_' + Math.round(t * 10)); F(m, t, 0.2); O(m, t + d_, 0.3); return m; } };
  };
  /* the shape strip, under the loop strip, in page coordinates; light(i) marks the current matrix */
  const SHAPES = ['X 3 × 4', 'Q, K, V 3 × 2', 'scores 3 × 3', 'weights 3 × 3', 'Z 3 × 2', 'output 3 × 4', 'after attn 3 × 4', 'hidden 3 × 6', 'F 3 × 4', 'M 3 × 4'];
  const SHW = 136, SHX = i => 98 + i * 141, SHY = 122;
  const shapeStrip = (p, t, g, lit) => {
    const chips = SHAPES.map((s, i) => boxMob(p, SHX(i), SHY, SHW, 34, P.soft, 0.03, { w: 2 })), labs = SHAPES.map((s, i) => label(p, s, SHX(i), SHY, P.soft, 18));
    grp([...chips, ...labs], g); chips.forEach(m => F(m, t, 0.3)); labs.forEach(m => W(m, t + 0.3, 0.3));
    const light = (i, tl, gname) => { const m = p(hlBar(SHX(i) - SHW / 2 + 3, SHX(i) + SHW / 2 - 3, SHY, 28, P.hlC), 0, 0); m.grp = gname || ('shl' + i + '_' + Math.round(tl * 10)); F(m, tl, 0.3); return m; };
    const lt = (lit ?? []).map(i => light(i, t + 0.3, g));
    return { light, lt };
  };
  /* the worksheet column arrives with the page's frame, as one thing */
  const wsCol = (fr, bs) => bs.forEach((b, i) => { grp(b.all, fr.g); b.show(fr.t + 0.35 + i * 0.1, 0.01); });
  /* frame: map, loop strip ("forward" lit) and shape strip arrive with the camera as one thing */
  const frame3 = (p, id, o = {}) => {
    const fr = frame(p, id, { strip: true, step: 1, lit: o.lit, lead: o.lead });
    const ss = o.shapes === false ? null : shapeStrip(p, fr.t, fr.g, o.shp);
    return { ...fr, ss };
  };
