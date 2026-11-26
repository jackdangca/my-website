import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import ProtectedRoute from '../components/ProtectedRoute.jsx'
import { useAuth } from '../AuthContext.jsx'

vi.mock('../AuthContext.jsx', () => ({ useAuth: vi.fn() }))

const renderGuard = ({ adminOnly = true } = {}) =>
  render(
    <MemoryRouter initialEntries={['/admin']}>
      <Routes>
        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly={adminOnly}>
              <div>Admin dashboard content</div>
            </ProtectedRoute>
          }
        />
        <Route path="/sign-in" element={<div>Sign in page</div>} />
        <Route path="/forbidden" element={<div>Forbidden page</div>} />
      </Routes>
    </MemoryRouter>,
  )

describe('ProtectedRoute authorisation rules', () => {
  it('shows a status message while the session is still being verified', () => {
    useAuth.mockReturnValue({ user: null, loading: true })
    renderGuard()

    expect(screen.getByRole('status')).toHaveTextContent('Checking your sign-in')
    expect(screen.queryByText('Admin dashboard content')).not.toBeInTheDocument()
  })

  it('redirects an anonymous visitor to the sign-in page', () => {
    useAuth.mockReturnValue({ user: null, loading: false })
    renderGuard()

    expect(screen.getByText('Sign in page')).toBeInTheDocument()
    expect(screen.queryByText('Admin dashboard content')).not.toBeInTheDocument()
  })

  it('blocks a signed-in regular user from the admin panel', () => {
    useAuth.mockReturnValue({ user: { role: 'user', name: 'Ada' }, loading: false })
    renderGuard()

    expect(screen.getByText('Forbidden page')).toBeInTheDocument()
    expect(screen.queryByText('Admin dashboard content')).not.toBeInTheDocument()
  })

  it('renders protected content for an admin', () => {
    useAuth.mockReturnValue({ user: { role: 'admin', name: 'Ada' }, loading: false })
    renderGuard()

    expect(screen.getByText('Admin dashboard content')).toBeInTheDocument()
    expect(screen.queryByText('Forbidden page')).not.toBeInTheDocument()
  })

  it('allows a regular user through when the route is not admin-only', () => {
    useAuth.mockReturnValue({ user: { role: 'user', name: 'Ada' }, loading: false })
    renderGuard({ adminOnly: false })

    expect(screen.getByText('Admin dashboard content')).toBeInTheDocument()
  })
})
