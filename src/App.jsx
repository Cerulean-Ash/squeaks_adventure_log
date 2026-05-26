import { useState, useEffect, useRef, useCallback } from 'react'
import confetti from 'canvas-confetti'
import './App.css'

const ENTRIES = [
  {
    icon: '🍣',
    date: '29 March',
    title: 'The Great Salmon Rose Hunt',
    desc: 'First date. Sushi mission. The salmon roses were not on the menu... so we ordered an enormous custom salmon rose.',
  },
  {
    icon: '🚲',
    date: '18 April',
    title: 'The Great Bike Expedition',
    desc: 'A stolen bike. A train. A bus. A bike inspection. Then cycled and skated back to the station like absolute legends.',
  },
  {
    icon: '🎬',
    date: '25 April',
    title: 'Thames Walk + Akira',
    desc: 'A long walk along the Thames, followed by Akira at the cinema. The walk was brilliant. The movie was... a lot. Neo-Tokyo did not explain itself. 10/10 would be confused again.',
  },
  {
    icon: '🖤',
    date: '1 May',
    title: "Camden Munch & World's End",
    desc: "Julia looked incredible. Lots of talking, lots of laughing, then World's End bar for metal and chaos. Rode the tube back together and Ashley almost missed the stop because he was too enamoured by Julia. Oops.",
  },
  {
    icon: '🌸',
    date: '9 May',
    title: 'First sleep over & Finneas',
    desc: "Julia stayed over at Ashley's after a day of walking and being stuck on a train. They cooked, watched Hamnet, and ate ice cream. The next morning: Columbia Road Flower Market. Finneas the Ficus joined the family. Ashley walked Julia all the way to Waterloo. It was a long walk. Totally worth it.",
  },
  {
    icon: '⛸️',
    date: '16 May',
    title: 'Ice Skating, Cheese & Boot Shopping',
    desc: "Ashley stayed over at Squeaks's. Ice skating with friends. Cheese festival (obviously). Then a very serious hiking boot shopping expedition. Didn't buy boots, but had fun anyway.",
  },
  {
    icon: '🏔️',
    date: '23 May',
    title: 'Wales — Team Hobble Goes Big',
    desc: 'Long drive. Excellent snacks. Two epic hikes. Snowdon and Tryfan conquered. A cold lake swim that was somehow a great idea. Biltong consumed at altitude. Drove home sunburnt and very happy. Byebye 😘😘',
  },
]

const ADVENTURES = [
  { icon: '🌊', name: 'Seven Sisters Hike',       hint: 'The South Coast awaits. Lets load up "our" backpack.' },
  { icon: '🪓', name: 'Axe Throwing',              hint: 'Fancy outfits encouraged. Safety required.' },
  { icon: '🛍️', name: 'Cotswolds Outdoor Shop',    hint: 'The rock ramp needs conquering.' },
  { icon: '🛼', name: 'Ice Skating at Queens',     hint: 'Ashley will teach you to skate backwards. Probably.' },
  { icon: '🌙', name: 'Cuddle Night & Market Day', hint: 'Maximum chill. Minimum plans.' },
  { icon: '🍹', name: 'Alchemist Cocktail Night',  hint: 'Fancy drinks. Fancy outfits. Obviously.' },
]

// One theme per slide: [intro, ...7 entries, adventures]
const THEMES = [
  { bg: 'linear-gradient(160deg,#fdf0e0,#e8c47a)', color: '#5c3d2e', sub: '#9a7050', bar: 'rgba(92,61,46,.3)',   barFill: '#c07850' },
  { bg: 'linear-gradient(160deg,#f5a070,#c04820)', color: '#fff',    sub: 'rgba(255,255,255,.72)', bar: 'rgba(255,255,255,.28)', barFill: '#fff' },
  { bg: 'linear-gradient(160deg,#78c878,#1a5e20)', color: '#fff',    sub: 'rgba(255,255,255,.75)', bar: 'rgba(255,255,255,.28)', barFill: '#fff' },
  { bg: 'linear-gradient(160deg,#5858a8,#10102e)', color: '#fff',    sub: 'rgba(200,200,255,.8)',  bar: 'rgba(255,255,255,.25)', barFill: '#a0a0ff' },
  { bg: 'linear-gradient(160deg,#2c1818,#080808)', color: '#fff',    sub: '#e89060',              bar: 'rgba(255,255,255,.18)', barFill: '#e89060' },
  { bg: 'linear-gradient(160deg,#f09abe,#ae386a)', color: '#fff',    sub: 'rgba(255,255,255,.8)', bar: 'rgba(255,255,255,.28)', barFill: '#fff' },
  { bg: 'linear-gradient(160deg,#84c8f0,#1658b0)', color: '#fff',    sub: 'rgba(255,255,255,.75)', bar: 'rgba(255,255,255,.28)', barFill: '#fff' },
  { bg: 'linear-gradient(160deg,#345630,#080e08)', color: '#fff',    sub: '#80d870',              bar: 'rgba(255,255,255,.18)', barFill: '#80d870' },
  { bg: 'linear-gradient(160deg,#fdf0e0,#e8c47a)', color: '#5c3d2e', sub: '#9a7050', bar: 'rgba(92,61,46,.3)',   barFill: '#c07850' },
]

const SLIDES = [
  { type: 'intro' },
  ...ENTRIES.map((e, i) => ({ type: 'entry', ...e, num: i + 1 })),
  { type: 'adventures' },
]

function fireConfetti() {
  const end = Date.now() + 2200
  const colors = ['#c07850', '#7a9e7e', '#f5c28a', '#b5cdb7', '#e8a87c']
  ;(function frame() {
    confetti({ particleCount: 5, angle: 60,  spread: 55, origin: { x: 0 }, colors })
    confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 }, colors })
    if (Date.now() < end) requestAnimationFrame(frame)
  })()
}

function notifyAshley(adventure) {
  fetch('https://ntfy.sh/adv-qma4fm8ippx0', {
    method: 'POST',
    headers: {
      'Title': 'Squeaks has picked an adventure!',
      'Tags': 'tada,heart',
      'Priority': 'high',
    },
    body: `${adventure.icon} ${adventure.name} — she said yes!`,
  }).catch(() => {})
}

function AdventureOverlay({ adventure, onClose }) {
  const [answer, setAnswer] = useState(null)

  function handleYes() {
    setAnswer('yes')
    fireConfetti()
    notifyAshley(adventure)
  }

  return (
    <div className="overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div className="overlay-box" role="dialog" aria-modal="true">
        <div className="ov-icon">{adventure.icon}</div>
        <p className="ov-q">Julia — want to do <strong>{adventure.name}</strong> next?</p>
        {!answer && (
          <div className="ov-btns">
            <button className="btn btn-yes" onClick={handleYes}>Yes! 🎉</button>
            <button className="btn btn-no"  onClick={() => setAnswer('maybe')}>Let me think...</button>
          </div>
        )}
        {answer === 'yes'   && <p className="ov-result">Excellent choice. Ashley approves. Byebye 😘😘</p>}
        {answer === 'maybe' && <p className="ov-result">Squeaks. The answer is yes. 😏</p>}
        <button className="ov-close" onClick={onClose}>← back</button>
      </div>
    </div>
  )
}

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

function IntroSlide() {
  return (
    <div className="sbody sbody--center">
      <span className="s-leaf">🌿</span>
      <h1 className="s-title s-title--xl">The Ashley &amp; Julia<br />Adventure Log</h1>
      <p className="s-sub">8 weeks · 7 adventures · 1 ficus</p>
      <p className="s-tap">Tap to begin ›</p>
    </div>
  )
}

function EntrySlide({ slide }) {
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

function AdventuresSlide({ onSelect }) {
  return (
    <div className="sbody sbody--adv" onClick={(e) => e.stopPropagation()}>
      <h2 className="s-title s-title--adv">What's next,<br />Squeaks? 🌿</h2>
      <div className="adv-grid">
        {ADVENTURES.map((adv) => (
          <button key={adv.name} className="adv-pill" onClick={() => onSelect(adv)}>
            <span className="adv-pill-icon">{adv.icon}</span>
            <span className="adv-pill-name">{adv.name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
