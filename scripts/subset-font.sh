#!/usr/bin/env bash
# Regenerate the latin-subset woff2 the site serves. Run when the tool repo's
# vendored TTF changes or a page needs glyphs outside these ranges — a missing
# glyph shows as tofu, which the visual-regression snapshots catch.
#
# The TTF is NOT vendored here. It lives in the tool repo, which is where it is
# already a build input, and a second copy would be a binary that drifts in
# silence. This script reads it from there; the subset woff2 it writes is the
# only font file this repo commits.
#
# Ranges: Latin-1 + punctuation/dashes + arrows + box drawing (the save-tree
# code sample) + checkmark. Requires: brew install fonttools
set -euo pipefail
cd "$(dirname "$0")/.."

TTF="../pixelcoords/crates/pixelcoords-core/assets/JetBrainsMono-Regular.ttf"

if [[ ! -f "$TTF" ]]; then
  echo "subset-font: no TTF at $TTF" >&2
  echo "The tool repo must be checked out beside this one." >&2
  exit 1
fi

pyftsubset "$TTF" \
  --flavor=woff2 \
  --output-file=public/fonts/JetBrainsMono-Regular.subset.woff2 \
  --unicodes="U+0020-00FF,U+2010-2027,U+2190-21FF,U+2500-257F,U+2713" \
  --layout-features='*'

ls -la public/fonts/JetBrainsMono-Regular.subset.woff2
