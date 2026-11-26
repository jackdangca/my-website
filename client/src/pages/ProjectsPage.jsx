import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Reveal from '../components/Reveal.jsx'
import ProjectCard from '../components/ProjectCard.jsx'
import Icon from '../components/Icon.jsx'
import { useProjects } from '../hooks/usePortfolioData.js'

const FILTERS = [
  { key: 'all', label: 'All work' },
  { key: 'agent', label: 'AI & Agents' },
  { key: 'commerce', label: 'Full-Stack' },
  { key: 'mesh', label: 'Distributed Systems' },
  { key: 'signal', label: 'Reliability' },
]

export default function ProjectsPage() {
  const { projects, status } = useProjects()
  const [filter, setFilter] = useState('all')

  const visible = useMemo(
    () => (filter === 'all' ? projects : projects.filter((project) => project.visual === filter)),
    [projects, filter],
  )

  return (
    <>
      <section className="page-head">
        <div className="grid-bg" aria-hidden="true" />
        <div className="shell">
          <Reveal>
            <p className="eyebrow" style={{ marginBottom: 'var(--s6)' }}>Work / 02</p>
            <h1 className="h1">Selected work &amp;<br />architecture notes.</h1>
            <p className="lead">
              Four systems I designed and shipped. Each case study opens with the problem, then the
              architecture, and closes with the numbers that actually changed.
            </p>
            <div className="page-head__meta">
              <span>{projects.length} case studies</span>
              <span>2023 — 2025</span>
              <span>Platform · Commerce · Applied AI</span>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="page-body">
        <div className="shell">
          <Reveal>
            <div className="filter-tabs" role="group" aria-label="Filter projects by discipline">
              {FILTERS.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  className={`admin-tab${filter === item.key ? ' is-active' : ''}`}
                  aria-pressed={filter === item.key}
                  onClick={() => setFilter(item.key)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </Reveal>

          {visible.length > 0 ? (
            <div className="project-grid" key={filter}>
              {visible.map((project, index) => (
                <ProjectCard key={project.id} project={project} delay={index * 60} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <h3>No case studies in this category yet</h3>
              <p>Try another discipline, or view the full set of work.</p>
              <button type="button" className="btn btn--outline" onClick={() => setFilter('all')}>
                Show all work <Icon name="arrow-right" size={15} />
              </button>
            </div>
          )}

          <Reveal>
            <p className="form-note" style={{ marginTop: 'var(--s8)' }}>
              {status === 'offline'
                ? 'Showing the curated case studies. Records added through the admin panel will appear here once the API is running.'
                : 'Curated case studies are shown first; any additional projects added through the admin panel appear automatically.'}
            </p>
          </Reveal>

          <Reveal>
            <div className="note-panel" style={{ marginTop: 'var(--s12)' }}>
              <h3>Want the full architecture walkthrough?</h3>
              <p>
                These write-ups cover the decisions and the trade-offs. If you want the deeper version —
                diagrams, migration sequencing, incident history — I am happy to walk through it.
              </p>
              <Link to="/contact" className="btn btn--primary btn--sm" style={{ marginTop: 'var(--s5)' }}>
                Request a walkthrough <Icon name="arrow-right" size={15} />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
