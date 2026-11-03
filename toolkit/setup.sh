#!/usr/bin/env bash
# One-time setup in a fresh workspace: local MathJax and fonts for renders, Python packages for TTS.
# The Kokoro model files (~340 MB) download on the first tts.py run.
set -e
cd "$(dirname "$0")"
mkdir -p .deps
( cd .deps && [ -f package.json ] || echo '{"private":true}' > package.json; \
  npm install --silent --no-audit --no-fund mathjax@3.2.2 @fontsource/patrick-hand @fontsource/jetbrains-mono )
pip install --quiet --break-system-packages kokoro-onnx soundfile pillow playwright 2>/dev/null || \
pip install --quiet kokoro-onnx soundfile pillow playwright
python3 -c "import kokoro_onnx, PIL, playwright; print('python deps ok')"
ls .deps/node_modules/mathjax/es5/tex-svg.js .deps/node_modules/@fontsource/patrick-hand/files/patrick-hand-latin-400-normal.woff2 >/dev/null && echo 'web deps ok'
