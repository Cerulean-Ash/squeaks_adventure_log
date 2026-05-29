import { useMemo } from 'react'
import { ADVENTURES } from '../data'

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function AdventuresSlide({ onSelect }) {
  const adventures = useMemo(() => shuffle(ADVENTURES), [])

  return (
    <div className="sbody sbody--adv" onClick={(e) => e.stopPropagation()}>
      <h2 className="s-title s-title--adv">What's next,<br />Squeaks? 🌿</h2>
      <div className="adv-grid">
        {adventures.map((adv) => (
          <button key={adv.name} className="adv-pill" onClick={() => onSelect(adv)}>
            <span className="adv-pill-icon">{adv.icon}</span>
            <span className="adv-pill-name">{adv.name}</span>
            <span className="adv-pill-hint">{adv.hint}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
