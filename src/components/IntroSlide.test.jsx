import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import IntroSlide from './IntroSlide'

describe('IntroSlide', () => {
  it('renders the title, subtitle and tap prompt', () => {
    render(<IntroSlide />)
    expect(screen.getByRole('heading', { name: /adventure log/i })).toBeInTheDocument()
    // Week count is derived from the real clock, so match the shape, not a fixed number.
    expect(screen.getByText(/\d+ weeks · \d+ adventures · 1 ficus/i)).toBeInTheDocument()
    expect(screen.getByText(/tap to begin/i)).toBeInTheDocument()
  })

  it('shows the skip button only when onSkip is provided, and calls it', async () => {
    const { rerender } = render(<IntroSlide />)
    expect(screen.queryByRole('button', { name: /jump to last adventure/i })).not.toBeInTheDocument()

    const onSkip = vi.fn()
    rerender(<IntroSlide onSkip={onSkip} />)
    await userEvent.click(screen.getByRole('button', { name: /jump to last adventure/i }))
    expect(onSkip).toHaveBeenCalledTimes(1)
  })
})
