import { useEffect, useState } from 'react'
import Reveal from './Reveal.jsx'
import SectionHeader from './SectionHeader.jsx'
import Icon from './Icon.jsx'
import { scenarios } from '../data/portfolio.js'

/* An interactive "failure-mode" explorer. Instead of only claiming experience,
   the site lets a visitor pick a scenario and read the actual design decision. */

const STEPS = [
  { key: 'signal', label: 'Signal', icon: 'gauge' },
  { key: 'failure', label: 'Failure mode', icon: 'shield' },
  { key: 'decision', label: 'Decision', icon: 'cpu' },
  { key: 'tradeoff', label: 'Trade-off', icon: 'network' },
]

export default function DecisionLab() {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const scenario = scenarios[active]

  useEffect(() => {
    if (paused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    const timer = window.setInterval(
      () => setActive((value) => (value + 1) % scenarios.length),
      6500,
    )
    return () => window.clearInterval(timer)
  }, [paused])

  const choose = (index) => {
    setActive(index)
    setPaused(true)
  }

  const onKeyDown = (event) => {
    const keys = ['ArrowDown', 'ArrowRight', 'ArrowUp', 'ArrowLeft', 'Home', 'End']
    if (!keys.includes(event.key)) return
    event.preventDefault()
    const tabs = Array.from(event.currentTarget.querySelectorAll('[role="tab"]'))
    let next = active
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') next = (active + 1) % tabs.length
    if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') next = (active - 1 + tabs.length) % tabs.length
    if (event.key === 'Home') next = 0
    if (event.key === 'End') next = tabs.length - 1
    choose(next)
    tabs[next]?.focus()
  }

  return (
    <section className="section section--bordered" data-chapter="Decision lab">
      <div className="shell">
        <SectionHeader
          index="03"
          label="Decision lab"
          title="Stress-test the thinking."
          aside="Anyone can show a happy-path diagram. Pick a failure scenario below and read how the system is designed to respond — and what it costs."
        />

        <Reveal>
          <div className="lab">
            <div className="lab__sidebar">
              <p className="lab__sidebar-head">
                <Icon name="terminal" size={14} /> SCENARIOS
                <span>{String(active + 1).padStart(2, '0')} / 0{scenarios.length}</span>
              </p>
              <div className="lab__tabs" role="tablist" aria-label="Failure scenarios" aria-orientation="vertical" onKeyDown={onKeyDown}>
                {scenarios.map((item, index) => (
                  <button
                    key={item.id}
                    type="button"
                    role="tab"
                    id={`lab-tab-${index}`}
                    aria-controls="lab-panel"
                    aria-selected={index === active}
                    tabIndex={index === active ? 0 : -1}
                    className={`lab__tab${index === active ? ' is-active' : ''}`}
                    onClick={() => choose(index)}
                  >
                    <span className="lab__tab-top">
                      <span className="lab__tab-num">0{index + 1}</span>
                      <span className="lab__tab-label">{item.label}</span>
                    </span>
                    <span className="lab__tab-bottom">
                      <span className="lab__tab-tag">{item.tag}</span>
                      <span className="lab__tab-meter" aria-hidden="true">
                        <i style={{ width: `${item.bars.before}%` }} />
                      </span>
                    </span>
                  </button>
                ))}
              </div>
              <p className="lab__hint">
                <span className={`status-dot${paused ? ' is-paused' : ''}`} aria-hidden="true" />
                {paused ? 'Manual mode · ↑ ↓ to switch' : 'Auto-cycling · click to take control'}
              </p>
            </div>

            <div className="lab__panel" id="lab-panel" role="tabpanel" aria-labelledby={`lab-tab-${active}`} key={scenario.id}>
              <div className="lab__panel-head">
                <span className="eyebrow">Decision trace / 0{active + 1}</span>
                <span className="lab__panel-id mono">{scenario.id.toUpperCase()} · REV 04</span>
              </div>

              <h3 className="lab__title">{scenario.label}</h3>

              <ol className="lab__trace">
                {STEPS.map((step, index) => (
                  <li className="lab__step" key={step.key} style={{ '--step-delay': `${index * 70}ms` }}>
                    <span className="lab__step-icon"><Icon name={step.icon} size={15} /></span>
                    <div>
                      <span className="lab__step-label">
                        <span className="num">0{index + 1}</span> {step.label}
                      </span>
                      <p>{scenario[step.key]}</p>
                    </div>
                  </li>
                ))}
              </ol>

              <div className="lab__chart">
                <div className="lab__chart-head">
                  <span>IMPACT · BEFORE / AFTER</span>
                  <span className="lab__chart-delta">
                    <Icon name="arrow-down" size={13} /> {scenario.bars.before - scenario.bars.after} pts
                  </span>
                </div>
                <div className="lab__bar-row">
                  <span className="lab__bar-name">Unmitigated</span>
                  <span className="lab__bar lab__bar--before" style={{ '--bar-w': `${scenario.bars.before}%` }} />
                  <span className="lab__bar-value">{scenario.bars.beforeLabel}</span>
                </div>
                <div className="lab__bar-row">
                  <span className="lab__bar-name">Designed</span>
                  <span className="lab__bar lab__bar--after" style={{ '--bar-w': `${scenario.bars.after}%` }} />
                  <span className="lab__bar-value">{scenario.bars.afterLabel}</span>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
