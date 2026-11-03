---
name: "notes-to-animated-lesson"
description: "Turn notes, research or a repo into a narrated Margin Notes animated lesson that makes the key ideas intuitive: one spine, guided numbers, apt analogies; fact-checked, voice-first, YouTube-ready."
---

# Notes to animated lesson

Use this when someone shares study notes (a Goodnotes link, PDF or photos), research write-ups or a repo and asks for an animated explainer, lesson or video to learn from or to share. That includes "Margin Notes" episodes, deep dives, extended cuts and "3Blue1Brown-style" requests.

The purpose is to drill down to the key concepts in the material and make them intuitive and clear. A viewer should leave able to explain the idea to someone else, not able to recite its numbers.

## 0. Start here in a new session

- **The build kit is this repo's `toolkit/` folder.** Copy it to a working folder (e.g. `cp -r toolkit ~/mn-toolkit`) and run `setup.sh`. (A copy also lives in the Margin Notes Toolkit artifact, https://claude.ai/artifact/7GZp8w4w2bjXu2YxQH2q9c, for sessions without the repo.) Improvements to the pipeline go back into `toolkit/` in a pull request, so everyone using this repo gets them. It holds the engine, drawing kits and player (a page rebuilt from them is pixel-identical to the published 06 player), the tested Python pipeline (tts, fake_timing, build, page, render, mux, shots, clutter, cover, ext_cut), a starter episode (`examples/demo`) and the full 06 scene. Never rebuild the engine from scratch.
- **The workspace can be replaced between sessions.** Anything not in an artifact, the plan doc or a delivered file is lost. Send deliverables with SendUserFile as soon as they're checked, and when a new kit or a pipeline fix is worth keeping, republish the toolkit (same URL).
- **Read the plan doc first** (the series plan in Claude Docs): its status block says what's built, what's open and what's next, and its tabs hold the approved scripts. If there is none yet, create one in the first session, with a status block, a season map, the spine table, the season's review rules (section 13 is a template) and one tab per episode script.
- **This skill is shared.** It lives at `.claude/skills/notes-to-animated-lesson/SKILL.md` in the repo and loads in any session the repo is attached to. When a session teaches a lesson worth keeping (a rule, a gotcha, a pipeline fix), change the file in a branch and open a pull request, so the other maintainers review it. Keep the series name, tab text and ink assignments as choices a new series makes (section 9), not facts. The season's **Decisions / review rules** list in the plan doc is binding for every episode of that season; read it before scripting.
- **One toy model per season, in one file** (e.g. `toy.py` with a per-episode ledger). Every number on screen comes from it. Before proposing new toy values, check what else in the ledger depends on them: a change to an early episode's matrices ripples through every later episode's planned numbers and re-voices the built ones. Fix readability by how the toy is explained before you touch its values.

## Core principles

- **Understanding over coverage.** The sources hold far more true facts than a viewer can absorb. Pick the few key concepts, and teach each with a picture, an example and, when it fits, an analogy. Everything else goes to the description, the extended cut or the fact notes.
- **One spine per episode.** One question, one picture that is built or rebuilt as the episode goes (one score table told three ways; one ladder climbed rung by rung). Every chapter changes that picture. If an idea doesn't change the spine picture, it belongs in the description, a deep dive or the next episode. An episode whose title question is answered by chapter 2 is two episodes.
- **Sources are a starting point, not the syllabus.** Notes list what the person found important; a repo lists what was built. Neither order is story order. Teach the ideas so each builds on the last, and use the real thing (a frame, a log, a line of code, one real data row) as evidence where it makes an idea concrete, not as a data dump.
- **Make it for public viewers.** Teach the correct model directly. Never show corrections on screen: no red strokes, strike-throughs of the source's errors, "fix" tags or "your notes said" framing. Credits to the person's notes go in the plan doc, never on screen. Where the sources differ from the facts, say so privately, in the delivery message and the script's fact notes.
- **Ideas build in order, across the whole series.** Plan the series flow before scripting any one episode (section 3). Re-ordering after an episode is built means re-voicing its hand-offs.
- **Attention is the budget.** One idea at a time, one thing moving at a time. The screen forgets: when the next idea arrives, the last one's labels leave. Short labels on screen, full sentences in the voice.
- **The voice sets the clock.** Write the narration first, record it, and time every visual to the word it lands on.
- **The script goes to the person first, every episode.** No build before they approve the narration. Version the script in the plan doc (v1, v2 ...), and when the person's notes on a built episode point at structure rather than polish, propose a rebuild rather than a patch.

## 1. Gather the sources

- **Goodnotes share links:** WebFetch is blocked by robots.txt, so open the link in a browser. Try Claude in Chrome first; the built-in browser pane has failed to load page tiles. Pages are drawn to canvas, so read them by screenshot and zoom (`#page-N`). Hide the cookie banner with a style change rather than clicking Accept. If no browser works after two tries, ask for a PDF export (Goodnotes: Share, Export, PDF) or screenshots. A PDF of handwritten notes: rasterize every page and read the images; keep the page images in the workspace for the "checked against your notes" pass.
- **Repos and research:** read the write-ups first (docs/, READMEs, design notes, test results), then the code they point to. Collect the real artifacts that could serve as evidence: annotated frames, charts, logs, tool definitions, test output, one real training row. Check every number against the code or the log it came from.
- **Keep the evidence.** For every claim that reaches the screen, note the file or log behind it and how the number was computed. The person will ask "is that valid? show me the log".
- **Keep secrets out.** Config files often hold cloud account IDs, ARNs and bucket names: never put them on screen, in code cards or in descriptions. Record per-episode publishing limits (e.g. results not yet public, designs to keep private) in the plan doc and honor them.
- **Real images:** ask before putting a frame that shows a person's face, or other people's content, into a public video. Offer a drawn stand-in.
- **Concept inventory.** List every claim, number, diagram and definition with its source (page, file and line). Note what the author highlighted, circled or called a finding. Where the notes have a layout for something (a table with labelled edges, a formula with braces), use that layout on screen: the person recognizes it.

## 2. Fact-check

- Check against primary sources: official docs, spec tables, the original papers and the official implementation's defaults. Recompute all arithmetic, and check inputs and assumptions too.
- Recompute headline numbers from the raw logs, not only from the write-up, and say which statistic you used (a per-decision median and a median of per-mission medians can differ by 15%).
- Keep units consistent on both sides of a ratio (FLOPs count multiply and add separately; MACs/FMAs count them once).
- A number that depends on hardware (seconds per move) gets its setup in the fact notes, and, where one exists, a hardware-independent measure beside it (tokens per move).
- **Comparisons between systems.** When two models ran the same test items, compare them paired (McNemar on the items where they disagree); the sample is the items, not repeated runs at temperature 0. Before saying one beats the other, check significance and the test size the gap needs (a power analysis); when it isn't settled, say "matches, may beat". "Luck can move a score by 14 points" is the error on one score at n = 50, not on a paired difference.
- Classify each item as correct, imprecise or wrong; teach the correct version. Mark illustrative numbers in the fact notes, and prefer real data over a made-up shape when the real data exists.
- **Toy embeddings have no column meanings.** Don't name or gloss the columns of a toy vector ("money, water, unsure"): viewers then assume real columns carry meanings, and they don't (meaning lives in directions spread across columns; see Elhage, Lasenby & Olah 2023, Privileged Bases). Columns are 1, 2, 3. Give the toy its handle at the level of words instead: how the rows sit relative to one another ("bank's row sits halfway between river's and loan's"), and read a result by comparing it with rows the viewer knows (the same multiply-and-add). If an earlier episode did name columns, the next one says once that those names were a reading aid.
- **A toy stands for a model partway through training**, and says so; at the very first step its numbers would be random.

## 3. Plan the series flow (before any one episode)

Watched in order, each episode should feel like the obvious next question. Plan the order of ideas for the whole series first, then script episodes.

- **Map the concepts and what each needs.** List every idea the series teaches and, for each, the ideas it depends on. Order the episodes so every idea's prerequisites come earlier. An idea used before it is taught, or taught in one episode and only used three episodes later past an unrelated one, is a flow bug.
- **One rung per episode, bottom to top.** When the system has layers (fast to slow, low level to high level, raw signal to decision), climb them one per episode so each stands on the one before. Give the layers one visible anchor (e.g. a "ladder of clocks", or a station map like measure, imitate, reward, shrink, ship).
- **Simplest case first, then the harder form.** Teach an idea on its easiest instance and reuse it later in a richer one. Never the other way round.
- **Teach where first needed; callbacks only point backward.** Each callback names something the viewer has already seen. An overview or trailer is made last, cut from finished episodes, and nothing depends on it.
- **Each episode: a question a viewer would ask, and an ending that hands the next episode its problem.** Arcs group episodes that share one larger question.
- **One rule per layer, shown as a picture.** Each layer gets one rule and one measured result. The full arithmetic belongs in the extended cut.
- **Write the spine table.** Columns: idea, first taught (episode, chapter), called back in. Every "called back" entry must come later than "first taught".
- **Creator's review pass.** Read the episode list as a viewer binge-watching in order. Flag ideas used before they're taught, callbacks that jump back past an unrelated episode, ideas taught twice, and episodes that don't follow from the previous ending. Fix by moving material, not by adding recap lines.
- **Renumbering.** When the order changes, list which built episodes' lines and end cards change, and say how long the re-voice and re-render takes.

## 4. Find each episode's story

- **One central question** per video; open on the result, then ask how it happens. Ask the question once, in the words the title uses: an opening that asks "why two?" under a title that says "three" loses the viewer before chapter 1.
- **Say training or inference up front,** and which step of the training loop the episode is in (forward pass, loss, backward pass, update). Keep the step strip on every page and light the step that changes.
- **Two to four key concepts per episode, one per chapter.** Name each chapter's concept in one plain sentence before scripting it. If you can't, the chapter is about too many things.
- **One unifying anchor** that persists and transforms within the video, usually the series anchor at this episode's rung. Light it at the start and again at the end.
- **Prerequisites first.** Define every term in plain words right before the first idea that needs it, or cut the term.
- **Chain the chapters.** Each chapter ends on its takeaway and the question the next one answers.
- **Triage:** key concepts get a picture and time; supporting facts go to the YouTube description or the extended cut, not on screen; trivia is cut.
- **Series:** "Margin Notes", numbered from 01 in viewing order. 00 is a short trailer, cut last. Each episode's end card names the next one.

## 5. Make it intuitive (the teaching rules)

A script that is all true can still lose the viewer in the first minute. Test every chapter against these rules before recording.

- **Picture first, then the name, then the number.** Show the idea working before you name it, and name it before you put a number on it.
- **Real size first, then the toy.** Show what the real thing looks like at real size (the 512-wide vector, the 512 × 64 matrix, the 30 × 30 table, the 151,936 × 2,560 output layer) before zooming to the toy, in the same chapter, and say why the toy is small ("small enough to read").
- **Name things before using them, and label a thing by what made it.** A vector made by Wq is q(word); a raw embedding standing in for a query is still x(word), tagged "as its query: no Wq", drawn in plain ink rather than the query colour. A table's edges carry the names of what sits on them (q(word) down the side, k(word) across the top). The first time a symbol appears, say in words what it is.
- **Predict before you compute.** Before a number is worked, say in words what each input does ("a note is one number: how loudly the word asks; a label is one number: how findable it is") and let the viewer guess the outcome ("loud times findable: big; quiet times hidden: small"). Then the number confirms it. A number the viewer couldn't have predicted is arithmetic watched, not an idea learned.
- **The analogy and the math meet.** When an analogy carries a concept (note, label, contents; two hires with notebooks), say the numbers in the analogy's words ("bank's note reads 3.6: it's asking loudly"), in the same breath as the digits. An analogy introduced in the opening and never spoken again during the math did nothing.
- **One yardstick per chapter.** Pick one quantity the viewer can feel and compare every number to it on screen.
- **Work in full the calculations that carry the argument; name the rest.** The person wants to see the full worked example for the step that proves the point (every product, every sum, the result), so the viewer can follow. But not every calculation carries the point: a softmax already worked in an earlier episode, a parameter count, a training step in an episode about something else. Those get one line ("as T01 worked it: 27, 30, 43") and a pointer to where they are worked (an earlier episode, the deep dive). Everything that is worked on screen is at the same precision (three decimals) so each line follows from the one above.
- **Guide the eye through the numbers.** Many numbers on screen at once feel overwhelming and disjointed. For every worked calculation: the question first, in words; the formula on top as the map, with the part being worked lit; the values being worked in one row of boxes that change in place (old value small and grey above the new one, a bar for size); one example worked aloud with its numbers flying in from where they came, then the rest updating together by the same rule; zero terms greyed; one working line at a time, which collapses to its result; the voice says at most two numbers per line, the example and the result, and the screen carries the rest.
- **Show where every number comes from.** Nothing appears from nowhere: a vector flies in from its row, a matrix is written out before it is used, a result travels to where it is used next. If a page needs data from the previous page, the data slides along with the camera.
- **Slow down for the numbers.** Lines that work numbers are voiced slower (about 0.86 speed), with a short silence (about 0.5 s) between their sentences so each step lands on screen before the next is spoken, and a longer pause after the line (1.2 s or more). The animation gets the same room: fly-ins and working lines a third slower than conversational beats. Conversational lines keep normal speed: pace those through fewer words.
- **Every claim answers its why.** If a viewer could ask "why?", give the reason in one clause or picture: "4 billion weights at 2 bytes each is about 8 GB, which fits a laptop's memory", not just "small enough for a laptop". An engineering lesson ("one failed call should cost one mission, never the run") needs its concrete story (what broke, what it would have cost) or gets cut.
- **Make units concrete the first time.** When a unit appears (tokens, "pieces"), show the real thing: the 16 pieces of one real move. When training data appears, say what one example is (one decision with its history so far, not a whole flight) and show one real row with its file path.
- **Toys say they're toys, and what they stand for.** A made-up example says it's made up and why, says what point in training it stands for, lists its simplifications in the fact notes, and connects to the real thing at real size in the same chapter. Where the toy makes a result trivial (a key that is one number), say so on screen and say why the point survives at real size.
- **Built versus background.** When a chapter presents alternatives, say at its start which one this project did and which are context, and keep a "this project" marker on screen from the start, not at the end.
- **Everyday words and units.** "A tenth of a second", "four times bigger", "nearly a million numbers" rather than "100 ms", "8.8 GFLOPs". Keep a technical term only when later chapters use it, and define it in plain words the first time.
- **Examples and analogies when they fit.** A worked example uses one concrete case the viewer can picture (this mission, this move, this word in this phrase). An analogy must map the mechanism, not just the mood: say what corresponds to what, use one analogy per concept and keep it for the whole episode, and say where it breaks if a later chapter depends on that.
- **Quantities as sizes and times you can see.** Bars on the yardstick, a heap four times taller, missed frames crossed out. The digits come after the picture has made the point.
- **The screen forgets.** When the next idea arrives, the previous labels leave or dim to structure. At any moment the screen should show one idea plus its context.
- **One plain takeaway per chapter.** End on a short card in everyday words, on screen for at least 2 s, then hand off to the next chapter.
- **The lost-viewer check.** Read the chapter as a smart friend outside the field. Count the new terms and numbers. Anything they'd need that hasn't been given a picture first gets a picture or gets cut.
- **The viewer pass is not the checker pass.** After every number has been verified, read the whole script once more as a viewer: does each chapter change the spine picture, can the viewer predict each number before it appears, does the analogy carry the math, is anything worked that doesn't carry the argument? "Correct but doesn't stick" is a structure problem; fix it by cutting and re-ordering, not by slowing down.

### Deep dives (math and code)

- **Pitch:** easy to absorb but adequate for a staff engineer. Go deep on the method this episode actually used (e.g. distillation's math), not a survey of neighboring methods, unless asked.
- **Order inside a derivation:** the concrete computation with a worked number from the real data first ("look up the probability it gave the right piece: 0.40; minus its log: 0.92; average over the 16 pieces"), then the formula, then the derivation as the justification.
- **Code cards:** real code, trimmed; comments added for the video are labelled "comments added for the video"; only the narrated line is lit.
- **Real data:** show one real example from the training file, labelled with its path and "abridged" where trimmed.
- **In the description, not the narration:** the citations (paper, authors, year), exact figures and implementation details the voice leaves out.
- **What the main episode names but doesn't work** (a training step, a gradient, a parameter count) is the deep dive's natural table of contents.

## 6. Format

- **Default: YouTube, landscape 16:9 at 1920×1080.** One topic or arc is one video split into YouTube chapters; split into separate videos only when each answers its own question. Every chapter must be at least 10 s and the first starts at 0:00, so a short title card belongs to chapter 1.
- **Length follows the voice.** Estimate from the script (about 10 to 12 beats a minute at speed 1.0, with pauses; number lines at slow pace run about half that), then let the recording decide. An episode past about ten minutes usually has two spines.
- **Deep dive = extended cut.** "The deep dive version" means a longer video that goes further (data, code, math), not a few extra seconds. Each dive is its own scene (tab "DEEP DIVE", series line "Margin Notes · NN · Deep dive: <topic>"), labelled for the episode it attaches to, rendered to its own MP4, then joined into the episode's extended cut with `ext_cut.py`, right after the chapter it extends:
  - Cut the main episode just before the camera leaves that chapter (next chapter's first beat t − 0.95 s) and add a 1.5 s hold so the takeaway stays readable; resume the main episode at the same point.
  - Chapters: drop the dive's Intro, prefix the rest "Deep dive: <topic> · <chapter>", merge any under 10 s.
  - A dive that comes last carries the episode's end card ("next · NN").
  - Deliver the extended MP4, its .srt and YouTube text with the full chapter list. The regular episode ships too.
- **Vertical clips only when asked.** Don't plan 9:16 shorts by default.

## 7. Script and storyboard checkpoint

Put the series plan (season map, how the season builds, spine table, arcs, review rules and episode outlines) and the scripts in a doc the person can comment on, and get a go-ahead before building. Write the narration as a table per chapter: line #, narration, on screen. Head each chapter with its key concept, its picture or analogy, its yardstick, and which numbers are worked in full versus named. Mark with `{anchor}` the word each visual lands on, and give a spoken form when it differs from the caption. Read lines aloud; one that's hard to say is too long. When a new style or a big rewrite is in question, build one chapter as a pilot first (a two-page pilot of the guided-number style settled the T02 design in one round). Reordering a table is cheap; re-rendering video is not.

- **Per script version, add a "what changed and why" table** (change, the note that caused it, the lines) and a "checked against your notes" table (page, what it says, where the script carries it, and where it differs on purpose). Keep a "season rules in this episode" table showing how the script meets each review rule.
- **After a build, add build notes:** where the screen differs from the approved tables, and what was checked.
- **Claude Docs edits:** read a long tab once, save the JSON result and extract block ids and hashes with a script; find-by-quote fails on text that carries markdown markers, so target blocks by id with `ifHash` and `ifRev` from that read. Use an outline read to see the tab's top-level blocks before a restructure; delete and insert by block id. A rebuild replaces the tab's script sections and keeps the earlier build notes under an "Earlier builds" heading.
- **Keep a status block** in the plan (built, open, next, where the toolkit lives) and update it at the end of every session, so a fresh session can pick up.

## 8. Record the narration (narration-first)

- **TTS:** `py/tts.py` in the toolkit (kokoro-onnx, voice `af_heart`, speed 1.0). One beat (script line) at a time, with a pause after it (0.45 s default, 0.8 to 1.1 s after a key idea, up to 1.4 s at chapter ends). Every synthesis is cached per (voice, speed, text), so a re-run after edits only re-voices what changed.
- **Per-line pacing:** a beat may carry `speed` (e.g. 0.86) and `gap` (seconds of silence between its sentences). In `script.py`, give `B(...)` a `slow=True` flag that sets speed 0.86, gap 0.55 and a pause of at least 1.2 s, and mark every line that works numbers. Anchors and subtitle cues are timed per sentence, so they stay aligned across the gaps.
- **Anchor times:** Kokoro has no word timings, so the beat's text up to each `{anchor}` is synthesized on its own and its length is the anchor's offset. Sentence cues use the same trick.
- **Spoken forms that work:** Qwen → "Chwen", KL → "K L", LoRA → "Lora", DAgger → "dagger", DEXI 3 → "Dexy three", 0.4 → "zero point four", T01 → "T zero one", Wq → "W q", 512 → "five hundred twelve", 786,432 spelled out in words. Captions keep the written form.
- **Outputs:** `timing.js` (`const TM = {total, beats: {id: {t, dur, end}}, a: {anchor: t}, chapters: [[t, name]], cues}`), `voice.wav`, and `.srt`/`.vtt` cues split at sentences.
- Run it in the background and build visuals meanwhile against `fake_timing.py`. Run one TTS at a time: a stale run once overwrote timing.js mid-test.

## 9. Visual language: Margin Notes

- **Paper:** cream #F6F6EA with a graph grid (40 px minor #D9E3E6, 200 px major). Pages are 1920×1080 laid out as a spread on a desk (gap 200 px); the camera moves between pages, and the video ends by zooming out over the whole spread. Fill every slot of the spread (the last one can hold the end card or further reading). A 3 × 2 spread fits a nine-minute episode; 4 × 3 fit fifteen minutes and was too much.
- **Every page:** a small olive series line ("Margin Notes · NN · title"), the page title in dark green with a hand-drawn underline, and a fixed tab ("EPISODE NN" or "DEEP DIVE"); the step strip (initialize, forward, loss, backward, update, repeat) at the top right with the current step lit, green for the forward pass and orange for training-only steps.
- **One big central picture per chapter.** The concept's picture gets the middle of the page and real size; the yardstick runs along the bottom; the rule sits to one side. Leave the rest of the page empty rather than filling it.
- **Inks, one meaning each, written down before building:** black #1A1A1A drawings; dark green #1E5631 titles, structure and "the answer"; then assign magenta #E0218A, blue #4F63E6, orange #F2A33A, olive #7A8F1C (and teal #0F8B8D when needed) to the video's recurring things, and keep them across an arc (Arc 3: blue = the teacher, magenta = the untrained small model, teal = the trained student, green = the grader; Transformers: magenta = queries and lookers, blue = keys and targets, olive = values, teal = blends, orange/flame = failures and training nudges). A thing drawn in a role's colour must really be that thing: a raw row standing in for a query stays plain ink. Hatched boxes mark learned weights. Failures use flame/orange, never red.
- **Highlighters:** cyan #8EE6EE names, orange #F9C98A key numbers, lime #8EF08E the key word. Red is never used for corrections.
- **Pen:** wobbly hand-drawn strokes with seeded randomness; strokes draw on, handwriting writes left to right through a clip wipe, and math is MathJax SVG with `\textcolor`.
- **Fonts:** Patrick Hand for handwriting (it lacks →, ≈, ÷, α, θ, so draw arrows and set symbols in MathJax), JetBrains Mono for code and UI. Sizes on 1920×1080: labels 28 to 34 px, nothing under 22 px at camera scale 1; math 36 px and up.

### Motion rules (the 3Blue1Brown lessons)

- **One mover at a time.** Stagger entrances; a composite counts as one (`grp([...], 'name')`); a row of boxes updating together, with its bars and working line, counts as one (group the values, the bar trackers and the line). Target at most 2 things moving at once, and measure it (section 11).
- **Spotlight, then clear.** When a part is done, fade its label out; dim (0.2 to 0.3) only structure that stays relevant. Two labels from different beats never share a spot: fade the first before the second arrives.
- **Transform instead of cut:** camera moves between pages, objects slide into new roles, values computed in place then flying to where they apply. The same table rebuilt beats a new table drawn.
- **Animate the quantity, not just the label:** bars growing to the real value, frames crossed out as they're missed. Drive them with trackers; use a small deterministic simulation where a chart needs one.
- **Magnify tiny effects** with a loupe; **zoom carefully** so the view stays inside the page.
- **Labels never sit on drawings:** compute free space before placing a label; a longer label needs a new check against its neighbours.
- **Hold what matters:** keep a picture up while the narration still talks about it (fade it at the next idea's anchor, not at the beat boundary).
- **Subtitles are a soft track, never burned in.**

### Alternative: the 3Blue1Brown look (only when asked)

Black background, Computer Modern math, STIX Two Text labels, palette blue #58C4DD, yellow #FFFF00, green #83C167, red #FC6255, teal #5CD0B3, gold #F0AC5F, purple #9A72AC, pink #D147BD. Same rules otherwise.

## 10. Build

One self-contained HTML page per episode, assembled by `py/build.py` from the toolkit's `web/` files (head, MathJax config, engine with kit 4, kits 6/9/10, player), the episode's `timing.js`, any per-episode kit (`kits_extra` in episode.json) and the episode's `scene.js`. Start a new episode by copying `examples/demo/` (episode.json, script.py, scene.js with the standard helper set: `a`, `bt`, `W`, `F`, `O`, `pg`, `go`, `grp`, `pageTitle`, `label`, `take`, `T` for MathJax). `examples/ep06-scene.js` shows every kit in use.

- **Guided-number helpers worth reusing** (from the T02 scene): a `matrix()` whose cells are separate mobs (so one number can be lit, greyed, copied or moved); `wline()` for a working line laid out part by part; `flyIn()` / `flyC()` for a part that is seen where it came from and slides into its slot; `setVal()` for a row of boxes whose old value shrinks grey above the new one; `stepTag()` for the current step beside the row; `fHl()` to light the part of the formula being worked; `dot()` for stacked pair-by-pair products.
- **Write a long scene in parts** (one file per page under `parts/`, concatenated into `scene.js`), each with its own variable prefix; check `node --check` and that every `a('name')` and `bt('id')` in the scene exists in the script before building.
- **Engine:** SVG viewBox 1920×1080; a world group under a camera mob; every object is a mob with x, y, s, r, o, draw, color; `render(t)` is pure in t, and drivers are pure in t too. Trackers feed drivers.
- **Tween order matters:** `S.set` records `from` as the object's current value at call time, so register each object's tweens in chronological order.
- **Objects start invisible:** anything added with `draw: 1` (growBar, code card lines) still needs an explicit fade-in.
- **Kit functions return mobs or APIs** (`hlBar`, `tex`, `hand`, `mono`, `growBar`, `codeCard`); don't wrap them in `new Mob` again.
- **Build drawings around a local origin** and position the mob, so pulses and scales stay in place.
- **One scene is one function:** prefix per-chapter names (tR4, tR5) to avoid "Identifier has already been declared".
- **Use arrays, not object key order** (JS puts integer-like keys such as '10' before '01').
- **Clip paths and bars use page-local coordinates** through the page function `p(m, x, y)`; highlights go behind the thing they light (`S.behind`), above the page's white fills.
- **Drivers on mobs:** when a driver moves something a mob also positions, put the driver's transform on an inner group so seeking backwards can't leave a stale transform.
- **Outro:** extend the scene past the voice (3 to 4 s zoom-out over the spread); the player uses `max(TM.total, scene duration)`.
- **Player and render hooks** come from the toolkit: narration drives the clock, chapter chips, CC (off by default), speed; `#render` exposes `__frame(t)`, `__total`, `__ready`, `__stats(t)`.
- **Gotchas:** every page declares `<meta charset="utf-8">` (file:// renders without it come out Latin-1, "Â·"); wait for fonts and MathJax before building (text is measured); SVG collapses spaces (use non-breaking); the Write tool turns `\u` escapes into real characters; never `pkill -f` or wait on `pgrep -f` with a pattern that appears in your own command line (`pgrep -f "[t]ts.py"`).

## 11. Check

- **Contact sheets:** `shots.py` (one frame per beat, just before it ends) and `shots.py EP t --full` for full-size frames, including mid-motion frames of every new animation. Look for labels on drawings, two labels in one spot, residue from earlier beats, off-page camera views, invisible objects and clipped text.
- **Density check:** per chapter, confirm each number arrives after its picture and its prediction, and that only the calculations that carry the argument are worked in full (section 5).
- **Clutter probe:** `clutter.py`; fix real pile-ups by staggering or grouping parts that move as one. To see what is moving at a given moment, expose the scene (`window.__SC = SC`) in a copy of the page and list the tweens live at that time.
- **Player test:** play, a chapter chip, the clock and voice agree, no page errors.
- **Numbers:** every number on screen matches the fact-check; run the worked examples in code at the precision shown on screen (three decimals, rounding at each step as the screen does).
- **Flow:** every callback points to an earlier episode or chapter, matching the spine table.
- **Extended cuts:** frames around every join, the takeaway readable for 2 s before each cut, chapters, about −16 LUFS, cues never overlapping.

## 12. Render and deliver

- **Frames:** `render.py EP k K` steps `__frame(i/30)` and pipes PNGs into ffmpeg (libx264, yuv420p, crf 18). On 2 CPUs use 2 parts: one worker alone does about 10 frames/s, two at once about 4 each (a 6-minute dive takes about 20 minutes; a 15-minute episode about 50). Don't run TTS alongside. After a fix, re-render only the part whose frames changed. Wait on background jobs with a notification or an until-loop on a file, never on a self-matching pgrep.
- **Mux:** `mux.py`: voice through `loudnorm=I=-16:TP=-1.5:LRA=11,apad`, AAC 160k; subtitles as a `mov_text` stream (language eng); chapters from ffmetadata (Intro merged into chapter 1); cut with `-t <video duration>`, never `-shortest`; `+faststart`. Verify with ffprobe (streams, chapters) and ebur128 (about −16 LUFS), and pull two or three frames from the finished MP4.
- **Cover:** `cover.py`: 1280×720, a clean frame of the main picture on the left (`cover_crop`), the title in Patrick Hand on the right, series tag and episode tab. Pick a moment with no label mid-write and no box mid-update.
- **File names:** give each episode's outputs its own slug (`margin-notes-NN-<title-slug>…`; extended cuts `-extended`, dives `-deep-dive-<topic>`) so renumbering never overwrites an older episode's files. Back up the previous version's script, scene and episode.json before a rebuild.
- **Deliver:**
  - The narrated player page (`build.py EP --voice`) as an Artifact (private until they share it); republish to the episode's existing artifact URL rather than making a new one.
  - The MP4 with soft subtitles and chapters, and the .srt; the extended cut MP4 and .srt when there is one.
  - The cover.
  - A text file per video with the YouTube title, description and chapter timestamps (first at 0:00). The description carries "the numbers on screen" (every worked value, with the toy's conventions stated), the supporting numbers and the citations the main cut left out.
  - Update the plan doc: build notes, the deep-dive table and the status block.
- **Delivery message:** what it is and how long, what to upload where, what changed from the approved script, anything that differs from the sources and why, and one natural next step (the next episode).

## 13. The season review rules (Transformers season, kept here so every season starts with them)

1. Say training or inference, and which step.
2. Real size first, then the toy.
3. Work in full the calculations that carry the argument; name the rest and point to where they were worked.
4. Name things before using them, and label a thing by what made it (x(word) until a matrix has made it q or k).
5. Show where every number comes from.
6. Guide the eye through the numbers: one row of boxes changing in place, one example aloud then the rest together, the formula on top as the map, zeros greyed, one working line at a time, at most two numbers spoken per line, and slow down for the number lines.
7. No meanings for toy columns; the toy stands for a model partway through training; read meaning against rows the viewer knows.
8. One spine per episode, and predict before you compute.
