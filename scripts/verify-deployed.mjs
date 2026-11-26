/* =============================================================================
   Post-deployment verification against a PUBLIC URL.

   Usage:
     BASE_URL=https://your-app.onrender.com \
     DEPLOY_ADMIN_EMAIL=... DEPLOY_ADMIN_PASSWORD=... \
       node scripts/verify-deployed.mjs

   Secrets come only from environment variables (GitHub Actions secrets or the
   deployment platform); they are never printed or written to the report.
   Checks: frontend, health/DB, public API, form, auth, authorization, CRUD.
   ============================================================================= */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const base = (process.argv[2] || process.env.BASE_URL || '').replace(/\/$/, '')
const adminEmail = process.env.DEPLOY_ADMIN_EMAIL || process.env.ADMIN_EMAIL
const adminPassword = process.env.DEPLOY_ADMIN_PASSWORD || process.env.ADMIN_PASSWORD

if (!base) {
  console.error('Provide the deployed URL: node scripts/verify-deployed.mjs https://your-app.example.com')
  process.exit(2)
}

const results = []
let failed = 0
const stamp = `${Date.now()}`

async function call(method, urlPath, { token, body } = {}) {
  const headers = { Accept: 'application/json' }
  if (body) headers['Content-Type'] = 'application/json'
  if (token) headers.Authorization = `Bearer ${token}`
  const response = await fetch(`${base}${urlPath}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    signal: AbortSignal.timeout(20000),
  })
  const text = await response.text()
  let json
  try { json = JSON.parse(text) } catch { json = null }
  return { status: response.status, json, text }
}

function check(name, condition, detail) {
  results.push({ name, pass: Boolean(condition), detail })
  console.log(`${condition ? 'PASS' : 'FAIL'}  ${name}${detail ? ` — ${detail}` : ''}`)
  if (!condition) failed += 1
}

async function main() {
  console.log(`\nVerifying ${base}\n${'='.repeat(64)}`)

  // 1. Frontend
  const home = await call('GET', '/')
  check('Frontend serves the React application',
    home.status === 200 && /<div id="root">/.test(home.text),
    `HTTP ${home.status}`)

  // 2. Health + real database connection state
  const health = await call('GET', '/api/health')
  check('API health check reports a connected database',
    health.status === 200 && health.json?.data?.connected === true,
    health.json?.data ? `${health.json.data.status} / ${health.json.data.database}` : `HTTP ${health.status}`)

  // 3. Public portfolio API
  const projects = await call('GET', '/api/projects')
  check('Public projects endpoint returns the API contract',
    projects.status === 200 && projects.json?.success === true && Array.isArray(projects.json.data),
    `HTTP ${projects.status}, ${projects.json?.data?.length ?? 0} records`)

  // 4. Contact form -> Express -> MongoDB
  const contactEmail = `deploy-check.${stamp}@example.com`
  const created = await call('POST', '/api/contacts', {
    body: {
      firstName: 'Deploy', lastName: 'Check', email: contactEmail,
      phone: '', message: 'Automated post-deployment contact form check.',
    },
  })
  check('Contact form POST persists a record',
    created.status === 201 && created.json?.success === true, `HTTP ${created.status}`)

  // 5. Authentication: register a regular user
  const registered = await call('POST', '/api/auth/register', {
    body: {
      name: 'Deploy Check', email: `deploy-user.${stamp}@example.com`,
      password: 'deploy-check-123',
    },
  })
  check('Registration creates a read-only user and a JWT',
    registered.status === 201 && registered.json?.data?.role === 'user' && Boolean(registered.json?.token),
    `HTTP ${registered.status}`)
  const userToken = registered.json?.token

  // 6. Authorization: regular user cannot create a project (admin only)
  const forbidden = await call('POST', '/api/projects', {
    token: userToken,
    body: {
      id: `deploy-denied-${stamp}`, title: 'Denied', completionDate: '2026-11-14',
      image: '/x.svg', alt: 'x', role: 'x', description: 'x', techStack: ['x'], outcome: 'x',
    },
  })
  check('Regular user is denied admin CRUD (403)',
    forbidden.status === 403, `HTTP ${forbidden.status}`)

  // 7. Admin authentication
  let adminToken
  if (adminEmail && adminPassword) {
    const login = await call('POST', '/api/auth/login', {
      body: { email: adminEmail, password: adminPassword },
    })
    check('Administrator can sign in on the deployed API',
      login.status === 200 && login.json?.data?.role === 'admin',
      `HTTP ${login.status}`)
    adminToken = login.json?.token
  } else {
    console.log('SKIP  Admin checks — set DEPLOY_ADMIN_EMAIL / DEPLOY_ADMIN_PASSWORD')
  }

  // 8. Full CRUD lifecycle as admin
  const slug = `deploy-check-${stamp}`
  if (adminToken) {
    const payload = {
      id: slug, title: 'Deployed CRUD Verification', completionDate: '2026-11-14',
      image: '/images/deploy-check.svg', alt: 'Deploy check diagram', role: 'Automation',
      description: 'Created by the post-deployment verification script.',
      techStack: ['Node.js', 'MongoDB'], outcome: 'CRUD verified in the cloud.',
    }
    const create = await call('POST', '/api/projects', { token: adminToken, body: payload })
    check('Admin CREATE project', create.status === 201 && create.json?.success === true, `HTTP ${create.status}`)
    const id = create.json?.data?._id

    const list = await call('GET', '/api/projects')
    check('Created project appears in the public READ endpoint',
      Array.isArray(list.json?.data) && list.json.data.some((p) => p.id === slug),
      `${list.json?.data?.length ?? 0} records`)

    const update = await call('PUT', `/api/projects/${id}`, {
      token: adminToken, body: { ...payload, title: 'Deployed CRUD Verification (updated)' },
    })
    check('Admin UPDATE project',
      update.status === 200 && update.json?.data?.title === 'Deployed CRUD Verification (updated)',
      `HTTP ${update.status}`)

    const remove = await call('DELETE', `/api/projects/${id}`, { token: adminToken })
    check('Admin DELETE project', remove.status === 200 && remove.json?.success === true, `HTTP ${remove.status}`)

    const afterDelete = await call('GET', '/api/projects')
    check('Deleted project is gone from MongoDB',
      Array.isArray(afterDelete.json?.data) && !afterDelete.json.data.some((p) => p.id === slug),
      'clean')

    const contacts = await call('GET', '/api/contacts', { token: adminToken })
    check('Admin can READ the submitted contact from MongoDB',
      Array.isArray(contacts.json?.data) && contacts.json.data.some((c) => c.email === contactEmail),
      `${contacts.json?.data?.length ?? 0} records`)
  }

  const outDir = path.join(root, 'docs', 'assignment4')
  fs.mkdirSync(outDir, { recursive: true })
  fs.writeFileSync(
    path.join(outDir, 'deployment-verification.json'),
    `${JSON.stringify({ base, verifiedAt: new Date().toISOString(), passed: results.length - failed, failed, results }, null, 2)}\n`,
  )
  console.log(`${'='.repeat(64)}\n${results.length - failed}/${results.length} checks passed\n`)
  process.exitCode = failed ? 1 : 0
}

main().catch((error) => {
  console.error('Verification could not complete:', error.message)
  process.exit(2)
})
