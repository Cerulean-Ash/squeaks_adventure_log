import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import EntrySlide from './EntrySlide'
import { ENTRIES } from '../data'

describe('EntrySlide', () => {
  const slide = { type: 'entry', ...ENTRIES[0], num: 1 }

  it('renders the counter, icon, date, title and description', () => {
    render(<EntrySlide slide={slide} />)
    expect(screen.getByText(`Adventure 1 of ${ENTRIES.length}`)).toBeInTheDocument()
    expect(screen.getByText(slide.icon)).toBeInTheDocument()
    expect(screen.getByText(slide.date)).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: slide.title })).toBeInTheDocument()
    expect(screen.getByText(slide.desc)).toBeInTheDocument()
  })

  it('reflects whichever slide it is handed', () => {
    const last = { type: 'entry', ...ENTRIES.at(-1), num: ENTRIES.length }
    render(<EntrySlide slide={last} />)
    expect(screen.getByText(`Adventure ${ENTRIES.length} of ${ENTRIES.length}`)).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: last.title })).toBeInTheDocument()
  })
})
