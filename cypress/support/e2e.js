/* Assignment 4 E2E support file.
   No global stubs or network interception: this suite exercises the real
   React client, the real Express API and the real MongoDB database. */

// Keep screenshots deterministic by pinning the bright Prism theme.
Cypress.on('window:before:load', (win) => {
  try {
    win.localStorage.setItem('portfolio_theme_v2', 'light')
  } catch {
    // Storage can be unavailable in privacy modes; the default theme is light anyway.
  }
})
