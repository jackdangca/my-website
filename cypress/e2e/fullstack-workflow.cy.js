/* =============================================================================
   Assignment 4 — end-to-end release workflow.

   Runs against the REAL stack: production-built React client (Vite preview),
   Express API and MongoDB. No cy.intercept() stubs and no fixtures.

   Covered requirements:
     - public portfolio rendering and navigation
     - contact form -> REST API -> MongoDB persistence
     - authentication and role-based authorization (403 / redirect)
     - admin CRUD lifecycle and its propagation to the public site
   ============================================================================= */

const api = () => Cypress.env('apiUrl')
const adminEmail = () => Cypress.env('adminEmail')
const adminPassword = () => Cypress.env('adminPassword')

const runTag = `${Date.now()}`
const contactEmail = `e2e.${runTag}@example.com`
const projectSlug = `e2e-release-${runTag}`
const projectTitle = 'E2E Release Verification'
const editedTitle = 'E2E Release Verification (edited)'

const loginAsAdmin = () =>
  cy.request('POST', `${api()}/api/auth/login`, {
    email: adminEmail(),
    password: adminPassword(),
  }).its('body.token')

describe('Portfolio release workflow', () => {
  before(() => {
    expect(adminEmail(), 'CYPRESS_adminEmail / ADMIN_EMAIL').to.be.a('string').and.not.be.empty
    expect(adminPassword(), 'CYPRESS_adminPassword / ADMIN_PASSWORD')
      .to.be.a('string').and.not.be.empty
  })

  it('01 — public pages render and the contact form persists a message in MongoDB', () => {
    cy.visit('/')
    cy.get('h1').should('exist')
    cy.get('.project-card').should('have.length.at.least', 1)

    // Navigation into a lazily loaded route (route-level code splitting).
    cy.get('.nav-desktop').contains('Work').click()
    cy.location('pathname').should('eq', '/projects')
    cy.get('.project-card').should('have.length.at.least', 4)
    cy.screenshot('01-public-projects', { capture: 'viewport' })

    cy.visit('/contact')
    cy.get('#firstName').type('Ada')
    cy.get('#lastName').type('Lovelace')
    cy.get('#email').type(contactEmail)
    cy.get('#contactNumber').type('416-555-0100')
    cy.get('#message').type('Assignment 4 end-to-end verification message.')
    cy.screenshot('02-contact-form-filled', { capture: 'viewport' })
    cy.contains('button', 'Send message').click()
    cy.contains('Thanks,').should('be.visible')
    cy.screenshot('03-contact-success', { capture: 'viewport' })

    // Prove the browser's POST reached Express and was written to MongoDB.
    loginAsAdmin().then((token) => {
      cy.request({
        method: 'GET',
        url: `${api()}/api/contacts`,
        headers: { Authorization: `Bearer ${token}` },
      }).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body.success).to.eq(true)
        const saved = response.body.data.find((item) => item.email === contactEmail)
        expect(saved, 'contact saved in MongoDB').to.exist
        expect(saved.message).to.eq('Assignment 4 end-to-end verification message.')
      })
    })
  })

  it('02 — anonymous and regular users are denied the admin area', () => {
    cy.visit('/admin')
    cy.location('pathname').should('eq', '/sign-in')
    cy.screenshot('04-anonymous-redirect', { capture: 'viewport' })

    cy.request('POST', `${api()}/api/auth/register`, {
      name: 'E2E Regular User',
      email: `e2e.user.${runTag}@example.com`,
      password: 'e2e-password-123',
    }).then((response) => {
      expect(response.status).to.eq(201)
      expect(response.body.data.role).to.eq('user')

      cy.visit('/admin', {
        onBeforeLoad(win) {
          win.sessionStorage.setItem('portfolio_access_token', response.body.token)
        },
      })
      cy.location('pathname').should('eq', '/forbidden')
      cy.contains('403 — Restricted area').should('be.visible')
      cy.screenshot('05-regular-user-forbidden', { capture: 'viewport' })
    })
  })

  it('03 — admin signs in, performs full CRUD, and the public site reflects it', () => {
    cy.visit('/sign-in')
    cy.get('#email').type(adminEmail())
    cy.get('#password').type(adminPassword(), { log: false })
    cy.contains('button', 'Sign in').click()
    cy.location('pathname').should('eq', '/admin')
    cy.contains('Content manager.').should('be.visible')
    cy.screenshot('06-admin-signed-in', { capture: 'viewport' })

    // CREATE
    cy.get('#admin-id').type(projectSlug)
    cy.get('#admin-title').type(projectTitle)
    cy.get('#admin-completionDate').type('2026-11-14')
    cy.get('#admin-image').type('/images/e2e-verification.svg')
    cy.get('#admin-alt').type('E2E verification project diagram')
    cy.get('#admin-role').type('QA Automation')
    cy.get('#admin-description').type('Created by the Cypress end-to-end release workflow.')
    cy.get('#admin-techStack').type('Cypress, MongoDB, React')
    cy.get('#admin-outcome').type('CRUD verified against a live database.')
    cy.contains('button', 'Create record').click()
    cy.contains('Project created.').should('be.visible')
    cy.contains('.admin-record', projectTitle).should('exist')
    cy.screenshot('07-admin-create', { capture: 'viewport' })

    // READ from the public site: the API record is appended to curated work.
    cy.visit('/projects')
    cy.contains('.project-card', projectTitle).should('exist')
    cy.screenshot('08-public-project-after-create', { capture: 'viewport' })

    // UPDATE
    cy.visit('/admin')
    cy.contains('.admin-record', projectTitle).within(() => {
      cy.contains('button', 'Edit').click()
    })
    cy.get('#admin-title').clear().type(editedTitle)
    cy.contains('button', 'Save changes').click()
    cy.contains('Project updated.').should('be.visible')
    cy.contains('.admin-record', editedTitle).should('exist')
    cy.screenshot('09-admin-update', { capture: 'viewport' })

    // DELETE
    cy.on('window:confirm', () => true)
    cy.contains('.admin-record', editedTitle).within(() => {
      cy.contains('button', 'Delete').click()
    })
    cy.contains('Record deleted.').should('be.visible')
    cy.contains('.admin-record', editedTitle).should('not.exist')
    cy.screenshot('10-admin-delete', { capture: 'viewport' })

    // Confirm the row is gone from MongoDB, not just from local React state.
    loginAsAdmin().then((token) => {
      cy.request({
        method: 'GET',
        url: `${api()}/api/projects`,
        headers: { Authorization: `Bearer ${token}` },
      }).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body.data.some((item) => item.id === projectSlug)).to.eq(false)
      })
    })
  })
})
