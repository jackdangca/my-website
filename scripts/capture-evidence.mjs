/* =============================================================================
   Assignment 4 — capture clean, top-of-page application screenshots for the
   submission document. Uses Chrome DevTools Protocol over a local WebSocket.
   No third-party packages; Node 22 provides a global WebSocket.
   ============================================================================= */
import { spawn } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const outDir = path.join(root, 'docs', 'assignment4', 'screenshots')
fs.mkdirSync(outDir, { recursive: true })

const base = process.env.CAPTURE_BASE_URL || 'http://127.0.0.1:4173'
const api = process.env.CAPTURE_API_URL || 'http://127.0.0.1:5000'
function localDotEnv() {
  try {
    const raw = fs.readFileSync(path.join(root, '.env'), 'utf8')
    const values = {}
    for (const line of raw.split(/\r?\n/)) {
      const match = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*?)\s*$/)
      if (match) values[match[1]] = match[2]
    }
    return values
  } catch { return {} }
}
const local = localDotEnv()
const adminEmail = process.env.ADMIN_EMAIL || local.ADMIN_EMAIL
const adminPassword = process.env.ADMIN_PASSWORD || local.ADMIN_PASSWORD
const port = 9224
const chromePath = process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const profile = path.join(os.tmpdir(), 'wb-a4-evidence-chrome')

const chrome = spawn(chromePath, [
  '--headless=new', '--disable-gpu', '--no-sandbox', '--hide-scrollbars',
  '--no-proxy-server', `--remote-debugging-port=${port}`,
  `--user-data-dir=${profile}`, '--window-size=1440,900', 'about:blank',
], { stdio: 'ignore' })

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function cdpReady() {
  for (let i = 0; i < 40; i += 1) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/json/version`)
      if (response.ok) return true
    } catch { /* not up yet */ }
    await wait(250)
  }
  throw new Error('Chrome DevTools endpoint did not come up')
}

let ws
let nextId = 0
const pending = new Map()

function send(method, params = {}) {
  return new Promise((resolve, reject) => {
    const id = ++nextId
    pending.set(id, { resolve, reject })
    ws.send(JSON.stringify({ id, method, params }))
  })
}

const evaluate = async (expression) => {
  const result = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true })
  if (result.exceptionDetails) {
    const detail = result.exceptionDetails
    throw new Error(detail.exception?.description || detail.text || 'evaluation failed')
  }
  return result.result?.value
}

async function shot(name) {
  const { data } = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false })
  const file = path.join(outDir, name)
  fs.writeFileSync(file, Buffer.from(data, 'base64'))
  console.log(`  saved ${name}`)
}

async function go(urlPath) {
  await send('Page.navigate', { url: `${base}${urlPath}` })
  await wait(1500)
}

async function waitFor(selector) {
  for (let i = 0; i < 40; i += 1) {
    const found = await evaluate(`Boolean(document.querySelector(${JSON.stringify(selector)}))`)
    if (found) return
    await wait(250)
  }
  const state = await evaluate(`({ url: location.href, ready: document.readyState, len: document.body.innerHTML.length })`)
  throw new Error(`Timed out waiting for ${selector} — ${JSON.stringify(state)}`)
}

async function setField(selector, value, tag = 'HTMLInputElement') {
  await waitFor(selector)
  await evaluate(`(() => {
    const el = document.querySelector(${JSON.stringify(selector)});
    if (!el) throw new Error('missing ' + ${JSON.stringify(selector)});
    const proto = ${JSON.stringify(tag)} === 'HTMLTextAreaElement' ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
    Object.getOwnPropertyDescriptor(proto, 'value').set.call(el, ${JSON.stringify(value)});
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
    return true;
  })()`)
}

async function main() {
  await cdpReady()
  const targets = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()
  const page = targets.find((target) => target.type === 'page')
  ws = new WebSocket(page.webSocketDebuggerUrl)
  await new Promise((resolve) => { ws.onopen = resolve })
  ws.onmessage = (event) => {
    const message = JSON.parse(event.data)
    if (message.id && pending.has(message.id)) {
      const { resolve, reject } = pending.get(message.id)
      pending.delete(message.id)
      if (message.error) reject(new Error(message.error.message))
      else resolve(message.result)
    }
  }
  await send('Page.enable')
  await send('Runtime.enable')
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1440, height: 900, deviceScaleFactor: 1, mobile: false,
  })

  console.log(`Capturing application screenshots from ${base}`)

  await go('/')
  await shot('01-home-hero.png')

  await go('/projects')
  await shot('02-projects.png')

  await go('/contact')
  await setField('#firstName', 'Ada')
  await setField('#lastName', 'Lovelace')
  await setField('#email', `evidence.${Date.now()}@example.com`)
  await setField('#message', 'Assignment 4 evidence screenshot.', 'HTMLTextAreaElement')
  await evaluate(`document.querySelector('form button[type="submit"]').click()`)
  await wait(1600)
  await shot('03-contact-success.png')

  await go('/')
  await evaluate(`document.querySelector('.cmd-trigger')?.click()`)
  await wait(500)
  await shot('04-command-palette.png')
  await evaluate(`document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))`)

  if (adminEmail && adminPassword) {
    await go('/sign-in')
    await setField('#email', adminEmail)
    await setField('#password', adminPassword)
    await evaluate(`document.querySelector('form button[type="submit"]').click()`)
    await wait(1800)
    await shot('05-admin-panel.png')

    const token = await evaluate(`(async () => {
      const r = await fetch(${JSON.stringify(`${api}/api/auth/register`)}, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Evidence User', email: 'evidence.user.' + Date.now() + '@example.com', password: 'evidence-pass-123' })
      });
      return (await r.json()).token;
    })()`)
    await evaluate(`sessionStorage.setItem('portfolio_access_token', ${JSON.stringify(token)})`)
    await go('/admin')
    await wait(1400)
    await shot('06-forbidden-403.png')
    await evaluate(`sessionStorage.clear()`)
  } else {
    console.log('  skipped authenticated states (set ADMIN_EMAIL / ADMIN_PASSWORD)')
  }

  await go('/')
  await evaluate(`document.querySelector('[aria-label^="Switch to"]')?.click()`)
  await wait(900)
  await shot('07-dark-theme.png')

  console.log('Done')
}

main()
  .catch((error) => { console.error(error); process.exitCode = 1 })
  .finally(() => {
    if (ws) ws.close()
    chrome.kill()
  })
