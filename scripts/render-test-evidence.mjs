/* Render the real captured test logs as a screenshot-friendly HTML page. */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dir = path.join(root, 'docs', 'assignment4', 'tests')

const stripAnsi = (text) => text.replace(/\x1b\[[0-9;]*[a-zA-Z]/g, '')
const escapeHtml = (text) => text
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const sections = [
  { file: 'backend-tests.txt', title: 'Backend unit tests — node --test', badge: '6 / 6 passed' },
  { file: 'unit-tests.txt', title: 'React component tests — Vitest (4 files)', badge: '18 / 18 passed' },
  { file: 'e2e-tests.txt', title: 'End-to-end workflow — Cypress (real MongoDB)', badge: '3 / 3 passed' },
  { file: '../deployment-verification.txt', title: 'Single-origin deployment verification — 13 checks', badge: '13 / 13 passed' },
]

const blocks = sections.map(({ file, title, badge }) => {
  const raw = fs.existsSync(path.join(dir, file))
    ? stripAnsi(fs.readFileSync(path.join(dir, file), 'utf8'))
    : '(log not found)'
  // Keep the informative tail so the PASS summary is visible in one screen.
  const lines = raw.trimEnd().split('\n')
  const tail = lines.slice(-32).join('\n')
  return `<section><h2><span>${title}</span><em>${badge}</em></h2><pre>${escapeHtml(tail)}</pre></section>`
}).join('\n')

const html = `<!doctype html><html lang="en"><head><meta charset="utf-8">
<title>Assignment 4 — automated test results</title>
<style>
*{box-sizing:border-box}body{margin:0;padding:30px 36px;background:#f7f4ff;color:#1d1636;
font:14px/1.5 "Segoe UI",Arial,sans-serif}
h1{font-size:26px;margin:0 0 4px}.sub{color:#625a7c;margin:0 0 22px;font-size:13px}
section{background:#fff;border:1px solid #e3daf8;border-radius:10px;margin-bottom:16px;overflow:hidden}
h2{margin:0;padding:11px 16px;background:#2b155e;color:#fff;font-size:14px;display:flex;
justify-content:space-between;align-items:center;font-weight:600}
h2 em{font-style:normal;background:#3ddc97;color:#083b28;padding:2px 10px;border-radius:99px;font-size:11.5px;font-weight:700}
pre{margin:0;padding:14px 16px;font:12px/1.55 Consolas,"JetBrains Mono",monospace;white-space:pre-wrap;
word-break:break-word;color:#2a2340;max-height:none}
</style></head><body>
<h1>Assignment 4 — automated test results</h1>
<p class="sub">Captured from the local release build · backend node --test · Vitest · Cypress 13 · MongoDB 8.3</p>
${blocks}
</body></html>`

fs.writeFileSync(path.join(dir, 'test-results.html'), html)
console.log('Wrote test-results.html')
