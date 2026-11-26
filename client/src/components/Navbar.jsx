import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import Logo from './Logo.jsx'
import Icon from './Icon.jsx'
import ThemeToggle from './ThemeToggle.jsx'
import { openCommands, SHORTCUT_LABEL } from './CommandPalette.jsx'
import { useAuth } from '../AuthContext.jsx'
import { navigation, profile } from '../data/portfolio.js'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const close = () => setMenuOpen(false)
  const handleSignOut = () => {
    signOut()
    close()
    navigate('/')
  }

  const links = user?.role === 'admin'
    ? [...navigation, { label: 'Admin', path: '/admin' }]
    : navigation

  const linkClass = ({ isActive }) => `nav-link${isActive ? ' is-active' : ''}`

  return (
    <header className="site-header">
      <div className="shell site-header__inner">
        <NavLink to="/" className="brand" onClick={close} aria-label={`${profile.name} — home`}>
          <Logo size={38} />
          <span className="brand__name">
            <strong>{profile.name}</strong>
            <span>Senior Software Engineer</span>
          </span>
        </NavLink>

        <nav className="nav-desktop" aria-label="Main navigation">
          {links.map((item) => (
            <NavLink key={item.path} to={item.path} end={item.path === '/'} className={linkClass}>
              {item.label}
            </NavLink>
          ))}
          <span className="nav-sep" aria-hidden="true" />
          {user ? (
            <button type="button" className="nav-link" onClick={handleSignOut} title={`Signed in as ${user.name}`}>
              <Icon name="logout" size={15} /> Sign out
            </button>
          ) : (
            <NavLink to="/sign-in" className={linkClass}>Sign in</NavLink>
          )}
        </nav>

        <div className="header-actions">
          <button
            type="button"
            className="cmd-trigger"
            onClick={openCommands}
            aria-label={`Open command palette (${SHORTCUT_LABEL})`}
            title={`Jump to anything · ${SHORTCUT_LABEL}`}
          >
            <Icon name="terminal" size={15} />
            <span className="cmd-trigger__label">Jump to…</span>
            <kbd className="cmd-trigger__kbd">{SHORTCUT_LABEL}</kbd>
          </button>
          <ThemeToggle />
          <Link to="/contact" className="btn btn--primary btn--sm header-cta">
            Let&apos;s talk <Icon name="arrow-up-right" size={14} />
          </Link>
          <button
            type="button"
            className="icon-btn nav-toggle"
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <Icon name={menuOpen ? 'close' : 'menu'} />
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="shell">
          <nav id="mobile-nav" className="nav-mobile" aria-label="Mobile navigation">
            {links.map((item) => (
              <NavLink key={item.path} to={item.path} end={item.path === '/'} className={linkClass} onClick={close}>
                {item.label}
              </NavLink>
            ))}
            <button
              type="button"
              className="nav-link"
              onClick={() => { close(); openCommands() }}
            >
              <Icon name="terminal" size={16} /> Search / jump to anything…
            </button>
            <div className="nav-mobile__divider" />
            {user ? (
              <button type="button" className="nav-link" onClick={handleSignOut}>
                <Icon name="logout" size={16} /> Sign out ({user.name})
              </button>
            ) : (
              <>
                <NavLink to="/sign-in" className={linkClass} onClick={close}>Sign in</NavLink>
                <NavLink to="/sign-up" className={linkClass} onClick={close}>Create account</NavLink>
              </>
            )}
            <Link to="/contact" className="btn btn--primary btn--block" onClick={close} style={{ marginTop: 'var(--s3)' }}>
              Start a conversation <Icon name="arrow-right" size={15} />
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
