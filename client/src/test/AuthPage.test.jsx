import { describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import AuthPage from '../pages/AuthPage.jsx'
import { useAuth } from '../AuthContext.jsx'

const navigate = vi.fn()
const routerState = { from: null }
const signIn = vi.fn()
const signUp = vi.fn()

vi.mock('../AuthContext.jsx', () => ({ useAuth: vi.fn() }))

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => navigate,
    useLocation: () => ({ state: routerState.from ? { from: { pathname: routerState.from } } : null }),
  }
})

const renderPage = (mode = 'signin') =>
  render(
    <MemoryRouter>
      <AuthPage mode={mode} />
    </MemoryRouter>,
  )

const enterCredentials = async (user, { name } = {}) => {
  if (name) await user.type(screen.getByLabelText(/Name/i), name)
  await user.type(screen.getByLabelText(/Email address/i), 'ada@example.com')
  await user.type(screen.getByLabelText(/Password/i), 'correct-horse')
}

describe('AuthPage sign-in / sign-up behaviour', () => {
  it('sends exactly email and password, then routes a regular user to /projects', async () => {
    useAuth.mockReturnValue({ signIn, signUp })
    signIn.mockResolvedValue({ role: 'user', name: 'Ada' })
    routerState.from = null
    const user = userEvent.setup()
    renderPage('signin')

    await enterCredentials(user)
    await user.click(screen.getByRole('button', { name: /Sign in/i }))

    await waitFor(() => expect(signIn).toHaveBeenCalledWith({
      email: 'ada@example.com',
      password: 'correct-horse',
    }))
    expect(signUp).not.toHaveBeenCalled()
    expect(navigate).toHaveBeenCalledWith('/projects', { replace: true })
  })

  it('routes an admin to the admin panel when no return path was saved', async () => {
    useAuth.mockReturnValue({ signIn, signUp })
    signIn.mockResolvedValue({ role: 'admin', name: 'Ada' })
    routerState.from = null
    const user = userEvent.setup()
    renderPage('signin')

    await enterCredentials(user)
    await user.click(screen.getByRole('button', { name: /Sign in/i }))

    await waitFor(() => expect(navigate).toHaveBeenCalledWith('/admin', { replace: true }))
  })

  it('returns an admin to the page that originally required authentication', async () => {
    useAuth.mockReturnValue({ signIn, signUp })
    signIn.mockResolvedValue({ role: 'admin', name: 'Ada' })
    routerState.from = '/contact'
    const user = userEvent.setup()
    renderPage('signin')

    await enterCredentials(user)
    await user.click(screen.getByRole('button', { name: /Sign in/i }))

    await waitFor(() => expect(navigate).toHaveBeenCalledWith('/contact', { replace: true }))
  })

  it('never grants /admin to a regular user that was redirected there', async () => {
    useAuth.mockReturnValue({ signIn, signUp })
    signIn.mockResolvedValue({ role: 'user', name: 'Ada' })
    routerState.from = '/admin'
    const user = userEvent.setup()
    renderPage('signin')

    await enterCredentials(user)
    await user.click(screen.getByRole('button', { name: /Sign in/i }))

    await waitFor(() => expect(navigate).toHaveBeenCalledWith('/projects', { replace: true }))
  })

  it('surfaces an authentication failure and stays on the form', async () => {
    useAuth.mockReturnValue({ signIn, signUp })
    signIn.mockRejectedValue(new Error('Invalid email or password'))
    routerState.from = null
    const user = userEvent.setup()
    renderPage('signin')

    await enterCredentials(user)
    await user.click(screen.getByRole('button', { name: /Sign in/i }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Invalid email or password')
    expect(navigate).not.toHaveBeenCalled()
    expect(screen.getByRole('button', { name: /Sign in/i })).toBeEnabled()
  })

  it('registers a new account through signUp with name, email and password', async () => {
    useAuth.mockReturnValue({ signIn, signUp })
    signUp.mockResolvedValue({ role: 'user', name: 'Ada Lovelace' })
    routerState.from = null
    const user = userEvent.setup()
    renderPage('signup')

    await enterCredentials(user, { name: 'Ada Lovelace' })
    await user.click(screen.getByRole('button', { name: /Create account/i }))

    await waitFor(() => expect(signUp).toHaveBeenCalledWith({
      name: 'Ada Lovelace',
      email: 'ada@example.com',
      password: 'correct-horse',
    }))
    expect(signIn).not.toHaveBeenCalled()
    expect(navigate).toHaveBeenCalledWith('/projects', { replace: true })
  })
})
