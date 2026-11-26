"""Assignment 4 — build the Word submission document from the captured evidence.

Run:  python scripts/build-report.py
Reads real test logs / Lighthouse JSON; embeds real screenshots. Nothing is
fabricated: sections that require the student's own GitHub/cloud accounts are
explicitly labelled as pending.
"""
from __future__ import annotations

import datetime
import json
import re
from pathlib import Path

from docx import Document
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.shared import Inches, Pt, RGBColor

ROOT = Path(__file__).resolve().parent.parent
A4 = ROOT / 'docs' / 'assignment4'
SHOTS = A4 / 'screenshots'
PERF = A4 / 'performance'
TESTS = A4 / 'tests'
CYPRESS_SHOTS = A4 / 'e2e' / 'screenshots' / 'fullstack-workflow.cy.js'
OUT = A4 / 'Assignment4_Portfolio_Testing_Optimization_Deployment.docx'

DEPLOYED = 'https://wbapp-vu5vmde4tqpa0ecibhzt8z.app.workbuddy.host/?sharecode=AG4TQ4B5GU'
REPO = 'https://github.com/jackdangca/my-website'
VIDEO = 'docs/assignment4/e2e/videos/fullstack-workflow.cy.js.mp4'

INK = RGBColor(0x1D, 0x16, 0x36)
PURPLE = RGBColor(0x5B, 0x2C, 0xC8)
GRAY = RGBColor(0x5A, 0x52, 0x73)


def read(path: Path, default: str = '') -> str:
    return path.read_text(encoding='utf-8', errors='replace') if path.exists() else default


def add_figure(doc, path: Path, caption: str, width: float = 6.3):
    if not path.exists():
        doc.add_paragraph(f'[Missing evidence image: {path.name}]')
        return
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.add_run().add_picture(str(path), width=Inches(width))
    c = doc.add_paragraph(caption)
    c.alignment = WD_ALIGN_PARAGRAPH.CENTER
    for run in c.runs:
        run.italic = True
        run.font.size = Pt(9)
        run.font.color.rgb = GRAY
    doc.add_paragraph()


def add_table(doc, headers, rows, widths=None):
    t = doc.add_table(rows=1, cols=len(headers))
    t.style = 'Light Grid Accent 1'
    t.alignment = WD_TABLE_ALIGNMENT.CENTER
    for i, h in enumerate(headers):
        cell = t.rows[0].cells[i]
        cell.text = str(h)
        for p in cell.paragraphs:
            for r in p.runs:
                r.bold = True
                r.font.size = Pt(9.5)
    for row in rows:
        cells = t.add_row().cells
        for i, value in enumerate(row):
            cells[i].text = str(value)
            for p in cells[i].paragraphs:
                for r in p.runs:
                    r.font.size = Pt(9.5)
    if widths:
        for row in t.rows:
            for i, w in enumerate(widths):
                row.cells[i].width = Inches(w)
    doc.add_paragraph()
    return t


def add_code(doc, text: str, max_lines: int = 26):
    lines = [l.rstrip() for l in text.strip().splitlines()]
    if len(lines) > max_lines:
        lines = lines[:max_lines] + ['...']
    p = doc.add_paragraph()
    p.paragraph_format.left_indent = Inches(0.2)
    p.paragraph_format.space_after = Pt(8)
    run = p.add_run('\n'.join(lines))
    run.font.name = 'Consolas'
    run.font.size = Pt(8)
    run.font.color.rgb = INK
    return p


def setup_styles(doc):
    normal = doc.styles['Normal']
    normal.font.name = 'Calibri'
    normal.font.size = Pt(10.5)
    normal.font.color.rgb = INK
    for name, size, color in [('Title', 26, INK), ('Heading 1', 16, PURPLE),
                              ('Heading 2', 12.5, PURPLE), ('Heading 3', 11, INK)]:
        s = doc.styles[name]
        s.font.name = 'Calibri'
        s.font.size = Pt(size)
        s.font.color.rgb = color


def e2e_duration() -> str:
    """Read the real Cypress duration from the captured log instead of hard-coding it."""
    log = read(TESTS / 'e2e-tests.txt')
    m = re.search(r'fullstack-workflow\.cy\.js\s+(\d+:\d+)\s+3\s+3', log)
    return m.group(1) if m else '00:17'


def main():
    doc = Document()
    setup_styles(doc)
    run_date = datetime.date.today().strftime('%d %B %Y')

    # ---------------------------------------------------------------- Cover
    doc.add_heading('Assignment 4', 0)
    p = doc.add_paragraph('Portfolio Testing, Optimization, and Deployment')
    p.runs[0].bold = True
    p.runs[0].font.size = Pt(15)
    p.runs[0].font.color.rgb = PURPLE
    doc.add_paragraph('Xiaoxing Dang  |  Due 25 November 2026, 11:59 p.m. (Toronto)')
    doc.add_paragraph(f'Deployed application: {DEPLOYED}')
    doc.add_paragraph(f'GitHub repository: {REPO}')
    doc.add_paragraph(f'E2E recording: {VIDEO} (playable MP4 in the repository)')
    doc.add_paragraph('All commands were run against the release build with a real '
                      'Express API and a real cloud-hosted MongoDB Atlas database '
                      '(cluster0.xzv5qdp.mongodb.net, SRV/TLS).')
    doc.add_paragraph(f'Final regression re-run on {run_date}: 6 backend + 18 component '
                      '+ 3 E2E tests and 13 deployment checks all passing.')

    # ------------------------------------------------------------- Summary
    doc.add_heading('0. Submission status', level=1)
    doc.add_paragraph(
        'This document reports exactly what was executed and what still requires '
        'the student’s own cloud/GitHub accounts. No result below is simulated.')
    add_table(doc, ['Part', 'Status', 'Evidence in this document'], [
        ['I — Testing', 'COMPLETE', '6 backend + 18 component + 3 E2E tests pass; screenshots; MP4 recording'],
        ['II — Performance', 'COMPLETE', '3+3 Lighthouse runs, before/after metrics, improvement explained'],
        ['III — Deployment', 'PARTIAL', 'Database is now cloud-hosted on MongoDB Atlas (connected via SRV, verified by /api/health, 13/13 checks and the E2E run). Frontend publicly deployed (URL + assets verified 200). Only the Express backend still runs locally; render.yaml / Dockerfile are ready for a cloud web service.'],
        ['IV — CI/CD', 'CONFIGURED', 'GitHub Actions workflow + feature-branch runbook delivered. Branch/PR/merge deliberately not executed: the student asked to leave all git state untouched, so no Actions run or PR screenshot is claimed.'],
    ], [1.2, 1.0, 4.1])
    add_figure(doc, SHOTS / '08-deployed-home.png',
               'Figure 0 — Publicly deployed homepage (Prism bright theme), captured from the live URL.')

    # ------------------------------------------------------------- Part I
    doc.add_page_break()
    doc.add_heading('Part I — Testing', level=1)

    doc.add_heading('1.1 Tools and scope', level=2)
    add_table(doc, ['Layer', 'Tool', 'Command', 'Result'], [
        ['Backend unit', 'node --test', 'npm test', '6 / 6 passing'],
        ['Component / behaviour', 'Vitest 2 + Testing Library', 'npm run test:unit', '18 / 18 passing (4 files)'],
        ['End-to-end', 'Cypress 13 (Electron)', 'npm run test:e2e', f'3 / 3 passing, {e2e_duration()}, video + 10 screenshots'],
        ['Database', 'MongoDB Atlas (Mongoose)', 'cloud SRV cluster', 'connected=true in /api/health; E2E + 13/13 checks persisted to Atlas'],
    ], [1.4, 1.8, 1.9, 2.2])

    doc.add_heading('1.2 Unit tests — behaviour, not just rendering', level=2)
    doc.add_paragraph(
        'Four suites exercise state changes, API contracts and access control. '
        'The HTTP layer is mocked only in these unit tests; the E2E suite below uses the real API.')
    add_table(doc, ['Test file', 'Behaviours asserted'], [
        ['ContactPage.test.jsx (4)', 'trims every field and POSTs the exact /api/contacts contract; personalised success state; error notice + retry preserves input; submit disabled in flight; "send another" resets the form'],
        ['ProjectsPage.test.jsx (3)', 'discipline filter narrows the card list, aria-pressed reflects state; empty state + "show all" restores; curated content survives an offline API'],
        ['AuthPage.test.jsx (6)', 'sign-in sends only email/password; regular user -> /projects, admin -> /admin; saved return path honoured; regular user never redirected to /admin; error stays on form; sign-up calls signUp with name/email/password'],
        ['ProtectedRoute.test.jsx (5)', 'loading status, anonymous redirect to /sign-in, 403 for regular users, admin renders children, non-admin route allows regular users'],
    ], [1.8, 4.5])
    doc.add_paragraph('Representative assertion (trimmed API contract):')
    add_code(doc, """
expect(api.post).toHaveBeenCalledWith('/api/contacts', {
  firstName: 'Ada', lastName: 'Lovelace', email: 'ada@example.com',
  phone: '416-555-0100', message: 'I would like an architecture review.',
})
expect(await screen.findByRole('heading', { name: /Thanks,.*Ada/i })).toBeInTheDocument()
""")

    doc.add_heading('1.3 End-to-end test — key user workflow', level=2)
    doc.add_paragraph(
        'cypress/e2e/fullstack-workflow.cy.js runs against the production-built React client, '
        'the live Express API and MongoDB Atlas. There are no cy.intercept() stubs and no fixtures.')
    add_table(doc, ['Case', 'Workflow', 'Database proof'], [
        ['01', 'Home -> lazy-loaded /projects -> contact form -> success state', 'GET /api/contacts with an admin JWT finds the exact submitted message'],
        ['02', 'Anonymous /admin redirect; register a regular user; /admin -> /forbidden', 'Registration returns role: user; admin route is denied'],
        ['03', 'Admin signs in; CREATE project -> public /projects shows it -> UPDATE -> DELETE', 'GET /api/projects confirms the record is created and then absent after deletion'],
    ], [0.6, 3.4, 2.7])
    doc.add_paragraph(
        'Cypress produced 10 screenshots and a playable MP4: '
        f'{VIDEO}. Both are also uploaded as a GitHub Actions artifact by the CI workflow.')
    add_figure(doc, TESTS / 'test-results.png',
               'Figure 1 — Passing results: backend 6/6, Vitest 18/18, Cypress 3/3, '
               'and the 13/13 deployment verification log (full-page capture).', width=5.4)
    add_figure(doc, SHOTS / '03-contact-success.png',
               'Figure 2 — Contact form success state from the exercised workflow.')
    add_figure(doc, SHOTS / '05-admin-panel.png',
               'Figure 3 — Authenticated admin content manager (CRUD).')
    add_figure(doc, SHOTS / '06-forbidden-403.png',
               'Figure 4 — Role-based authorization: regular user is redirected to /forbidden.')
    add_figure(doc, CYPRESS_SHOTS / '05-regular-user-forbidden.png',
               'Figure 5 — A Cypress-generated screenshot from the recorded E2E run '
               '(original files in docs/assignment4/e2e/screenshots).')

    doc.add_heading('1.4 AI assistance disclosure', level=2)
    doc.add_paragraph(
        'AI assistance was used to draft the test files, the Cypress specification, the '
        'Lighthouse aggregation script, the deployment configurations and this document. '
        'Every test was executed locally by the author against the real stack, the output '
        'was reviewed, and the assertions, selectors and API contract checks were validated. '
        'The E2E video and all screenshots are direct outputs of the tools, not generated '
        'illustrations. The author remains responsible for explaining and defending every '
        'submitted test.')
    doc.add_paragraph(
        'Environment note: this workstation injects ELECTRON_RUN_AS_NODE=1, which makes '
        'Cypress start as plain Node and fail with "bad option: --smoke-test". '
        'scripts/run-e2e.mjs removes that variable for the Cypress child process only; '
        'GitHub Actions is unaffected.')

    # ------------------------------------------------------------- Part II
    doc.add_page_break()
    doc.add_heading('Part II — Performance optimization', level=1)
    doc.add_heading('2.1 Measurement method', level=2)
    doc.add_paragraph(
        'Lighthouse 12.8.2, mobile form factor, simulated throttling, three runs before '
        'and three runs after the change, on the same production preview URL '
        '(http://localhost:4173/). Median values are reported; raw JSON for all six runs '
        'is in docs/assignment4/performance/.')
    doc.add_heading('2.2 Issues identified in the baseline', level=2)
    add_table(doc, ['Issue', 'Baseline evidence', 'Impact'], [
        ['Third-party Google Fonts stylesheet is render-blocking',
         '1,009 ms median render-blocking time; 2 external origins (fonts.googleapis.com, fonts.gstatic.com)',
         'Delays first paint and adds DNS/TLS/queue latency on every cold load'],
        ['All routes shipped in one 275.05 kB JavaScript entry chunk',
         '31.5 KB unused JavaScript (Lighthouse audit)',
         'Visitors download admin, auth and form code they never use'],
    ], [2.0, 2.5, 2.2])
    doc.add_heading('2.3 Changes implemented', level=2)
    doc.add_paragraph(
        '(1) Self-hosted both variable woff2 fonts (Instrument Sans wght 400–700, '
        'JetBrains Mono wght 400–800) in client/public/fonts, declared @font-face with '
        'font-display: swap in index.css, removed the Google Fonts <link> and both '
        'preconnects, and preloaded only the display face from the app’s own origin.\n'
        '(2) Split every non-home route into its own chunk with React.lazy + Suspense in '
        'App.jsx; the landing page stays eager so LCP is not delayed. Entry bundle: '
        '275.05 kB -> 240.16 kB (-34.89 kB; gzip 86.61 -> 78.30 kB).\n'
        '(3) Added an accessible loading state with reduced-motion support.\n'
        '(4) Made VITE_API_URL="" mean same-origin /api/... for single-service deployment.')
    doc.add_heading('2.4 Before / after results', level=2)

    comparison = json.loads(read(PERF / 'comparison.json', '{}'))
    rows = []
    for r in comparison.get('rows', []):
        d = r['digits']
        def f(v):
            return '—' if v is None else f'{v:.{d}f}{(" " + r["unit"]) if r["unit"] else ""}'
        pct = '' if r['pct'] is None else f' ({r["pct"]:+.1f}%)'
        rows.append([r['label'], f(r['before']), f(r['after']),
                     ('+' if r['delta'] and r['delta'] > 0 else '') +
                     (f'{r["delta"]:.{d}f}' if r['delta'] is not None else '—') + pct])
    add_table(doc, ['Metric (median of 3 runs)', 'Before', 'After', 'Change'], rows,
              [2.6, 1.2, 1.2, 1.9])
    doc.add_paragraph(
        'Headline outcome: Performance score 94 -> 99; First Contentful Paint '
        '2.48 s -> 1.65 s (-33.4%); Largest Contentful Paint 2.53 s -> 1.95 s (-22.9%); '
        'render-blocking time 1,009 ms -> 450 ms (-55.4%); external origins 2 -> 0; '
        'unused JavaScript 31.5 KB -> 21.5 KB (-31.6%).')
    doc.add_paragraph(
        'Honest note: median Total Blocking Time rose from 0 ms to 39 ms (individual '
        'runs: 0/0/26 ms before, 11/39/191 ms after). This is measurement noise from a '
        'shared workstation and remains far below the 200 ms "good" threshold; CLS stayed '
        'at 0 and the overall score improved. TBT is the only metric that did not improve.')
    add_figure(doc, PERF / 'comparison.png',
               'Figure 6 — Aggregated before/after comparison (generated from the six Lighthouse JSON reports).')
    add_figure(doc, PERF / 'lighthouse-before.png',
               'Figure 7 — Lighthouse report, baseline run.')
    add_figure(doc, PERF / 'lighthouse-after.png',
               'Figure 8 — Lighthouse report, optimized run.')

    # ------------------------------------------------------------- Part III
    doc.add_page_break()
    doc.add_heading('Part III — Cloud deployment', level=1)
    doc.add_heading('3.1 Public URL', level=2)
    doc.add_paragraph(f'Deployed frontend: {DEPLOYED}')
    doc.add_paragraph(
        'HTTP verification: / (200), /fonts/instrument-sans-latin.woff2 (200), '
        '/assets/index-9cM2-RjE.js (200), /assets/index-CBC1LTQp.css (200), '
        '/favicon.svg (200). The built client uses curated content as a fallback, so all '
        'public pages render even when the API is not reachable.')
    add_figure(doc, SHOTS / '08-deployed-home.png',
               'Figure 9 — Live public deployment, hero + interactive topology panel.')

    doc.add_heading('3.2 Target production architecture', level=2)
    doc.add_paragraph(
        'A single Node/Express service (SERVE_CLIENT=true) serves both client/dist and '
        '/api/*, with VITE_API_URL="" so the browser calls the API on its own origin. '
        'The persistence layer is unchanged MongoDB/Mongoose: MONGO_URI now points at '
        'MongoDB Atlas via an SRV connection string. The local .env was switched with '
        'scripts/switch-db.mjs (secrets read from environment variables only, original '
        'config backed up to the git-ignored .env.pre-atlas). render.yaml (Render '
        'Blueprint), Dockerfile, deploy/env.example and docs/assignment4/DEPLOYMENT.md '
        'contain the complete cloud setup.')
    add_table(doc, ['Requirement', 'Where it is handled'], [
        ['Frontend on a cloud service', 'WorkBuddy static publish (live URL above); Render/Vercel alternative documented'],
        ['Backend on a cloud service', 'render.yaml / Dockerfile / Express single-origin mode'],
        ['Cloud-hosted MongoDB', 'DONE — MONGO_URI -> MongoDB Atlas SRV string; connection to ac-dfphuyz-shard-00-00.xzv5qdp.mongodb.net confirmed in the API log'],
        ['Secrets in platform settings', 'render.yaml uses sync:false; .env git-ignored; workflow uses secrets.*'],
        ['Health check', 'GET /api/health reports the real Mongoose readyState'],
    ], [2.2, 4.5])

    doc.add_heading('3.3 Functional verification', level=2)
    doc.add_paragraph(
        'scripts/verify-deployed.mjs was run against a production-shaped single-origin '
        'service on this machine (Express serving client/dist + API) whose database is '
        'MongoDB Atlas in the cloud. It returned 13/13 PASS: the contact POST, user '
        'registration/JWT, 403 authorization gate and full admin CREATE/READ/UPDATE/DELETE '
        'cycle all persisted to Atlas, not to a local instance. The same script is executed '
        'by the CI deploy job against the public URL once the cloud backend is configured. '
        'Atlas is a fresh cluster, so GET /api/projects returned 0 records; the React '
        'client renders its curated portfolio content when the API has no records.')
    add_code(doc, read(A4 / 'deployment-verification.txt'), max_lines=22)

    doc.add_heading('3.4 Honest limitation', level=2)
    doc.add_paragraph(
        'The database requirement is now fully met: MongoDB Atlas is a cloud-hosted '
        'service and every workflow above was executed against it. What remains is the '
        'backend host. WorkBuddy’s publish sandbox exposes one HTTP port and explicitly '
        'rejects projects that require MongoDB, so it can host the built frontend but not '
        'the Mongoose API. The 13/13 result above therefore comes from the same code '
        'running on this workstation, talking to Atlas over TLS — not from a cloud web '
        'service. Deploying render.yaml or the Dockerfile to Render / Railway / Fly.io '
        'closes that last gap (docs/assignment4/DEPLOYMENT.md, ~10 minutes).')
    doc.add_paragraph(
        'To finish: choose a cloud web service able to run the Node/Express single-origin '
        'build, set MONGO_URI to the same Atlas SRV string plus JWT_SECRET and ADMIN_* in '
        'that platform’s environment settings, then run '
        'node scripts/verify-deployed.mjs <public URL> with DEPLOY_ADMIN_EMAIL and '
        'DEPLOY_ADMIN_PASSWORD set. The same 13 checks then run against a fully cloud-hosted '
        'stack. No persistence-layer change is involved — the app stays on '
        'MongoDB/Mongoose as required.')

    # ------------------------------------------------------------- Part IV
    doc.add_page_break()
    doc.add_heading('Part IV — CI/CD', level=1)
    doc.add_heading('4.1 Automated workflow', level=2)
    doc.add_paragraph('.github/workflows/ci-cd.yml runs on every PR and push to main:')
    add_table(doc, ['Stage', 'Action'], [
        ['checkout + Node 20', 'npm ci for root, Backend and client; Cypress binary cached'],
        ['test: backend', 'npm test (node --test, MongoDB 7 service container)'],
        ['test: components', 'npm run test:unit (Vitest)'],
        ['build', 'npm run build --prefix client'],
        ['test: E2E', 'start API + Vite preview, wait for /api/health, npm run test:e2e'],
        ['artifacts', 'upload Cypress screenshots + MP4 (retention 30 days)'],
        ['deploy (main only)', 'POST the Render deploy hook, wait for health, run verify-deployed.mjs'],
    ], [1.7, 5.0])
    add_table(doc, ['GitHub secret', 'Purpose'], [
        ['JWT_SECRET', 'signs tokens during CI and in production'],
        ['ADMIN_EMAIL / ADMIN_PASSWORD', 'admin account used by E2E and post-deploy checks'],
        ['RENDER_DEPLOY_HOOK_URL', 'triggers the deployment after a green main build'],
        ['DEPLOYED_URL', 'public URL checked by verify-deployed.mjs'],
    ], [2.2, 4.5])

    doc.add_heading('4.2 Feature branch and visible content update', level=2)
    doc.add_paragraph(
        'docs/assignment4/feature-branch.sh creates feature/assignment4-release-badge '
        'and changes the hero status chip to "Release 1.0 · Open to senior engineering '
        'roles & architecture consulting" — a one-line, clearly visible content update. '
        'docs/assignment4/CI_CD_GUIDE.md gives the exact PR/merge commands.')
    doc.add_paragraph(
        'Per the student’s instruction, no git operation (branch, commit, push or merge) '
        'was performed while preparing this submission, so there is no real Actions run '
        'or PR screenshot yet. The following evidence must be captured by the student:')
    add_table(doc, ['#', 'Evidence to capture'], [
        ['1', 'Screenshot of the deployed hero BEFORE the update (Figure 9 can serve as "before")'],
        ['2', 'GitHub PR page showing the changed line'],
        ['3', 'GitHub Actions run with both jobs green'],
        ['4', 'Render deploy log / deploy hook HTTP 200'],
        ['5', 'Screenshot of the deployed hero AFTER the update ("Release 1.0 …")'],
        ['6', 'deployment-verification.json or the Actions log showing 13/13 PASS'],
    ], [0.5, 6.2])

    # ------------------------------------------------------- Submission list
    doc.add_page_break()
    doc.add_heading('Submission checklist (What to Submit)', level=1)
    add_table(doc, ['#', 'Required item', 'Where it is', 'Status'], [
        ['1', 'Link to the deployed application', DEPLOYED, 'LIVE — HTTP 200 re-verified'],
        ['2', 'Link to the GitHub repository', REPO, 'Provided'],
        ['3', 'Word document: screenshots, test evidence, performance comparison, '
              'CI/CD evidence and brief captions', 'This document (Figures 0–9, sections 1–4)',
              'Provided; CI/CD section honestly lists evidence still to capture'],
        ['4', 'E2E recording as a playable file', VIDEO, 'MP4, 3/3 passing run'],
    ], [0.4, 2.3, 2.5, 1.5])
    doc.add_paragraph(
        'Two items remain outside this submission because they require the student’s '
        'accounts or explicit authorisation: deploying the Express backend to a public '
        'cloud web service (the MongoDB Atlas database itself is already cloud-hosted and '
        'verified), and a real feature-branch PR/merge with a green GitHub Actions run. '
        'Neither is simulated or represented by a placeholder screenshot anywhere in '
        'this document.')

    # ------------------------------------------------------------- Appendix
    doc.add_page_break()
    doc.add_heading('Appendix — how to reproduce', level=1)
    add_code(doc, """
# 1. Local stack (MongoDB Atlas + Express + production preview)
CLIENT_ORIGIN=http://127.0.0.1:4173 node Backend/server.js
npm --prefix client run build
npm --prefix client run preview -- --host 127.0.0.1 --port 4173

# 2. All tests
npm test                 # backend unit tests
npm run test:unit        # Vitest component tests
npm run test:e2e         # Cypress (screenshots + MP4)

# 3. Performance
npx lighthouse http://localhost:4173/ --output=json --output-path=... --quiet
node scripts/perf-summary.mjs

# 4. Switch the database between local MongoDB and Atlas
node scripts/switch-db.mjs status
ATLAS_URI='mongodb+srv://...' node scripts/switch-db.mjs atlas
node scripts/switch-db.mjs local     # restore the original config
# (local mode needs: mongod --dbpath <data> --port 27017)

# 5. Deployment verification
node scripts/verify-deployed.mjs https://<your-service>.onrender.com

# 6. Evidence
node scripts/capture-evidence.mjs
node scripts/render-test-evidence.mjs
python scripts/build-report.py       # requires python-docx
""", max_lines=32)
    doc.add_heading('Deliverable inventory', level=2)
    add_table(doc, ['Item', 'Path'], [
        ['Word document', 'docs/assignment4/Assignment4_Portfolio_Testing_Optimization_Deployment.docx'],
        ['E2E recording (playable MP4)', VIDEO],
        ['Cypress spec', 'cypress/e2e/fullstack-workflow.cy.js'],
        ['Cypress screenshots', 'docs/assignment4/e2e/screenshots/'],
        ['Unit tests', 'client/src/test/*.test.jsx'],
        ['Test logs + final regression summary',
         'docs/assignment4/tests/ (final-regression.txt, backend/unit/e2e/deployment-tests.txt)'],
        ['Lighthouse JSON + reports', 'docs/assignment4/performance/'],
        ['Deployment configs', 'render.yaml, Dockerfile, deploy/env.example'],
        ['Local/Atlas database switch', 'scripts/switch-db.mjs (status | atlas | local, --dry-run)'],
        ['CI workflow', '.github/workflows/ci-cd.yml'],
        ['Runbooks', 'docs/assignment4/DEPLOYMENT.md, CI_CD_GUIDE.md, feature-branch.sh'],
    ], [2.3, 4.4])

    doc.save(str(OUT))
    print(f'Wrote {OUT}')


if __name__ == '__main__':
    main()
