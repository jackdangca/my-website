import { Link } from 'react-router-dom'
import Reveal from '../components/Reveal.jsx'
import Icon from '../components/Icon.jsx'
import { useQualifications } from '../hooks/usePortfolioData.js'
import { profile } from '../data/portfolio.js'

export default function EducationPage() {
  const { timeline, status } = useQualifications()

  return (
    <>
      <section className="page-head">
        <div className="grid-bg" aria-hidden="true" />
        <div className="shell">
          <Reveal>
            <p className="eyebrow" style={{ marginBottom: 'var(--s6)' }}>Experience / 04</p>
            <h1 className="h1">A decade of<br />shipping and learning.</h1>
            <p className="lead">
              Roles, education and certifications — plus the through-line: each step added a new
              class of problem I could solve without guessing.
            </p>
            <div className="page-head__meta">
              <span>2018 — Present</span>
              <span>{timeline.length} entries</span>
              <span>Toronto, Canada</span>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="page-body">
        <div className="shell split split--reverse">
          <Reveal>
            <div className="timeline">
              {timeline.map((entry, index) => (
                <div className="timeline__item" key={`${entry.title}-${index}`}>
                  <span className="timeline__date">{entry.period}</span>
                  <h2 className="timeline__title">{entry.title}</h2>
                  <p className="timeline__org">{entry.org}</p>
                  <p className="timeline__desc">{entry.description}</p>
                  {entry.tags?.length > 0 && (
                    <div className="timeline__tags">
                      {entry.tags.map((tag) => <span className="chip" key={tag}>{tag}</span>)}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {status === 'offline' && (
              <p className="form-note" style={{ marginTop: 'var(--s8)' }}>
                Showing the curated timeline. Qualifications added through the admin panel will
                appear here when the API is running.
              </p>
            )}
          </Reveal>

          <Reveal delay={100}>
            <div className="note-panel">
              <h3>Continuous learning</h3>
              <p>
                Certifications expire; habits do not. I keep a small home-lab cluster, read incident
                write-ups from teams I admire, and turn anything surprising into an architecture note
                the team can reuse.
              </p>
              <div className="stack-cloud">
                {profile.stack.slice(0, 12).map((tech) => <span className="chip" key={tech}>{tech}</span>)}
              </div>
            </div>

            <div className="panel" style={{ marginTop: 'var(--s5)', padding: 'clamp(1.5rem, 2.6vw, 2rem)' }}>
              <h3 style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', letterSpacing: '0.13em', textTransform: 'uppercase', color: 'var(--text-faint)', marginBottom: 'var(--s4)' }}>
                Credentials on file
              </h3>
              <ul style={{ display: 'grid', gap: 'var(--s3)' }}>
                {['AZ-204 · Azure Developer Associate', 'CKA · Certified Kubernetes Administrator', 'Advanced Diploma · Software Engineering Technology'].map((item) => (
                  <li key={item} style={{ display: 'flex', gap: 'var(--s3)', fontSize: 'var(--text-sm)', color: 'var(--text-2)', lineHeight: 1.6 }}>
                    <Icon name="check" size={16} style={{ color: 'var(--accent)', flex: 'none', marginTop: 3 }} />
                    {item}
                  </li>
                ))}
              </ul>
              <Link to="/about" className="text-link" style={{ marginTop: 'var(--s6)' }}>
                More about me <Icon name="arrow-right" size={15} />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
