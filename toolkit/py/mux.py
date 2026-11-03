"""Join the rendered parts, add the voice (loudness-normalised to -16 LUFS), soft English subtitles and chapters.
python3 mux.py EPDIR K [dest_dir]   -> <dest_dir or EPDIR/out>/<slug>.mp4
YouTube chapters must each be >= 10 s and start at 0:00, so a short Intro merges into chapter 1.
Cut with -t <video duration>, never -shortest. Verify: ffprobe streams/chapters, ebur128 about -16 LUFS.
"""
import json, os, subprocess, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import epdir, config, out


def main():
    d = epdir()
    c = config(d)
    K = int(sys.argv[2])
    dest = os.path.abspath(sys.argv[3]) if len(sys.argv) > 3 else out(d)
    T = json.load(open(out(d, 'timing.json')))
    open(out(d, 'parts.txt'), 'w').write(''.join(f"file '{out(d, f'part{k}.mp4')}'\n" for k in range(K)))
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', out(d, 'parts.txt'), '-c', 'copy', out(d, 'video.mp4')], check=True)
    dur = float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', out(d, 'video.mp4')]).decode().strip())
    ch = [c_ for c_ in T['chapters'] if c_[1] != 'Intro']
    ch[0] = [0, ch[0][1]]
    short = [n for i, (t, n) in enumerate(ch) if (ch[i + 1][0] if i + 1 < len(ch) else dur) - t < 10]
    if short:
        print('WARNING: chapters under 10 s (YouTube ignores the list):', short)
    meta = [';FFMETADATA1', f"title={c['mp4_title']}", f"artist={c['series']}"]
    for i, (t, name) in enumerate(ch):
        end = ch[i + 1][0] if i + 1 < len(ch) else dur
        meta += ['[CHAPTER]', 'TIMEBASE=1/1000', f'START={int(t * 1000)}', f'END={int(end * 1000)}', f'title={name}']
    open(out(d, 'chapters.txt'), 'w', encoding='utf-8').write('\n'.join(meta) + '\n')
    mp4 = os.path.join(dest, c['slug'] + '.mp4')
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', out(d, 'video.mp4'), '-i', out(d, 'voice.wav'), '-i', out(d, c['slug'] + '.srt'),
                    '-i', out(d, 'chapters.txt'), '-map', '0:v', '-map', '1:a', '-map', '2:s', '-map_metadata', '3', '-map_chapters', '3',
                    '-c:v', 'copy', '-af', 'loudnorm=I=-16:TP=-1.5:LRA=11,apad', '-ar', '48000', '-c:a', 'aac', '-b:a', '160k',
                    '-c:s', 'mov_text', '-metadata:s:s:0', 'language=eng', '-metadata:s:a:0', 'language=eng',
                    '-t', f'{dur:.3f}', '-movflags', '+faststart', mp4], check=True)
    print(mp4, round(dur, 2))
    for t, name in ch:
        print(f'{int(t // 60)}:{int(t % 60):02d} {name}')


if __name__ == '__main__':
    main()
