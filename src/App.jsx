import { useState, useEffect, useRef, useCallback } from 'react'
import { THEMES, SLIDES } from './data'
import IntroSlide from './components/IntroSlide'
import EntrySlide from './components/EntrySlide'
import AdventuresSlide from './components/AdventuresSlide'
import AdventureOverlay from './components/AdventureOverlay'
import './App.css'

export default function App() {
  const [index,     setIndex]    = useState(0)
  const [prevIndex, setPrevIndex] = useState(null)
  const [dir,       setDir]      = useState('none')
  const [selected,  setSelected] = useState(null)
  const busy       = useRef(false)
  const touchStart = useRef(null)

  const goTo = useCallback((next) => {
    if (busy.current || next < 0 || next >= SLIDES.length) return
    busy.current = true
    setPrevIndex(index)
    setDir(next > index ? 'fwd' : 'bck')
    setIndex(next)
    setTimeout(() => { busy.current = false; setPrevIndex(null) }, 480)
  }, [index])

  const goNext = useCallback(() => goTo(index + 1), [goTo, index])
  const goPrev = useCallback(() => goTo(index - 1), [goTo, index])

  useEffect(() => {
    const fn = (e) => {
      if (selected) return
      if (['ArrowRight', 'ArrowDown', ' '].includes(e.key)) { e.preventDefault(); goNext() }
      if (['ArrowLeft',  'ArrowUp'       ].includes(e.key)) { e.preventDefault(); goPrev() }
    }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [goNext, goPrev, selected])

  useEffect(() => {
    document.body.style.overflow = selected ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [selected])

  function onTouchStart(e) {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
  }
  function onTouchEnd(e) {
    if (!touchStart.current || selected) return
    const dx = e.changedTouches[0].clientX - touchStart.current.x
    const dy = e.changedTouches[0].clientY - touchStart.current.y
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
      dx < 0 ? goNext() : goPrev()
    } else if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 40) {
      dy < 0 ? goNext() : goPrev()
    }
    touchStart.current = null
  }
  function onTap(e) {
    if (selected || e.target.closest('button, a')) return
    e.clientX / window.innerWidth > 0.35 ? goNext() : goPrev()
  }

  const theme = THEMES[index]
  const slide = SLIDES[index]

  return (
    <div className="app" onClick={onTap} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>

      {/* Progress bar */}
      <div className="pbar">
        {SLIDES.map((_, i) => (
          <div key={i} className="pseg" style={{
            background: i <= index ? theme.barFill : theme.bar,
            opacity: i < index ? 0.55 : 1,
          }} />
        ))}
      </div>

      {/* Outgoing slide — stays put while new one slides over it */}
      {prevIndex !== null && (
        <div className="slide" style={{ background: THEMES[prevIndex].bg }} />
      )}

      {/* Incoming slide */}
      <div
        key={index}
        className={`slide slide--${dir}`}
        style={{ background: theme.bg, '--c': theme.color, '--s': theme.sub }}
      >
        {slide.type === 'intro'      && <IntroSlide />}
        {slide.type === 'entry'      && <EntrySlide slide={slide} />}
        {slide.type === 'adventures' && <AdventuresSlide onSelect={setSelected} />}
      </div>

      {/* Desktop nav arrows */}
      {index > 0 && !selected && (
        <button className="nav-arr nav-l" style={{ color: theme.color }}
          onClick={(e) => { e.stopPropagation(); goPrev() }} aria-label="Previous">‹</button>
      )}
      {index < SLIDES.length - 1 && !selected && (
        <button className="nav-arr nav-r" style={{ color: theme.color }}
          onClick={(e) => { e.stopPropagation(); goNext() }} aria-label="Next">›</button>
      )}

      {selected && <AdventureOverlay adventure={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}
