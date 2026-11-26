import { Link } from 'react-router-dom'
import Icon from '../components/Icon.jsx'
import Reveal from '../components/Reveal.jsx'
import SectionHeader from '../components/SectionHeader.jsx'
import { profile } from '../data/portfolio.js'

const beyond = [
  {
    icon: 'user',
    title: 'Mentoring',
    text: 'I run design reviews and pair regularly with engineers earlier in their careers. Explaining a system is the fastest way to find its weak spots.',
  },
  {
    icon: 'code',
    title: 'Writing',
    text: 'Architecture decision records, incident write-ups and the occasional deep dive on event contracts. Writing is part of the engineering work, not an afterthought.',
  },
  {
    icon: 'terminal',
    title: 'Home lab',
    text: 'A small Kubernetes cluster that has been rebuilt more times than I can count — the best low-stakes place to try an idea before it reaches production.',
  },
]

export default function AboutPage() {
  return (
    <>
      <section className="page-head">
        <div className="grid-bg" aria-hidden="true" />
        <div className="shell">
          <Reveal>
            <p className="eyebrow" style={{ marginBottom: 'var(--s6)' }}>Profile / 01</p>
            <h1 className="h1">Engineering is a<br />team sport.</h1>
            <p className="lead">
              I am {profile.name}, a {profile.role.toLowerCase()} in {profile.location}. I design,
              build and operate software where correctness and changeability matter more than novelty.
            </p>
            <div className="page-head__meta">
              <span>{profile.role}</span>
              <span>{profile.location}</span>
              <span>{profile.timezone}</span>
              <span>Open to select engagements</span>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="page-body">
        <div className="shell split">
          <Reveal>
            <div className="profile-card">
              <div className="profile-card__portrait">
                <span className="profile-card__monogram">{profile.initials}</span>
              </div>
              <dl className="profile-card__meta">
                <div className="profile-card__row"><dt>Name</dt><dd>{profile.name}</dd></div>
                <div className="profile-card__row"><dt>Role</dt><dd>{profile.role}</dd></div>
                <div className="profile-card__row"><dt>Location</dt><dd>{profile.location}</dd></div>
                <div className="profile-card__row"><dt>Experience</dt><dd>8+ years</dd></div>
                <div className="profile-card__row"><dt>Status</dt><dd style={{ color: 'var(--success)' }}>Available</dd></div>
              </dl>
            </div>
            <div className="social-row">
              {profile.socials.map((social) => (
                <a
                  key={social.label}
                  className="social-link"
                  href={social.href}
                  aria-label={social.label}
                  title={social.label}
                  target={social.href.startsWith('http') ? '_blank' : undefined}
                  rel={social.href.startsWith('http') ? 'noreferrer' : undefined}
                >
                  <Icon name={social.icon} size={17} />
                </a>
              ))}
            </div>
          </Reveal>

          <Reveal delay={100}>
            <h2 className="h2" style={{ marginBottom: 'var(--s6)' }}>
              The short version, then the useful one.
            </h2>
            <div className="body-copy">
              {profile.bio.map((paragraph) => <p key={paragraph.slice(0, 40)}>{paragraph}</p>)}
            </div>

            <dl className="fact-list">
              {profile.facts.map((fact) => (
                <div className="fact-list__item" key={fact.label}>
                  <strong>{fact.label}</strong>
                  <span>{fact.value}</span>
                </div>
              ))}
            </dl>

            <div className="hero__actions" style={{ marginTop: 'var(--s10)' }}>
              <a className="btn btn--primary" href={profile.resumePath} target="_blank" rel="noreferrer">
                <Icon name="download" size={16} /> Download résumé
              </a>
              <Link to="/contact" className="btn btn--outline">
                Get in touch <Icon name="arrow-up-right" size={16} />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section section--bordered section--tight">
        <div className="shell">
          <SectionHeader
            index="02"
            label="Depth"
            title="Across the stack, and across the lifecycle."
          />
          <div className="split split--reverse">
            <Reveal>
              <div className="body-copy">
                <p>
                  My centre of gravity is backend and platform engineering, but I have shipped enough
                  front ends and data pipelines to know where the seams are. That matters: most
                  expensive bugs live in the contract between two teams, not inside a single service.
                </p>
                <p>
                  I am comfortable owning a problem from the design document through the migration
                  plan, the rollout, the dashboards and the post-incident review. I would rather
                  ship a boring system that is easy to reason about than a clever one that needs a
                  specialist to operate.
                </p>
              </div>
            </Reveal>
            <Reveal delay={100}>
              <div className="note-panel">
                <h3>Currently interested in</h3>
                <p>
                  Agent runtimes with real guardrails, event contracts that survive schema drift,
                  and making Kubernetes boring again. Always happy to trade notes on any of the three.
                </p>
                <div className="stack-cloud">
                  {profile.stack.slice(0, 10).map((tech) => <span className="chip" key={tech}>{tech}</span>)}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section section--bordered section--tight">
        <div className="shell">
          <SectionHeader index="03" label="Off the clock" title="Still curious, mostly." />
          <div className="capability-grid">
            {beyond.map((item, index) => (
              <Reveal as="article" className="capability" key={item.title} delay={index * 70}>
                <span className="capability__icon"><Icon name={item.icon} size={20} /></span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
