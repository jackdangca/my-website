import { useCallback, useSyncExternalStore } from 'react'

/* A tiny shared theme store.

   Multiple components (header toggle, command palette) need to read and change
   the same theme, so the state lives outside React. `useSyncExternalStore`
   keeps every consumer in sync without a provider.

   When the browser supports the View Transitions API, switching themes plays a
   circular reveal from the element that triggered the change. Browsers without
   support — and people who prefer reduced motion — get an instant switch.

   "light" is the Prism theme (bright, spectral); "dark" is Nebula (deep
   indigo-violet with luminous spectrum glows). Both are fully chromatic. */

const STORAGE_KEY = 'portfolio_theme_v2'
const listeners = new Set()

let current = typeof document === 'undefined'
  ? 'light'
  : (document.documentElement.getAttribute('data-theme') || 'light')

function subscribe(listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function getSnapshot() {
  return current
}

function getServerSnapshot() {
  return 'light'
}

function commit(next) {
  document.documentElement.setAttribute('data-theme', next)
  try {
    const meta = document.querySelector('meta[name="theme-color"]')
    if (meta) meta.setAttribute('content', next === 'dark' ? '#1b1236' : '#f7f4ff')
  } catch {
    /* Meta is decorative; ignore failures. */
  }
  current = next
  try {
    localStorage.setItem(STORAGE_KEY, next)
  } catch {
    /* Storage may be blocked; the in-memory theme still applies. */
  }
  listeners.forEach((listener) => listener())
}

function setTheme(next, origin) {
  if (next === current) return

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (typeof document.startViewTransition !== 'function' || reduced) {
    commit(next)
    return
  }

  const x = origin?.x ?? window.innerWidth / 2
  const y = origin?.y ?? window.innerHeight / 2
  const radius = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y),
  )

  const root = document.documentElement
  root.style.setProperty('--morph-x', `${x}px`)
  root.style.setProperty('--morph-y', `${y}px`)
  root.style.setProperty('--morph-r', `${radius}px`)

  try {
    const transition = document.startViewTransition(() => { commit(next) })
    // A navigation or a second toggle can abort the transition; Chrome rejects
    // `ready` / `finished` in that case. Swallow it so no unhandled rejection
    // reaches the console (the theme has already been committed).
    transition?.ready?.catch(() => {})
    transition?.finished?.catch(() => {})
  } catch {
    commit(next)
  }
}

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  const toggleTheme = useCallback(
    (origin) => setTheme(current === 'light' ? 'dark' : 'light', origin),
    [],
  )

  return { theme, toggleTheme, setTheme }
}
