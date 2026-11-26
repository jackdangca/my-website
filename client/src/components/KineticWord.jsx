import { useEffect, useState } from 'react'

/* Cross-fading word stack. All words share one grid cell, so the headline
   never reflows when the word changes. */

export default function KineticWord({ words, interval = 3000 }) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    const timer = window.setInterval(
      () => setIndex((value) => (value + 1) % words.length),
      interval,
    )
    return () => window.clearInterval(timer)
  }, [words.length, interval])

  return (
    <>
      <span className="word-rotator" aria-hidden="true">
        {words.map((word, position) => (
          <span
            key={word}
            className={`word-rotator__word${position === index ? ' is-active' : ''}`}
          >
            {word}
          </span>
        ))}
      </span>
      <span className="sr-only">{words[0]}</span>
    </>
  )
}
