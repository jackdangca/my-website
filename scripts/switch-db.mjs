#!/usr/bin/env node
/* Switch the portfolio API between the local MongoDB instance and MongoDB Atlas.

   Secrets come from environment variables only. Nothing here is written to a
   tracked file: .env and .env.* are git-ignored. The original .env is copied to
   .env.pre-atlas on the first switch so the local setup can be restored.

   Usage (from the repository root):
     ATLAS_USER=... ATLAS_PASSWORD=... \
       node scripts/switch-db.mjs atlas <cluster-host|full-srv-uri>
     node scripts/switch-db.mjs local
     node scripts/switch-db.mjs status
     node scripts/switch-db.mjs atlas <host> --dry-run   # show masked URI, do not write

   DB_ENV_FILE can point at a copy of .env for testing without touching config.
*/
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const envPath = process.env.DB_ENV_FILE ? path.resolve(process.env.DB_ENV_FILE) : path.join(root, '.env')
const backupPath = path.join(path.dirname(envPath), '.env.pre-atlas')
const LOCAL_URI = 'mongodb://127.0.0.1:27017/Portfolio'

const args = process.argv.slice(2)
const dryRun = args.includes('--dry-run')
const [mode, cliTarget] = args.filter((a) => !a.startsWith('--'))
// Prefer the environment so the plaintext password never appears in argv.
const target = process.env.ATLAS_URI || cliTarget

const mask = (uri) => uri.replace(/(\/\/[^:/@]+:)[^@]+@/, '$1****@')

function normalizeAtlasUri(raw) {
  // Atlas "Connect" copies often end with a bare "/" or omit the database name.
  const match = raw.match(/^(mongodb\+srv:\/\/[^/]+\/)([^?]*)(?:\?(.*))?$/)
  if (!match) throw new Error('Malformed Atlas SRV URI')
  const [, base, db, query] = match
  return `${base}${db || 'Portfolio'}?${query || 'retryWrites=true&w=majority'}`
}

function buildAtlasUri(host) {
  if (!host) throw new Error('Provide ATLAS_URI, the cluster host, or a full mongodb+srv:// URI')
  if (host.startsWith('mongodb+srv://')) return normalizeAtlasUri(host)
  const user = process.env.ATLAS_USER
  const password = process.env.ATLAS_PASSWORD
  if (!user || !password) throw new Error('Set ATLAS_USER and ATLAS_PASSWORD in the environment')
  const clean = host.replace(/^mongodb\+srv:\/\//, '').replace(/\/.*$/, '').replace(/^@/, '')
  return `mongodb+srv://${encodeURIComponent(user)}:${encodeURIComponent(password)}@${clean}/Portfolio?retryWrites=true&w=majority`
}

function readEnv() {
  if (!fs.existsSync(envPath)) throw new Error(`Environment file not found: ${envPath}`)
  return fs.readFileSync(envPath, 'utf8')
}

function currentUri(text) {
  const match = text.match(/^\s*MONGO_URI\s*=\s*(.*?)\s*$/m)
  return match ? match[1] : ''
}

function withUri(text, uri) {
  const lines = text.split(/\r?\n/)
  let found = false
  const out = lines.map((line) => {
    if (/^\s*MONGO_URI\s*=/.test(line)) {
      found = true
      return `MONGO_URI=${uri}`
    }
    return line
  })
  if (!found) out.push(`MONGO_URI=${uri}`)
  return out.join('\n').replace(/\n*$/, '\n')
}

function main() {
  const text = readEnv()

  if (mode === 'status' || !mode) {
    const uri = currentUri(text)
    console.log(`MONGO_URI = ${mask(uri) || '(not set)'}`)
    console.log(`Target    = ${uri.startsWith('mongodb+srv://') ? 'MongoDB Atlas' : 'local MongoDB'}`)
    return
  }

  if (mode !== 'atlas' && mode !== 'local') {
    throw new Error(`Unknown mode "${mode}". Use atlas | local | status`)
  }

  const uri = mode === 'atlas' ? buildAtlasUri(target) : LOCAL_URI
  console.log(`${mode === 'atlas' ? 'Atlas' : 'Local'} URI: ${mask(uri)}`)
  if (dryRun) {
    console.log('Dry run — no file written.')
    return
  }
  if (mode === 'atlas' && !fs.existsSync(backupPath)) {
    fs.copyFileSync(envPath, backupPath)
    console.log(`Backup written: ${path.basename(backupPath)}`)
  }
  fs.writeFileSync(envPath, withUri(text, uri), 'utf8')
  console.log(`Updated ${path.basename(envPath)} (password never printed).`)
}

try {
  main()
} catch (error) {
  console.error(`switch-db: ${error.message}`)
  process.exitCode = 1
}
