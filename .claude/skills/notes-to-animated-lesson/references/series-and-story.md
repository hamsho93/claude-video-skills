# Series flow and the episode's story

## Plan the series first

Watched in order, each episode should feel like the obvious next question. Plan the whole series before scripting any episode; reordering after a build means re-voicing hand-offs.

- **Map concepts and prerequisites.** Order episodes so every idea's prerequisites come earlier. An idea used before it's taught, or taught and only used three episodes later past an unrelated one, is a flow bug.
- **One rung per episode, bottom to top.** When the system has layers (fast to slow, raw signal to decision), climb one per episode under one visible anchor (a ladder of clocks; a station map).
- **Simplest case first, then the harder form.** Never the other way round.
- **Teach where first needed; callbacks only point backward.** A trailer (episode 00) is cut last from finished episodes, and nothing depends on it.
- **Each episode: a question a viewer would ask, and an ending that hands the next episode its problem.** Arcs group episodes that share one larger question.
- **One rule per layer, shown as a picture,** with one measured result. Full arithmetic goes to the extended cut.
- **Spine table:** idea, first taught (episode, chapter), called back in. Every callback comes after "first taught".
- **Callbacks are dependencies.** When an episode quotes an earlier one ("last time we called that a probability"), record the pair of lines in the plan doc and check them with a script. Rewriting the earlier episode then means a written proposal for the later one's lines (which change, which stay and why), the person's approval, and a re-voice of only those lines.
- **Binge-watch review:** read the episode list in order as a viewer. Flag ideas used before taught, callbacks past an unrelated episode, ideas taught twice, episodes that don't follow from the last ending. Fix by moving material, not by adding recap lines.
- **Renumbering:** list which built episodes' lines and end cards change, and how long the re-voice and re-render take.

## Find the episode's story

- **Sources are a starting point, not the syllabus.** Notes list what the person found important; a repo lists what was built. Neither order is story order. Teach the ideas so each builds on the last, and use the real thing (a frame, a log, a line of code, one real row) as evidence where it makes an idea concrete, not as a data dump.
- **One central question,** asked once, in the title's words (an opening asking "why two?" under a title saying "three" loses the viewer).
- **Hook within 30 seconds.** Open on the result or the surprising consequence, then ask how it happens. Of the available applications, the most surprising one sticks best.
- **Say training or inference up front,** and which step of the training loop (forward, loss, backward, update).
- **Two to four key concepts, one per chapter,** each named in one plain sentence before scripting. If you can't, the chapter is about too many things.
- **One spine picture** that persists and changes: each chapter asks a different question of the same object and shows the view built for that question. Light the series anchor at the start and the end.
- **For "why does X exist" episodes, tell it as a discovery:** the obvious first try, where it breaks, the fix, the next flaw, the next fix (compare embeddings directly → two matrices → a third). It needn't match history; say it's a path, not the history.
- **Prerequisites first:** define every term in plain words right before the first idea that needs it, or cut it.
- **Chain the chapters:** each ends on its takeaway and the question the next answers.
- **Triage:** key concepts get a picture and time; supporting facts go to the description or extended cut; trivia is cut.
- **Series:** "Margin Notes", numbered from 01 in viewing order; each end card names the next episode.

## Format

- **YouTube, 16:9 at 1920×1080,** one video split into YouTube chapters (each at least 10 s, the first at 0:00, so a short title card belongs to chapter 1). Separate videos only when each answers its own question.
- **Length follows the voice:** estimate about 10 to 12 lines a minute at normal pace (slow number lines run about half that); aim near 9 minutes (a season may set its own target; write it in the review rules). Typical viewers stop around 6 minutes, so each chapter should stand on its own as a segment.
- **Deep dive = extended cut:** a longer video that goes further (data, code, math), joined into the episode after the chapter it extends (details in `build-check-deliver.md`).
- **Vertical clips only when asked.**
