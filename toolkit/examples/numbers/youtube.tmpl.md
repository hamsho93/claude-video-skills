# YouTube text: Episode 2 (template for `ledger.py fill`)

On day one, our tiny model puts {{pct:ep2.p_correct}}% of its probability on "flooded". How wrong is that?

Chapters
{{chapters}}

## The numbers on screen
- Day-one probabilities: {{f2:ep2.P_pos1}}.
- The loss: −ln({{f2:ep2.p_correct}}) = {{f2:ep2.L1_from_displayed_p}}.
- An even guess over the {{raw:ep2.perplexity.even_guess}} outputs scores {{f2:ep1.even_guess_loss_ln_outputs}} (ln 7).
