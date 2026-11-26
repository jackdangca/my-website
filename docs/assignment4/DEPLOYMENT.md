# Assignment 4 — Part III: cloud deployment guide

The application keeps the MongoDB / Mongoose architecture from Assignments 2
and 3. Nothing in the persistence layer was changed: `Backend/config/db.js`
still calls `mongoose.connect(process.env.MONGO_URI)`.

## 0. Values to supply to finish Part III

**Status (25 Nov 2026): step 1 is DONE.** The local `.env` now points at MongoDB
Atlas (`cluster0.xzv5qdp.mongodb.net`, database `Portfolio`, SRV/TLS). The switch
was made with `scripts/switch-db.mjs`; the original local URI is backed up in the
git-ignored `.env.pre-atlas`. All 6 backend + 18 component + 3 E2E tests and the
13 deployment checks were re-run against Atlas and passed. Only step 2 (a public
cloud web service for the Express API) remains.

The remaining values are account-owned. Provide these to the assistant (or enter
them yourself in the platform's Environment settings).
**Never paste them into a tracked file — `.env` and `.env.*` are git-ignored.**

| # | Value | Example / where to get it |
|---|---|---|
| 1 | `MONGO_URI` | **DONE** — Atlas → Cluster → Connect → Drivers → Node.js SRV string; copy the same value into the cloud platform's Environment settings |
| 2 | Cloud web-service target | Render Blueprint (`render.yaml`), Railway, Fly.io, or a container host; plus its **public URL** and, if used, the **deploy hook** |
| 3 | `JWT_SECRET` | `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"` |
| 4 | `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Bootstrap admin seeded on first boot; also used by the post-deploy checks |
| 5 | `CLIENT_ORIGIN` / `DEPLOYED_URL` | The public URL itself (single-origin hosting needs no CORS, but set it anyway) |

Atlas **Network Access** must allow the platform's egress (use `0.0.0.0/0` for a
free-tier demo). The build-time variable `VITE_API_URL` must stay **empty**.

Once the service is live, the assistant runs:

```bash
DEPLOY_ADMIN_EMAIL=<admin> DEPLOY_ADMIN_PASSWORD=<password> \
  node scripts/verify-deployed.mjs https://<your-service>.onrender.com
```

That writes `docs/assignment4/deployment-verification.json` and, when all 13
checks pass against the cloud database, the Word report is regenerated with the
real cloud result. No MongoDB/Mongoose code changes are involved.

WorkBuddy's built-in publish channel cannot host this backend: it exposes one
HTTP port and explicitly rejects projects that require MongoDB. A real cloud web
service plus Atlas is required — do not substitute a static-only build for it.

## Architecture

```
Browser ──HTTPS──> single Node/Express service (Render / Railway / Fly / container)
                     ├── GET  /*            -> client/dist (React SPA, static)
                     └── /api/*             -> Express + JWT + Mongoose
                                                    │
                                                    └── MongoDB Atlas (SRV, TLS)
```

`SERVE_CLIENT=true` makes Express serve the built React client, so the browser
calls `/api/...` on the **same origin** (`VITE_API_URL` is empty at build time).
No CORS, no hard-coded `localhost:5000`, no secrets in the bundle.

## 1. MongoDB Atlas (cloud database)

1. Create a free **M0** cluster (any region; `us-east-1` / Toronto-friendly).
2. **Database Access** → add a user with a strong generated password.
3. **Network Access** → for a free-tier deployment add `0.0.0.0/0`
   (or the platform's static egress IPs for production).
4. **Connect → Drivers → Node.js** → copy the SRV string and append
   `/Portfolio?retryWrites=true&w=majority`. URL-encode special characters.
5. This becomes `MONGO_URI` in the platform's Environment settings — never in git.

The admin account is seeded automatically on first boot
(`Backend/controllers/authController.js#seedAdmin`) from `ADMIN_EMAIL` /
`ADMIN_PASSWORD`.

## 2. Deploy the web service

### Option A — Render Blueprint (recommended)

`render.yaml` at the repository root describes the service:

| Setting | Value |
|---|---|
| Build | `npm ci --prefix Backend && npm ci --prefix client && VITE_API_URL="" npm run build --prefix client` |
| Start | `node Backend/server.js` |
| Health check | `/api/health` |
| `SERVE_CLIENT` | `true` |
| `CLIENT_ORIGIN` | your public URL |
| `MONGO_URI`, `JWT_SECRET`, `ADMIN_*` | **secrets entered in the dashboard** |

Render → **New → Blueprint** → pick the repo → set the secret values → Apply.

### Option B — container platform

```bash
docker build -t myportfolio .
docker run -p 8080:8080 --env-file deploy/.env myportfolio
```

`Dockerfile` builds the client with an empty `VITE_API_URL` and runs the API +
static server in one image. See `deploy/env.example` for every variable.

### Option C — split frontend / backend

Build the client with `VITE_API_URL=https://your-api.example.com`, host
`client/dist` on Vercel/Netlify/Cloudflare Pages, host `Backend/` on Render,
and set `CLIENT_ORIGIN` to the frontend URL. Both services share one Atlas URI.

## 3. Verify the deployment

```bash
BASE_URL=https://<your-service>.onrender.com \
DEPLOY_ADMIN_EMAIL=<admin> DEPLOY_ADMIN_PASSWORD=<password> \
  node scripts/verify-deployed.mjs "$BASE_URL"
```

The script performs 13 checks and writes
`docs/assignment4/deployment-verification.json`:

| # | Check |
|---|---|
| 1 | Frontend HTML is served |
| 2 | `/api/health` reports an **actually connected** Mongoose database |
| 3 | `GET /api/projects` returns `{ success, data }` |
| 4 | Contact form POST returns 201 and persists |
| 5 | Registration returns a JWT and `role: user` |
| 6 | Regular user gets **403** on admin CRUD |
| 7 | Admin sign-in returns `role: admin` |
| 8–12 | Admin CREATE / READ / UPDATE / DELETE / absence-after-delete |
| 13 | Submitted contact is readable from MongoDB |

Run the same command inside CI: the `deploy` job does this automatically after
the Render deploy hook.

## 4. Secret hygiene

- `.env` and `.env.*` are git-ignored (`.env.example` is the only template).
- `cypress.config.js` reads secrets from `CYPRESS_*` / `ADMIN_*` environment
  variables, falling back to the local git-ignored `.env`; it contains no values.
- `render.yaml` uses `sync: false` for every secret.
- The GitHub workflow references only `${{ secrets.* }}`.
- Never log `JWT_SECRET`, `MONGO_URI`, or admin credentials; the E2E spec uses
  `{ log: false }` when typing the admin password.
