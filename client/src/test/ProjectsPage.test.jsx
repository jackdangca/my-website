import { describe, expect, it, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import ProjectsPage from '../pages/ProjectsPage.jsx'
import { projects as curatedProjects } from '../data/portfolio.js'

const mockUseProjects = vi.fn()
vi.mock('../hooks/usePortfolioData.js', () => ({
  useProjects: () => mockUseProjects(),
}))

const cards = (container) => container.querySelectorAll('.project-card')
const renderPage = () =>
  render(
    <MemoryRouter>
      <ProjectsPage />
    </MemoryRouter>,
  )

describe('ProjectsPage discipline filter', () => {
  it('shows all curated case studies initially and narrows to the selected discipline', async () => {
    mockUseProjects.mockReturnValue({ projects: curatedProjects, status: 'ready' })
    const user = userEvent.setup()
    const { container } = renderPage()

    expect(cards(container)).toHaveLength(curatedProjects.length)
    expect(screen.getByRole('button', { name: 'All work' })).toHaveAttribute('aria-pressed', 'true')

    await user.click(screen.getByRole('button', { name: 'AI & Agents' }))

    const expected = curatedProjects.filter((project) => project.visual === 'agent')
    expect(cards(container)).toHaveLength(expected.length)
    expected.forEach((project) => {
      expect(screen.getByRole('link', { name: project.title })).toBeInTheDocument()
    })
    expect(screen.getByRole('button', { name: 'AI & Agents' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: 'All work' })).toHaveAttribute('aria-pressed', 'false')
  })

  it('renders an empty state for a discipline with no records and restores all work', async () => {
    const onlyAgent = curatedProjects.filter((project) => project.visual === 'agent')
    mockUseProjects.mockReturnValue({ projects: onlyAgent, status: 'ready' })
    const user = userEvent.setup()
    const { container } = renderPage()

    await user.click(screen.getByRole('button', { name: 'Reliability' }))

    expect(cards(container)).toHaveLength(0)
    const emptyState = screen.getByText(/No case studies in this category yet/i).closest('.empty-state')
    expect(emptyState).toBeInTheDocument()

    await user.click(within(emptyState).getByRole('button', { name: /Show all work/i }))
    expect(cards(container)).toHaveLength(onlyAgent.length)
    expect(screen.getByRole('button', { name: 'All work' })).toHaveAttribute('aria-pressed', 'true')
  })

  it('keeps the curated case studies visible when the API is unreachable', () => {
    mockUseProjects.mockReturnValue({ projects: curatedProjects, status: 'offline' })
    const { container } = renderPage()

    expect(cards(container)).toHaveLength(curatedProjects.length)
    expect(screen.getByText(/Showing the curated case studies/i)).toBeInTheDocument()
  })
})
