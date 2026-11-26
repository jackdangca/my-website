# Assignment 4 — Part IV: CI/CD runbook

> This repository's git state was deliberately **not modified** during the
> preparation of this submission. The workflow file is ready; the branch,
> commit and merge below are the steps **you** run on your machine so the
> evidence (Actions run, PR, before/after screenshots) is genuinely yours.

## 1. What is already in place

| File | Purpose |
|---|---|
| `.github/workflows/ci-cd.yml` | On every PR/push to `main`: installs deps, runs backend unit tests, React component tests, builds the client, starts MongoDB 7 + API + Vite preview, runs Cypress E2E, uploads screenshots/video, then triggers the deploy hook and verifies the public URL. |
| `scripts/verify-deployed.mjs` | 13 post-deploy checks: frontend, health/DB, public API, contact form, registration, 403 authorization, admin CRUD. |
| `scripts/feature-branch.sh` | Creates the feature branch and applies the visible content update. |
| `render.yaml` / `Dockerfile` | Cloud service definitions used by the deploy step. |

## 2. Configure GitHub secrets (one time)

Repository → **Settings → Secrets and variables → Actions → New repository secret**:

| Secret | Value |
|---|---|
| `JWT_SECRET` | `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"` |
| `ADMIN_EMAIL` | The admin account for the deployed app |
| `ADMIN_PASSWORD` | Strong password (also set on Render) |
| `RENDER_DEPLOY_HOOK_URL` | Render service → **Settings → Deploy Hook → Copy** |
| `DEPLOYED_URL` | `https://<your-service>.onrender.com` |

No secret is written to any file in the repo. `.env` is git-ignored and the
workflow reads everything from `secrets.*`.

## 3. Feature branch + visible content update

The visible update changes the hero status chip on **every page** from
`Open to senior engineering roles & architecture consulting` to
`Release 1.0 · Open to senior engineering roles & architecture consulting`.
It is a one-line change in `client/src/data/portfolio.js`, so the before/after
screenshots are easy to compare.

```bash
# From the repository root, on the main branch:
git switch main
git pull origin main
bash docs/assignment4/feature-branch.sh
```

The script creates `feature/assignment4-release-badge`, edits the string,
commits and pushes it. Then open a Pull Request on GitHub
(`feature/assignment4-release-badge` → `main`), wait for the **CI/CD - tests,
build, deploy** check to go green, and merge. Alternatively, if `gh` is
installed:

```bash
gh pr create --fill --base main --head feature/assignment4-release-badge
gh pr checks --watch
gh pr merge --merge
```

## 4. Evidence to capture

1. **Before** — screenshot of the deployed homepage hero chip (old text).
2. GitHub PR page showing the changed line.
3. Actions run page with all jobs green (`Test + build`, `Update deployed application`).
4. Render deploy log / deploy hook 200 response.
5. **After** — screenshot of the deployed homepage hero chip (new "Release 1.0" text).
6. `docs/assignment4/deployment-verification.json` (or the Actions log) showing 13/13 PASS.

The `test` job also uploads an artifact named `assignment4-test-evidence`
containing the Cypress screenshots and MP4 recording from the CI run.
