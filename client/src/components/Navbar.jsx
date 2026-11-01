
import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import Logo from './Logo.jsx'
import { useAuth } from '../AuthContext.jsx'


const NAV_ITEMS = [
  { label: 'Home', path: '/' },
  { label: 'About Me', path: '/about' },
  { label: 'Projects', path: '/projects' },
  { label: 'Education', path: '/education' },
  { label: 'Services', path: '/services' },
  { label: 'Contact Me', path: '/contact' },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleLinkClick = () => {
    setMenuOpen(false)
  }

  const handleSignOut = () => {
    signOut()
    setMenuOpen(false)
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-50 bg-ink shadow-lg shadow-slate-900/25">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-2">
  
        <NavLink to="/" className="flex items-center gap-2.5 font-bold text-white" onClick={handleLinkClick}>
          <Logo size={38} />
          <span className="whitespace-nowrap">Xiaoxing Dang</span>
        </NavLink>

      
        <button
          type="button"
          className="flex flex-col gap-1.5 p-2 md:hidden"
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className="block h-0.5 w-6 rounded bg-white" />
          <span className="block h-0.5 w-6 rounded bg-white" />
          <span className="block h-0.5 w-6 rounded bg-white" />
        </button>

       
        <nav
          className={`${
            menuOpen ? 'flex' : 'hidden'
          } w-full flex-col items-stretch gap-1 pb-3 md:flex md:w-auto md:flex-row md:items-center md:gap-1.5 md:pb-0`}
        >
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `rounded-full px-3.5 py-2 text-sm font-medium transition ${
                  isActive
                    ? 'bg-brand text-white'
                    : 'text-slate-300 hover:bg-white/10 hover:text-white'
                }`
              }
              onClick={handleLinkClick}
            >
              {item.label}
            </NavLink>
          ))}
          {user?.role === 'admin' && (
            <NavLink to="/admin" onClick={handleLinkClick}
              className={({ isActive }) => `rounded-full px-3.5 py-2 text-sm font-medium ${isActive ? 'bg-brand text-white' : 'text-slate-300 hover:bg-white/10 hover:text-white'}`}>
              Admin
            </NavLink>
          )}
          {user ? (
            <button type="button" onClick={handleSignOut}
              className="rounded-full px-3.5 py-2 text-left text-sm font-medium text-slate-300 hover:bg-white/10 hover:text-white">
              Sign out ({user.name})
            </button>
          ) : (
            <>
              <NavLink to="/sign-in" onClick={handleLinkClick}
                className="rounded-full px-3.5 py-2 text-sm font-medium text-slate-300 hover:bg-white/10 hover:text-white">
                Sign in
              </NavLink>
              <NavLink to="/sign-up" onClick={handleLinkClick}
                className="rounded-full px-3.5 py-2 text-sm font-medium text-slate-300 hover:bg-white/10 hover:text-white">
                Sign up
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
