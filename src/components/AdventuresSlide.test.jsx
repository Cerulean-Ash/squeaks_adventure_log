import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AdventuresSlide from './AdventuresSlide'
import { ADVENTURES } from '../data'

describe('AdventuresSlide', () => {
  it('renders every adventure as a button (shuffled, so order ignored)', () => {
    render(<AdventuresSlide onSelect={vi.fn()} />)
    for (const a of ADVENTURES) {
      expect(screen.getByRole('button', { name: new RegExp(a.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i') }))
        .toBeInTheDocument()
    }
  })

  it('calls onSelect with the chosen adventure', async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    render(<AdventuresSlide onSelect={onSelect} />)

    await user.click(screen.getByRole('button', { name: /axe throwing/i }))

    expect(onSelect).toHaveBeenCalledTimes(1)
    expect(onSelect.mock.calls[0][0].name).toBe('Axe Throwing')
  })
})
