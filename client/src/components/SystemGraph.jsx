import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from './Icon.jsx'
import { projects } from '../data/portfolio.js'

/* The hero is a small control plane rather than a static card.
   Four nodes = four case studies; selecting one opens its live readout. */

/* Each node keeps a domain hue from the chromatic key. The selected hue is
   passed down to the inspector, so colour tracks state instead of decorating. */
const NODES = [
  { x: 24, y: 30, short: 'ATLAS', sub: 'AGENT RUNTIME', hue: 'var(--hue-ai)' },
  { x: 406, y: 30, short: 'NOVA', sub: 'COMMERCE', hue: 'var(--hue-commerce)' },
  { x: 24, y: 220, short: 'BLUEMART', sub: 'MICROSERVICES', hue: 'var(--hue-mesh)' },
  { x: 406, y: 220, short: 'PULSE', sub: 'SLO / TRACES', hue: 'var(--hue-signal)' },
]

const EDGES = [
  'M215 132 C168 122 168 60 154 55',
  'M345 132 C392 122 392 60 406 55',
  'M215 164 C168 174 168 240 154 245',
  'M345 164 C392 174 392 240 406 245',
]

const TRACE_LINES = [
  { level: 'OK', text: 'contract.test suite=orders 47/47' },
  { level: 'INFO', text: 'trace.export → otel-collector 200' },
  { level: 'OK', text: 'kafka.consumer lag=12 committed' },
  { level: 'INFO', text: 'agent.run checkpoint persisted 38ms' },
  { level: 'WARN', text: 'slo.burn_rate 0.42x / 1h window' },
  { level: 'OK', text: 'k8s.rollout 3/3 replicas ready' },
  { level: 'INFO', text: 'gateway.rate_limit anon 429 ×2' },
  { level: 'OK', text: 'postgres.pool active=8 idle=12' },
]

function stamp(tick, offset) {
  const minute = String((32 + Math.floor(tick / 8)) % 60).padStart(2, '0')
  const second = String((7 + tick * 7 + offset * 3) % 60).padStart(2, '0')
  const ms = String((tick * 137 + offset * 211) % 1000).padStart(3, '0')
  return `14:${minute}:${second}.${ms}`
}

export default function SystemGraph() {
  const [selected, setSelected] = useState(0)
  const [tick, setTick] = useState(0)
  const [requests, setRequests] = useState(12480)
  const active = projects[selected] || projects[0]
  const headline = active.outcomes?.[0]

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    const timer = window.setInterval(() => {
      setTick((value) => value + 1)
      setRequests((value) => value + 3 + (value % 7))
    }, 2200)
    return () => window.clearInterval(timer)
  }, [])

  const selectWithKeyboard = (event, index) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      setSelected(index)
    }
  }

  return (
    <div
      className="system-panel system-panel--live"
      style={{ '--inspector-hue': NODES[selected]?.hue || 'var(--accent)' }}
    >
      <div className="system-panel__bar">
        <span /><span /><span />
        <p>topology.live</p>
        <span className="sg-req num">{requests.toLocaleString('en-US')} req</span>
      </div>

      <div className="sg-canvas">
        <p className="sg-canvas__tag">TOPOLOGY · 04 SYSTEMS · 01 CORE</p>
        <svg viewBox="0 0 560 300" role="img" aria-label="Interactive map of four engineering case studies connected to a portfolio core">
          <defs>
            <linearGradient id="sg-core" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="var(--c-violet)" stopOpacity="0.32" />
              <stop offset="52%" stopColor="var(--c-blue)" stopOpacity="0.24" />
              <stop offset="100%" stopColor="var(--c-cyan)" stopOpacity="0.20" />
            </linearGradient>
            <linearGradient id="sg-core-line" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="var(--c-violet)" />
              <stop offset="55%" stopColor="var(--c-blue)" />
              <stop offset="100%" stopColor="var(--c-cyan)" />
            </linearGradient>
          </defs>

          {/* blueprint ticks */}
          {[24, 536].map((x) => [18, 282].map((y) => (
            <path key={`${x}-${y}`} d={`M${x - 5} ${y}h10M${x} ${y - 5}v10`} className="sg-tick" />
          )))}
          <path d="M154 55H406M154 245H406" className="sg-edge sg-edge--faint" />
          <path d="M280 30V270" className="sg-edge sg-edge--faint sg-edge--faint-v" />

          {EDGES.map((edge, index) => (
            <g key={edge} style={{ '--edge-hue': NODES[index]?.hue || 'var(--accent)' }}>
              <path
                id={`sg-path-${index}`}
                d={edge}
                className={`sg-edge${selected === index ? ' is-active' : ''}`}
              />
              <circle r="3.2" className="sg-packet">
                <animateMotion
                  dur={`${2.7 + index * 0.28}s`}
                  begin={`${-index * 0.62}s`}
                  repeatCount="indefinite"
                  path={edge}
                />
              </circle>
            </g>
          ))}

          {/* centre / core */}
          <rect x="215" y="118" width="130" height="60" rx="10" className="sg-core" />
          <circle cx="232" cy="140" r="4" className="sg-core__dot" />
          <text x="246" y="144" className="sg-core__label">PORTFOLIO CORE</text>
          <text x="230" y="162" className="sg-core__sub">4 SYSTEMS · LIVE</text>

          {NODES.map((node, index) => (
            <g
              key={node.short}
              className={`sg-node${selected === index ? ' is-selected' : ''}`}
              style={{ '--node-hue': node.hue }}
              role="button"
              tabIndex={0}
              aria-label={`Inspect ${projects[index]?.title || node.short}`}
              aria-pressed={selected === index}
              onClick={() => setSelected(index)}
              onKeyDown={(event) => selectWithKeyboard(event, index)}
            >
              <rect x={node.x} y={node.y} width="130" height="50" rx="8" className="sg-node__box" />
              <circle cx={node.x + 14} cy={node.y + 25} r="3.5" className="sg-node__dot" />
              <text x={node.x + 26} y={node.y + 22} className="sg-node__label">{node.short}</text>
              <text x={node.x + 26} y={node.y + 37} className="sg-node__sub">{node.sub}</text>
              <text x={node.x + 116} y={node.y + 14} textAnchor="end" className="sg-node__num">
                0{index + 1}
              </text>
            </g>
          ))}
        </svg>
      </div>

      <div className="sg-inspector" aria-live="polite">
        <div className="sg-inspector__head">
          <span className="sg-live"><span className="status-dot" aria-hidden="true" /> LIVE READOUT</span>
          <span className="mono">NODE 0{selected + 1} / 04</span>
        </div>
        <p className="sg-inspector__eyebrow">{active.category} · {active.year}</p>
        <h3 className="sg-inspector__title">{active.title}</h3>
        <p className="sg-inspector__desc">{active.tagline}</p>
        <div className="sg-inspector__foot">
          {headline && (
            <p className="sg-inspector__metric">
              <strong>{headline.value}</strong> {headline.label}
            </p>
          )}
          <Link to={`/projects/${active.id}`} className="text-link">
            Open case study <Icon name="arrow-right" size={15} />
          </Link>
        </div>
      </div>

      <div className="system-panel__code sg-trace" aria-hidden="true">
        {[0, 1, 2].map((offset) => {
          const line = TRACE_LINES[(tick + offset) % TRACE_LINES.length]
          return (
            <div key={offset} className="sg-trace__line">
              <span className="c">{stamp(tick, offset)}</span>{' '}
              <span className={line.level === 'OK' ? 's' : 'k'}>{line.level.padEnd(4, ' ')}</span>{' '}
              {line.text}
            </div>
          )
        })}
      </div>

      <div className="system-panel__footer">
        <div className="system-panel__stat"><strong>8+</strong><span>Years</span></div>
        <div className="system-panel__stat"><strong>12</strong><span>Services</span></div>
        <div className="system-panel__stat"><strong>99.95%</strong><span>SLO</span></div>
      </div>
    </div>
  )
}
