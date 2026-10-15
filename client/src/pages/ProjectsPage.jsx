
import projects from '../data/projects.js'

export default function ProjectsPage() {
  return (
    <>
      <h1 className="mb-2 text-3xl font-bold text-ink md:text-4xl">Projects</h1>
      <p className="mb-10 max-w-2xl text-slate-muted">
        A selection of projects I have designed, built and learned from.
      </p>

     
      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {projects.map((project) => (
          <article
            key={project.id}
            className="flex flex-col overflow-hidden rounded-2xl border border-slate-line bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
         
            <div className="aspect-video overflow-hidden bg-ink">
              <img
                src={project.image}
                alt={project.alt}
                className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
              />
            </div>

            <div className="flex flex-1 flex-col gap-2.5 p-5">
              <h2 className="text-xl font-bold text-ink">{project.title}</h2>
              <p className="text-xs font-semibold uppercase tracking-wide text-brand">
                {project.role}
              </p>
              <p className="text-sm text-slate-muted">{project.description}</p>

              {/* Technology*/}
              <div className="flex flex-wrap gap-2">
                {project.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-semibold text-brand-dark"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="mt-auto rounded-r-lg border-l-4 border-brand bg-slate-soft px-3.5 py-2.5 text-sm">
                <strong>Outcome:</strong> {project.outcome}
              </div>
            </div>
          </article>
        ))}
      </section>
    </>
  )
}
