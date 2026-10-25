#!/usr/bin/env bash
# capture.sh: open CAPTURE_URL in a browser, wait for rendered content, and
# capture desktop + mobile screenshots (final-desktop.png / final-mobile.png)
# into CAPTURE_DIR. Exits 75 for temporary navigation/browser infrastructure
# failures, 1 for script or rendering defects. Leaves the app running.
# Every significant command is timed.
set -uo pipefail

CAPTURE_URL="${CAPTURE_URL:?CAPTURE_URL is required}"
CAPTURE_DIR="${CAPTURE_DIR:?CAPTURE_DIR is required}"

t() { /usr/bin/time -p "$@"; }
fail_infra() { echo "[capture.sh] infrastructure/temporary failure: $1" >&2; exit 75; }
fail_defect() { echo "[capture.sh] script/rendering defect: $1" >&2; exit 1; }

t mkdir -p "$CAPTURE_DIR"
echo "[capture.sh] url=$CAPTURE_URL dir=$CAPTURE_DIR"

browser_opened=false
cleanup() {
  if [[ "$browser_opened" == true ]]; then
    playwright-cli close 2>/dev/null || true
  fi
}
trap cleanup EXIT

# ---- open the exact URL ----
if ! t playwright-cli open "$CAPTURE_URL"; then
  fail_infra "could not open browser or navigate to CAPTURE_URL"
fi
browser_opened=true

# ---- wait for rendered content: the three.js WebGL canvas must exist ----
rendered=false
for attempt in $(seq 1 30); do
  if out="$(t playwright-cli eval "(() => { const c = document.querySelector('canvas'); return !!(c && c.width > 100); })()" 2>&1)" \
     && [[ "$out" == *true* ]]; then
    rendered=true
    break
  fi
  t sleep 1
done
[[ "$rendered" == true ]] || fail_defect "page never rendered a WebGL canvas (three.js scene missing)"

# settle: allow fonts/menu to paint, then a couple of frames
t sleep 2

# ---- desktop view ----
if ! t playwright-cli resize 1280 800; then
  fail_infra "browser resize failed"
fi
t sleep 1
if ! t playwright-cli screenshot --filename="$CAPTURE_DIR/final-desktop.png"; then
  fail_infra "desktop screenshot capture failed"
fi

# ---- mobile view ----
if ! t playwright-cli resize 390 844; then
  fail_infra "browser resize failed"
fi
t sleep 1
if ! t playwright-cli screenshot --filename="$CAPTURE_DIR/final-mobile.png"; then
  fail_infra "mobile screenshot capture failed"
fi

# sanity: screenshots must be non-trivial files
for f in "$CAPTURE_DIR/final-desktop.png" "$CAPTURE_DIR/final-mobile.png"; do
  if ! t test -s "$f"; then fail_defect "screenshot $f missing or empty"; fi
  size="$(t wc -c < "$f")"
  echo "[capture.sh] $f bytes=$size"
  (( size > 20000 )) || fail_defect "screenshot $f suspiciously small ($size bytes)"
done

# ---- close our own browser ----
t playwright-cli close || true
browser_opened=false

echo "[capture.sh] capture complete in $CAPTURE_DIR"
exit 0
