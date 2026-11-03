# Margin Notes toolkit

Everything needed to build a Margin Notes episode, deep dive or extended cut in a fresh workspace.
The engine, drawing kits and player were recovered from the published episode 06 player: a page rebuilt from these
files renders pixel-identical to it. The Python pipeline was rewritten and tested end to end on the demo episode
(voice, build, checks, render, mux at -16 LUFS with chapters and subtitles, cover, extended cut).

## Load it in a new session

1. Artifact `read` this toolkit's URL with `paths` set to every file in the manifest below. Each file lands in the
   scratchpad; copy them into one folder, keeping the relative paths (e.g. `~/mn-toolkit`).
2. `bash ~/mn-toolkit/setup.sh` (local MathJax 3.2.2 and fonts for renders; kokoro-onnx, Pillow, Playwright).
   Chromium is preinstalled. The Kokoro model files (~340 MB) download on the first `tts.py` run.

## Make an episode

```
TK=~/mn-toolkit/py; EP=~/ep07
cp -r ~/mn-toolkit/examples/demo $EP           # episode.json, script.py, scene.js: the starter
# edit episode.json (slug, title, label, description, aria, mp4_title), script.py (the approved narration), scene.js
python3 $TK/fake_timing.py $EP                  # estimated timing so the scene can be built before the voice
nohup python3 $TK/tts.py $EP > $EP/tts.log 2>&1 &   # real voice + timing (cached per line; re-run after edits)
python3 $TK/build.py $EP                        # out/page.html (no voice) for checks and renders
python3 $TK/shots.py $EP                        # contact sheets, one frame per beat (or: shots.py $EP 12.5 --full)
python3 $TK/clutter.py $EP                      # windows with more than 2 things moving
python3 $TK/render.py $EP 0 2 & python3 $TK/render.py $EP 1 2 & wait    # 30 fps parts (2 CPUs: 2 parts)
python3 $TK/mux.py $EP 2 /home/claude           # <slug>.mp4: voice at -16 LUFS, soft subs, chapters
python3 $TK/cover.py $EP <t> "Title" ["line 2"] # 1280x720 cover (episode.json "cover_crop": [x, y, w, h])
python3 $TK/build.py $EP --voice                # out/<slug>.html with the voice embedded: publish as an Artifact
python3 $TK/ext_cut.py spec.json                # extended cut from finished MP4s (see examples/ext06-spec.json)
```

Re-render only the part whose frames changed (parts are frame ranges), then re-run mux.

## Manifest

| path | what it is |
|---|---|
| TOOLKIT.md | this file |
| setup.sh | one-time setup |
| py/common.py | paths, episode.json, script loading and checks, timing/SRT/VTT writers |
| py/tts.py | Kokoro narration, one beat at a time; anchors by prefix synthesis; per-line cache |
| py/fake_timing.py | estimated timing from word counts |
| py/build.py | assembles the self-contained page (engine, TM, kits, extra kits, scene, player) |
| py/page.py | headless Chromium with local fonts and MathJax routed in (no network) |
| py/render.py | frames k of K into out/part{k}.mp4 |
| py/mux.py | parts + voice + subtitles + chapters into the MP4 |
| py/shots.py | contact sheets and full-size frames |
| py/clutter.py | clutter probe |
| py/cover.py | YouTube cover |
| py/ext_cut.py | extended cuts: trims, holds, 0.4 s crossfades, shifted cues and chapters |
| web/head.html | page head, CSS and player markup ({{TITLE}}, {{DESCRIPTION}}, {{ARIA}}) |
| web/mathjax-config.js | MathJax config (color extension; calls window.__mj when ready) |
| web/engine.js | Scene/Mob tween engine, pen strokes, handwriting, highlighters, MathJax, camera, trackers, code text, heat grids (kit 4) |
| web/kits.js | doodle kits 6 (rooms, boxes, tags, clouds), 9 (Arc 3: model boxes, stations, mission cards, grader, takeaway and end cards, codeCard, growBar) and 10 (stacks, flashcards, weight grids, step counters) |
| web/player.js | player (narration drives the clock, chapters, CC, speed) and render hooks (__frame, __total, __ready, __stats) |
| examples/demo/episode.json | starter config |
| examples/demo/script.py | starter narration (beat format, pronunciations, pauses, chapters) |
| examples/demo/scene.js | starter scene: helpers, paper spread, tab, title page, two chapters (bars, MathJax, code card, takeaways), end card, outro |
| examples/ep06-scene.js | the full episode 06 scene, a worked example of every kit |
| examples/ep06-timing.js | its timing, to rebuild 06 as a regression test |
| examples/ext06-spec.json | the 06 extended cut spec as built |
| examples/t02-scene.js | the T02 scene (v5): guided-number helpers (matrix with per-cell mobs, wline, flyIn, setVal, stepTag, fHl, dot), a 4 x 3 spread built in parts |
| examples/t02-script.py | the T02 script (v5): beat format with `slow=True` for number walkthroughs |

## Engine notes

- Per-line pacing: a beat may carry `speed` (e.g. 0.86) and `gap` (seconds of silence between its sentences); anchors and cues stay aligned per sentence. The T02 script's `B(..., slow=True)` sets speed 0.86, gap 0.55 and a pause of at least 1.2 s for number walkthroughs.
- Times come from `TM` only: `bt(id).t/.end` for beats, `a(name)` for anchors. Register each object's tweens in time order.
- `S.create` writes a mob on; `S.fadeIn`/`S.out`; mobs added with `draw: 1` (growBar, codeCard lines) still need a fade-in.
- `hlBar`, `tex`, `hand`, `mono`, `growBar`, `codeCard` return mobs or APIs; don't wrap them in `new Mob` again.
- `grp([...], 'name')` makes parts count as one mover in the clutter probe.
- Build drawings around a local origin and position the mob; pulses scale about the mob's origin.
- One scene is one function: prefix per-chapter names (tR4, tR5) to avoid "Identifier has already been declared".
- Use arrays, not object key order (JS puts integer-like keys such as '10' before '01').
- Clip paths and highlight bars use page-local coordinates via the page function `p(m, x, y)`.
- Never `pkill -f` or wait on `pgrep -f` with a pattern that appears in your own command line; use `pgrep -f "[t]ts.py"`.
