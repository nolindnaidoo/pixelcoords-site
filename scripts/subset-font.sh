#!/usr/bin/env bash
# Regenerate the latin-subset woff2 the site serves (app/fonts.ts). Run when
# the vendored TTF changes or a page needs glyphs outside these ranges — a
# missing glyph shows as tofu, which the visual-regression snapshots catch.
# Ranges: Latin-1 + punctuation/dashes + arrows + box drawing (the save-tree
# code sample) + checkmark. Requires: brew install fonttools
set -euo pipefail
cd "$(dirname "$0")/.."
pyftsubset app/fonts/JetBrainsMono-Regular.ttf \
  --flavor=woff2 \
  --output-file=app/fonts/JetBrainsMono-Regular.subset.woff2 \
  --unicodes="U+0020-00FF,U+2010-2027,U+2190-21FF,U+2500-257F,U+2713" \
  --layout-features='*'
ls -la app/fonts/JetBrainsMono-Regular.subset.woff2
