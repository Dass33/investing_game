#!/usr/bin/env bash
# Builds the game and publishes it to GitHub Pages (the gh-pages branch):
set -euo pipefail
cd "$(dirname "$0")"

bun install
bun run build
bun run deploy

echo "Done, game updates shortly"
