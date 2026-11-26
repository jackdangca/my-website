import { lazy, Suspense, useEffect } from 'react'
import { Link, Route, Routes, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Icon from './components/Icon.jsx'
import CommandPalette from './components/CommandPalette.jsx'
import TraceRail from './components/TraceRail.jsx'
// Home is the landing/LCP route, so it stays in the entry chunk. Every other
// page is split into its own chunk and only fetched when that route is opened.
import HomePage from './pages/HomePage.jsx'
const AdminPage = lazy(() => import('./pages/AdminPage.jsx'))
const AuthPage = lazy(() => import('./pages/AuthPage.jsx'))
const AboutPage = lazy(() => import('./pages/AboutPage.jsx'))
const ProjectsPage = lazy(() => import('./pages/ProjectsPage.jsx'))
const ProjectDetailPage = lazy(() => import('./pages/ProjectDetailPage.jsx'))
const EducationPage = lazy(() => import('./pages/EducationPage.jsx'))
const ServicesPage = lazy(() => import('./pages/ServicesPage.jsx'))
const ContactPage = lazy(() => import('./pages/ContactPage.jsx'))

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])
  return null
}

function ForbiddenPage() {
  return (
    <div className="shell page-body">
      <div className="empty-state">
        <h3>403 — Restricted area</h3>
        <p>You do not have permission to access that page. Sign in with an administrator account to continue.</p>
        <Link to="/" className="btn btn--outline"><Icon name="arrow-left" size={15} /> Back home</Link>
      </div>
    </div>
  )
}

function NotFoundPage() {
  return (
    <div className="shell page-body">
      <div className="empty-state">
        <h3>404 — Nothing here</h3>
        <p>That page does not exist. The work, however, does.</p>
        <Link to="/projects" className="btn btn--primary">Browse selected work <Icon name="arrow-right" size={15} /></Link>
      </div>
    </div>
  )
}

export default function App() {
  const { pathname } = useLocation()

  return (
    <div className="site">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <ScrollToTop />
      <TraceRail />
      <Navbar />
      <main id="main-content" className="site-main" tabIndex={-1}>
        <div className="page-transition" key={pathname}>
          <Suspense fallback={
            <div className="route-loading" role="status" aria-live="polite">
              <span className="route-loading__bar" aria-hidden="true" /> Loading section…
            </div>
          }>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/projects/:id" element={<ProjectDetailPage />} />
            <Route path="/education" element={<EducationPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/sign-in" element={<AuthPage mode="signin" />} />
            <Route path="/sign-up" element={<AuthPage mode="signup" />} />
            <Route path="/forbidden" element={<ForbiddenPage />} />
            <Route path="/admin" element={
              <ProtectedRoute adminOnly><AdminPage /></ProtectedRoute>
            } />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
          </Suspense>
        </div>
      </main>
      <Footer />
      <CommandPalette />
    </div>
  )
}
