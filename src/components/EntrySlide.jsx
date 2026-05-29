import { ENTRIES } from '../data'

export default function EntrySlide({ slide }) {
  return (
    <div className="sbody sbody--center">
      <p className="s-num">Adventure {slide.num} of {ENTRIES.length}</p>
      <div className="s-emoji">{slide.icon}</div>
      <p className="s-date">{slide.date}</p>
      <h2 className="s-title">{slide.title}</h2>
      <p className="s-desc">{slide.desc}</p>
    </div>
  )
}
