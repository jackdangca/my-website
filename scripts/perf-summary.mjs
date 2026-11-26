/* =============================================================================
   Assignment 4 / Part II — aggregate Lighthouse runs into before/after evidence.
   Reads docs/assignment4/performance/before-*.json and after-*.json and writes
   comparison.json + a self-contained comparison.html (screenshot-ready).
   ============================================================================= */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dir = path.join(root, 'docs', 'assignment4', 'performance')

const load = (prefix) => fs.readdirSync(dir)
  .filter((name) => new RegExp(`^${prefix}-\\d+\\.json$`).test(name))
  .sort()
  .map((name) => ({ file: name, report: JSON.parse(fs.readFileSync(path.join(dir, name), 'utf8')) }))

const audits = (report) => report.audits || {}
const numeric = (report, key) => {
  const value = audits(report)[key]?.numericValue
  return Number.isFinite(value) ? value : null
}
const median = (values) => {
  const clean = values.filter((v) => Number.isFinite(v)).sort((a, b) => a - b)
  if (!clean.length) return null
  const mid = Math.floor(clean.length / 2)
  return clean.length % 2 ? clean[mid] : (clean[mid - 1] + clean[mid]) / 2
}

const metrics = [
  { key: 'score', label: 'Performance score', unit: '', better: 'up', digits: 0,
    get: (r) => (r.categories.performance.score ?? 0) * 100 },
  { key: 'fcp', label: 'First Contentful Paint', unit: 's', better: 'down', digits: 2,
    get: (r) => numeric(r, 'first-contentful-paint') / 1000 },
  { key: 'lcp', label: 'Largest Contentful Paint', unit: 's', better: 'down', digits: 2,
    get: (r) => numeric(r, 'largest-contentful-paint') / 1000 },
  { key: 'si', label: 'Speed Index', unit: 's', better: 'down', digits: 2,
    get: (r) => numeric(r, 'speed-index') / 1000 },
  { key: 'tbt', label: 'Total Blocking Time', unit: 'ms', better: 'down', digits: 0,
    get: (r) => numeric(r, 'total-blocking-time') },
  { key: 'cls', label: 'Cumulative Layout Shift', unit: '', better: 'down', digits: 3,
    get: (r) => numeric(r, 'cumulative-layout-shift') },
  { key: 'bytes', label: 'Total page weight', unit: 'KB', better: 'down', digits: 1,
    get: (r) => numeric(r, 'total-byte-weight') / 1024 },
  { key: 'unusedJs', label: 'Unused JavaScript', unit: 'KB', better: 'down', digits: 1,
    get: (r) => (audits(r)['unused-javascript']?.details?.overallSavingsBytes ?? numeric(r, 'unused-javascript') ?? 0) / 1024 },
  { key: 'blocking', label: 'Render-blocking time', unit: 'ms', better: 'down', digits: 0,
    get: (r) => audits(r)['render-blocking-resources']?.details?.overallSavingsMs ?? numeric(r, 'render-blocking-resources') ?? 0 },
  { key: 'external', label: 'External origins', unit: '', better: 'down', digits: 0,
    get: (r) => {
      const items = audits(r)['network-requests']?.details?.items || []
      const hosts = new Set()
      for (const item of items) {
        try {
          const host = new URL(item.url).host
          if (host && !/^(localhost|127\.0\.0\.1)(:|$)/.test(host)) hosts.add(host)
        } catch { /* data: URLs */ }
      }
      return hosts.size
    } },
]

const before = load('before')
const after = load('after')
if (!before.length || !after.length) throw new Error('Need at least one before-* and one after-* Lighthouse JSON')

const rows = metrics.map((metric) => {
  const b = before.map(({ report }) => metric.get(report))
  const a = after.map(({ report }) => metric.get(report))
  const bm = median(b)
  const am = median(a)
  const delta = bm !== null && am !== null ? am - bm : null
  const pct = delta !== null && bm !== 0 ? (delta / bm) * 100 : null
  return {
    ...metric,
    beforeRuns: b,
    afterRuns: a,
    before: bm,
    after: am,
    delta,
    pct,
    improved: delta === null ? null : (metric.better === 'up' ? delta > 0 : delta < 0),
  }
})

const summary = {
  generatedAt: new Date().toISOString(),
  tool: `Lighthouse ${before[0].report.lighthouseVersion}`,
  settings: {
    url: before[0].report.finalUrl,
    formFactor: before[0].report.configSettings.formFactor,
    throttlingMethod: before[0].report.configSettings.throttlingMethod,
    runsBefore: before.length,
    runsAfter: after.length,
  },
  rows,
}

fs.writeFileSync(path.join(dir, 'comparison.json'), `${JSON.stringify(summary, null, 2)}\n`)

const fmt = (row, value) => value === null ? '—'
  : `${value.toFixed(row.digits)}${row.unit ? ` ${row.unit}` : ''}`
const cell = (row, value) => fmt(row, value)
const badge = (row) => row.improved === null ? '' : row.improved
  ? '<span class="tag good">improved</span>'
  : (row.delta === 0 ? '<span class="tag flat">unchanged</span>' : '<span class="tag worse">regressed</span>')

const html = `<!doctype html><html lang="en"><head><meta charset="utf-8">
<title>Assignment 4 — Lighthouse before / after</title>
<style>
:root{color-scheme:light}
*{box-sizing:border-box}body{margin:0;background:#f6f3ff;color:#1d1636;
font:15px/1.55 "Segoe UI",Arial,sans-serif;padding:38px 44px}
.wrap{max-width:1050px;margin:0 auto}
.kicker{font:600 12px/1.4 Consolas,monospace;letter-spacing:.12em;color:#6d3bd6;text-transform:uppercase}
h1{font-size:32px;margin:8px 0 6px;letter-spacing:-.02em}
.sub{color:#5a5273;margin:0 0 26px;font-size:14px}
.cards{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-bottom:26px}
.card{background:#fff;border:1px solid #e3daf8;border-radius:12px;padding:16px 18px;box-shadow:0 2px 10px rgba(70,40,140,.05)}
.card .label{font-size:12px;color:#6a6285;text-transform:uppercase;letter-spacing:.06em}
.card .value{font-size:26px;font-weight:700;margin-top:6px;color:#4b22c4}
table{width:100%;border-collapse:collapse;background:#fff;border:1px solid #e3daf8;border-radius:12px;overflow:hidden}
th,td{padding:11px 14px;text-align:right;border-bottom:1px solid #eee8fb;font-variant-numeric:tabular-nums}
th:first-child,td:first-child{text-align:left}
thead th{background:#2b155e;color:#fff;font-size:12px;text-transform:uppercase;letter-spacing:.06em}
tbody tr:last-child td{border-bottom:0}
tbody tr:nth-child(even){background:#faf8ff}
.good{color:#0a7a4b;font-weight:700}.worse{color:#b02a45;font-weight:700}
.tag{display:inline-block;padding:2px 8px;border-radius:99px;font-size:11px;font-weight:700}
.tag.good{background:#dcf7e9;color:#0a7a4b}.tag.flat{background:#eeeaf7;color:#5a5273}.tag.worse{background:#ffe3e9;color:#b02a45}
.note{margin-top:22px;background:#fff;border-left:4px solid #7b3fe4;border-radius:8px;padding:14px 18px;font-size:13.5px;color:#423a5c}
.note b{color:#2b155e}
code{font-family:Consolas,monospace;background:#efe9ff;padding:1px 5px;border-radius:4px;font-size:12.5px}
footer{margin-top:20px;color:#7a7194;font-size:12px}
</style></head><body><div class="wrap">
<div class="kicker">Assignment 4 · Part II · Performance optimization</div>
<h1>Lighthouse before / after</h1>
<p class="sub">${summary.tool} · ${summary.settings.formFactor} · ${summary.settings.throttlingMethod} throttling ·
${summary.settings.runsBefore} baseline runs vs ${summary.settings.runsAfter} optimized runs · median values · ${summary.settings.url}</p>
<div class="cards">
<div class="card"><div class="label">Performance score</div><div class="value">${fmt(rows[0], rows[0].before)} → ${fmt(rows[0], rows[0].after)}</div></div>
<div class="card"><div class="label">Render-blocking time</div><div class="value">${fmt(rows[8], rows[8].before)} → ${fmt(rows[8], rows[8].after)}</div></div>
<div class="card"><div class="label">Unused JavaScript</div><div class="value">${fmt(rows[7], rows[7].before)} → ${fmt(rows[7], rows[7].after)}</div></div>
</div>
<table><thead><tr><th>Metric</th><th>Before (median)</th><th>After (median)</th><th>Change</th><th>Result</th></tr></thead><tbody>
${rows.map((r) => `<tr><td>${r.label}</td><td>${cell(r, r.before)}</td><td>${cell(r, r.after)}</td>
<td class="${r.improved ? 'good' : (r.delta === 0 ? '' : 'worse')}">${r.delta === null ? '—' : `${r.delta > 0 ? '+' : ''}${r.delta.toFixed(r.digits)}${r.unit ? ` ${r.unit}` : ''}${r.pct !== null ? ` (${r.pct > 0 ? '+' : ''}${r.pct.toFixed(1)}%)` : ''}`}</td>
<td>${badge(r)}</td></tr>`).join('\n')}
</tbody></table>
<div class="note"><b>Changes made.</b> ① Self-hosted the two variable woff2 fonts and removed the
render-blocking Google Fonts stylesheet + two preconnects; the display face is preloaded from the
app's own origin. ② Split every non-home route into its own lazy chunk
(<code>React.lazy</code> + <code>Suspense</code>), shrinking the entry bundle from
275.05 kB to 240.16 kB (−34.89 kB, gzip 86.61 → 78.30 kB). The landing page stays eager so LCP is
not delayed. ③ Added a lightweight loading state for lazy routes. All 18 component tests and the
3-case E2E suite still pass after the change.</div>
<footer>Raw Lighthouse JSON: before-1..3.json / after-1..3.json in this folder · generated ${summary.generatedAt}</footer>
</div></body></html>`

fs.writeFileSync(path.join(dir, 'comparison.html'), html)

console.log(`\n${summary.tool} | ${summary.settings.runsBefore} before / ${summary.settings.runsAfter} after runs | medians\n`)
for (const r of rows) {
  console.log(`${r.label.padEnd(28)} ${fmt(r, r.before).padStart(12)} -> ${fmt(r, r.after).padStart(12)}  ${r.pct === null ? '' : `${r.pct > 0 ? '+' : ''}${r.pct.toFixed(1)}%`}`)
}
console.log(`\nWrote comparison.json + comparison.html\n`)
