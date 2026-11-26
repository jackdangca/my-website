import { Link } from 'react-router-dom'
import Reveal from '../components/Reveal.jsx'
import SectionHeader from '../components/SectionHeader.jsx'
import Icon from '../components/Icon.jsx'
import { capabilities } from '../data/portfolio.js'

const process = [
  {
    num: '01 / UNDERSTAND',
    title: 'Map the real constraint',
    text: 'We start with the failure mode, the traffic shape and the team topology. A short written brief beats a long discovery phase — it makes the actual problem visible to everyone.',
  },
  {
    num: '02 / DESIGN',
    title: 'Decide in writing',
    text: 'Boundaries, contracts, data ownership and rollback paths get documented and challenged before code exists. The output is a design you can hand to any engineer on the team.',
  },
  {
    num: '03 / DELIVER',
    title: 'Ship, measure, hand over',
    text: 'Small reversible releases behind flags, with tests, dashboards and runbooks included as part of done. The engagement ends with your team owning the system comfortably.',
  },
]

export default function ServicesPage() {
  return (
    <>
      <section className="page-head">
        <div className="grid-bg" aria-hidden="true" />
        <div className="shell">
          <Reveal>
            <p className="eyebrow" style={{ marginBottom: 'var(--s6)' }}>Capabilities / 03</p>
            <h1 className="h1">What I can take<br />off your plate.</h1>
            <p className="lead">
              Six areas where I can own a problem end to end. Most engagements combine two or three —
              a platform redesign rarely stays purely inside one box.
            </p>
            <div className="page-head__meta">
              <span>Architecture</span>
              <span>Delivery</span>
              <span>Operations</span>
              <span>Advisory</span>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="page-body">
        <div className="shell">
          <div className="capability-grid">
            {capabilities.map((capability, index) => (
              <Reveal as="article" className="capability" key={capability.id} delay={(index % 3) * 70}>
                <span className="capability__icon"><Icon name={capability.icon} size={20} /></span>
                <h3>{capability.title}</h3>
                <p>{capability.description}</p>
                <ul className="capability__list">
                  {capability.deliverables.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--bordered section--tight">
        <div className="shell">
          <SectionHeader
            index="04"
            label="Engagement"
            title="A deliberately boring process."
            aside="No mystery, no six-week discovery phase. Each stage produces something your team keeps."
          />
          <div className="process-grid">
            {process.map((step, index) => (
              <Reveal as="article" className="process-step" key={step.num} delay={index * 80}>
                <span className="process-step__num">{step.num}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--tight">
        <div className="shell">
          <Reveal>
            <div className="note-panel">
              <h3>Not sure which of these you need?</h3>
              <p>
                That is usually the right starting point. Send a short description of the system and
                the thing that is currently hurting; I will tell you honestly whether I am the right
                person to help.
              </p>
              <Link to="/contact" className="btn btn--primary btn--sm" style={{ marginTop: 'var(--s6)' }}>
                Start a conversation <Icon name="arrow-right" size={15} />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
