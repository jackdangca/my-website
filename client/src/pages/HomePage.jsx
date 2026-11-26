import { Link } from 'react-router-dom'
import Icon from '../components/Icon.jsx'
import Reveal from '../components/Reveal.jsx'
import SectionHeader from '../components/SectionHeader.jsx'
import ProjectCard from '../components/ProjectCard.jsx'
import SystemGraph from '../components/SystemGraph.jsx'
import SpectrumKey from '../components/SpectrumKey.jsx'
import KineticWord from '../components/KineticWord.jsx'
import DecisionLab from '../components/DecisionLab.jsx'
import { CountUp, Sparkline } from '../components/Telemetry.jsx'
import { openCommands, SHORTCUT_LABEL } from '../components/CommandPalette.jsx'
import { profile, projects, capabilities } from '../data/portfolio.js'

const heroWords = ['hold up.', 'scale.', 'recover.', 'last.']

const principles = [
  {
    num: '01',
    title: 'Design the failure first',
    text: 'Before the happy path, write down how the system degrades, what times out, and who gets paged. Reliability is a design decision, not a monitoring add-on.',
  },
  {
    num: '02',
    title: 'Make the architecture legible',
    text: 'Short design docs, explicit contracts, boundaries a new engineer can find in an afternoon. If it cannot be explained, it cannot be safely changed.',
  },
  {
    num: '03',
    title: 'Ship in small, reversible steps',
    text: 'Feature flags, contract tests and progressive rollouts mean a bad change is a small event rather than an incident review.',
  },
]

export default function HomePage() {
  const featured = projects.slice(0, 3)
  const marqueeItems = [...profile.stack, ...profile.stack]
  const practiceItems = [...profile.practices, ...profile.practices]

  const handlePointer = (event) => {
    if (window.matchMedia('(hover: none)').matches) return
    const box = event.currentTarget.getBoundingClientRect()
    const x = event.clientX - box.left
    const y = event.clientY - box.top
    const style = event.currentTarget.style
    style.setProperty('--mx', `${x}px`)
    style.setProperty('--my', `${y}px`)
    style.setProperty('--px', (x / box.width - 0.5).toFixed(3))
    style.setProperty('--py', (y / box.height - 0.5).toFixed(3))
  }

  return (
    <>
      {/* ---------------------------------------------------------------- Hero */}
      <section
        className="hero"
        data-chapter="Overview"
        onPointerMove={handlePointer}
      >
        <div className="grid-bg" aria-hidden="true" />
        <div className="glow hero__glow" aria-hidden="true" />
        <div className="hero__spotlight" aria-hidden="true" />
        <div className="shell hero__grid">
          <div className="hero__copy">
            <Reveal>
              <span className="hero__status">
                <span className="status-dot" aria-hidden="true" />
                {profile.availability}
              </span>
            </Reveal>

            <Reveal delay={80}>
              <h1 className="display hero__title">
                I build systems
                <em>that <KineticWord words={heroWords} /></em>
              </h1>
            </Reveal>

            <Reveal delay={140}>
              <p className="hero__subtitle">{profile.role} &nbsp;/&nbsp; {profile.discipline}</p>
              <p className="lead">{profile.intro}</p>
            </Reveal>

            <Reveal delay={200}>
              <div className="hero__actions">
                <Link to="/projects" className="btn btn--primary">
                  Explore selected work <Icon name="arrow-right" size={16} />
                </Link>
                <Link to="/about" className="btn btn--outline">
                  About me <Icon name="arrow-up-right" size={16} />
                </Link>
              </div>
              <button type="button" className="hero__cmd" onClick={openCommands}>
                <Icon name="terminal" size={15} />
                <span>or press</span>
                <kbd className="cmd-kbd">{SHORTCUT_LABEL}</kbd>
                <span>to jump anywhere</span>
                <Icon name="arrow-right" size={13} />
              </button>
            </Reveal>

            <Reveal delay={260}>
              <dl className="hero__meta">
                <div className="hero__meta-item">
                  <dt>Based in</dt>
                  <dd>{profile.location}</dd>
                </div>
                <div className="hero__meta-item">
                  <dt>Currently</dt>
                  <dd>Platform &amp; applied AI</dd>
                </div>
                <div className="hero__meta-item">
                  <dt>Timezone</dt>
                  <dd>{profile.timezone}</dd>
                </div>
              </dl>
              <SpectrumKey />
            </Reveal>
          </div>

          <Reveal delay={180}>
            <div className="hero__panel">
              <SystemGraph />
            </div>
          </Reveal>
        </div>

        <div className="hero__scroll" aria-hidden="true">
          <span className="mono">SCROLL TO TRACE</span>
          <span className="hero__scroll-line" />
        </div>
      </section>

      {/* ------------------------------------------------------------- Metrics */}
      <Reveal>
        <div className="shell" style={{ paddingBottom: 'var(--s10)' }}>
          <dl className="metrics">
            {profile.stats.map((stat, index) => (
              <div className="metric" key={stat.label}>
                <Sparkline seed={index} />
                <CountUp value={stat.value} />
                <span>{stat.label}</span>
              </div>
            ))}
          </dl>
        </div>
      </Reveal>

      {/* --------------------------------------------- Dual-direction marquee */}
      <div className="marquee-stack" aria-label="Core technology stack and engineering practices">
        <div className="marquee">
          <div className="marquee__track">
            {marqueeItems.map((item, index) => (
              <span className="marquee__item" key={`${item}-${index}`}>{item}</span>
            ))}
          </div>
        </div>
        <div className="marquee marquee--alt">
          <div className="marquee__track marquee__track--reverse">
            {practiceItems.map((item, index) => (
              <span className="marquee__item marquee__item--practice" key={`${item}-${index}`}>{item}</span>
            ))}
          </div>
        </div>
      </div>

      {/* -------------------------------------------------------- Selected work */}
      <section className="section" data-chapter="Selected work">
        <div className="shell">
          <SectionHeader
            index="01"
            label="Selected work"
            title="Systems, not screenshots."
            aside="Four case studies covering agent runtimes, full-stack commerce, distributed services and reliability engineering. Each one documents the problem, the architecture and the measured result."
          />
          <div className="project-grid">
            {featured.map((project, index) => (
              <ProjectCard key={project.id} project={project} delay={index * 70} />
            ))}
          </div>
          <Reveal>
            <div style={{ marginTop: 'var(--s8)', display: 'flex', justifyContent: 'center' }}>
              <Link to="/projects" className="btn btn--outline">
                View all case studies <Icon name="arrow-right" size={16} />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* --------------------------------------------------------- Capabilities */}
      <section className="section section--bordered" data-chapter="Capabilities">
        <div className="shell">
          <SectionHeader
            index="02"
            label="Capabilities"
            title="Where I add leverage."
            aside="From a bounded-context diagram to the on-call runbook — I work across the whole lifecycle, and I am most useful where architecture meets delivery."
          />
          <div className="capability-grid">
            {capabilities.slice(0, 3).map((capability, index) => (
              <Reveal as="article" className="capability" key={capability.id} delay={index * 70}>
                <span className="capability__icon"><Icon name={capability.icon} size={20} /></span>
                <h3>{capability.title}</h3>
                <p>{capability.description}</p>
                <ul className="capability__list">
                  {capability.deliverables.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <div style={{ marginTop: 'var(--s8)' }}>
              <Link to="/services" className="text-link">
                All six capabilities <Icon name="arrow-right" size={15} />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* --------------------------------------------------------- Decision lab */}
      <DecisionLab />

      {/* ----------------------------------------------------------- Principles */}
      <section className="section section--bordered" data-chapter="Principles">
        <div className="shell">
          <SectionHeader
            index="04"
            label="How I work"
            title="A few non-negotiables."
            aside="These are the rules that keep a codebase changeable two years after the launch announcement."
          />
          <Reveal>
            <div className="principles">
              {principles.map((item) => (
                <div className="principle" key={item.num}>
                  <span className="principle__num">{item.num}</span>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
