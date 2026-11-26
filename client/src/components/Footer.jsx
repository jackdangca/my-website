import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from './Icon.jsx'
import Logo from './Logo.jsx'
import { openCommands, SHORTCUT_LABEL } from './CommandPalette.jsx'
import { navigation, profile } from '../data/portfolio.js'

function localTime() {
  try {
    return new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/Toronto',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(new Date())
  } catch {
    return '—'
  }
}

export default function Footer() {
  const [time, setTime] = useState(localTime)

  useEffect(() => {
    const timer = setInterval(() => setTime(localTime()), 30_000)
    return () => clearInterval(timer)
  }, [])

  return (
    <footer className="site-footer">
      <div className="shell">
        <div className="footer-cta">
          <div>
            <p className="eyebrow" style={{ marginBottom: 'var(--s5)' }}>Next step</p>
            <h2>Have a system worth <em>building properly?</em></h2>
          </div>
          <Link to="/contact" className="btn btn--primary">
            Start a conversation <Icon name="arrow-up-right" size={16} />
          </Link>
        </div>

        <div className="footer-main">
          <div className="footer-col footer-about">
            <Link to="/" className="brand" aria-label={`${profile.name} — home`}>
              <Logo size={38} />
              <span className="brand__name">
                <strong>{profile.name}</strong>
                <span>Senior Software Engineer</span>
              </span>
            </Link>
            <p>{profile.intro}</p>
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
          </div>

          <div className="footer-col">
            <h3>Explore</h3>
            <ul>
              {navigation.map((item) => (
                <li key={item.path}><Link to={item.path}>{item.label}</Link></li>
              ))}
            </ul>
          </div>

          <div className="footer-col">
            <h3>Contact</h3>
            <ul>
              <li><a href={`mailto:${profile.email}`}>{profile.email}</a></li>
              <li><a href={`tel:${profile.phone.replace(/[^+\d]/g, '')}`}>{profile.phone}</a></li>
              <li><span className="muted">{profile.location}</span></li>
              <li><Link to="/sign-in">Client sign in</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} {profile.name}. Built with React, Vite &amp; Tailwind.</span>
          <button type="button" className="footer-shortcut" onClick={openCommands}>
            <kbd className="cmd-kbd">{SHORTCUT_LABEL}</kbd> Command palette
          </button>
          <span className="footer-bottom__right">
            <span className="status-dot" aria-hidden="true" />
            Available for select projects · Toronto {time}
          </span>
        </div>
      </div>
    </footer>
  )
}
