import { useEffect, useState } from 'react'
import { api } from '../api.js'
import { projects as curatedProjects, experience, education } from '../data/portfolio.js'

/* The public site is designed to render a complete, polished presentation even
   when the Express API is not running. Curated case studies are always shown;
   records created via the admin panel are appended when the API is reachable. */

const HUES = ['var(--hue-mesh)', 'var(--hue-ai)', 'var(--hue-commerce)', 'var(--hue-signal)']
const VISUALS = ['mesh', 'agent', 'commerce', 'signal']

function yearFrom(value) {
  if (!value) return '—'
  const date = new Date(value)
  return Number.isNaN(date.valueOf()) ? '—' : String(date.getUTCFullYear())
}

function formatDate(value) {
  if (!value) return '—'
  const date = new Date(value)
  return Number.isNaN(date.valueOf())
    ? '—'
    : date.toLocaleDateString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' })
}

function normalizeProject(record, position) {
  const stack = Array.isArray(record.techStack) ? record.techStack : []
  const pick = position % 4
  return {
    id: record.id || record._id,
    index: String(position + 5).padStart(2, '0'),
    title: record.title || 'Untitled project',
    category: (record.role || 'Additional project').slice(0, 48),
    year: yearFrom(record.completionDate),
    role: '',
    wide: false,
    visual: VISUALS[pick],
    hue: HUES[pick],
    tagline: (record.description || '').slice(0, 160),
    description: record.description || '',
    challenge: record.description || '',
    approach: [],
    architecture: [],
    outcomes: [],
    outcome: record.outcome || '',
    techStack: stack,
    completionDate: record.completionDate,
    image: record.image || null,
    alt: record.alt || record.title || '',
    links: [],
    source: 'api',
  }
}

function normalizeQualification(record) {
  return {
    period: formatDate(record.completionDate),
    title: record.title || 'Qualification',
    org: 'Added via the admin panel',
    description: record.description || '',
    tags: [],
    source: 'api',
    _id: record._id,
  }
}

const curatedTimeline = [...experience, ...education]

export function useProjects() {
  const [projects, setProjects] = useState(curatedProjects)
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    let active = true
    api
      .get('/api/projects')
      .then((result) => {
        if (!active) return
        const records = Array.isArray(result?.data) ? result.data : []
        const extra = records
          .filter((record) => record?.id && !curatedProjects.some((item) => item.id === record.id))
          .map(normalizeProject)
        setProjects([...curatedProjects, ...extra])
        setStatus('ready')
      })
      .catch(() => {
        if (active) setStatus('offline')
      })
    return () => {
      active = false
    }
  }, [])

  return { projects, status }
}

export function useQualifications() {
  const [timeline, setTimeline] = useState(curatedTimeline)
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    let active = true
    api
      .get('/api/qualifications')
      .then((result) => {
        if (!active) return
        const records = Array.isArray(result?.data) ? result.data : []
        setTimeline([...curatedTimeline, ...records.map(normalizeQualification)])
        setStatus('ready')
      })
      .catch(() => {
        if (active) setStatus('offline')
      })
    return () => {
      active = false
    }
  }, [])

  return { timeline, status }
}
