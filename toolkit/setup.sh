#!/usr/bin/env bash
# One-time setup in a fresh workspace or on your own machine.
# Needs Python 3, Node (npm) and ffmpeg. Installs local MathJax and fonts (renders never touch the network),
# the Python packages for voice and rendering, and Playwright's Chromium if no working browser is found.
# The Kokoro voice model (~340 MB) downloads on the first tts.py run.
set -e
cd "$(dirname "$0")"
missing=()
for t in python3 node npm ffmpeg ffprobe; do command -v "$t" >/dev/null || missing+=("$t"); done
if [ ${#missing[@]} -gt 0 ]; then
  echo "Missing: ${missing[*]}. Install them first (macOS: brew install python node ffmpeg; Debian/Ubuntu: apt install python3 python3-pip nodejs npm ffmpeg), then re-run setup.sh."
  exit 1
fi
mkdir -p .deps
( cd .deps && [ -f package.json ] || echo '{"private":true}' > package.json; \
  npm install --silent --no-audit --no-fund mathjax@3.2.2 @fontsource/patrick-hand @fontsource/jetbrains-mono )
pip install --quiet --break-system-packages kokoro-onnx soundfile pillow playwright 2>/dev/null || \
pip install --quiet kokoro-onnx soundfile pillow playwright
python3 -c "import kokoro_onnx, PIL, playwright; print('python deps ok')"
ls .deps/node_modules/mathjax/es5/tex-svg.js .deps/node_modules/@fontsource/patrick-hand/files/patrick-hand-latin-400-normal.woff2 >/dev/null && echo 'web deps ok'
# A browser renders the frames. Claude cloud sessions already have one; install Playwright's only if none launches.
browser_ok() { python3 - <<'PY' 2>/dev/null
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    p.chromium.launch().close()
PY
}
if browser_ok; then echo 'browser ok'; else
  echo 'no working browser: installing Playwright Chromium'; python3 -m playwright install chromium
  browser_ok && echo 'browser ok' || { echo 'Chromium still does not launch (on Linux try: python3 -m playwright install-deps chromium)'; exit 1; }
fi
