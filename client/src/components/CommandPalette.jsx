import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Icon from './Icon.jsx'
import { useTheme } from '../hooks/useTheme.js'
import { capabilities, navigation, profile, projects } from '../data/portfolio.js'

export const OPEN_COMMANDS = 'portfolio:open-commands'

export function openCommands() {
  window.dispatchEvent(new Event(OPEN_COMMANDS))
}

const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.userAgent)
export const SHORTCUT_LABEL = isMac ? '⌘K' : 'Ctrl K'

const GROUPS = ['Navigate', 'Case studies', 'Capabilities', 'Actions']
const SUGGESTED = 9

/* Loose fuzzy match: exact substring first, then ordered subsequence.
   Good enough for a small command set and keeps everything dependency-free. */
function score(command, query) {
  if (!query) return 1
  const needle = query.toLowerCase().trim()
  if (!needle) return 1
  const haystack = `${command.label} ${command.hint || ''} ${command.keywords || ''} ${command.group}`.toLowerCase()
  if (haystack.includes(needle)) return 3
  let cursor = 0
  for (const character of haystack) {
    if (character === needle[cursor]) cursor += 1
    if (cursor === needle.length) return 1
  }
  return 0
}

export default function CommandPalette() {
  const navigate = useNavigate()
  const { theme, setTheme } = useTheme()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const [flash, setFlash] = useState('')
  const inputRef = useRef(null)
  const restoreFocusRef = useRef(null)
  const listRef = useRef(null)

  const commands = useMemo(() => {
    const pages = navigation.map((item) => ({
      id: `page-${item.path}`,
      label: item.label,
      group: 'Navigate',
      icon: item.path === '/' ? 'terminal' : 'chevron-right',
      hint: item.path,
      keywords: 'go page section',
      to: item.path,
    }))

    const cases = projects.map((project) => ({
      id: `project-${project.id}`,
      label: project.title,
      group: 'Case studies',
      icon: 'layers',
      hint: project.category,
      keywords: `${project.tagline} ${project.description} ${(project.techStack || []).join(' ')}`,
      to: `/projects/${project.id}`,
    }))

    const skills = capabilities.map((capability) => ({
      id: `capability-${capability.id}`,
      label: capability.title,
      group: 'Capabilities',
      icon: capability.icon,
      hint: 'Capability',
      keywords: `${capability.description} ${capability.deliverables.join(' ')}`,
      to: '/services',
    }))

    const actions = [
      {
        id: 'action-contact',
        label: 'Start a conversation',
        group: 'Actions',
        icon: 'mail',
        hint: 'Get in touch',
        keywords: 'hire contact email project',
        to: '/contact',
      },
      {
        id: 'action-theme',
        label: `Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`,
        group: 'Actions',
        icon: theme === 'dark' ? 'sun' : 'moon',
        hint: 'Appearance',
        keywords: 'dark light appearance colour color',
        action: 'theme',
      },
      {
        id: 'action-copy',
        label: 'Copy email address',
        group: 'Actions',
        icon: 'code',
        hint: profile.email,
        keywords: 'clipboard mail address',
        action: 'copy',
      },
      {
        id: 'action-github',
        label: 'Open GitHub',
        group: 'Actions',
        icon: 'github',
        hint: 'External',
        keywords: 'source code repository',
        href: 'https://github.com/',
      },
      {
        id: 'action-linkedin',
        label: 'Open LinkedIn',
        group: 'Actions',
        icon: 'linkedin',
        hint: 'External',
        keywords: 'profile network career',
        href: 'https://www.linkedin.com/',
      },
    ]

    return [...pages, ...cases, ...skills, ...actions]
  }, [theme])

  const results = useMemo(() => {
    if (!query.trim()) {
      const picked = [
        ...commands.filter((c) => c.group === 'Navigate'),
        ...commands.filter((c) => c.group === 'Case studies').slice(0, 2),
        commands.find((c) => c.id === 'action-contact'),
      ]
      return picked.slice(0, SUGGESTED)
    }
    return commands
      .map((command) => ({ command, rank: score(command, query) }))
      .filter((entry) => entry.rank > 0)
      .sort((a, b) => b.rank - a.rank)
      .slice(0, 14)
      .map((entry) => entry.command)
  }, [commands, query])

  const grouped = useMemo(() => {
    const buckets = []
    results.forEach((command, index) => {
      let bucket = buckets.find((item) => item.name === command.group)
      if (!bucket) {
        bucket = { name: command.group, items: [] }
        buckets.push(bucket)
      }
      bucket.items.push({ command, index })
    })
    buckets.sort((a, b) => GROUPS.indexOf(a.name) - GROUPS.indexOf(b.name))
    return buckets
  }, [results])

  const close = useCallback(() => setOpen(false), [])

  const execute = useCallback((command) => {
    if (!command) return
    if (command.action === 'copy') {
      const text = profile.email
      if (navigator.clipboard?.writeText) {
        navigator.clipboard.writeText(text).catch(() => {})
      } else {
        const field = document.createElement('textarea')
        field.value = text
        field.style.position = 'fixed'
        field.style.opacity = '0'
        document.body.appendChild(field)
        field.select()
        try { document.execCommand('copy') } catch { /* clipboard unavailable */ }
        field.remove()
      }
      setFlash(`Copied ${text}`)
      window.setTimeout(() => setFlash(''), 2200)
      return
    }
    setOpen(false)
    setQuery('')
    if (command.to) navigate(command.to)
    else if (command.href) window.open(command.href, '_blank', 'noopener,noreferrer')
    else if (command.action === 'theme') {
      setTheme(theme === 'dark' ? 'light' : 'dark', {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
      })
    }
  }, [navigate, setTheme, theme])

  /* Global shortcuts + the event bus used by the header trigger. */
  useEffect(() => {
    const onKey = (event) => {
      const key = event.key.toLowerCase()
      if ((event.metaKey || event.ctrlKey) && key === 'k') {
        event.preventDefault()
        setOpen((value) => !value)
        return
      }
      if (event.key === 'Escape' && open) {
        event.preventDefault()
        setOpen(false)
        return
      }
      if (event.key === '/' && !open && !event.metaKey && !event.ctrlKey && !event.altKey) {
        const target = event.target
        const typing = target instanceof HTMLElement &&
          (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)
        if (!typing) {
          event.preventDefault()
          setOpen(true)
        }
      }
    }
    const onOpen = () => setOpen(true)
    window.addEventListener('keydown', onKey)
    window.addEventListener(OPEN_COMMANDS, onOpen)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener(OPEN_COMMANDS, onOpen)
    }
  }, [open])

  useEffect(() => {
    if (open) {
      restoreFocusRef.current = document.activeElement
      setQuery('')
      setActive(0)
      const previous = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      const frame = requestAnimationFrame(() => inputRef.current?.focus())
      return () => {
        cancelAnimationFrame(frame)
        document.body.style.overflow = previous
      }
    }
    const previous = restoreFocusRef.current
    if (previous && document.contains(previous) && typeof previous.focus === 'function') {
      previous.focus()
    }
    return undefined
  }, [open])

  useEffect(() => { setActive(0) }, [query])

  useEffect(() => {
    if (!open || !listRef.current) return
    listRef.current.querySelector(`#cmd-option-${active}`)?.scrollIntoView({ block: 'nearest' })
  }, [active, open])

  const onDialogKeyDown = (event) => {
    if (event.key === 'ArrowDown' || (event.key === 'Tab' && !event.shiftKey)) {
      event.preventDefault()
      setActive((value) => (results.length ? (value + 1) % results.length : 0))
    } else if (event.key === 'ArrowUp' || (event.key === 'Tab' && event.shiftKey)) {
      event.preventDefault()
      setActive((value) => (results.length ? (value - 1 + results.length) % results.length : 0))
    } else if (event.key === 'Home') {
      event.preventDefault()
      setActive(0)
    } else if (event.key === 'End') {
      event.preventDefault()
      setActive(Math.max(0, results.length - 1))
    } else if (event.key === 'Enter') {
      event.preventDefault()
      execute(results[active])
    }
  }

  if (!open) return null

  return (
    <div className="cmd-overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) close() }}>
      <div
        className="cmd-dialog"
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        onKeyDown={onDialogKeyDown}
      >
        <div className="cmd-search">
          <span className="cmd-search__glyph" aria-hidden="true">&gt;_</span>
          <input
            ref={inputRef}
            className="cmd-search__input"
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search pages, case studies, technologies, actions…"
            aria-label="Search commands"
            aria-autocomplete="list"
            aria-controls="cmd-results"
            aria-activedescendant={results.length ? `cmd-option-${active}` : undefined}
            autoComplete="off"
            spellCheck="false"
          />
          <kbd className="cmd-kbd">ESC</kbd>
        </div>

        <div className="cmd-results" id="cmd-results" role="listbox" aria-label="Commands" ref={listRef}>
          {grouped.length === 0 && (
            <div className="cmd-empty">
              <Icon name="terminal" size={22} />
              <p>No command matches <span className="mono">“{query}”</span></p>
              <span>Try a technology, a page name, or “theme”.</span>
            </div>
          )}
          {grouped.map((bucket) => (
            <div className="cmd-group" key={bucket.name}>
              <p className="cmd-group__label">{bucket.name}</p>
              {bucket.items.map(({ command, index }) => (
                <button
                  type="button"
                  key={command.id}
                  id={`cmd-option-${index}`}
                  role="option"
                  aria-selected={index === active}
                  tabIndex={-1}
                  className={`cmd-option${index === active ? ' is-active' : ''}`}
                  onMouseEnter={() => setActive(index)}
                  onClick={() => execute(command)}
                >
                  <span className="cmd-option__icon"><Icon name={command.icon} size={16} /></span>
                  <span className="cmd-option__label">{command.label}</span>
                  {command.hint && <span className="cmd-option__hint">{command.hint}</span>}
                  {index === active && <span className="cmd-option__enter" aria-hidden="true">↵</span>}
                </button>
              ))}
            </div>
          ))}
        </div>

        <div className="cmd-footer">
          <span className={flash ? 'cmd-footer__flash' : ''}>
            {flash || `${results.length} command${results.length === 1 ? '' : 's'}`}
          </span>
          <span className="cmd-footer__keys">
            <kbd className="cmd-kbd">↑</kbd><kbd className="cmd-kbd">↓</kbd> navigate
            <kbd className="cmd-kbd">↵</kbd> select
            <kbd className="cmd-kbd">/</kbd> quick open
          </span>
        </div>
      </div>
    </div>
  )
}
