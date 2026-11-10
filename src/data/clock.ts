/* The demo's clock and formatting helpers.
   Today is Tuesday 10 November 2026, 08:14 in Chicago (CST, UTC−6).
   Maya is getting dressed for work on a wet morning: 41°F, light rain,
   wind 14 mph. The newsletter's current edition is the week of 8 Nov. */

export const CLOCK = {
  todayIso: '2026-11-10',
  date: 'Tue 10 Nov 2026',
  dateUS: 'Tue, Nov 10, 2026',
  time: '08:14',
  tz: 'Chicago · CST',
  nowMin: 8 * 60 + 14,
}

export const WEATHER = {
  city: 'Chicago, IL',
  tempF: 41,
  tempC: 5,
  feelsF: 35,
  summary: 'Light rain',
  rainPct: 70,
  windMph: 14,
  high: 46,
  low: 37,
  icon: 'rain' as const,
}

export type Currency = 'USD' | 'GBP'
export const usd = (n: number, cents = false) => `$${cents ? n.toFixed(2) : Math.round(n).toLocaleString('en-US')}`

const DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTH = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
export const MONTH_LONG = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

export const parseIso = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d))
}
export const toIso = (d: Date) => d.toISOString().slice(0, 10)
export const addDays = (iso: string, n: number) => {
  const d = parseIso(iso)
  d.setUTCDate(d.getUTCDate() + n)
  return toIso(d)
}
/** "Tue 10 Nov" · with year "Tue 10 Nov 2026" */
export const fmtDay = (iso: string, year = false) => {
  const d = parseIso(iso)
  return `${DOW[d.getUTCDay()]} ${d.getUTCDate()} ${MONTH[d.getUTCMonth()]}${year ? ` ${d.getUTCFullYear()}` : ''}`
}
/** US device region: "Nov 10" · "Nov 10, 2026" */
export const fmtUS = (iso: string, year = false) => {
  const d = parseIso(iso)
  return `${MONTH[d.getUTCMonth()]} ${d.getUTCDate()}${year ? `, ${d.getUTCFullYear()}` : ''}`
}
/** "10 Nov" */
export const fmtShort = (iso: string) => {
  const d = parseIso(iso)
  return `${d.getUTCDate()} ${MONTH[d.getUTCMonth()]}`
}
export const dayNum = (iso: string) => parseIso(iso).getUTCDate()
export const dowLabel = (iso: string) => DOW[parseIso(iso).getUTCDay()]
export const monthLabel = (iso: string) => MONTH[parseIso(iso).getUTCMonth()]
/** whole days from today to `iso` (negative = past) */
export const daysUntil = (iso: string) => Math.round((parseIso(iso).getTime() - parseIso(CLOCK.todayIso).getTime()) / 86_400_000)
/** "in 23 days" · "today" · "3 days ago" */
export const relDay = (iso: string) => {
  const n = daysUntil(iso)
  if (n === 0) return 'today'
  if (n === 1) return 'tomorrow'
  if (n === -1) return 'yesterday'
  return n > 0 ? `in ${n} days` : `${-n} days ago`
}
/** "2m ago" · "3h ago" · "4d ago" · "14 Oct" — relative to CLOCK */
export const ago = (minutes: number) => {
  if (minutes < 1) return 'now'
  if (minutes < 60) return `${Math.round(minutes)}m ago`
  if (minutes < 60 * 24) return `${Math.round(minutes / 60)}h ago`
  const days = Math.round(minutes / 60 / 24)
  if (days < 7) return `${days}d ago`
  return fmtUS(addDays(CLOCK.todayIso, -days))
}
export const pct = (a: number, b: number) => (b ? Math.round((a / b) * 100) : 0)
export const plural = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`
export const compact = (n: number) => (n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1)}m` : n >= 1000 ? `${(n / 1000).toFixed(n % 1000 === 0 || n >= 10000 ? 0 : 1)}k` : `${n}`)
