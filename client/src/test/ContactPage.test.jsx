import { describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import ContactPage from '../pages/ContactPage.jsx'
import { api } from '../api.js'

vi.mock('../api.js', () => ({
  api: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}))

const renderPage = () =>
  render(
    <MemoryRouter>
      <ContactPage />
    </MemoryRouter>,
  )

const fillRequiredFields = async (user) => {
  await user.type(screen.getByLabelText(/First name/i), '  Ada  ')
  await user.type(screen.getByLabelText(/Last name/i), ' Lovelace ')
  await user.type(screen.getByLabelText(/Email address/i), 'ada@example.com')
  await user.type(screen.getByLabelText(/Contact number/i), ' 416-555-0100 ')
  await user.type(screen.getByLabelText(/Message/i), '  I would like an architecture review.  ')
}

describe('ContactPage form workflow', () => {
  it('trims input, posts the API contract to /api/contacts and renders a personalised success state', async () => {
    api.post.mockResolvedValue({ success: true, data: { _id: 'c1' } })
    const user = userEvent.setup()
    renderPage()

    await fillRequiredFields(user)
    await user.click(screen.getByRole('button', { name: /Send message/i }))

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledTimes(1)
    })
    expect(api.post).toHaveBeenCalledWith('/api/contacts', {
      firstName: 'Ada',
      lastName: 'Lovelace',
      email: 'ada@example.com',
      phone: '416-555-0100',
      message: 'I would like an architecture review.',
    })
    expect(await screen.findByRole('heading', { name: /Thanks,.*Ada/i })).toBeInTheDocument()
  })

  it('resets every field when the visitor chooses to send another message', async () => {
    api.post.mockResolvedValue({ success: true, data: {} })
    const user = userEvent.setup()
    renderPage()

    await fillRequiredFields(user)
    await user.click(screen.getByRole('button', { name: /Send message/i }))
    await user.click(await screen.findByRole('button', { name: /Send another message/i }))

    expect(screen.getByLabelText(/First name/i)).toHaveValue('')
    expect(screen.getByLabelText(/Message/i)).toHaveValue('')
    expect(screen.getByRole('button', { name: /Send message/i })).toBeInTheDocument()
  })

  it('shows the server error and allows a successful retry without losing the form data', async () => {
    api.post
      .mockRejectedValueOnce(new Error('Unable to connect to the server. Please try again later.'))
      .mockResolvedValueOnce({ success: true, data: {} })
    const user = userEvent.setup()
    renderPage()

    await fillRequiredFields(user)
    await user.click(screen.getByRole('button', { name: /Send message/i }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Unable to connect to the server')
    expect(screen.getByLabelText(/First name/i)).toHaveValue('  Ada  ')
    expect(api.post).toHaveBeenCalledTimes(1)

    await user.click(screen.getByRole('button', { name: /Send message/i }))
    expect(await screen.findByRole('heading', { name: /Thanks,.*Ada/i })).toBeInTheDocument()
    expect(api.post).toHaveBeenCalledTimes(2)
  })

  it('disables the submit button while the request is in flight', async () => {
    let resolveRequest
    api.post.mockReturnValue(new Promise((resolve) => { resolveRequest = resolve }))
    const user = userEvent.setup()
    renderPage()

    await fillRequiredFields(user)
    await user.click(screen.getByRole('button', { name: /Send message/i }))

    const button = screen.getByRole('button', { name: /Sending/i })
    expect(button).toBeDisabled()

    resolveRequest({ success: true, data: {} })
    expect(await screen.findByRole('heading', { name: /Thanks,.*Ada/i })).toBeInTheDocument()
  })
})
