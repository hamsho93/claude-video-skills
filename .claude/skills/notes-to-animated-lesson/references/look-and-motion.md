# Look and motion: the Margin Notes style

These are the series' choices; a new series may make others, but writes them down before building.

## Page

- **Paper:** cream #F6F6EA with a graph grid (40 px minor #D9E3E6, 200 px major). Pages are 1920×1080, laid out as a spread on a desk (gap 200 px); the camera moves between pages, and the video ends by zooming out over the spread. Fill every slot (the last can hold the end card or further reading). A 3 × 2 spread fits a nine-minute episode; 4 × 3 (fifteen minutes) was too much.
- **Every page:** a small olive series line ("Margin Notes · NN · title"), the page title in dark green with a hand-drawn underline, a fixed tab ("EPISODE NN" or "DEEP DIVE"), and the step strip (initialize, forward, loss, backward, update, repeat) top right with the current step lit: green for the forward pass, orange for training-only steps.
- **One big central picture per chapter:** the middle of the page at real size; the yardstick along the bottom; the rule to one side. Leave the rest empty.

## Inks (one meaning each, written down before building)

- Black #1A1A1A drawings; dark green #1E5631 titles, structure and "the answer".
- Assign magenta #E0218A, blue #4F63E6, orange #F2A33A, olive #7A8F1C (teal #0F8B8D when needed) to the video's recurring things and keep them across an arc. Transformers: magenta = queries and lookers, blue = keys and targets, olive = values, teal = blends, orange = failures and training nudges. Arc 3: blue = the teacher, magenta = the untrained small model, teal = the trained student, green = the grader.
- A thing drawn in a role's colour must really be that thing (a raw row standing in for a query stays plain ink). Hatched boxes mark learned weights. Failures use orange, never red.
- **Highlighters:** cyan #8EE6EE names, orange #F9C98A key numbers, lime #8EF08E the key word. Red is never used.
- **Pen:** wobbly hand-drawn strokes with seeded randomness; strokes draw on; handwriting writes left to right through a clip wipe; math is MathJax SVG with `\textcolor`.
- **Fonts:** Patrick Hand for handwriting (it lacks →, ≈, ÷, α, θ: draw arrows, set symbols in MathJax), JetBrains Mono for code. Labels 28 to 34 px, nothing under 22 px at camera scale 1; math 36 px and up.

## Motion

- **One mover at a time.** Stagger entrances. A composite counts as one (`grp([...], 'name')`); a row of boxes updating together, with its bars and working line, counts as one. At most 2 things moving at once; measure it (`clutter.py`).
- **See, then hear:** each visual starts about 0.3 s before the word it belongs to, so the eye is already there when the voice names it.
- **Spotlight, then clear.** When a part is done, fade its label; dim (0.2 to 0.3) only structure that stays relevant. Two labels from different lines never share a spot.
- **The screen forgets:** at any moment, one idea plus its context. Short labels on screen, full sentences in the voice.
- **Density ramp:** each chapter starts sparse, builds to its busiest frame at its main point, and ends on a simple takeaway card.
- **Vary the picture:** don't use the same kind of picture three chapters running (tables, bars, arrows and flows, a dial, a heat grid).
- **Transform instead of cut:** camera moves between pages; objects slide into new roles; values computed in place fly to where they apply. The same table rebuilt beats a new table drawn.
- **Animate the quantity, not just the label:** bars grow to the real value, frames cross out as they're missed; drive them with trackers.
- **Magnify tiny effects** with a loupe; **zoom carefully** so the view stays inside the page.
- **Labels never sit on drawings or on each other;** check free space before placing one (`overlap.py` catches label-on-label and off-page).
- **A page is never blank while the voice talks.** The camera usually lands on a new page just as its first line starts, after a 1 s move, so the page's first mark (its title, a frame, the empty boxes) is written as the camera lands, not at a later word; the words then follow the voice. Within a page, don't clear the last picture seconds before the next one arrives: keep it until just before. `scan.py` measures this.
- **Hold what matters:** keep a picture up while the voice still talks about it; fade it at the next idea's word, not the line boundary.
- **Subtitles are a soft track, never burned in.**

## Alternative: the 3Blue1Brown look (only when asked)

Black background, Computer Modern math, STIX Two Text labels; blue #58C4DD, yellow #FFFF00, green #83C167, red #FC6255, teal #5CD0B3, gold #F0AC5F, purple #9A72AC, pink #D147BD. Same rules otherwise.
