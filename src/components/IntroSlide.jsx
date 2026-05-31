import { ENTRIES, weeksTogether } from '../data'

export default function IntroSlide({ onSkip }) {
  return (
    <>
      <div className="sbody sbody--center">
        <span className="s-leaf">🌿</span>
        <h1 className="s-title s-title--xl">The Ashley &amp; Julia<br />Adventure Log</h1>
        <p className="s-sub">{weeksTogether()} weeks · {ENTRIES.length} adventures · 1 ficus</p>
        <p className="s-tap">Tap to begin ›</p>
      </div>
      {onSkip && (
        <button className="s-skip" onClick={(e) => { e.stopPropagation(); onSkip() }}>
          Jump to last adventure ›
        </button>
      )}
    </>
  )
}
