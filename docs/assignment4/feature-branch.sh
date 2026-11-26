#!/usr/bin/env bash
# Assignment 4 / Part IV — create the feature branch and a visible content update.
# Run from the repository root AFTER switching to main and pulling.
# This script is provided for YOU to run; git state was not modified by the
# assistant. It only touches one string in the portfolio content file.
set -euo pipefail

BRANCH="feature/assignment4-release-badge"
OLD="Open to senior engineering roles & architecture consulting"
NEW="Release 1.0 · Open to senior engineering roles & architecture consulting"

if git show-ref --verify --quiet "refs/heads/$BRANCH"; then
  echo "Branch $BRANCH already exists. Switch to it or delete it first."
  exit 1
fi

git switch -c "$BRANCH"

python - "$OLD" "$NEW" <<'PY'
import pathlib, sys
old, new = sys.argv[1], sys.argv[2]
p = pathlib.Path('client/src/data/portfolio.js')
text = p.read_text(encoding='utf-8')
if old not in text:
    raise SystemExit('Expected hero status string not found; edit the content file manually.')
p.write_text(text.replace(old, new, 1), encoding='utf-8')
print('Updated hero status chip in client/src/data/portfolio.js')
PY

git add client/src/data/portfolio.js
git commit -m "feat: mark Assignment 4 release in hero status chip"
git push -u origin "$BRANCH"

cat <<EOF

Branch pushed: $BRANCH
Next: open the Pull Request ($BRANCH -> main), wait for the green
      "CI/CD - tests, build, deploy" check, then merge.
With GitHub CLI:
      gh pr create --fill --base main --head $BRANCH
      gh pr checks --watch
      gh pr merge --merge
EOF
