# The teaching rules

A script that is all true can still lose the viewer in the first minute. Test every chapter against these before recording.

## Audience

Decide the audience with the person before scripting, and write it in the plan doc's review rules.

- **Newcomers:** everyday words first, one analogy per concept, technical terms only when later chapters use them.
- **Engineers (staff level):** a clear, in-depth discussion, never an oversimplified one. Name the real term the first time the idea appears (logits, softmax, cross-entropy, negative log-likelihood, gradient descent, parameters) and say why each step is the way it is (why the log: products become sums; the slope at the logits is p − y). Simplify by leaving parts out and listing them on screen ("what the toy leaves out: word order, extra layers, layer norm"), not by renaming or blurring what is shown. Analogies only where they map the mechanism; none is fine.
- **Words that collide.** A friendly word for a real term is fine once both are said ("308 parameters; we'll call them dials"); a word that already means something else in the field is not ("weights" for parameters when attention weights are on screen; "score" for a probability when scores will mean logits). Fix it in the script before voicing: a later episode inherits the word.

## Order of ideas

- **Picture first, then the name, then the number.** Show the idea working before naming it; name it before putting a number on it.
- **Real size first, then the toy,** in the same chapter (the 512-wide vector, the 512 × 64 matrix, the 30 × 30 table), and say why the toy is small ("small enough to read").
- **Show the natural wrong guess, then let it fail.** For each key concept, write the obvious first try a smart newcomer would make ("compare the words' embeddings directly"). Stage it as the reasonable thing to try, let the numbers show where it breaks (both directions score the same; bank listens mostly to itself), then bring in the fix. In studies of physics videos, clear explanations left students confident but not learning; showing the common wrong idea first made them learn. This is the viewer's guess, never the source's error: no "your notes said", no red strokes.
- **Name things before using them, and label a thing by what made it.** A vector made by Wq is q(word); a raw embedding standing in for a query is still x(word), tagged "as its query: no Wq", in plain ink, not the query colour. Table edges carry the names of what sits on them. The first time a symbol appears, say in words what it is.
- **Built versus background.** When a chapter presents alternatives, say at its start which one this project did, and keep a "this project" marker on screen from the start.

## Make the viewer think

- **Predict before you compute.** Before a number is worked, say what each input does in words ("a note is how loudly the word asks; a label is how findable it is") and let the viewer guess the outcome ("loud times findable: big"). The number confirms it. A number the viewer couldn't have predicted is arithmetic watched, not an idea learned.
- **Real pauses.** Put the question on screen as a question card, give the line `think=True` (at least 2.5 s of silence), then answer. At least one per chapter. The pause is thinking time, not dead air.
- **"Your turn."** Work one example aloud in full. Then pose the next one as a question ("river's row: which share is biggest?"), pause with `think=True`, fill it in, and let the rest update together by the same rule.
- **Turn a dial.** Once per episode, at the key concept, change one input with a tracker and let every number after it update live: Wq's 4 slides down to 0 and bank's share on river falls from 68% to a third. Don't explain what would happen; make it happen. In the scene:
  ```js
  const k = trk({ v: 4 });                          // the input (trk() as in examples/t02-scene.js)
  S.set(k, a('dial') + 0.3, 2.5, { v: 0 });         // slide it while the voice says "dial"
  S.drive(() => {                                   // recompute everything downstream from k.v.v
    const q = 0.9 * k.v.v, e = [0.2, 0.9, 0.2].map(x => Math.exp(x * q / Math.sqrt(3)));
    const share = e[1] / (e[0] + e[1] + e[2]);
    qText.textContent = q.toFixed(2); shareText.textContent = Math.round(share * 100) + '%';
    bar.setAttribute('width', (share * 300).toFixed(1));
  });
  ```
  Compute downstream values with the real formulas, never by interpolating the end values, and hold the end state long enough to read.

## The numbers

- **Work in full the calculations that carry the argument; name the rest.** Every product, every sum, the result, for the step that proves the point. A softmax worked in an earlier episode, a parameter count, a training step in an episode about something else: one line ("as T01 worked it: 27, 30, 43") and a pointer to where it's worked. Everything worked on screen is at one precision, a season choice (T02: three decimals; the encoder-decoder season: two decimals, rounded at every step so each step can be checked with a calculator, and one note showing full precision gives the same story).
- **Guide the eye.** The question first, in words. The formula on top as the map, with the part being worked lit. The values in one row of boxes that change in place (old value small and grey above the new, a bar for size). One example aloud with its numbers flying in from where they came, then the rest together. Zero terms greyed. One working line at a time, collapsing to its result. The voice says at most two numbers per line; the screen carries the rest.
- **Label each part of a formula by its job,** in plain words, with braces or small tags while the formula is the map: QKᵀ "how well each note matches each label", ÷√dₖ "keeps the scores small", softmax "turns scores into shares". Dim the labels once the viewer knows them; bring one back when its part is worked.
- **Show where every number comes from.** A vector flies in from its row; a matrix is written out before it's used; a result travels to where it's used next. If a page needs data from the previous page, it slides along with the camera.
- **Slow down for the numbers** (`slow=True`: speed 0.86, about 0.5 s between sentences, at least 1.2 s after). The animation gets the same room: fly-ins and working lines a third slower than conversational beats. Conversational lines keep normal speed and get pace from fewer words.
- **One yardstick per chapter:** one quantity the viewer can feel, every number compared to it on screen.
- **Quantities as sizes you can see:** bars, heaps, frames crossed out; digits after the picture has made the point.

## Words

- **The analogy and the math meet.** Say the numbers in the analogy's words in the same breath as the digits ("bank's note reads 3.6: it's asking loudly"). One analogy per concept, kept for the whole episode; it must map the mechanism (say what corresponds to what) and say where it breaks if a later chapter depends on that.
- **Every claim answers its why,** in one clause or picture ("4 billion weights at 2 bytes is about 8 GB, which fits a laptop's memory"). An engineering lesson needs its concrete story or gets cut.
- **Make units concrete the first time** (the 16 pieces of one real move); say what one training example is and show one real row with its path.
- **Toys say they're toys:** made up and why, what point in training they stand for, their simplifications in the fact notes.
- **Honest examples.** A chosen seed, run or sentence gets its base rate on screen: how often the shown behaviour happens across random starts or other runs (in this run, the top word was wrong; over 1,000 starts it was right 454 times, the other sense 414, the end marker 132: close to chance). Say "a typical run" only with the count behind it. Where the toy makes a result trivial (a key that is one number), say so and why the point survives at real size.
- **Everyday words and units:** "a tenth of a second", "nearly a million numbers". Define a technical term in plain words the first time; for newcomers keep it only if later chapters use it, for engineers always give it.
- **Short spoken lines:** one or two sentences per line, a rhetorical question where it helps ("Why does this work? Because..."). Read each aloud; one that's hard to say is too long.
- **One plain takeaway per chapter,** on a short card for at least 2 s, then the hand-off.

## The checks before recording

- **Lost-viewer check:** read each chapter as a smart friend outside the field. Count new terms and numbers; anything without a picture first gets one or is cut.
- **Viewer pass (separate from the fact-check):** does each chapter change the spine picture; could the viewer predict each number; is there a wrong guess, a prediction pause and a dial; does the analogy carry the math; is anything worked that doesn't carry the argument; what is the one image a viewer remembers in a month? "Correct but doesn't stick" is a structure problem: fix it by cutting and reordering, not by slowing down.

## Deep dives (math and code)

- **Pitch:** easy to absorb but adequate for a staff engineer; deep on the method this project used, not a survey.
- **Inside a derivation:** the concrete computation with a real worked number first, then the formula, then the derivation as the justification.
- **Code cards:** real code, trimmed; added comments labelled "comments added for the video"; only the narrated line lit.
- **Real data:** one real example from the training file, with its path, "abridged" where trimmed.
- **In the description, not the narration:** citations, exact figures, implementation details.
- What the main episode names but doesn't work (a training step, a gradient, a parameter count) is the deep dive's table of contents.
