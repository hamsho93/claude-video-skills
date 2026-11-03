"""Write an estimated out/timing.js from the script, so scenes can be built and checked before the voice exists.
python3 fake_timing.py EPDIR [words_per_second=2.6]
Same format as tts.py; tts.py overwrites it with the real timing.
"""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import epdir, config, beats, plain, write_timing, sentences, ANCHOR


def main():
    d = epdir()
    c = config(d)
    B = beats(d, c)
    wps = float(sys.argv[2]) if len(sys.argv) > 2 else 2.6
    words = lambda s: max(1, len(plain(s).split()))
    tm = {'total': 0, 'beats': {}, 'a': {}, 'chapters': [], 'cues': []}
    t = c['lead']
    for b in B:
        say = b.get('say', b['cap'])
        dur = words(say) / wps + 0.3
        tm['beats'][b['id']] = {'t': round(t, 3), 'dur': round(dur, 3), 'end': round(t + dur, 3)}
        for m in ANCHOR.finditer(say):
            pre = plain(say[:m.start()]).strip()
            tm['a'][m.group(1)] = round(t + (len(pre.split()) / wps if pre else 0), 3)
        if b.get('ch'):
            tm['chapters'].append([round(t, 2), b['ch']])
        cs = sentences(plain(b['cap']))
        tot = sum(words(x) for x in cs)
        a = t
        for x in cs:
            e = a + dur * words(x) / tot
            tm['cues'].append([round(a, 2), round(e, 2), x])
            a = e
        t += dur + b['pause']
    tm['total'] = round(tm['beats'][B[-1]['id']]['end'] + c['tail'], 2)
    if not tm['chapters'] or tm['chapters'][0][0] > 0.5:
        tm['chapters'].insert(0, [0, 'Intro'])
    else:
        tm['chapters'][0][0] = 0
    write_timing(d, tm, c['slug'])
    print(f"estimated timing: {tm['total']:.1f}s, {len(B)} beats (re-run tts.py for the real one)")


if __name__ == '__main__':
    main()
