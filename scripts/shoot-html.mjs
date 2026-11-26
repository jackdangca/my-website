/* Screenshot local HTML reports through Chrome DevTools Protocol.
   Usage: node scripts/shoot-html.mjs <html-file> <png-file> [<html> <png> ...] */
import { spawn } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import { pathToFileURL } from 'node:url'

const pairs = []
for (let i = 2; i < process.argv.length; i += 2) {
  pairs.push([process.argv[i], process.argv[i + 1]])
}
if (!pairs.length) throw new Error('Provide html/png path pairs')

const port = 9225
const chromePath = process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const chrome = spawn(chromePath, [
  '--headless=new', '--disable-gpu', '--no-sandbox', '--hide-scrollbars',
  '--no-proxy-server', `--remote-debugging-port=${port}`,
  `--user-data-dir=${path.join(os.tmpdir(), 'wb-a4-html-chrome')}`,
  '--window-size=1280,900', 'about:blank',
], { stdio: 'ignore' })

const wait = (ms) => new Promise((r) => setTimeout(r, ms))
let ws
let id = 0
const pending = new Map()
const send = (method, params = {}) => new Promise((resolve, reject) => {
  const current = ++id
  pending.set(current, { resolve, reject })
  ws.send(JSON.stringify({ id: current, method, params }))
})

async function main() {
  let ready = false
  for (let i = 0; i < 40 && !ready; i += 1) {
    try { ready = (await fetch(`http://127.0.0.1:${port}/json/version`)).ok } catch { /* wait */ }
    if (!ready) await wait(250)
  }
  if (!ready) throw new Error('Chrome DevTools endpoint unavailable')

  const targets = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()
  const page = targets.find((t) => t.type === 'page')
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
  await send('Emulation.setDeviceMetricsOverride', {
    width: Number(process.env.SHOT_WIDTH || 1280),
    height: Number(process.env.SHOT_HEIGHT || 900),
    deviceScaleFactor: 1, mobile: false,
  })

  for (const [html, png] of pairs) {
    const isUrl = /^https?:\/\//i.test(html)
    const absoluteHtml = isUrl ? html : path.resolve(html)
    const absolutePng = path.resolve(png)
    fs.mkdirSync(path.dirname(absolutePng), { recursive: true })
    await send('Page.navigate', { url: isUrl ? html : pathToFileURL(absoluteHtml).href })
    await wait(isUrl ? 3500 : 1800)
    const { data } = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false })
    fs.writeFileSync(absolutePng, Buffer.from(data, 'base64'))
    console.log(`saved ${path.basename(absolutePng)}`)
  }
}

main()
  .catch((error) => { console.error(error); process.exitCode = 1 })
  .finally(() => {
    if (ws) ws.close()
    chrome.kill()
  })
