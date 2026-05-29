import confetti from 'canvas-confetti'

export function fireConfetti() {
  const end = Date.now() + 2200
  const colors = ['#c07850', '#7a9e7e', '#f5c28a', '#b5cdb7', '#e8a87c']
  ;(function frame() {
    confetti({ particleCount: 5, angle: 60,  spread: 55, origin: { x: 0 }, colors })
    confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 }, colors })
    if (Date.now() < end) requestAnimationFrame(frame)
  })()
}

// ntfy topic lives in .env.local (VITE_NTFY_TOPIC), kept out of git.
// Note: it is still inlined into the public build, so this is not a secret —
// it just keeps the topic out of the repo source. See .env.example.
const NTFY_TOPIC = import.meta.env.VITE_NTFY_TOPIC

export function notifyAshley(adventure, date) {
  if (!NTFY_TOPIC) return
  const dateStr = date
    ? ` — ${new Date(date + 'T12:00:00').toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}`
    : ''
  fetch(`https://ntfy.sh/${NTFY_TOPIC}`, {
    method: 'POST',
    headers: {
      'Title': 'Squeaks has picked an adventure!',
      'Tags': 'tada,heart',
      'Priority': 'high',
    },
    body: `${adventure.icon} ${adventure.name} — she said yes!${dateStr}`,
  }).catch(() => {})
}
