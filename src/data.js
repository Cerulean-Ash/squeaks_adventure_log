// Where it all began. The intro's "weeks" counter is derived from this,
// so it keeps climbing on its own.
export const FIRST_DATE = '2026-03-29'

export function weeksTogether(now = new Date()) {
  const start = new Date(FIRST_DATE + 'T00:00:00')
  const weeks = Math.floor((now - start) / 604_800_000) // ms in a week
  return Math.max(1, weeks)
}

export const ENTRIES = [
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
    desc: "Julia looked incredible. Lots of talking, lots of laughing, then World's End bar for metal and fun. Rode the tube back together and Ashley almost missed the stop because he was too enamoured with Julia. Oops.",
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
  {
    icon: '👑',
    date: '29-30 May',
    title: 'The Official Upgrade & Awesome Bike HIIT',
    desc: `Friday roast chicken and "questionable" lemon bars. Saturday saw a massive cycle through Richmond Park to Kingston. Conquered brutal hills on "Awesome Bike" (bent chain = involuntary HIIT workout). Most importantly: We're officially a couple. Upgraded to v1.0 ❤️`,
  },
]

export const ADVENTURES = [
  { icon: '🌊', name: 'Seven Sisters Hike',       hint: "The South Coast awaits. Let's load up \"our\" backpack." },
  { icon: '🪓', name: 'Axe Throwing',              hint: 'Fancy outfits encouraged. Safety required.' },
  { icon: '🛍️', name: 'Cotswolds Outdoor Shop',    hint: 'The rock ramp needs conquering.' },
  { icon: '🐶', name: 'Puppy Yoga / Therapy',        hint: 'Downward dog. Actual dogs. Obviously.' },
  { icon: '🌙', name: 'Cuddle Night & Market Day', hint: 'Maximum chill. Minimum plans.' },
  { icon: '🍹', name: 'Alchemist Cocktail Night',  hint: 'Fancy drinks. Fancy outfits. Obviously.' },
  { icon: '😂', name: 'Comedy Night',               hint: 'Laughing until it hurts. Guaranteed.' },
  { icon: '✨', name: 'Surprise me...',             hint: "Your idea. Ashley's in.", custom: true },
]

// One theme per slide: [intro, ...8 entries, adventures]
export const THEMES = [
  { bg: 'linear-gradient(160deg,#fdf0e0,#e8c47a)', color: '#5c3d2e', sub: '#9a7050', bar: 'rgba(92,61,46,.3)',    barFill: '#c07850' },
  { bg: 'linear-gradient(160deg,#f5a070,#c04820)', color: '#fff',    sub: 'rgba(255,255,255,.72)', bar: 'rgba(255,255,255,.28)', barFill: '#fff' },
  { bg: 'linear-gradient(160deg,#78c878,#1a5e20)', color: '#fff',    sub: 'rgba(255,255,255,.75)', bar: 'rgba(255,255,255,.28)', barFill: '#fff' },
  { bg: 'linear-gradient(160deg,#5858a8,#10102e)', color: '#fff',    sub: 'rgba(200,200,255,.8)',  bar: 'rgba(255,255,255,.25)', barFill: '#a0a0ff' },
  { bg: 'linear-gradient(160deg,#2c1818,#080808)', color: '#fff',    sub: '#e89060',               bar: 'rgba(255,255,255,.18)', barFill: '#e89060' },
  { bg: 'linear-gradient(160deg,#f09abe,#ae386a)', color: '#fff',    sub: 'rgba(255,255,255,.8)',  bar: 'rgba(255,255,255,.28)', barFill: '#fff' },
  { bg: 'linear-gradient(160deg,#84c8f0,#1658b0)', color: '#fff',    sub: 'rgba(255,255,255,.75)', bar: 'rgba(255,255,255,.28)', barFill: '#fff' },
  { bg: 'linear-gradient(160deg,#345630,#080e08)', color: '#fff',    sub: '#80d870',               bar: 'rgba(255,255,255,.18)', barFill: '#80d870' },
  { bg: 'linear-gradient(160deg,#f0c060,#8e2d5a)', color: '#fff',    sub: '#f5dca0',               bar: 'rgba(255,255,255,.22)', barFill: '#f5dca0' },
  { bg: 'linear-gradient(160deg,#fdf0e0,#e8c47a)', color: '#5c3d2e', sub: '#9a7050', bar: 'rgba(92,61,46,.3)',    barFill: '#c07850' },
]

export const SLIDES = [
  { type: 'intro' },
  ...ENTRIES.map((e, i) => ({ type: 'entry', ...e, num: i + 1 })),
  { type: 'adventures' },
]
