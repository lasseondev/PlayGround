#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0)"

# Per-command timing wrapper
timing() {
    echo "START: $(date +%s.%N)"
    "$@"
    echo "END: $(date +%s.%N)"
}

# Write deployment output
mkdir -p "/home/runner/work/_temp/omgithub-web"
echo '{"project":"/home/runner/work/PlayGround/PlayGround","directory":"/home/runner/work/PlayGround/PlayGround/dist"}' > "/home/runner/work/_temp/omgithub-web/deployment-output.json"

# Build and serve
timing /usr/bin/time -p node "${RUNTIME_DIR:?}/scripts/default-start.mjs"
