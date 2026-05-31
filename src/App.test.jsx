import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import App from './App'
import { SLIDES, ENTRIES } from './data'

// Navigation is gated by a 480ms `busy` ref, so we drive time manually.
function settle() {
  act(() => { vi.advanceTimersByTime(480) })
}
const press = (key) => fireEvent.keyDown(window, { key })

describe('App navigation', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => {
    vi.runOnlyPendingTimers()
    vi.useRealTimers()
  })

  it('starts on the intro slide', () => {
    render(<App />)
    expect(screen.getByText(/tap to begin/i)).toBeInTheDocument()
  })

  it('renders one progress segment per slide', () => {
    const { container } = render(<App />)
    expect(container.querySelectorAll('.pseg')).toHaveLength(SLIDES.length)
  })

  it('ArrowRight advances to the first entry, ArrowLeft returns', () => {
    render(<App />)

    press('ArrowRight'); settle()
    expect(screen.getByText(`Adventure 1 of ${ENTRIES.length}`)).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: ENTRIES[0].title })).toBeInTheDocument()

    press('ArrowLeft'); settle()
    expect(screen.getByText(/tap to begin/i)).toBeInTheDocument()
  })

  it('cannot go before the first slide', () => {
    render(<App />)
    press('ArrowLeft'); settle()
    expect(screen.getByText(/tap to begin/i)).toBeInTheDocument()
  })

  it('ignores a second move while mid-transition (busy lock)', () => {
    render(<App />)
    press('ArrowRight') // starts transition, busy = true
    press('ArrowRight') // should be ignored
    settle()
    expect(screen.getByText(`Adventure 1 of ${ENTRIES.length}`)).toBeInTheDocument()
  })

  it('walks all the way to the adventures slide and stops at the end', () => {
    render(<App />)
    for (let i = 0; i < SLIDES.length - 1; i++) {
      press('ArrowRight'); settle()
    }
    expect(screen.getByRole('heading', { name: /what's next/i })).toBeInTheDocument()

    press('ArrowRight'); settle() // past the end → no-op
    expect(screen.getByRole('heading', { name: /what's next/i })).toBeInTheDocument()
  })

  it('a tap on the right of the screen advances', () => {
    const { container } = render(<App />)
    const app = container.querySelector('.app')
    // jsdom innerWidth is 1024; >0.35 means clientX > ~358.
    fireEvent.click(app, { clientX: 900 }); settle()
    expect(screen.getByText(`Adventure 1 of ${ENTRIES.length}`)).toBeInTheDocument()
  })

  it('the intro "jump to last adventure" button jumps to the final entry', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: /jump to last adventure/i }))
    settle()
    // Last entry is the newest adventure (the slide before the picker).
    expect(screen.getByText(`Adventure ${ENTRIES.length} of ${ENTRIES.length}`)).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: ENTRIES.at(-1).title })).toBeInTheDocument()
  })

  it('a left-swipe advances to the next slide', () => {
    const { container } = render(<App />)
    const app = container.querySelector('.app')
    fireEvent.touchStart(app, { touches: [{ clientX: 240, clientY: 100 }] })
    fireEvent.touchEnd(app, { changedTouches: [{ clientX: 80, clientY: 100 }] })
    settle()
    expect(screen.getByText(`Adventure 1 of ${ENTRIES.length}`)).toBeInTheDocument()
  })
})
