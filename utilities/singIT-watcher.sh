#!/usr/bin/env bash
# add delete,moved_from when relevant
inotifywait -m -r -e close_write,moved_to --format '%w%f' "$WATCH_DIR" | grep '\.txt$' --line-buffered |
  while IFS= read file; do
    "$SCRIPT" -s "$file"
  done