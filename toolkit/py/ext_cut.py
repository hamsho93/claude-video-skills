"""Assemble an extended cut (deep dive = extended cut) from finished, muxed MP4s.
python3 ext_cut.py spec.json
spec: {"out": "...mp4", "srt_out": "...srt", "title": "...", "segments": [
   {"mp4": "...", "srt": "...", "t0": 0, "t1": 188.99, "hold": 1.5, "chapters": [[t, "name"], ...]}, ...]}
Each segment is trimmed to [t0, t1] (t1 null = to the end). "hold" freezes the segment's last frame (and pads its audio
with silence) for that many seconds, so a takeaway card stays readable before the crossfade. Segments join with a
0.4 s crossfade (video and audio). Subtitle cues and chapters inside each segment's window move onto the new timeline.

Rules that worked:
- Cut the main episode just before the camera leaves the chapter the dive extends (next chapter's first beat t - 0.95),
  and hold 1.5 s; check that the takeaway is readable for at least 2 s before the fade.
- Resume the main episode at that same cut point (the camera move back is part of the transition).
- Prefix dive chapters "Deep dive: <topic> · <chapter>"; drop the dive's Intro; merge any dive chapter under 10 s.
- When the dive is the last segment it carries the end card ("next · NN").
- Verify: ffprobe chapters, ebur128 about -16 LUFS, frames around every join, cues never overlap.
"""
import json, re, subprocess, sys

D = 0.4
spec = json.load(open(sys.argv[1]))
segs = spec['segments']


def dur(p):
    return float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', p]).decode().strip())


for s in segs:
    if s.get('t1') is None:
        s['t1'] = dur(s['mp4'])
    s['len'] = s['t1'] - s['t0'] + s.get('hold', 0)

starts, acc = [], 0.0
for k, s in enumerate(segs):
    starts.append(acc)
    acc += s['len'] - D
total = acc + D

# ---- video + audio
args = ['ffmpeg', '-y', '-loglevel', 'error']
for s in segs:
    args += ['-i', s['mp4']]
fc = []
for k, s in enumerate(segs):
    hold = s.get('hold', 0)
    vh = f",tpad=stop_mode=clone:stop_duration={hold:.3f}" if hold else ''
    ah = f",apad=pad_dur={hold:.3f}" if hold else ''
    fc.append(f"[{k}:v]trim=start={s['t0']:.3f}:end={s['t1']:.3f},setpts=PTS-STARTPTS,fps=30,format=yuv420p{vh}[v{k}]")
    fc.append(f"[{k}:a]atrim=start={s['t0']:.3f}:end={s['t1']:.3f},asetpts=PTS-STARTPTS,aresample=48000{ah}[a{k}]")
vprev, aprev = 'v0', 'a0'
for k in range(1, len(segs)):
    off = starts[k]
    fc.append(f"[{vprev}][v{k}]xfade=transition=fade:duration={D}:offset={off:.3f}[vx{k}]")
    fc.append(f"[{aprev}][a{k}]acrossfade=d={D}[ax{k}]")
    vprev, aprev = f'vx{k}', f'ax{k}'


# ---- subtitles
def parse_srt(p):
    txt = open(p, encoding='utf-8').read().strip()
    out = []
    for blk in re.split(r'\n\s*\n', txt):
        lines = blk.strip().splitlines()
        if len(lines) < 3:
            continue
        m = re.match(r'(\d+):(\d+):(\d+)[,.](\d+) --> (\d+):(\d+):(\d+)[,.](\d+)', lines[1])
        if not m:
            continue
        g = list(map(int, m.groups()))
        a = g[0] * 3600 + g[1] * 60 + g[2] + g[3] / 1000
        b = g[4] * 3600 + g[5] * 60 + g[6] + g[7] / 1000
        out.append((a, b, '\n'.join(lines[2:])))
    return out


def ts(t):
    t = max(0, t)
    h, r = divmod(t, 3600)
    m, s = divmod(r, 60)
    return f"{int(h):02d}:{int(m):02d}:{int(s):02d},{min(999, int(round((s - int(s)) * 1000))):03d}"


cues = []
for k, s in enumerate(segs):
    for a, b, c in parse_srt(s['srt']):
        if a >= s['t0'] - 0.05 and a < s['t1'] - 0.2:
            cues.append((a - s['t0'] + starts[k], min(b, s['t1']) - s['t0'] + starts[k], c))
cues.sort()
open(spec['srt_out'], 'w', encoding='utf-8').write(''.join(f"{i + 1}\n{ts(a)} --> {ts(b)}\n{c}\n\n" for i, (a, b, c) in enumerate(cues)))

# ---- chapters
chs = []
for k, s in enumerate(segs):
    for t, name in s.get('chapters', []):
        if s['t0'] - 0.05 <= t < s['t1'] + s.get('hold', 0):
            chs.append([max(0.0, t - s['t0'] + starts[k]), name])
chs.sort()
chs[0][0] = 0.0
meta = [';FFMETADATA1', f"title={spec['title']}", f"artist={spec.get('series', 'Margin Notes')}"]
for i, (t, name) in enumerate(chs):
    end = chs[i + 1][0] if i + 1 < len(chs) else total
    meta += ['[CHAPTER]', 'TIMEBASE=1/1000', f'START={int(t * 1000)}', f'END={int(end * 1000)}', f'title={name}']
mf = spec['out'] + '.chapters.txt'
open(mf, 'w', encoding='utf-8').write('\n'.join(meta) + '\n')

n = len(segs)
args += ['-i', spec['srt_out'], '-i', mf, '-filter_complex', ';'.join(fc),
         '-map', f'[{vprev}]', '-map', f'[{aprev}]', '-map', f'{n}:s', '-map_metadata', f'{n + 1}', '-map_chapters', f'{n + 1}',
         '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '19', '-pix_fmt', 'yuv420p',
         '-c:a', 'aac', '-b:a', '160k', '-c:s', 'mov_text', '-metadata:s:s:0', 'language=eng', '-metadata:s:a:0', 'language=eng',
         '-movflags', '+faststart', spec['out']]
subprocess.run(args, check=True)
print('ok', round(total, 2))
for t, name in chs:
    print(f"{int(t // 60)}:{int(t % 60):02d} {name}")
