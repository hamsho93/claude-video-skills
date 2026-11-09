"""Series-wide check: what travels from episode to episode must agree everywhere. Run after any script edit and after each render.
python3 series_check.py series.json        (paths inside are relative to series.json; exit code 1 on any problem)

series.json:
  {"ledger": "../ledger/ledger.json",
   "episodes": [{"n": 1, "script": "ep01-script.md", "id": "c1_\\\\d\\\\d", "dir": "../ep01"}, ...],
   "identities": [["day-one bars", "ep1.P_pos1", "ep2.P_pos1", "ep8.snapshots.0.P_pos1"]],   every path holds the same value
   "stale": [["\\\\bknobs?\\\\b", "knob (the series says dials)"]],                         never in any narration or on screen
   "callbacks": [{"from": 1, "says": "It is a probability for every word", "to": 2, "echo": "It is the word's probability"}],
   "youtube_must": {"1": ["{{f2:ep1.P_pos1.0}}"]}}                                    text each episode's youtube.md must contain
For every episode whose dir has a rendered out/*.srt: the subtitles are the script's narration, word for word; its youtube.md
(when present) lists every chapter from out/timing.json.
A callback is a later episode quoting an earlier one: both lines must exist. Rewriting the earlier episode breaks it here
first, before the later episode is re-voiced.
"""
import glob, json, os, re, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import ledger as LG
from script_check import cards

norm = lambda s: re.sub(r'\s+', ' ', re.sub(r'\{\w+\}', '', s)).strip()


def main():
    if len(sys.argv) < 2:
        raise SystemExit(__doc__)
    cf = os.path.abspath(sys.argv[1]); base = os.path.dirname(cf)
    C = LG.load(cf)
    L = LG.load(os.path.join(base, C['ledger']))
    bad, notes = [], []
    for name, *paths in C.get('identities', []):
        vals = [LG.get(L, p) for p in paths]
        if any(v != vals[0] for v in vals): bad.append(f'identity "{name}" differs: ' + '; '.join(f'{p} = {v}' for p, v in zip(paths, vals)))
    EP = {}
    for e in C['episodes']:
        K = cards(os.path.join(base, e['script']), e['id'])
        EP[e['n']] = (e, K, ' '.join(v[1] for v in K.values()), ' '.join(v[0] for v in K.values()))
    for n, (e, K, narr, screen) in EP.items():
        for rx, what in C.get('stale', []):
            for where, t in (('narration', narr), ('on screen', screen)):
                for m in re.finditer(rx, t, re.I):
                    bad.append(f'Episode {n} {where}: stale term {what}: ...{t[max(0, m.start() - 30):m.end() + 30]}...')
    for cb in C.get('callbacks', []):
        a, b = EP[cb['from']], EP[cb['to']]
        if cb['says'] not in a[2]: bad.append(f'callback: Episode {cb["from"]} no longer says {cb["says"]!r}')
        if cb['echo'] not in b[2] and cb['echo'] not in b[3]: bad.append(f'callback: Episode {cb["to"]} no longer echoes it with {cb["echo"]!r}')
    for n, (e, K, narr, screen) in EP.items():
        d = os.path.join(base, e['dir']) if e.get('dir') else None
        srt = sorted(glob.glob(os.path.join(d, 'out', '*.srt'))) if d else []
        if not srt:
            notes.append(f'Episode {n}: no subtitles yet, not checked'); continue
        st = ' '.join(l.strip() for l in open(srt[0], encoding='utf-8') if l.strip() and not l.strip().isdigit() and '-->' not in l)
        if norm(st) != norm(narr): bad.append(f'Episode {n}: the subtitles are not the script\'s narration word for word (re-voice, or the script changed after voicing)')
        else: notes.append(f'Episode {n}: subtitles match the narration ({len(st.split())} words)')
        yt = os.path.join(d, 'youtube.md')
        if os.path.exists(yt):
            y = open(yt, encoding='utf-8').read()
            T = LG.load(os.path.join(d, 'out', 'timing.json'))
            ch = [c for c in T['chapters'] if c[1] != 'Intro']
            if ch: ch[0] = [0, ch[0][1]]
            for t, name in ch:
                if f'{int(t) // 60}:{int(t) % 60:02d} {name}' not in y: bad.append(f'Episode {n}: youtube.md lacks the chapter "{int(t) // 60}:{int(t) % 60:02d} {name}" (stale after a re-voice?)')
            for need in C.get('youtube_must', {}).get(str(n), []):
                if LG.fill(L, need) not in y: bad.append(f'Episode {n}: youtube.md lacks {LG.fill(L, need)!r}')
    for x in notes: print('  ' + x)
    print('\n'.join(bad) if bad else f'series check passed: {len(C.get("identities", []))} identities, {len(C.get("callbacks", []))} callbacks, no stale terms in {len(EP)} episodes')
    sys.exit(1 if bad else 0)


if __name__ == '__main__':
    main()
