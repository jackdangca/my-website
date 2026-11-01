
import { useEffect, useState } from 'react'
import { api } from '../api.js'

export default function EducationPage() {
  const [qualifications, setQualifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    api.get('/api/qualifications')
      .then(({ data }) => {
        if (active) setQualifications(data)
      })
      .catch((requestError) => {
        if (active) setError(requestError.message)
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  return (
    <>
      <h1 className="mb-2 text-3xl font-bold text-ink md:text-4xl">Education</h1>
      <p className="mb-10 max-w-2xl text-slate-muted">My academic and professional qualifications.</p>

      {loading && <p className="text-slate-muted" role="status">Loading qualifications…</p>}
      {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700" role="alert">{error}</p>}
      {!loading && !error && qualifications.length === 0 && (
        <p className="rounded-xl border border-slate-line bg-white p-6 text-slate-muted">No qualifications have been added yet.</p>
      )}
      {!loading && !error && qualifications.length > 0 && (
        <section className="flex flex-col gap-6">
          {qualifications.map((entry) => (
            <article key={entry._id} className="grid items-start gap-6 md:grid-cols-[180px_1fr]">
              <div className="pt-1.5">
                <span className="inline-block whitespace-nowrap rounded-full bg-brand px-4 py-1.5 text-sm font-semibold text-white">
                  {new Date(entry.completionDate).toLocaleDateString(undefined, { timeZone: 'UTC' })}
                </span>
              </div>
              <div className="rounded-2xl border border-slate-line bg-white p-6 shadow-sm">
                <h2 className="text-xl font-bold text-ink">{entry.title}</h2>
                <p className="mt-2 whitespace-pre-wrap text-sm text-slate-muted">{entry.description}</p>
              </div>
            </article>
          ))}
        </section>
      )}
    </>
  )
}
