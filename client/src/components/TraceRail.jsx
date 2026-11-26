import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

/* A distributed-trace metaphor for page progress: a fixed rail that fills as
   you scroll, with clickable span markers for each section. Labels come from
   `data-chapter` when a section declares one, otherwise from its heading. */

function readChapters() {
  const sections = Array.from(document.querySelectorAll('main section'))
  return sections.map((section, index) => {
    const heading = section.querySelector('h1, h2')
    const fallback = (heading?.textContent || `Section ${index + 1}`).trim()
    return {
      label: section.dataset.chapter || fallback.slice(0, 24),
      index,
    }
  })
}

export default function TraceRail() {
  const { pathname } = useLocation()
  const [progress, setProgress] = useState(0)
  const [chapters, setChapters] = useState([])
  const [active, setActive] = useState(0)

  useEffect(() => {
    let frame = 0

    const measure = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight
      const ratio = scrollable > 0
        ? Math.min(1, Math.max(0, window.scrollY / scrollable))
        : 0
      setProgress(ratio)

      const sections = Array.from(document.querySelectorAll('main section'))
      let current = 0
      sections.forEach((section, index) => {
        if (section.getBoundingClientRect().top <= window.innerHeight * 0.42) current = index
      })
      setActive(current)
    }

    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(measure)
    }

    const collect = () => {
      setChapters(readChapters())
      measure()
    }

    collect()
    // Reveal animations can change section heights shortly after mount.
    const settle = window.setTimeout(collect, 350)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)

    return () => {
      cancelAnimationFrame(frame)
      window.clearTimeout(settle)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [pathname])

  const jumpTo = (index) => {
    const section = document.querySelectorAll('main section')[index]
    section?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <>
      <div
        className="scroll-progress"
        style={{ '--progress': progress }}
        aria-hidden="true"
      />
      {chapters.length > 1 && (
        <aside className="trace-rail" aria-label="Section progress">
          <span className="trace-rail__cap">TRACE</span>
          <div className="trace-rail__body">
            <div className="trace-rail__track" aria-hidden="true">
              <span className="trace-rail__fill" style={{ height: `${progress * 100}%` }} />
            </div>
            <ul className="trace-rail__list">
              {chapters.map((chapter, index) => (
                <li key={`${chapter.index}-${chapter.label}`}>
                  <button
                    type="button"
                    className={`trace-rail__item${index === active ? ' is-active' : ''}`}
                    onClick={() => jumpTo(index)}
                    aria-current={index === active ? 'true' : undefined}
                    title={chapter.label}
                  >
                    <span className="trace-rail__dot" aria-hidden="true" />
                    <span className="trace-rail__label">{chapter.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <span className="trace-rail__pct num">{String(Math.round(progress * 100)).padStart(2, '0')}%</span>
        </aside>
      )}
    </>
  )
}
