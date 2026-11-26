import { useEffect, useState } from 'react'
import { api } from '../api.js'
import { useAuth } from '../AuthContext.jsx'
import Icon from '../components/Icon.jsx'
import Reveal from '../components/Reveal.jsx'

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
      { name: 'completionDate', label: 'Completion date', type: 'date', required: true },
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
    <div className="shell page-body">
      <Reveal>
        <p className="eyebrow" style={{ marginBottom: 'var(--s6)' }}>Administration</p>
        <h1 className="h1">Content manager.</h1>
        <p className="lead" style={{ marginTop: 'var(--s5)' }}>
          Create, edit and remove portfolio records. Changes are written directly to MongoDB through
          the REST API.
        </p>
      </Reveal>

      <div className="admin-tabs" role="group" aria-label="Record type" style={{ marginTop: 'var(--s10)' }}>
        {resources.map((item) => (
          <button key={item.key} type="button" aria-pressed={activeKey === item.key}
            onClick={() => changeResource(item.key)}
            className={`admin-tab${activeKey === item.key ? ' is-active' : ''}`}>
            {item.label}
          </button>
        ))}
      </div>

      {error && <p className="notice notice--error" style={{ marginBottom: 'var(--s5)' }} role="alert">{error}</p>}
      {notice && <p className="notice notice--success" style={{ marginBottom: 'var(--s5)' }} role="status">{notice}</p>}

      <div className="admin-grid">
        <section className="admin-panel">
          <h2>{resource.label} <span className="chip" style={{ marginLeft: 'var(--s2)' }}>{records.length}</span></h2>
          {loading ? (
            <div style={{ display: 'grid', gap: 'var(--s3)' }}>
              <div className="skeleton" style={{ height: 76 }} />
              <div className="skeleton" style={{ height: 76 }} />
            </div>
          ) : records.length === 0 ? (
            <div className="empty-state">
              <h3>No records yet</h3>
              <p>Add the first one with the form. Curated case studies on the public site remain visible either way.</p>
            </div>
          ) : (
            <div>
              {records.map((record) => (
                <article className="admin-record" key={record._id}>
                  <h3>{record.title || `${record.firstName} ${record.lastName}`}</h3>
                  <p>{record.description || record.message || record.email || record.id}</p>
                  {resource.key === 'contacts' && record.email && (
                    <a className="text-link" style={{ marginTop: 'var(--s3)' }} href={`mailto:${record.email}`}>
                      {record.email}
                    </a>
                  )}
                  <div className="admin-record__actions">
                    <button className="btn btn--outline btn--sm" type="button" onClick={() => handleEdit(record)}>
                      <Icon name="edit" size={14} /> Edit
                    </button>
                    <button className="btn btn--danger btn--sm" type="button" onClick={() => handleDelete(record)}>
                      <Icon name="trash" size={14} /> Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="admin-panel">
          <h2>{editingId ? 'Edit record' : `Add ${resource.label.slice(0, -1).toLowerCase()}`}</h2>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 'var(--s4)' }}>
            {resource.fields.map((field) => (
              <div className="field" key={field.name}>
                <label htmlFor={`admin-${field.name}`}>
                  {field.label}{field.required && <span className="req">*</span>}
                </label>
                {field.type === 'textarea' ? (
                  <textarea className="textarea" id={`admin-${field.name}`} name={field.name}
                    value={values[field.name]} onChange={handleChange} rows="3"
                    maxLength={field.name === 'message' ? 2000 : 5000} required={field.required} />
                ) : (
                  <input className="input" id={`admin-${field.name}`} name={field.name}
                    type={field.type || 'text'} value={values[field.name]} onChange={handleChange}
                    required={field.required}
                    maxLength={['description', 'outcome'].includes(field.name) ? 5000 : undefined} />
                )}
              </div>
            ))}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--s2)', paddingTop: 'var(--s2)' }}>
              <button className="btn btn--primary btn--sm" type="submit" disabled={saving}>
                {saving ? 'Saving…' : editingId ? 'Save changes' : 'Create record'}
                {!saving && <Icon name="arrow-right" size={14} />}
              </button>
              {editingId && (
                <button className="btn btn--outline btn--sm" type="button" onClick={resetForm}>Cancel</button>
              )}
            </div>
          </form>
        </section>
      </div>
    </div>
  )
}
