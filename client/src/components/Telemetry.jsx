import { useEffect, useMemo, useRef, useState } from 'react'

const EASE = (t) => 1 - Math.pow(1 - t, 3)

/* Animated numeric readout. Keeps any prefix/suffix intact ("8+", "99.95%")
   and only counts when the number actually scrolls into view. */
export function CountUp({ value, duration = 1150 }) {
  const ref = useRef(null)
  const [display, setDisplay] = useState(value)
  const parsed = useMemo(() => String(value).match(/^([^\d]*)([\d.,]+)(.*)$/), [value])

  useEffect(() => {
    const element = ref.current
    if (!element || !parsed) return undefined
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced || typeof IntersectionObserver === 'undefined') {
      setDisplay(value)
      return undefined
    }

    const [, prefix, rawNumber, suffix] = parsed
    const target = Number(rawNumber.replace(/,/g, ''))
    if (!Number.isFinite(target)) return undefined
    const decimals = (rawNumber.split('.')[1] || '').length

    let frame = 0
    let observer
    const animate = (startTime) => {
      const step = (now) => {
        const progress = Math.min(1, (now - startTime) / duration)
        const current = target * EASE(progress)
        setDisplay(`${prefix}${current.toFixed(decimals)}${suffix}`)
        if (progress < 1) frame = requestAnimationFrame(step)
      }
      frame = requestAnimationFrame(step)
    }

    observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          observer.disconnect()
          animate(performance.now())
        }
      },
      { threshold: 0.35 },
    )
    observer.observe(element)

    return () => {
      observer?.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [parsed, value, duration])

  return <strong ref={ref} className="metric__value num">{display}</strong>
}

/* Deterministic decorative sparkline — a hint of telemetry behind each metric. */
export function Sparkline({ seed = 0, className = '' }) {
  const { line, area } = useMemo(() => {
    const points = []
    let level = 0.55
    for (let index = 0; index < 15; index += 1) {
      const drift = Math.sin((index + 1) * (seed + 1) * 1.9) * 0.13
        + Math.cos(index * 2.1 + seed * 3) * 0.07
      level = Math.max(0.18, Math.min(0.88, level + drift))
      points.push([6 + index * 6.4, 34 - level * 28])
    }
    const path = points.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ')
    return { line: path, area: `M6,36 L${path.replace(/ /g, ' L')} L96,36 Z` }
  }, [seed])

  return (
    <svg className={`metric__spark ${className}`} viewBox="0 0 102 38" aria-hidden="true" focusable="false">
      <path d={area} className="metric__spark-area" />
      <polyline points={line} className="metric__spark-line" style={{ '--spark-seed': seed }} />
      <circle cx="96" cy={Number(line.split(' ').pop().split(',')[1])} r="2.4" className="metric__spark-dot" />
    </svg>
  )
}
