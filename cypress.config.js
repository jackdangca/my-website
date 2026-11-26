const { defineConfig } = require('cypress')
const fs = require('node:fs')
const path = require('node:path')

/* Secrets are never stored in this repository. Locally they come from the
   git-ignored .env file; in CI they come from CYPRESS_adminEmail /
   CYPRESS_adminPassword GitHub Actions secrets (Cypress maps CYPRESS_* into
   Cypress.env automatically and they take precedence over the values below). */
function readDotEnv() {
  try {
    const raw = fs.readFileSync(path.resolve(__dirname, '.env'), 'utf8')
    const values = {}
    for (const line of raw.split(/\r?\n/)) {
      const match = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*?)\s*$/)
      if (match) values[match[1]] = match[2]
    }
    return values
  } catch {
    return {}
  }
}

const local = readDotEnv()

module.exports = defineConfig({
  e2e: {
    baseUrl: process.env.CYPRESS_baseUrl || 'http://127.0.0.1:4173',
    specPattern: 'cypress/e2e/**/*.cy.js',
    supportFile: 'cypress/support/e2e.js',
    screenshotsFolder: 'docs/assignment4/e2e/screenshots',
    videosFolder: 'docs/assignment4/e2e/videos',
    video: true,
    videoCompression: false,
    screenshotOnRunFailure: true,
    viewportWidth: 1440,
    viewportHeight: 1000,
    defaultCommandTimeout: 12000,
    requestTimeout: 12000,
    env: {
      apiUrl: process.env.CYPRESS_apiUrl || process.env.API_URL || 'http://127.0.0.1:5000',
      adminEmail: process.env.CYPRESS_adminEmail || process.env.ADMIN_EMAIL || local.ADMIN_EMAIL || '',
      adminPassword: process.env.CYPRESS_adminPassword || process.env.ADMIN_PASSWORD || local.ADMIN_PASSWORD || '',
    },
  },
})
