import { spawn } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const cypressBin = path.join(root, 'node_modules', 'cypress', 'bin', 'cypress')

if (!fs.existsSync(cypressBin)) {
  console.error('Cypress is not installed. Run: npm install')
  process.exit(1)
}

/* WorkBuddy injects ELECTRON_RUN_AS_NODE=1 into the session. Cypress is an
   Electron app; with that flag it starts as plain Node and rejects its own
   --smoke-test switch ("bad option"). Remove it for the child process only.
   GitHub Actions never sets it. */
const env = { ...process.env }
delete env.ELECTRON_RUN_AS_NODE
delete env.NODE_OPTIONS
/* Cypress verifies baseUrl through its own Node HTTP client. The WorkBuddy
   session proxy otherwise intercepts that loopback check and reports the
   local server as unreachable. All E2E targets are loopback, so drop proxies
   for this child process (fonts are self-hosted, no external fetches). */
for (const key of ['HTTP_PROXY', 'HTTPS_PROXY', 'ALL_PROXY', 'http_proxy', 'https_proxy', 'all_proxy']) {
  delete env[key]
}
env.NO_PROXY = 'localhost,127.0.0.1'
env.no_proxy = 'localhost,127.0.0.1'

const args = [
  cypressBin,
  'run',
  '--browser', 'electron',
  ...process.argv.slice(2),
]

const child = spawn(process.execPath, args, { cwd: root, env, stdio: 'inherit' })
child.on('exit', (code) => process.exit(code ?? 1))
