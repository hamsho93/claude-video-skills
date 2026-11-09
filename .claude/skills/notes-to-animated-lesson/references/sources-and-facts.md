# Sources and fact-check

## Gather

- **Goodnotes share links:** WebFetch is blocked (robots.txt), so open the link in a browser: Claude in Chrome first (the built-in pane has failed to load page tiles). Pages are drawn on canvas: read them by screenshot and zoom (`#page-N`). Hide the cookie banner with a style change, not by clicking Accept. After two failed tries, ask for a PDF export (Share, Export, PDF) or screenshots.
- **PDF of handwritten notes:** rasterize every page and read the images; keep them for the "checked against your notes" table.
- **Repos and research:** read the write-ups first (docs/, READMEs, design notes, test results), then the code they point to. Collect real evidence: frames, charts, logs, tool definitions, one real training row.
- **Keep the evidence:** for every claim that reaches the screen, note the file or log behind it and how the number was computed. Expect "is that valid? show me the log".
- **Keep secrets out:** cloud account IDs, ARNs and bucket names never go on screen, in code cards or in descriptions. Record per-episode publishing limits (results not yet public, private designs) in the plan doc.
- **Real images:** ask before showing a person's face or other people's content in a public video; offer a drawn stand-in.
- **Concept inventory:** every claim, number, diagram and definition with its source (page, file, line), and what the author highlighted or called a finding. Where the notes have a layout for something (a table with labelled edges, a formula with braces), reuse it on screen: the person recognizes it.

## Fact-check

- Check against primary sources: official docs, spec tables, the original papers, the official implementation's defaults. Recompute all arithmetic, and check the inputs and assumptions too.
- Recompute headline numbers from the raw logs, not the write-up, and say which statistic you used (a per-decision median and a median of per-mission medians can differ by 15%).
- Keep units consistent across a ratio (FLOPs count multiply and add separately; MACs count them once).
- A hardware-dependent number (seconds per move) gets its setup in the fact notes and, where one exists, a hardware-independent measure beside it (tokens per move).
- **Comparing two systems on the same test items:** compare paired (McNemar on the items where they disagree); the sample is the items, not reruns at temperature 0. Check significance and the test size the gap needs before saying one beats the other; when it isn't settled, say "matches, may beat".
- Classify each source item as correct, imprecise or wrong; teach the correct version. Mark illustrative numbers in the fact notes; prefer real data over a made-up shape when it exists.
- **Toy embeddings have no column meanings.** Columns are 1, 2, 3, never "money, water". Give the toy its handle at the level of words ("bank's row sits halfway between river's and loan's") and read a result by comparing it with rows the viewer knows. Meaning lives in directions spread across columns (Elhage, Lasenby & Olah 2023, Privileged Bases). If an earlier episode named columns, the next says once that the names were a reading aid.
- **Say what point in training the toy stands for:** partway through (T02's hand-set toy), or a real tiny model from its random day one to trained (a season that teaches training). A random start is random: don't present one seed's behaviour as the model's.
- **Claims about the toy hold across runs.** Train it again from other random starts (20 runs is cheap for a toy) and state a property of the toy only if it holds in nearly all of them; otherwise say "in this run" or give the count. Keep the runs in the fact file.
- Find the common wrong intuitions about each key concept while you research (forum questions, textbook "common mistakes", what the notes themselves got wrong). They become the "natural wrong guess" beats in the script.
