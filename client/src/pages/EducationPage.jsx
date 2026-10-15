
import education from '../data/education.js'

export default function EducationPage() {
  return (
    <>
      <h1 className="mb-2 text-3xl font-bold text-ink md:text-4xl">Education</h1>
      <p className="mb-10 max-w-2xl text-slate-muted">My academic and professional qualifications.</p>

      {/* Timeline of qualifications */}
      <section className="flex flex-col gap-6">
        {education.map((entry) => (
          <article key={entry.id} className="grid items-start gap-6 md:grid-cols-[180px_1fr]">
            {/* Left column: dates and year */}
            <div className="pt-1.5">
              <span className="inline-block whitespace-nowrap rounded-full bg-brand px-4 py-1.5 text-sm font-semibold text-white">
                {entry.period}
              </span>
            </div>

            {/* Right column: institution */}
            <div className="rounded-2xl border border-slate-line bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-ink">{entry.institution}</h2>
              <p className="text-sm text-slate-muted">{entry.location}</p>
              <p className="mt-1.5 font-semibold text-brand-dark">{entry.credential}</p>
              {entry.status && <p className="mt-1 text-sm text-slate-muted">{entry.status}</p>}

              <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm">
                {entry.details.map((detail, index) => (
                  <li key={index}>{detail}</li>
                ))}
              </ul>
            </div>
          </article>
        ))}

        {/* Professional certifications */}
        <article className="grid items-start gap-6 md:grid-cols-[180px_1fr]">
          <div className="pt-1.5">
            <span className="inline-block whitespace-nowrap rounded-full bg-brand px-4 py-1.5 text-sm font-semibold text-white">
              In Progress
            </span>
          </div>
          <div className="rounded-2xl border border-slate-line bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-ink">Professional Certifications</h2>
            <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm">
              <li>Microsoft Certified: Azure Developer Associate (AZ-204) — currently studying.</li>
            </ul>
          </div>
        </article>
      </section>
    </>
  )
}
