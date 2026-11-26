import { Link, useParams } from 'react-router-dom'
import Icon from '../components/Icon.jsx'
import Reveal from '../components/Reveal.jsx'
import ProjectVisual from '../components/ProjectVisual.jsx'
import { useProjects } from '../hooks/usePortfolioData.js'

export default function ProjectDetailPage() {
  const { id } = useParams()
  const { projects } = useProjects()
  const project = projects.find((item) => String(item.id) === id)
  const index = projects.findIndex((item) => String(item.id) === id)
  const next = index >= 0 ? projects[(index + 1) % projects.length] : null
  const stack = Array.isArray(project?.techStack) ? project.techStack : []

  if (!project) {
    return (
      <div className="shell page-body">
        <div className="empty-state">
          <h3>Case study not found</h3>
          <p>That project is not in the current collection. It may have been renamed or removed.</p>
          <Link to="/projects" className="btn btn--outline">
            <Icon name="arrow-left" size={15} /> Back to all work
          </Link>
        </div>
      </div>
    )
  }

  const links = project.links?.length
    ? project.links
    : [{ label: 'Discuss this project', href: '/contact', kind: 'internal', icon: 'arrow-right' }]

  return (
    <>
      <section className="case-hero">
        <div className="grid-bg" aria-hidden="true" />
        <div className="shell">
          <Link to="/projects" className="back-link">
            <Icon name="arrow-left" size={15} /> All work
          </Link>
          <Reveal>
            <p className="eyebrow" style={{ marginBottom: 'var(--s6)' }}>
              Case {project.index || '—'} / {project.category}
            </p>
            <h1 className="h1">{project.title}</h1>
            <p className="lead" style={{ marginTop: 'var(--s6)' }}>
              {project.tagline || project.description}
            </p>
            <div className="case-hero__meta">
              <span>Role <strong>{project.role || project.category}</strong></span>
              <span>Year <strong>{project.year}</strong></span>
              <span>Discipline <strong>{project.category}</strong></span>
              <span>Stack <strong>{stack.length} technologies</strong></span>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div className="case-banner">
              <ProjectVisual
                variant={project.visual}
                hue={project.hue}
                index={project.index}
                label="System overview"
                image={project.image}
                alt={project.alt}
              />
            </div>
          </Reveal>
        </div>
      </section>

      <div className="shell">
        <div className="case-layout">
          <div className="case-body">
            <Reveal as="section" className="case-block">
              <h2>The problem</h2>
              <p>{project.challenge || project.description}</p>
              {project.description && project.challenge && project.description !== project.challenge && (
                <p>{project.description}</p>
              )}
            </Reveal>

            {project.approach?.length > 0 && (
              <Reveal as="section" className="case-block">
                <h2>What I built</h2>
                <p>
                  The work broke down into a handful of decisions that shaped the system. Each one
                  was driven by a failure mode we had either hit or could see coming.
                </p>
                <ol className="case-list">
                  {project.approach.map((step, stepIndex) => (
                    <li key={step.slice(0, 40)}>
                      <span>{String(stepIndex + 1).padStart(2, '0')}</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </Reveal>
            )}

            {project.outcomes?.length > 0 ? (
              <Reveal as="section" className="case-block">
                <h2>Measured outcomes</h2>
                <p>What changed once the system was live and under real traffic.</p>
                <div className="case-outcomes" style={{ marginTop: 'var(--s6)' }}>
                  {project.outcomes.map((outcome) => (
                    <div className="case-outcome" key={outcome.label}>
                      <strong>{outcome.value}</strong>
                      <span>{outcome.label}</span>
                    </div>
                  ))}
                </div>
              </Reveal>
            ) : project.outcome ? (
              <Reveal as="section" className="case-block">
                <h2>Outcome</h2>
                <p>{project.outcome}</p>
              </Reveal>
            ) : null}

            {project.architecture?.length > 0 && (
              <Reveal as="section" className="case-block">
                <h2>Architecture at a glance</h2>
                <ol className="case-list">
                  {project.architecture.map((layer, layerIndex) => (
                    <li key={layer.label}>
                      <span>{String(layerIndex + 1).padStart(2, '0')}</span>
                      <span><strong style={{ color: 'var(--text)', fontWeight: 600 }}>{layer.label}.</strong> {layer.detail}</span>
                    </li>
                  ))}
                </ol>
              </Reveal>
            )}

            <Reveal as="section" className="case-block">
              <h2>Interested in the details?</h2>
              <p>
                I can walk through the design decisions, the migration sequencing and the trade-offs
                that did not make it into this write-up.
              </p>
              <Link to="/contact" className="btn btn--primary" style={{ marginTop: 'var(--s6)' }}>
                Request a walkthrough <Icon name="arrow-right" size={16} />
              </Link>
            </Reveal>
          </div>

          <aside className="case-sidebar">
            <div className="case-sidebar__group">
              <h3>Technology</h3>
              <div className="case-sidebar__stack">
                {stack.map((tech) => <span className="chip" key={tech}>{tech}</span>)}
              </div>
            </div>

            <div className="case-sidebar__group">
              <h3>At a glance</h3>
              <dl className="profile-card__meta" style={{ padding: 0 }}>
                <div className="profile-card__row"><dt>Year</dt><dd>{project.year}</dd></div>
                <div className="profile-card__row"><dt>Role</dt><dd>{project.role || 'Engineer'}</dd></div>
                <div className="profile-card__row"><dt>Type</dt><dd>{project.category}</dd></div>
                {project.completionDate && (
                  <div className="profile-card__row">
                    <dt>Shipped</dt>
                    <dd>{new Date(project.completionDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' })}</dd>
                  </div>
                )}
              </dl>
            </div>

            <div className="case-sidebar__group">
              <h3>Links</h3>
              <div className="case-sidebar__links">
                {links.map((link) =>
                  link.kind === 'muted' ? (
                    <p className="form-note" key={link.label} style={{ display: 'flex', gap: 'var(--s2)', alignItems: 'center' }}>
                      <Icon name={link.icon || 'lock'} size={14} /> {link.label}
                    </p>
                  ) : (
                    <Link className="btn btn--outline btn--sm" to={link.href} key={link.label}>
                      {link.label} <Icon name={link.icon || 'arrow-right'} size={14} />
                    </Link>
                  ),
                )}
              </div>
            </div>
          </aside>
        </div>

        {next && next.id !== project.id && (
          <div className="case-next">
            <div>
              <p className="case-next__label">Next case study</p>
              <Link to={`/projects/${next.id}`} className="case-next__title" style={{ display: 'block' }}>
                {next.title}
              </Link>
            </div>
            <Link to={`/projects/${next.id}`} className="btn btn--outline" aria-label={`Next case study: ${next.title}`}>
              <Icon name="arrow-right" size={17} />
            </Link>
          </div>
        )}
      </div>
    </>
  )
}
