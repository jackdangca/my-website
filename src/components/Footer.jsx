
import { Link } from 'react-router-dom'

export default function Footer() {
  
  const quickLinks = [
    { label: 'Home', path: '/' },
    { label: 'About Me', path: '/about' },
    { label: 'Projects', path: '/projects' },
    { label: 'Education', path: '/education' },
    { label: 'Services', path: '/services' },
    { label: 'Contact Me', path: '/contact' },
  ]

  return (
    <footer className="bg-ink py-7 text-slate-400">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-4">
        <p className="text-sm">© {new Date().getFullYear()} Xiaoxing Dang. Built with React + Tailwind CSS.</p>
        <ul className="flex flex-wrap gap-3.5">
          {quickLinks.map((link) => (
            <li key={link.path}>
              <Link to={link.path} className="text-sm text-slate-300 transition hover:text-white">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  )
}
