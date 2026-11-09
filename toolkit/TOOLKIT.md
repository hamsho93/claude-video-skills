# Margin Notes toolkit

Everything needed to build a Margin Notes episode, deep dive or extended cut. The engine, kits and player render pixel-identical to the published episode 06; the Python pipeline is tested end to end on `examples/demo`.

## Set up

- `cp -r toolkit ~/mn-toolkit && bash ~/mn-toolkit/setup.sh`
- Needs Python 3, Node (npm) and ffmpeg; `setup.sh` stops with a clear message if one is missing. It installs local MathJax 3.2.2 and fonts (renders never touch the network), kokoro-onnx, Pillow and Playwright, and installs Playwright's Chromium only if no working browser is found (Claude cloud sessions already have one). Kokoro's model files (~340 MB) download on the first `tts.py` run.

## Make an episode

```
TK=~/mn-toolkit/py; EP=~/ep07
cp -r ~/mn-toolkit/examples/demo $EP            # episode.json, script.py, scene.js
# edit episode.json (series, slug, title, label, description, aria, mp4_title), script.py, scene.js
python3 $TK/fake_timing.py $EP                   # estimated timing: build the scene before the voice
nohup python3 $TK/tts.py $EP > $EP/tts.log 2>&1 &   # voice + timing (cached per line)
python3 $TK/animatic.py $EP                      # voice over one card per line: send before the build
python3 $TK/parts.py $EP                         # scene in parts: parts/*.js -> scene.js, anchors and names checked
python3 $TK/build.py $EP                         # out/page.html for checks and renders
python3 $TK/shots.py $EP                         # contact sheets (or: shots.py $EP 12.5 --full)
python3 $TK/overlap.py $EP                       # labels overlapping or off the frame, per line
python3 $TK/clutter.py $EP                       # windows with more than 2 things moving
python3 $TK/scan.py $EP                          # empty pages while the voice talks (after the mux: --mp4)
python3 $TK/render.py $EP 0 2 & python3 $TK/render.py $EP 1 2 & wait
python3 $TK/mux.py $EP 2 /home/claude            # <slug>.mp4: -16 LUFS, soft subs, chapters
python3 $TK/cover.py $EP <t> "Title" ["line 2"]  # 1280x720 cover (episode.json "cover_crop")
python3 $TK/build.py $EP --voice                 # out/<slug>.html with the voice: publish as an Artifact
python3 $TK/ext_cut.py spec.json                 # extended cut (see examples/ext06-spec.json)
```

## Script format (`script.py`)

`B(id, cap, say=None, pause=0.45, ch=None, slow=False, think=False, see=None)`, as in `examples/demo/script.py`:
`{anchor}` marks the word a visual lands on (unique per episode); `say` is the spoken form (same anchors, same order); `ch` starts a YouTube chapter; `slow=True` for lines that work numbers (speed 0.86, 0.55 s between sentences, pause ≥ 1.2 s); `think=True` for a question to the viewer (pause ≥ 2.5 s); `see` is a few words of what's on screen (animatic only). A beat may also set `speed` and `gap` directly.

## Engine notes

- SVG 1920×1080; a world group under a camera mob; every object is a mob with x, y, s, r, o, draw, color. `render(t)` and every driver are pure in t; trackers (`Trk`) feed drivers (`S.drive`).
- Times come from `TM` only (`timing.js`: `const TM = {total, beats: {id: {t, dur, end}}, a: {anchor: t}, chapters, cues}`): `bt(id).t/.end` for lines, `a(name)` for anchors.
- `S.set` records `from` as the object's value at call time: register each object's tweens in time order.
- Objects start invisible; anything added with `draw: 1` (growBar, codeCard lines) still needs a fade-in.
- `hlBar`, `tex`, `hand`, `mono`, `growBar`, `codeCard` return mobs or APIs; don't wrap them in `new Mob`.
- `grp([...], 'name')` counts parts as one mover in the clutter probe.
- Build drawings around a local origin and position the mob, so pulses and scales stay in place.
- One scene is one function: prefix per-chapter names (tR4, tR5) to avoid "Identifier has already been declared". Top-level names in the scene share one script with the engine and kits (a scene `const f1` or `E` clashes); `parts.py` reports either with its file and line.
- Use arrays, not object key order (JS puts integer-like keys such as '10' before '01').
- Clip paths and highlight bars use page-local coordinates via the page function `p(m, x, y)`; highlights go behind what they light (`S.behind`), above the page's white fills.
- When a driver moves something a mob also positions, put the driver's transform on an inner group, so seeking backwards can't leave a stale transform.
- The player uses `max(TM.total, scene duration)`; render hooks: `__frame(t)`, `__total`, `__ready`, `__stats(t)`, `__SC`.

## Gotchas

- Every page declares `<meta charset="utf-8">` (file:// renders without it show "Â·").
- Wait for fonts and MathJax before building: text is measured.
- SVG collapses spaces: use non-breaking spaces.
- The Write tool turns `\u` escapes into real characters.
- Never `pkill -f` or wait on `pgrep -f` with a pattern in your own command line; use `pgrep -f "[t]ts.py"`.
- In zsh a glob with no match is an error: `rm -f out/part*.mp4 && render...` stops the chain when there are no parts. Don't glob in rm (render overwrites its parts anyway).
- Two scans or shot runs at once must not share a temp file (one read the other's half-written PNG); `scan.py` keeps frames in memory.
- After a re-voice every line after the change moves: re-run clutter and scan, regenerate anything that prints chapter times (YouTube text), and re-render every part after the first changed line.

## Manifest

| path | what it is |
|---|---|
| setup.sh | one-time setup |
| py/common.py | paths, episode.json, script loading and checks, timing/SRT/VTT writers |
| py/tts.py | Kokoro narration per line; anchors by prefix synthesis; per-line speed and gaps; cache |
| py/fake_timing.py | estimated timing from word counts |
| py/animatic.py | voice over one card per line, for listening before the build |
| py/build.py | assembles the self-contained page |
| py/page.py | headless Chromium with local fonts and MathJax (no network) |
| py/shots.py | contact sheets and full-size frames |
| py/overlap.py | label overlap and off-frame check at every line's end |
| py/clutter.py | movers-at-once probe |
| py/scan.py | empty-page scan of the built page or the final MP4 |
| py/parts.py | joins a scene written in parts and checks anchors, line ids and names |
| py/render.py | frames k of K into out/part{k}.mp4 |
| py/mux.py | parts + voice + subtitles + chapters into the MP4 |
| py/cover.py | YouTube cover |
| py/ext_cut.py | extended cuts: trims, holds, crossfades, shifted cues and chapters |
| web/head.html | page head, CSS, player markup |
| web/mathjax-config.js | MathJax config |
| web/engine.js | Scene/Mob tween engine, pen strokes, handwriting, highlighters, MathJax, camera, trackers, heat grids |
| web/kits.js | drawing kits 6 (rooms, boxes, tags), 9 (model boxes, stations, cards, codeCard, growBar), 10 (stacks, weight grids, counters) |
| web/player.js | player and render hooks |
| examples/demo/ | starter episode: episode.json, script.py (every beat flag), scene.js (helpers, two chapters, end card) |
| examples/t02-scene.js, t02-script.py | T02 v5: guided-number helpers and a 4 × 3 spread built in parts |
| examples/ep06-scene.js, ep06-timing.js | episode 06, every kit in use; a regression test |
| examples/ext06-spec.json | the 06 extended cut spec |
