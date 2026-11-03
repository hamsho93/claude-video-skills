/* ================= Margin Notes 06 · Learning by imitation: one scene on a 4 x 2 spread =================
   pages: (0,1) title · (0,0) ch1 · (1,0) ch2 · (2,0) ch3 · (3,0) ch4 · (3,1) ch5 · (2,1) ch6 · (1,1) end */
const COLS10 = 4, ROWS10 = 2;
const SPREAD10 = { x: (COLS10 * PW + (COLS10 - 1) * GUT) / 2, y: (ROWS10 * PH + (ROWS10 - 1) * GUT) / 2 };

function build(host) {
  const S = new Scene(host);
  const world = E('g', {}, S.root), fixed = E('g', {}, S.root);
  const [cx0, cy0] = pageC(0, 1);
  const cam = S.add(new Cam(world), cx0, cy0, { s: 1, o: 1 }, fixed);
  const a = n => { const v = TM.a[n]; if (v === undefined) throw new Error('anchor ' + n); return v; };
  const bt = id => { const v = TM.beats[id]; if (!v) throw new Error('beat ' + id); return v; };
  const W = (m, t, d) => S.create(m, t, d), F = (m, t, d = 0.5, sh) => S.fadeIn(m, t, d, sh), O = (ms, t, d = 0.4) => S.out([].concat(ms).filter(Boolean), t, d);
  const H = (s, z, c, o) => hand(s, z, c, o);
  const pg = (c, r) => { const [ox, oy] = pageO(c, r); const f = (m, x, y, o) => S.add(m, ox + x, oy + y, o, world); f.ox = ox; f.oy = oy; f.mv = (m, t, d, x, y, e) => S.move(m, t, d, ox + x, oy + y, e); return f; };
  const dim = (ms, t, o = 0.28, d = 0.35) => [].concat(ms).forEach(m => m && S.set(m, t, d, { o }));
  const trk = init => S.add(new Trk(init), 0, 0, { ...init }, fixed);
  const go = (c, r, t, d = 1.1, dip = 0, s = 1) => { const [x, y] = pageC(c, r); camTo(S, cam, t, d, x, y, s, dip); };
  const grp = (ms, name) => ms.forEach(m => { if (m) { m.grp = name; if (m.T) m.T.grp = name; } });
  const pulse = (m, t, k = 1.18) => { const s = m.cur.s; S.set(m, t, 0.25, { s: s * k }); S.set(m, t + 0.25, 0.35, { s }); };
  const pageTitle = (p, text, t) => {
    const tag = p(H('Margin Notes · 06 · Learning by imitation', 24, P.olive, { anchor: 'start', w: 700 }), 150, 60);
    const ti = p(H(text, 46, P.green, { anchor: 'start', w: 700 }), 148, 110);
    const un = p(ink(rl(146, 142, 158 + ti.textEl.getComputedTextLength(), 140, { bow: 0.003 }), P.green, 4), 0, 0);
    W(tag, t, 0.4); W(ti, t + 0.1, 0.9); W(un, t + 0.9, 0.35);
    grp([tag, ti, un], 'title' + t);
  };
  const label = (p, s, x, y, c = P.ink, z = 32, anchor = 'middle') => p(H(s, z, c, { anchor, w: 700 }), x, y);
  const arrowM = (p, x1, y1, x2, y2, c = P.ink, w = 4, o = {}) => p(ink(rarrow(x1, y1, x2, y2, { head: o.head ?? 18, bow: o.bow }), c, w, o.dash ? { dash: o.dash } : {}), 0, 0);
  const gm = (p, g, col = P.ink, x = 0, y = 0, o) => p(new Mob(g, col), x, y, o);
  const take = (p, lines, x, y, w = 700, t) => { const m = gm(p, takeG(lines, w), P.ink, x, y); F(m, t, 0.6, { dy: 14 }); return m; };
  const tick = (p, x, y, s = 16, c = C_OK) => p(ink(checkD(x, y, s), c, 5), 0, 0);
  const cross = (p, x, y, s = 13, c = C_BAD) => p(ink(crossD(x, y, s), c, 5), 0, 0);
  /* a vertical bar growing up from its base (x, y) */
  const vBar = (p, x, y, w, hFull, col, op = 0.55) => { const T = trk({ f: 0 }), g = E('g'); const r = E('rect', { x: -w / 2, y: 0, width: w, height: 0, rx: 4, fill: col, 'fill-opacity': op, stroke: col, 'stroke-width': 2.5, 'data-nd': '' }, g); const m = p(new Mob(g, col), x, y, { draw: 1 }); S.drive(() => { const h = Math.max(0.01, hFull * T.v.f); r.setAttribute('y', f1(-h)); r.setAttribute('height', f1(h)); }); m.T = T; m.grow = (t, d, f = 1) => { S.set(T, t, d, { f }); return m; }; return m; };
  const dot = (p, x, y, r, col) => gm(p, (() => { const g = E('g'); E('circle', { cx: 0, cy: 0, r, fill: col, 'data-nd': '' }, g); return g; })(), col, x, y);
  const ring = (p, x, y, r, col) => gm(p, (() => { const g = E('g'); pathEl(g, rell(0, 0, r, r, { turn: 1.05 }), 3.5, col); return g; })(), col, x, y);

  /* ---------- paper: a 4 x 2 spread of graph-paper pages on a desk ---------- */
  const pat = E('pattern', { id: 'gp40', width: 40, height: 40, patternUnits: 'userSpaceOnUse' }, DEFS);
  E('path', { d: 'M40 0H0V40', fill: 'none', stroke: '#D9E3E6', 'stroke-width': 1.2 }, pat);
  const pat2 = E('pattern', { id: 'gp200', width: 200, height: 200, patternUnits: 'userSpaceOnUse' }, DEFS);
  E('path', { d: 'M200 0H0V200', fill: 'none', stroke: '#D3DEE2', 'stroke-width': 2.2 }, pat2);
  E('rect', { x: -4000, y: -4000, width: 20000, height: 12000, fill: '#E3DFCB' }, world);
  for (let r = 0; r < ROWS10; r++) for (let c = 0; c < COLS10; c++) {
    const [ox, oy] = pageO(c, r);
    E('rect', { x: ox + 8, y: oy + 10, width: PW, height: PH, fill: '#000', 'fill-opacity': 0.06 }, world);
    E('rect', { x: ox, y: oy, width: PW, height: PH, fill: P.paper }, world);
    E('rect', { x: ox, y: oy, width: PW, height: PH, fill: 'url(#gp40)' }, world);
    E('rect', { x: ox, y: oy, width: PW, height: PH, fill: 'url(#gp200)' }, world);
  }
  const tg = E('g'); E('rect', { x: -96, y: -30, width: 192, height: 60, fill: P.hlC, 'fill-opacity': 0.55, stroke: 'none' }, tg); pathEl(tg, rrect(-96, -30, 192, 60), 3, P.ink); txtEl(tg, 0, -1, 'EPISODE 06', 28, P.ink, 700);
  const tab = S.add(new Mob(tg, P.ink), 1750, 74, { r: 3 }, fixed); F(tab, 0.2, 0.4);

  /* ================= title page (0,1) ================= */
  const pT = pg(0, 1);
  const iTag = label(pT, 'Margin Notes · 06', 960, 330, P.olive, 40);
  const iTi = pT(H('Learning by imitation', 120, P.green, { w: 700 }), 960, 455);
  const iUn = pT(ink(rl(450, 540, 1470, 536, { bow: 0.004 }), P.green, 5), 0, 0);
  W(iTag, 0.3, 0.6); W(iTi, a('title') - 1.1, 1.3); W(iUn, a('title') + 0.3, 0.4);
  grp([iTag, iTi, iUn], 'intro');

  /* ================= (0,0) · chapter 1 · keep only the good flights ================= */
  const p1 = pg(0, 0), t1 = bt('c1_01').t;
  go(0, 0, t1 - 1.2, 1.1);
  pageTitle(p1, '1 · Keep only the good flights', t1 - 0.3);
  const stk = gm(p1, stackG(12, 230, 150), C_EXAM, 380, 800);
  F(stk, a('examples') - 0.3, 0.5, { dy: 20 });
  const son = gm(p1, modelBoxG('Sonnet', C_SON, 200, 140, { dots: 6 }), C_SON, 380, 320);
  const bedL = label(p1, 'Amazon Bedrock', 380, 420, C_SON, 28);
  F(son, a('sonnet') - 0.3, 0.4); W(bedL, a('bedrock') - 0.1, 0.6);
  const twoL = label(p1, '2,000 practice missions', 380, 860, C_EXAM, 32); W(twoL, a('twok') - 0.1, 0.8);
  const drn = gm(p1, droneG(), P.ink, 170, 515, { s: 0.3 });
  F(drn, a('twok') + 0.3, 0.3); p1.mv(drn, a('twok') + 0.4, 1.8, 600, 515); O(drn, a('twok') + 2.3, 0.3);
  /* never the exam's own missions */
  const exD = gm(p1, stackG(5, 200, 140, C_EXAM, { fill: '#F1F5DF' }), C_EXAM, 1500, 800), exLock = gm(p1, lockG(2), P.ink, 1500, 690);
  const exL = label(p1, 'the exam, locked', 1500, 860, C_EXAM, 30);
  F(exD, a('recipe') - 0.3, 0.4); F(exLock, a('recipe') + 0.1, 0.3, { dy: -20 }); W(exL, a('recipe') + 0.2, 0.6);
  const wall = p1(ink(rl(948, 500, 948, 880, { ov: 0 }) + rl(972, 500, 972, 880, { ov: 0 }) + [560, 640, 720, 800].map(y => rl(948, y, 972, y, { ov: 0 })).join(''), P.ink, 5), 0, 0);
  const sameL = label(p1, 'never the same missions', 960, 925, P.ink, 28);
  W(wall, a('samemiss') - 0.2, 0.6); W(sameL, a('samemiss') + 0.3, 0.6);
  const wallTk = tick(p1, 966, 460, 22); W(wallTk, a('test') - 0.1, 0.4);
  grp([wall, wallTk], 'wall');
  /* a daily quota: wait a random, growing time, try again */
  const t13 = bt('c1_03').t;
  O([son, bedL, exD, exLock, exL, wall, wallTk, sameL, twoL], t13 - 0.3, 0.35);
  const cc1 = codeCard(S, p1, 720, 270, [
    'while True:',
    '    try:',
    '        return self._inner.converse(prompt, tool_specs)',
    '    except BedrockThrottled as err:',
    '        if attempt >= self._retries:',
    '            raise',
    '        # Full jitter: uniform in [0, min(max, base * 2**attempt)].',
    '        wait = random.uniform(0, min(self._max, self._base * (2 ** attempt)))',
    '        self._sleep(wait)',
    '        attempt += 1'], { file: 'src/dexi_planner/clients.py', tag: 'Amazon Bedrock · retry', z: 22, lh: 38 });
  cc1.show(t13 + 0.1).light(3, a('turned') - 0.2).unlight(3, a('waited') - 0.3).light(7, a('waited') - 0.2).light(8, a('waited') + 1.5);
  const moons = [0, 1].map(k => gm(p1, moonG(30), P.ink, 300 + k * 160, 470));
  grp(moons, 'moons'); moons.forEach((m, k) => F(m, a('nights') - 1.6 + k * 1.0, 0.5, { dy: 50 }));
  const nightL = label(p1, 'two nights', 380, 395, P.ink, 28); W(nightL, a('nights') + 0.1, 0.5);
  /* the exam's grader marks every flight */
  const t14 = bt('c1_04').t;
  cc1.hide(t14 - 0.25); O([...moons, nightL], t14 - 0.25, 0.35);
  const grd = gm(p1, graderG(230, 150), C_OK, 960, 520);
  F(grd, a('grader') - 0.3, 0.4);
  const flow = Array.from({ length: 6 }, () => gm(p1, missionCardG('blank', 80, 100), C_EXAM, 400, 520));
  grp(flow, 'flow');
  flow.forEach((m, k) => { const t = a('grader') + 0.1 + k * 0.32; F(m, t, 0.15); p1.mv(m, t + 0.1, 0.7, 830, 520); S.set(m, t + 0.75, 0.15, { o: 0 }); });
  /* kept and thrown out: about half each */
  const keep = gm(p1, stackG(7, 200, 130, C_OK, { fill: '#EEF6E8' }), C_OK, 1380, 820), toss = gm(p1, stackG(6, 200, 130, P.soft, { fill: '#F1F0EA' }), P.soft, 1700, 820);
  const kA = arrowM(p1, 1085, 560, 1330, 650, C_OK, 4), tA = arrowM(p1, 1085, 590, 1640, 670, P.soft, 3.5);
  W(kA, a('passed') - 0.4, 0.4); F(keep, a('passed') - 0.1, 0.5, { dy: 20 }); W(tA, a('passed') + 0.2, 0.4); F(toss, a('passed') + 0.4, 0.5, { dy: 20 });
  grp([kA, keep], 'keep'); grp([tA, toss], 'toss');
  const keepL = label(p1, 'kept: about half', 1380, 870, C_OK, 30), tossL = label(p1, 'thrown out', 1700, 870, P.soft, 28);
  W(keepL, a('half') - 0.1, 0.7); W(tossL, a('half') + 0.5, 0.5);
  /* pass rate by kind */
  const BX = [1290, 1390, 1490], BY = 560, BHt = 180;
  const half = p1(ink(rl(1240, BY - BHt / 2, 1540, BY - BHt / 2, { ov: 0 }), P.soft, 2.5, { dash: '8 8' }), 0, 0);
  const prT = label(p1, 'share that passed', 1390, BY - BHt - 34, P.ink, 26);
  const bars1 = [[81, 'patrol', 'patrols'], [44, 'find', 'searches'], [39, 'cover', 'coverage']].map(([v, s, an], k) => {
    const b = vBar(p1, BX[k], BY, 56, BHt * v / 100, C_OK, 0.5), l = label(p1, s, BX[k], BY + 24, P.ink, 24);
    F(b, a(an) - 0.3, 0.2); b.grow(a(an) - 0.3, 0.6); W(l, a(an) - 0.1, 0.4); grp([b, l], 'bar1' + k); return [b, l];
  });
  F(prT, a('patrols') - 0.6, 0.4); W(half, a('coverage') + 0.5, 0.5);
  const halfL = label(p1, 'half', 1560, BY - BHt / 2, P.soft, 24, 'start'); W(halfL, a('coverage') + 0.8, 0.4);
  /* rejection sampling */
  const rsL = label(p1, 'rejection sampling', 760, 730, P.green, 48);
  W(rsL, a('rejection') - 0.1, 1.0); const rsH = hlBehind(S, rsL, 'rejection sampling', P.hlL); F(rsH, a('rejection') + 0.9, 0.4);
  const tk1 = take(p1, ['Copy only the flights that passed.'], 760, 960, 700, a('copy') - 0.2);

  /* ================= (1,0) · chapter 2 · look before you filter ================= */
  const p2 = pg(1, 0), t21 = bt('c2_01').t;
  go(1, 0, t21 - 0.9, 1.0);
  pageTitle(p2, '2 · Look before you filter', t21 - 0.3);
  const keep2 = gm(p2, stackG(7, 200, 130, C_OK, { fill: '#EEF6E8' }), C_OK, 290, 820), keep2L = label(p2, 'kept flights', 290, 870, C_OK, 28);
  F(keep2, t21 - 0.1, 0.4); W(keep2L, t21 + 0.2, 0.5);
  const sci2 = gm(p2, scissorsG(1.2), P.ink, 290, 520);
  F(sci2, a('cut') - 0.3, 0.4, { dy: -30 });
  const wasteL = label(p2, 'wasted steps?', 290, 400, P.ink, 30); W(wasteL, a('wasted') - 0.1, 0.6);
  /* the real patrol histogram: extra steps over the scripted pilot */
  const HIST = [242, 19, 11, 72, 51, 72, 43], HX = k => 640 + k * 105, HY = 760, HS = 360 / 242;
  const hAx = gm(p2, (() => { const g = E('g'); pathEl(g, rl(580, HY, 1360, HY, { ov: 0 }), 3, P.soft); HIST.forEach((_, k) => txtEl(g, HX(k), HY + 26, '+' + k, 24, P.soft, 700)); txtEl(g, 970, HY + 70, 'wasted steps in a passing patrol', 28, P.ink, 700); return g; })(), P.ink);
  const hT = label(p2, 'patrol flights', 640 - 40, 330, P.ink, 30, 'start');
  W(hAx, a('look') - 0.2, 0.7); W(hT, a('look') + 0.2, 0.6);
  const hB = HIST.map((v, k) => vBar(p2, HX(k), HY, 74, v * HS, C_OK, 0.45));
  grp(hB, 'hist'); hB.forEach((b, k) => { F(b, a('humps') - 1.0 + k * 0.12, 0.15); b.grow(a('humps') - 1.0 + k * 0.12, 0.5); });
  const humpD = (k0, k1) => { const top = HY - Math.max(...HIST.slice(k0, k1 + 1)) * HS - 22; return rrect(HX(k0) - 50, top, HX(k1) - HX(k0) + 100, HY - top + 8, { ov: 1 }); };
  const hump1 = p2(ink(humpD(0, 0), C_SON, 3.5, { dash: '10 8' }), 0, 0), hump2 = p2(ink(humpD(3, 6), C_SON, 3.5, { dash: '10 8' }), 0, 0);
  W(hump1, a('humps') + 0.1, 0.6); W(hump2, a('humps') + 0.5, 0.7); grp([hump1, hump2], 'humps');
  /* the second hump: one wording */
  pulse(hump2, a('second') - 0.05, 1.04);
  const scanC = gm(p2, noteSheetG(330, 110, [['"scan the room"', 34, C_EXAM]]), P.ink, 1480, 260, { r: 1.5 });
  F(scanC, a('scan') - 0.3, 0.4, { dy: 10 });
  const scanA = arrowM(p2, 1520, 380, 1200, 560, C_EXAM, 4); W(scanA, a('scan') + 0.3, 0.5);
  const DC = [1650, 620], DL = 70;
  const hd = gm(p2, (() => { const g = E('g'); pathEl(g, rell(0, 0, 14, 14, { turn: 1.05 }), 4, P.ink); [[0, -1], [1, 0], [0, 1], [-1, 0]].forEach(([x, y]) => pathEl(g, rarrow(x * 20, y * 20, x * DL, y * DL, { head: 12 }), 3.5, C_SON)); return g; })(), C_SON, DC[0], DC[1]);
  F(hd, a('paused') - 0.4, 0.4);
  const holds = [[0, -1], [1, 0], [0, 1], [-1, 0]].map(([x, y], k) => { const m = gm(p2, (() => { const g = E('g'); E('rect', { x: -9, y: -11, width: 6, height: 22, rx: 2, fill: C_SON, 'data-nd': '' }, g); E('rect', { x: 3, y: -11, width: 6, height: 22, rx: 2, fill: C_SON, 'data-nd': '' }, g); return g; })(), C_SON, DC[0] + x * (DL + 26), DC[1] + y * (DL + 26)); F(m, a('paused') + 0.1 + k * 0.35, 0.2); return m; });
  grp(holds, 'holds');
  const lookL = label(p2, 'a pause at each heading', DC[0], DC[1] + 150, C_SON, 28); W(lookL, a('looks') - 0.3, 0.6);
  /* cutting it would lose that wording */
  const t24 = bt('c2_04').t;
  O([wasteL, scanA], t24 - 0.3, 0.3);
  p2.mv(sci2, a('thrown') - 0.4, 0.9, (HX(3) + HX(6)) / 2, 590);
  dim(hB.slice(3), a('thrown') + 0.6, 0.3, 0.5); dim(hump2, a('thrown') + 0.6, 0.3, 0.5);
  const loseL = label(p2, 'almost no examples left of that wording', (HX(3) + HX(6)) / 2, 470, C_BAD, 28); W(loseL, a('noex') - 0.1, 0.8);
  /* so nothing was cut */
  const t25 = bt('c2_05').t;
  p2.mv(sci2, a('nothing') - 0.3, 0.6, 1450, 830); O(sci2, a('nothing') + 0.2, 0.3); O(loseL, a('nothing') - 0.3, 0.3);
  dim(hB.slice(3), a('nothing') + 0.3, 1, 0.5); dim(hump2, a('nothing') + 0.3, 1, 0.5);
  const tk2 = take(p2, ['Look at the data before you filter it.'], 1500, 960, 700, bt('c2_05').t - 0.1);

  /* ================= (2,0) · chapter 3 · every step becomes an example ================= */
  const p3 = pg(2, 0), t31 = bt('c3_01').t;
  go(2, 0, t31 - 0.6, 1.0);
  pageTitle(p3, '3 · Every step becomes an example', t31 - 0.3);
  const FP = [[220, 430], [400, 300], [600, 390], [800, 280], [1000, 370], [1200, 290]];
  const fpath = p3(ink(catmull(FP), C_SON, 4.5), 0, 0), fdots = FP.map(([x, y]) => dot(p3, x, y, 11, C_SON));
  const fpL = label(p3, "one of Sonnet's passing flights", 1240, 250, C_SON, 28, 'start');
  W(fpath, a('decisions') - 0.6, 1.0); fdots.forEach((m, k) => F(m, a('decisions') - 0.4 + k * 0.12, 0.2)); W(fpL, a('decisions') + 0.3, 0.6);
  grp([fpath, ...fdots], 'flight');
  const CX = k => 260 + k * 250, CY = 640;
  const cards = FP.map((_, k) => gm(p3, flashG(200, 130, null, P.ink, { lines: 2, ty: 0 }), P.ink, CX(k), CY));
  const conn = FP.map(([x, y], k) => p3(ink(rl(x, y + 14, CX(k), CY - 72, { ov: 0 }), P.soft, 2.5, { dash: '6 7' }), 0, 0));
  const mvs = FP.map((_, k) => p3(chip('move', 20, P.hlL), CX(k) + 46, CY + 38));
  grp(cards, 'cards'); grp(conn, 'conn'); grp(mvs, 'mvs');
  cards.forEach((m, k) => F(m, a('situation') - 0.3 + k * 0.1, 0.3, { dy: 16 })); conn.forEach((m, k) => W(m, a('situation') - 0.2 + k * 0.1, 0.3));
  mvs.forEach((m, k) => F(m, a('move') - 0.1 + k * 0.1, 0.25));
  const sitL = label(p3, 'situation', 120, CY - 20, P.ink, 26, 'end'), movL = label(p3, 'move', 120, CY + 38, P.ink, 26, 'end');
  W(sitL, a('situation'), 0.4); W(movL, a('move'), 0.4);
  const rejX = cross(p3, CX(3) + 80, CY - 52, 14); W(rejX, a('rejected') - 0.1, 0.35);
  dim([cards[3], mvs[3]], a('rejected') + 0.5, 0.2); p3.mv(cards[3], a('rejected') + 0.5, 0.5, CX(3), CY + 40);
  const skipL = label(p3, 'rejected: skipped', CX(3), CY + 120, C_BAD, 26); W(skipL, a('rejected') + 0.4, 0.5);
  /* like flashcards: one card flips */
  const t32 = bt('c3_02').t;
  O([fpath, ...fdots, fpL, ...cards, ...conn, ...mvs, sitL, movL, rejX, skipL], t32 - 0.35, 0.35);
  const FL = trk({ f: 0 }), FC = [960, 560];
  const flipG = E('g'), flipIn = E('g', {}, flipG), fFront = E('g', {}, flipIn), fBack = E('g', {}, flipIn);
  fFront.appendChild(flashG(560, 340, 'situation', P.ink, { lines: 0, z: 40, ty: -110 }));
  const promptLines = E('g', {}, fFront); { let d = ''; for (let i = 0; i < 6; i++) d += rl(-230, -50 + i * 30, i % 3 === 2 ? 60 : 230, -50 + i * 30, { ov: 0, j: 0.5 }); pathEl(promptLines, d, 3, P.soft); }
  fBack.appendChild(flashG(560, 340, 'move', C_STU, { lines: 0, z: 40, ty: -110, fill: '#EEF7F6' }));
  { const c = chip('rotate(90)', 34, P.hlL); fBack.appendChild(c.g); c.g.removeAttribute('data-mob'); }
  const flip = gm(p3, flipG, P.ink, FC[0], FC[1]);
  S.drive(() => { const f = FL.v.f, sx = Math.max(0.02, Math.abs(Math.cos(Math.PI * f))), side = Math.round(f) % 2; flipIn.setAttribute('transform', `scale(${sx.toFixed(3)} 1)`); fFront.style.display = side ? 'none' : ''; fBack.style.display = side ? '' : 'none'; });
  F(flip, a('flashcards') - 0.3, 0.5, { dy: 16 });
  const frL = label(p3, 'front', FC[0] - 330, FC[1], P.ink, 34, 'end'), bkL = label(p3, 'back', FC[0] + 330, FC[1], C_STU, 34, 'start');
  W(frL, a('front') - 0.1, 0.4); S.set(FL, a('back') - 0.5, 0.7, { f: 1 }); W(bkL, a('back') + 0.1, 0.4);
  /* the front: the exact prompt, saved word for word */
  const t33 = bt('c3_03').t;
  S.set(FL, t33 - 0.2, 0.7, { f: 2 });
  const stamp = gm(p3, stampG('saved word for word', C_OK, 380), C_OK, FC[0] + 90, FC[1] + 120);
  F(stamp, a('wordfor') - 0.2, 0.3); pulse(stamp, a('wordfor') + 0.1, 1.08);
  const driftL = label(p3, 'the same text in training and in flight', FC[0], FC[1] + 230, P.ink, 30); W(driftL, a('drift') - 0.3, 0.8);
  /* about nine thousand cards */
  const t34 = bt('c3_04').t;
  O([frL, bkL, stamp, driftL], t34 - 0.3, 0.3);
  p3.mv(flip, t34 - 0.2, 0.7, 960, 640); S.set(flip, t34 - 0.2, 0.7, { s: 0.36 });
  const deck = gm(p3, stackG(14, 200, 122, P.ink, { lines: false }), P.ink, 960, 770);
  S.behind(deck, flip); F(deck, a('ninek') - 0.5, 0.4, { dy: 20 });
  const nineL = label(p3, 'about 9,000 cards', 960, 830, P.ink, 34); W(nineL, a('ninek') - 0.1, 0.8);
  /* training: show the front, score only the back */
  const t35 = bt('c3_05').t;
  O([nineL], t35 - 0.3, 0.3); O(flip, t35 - 0.3, 0.3); p3.mv(deck, t35 - 0.3, 0.7, 1700, 960); S.set(deck, t35 - 0.3, 0.7, { s: 0.6 });
  const fr2 = gm(p3, flashG(360, 220, 'front · situation', P.ink, { lines: 4, z: 30 }), P.ink, 660, 400), bk2 = gm(p3, flashG(360, 220, 'back · move', C_STU, { z: 30, fill: '#FFFFFC' }), C_STU, 1140, 400);
  const bk2c = p3(chip('rotate(90)', 24, P.hlL), 1140, 420);
  F(fr2, a('showfront') - 0.3, 0.4); F(bk2, a('showfront') + 0.1, 0.4); F(bk2c, a('showfront') + 0.2, 0.3);
  const nudge = arrowM(p3, 1360, 470, 1360, 330, C_STU, 5, { head: 16 }), nudgeL = label(p3, 'a little more likely', 1390, 300, C_STU, 26, 'start');
  W(nudge, a('nudges') - 0.1, 0.4); W(nudgeL, a('nudges') + 0.3, 0.6);
  const glow = gm(p3, (() => { const g = E('g'); E('rect', { x: -196, y: -126, width: 392, height: 252, rx: 20, fill: C_STU, 'fill-opacity': 0.18, stroke: 'none', 'data-nd': '' }, g); return g; })(), C_STU, 1140, 400);
  S.behind(glow, bk2); F(glow, a('onback') - 0.2, 0.4); dim(fr2, a('neverfront') - 0.2, 0.35, 0.4);
  grp([bk2, bk2c], 'bk2');
  const cc2 = codeCard(S, p3, 300, 600, [
    'for r in ep.records:',
    '    if not r.get("valid") or not r.get("tool"):',
    '        continue                       # never imitate a rejected move',
    '    yield {',
    '        "prompt": r["prompt"],         # the exact prompt from the flight',
    '        "completion": tool_call_completion(r["tool"], r.get("tool_input") or {}),',
    '        "tools": tools,',
    '    }'], { file: 'src/dexi_planner/distill.py', tag: 'comments added for the video', z: 22, lh: 38 });
  cc2.show(a('nudges') + 0.5).light(2, a('nudges') + 0.9).unlight(2, a('onback') - 0.3).light(5, a('onback') - 0.2).unlight(5, a('neverfront') - 0.3).light(4, a('neverfront') - 0.2);
  /* whole flights held out */
  const t36 = bt('c3_06').t;
  cc2.hide(t36 - 0.35); O([fr2, bk2, bk2c, nudge, nudgeL, glow, deck], t36 - 0.35, 0.35);
  const held = gm(p3, stackG(4, 200, 120, C_SON, { fill: '#EEF0FB' }), C_SON, 1500, 600), heldL = label(p3, 'held out: whole flights', 1500, 650, C_SON, 28);
  F(held, a('aside') - 0.4, 0.5, { dx: -80 }); W(heldL, a('aside') + 0.1, 0.6);
  const cc3 = codeCard(S, p3, 260, 300, [
    'def assign_split(mission_id: str, valid_frac: float, salt: str = "c1") -> str:',
    '    h = hashlib.sha256(f"{salt}:{mission_id}".encode()).digest()',
    '    bucket = int.from_bytes(h[:4], "big") / 2**32',
    '    return "valid" if bucket < valid_frac else "train"'], { file: 'src/dexi_planner/distill.py', z: 22, lh: 38 });
  cc3.show(a('whole') - 0.4).light(1, a('whole') - 0.1).light(3, a('halfeach') - 0.2);
  const tk3 = take(p3, ['Situation in, the teacher’s move out.'], 760, 760, 760, a('whole') + 0.8);

  /* ================= (3,0) · chapter 4 · a thin layer ================= */
  const p4 = pg(3, 0), t41 = bt('c4_01').t;
  go(3, 0, t41 - 0.9, 1.0);
  pageTitle(p4, '4 · A thin layer', t41 - 0.3);
  const GX = 200, GY = 300, GC = 16, GR = 10, CELL = 40;
  const grid = gm(p4, weightGridG(GC, GR, CELL), C_QW, GX, GY);
  const qL = label(p4, 'Qwen3-4B', GX, GY - 34, C_QW, 34, 'start');
  F(grid, a('qwen') - 0.3, 0.6); W(qL, a('qwen') - 0.1, 0.6);
  const ntag = p4(chip('no thinking', 24, P.hlC), GX + 360, GY - 34); F(ntag, a('nothink') - 0.1, 0.4);
  const fbL = label(p4, '4 billion weights', GX + GC * CELL / 2, GY + GR * CELL + 44, C_QW, 32); W(fbL, a('fourb') - 0.1, 0.7);
  /* frozen */
  S.set(grid, a('frozen') - 0.4, 0.8, { color: P.soft });
  const glock = gm(p4, lockG(2.4), P.ink, GX + GC * CELL / 2, GY + GR * CELL / 2); F(glock, a('frozen') - 0.1, 0.4, { dy: -30 });
  const frzL = label(p4, 'frozen', GX + GC * CELL / 2 + 80, GY + GR * CELL / 2 + 6, P.ink, 34, 'start'); W(frzL, a('frozen') + 0.2, 0.5);
  /* LoRA: thin strips clipped on */
  const t43 = bt('c4_03').t;
  O([fbL, frzL], t43 - 0.3, 0.3);
  const strips = [3, 7, 11, 15].map((c, k) => gm(p4, (() => { const g = E('g'); const x = GX + c * CELL - 6; E('rect', { x, y: GY - 12, width: 12, height: GR * CELL + 24, rx: 5, fill: C_STU, 'fill-opacity': 0.55, stroke: 'none', 'data-nd': '' }, g); pathEl(g, rrect(x, GY - 12, 12, GR * CELL + 24, { ov: 0.6 }), 2.5, C_STU); pathEl(g, rl(x - 6, GY - 4, x + 18, GY - 4, { ov: 0 }), 4, C_STU); return g; })(), C_STU));
  grp(strips, 'strips'); strips.forEach((m, k) => F(m, a('addon') - 0.2 + k * 0.15, 0.3, { dy: -40 }));
  const loraL = label(p4, 'LoRA', GX + GC * CELL / 2, GY + GR * CELL + 56, C_STU, 56);
  W(loraL, a('lora') - 0.1, 0.7);
  /* sticky notes on a textbook */
  const book = gm(p4, textbookG(), P.ink, 1460, 480);
  F(book, a('sticky') - 0.4, 0.5, { dy: 14 });
  const notes = [[-120, -96, -6], [60, -80, 5], [130, 40, -4]].map(([x, y, r], k) => gm(p4, stickyG(76, 62, r), C_STU, 1460 + x, 480 + y));
  grp(notes, 'notes'); notes.forEach((m, k) => F(m, a('sticky') + 0.1 + k * 0.18, 0.25, { dy: -16 }));
  const bkS = label(p4, 'the book stays the same', 1460, 680, P.ink, 30), bkR = label(p4, 'the notes change how you read it', 1460, 735, C_STU, 30);
  W(bkS, a('bookstays') - 0.4, 0.6); W(bkR, a('read') - 0.4, 0.7);
  /* how thin: under three million numbers, a tenth of a percent; nine and a half hours on the laptop */
  const t45 = bt('c4_05').t;
  O([book, ...notes, bkS, bkR], t45 - 0.3, 0.35);
  const tmL = label(p4, 'under 3 million numbers', GX + GC * CELL / 2, GY + GR * CELL + 120, C_STU, 30), tnL = label(p4, 'less than 0.1% of the model', GX + GC * CELL / 2, GY + GR * CELL + 170, C_STU, 30);
  W(tmL, a('threem') - 0.1, 0.7); W(tnL, a('tenth') - 0.1, 0.7);
  const cc4 = codeCard(S, p4, 920, 250, [
    'model: mlx-community/Qwen3-4B-Instruct-2507-bf16',
    'data: data/sft/v1',
    'mask_prompt: true            # loss on the move only',
    'num_layers: 16               # adapters on the top 16 of 36 layers',
    'lora_parameters:',
    '  rank: 16',
    '  keys: ["self_attn.q_proj", "self_attn.v_proj"]',
    'learning_rate: 1.0e-5',
    'iters: 9200                  # two passes over 9,128 pairs'], { file: 'train/c1_lora.yaml', tag: 'comments rewritten for the video', z: 22, lh: 38 });
  cc4.show(a('threem') - 0.3).light(2, a('threem') + 0.5).unlight(2, a('tenth') - 0.3).light(5, a('tenth') - 0.2).unlight(5, a('laptop') - 0.3).light(6, a('laptop') - 0.2);
  const lap4 = gm(p4, laptopG(240, 150), P.ink, 1240, 900), mlxL = label(p4, 'MLX', 1240, 826, P.ink, 34);
  const clk = gm(p4, clockG(34), P.ink, 1470, 830), hrsL = label(p4, '≈ 9.5 hours', 1520, 832, P.ink, 30, 'start');
  F(lap4, a('laptop') - 0.3, 0.4); W(mlxL, a('mlx') - 0.1, 0.4); F(clk, a('ninehalf') - 0.3, 0.3); W(hrsL, a('ninehalf') + 0.1, 0.6);
  grp([lap4, mlxL], 'lap4'); grp([clk, hrsL], 'clk');
  /* the same recipe as a managed cloud job */
  const t46 = bt('c4_06').t;
  cc4.hide(t46 - 0.35); O([grid, qL, ntag, glock, ...strips, loraL, tmL, tnL, lap4, mlxL, clk, hrsL], t46 - 0.35, 0.35);
  const cc5 = codeCard(S, p4, 150, 250, [
    'from sagemaker.train import SFTTrainer',
    ' ',
    'trainer = SFTTrainer(',
    '    model="huggingface-reasoning-qwen3-4b",   # Qwen3-4B from the SageMaker public hub',
    '    training_type=TrainingType.LORA,',
    '    training_dataset=train_s3_uri,',
    '    validation_dataset=valid_s3_uri,',
    '    mlflow_resource_arn=mlflow_arn,',
    ')',
    'trainer.hyperparameters.lora_rank = 16',
    'trainer.train(wait=False)'], { file: 'scripts/c2_submit.py', tag: 'simplified · comment added for the video', z: 22, lh: 36 });
  cc5.show(a('cloudjob') - 0.2).light(2, a('sagemaker') - 0.2).unlight(2, a('slightly') - 0.3).light(3, a('slightly') - 0.2).unlight(3, a('aboutsame') - 0.3).light(10, a('aboutsame') - 0.7);
  const SBX = 1600, SBW = 240;
  const lapS = gm(p4, laptopG(150, 96), P.ink, 1490, 380), cldS = gm(p4, cloudIconG(66, 32, C_SON), C_SON, 1490, 610);
  const lapSL = label(p4, 'laptop', 1490, 420, P.soft, 24), cldSL = label(p4, 'SageMaker AI', 1490, 668, C_SON, 26);
  F(lapS, a('cloudjob') - 0.1, 0.4); W(lapSL, a('cloudjob') + 0.1, 0.4); F(cldS, a('sagemaker') - 0.2, 0.4); W(cldSL, a('sagemaker') + 0.1, 0.5);
  const barL = growBar(S, p4, trk, SBX, 350, SBW, 34, C_STU, { op: 0.55 }), barC = growBar(S, p4, trk, SBX, 600, SBW, 34, C_STU, { op: 0.55 });
  F(barL, a('aboutsame') - 0.5, 0.2); barL.grow(a('aboutsame') - 0.5, 0.6, 0.70); F(barC, a('aboutsame') - 0.3, 0.2); barC.grow(a('aboutsame') - 0.3, 0.6, 0.74);
  const sameL4 = label(p4, 'about the same score', 1720, 760, C_STU, 28); W(sameL4, a('aboutsame') + 0.4, 0.6);
  grp([lapS, lapSL], 'lapS'); grp([cldS, cldSL], 'cldS'); grp([barL, barC], 'samebars');
  /* the held-out flights tell the story: the real validation curve */
  const t47 = bt('c4_07').t;
  cc5.hide(t47 - 0.35); O([lapS, lapSL, cldS, cldSL, barL, barC, sameL4], t47 - 0.35, 0.35);
  const IT = [1, 500, 1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9200], VL = [1.486, 0.091, 0.068, 0.066, 0.048, 0.055, 0.037, 0.034, 0.060, 0.036, 0.048];
  const LX = i => 300 + 1200 * i / 9200, LY = v => 320 + 460 * (Math.log(1.7) - Math.log(v)) / (Math.log(1.7) - Math.log(0.022));
  const lAx = gm(p4, (() => { const g = E('g'); pathEl(g, rl(290, 300, 290, 800, { ov: 0 }) + rl(290, 800, 1520, 800, { ov: 0 }), 3, P.soft); txtEl(g, 300, 276, 'error on the held-out flights (log scale)', 26, P.ink, 700, 'start'); txtEl(g, 1520, 836, 'training rounds →', 26, P.ink, 700, 'end'); return g; })(), P.ink);
  W(lAx, a('story') - 0.4, 0.7);
  const PTS = IT.map((i, k) => [LX(i), LY(VL[k])]);
  const seg = (a0, a1) => p4(ink(rpoly(PTS.slice(a0, a1 + 1), false, { ov: 0, j: 0.2 }), C_STU, 4.5), 0, 0);
  const sg1 = seg(0, 1), sg2 = seg(1, 6), sg3 = seg(6, 10);
  const lDots = PTS.map(([x, y]) => dot(p4, x, y, 7, C_STU));
  W(sg1, a('format') - 0.3, 0.6); [0, 1].forEach(k => F(lDots[k], a('format') - 0.3 + k * 0.5, 0.2));
  W(sg2, a('decisions2') - 0.2, 1.2); [2, 3, 4, 5, 6].forEach((k, j) => F(lDots[k], a('decisions2') + j * 0.22, 0.2));
  W(sg3, a('leveled') - 0.2, 1.0); [7, 8, 9, 10].forEach((k, j) => F(lDots[k], a('leveled') + j * 0.22, 0.2));
  grp([sg1, lDots[0], lDots[1]], 'sg1'); grp([sg2, ...lDots.slice(2, 7)], 'sg2'); grp([sg3, ...lDots.slice(7)], 'sg3');
  const fmtL = label(p4, 'the format', LX(500) + 30, LY(0.4), C_STU, 30, 'start'), decL = label(p4, 'the decisions', LX(2500), LY(0.12), C_STU, 30), lvlL = label(p4, 'then it levels off', LX(7600), LY(0.12), C_STU, 30);
  W(fmtL, a('format') + 0.2, 0.6); W(decL, a('decisions2') + 0.4, 0.6); W(lvlL, a('leveled') + 0.4, 0.6);
  const tk4 = take(p4, ['Freeze the model, train a thin layer.'], 1180, 420, 700, a('decisions2') + 0.8);

  /* ================= (3,1) · chapter 5 · the student matches the teacher ================= */
  const p5 = pg(3, 1), t51 = bt('c5_01').t;
  go(3, 1, t51 - 0.9, 1.0);
  pageTitle(p5, '5 · The student matches the teacher', t51 - 0.3);
  const X0 = 640, WF = 1000, XP = v => X0 + WF * v / 100, AXY = 860;
  const axis = gm(p5, (() => { const g = E('g'); pathEl(g, rl(X0, AXY, X0 + WF, AXY, { ov: 0 }), 3, P.soft); [0, 50, 100].forEach(v => { pathEl(g, rl(XP(v), AXY - 6, XP(v), AXY + 8, { ov: 0, j: 0.2 }), 2.5, P.soft); txtEl(g, XP(v), AXY + 32, v + '%', 24, P.soft, 700); }); pathEl(g, rl(XP(50), 250, XP(50), AXY - 10, { ov: 0 }), 1.5, P.soft, { 'stroke-dasharray': '6 8', opacity: 0.6 }); txtEl(g, X0, 214, 'the scoreboard: share of missions passed', 30, P.ink, 700, 'start'); return g; })(), P.ink);
  F(axis, t51 - 0.2, 0.5);
  const ROWS = [{ name: 'Sonnet', sub: 'the teacher', col: C_SON, y: 300, v: [62, 42], ci: [[48, 74], [29, 56]] },
                { name: 'Qwen', sub: 'untouched, thinking', col: C_QW, y: 480, v: [38, 24], ci: [[26, 52], [14, 37]] },
                { name: 'student', sub: 'after imitation', col: C_STU, y: 660, v: [70, 54], ci: [[56, 81], [40, 67]] }];
  const R5 = ROWS.map((R, ri) => {
    const nm = label(p5, R.name, 200, R.y + 10, R.col, 44, 'start'), sb = label(p5, R.sub, 200, R.y + 58, P.soft, 26, 'start');
    const out = { nm, sb, bars: [], vals: [], bands: [], sl: [] };
    [0, 1].forEach(k => {
      const y = R.y + k * 62, sl = label(p5, k ? 'unseen' : 'seen', X0 - 16, y, P.soft, 24, 'end');
      const band = gm(p5, (() => { const g = E('g'); const [lo, hi] = R.ci[k]; E('rect', { x: XP(lo), y: y - 30, width: XP(hi) - XP(lo), height: 60, fill: R.col, 'fill-opacity': 0.13, stroke: 'none', 'data-nd': '' }, g); pathEl(g, rl(XP(lo), y - 30, XP(lo), y + 30, { ov: 0 }) + rl(XP(hi), y - 30, XP(hi), y + 30, { ov: 0 }), 2.5, R.col, { 'stroke-dasharray': '6 6' }); return g; })(), R.col);
      const bar = growBar(S, p5, trk, X0, y, WF, 42, R.col, { op: k ? 0.3 : 0.6 }), vl = label(p5, R.v[k] + '%', XP(R.v[k]) + 16, y, R.col, 30, 'start');
      S.behind(band, bar);
      out.bars.push(bar); out.vals.push(vl); out.bands.push(band); out.sl.push(sl);
    });
    return out;
  });
  /* the two rows from 05 come back already filled */
  [0, 1].forEach(ri => { const r = R5[ri], t = t51 - 0.1 + ri * 0.35; F(r.nm, t, 0.3); F(r.sb, t, 0.3); [0, 1].forEach(k => { F(r.sl[k], t, 0.3); F(r.bars[k], t, 0.2); r.bars[k].grow(t, 0.5, ROWS[ri].v[k] / 100); F(r.vals[k], t + 0.3, 0.3); }); grp([r.nm, r.sb, ...r.sl, ...r.bars, ...r.vals], 'row5_' + ri); });
  grp([axis, ...[0, 1].flatMap(ri => { const r = R5[ri]; return [r.nm, r.sb, ...r.sl, ...r.bars, ...r.vals]; })], 'oldrows');
  const st = R5[2];
  W(st.nm, a('student') - 0.2, 0.6); W(st.sb, a('student') + 0.3, 0.5); F(st.sl[0], a('student') + 0.3, 0.3); F(st.sl[1], a('student') + 0.4, 0.3);
  F(st.bars[0], a('seventy') - 0.3, 0.2); st.bars[0].grow(a('seventy') - 0.3, 0.9, 0.70); W(st.vals[0], a('seventy') + 0.5, 0.4);
  pulse(R5[0].vals[0], a('sixtytwo') - 0.05, 1.25);
  const ref62 = p5(ink(rl(XP(62), 300 + 24, XP(62), 660 - 24, { ov: 0 }), C_SON, 2.5, { dash: '7 7' }), 0, 0); W(ref62, a('sixtytwo') - 0.1, 0.5);
  F(st.bars[1], a('newmiss') - 0.3, 0.2); st.bars[1].grow(a('newmiss') - 0.3, 0.9, 0.54); W(st.vals[1], a('newmiss') + 0.5, 0.4);
  grp([st.bars[0], st.vals[0]], 'st0'); grp([st.bars[1], st.vals[1]], 'st1');
  /* error bands: they overlap, so the claim is "matches, may beat" */
  const t53 = bt('c5_03').t;
  O(ref62, t53 - 0.3, 0.3); dim([R5[1].nm, R5[1].sb, ...R5[1].sl, ...R5[1].bars, ...R5[1].vals], t53 - 0.3, 0.3);
  const bandsOn = [...R5[0].bands, ...R5[2].bands]; grp(bandsOn, 'bands5'); bandsOn.forEach((m, k) => F(m, a('bands') - 0.4 + k * 0.05, 0.5));
  const ovl = gm(p5, (() => { const g = E('g'); [[0, 56, 74], [1, 40, 56]].forEach(([k, lo, hi]) => { E('rect', { x: XP(lo), y: 300 + k * 62 - 30, width: XP(hi) - XP(lo), height: 660 - 300 + 60, fill: P.hlC, 'fill-opacity': 0.0, stroke: C_STU, 'stroke-width': 2.5, 'stroke-dasharray': '4 6', 'data-nd': '' }, g); }); return g; })(), C_STU);
  F(ovl, a('bands') + 0.4, 0.4);
  const mbL = label(p5, 'matches, may beat', XP(81) + 30, 600, C_STU, 30, 'start'); W(mbL, a('matches') - 0.1, 0.7);
  /* one mission, two flights: m_0006, coverage of four quadrants, 15-step budget */
  const t54 = bt('c5_04').t;
  O([axis, ...R5.flatMap(r => [r.nm, r.sb, ...r.sl, ...r.bars, ...r.vals, ...r.bands]), ovl, mbL], t54 - 0.35, 0.35);
  const U = 95, ROOM = (cx, cy, who, col) => {
    const RM = (n, e) => [cx + e * U, cy - n * U];
    const room = gm(p5, (() => { const g = E('g'); E('rect', { x: cx - 2.2 * U, y: cy - 2.2 * U, width: 4.4 * U, height: 4.4 * U, fill: '#FFFFFC', stroke: 'none', 'data-nd': '' }, g); [[0, 0], [1, 0], [0, 1], [1, 1]].forEach(([i, j]) => E('rect', { x: cx - 2.2 * U + i * 2.2 * U + 6, y: cy - 2.2 * U + j * 2.2 * U + 6, width: 2.2 * U - 12, height: 2.2 * U - 12, fill: C_EXAM, 'fill-opacity': 0.06, stroke: 'none', 'data-nd': '' }, g)); pathEl(g, rl(cx, cy - 2.2 * U, cx, cy + 2.2 * U, { ov: 0 }) + rl(cx - 2.2 * U, cy, cx + 2.2 * U, cy, { ov: 0 }), 1.5, C_EXAM, { 'stroke-dasharray': '6 8' }); pathEl(g, rrect(cx - 2.2 * U, cy - 2.2 * U, 4.4 * U, 4.4 * U, { ov: 2 }), 3.5, C_EXAM); txtEl(g, cx, cy - 2.2 * U - 30, who, 34, col, 700); return g; })(), P.ink);
    const sq = [[1, 1], [-1, 1], [-1, -1], [1, -1]].map(([n, e]) => RM(n, e));
    const path = p5(ink(rl(cx, cy, sq[0][0], sq[0][1], { ov: 0 }) + rpoly(sq, false, { ov: 0 }), col, 4.5), 0, 0);
    return { room, sq, path, RM };
  };
  const LR = ROOM(560, 500, "Sonnet's flight", C_SON), RR = ROOM(1360, 500, "the student's flight", C_STU);
  F(LR.room, a('onemission') - 0.4, 0.5); const covL = label(p5, 'one mission: cover all four quarters of the room', 960, 205, C_EXAM, 30); W(covL, a('onemission') - 0.1, 0.8);
  W(LR.path, a('square') - 0.2, 1.2);
  /* three pause rings beside each of two corners */
  const OUTW = [[1, 1], [-1, 1], [-1, -1], [1, -1]].map(([n, e]) => [e, -n]);  /* outward diagonal at each corner, screen axes */
  const pausesL = [1, 2].flatMap(c => [0, 1, 2].map(k => ring(p5, LR.sq[c][0] + OUTW[c][0] * (24 + k * 18), LR.sq[c][1] + OUTW[c][1] * (24 + k * 18), 8, C_SON)));
  pausesL.forEach((m, i) => F(m, a('pausing') - 0.2 + i * 0.16, 0.2));
  grp(pausesL, 'pausesL');
  const scL = stepCounter(S, p5, trk, 560 - 239, 765, 15, C_SON); F(scL, a('square') - 0.4, 0.3); scL.fill(a('square') - 0.2, a('outsteps') - a('square') + 0.2, 15);
  const outL = label(p5, 'out of steps · never finished', 560, 820, C_BAD, 28); W(outL, a('outsteps') + 0.2, 0.8);
  const t55 = bt('c5_05').t;
  F(RR.room, t55 - 0.4, 0.5); W(RR.path, t55 - 0.1, 1.2);
  const pausesR = RR.sq.map(([x, y], c) => ring(p5, x + OUTW[c][0] * 24, y + OUTW[c][1] * 24, 8, C_STU));
  grp(pausesR, 'pausesR'); pausesR.forEach((m, k) => F(m, a('once') - 0.1 + k * 0.2, 0.2));
  const scR = stepCounter(S, p5, trk, 1360 - 239, 765, 15, C_STU); F(scR, t55 - 0.3, 0.3); scR.fill(t55, a('inside') - t55 + 0.1, 14);
  const finL = label(p5, 'finished inside its budget', 1360, 820, C_OK, 28); W(finL, a('inside') + 0.2, 0.7);
  /* the grader threw Sonnet's dawdling flights out */
  const t56 = bt('c5_06').t;
  O([LR.room, LR.path, ...pausesL, scL, outL, covL, RR.room, RR.path, ...pausesR, scR, finL], t56 - 0.35, 0.35);
  const toss5 = gm(p5, stackG(6, 260, 170, P.soft, { fill: '#F1F0EA', lines: false }), P.soft, 960, 860);
  const topC = gm(p5, (() => { const g = flashG(300, 210, null, P.soft, { fill: '#FFFFFC' }); const s = 52; pathEl(g, rrect(-s, -s - 4, 2 * s, 2 * s, { ov: 0.5 }), 3.5, C_SON); [[-s, -s - 4], [-s, s - 4]].forEach(([x, y]) => [0, 1, 2].forEach(k => pathEl(g, rell(x - 16 - k * 16, y + (y < 0 ? -12 : 12), 6, 6), 2.5, C_SON))); return g; })(), P.soft, 960, 560);
  F(toss5, a('failed') - 0.4, 0.4, { dy: 20 }); F(topC, a('failed') - 0.1, 0.4, { dy: -20 });
  const thrL = label(p5, 'thrown out by the grader', 960, 920, P.soft, 30); W(thrL, a('threw') - 0.1, 0.7);
  const nvL = label(p5, 'never shown to the student, so never learned', 960, 330, C_STU, 32); W(nvL, a('saw') - 0.1, 1.0);
  /* about a second, on the laptop: no bill, no Wi-Fi */
  const t57 = bt('c5_07').t;
  O([toss5, topC, thrL, nvL], t57 - 0.35, 0.35);
  const TS = s => 420 + s * 18, TY = 640;
  const tAx = gm(p5, (() => { const g = E('g'); pathEl(g, rl(TS(0), TY, TS(70), TY, { ov: 0 }), 3, P.soft); [[0, '0'], [30, '30 s'], [60, '1 min']].forEach(([s, t]) => { pathEl(g, rl(TS(s), TY - 6, TS(s), TY + 8, { ov: 0, j: 0.2 }), 2.5, P.soft); txtEl(g, TS(s), TY + 30, t, 24, P.soft, 700); }); txtEl(g, TS(0) - 20, TY - 150, 'one decision', 26, P.soft, 700, 'end'); return g; })(), P.ink);
  const qTB = growBar(S, p5, trk, TS(0), TY - 120, 70 * 18, 30, C_QW, { op: 0.35 }), sTB = growBar(S, p5, trk, TS(0), TY - 70, 70 * 18, 30, C_STU, { op: 0.7 });
  F(tAx, t57 - 0.2, 0.4); F(qTB, t57 - 0.1, 0.2); qTB.grow(t57 - 0.1, 0.5, 60 / 70);
  const qTL = label(p5, 'Qwen, thinking ≈ 1 min', TS(60) + 16, TY - 120, C_QW, 26, 'start'); F(qTL, t57 + 0.2, 0.3); dim([qTB, qTL], a('sec1') - 0.5, 0.45);
  F(sTB, a('sec1') - 0.3, 0.2); sTB.grow(a('sec1') - 0.3, 0.3, 1.1 / 70);
  const sTL = label(p5, 'student ≈ 1 s', TS(1.1) + 16, TY - 70, C_STU, 28, 'start'); W(sTL, a('sec1') + 0.1, 0.5);
  grp([qTB, qTL], 'qT'); grp([sTB, sTL], 'sT');
  const lap5 = gm(p5, laptopG(200, 126), P.ink, 640, 870), lap5L = label(p5, 'on the laptop', 640, 940, P.ink, 26);
  F(lap5, a('laptop2') - 0.3, 0.4); W(lap5L, a('laptop2'), 0.5);
  const coin5 = gm(p5, coinG(26), P.ink, 1060, 800), wifi5 = gm(p5, wifiG(1), C_SON, 1260, 812);
  const strike = (x, y) => p5(ink(rl(x - 40, y + 30, x + 40, y - 40, { ov: 0 }), P.soft, 5), 0, 0);
  const coinX = strike(1060, 800), wifiX = strike(1260, 790);
  F(coin5, a('bill') - 0.3, 0.3); W(coinX, a('bill') + 0.1, 0.3); F(wifi5, a('wifi') - 0.3, 0.3); W(wifiX, a('wifi') + 0.1, 0.3);
  grp([coin5, coinX], 'coin5'); grp([wifi5, wifiX], 'wifi5');
  const tk5 = take(p5, ['Copy a filtered teacher, and you can match it.'], 1480, 940, 720, a('sec1') + 0.6);

  /* ================= (2,1) · chapter 6 · the data is the lever ================= */
  const p6 = pg(2, 1), t61 = bt('c6_01').t;
  go(2, 1, t61 - 0.9, 1.0);
  pageTitle(p6, '6 · The data is the lever', t61 - 0.3);
  const base6 = gm(p6, modelBoxG('Qwen3-4B', C_QW, 220, 130, { dots: 6 }), C_QW, 560, 330), stu6 = gm(p6, modelBoxG('student', C_STU, 220, 130, { dots: 6 }), C_STU, 1360, 330);
  const base6L = label(p6, 'the starting model, untrained', 560, 236, C_QW, 28), stu6L = label(p6, 'the same model + the thin layer', 1360, 236, C_STU, 28);
  F(base6, t61 - 0.1, 0.4); W(base6L, t61 + 0.2, 0.6); F(stu6, a('training') - 0.2, 0.4); W(stu6L, a('training') + 0.1, 0.6);
  const qm6 = label(p6, '?', 960, 330, P.ink, 90); W(qm6, a('starting') - 0.1, 0.4);
  grp([base6, base6L], 'base6'); grp([stu6, stu6L], 'stu6');
  /* four percent; a quarter of its moves rejected */
  const SX6 = v => 640 + 8 * v;
  const sR = growBar(S, p6, trk, 640, 660, 800, 40, C_STU, { op: 0.6 }), bR = growBar(S, p6, trk, 640, 720, 800, 40, C_QW, { op: 0.3 });
  const sRL = label(p6, 'student', 620, 660, C_STU, 28, 'end'), bRL = label(p6, 'untrained', 620, 720, C_QW, 28, 'end');
  const sRV = label(p6, '70%', SX6(70) + 16, 660, C_STU, 28, 'start'), bRV = label(p6, '4%', SX6(4) + 16, 720, C_QW, 28, 'start');
  const t62 = bt('c6_02').t;
  O(qm6, t62 - 0.3, 0.3);
  F(sRL, t62 - 0.2, 0.3); F(sR, t62 - 0.2, 0.2); sR.grow(t62 - 0.2, 0.5, 0.70); F(sRV, t62 + 0.2, 0.3);
  F(bRL, a('four') - 0.5, 0.3); F(bR, a('four') - 0.3, 0.2); bR.grow(a('four') - 0.3, 0.4, 0.04); W(bRV, a('four') + 0.1, 0.4);
  grp([sRL, sR, sRV], 'sR'); grp([bRL, bR, bRV], 'bR');
  const mv6 = Array.from({ length: 8 }, (_, k) => p6(chip('move', 22, '#FFFFFC'), 640 + k * 110, 850));
  const mk6 = mv6.map((_, k) => k === 2 || k === 6 ? cross(p6, 640 + k * 110 + 40, 828, 10) : tick(p6, 640 + k * 110 + 40, 828, 11));
  grp(mv6, 'mv6'); grp(mk6, 'mk6'); mv6.forEach((m, k) => F(m, a('quarter') - 0.4 + k * 0.04, 0.25)); mk6.forEach((m, k) => W(m, a('quarter') + 0.1 + k * 0.08, 0.2));
  const brkL6 = label(p6, 'a quarter of its moves break the rules', 1025, 920, C_BAD, 28); W(brkL6, a('quarter') + 0.6, 0.7);
  /* it reads the rules, then ignores them; nine thousand examples fixed that */
  pulse(base6, a('reads') - 0.05, 1.08);
  const deck6 = gm(p6, stackG(10, 180, 110, P.ink, { lines: false }), P.ink, 200, 560, { s: 0.8 });
  const deck6L = label(p6, '9,000 examples', 200, 600, P.ink, 26);
  F(deck6, a('ninek2') - 0.4, 0.4); W(deck6L, a('ninek2') - 0.1, 0.5);
  p6.mv(deck6, a('fixed') - 0.5, 1.0, 1360, 560); O(deck6L, a('fixed') - 0.5, 0.3); S.behind(deck6, stu6);
  pulse(stu6, a('fixed') + 0.6, 1.1);
  /* the data is the lever */
  const t64 = bt('c6_04').t;
  O([...mv6, ...mk6, brkL6], t64 - 0.3, 0.3);
  const tk6 = take(p6, ['The data is the lever.'], 960, 960, 560, a('data') - 0.2);
  /* but it only ever saw the teacher's situations */
  const t65 = bt('c6_05').t;
  O([base6, base6L, stu6, stu6L, sRL, sR, sRV, bRL, bR, bRV, deck6, tk6], t65 - 0.35, 0.35);
  const TP = [[180, 760], [420, 640], [680, 690], [940, 560], [1200, 610], [1480, 480], [1760, 520]];
  const tPath = p6(ink(catmull(TP), C_SON, 4, { dash: '14 10' }), 0, 0), tPL = label(p6, "the teacher's flights", 300, 860, C_SON, 28);
  const tCards = TP.slice(0, 7).map(([x, y], k) => gm(p6, flashG(70, 46, null, P.ink, { lines: 1 }), P.ink, x, y - 52));
  W(tPath, t65 - 0.1, 1.2); W(tPL, t65 + 0.3, 0.6); tCards.forEach((m, k) => F(m, t65 + 0.1 + k * 0.12, 0.25));
  grp([tPath, tPL, ...tCards], 'teacher');
  const sPath = p6(ink(catmull([[180, 760], [420, 650], [680, 700], [880, 640], [1000, 760], [1080, 900], [1180, 980]]), C_STU, 4.5), 0, 0);
  W(sPath, a('teachers') - 0.2, 2.6);
  const blank = label(p6, 'no cards out here', 1240, 1000, C_STU, 28, 'start'); W(blank, a('blind') + 0.4, 0.7);
  const recL = label(p6, 'never practiced recovering', 1240, 940, C_BAD, 28, 'start'); W(recL, a('recovering') - 0.1, 0.8);
  pulse(blank, a('owntries') - 0.05, 1.1);

  /* ================= (1,1) · end card ================= */
  const p7 = pg(1, 1), tE = bt('c6_06').end + 0.6;
  go(1, 1, tE, 1.1);
  const SN = ['measure', 'imitate', 'reward', 'shrink', 'ship'];
  const eTag = label(p7, 'Margin Notes · 06 · Learning by imitation', 960, 330, P.olive, 34);
  const eCard = gm(p7, endCardG('next · 07 · Learning by reward'), C_OK, 960, 520);
  const eMap = SN.map((s, k) => gm(p7, stationG(s, k < 2 ? C_OK : P.ink), k < 2 ? C_OK : P.ink, 560 + k * 200, 760, { s: 0.6 }));
  const eLine = p7(ink([560, 760, 960, 1160].map(x => rl(x + 32, 760, x + 168, 760, { ov: 0 })).join(''), P.soft, 3), 0, 0);
  W(eTag, tE + 0.6, 0.6); F(eCard, tE + 0.9, 0.6, { dy: 14 }); W(eLine, tE + 1.2, 0.6); eMap.forEach((m, k) => F(m, tE + 1.3 + k * 0.08, 0.3));
  grp([...eMap, eLine], 'emap');
  S.drive(() => { eMap[0].g._f.setAttribute('fill-opacity', '0.3'); eMap[1].g._f.setAttribute('fill-opacity', '0.3'); });
  /* outro: zoom out over the whole spread */
  const tZ = Math.max(TM.total - 0.4, tE + 3.0);
  camTo(S, cam, tZ, 3.2, SPREAD10.x, SPREAD10.y, 0.215);
  S.end(tZ + 3.8);
  return S;
}
