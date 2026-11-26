import { Link } from 'react-router-dom'
import ProjectVisual from './ProjectVisual.jsx'
import Icon from './Icon.jsx'
import Reveal from './Reveal.jsx'

export default function ProjectCard({ project, wide = false, delay = 0 }) {
  const stack = Array.isArray(project.techStack) ? project.techStack : []
  const headline = project.outcomes?.[0]

  return (
    <Reveal
      as="article"
      className={`project-card ${wide || project.wide ? 'project-card--wide' : ''}`}
      delay={delay}
      style={{ '--pv-accent': project.hue || 'var(--accent)' }}
    >
      <ProjectVisual
        variant={project.visual}
        hue={project.hue}
        index={project.index}
        label={project.category}
        image={project.image}
        alt={project.alt}
      />
      <div className="project-card__body">
        <div className="project-card__meta">
          <span>{project.category}</span>
          <span className="dot" aria-hidden="true" />
          <span>{project.year}</span>
          {project.role && (
            <>
              <span className="dot" aria-hidden="true" />
              <span>{project.role}</span>
            </>
          )}
        </div>

        <h3 className="project-card__title">
          <Link to={`/projects/${project.id}`}>{project.title}</Link>
        </h3>
        <p className="project-card__desc">{project.description}</p>

        {stack.length > 0 && (
          <div className="project-card__stack">
            {stack.slice(0, 5).map((tech) => <span className="chip" key={tech}>{tech}</span>)}
            {stack.length > 5 && <span className="chip">+{stack.length - 5}</span>}
          </div>
        )}

        <div className="project-card__footer">
          {headline ? (
            <p className="project-card__outcome">
              <strong>{headline.value}</strong> {headline.label}
            </p>
          ) : project.outcome ? (
            <p className="project-card__outcome"><strong>Outcome</strong> {project.outcome}</p>
          ) : (
            <p className="project-card__outcome">View case study</p>
          )}
          <span className="project-card__arrow" aria-hidden="true">
            <Icon name="arrow-up-right" />
          </span>
        </div>
      </div>
    </Reveal>
  )
}
