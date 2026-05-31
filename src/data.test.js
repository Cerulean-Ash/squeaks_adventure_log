import { describe, it, expect } from 'vitest'
import { ENTRIES, ADVENTURES, THEMES, SLIDES, FIRST_DATE, weeksTogether } from './data'

describe('SLIDES', () => {
  it('is [intro, ...entries, adventures]', () => {
    expect(SLIDES).toHaveLength(ENTRIES.length + 2)
    expect(SLIDES[0]).toEqual({ type: 'intro' })
    expect(SLIDES.at(-1)).toEqual({ type: 'adventures' })
  })

  it('numbers entry slides 1..N in order', () => {
    const entries = SLIDES.filter((s) => s.type === 'entry')
    expect(entries).toHaveLength(ENTRIES.length)
    entries.forEach((s, i) => {
      expect(s.num).toBe(i + 1)
      expect(s.title).toBe(ENTRIES[i].title)
    })
  })
})

describe('THEMES', () => {
  // The CLAUDE.md gotcha: THEMES must stay parallel to SLIDES.
  it('has exactly one theme per slide', () => {
    expect(THEMES).toHaveLength(SLIDES.length)
  })

  it('every theme defines the inline-CSS-var fields', () => {
    for (const t of THEMES) {
      expect(t).toMatchObject({
        bg: expect.any(String),
        color: expect.any(String),
        sub: expect.any(String),
        bar: expect.any(String),
        barFill: expect.any(String),
      })
    }
  })
})

describe('weeksTogether', () => {
  it('counts whole weeks elapsed since FIRST_DATE', () => {
    // 29 Mar 2026 → 31 May 2026 is 63 days = 9 weeks exactly.
    expect(weeksTogether(new Date('2026-05-31T12:00:00'))).toBe(9)
    // Two weeks in.
    expect(weeksTogether(new Date('2026-04-12T12:00:00'))).toBe(2)
  })

  it('floors to whole weeks (partial weeks round down)', () => {
    expect(weeksTogether(new Date('2026-04-10T12:00:00'))).toBe(1) // 12 days
  })

  it('never reports fewer than 1 week, even on day one', () => {
    expect(weeksTogether(new Date(FIRST_DATE + 'T06:00:00'))).toBe(1)
  })
})

describe('ENTRIES', () => {
  it('every entry has icon, date, title, desc', () => {
    for (const e of ENTRIES) {
      expect(e.icon).toBeTruthy()
      expect(e.date).toBeTruthy()
      expect(e.title).toBeTruthy()
      expect(e.desc).toBeTruthy()
    }
  })
})

describe('ADVENTURES', () => {
  it('every adventure has icon, name, hint', () => {
    for (const a of ADVENTURES) {
      expect(a.icon).toBeTruthy()
      expect(a.name).toBeTruthy()
      expect(a.hint).toBeTruthy()
    }
  })

  it('has exactly one custom ("surprise me") option', () => {
    expect(ADVENTURES.filter((a) => a.custom)).toHaveLength(1)
  })

  it('has unique names (used as React keys)', () => {
    const names = ADVENTURES.map((a) => a.name)
    expect(new Set(names).size).toBe(names.length)
  })
})
