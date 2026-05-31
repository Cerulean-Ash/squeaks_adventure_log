import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AdventureOverlay from './AdventureOverlay'

// Stub the side-effecting utils — we assert on calls, not real confetti/fetch.
const { fireConfetti, notifyAshley } = vi.hoisted(() => ({
  fireConfetti: vi.fn(),
  notifyAshley: vi.fn(),
}))
vi.mock('../utils', () => ({ fireConfetti, notifyAshley }))

const preset = { icon: '🪓', name: 'Axe Throwing', hint: 'Fancy outfits.' }
const customAdv = { icon: '✨', name: 'Surprise me...', hint: 'Your idea.', custom: true }

describe('AdventureOverlay', () => {
  beforeEach(() => vi.clearAllMocks())

  it('preset flow: question → date → done fires the notification', async () => {
    const user = userEvent.setup()
    render(<AdventureOverlay adventure={preset} onClose={vi.fn()} />)

    expect(screen.getByText(/want to do/i)).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /yes!/i }))

    // No custom step for a preset — straight to the date step.
    expect(screen.getByText(/when's good/i)).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /let's go/i }))

    expect(fireConfetti).toHaveBeenCalledTimes(1)
    expect(notifyAshley).toHaveBeenCalledTimes(1)
    const [adv, date] = notifyAshley.mock.calls[0]
    expect(adv.name).toBe('Axe Throwing')
    expect(date).toBeNull() // no date picked
    expect(screen.getByText(/Ashley has been notified/i)).toBeInTheDocument()
  })

  it('custom flow: inserts the free-text step and uses the typed name', async () => {
    const user = userEvent.setup()
    render(<AdventureOverlay adventure={customAdv} onClose={vi.fn()} />)

    await user.click(screen.getByRole('button', { name: /yes!/i }))

    // Custom step appears; Next is disabled until text is entered.
    const next = screen.getByRole('button', { name: /next/i })
    expect(next).toBeDisabled()
    await user.type(screen.getByPlaceholderText(/pottery/i), 'Pottery class')
    expect(next).toBeEnabled()
    await user.click(next)

    await user.click(screen.getByRole('button', { name: /let's go/i }))
    expect(notifyAshley.mock.calls[0][0].name).toBe('Pottery class')
  })

  it('"Let me think..." shows the cheeky maybe message and never notifies', async () => {
    const user = userEvent.setup()
    render(<AdventureOverlay adventure={preset} onClose={vi.fn()} />)

    await user.click(screen.getByRole('button', { name: /let me think/i }))

    expect(screen.getByText(/the answer is yes/i)).toBeInTheDocument()
    expect(notifyAshley).not.toHaveBeenCalled()
  })

  it('calls onClose from the back button', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(<AdventureOverlay adventure={preset} onClose={onClose} />)

    await user.click(screen.getByRole('button', { name: /back/i }))
    expect(onClose).toHaveBeenCalledTimes(1)
  })
})
