import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

/* Component/unit tests run in jsdom. The Tailwind Vite plugin is intentionally
   omitted: no stylesheet is imported by the components under test. */
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.js'],
    include: ['src/test/**/*.test.jsx'],
    css: false,
    restoreMocks: true,
    // WorkBuddy's brokered filesystem rejects concurrent writes to Vitest's
    // extensionless module cache; a single fork makes the cache writes serial.
    pool: 'forks',
    poolOptions: { forks: { singleFork: true } },
    fileParallelism: false,
  },
})
