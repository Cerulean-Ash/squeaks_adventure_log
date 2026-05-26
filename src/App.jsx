import { useState, useEffect, useRef } from 'react'
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
    desc: "A stolen bike. A train. A bus. A bike inspection. Then cycled and skated back to the station like absolute legends.",
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

function useIntersection(ref) {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold: 0.15 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [ref])
  return visible
}

function TimelineEntry({ entry, index }) {
  const ref = useRef(null)
  const visible = useIntersection(ref)
  return (
    <div
      ref={ref}
      className={`entry${visible ? ' visible' : ''}`}
      style={{ transitionDelay: `${index * 60}ms` }}
    >
      <div className="entry-dot" />
      <div className="entry-icon" aria-hidden="true">{entry.icon}</div>
      <div className="entry-body">
        <div className="entry-date">{entry.date}</div>
        <h3 className="entry-title">{entry.title}</h3>
        <p className="entry-desc">{entry.desc}</p>
      </div>
    </div>
  )
}

function fireConfetti() {
  const end = Date.now() + 2200
  const colors = ['#c07850', '#7a9e7e', '#f5c28a', '#b5cdb7', '#e8a87c']
  ;(function frame() {
    confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 }, colors })
    confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 }, colors })
    if (Date.now() < end) requestAnimationFrame(frame)
  })()
}

function AdventureOverlay({ adventure, onClose }) {
  const [answer, setAnswer] = useState(null) // null | 'yes' | 'maybe'

  function handleYes() {
    setAnswer('yes')
    fireConfetti()
  }
  function handleMaybe() {
    setAnswer('maybe')
  }

  return (
    <div className="overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div className="overlay-box" role="dialog" aria-modal="true">
        <div className="overlay-icon">{adventure.icon}</div>
        <p className="overlay-question">
          Julia — want to do <strong>{adventure.name}</strong> next?
        </p>

        {!answer && (
          <div className="overlay-btns">
            <button className="btn btn-yes" onClick={handleYes}>Yes! 🎉</button>
            <button className="btn btn-no"  onClick={handleMaybe}>Let me think...</button>
          </div>
        )}

        {answer === 'yes' && (
          <p className="overlay-result">
            Excellent choice. Ashley approves. Byebye 😘😘
          </p>
        )}
        {answer === 'maybe' && (
          <p className="overlay-result">
            Squeaks. The answer is yes. 😏
          </p>
        )}

        <button className="overlay-close" onClick={onClose}>← back to adventures</button>
      </div>
    </div>
  )
}

export default function App() {
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    if (selected) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [selected])

  return (
    <>
      {/* ── Header ── */}
      <header className="header">
        <span className="header-leaf" aria-hidden="true">🌿</span>
        <h1>The Ashley &amp; Julia Adventure Log</h1>
        <p className="header-sub">8 weeks. 7 adventures. 1 ficus.</p>
      </header>

      {/* ── Timeline ── */}
      <main>
        <p className="section-title">The Story So Far</p>
        <div className="timeline" aria-label="Adventure timeline">
          {ENTRIES.map((entry, i) => (
            <TimelineEntry key={entry.date} entry={entry} index={i} />
          ))}
        </div>

        {/* ── Next adventure ── */}
        <p className="section-title">Ready for the next adventure, Squeaks?</p>
        <div className="adventures" role="list">
          {ADVENTURES.map((adv) => (
            <button
              key={adv.name}
              className="adv-card"
              role="listitem"
              onClick={() => setSelected(adv)}
            >
              <span className="adv-icon" aria-hidden="true">{adv.icon}</span>
              <span>
                <div className="adv-name">{adv.name}</div>
                <div className="adv-hint">{adv.hint}</div>
              </span>
            </button>
          ))}
        </div>
      </main>

      <footer>Made with a lot of affection ♡</footer>

      {selected && (
        <AdventureOverlay adventure={selected} onClose={() => setSelected(null)} />
      )}
    </>
  )
}
