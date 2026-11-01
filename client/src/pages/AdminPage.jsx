import { useEffect, useState } from 'react'
import { api } from '../api.js'
import { useAuth } from '../AuthContext.jsx'

const resources = [
  {
    key: 'contacts',
    label: 'Contacts',
    endpoint: '/api/contacts',
    fields: [
      { name: 'firstName', label: 'First name', required: true },
      { name: 'lastName', label: 'Last name', required: true },
      { name: 'email', label: 'Email', type: 'email', required: true },
      { name: 'phone', label: 'Phone' },
      { name: 'subject', label: 'Subject' },
      { name: 'message', label: 'Message', type: 'textarea', required: true },
    ],
  },
  {
    key: 'qualifications',
    label: 'Qualifications',
    endpoint: '/api/qualifications',
    fields: [
      { name: 'title', label: 'Title', required: true },
      { name: 'completionDate', label: 'Completion date', type: 'date', required: true },
      { name: 'description', label: 'Description', type: 'textarea', required: true },
    ],
  },
  {
    key: 'projects',
    label: 'Projects',
    endpoint: '/api/projects',
    fields: [
      { name: 'id', label: 'Project slug', required: true },
      { name: 'title', label: 'Title', required: true },
      { name: 'image', label: 'Image path or URL', required: true },
      { name: 'alt', label: 'Image alt text', required: true },
      { name: 'role', label: 'Role', required: true },
      { name: 'description', label: 'Description', type: 'textarea', required: true },
      { name: 'techStack', label: 'Technology stack (comma-separated)', required: true },
      { name: 'outcome', label: 'Outcome', type: 'textarea', required: true },
    ],
  },
]

const emptyValues = (resource) =>
  Object.fromEntries(resource.fields.map(({ name }) => [name, '']))

const editValues = (resource, record) =>
  Object.fromEntries(
    resource.fields.map(({ name }) => {
      const value = record[name]
      if (name === 'completionDate' && value) return [name, new Date(value).toISOString().slice(0, 10)]
      if (name === 'techStack' && Array.isArray(value)) return [name, value.join(', ')]
      return [name, value ?? '']
    }),
  )

export default function AdminPage() {
  const { token } = useAuth()
  const [activeKey, setActiveKey] = useState('projects')
  const [records, setRecords] = useState([])
  const [values, setValues] = useState(() => emptyValues(resources[2]))
  const [editingId, setEditingId] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const resource = resources.find(({ key }) => key === activeKey)

  const loadRecords = async () => {
    setLoading(true)
    setError('')
    try {
      const result = await api.get(resource.endpoint, token)
      setRecords(result.data)
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')
    api.get(resource.endpoint, token)
      .then((result) => {
        if (active) setRecords(result.data)
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
  }, [activeKey, resource.endpoint, token])

  const resetForm = () => {
    setEditingId('')
    setValues(emptyValues(resource))
  }

  const changeResource = (key) => {
    const nextResource = resources.find((item) => item.key === key)
    setActiveKey(key)
    setEditingId('')
    setValues(emptyValues(nextResource))
    setNotice('')
    setError('')
  }

  const handleChange = (event) => {
    setValues((current) => ({ ...current, [event.target.name]: event.target.value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSaving(true)
    setError('')
    setNotice('')
    const payload = { ...values }
    if (resource.key === 'projects') {
      payload.techStack = values.techStack.split(',').map((technology) => technology.trim()).filter(Boolean)
    }

    try {
      if (editingId) {
        await api.put(`${resource.endpoint}/${editingId}`, payload, token)
        setNotice(`${resource.label.slice(0, -1)} updated.`)
      } else {
        await api.post(resource.endpoint, payload, token)
        setNotice(`${resource.label.slice(0, -1)} created.`)
      }
      resetForm()
      await loadRecords()
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (record) => {
    setEditingId(record._id)
    setValues(editValues(resource, record))
    setNotice('')
    setError('')
  }

  const handleDelete = async (record) => {
    const label = record.title || `${record.firstName} ${record.lastName}`
    if (!window.confirm(`Delete "${label}"? This cannot be undone.`)) return

    setError('')
    setNotice('')
    try {
      await api.delete(`${resource.endpoint}/${record._id}`, token)
      setRecords((current) => current.filter((item) => item._id !== record._id))
      if (editingId === record._id) resetForm()
      setNotice('Record deleted.')
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  return (
    <>
      <h1 className="mb-2 text-3xl font-bold text-ink md:text-4xl">Administration</h1>
      <p className="mb-7 text-slate-muted">Manage portfolio records. Changes are saved to MongoDB.</p>

      <div className="mb-6 flex flex-wrap gap-2" aria-label="Record type">
        {resources.map((item) => (
          <button key={item.key} type="button" aria-pressed={activeKey === item.key}
            onClick={() => changeResource(item.key)}
            className={`rounded-full px-4 py-2 text-sm font-semibold ${activeKey === item.key ? 'bg-brand text-white' : 'border border-slate-line bg-white text-slate-body'}`}>
            {item.label}
          </button>
        ))}
      </div>

      {error && <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700" role="alert">{error}</p>}
      {notice && <p className="mb-4 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800" role="status">{notice}</p>}

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(300px,0.7fr)]">
        <section className="rounded-2xl border border-slate-line bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-xl font-bold text-ink">{resource.label}</h2>
          {loading ? (
            <p className="py-6 text-slate-muted">Loading records…</p>
          ) : records.length === 0 ? (
            <p className="py-6 text-slate-muted">No records found. Add one with the form.</p>
          ) : (
            <div className="space-y-3">
              {records.map((record) => (
                <article key={record._id} className="rounded-xl border border-slate-line p-4">
                  <h3 className="font-semibold text-ink">
                    {record.title || `${record.firstName} ${record.lastName}`}
                  </h3>
                  <p className="mt-1 whitespace-pre-wrap break-words text-sm text-slate-muted">
                    {record.description || record.message || record.email || record.id}
                  </p>
                  {resource.key === 'contacts' && record.email && (
                    <a className="mt-1 inline-block text-sm text-brand-dark underline" href={`mailto:${record.email}`}>
                      {record.email}
                    </a>
                  )}
                  <div className="mt-3 flex gap-2">
                    <button className="rounded-full border border-brand px-3 py-1 text-sm font-semibold text-brand-dark hover:bg-teal-50"
                      type="button" onClick={() => handleEdit(record)}>Edit</button>
                    <button className="rounded-full border border-red-200 px-3 py-1 text-sm font-semibold text-red-700 hover:bg-red-50"
                      type="button" onClick={() => handleDelete(record)}>Delete</button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-slate-line bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-xl font-bold text-ink">{editingId ? 'Edit record' : `Add ${resource.label.slice(0, -1).toLowerCase()}`}</h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            {resource.fields.map((field) => (
              <label key={field.name} className="block space-y-1.5 text-sm font-semibold text-ink">
                {field.label}
                {field.type === 'textarea' ? (
                  <textarea className="w-full rounded-lg border border-slate-line bg-slate-soft px-3.5 py-2.5 text-sm font-normal focus:border-brand focus:outline-none focus:ring-3 focus:ring-brand/20"
                    name={field.name} value={values[field.name]} onChange={handleChange}
                    maxLength={field.name === 'message' ? 2000 : 5000} rows="4" required={field.required} />
                ) : (
                  <input className="w-full rounded-lg border border-slate-line bg-slate-soft px-3.5 py-2.5 text-sm font-normal focus:border-brand focus:outline-none focus:ring-3 focus:ring-brand/20"
                    name={field.name} type={field.type || 'text'} value={values[field.name]}
                    onChange={handleChange} required={field.required}
                    maxLength={['description', 'outcome'].includes(field.name) ? 5000 : undefined} />
                )}
              </label>
            ))}
            <div className="flex flex-wrap gap-2">
              <button className="rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-60"
                type="submit" disabled={saving}>{saving ? 'Saving…' : editingId ? 'Save changes' : 'Create record'}</button>
              {editingId && <button className="rounded-full border border-slate-line px-5 py-2.5 text-sm font-semibold"
                type="button" onClick={resetForm}>Cancel</button>}
            </div>
          </form>
        </section>
      </div>
    </>
  )
}
