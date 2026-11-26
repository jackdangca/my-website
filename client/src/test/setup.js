import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

/* jsdom does not implement the observer / media APIs used by the scroll-reveal
   wrapper and the theme morph. Stub them so component behaviour can be tested
   without a real layout engine. */
class ImmediateIntersectionObserver {
  constructor(callback) {
    this.callback = callback
  }
  observe(element) {
    this.callback([{ isIntersecting: true, target: element }], this)
  }
  unobserve() {}
  disconnect() {}
}

globalThis.IntersectionObserver = ImmediateIntersectionObserver
globalThis.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
}

if (!window.matchMedia) {
  window.matchMedia = (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener() {},
    removeListener() {},
    addEventListener() {},
    removeEventListener() {},
    dispatchEvent: () => false,
  })
}

if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = () => {}
}

if (!document.startViewTransition) {
  document.startViewTransition = (callback) => {
    callback()
    return { ready: Promise.resolve(), finished: Promise.resolve(), updateCallbackDone: Promise.resolve() }
  }
}

afterEach(() => {
  cleanup()
  sessionStorage.clear()
  localStorage.clear()
})
