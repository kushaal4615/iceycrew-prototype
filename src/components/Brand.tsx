import { motion } from 'framer-motion'
import { BadgeCheck, Star } from 'lucide-react'
import type { ReactNode } from 'react'
import { useReducedMotion } from '../motion/useReducedMotion'

/* THE SIGNATURE DEVICE: the Ice Ring.
   The brief's one number is "a score out of 100". Every score in the app
   (the overall, the four sub-scores, the daily allowance, the helpfulness
   average in the admin) sits inside a thin gold ring with a small diamond
   marker at the score's angle: the IceyCrew mark, worn by the number.
   The second device, the scorecard strip, puts Fit · Colour · Cohesion ·
   Occasion as four cells on every outfit reference, so a look is never
   just "84": it is 84 with its shape.

   Mark:        the "IC" diamond from the store's logo, redrawn.
   Wordmark:    ICEYCREW in the store's wide uppercase.
   IceRing:     a score (0–100) in a gold ring with the diamond marker.
   ScoreStrip:  the four sub-scores as a strip.
   Band:        which band a score falls in (strong / good / work).
   Figure:      a big number with a small unit.
   Swatch:      a colour chip for palettes.
   Bar:         thin progress bar. */

export type SubScores = { fit: number; colour: number; cohesion: number; occasion: number }
export type Band = 'strong' | 'good' | 'work'

export const band = (n: number): Band => (n >= 80 ? 'strong' : n >= 60 ? 'good' : 'work')
export const BAND: Record<Band, { fill: string; soft: string; onSoft: string; label: string }> = {
  strong: { fill: 'var(--strong)', soft: 'var(--strong-soft)', onSoft: 'var(--on-strong-soft)', label: 'Strong' },
  good: { fill: 'var(--good)', soft: 'var(--good-soft)', onSoft: 'var(--on-good-soft)', label: 'Good' },
  work: { fill: 'var(--work)', soft: 'var(--work-soft)', onSoft: 'var(--on-work-soft)', label: 'Needs work' },
}
export const SUB_LABEL: Record<keyof SubScores, string> = { fit: 'Fit', colour: 'Colour', cohesion: 'Cohesion', occasion: 'Occasion' }
export const SUB_KEYS: (keyof SubScores)[] = ['fit', 'colour', 'cohesion', 'occasion']

/** The IC diamond mark. */
export function Mark({ size = 24, className = '', tone = 'gold' }: { size?: number; className?: string; tone?: 'gold' | 'ink' | 'light' }) {
  const fill = tone === 'gold' ? '#E6B316' : tone === 'light' ? '#FAFAF8' : '#111111'
  const line = tone === 'gold' ? '#111111' : tone === 'light' ? '#111111' : '#FAFAF8'
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className={className} aria-hidden>
      <path d="M32 8 56 28 32 58 8 28Z" fill={fill} />
      <path d="M8 28h48M32 8 22 28l10 30M32 8l10 20-10 30M18 8h28l10 20H8Z" stroke={line} strokeWidth="2" fill="none" strokeLinejoin="round" />
    </svg>
  )
}

export function Wordmark({ size = 14, tone = 'ink', className = '', mark = true }: { size?: number; tone?: 'ink' | 'light'; className?: string; mark?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      {mark && <Mark size={size * 1.7} tone={tone === 'light' ? 'gold' : 'gold'} />}
      <span className="display" style={{ fontSize: size, color: tone === 'light' ? 'var(--on-night)' : 'var(--text)' }}>
        Icey<span style={{ color: tone === 'light' ? 'var(--gold-light)' : 'var(--gold-text)' }}>Crew</span>
      </span>
    </span>
  )
}

/** The Ice Ring: a score in a gold ring with a diamond marker at its angle. */
export function IceRing({
  value,
  size = 120,
  stroke = 7,
  tone = 'paper',
  label,
  color,
  children,
  className = '',
  delay = 0.1,
}: {
  value: number
  size?: number
  stroke?: number
  tone?: 'paper' | 'ink'
  label?: ReactNode
  color?: string
  children?: ReactNode
  className?: string
  delay?: number
}) {
  const reduce = useReducedMotion()
  const r = (size - stroke) / 2 - 2
  const c = 2 * Math.PI * r
  const v = Math.max(0, Math.min(100, value))
  const fill = color ?? BAND[band(v)].fill
  const track = tone === 'ink' ? 'rgb(255 255 255 / 0.14)' : 'var(--paper-200)'
  const angle = (v / 100) * 360 - 90
  const cx = size / 2 + r * Math.cos((angle * Math.PI) / 180)
  const cy = size / 2 + r * Math.sin((angle * Math.PI) / 180)
  const gem = Math.max(5, stroke * 0.95)
  return (
    <span className={`relative inline-grid shrink-0 place-items-center ${className}`} style={{ width: size, height: size }} role="img" aria-label={`${v} out of 100`}>
      <svg width={size} height={size} className="absolute inset-0" aria-hidden>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={track} strokeWidth={stroke} />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={fill}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          initial={reduce ? false : { strokeDashoffset: c }}
          animate={{ strokeDashoffset: c * (1 - v / 100) }}
          transition={{ duration: 1.1, ease: [0.23, 1, 0.32, 1], delay }}
        />
        <motion.g initial={reduce ? false : { opacity: 0, scale: 0.4 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: delay + 0.95, type: 'spring', stiffness: 420, damping: 18 }} style={{ transformOrigin: `${cx}px ${cy}px` }}>
          <path d={`M${cx} ${cy - gem} L${cx + gem} ${cy} L${cx} ${cy + gem} L${cx - gem} ${cy} Z`} fill={fill} stroke={tone === 'ink' ? 'var(--night)' : 'var(--surface)'} strokeWidth={1.5} />
        </motion.g>
      </svg>
      <span className="relative flex flex-col items-center justify-center text-center" style={{ padding: stroke + 6 }}>
        {children ?? (
          <>
            <span className={`figure num ${tone === 'ink' ? 'text-on-night' : 'text-text'}`} style={{ fontSize: size * 0.34 }}>
              {v}
            </span>
            {label && <span className={`label mt-1 ${tone === 'ink' ? 'text-on-night-2' : 'text-text-2'}`} style={{ fontSize: Math.max(10, size * 0.085) }}>{label}</span>}
          </>
        )}
      </span>
    </span>
  )
}

/** The scorecard strip: Fit · Colour · Cohesion · Occasion as four cells. */
export function ScoreStrip({ scores, size = 'sm', tone = 'paper', className = '', labels = true }: { scores: SubScores; size?: 'xs' | 'sm' | 'md'; tone?: 'paper' | 'ink'; className?: string; labels?: boolean }) {
  const h = size === 'xs' ? 4 : size === 'sm' ? 6 : 8
  return (
    <div className={`flex w-full ${className}`} style={{ gap: size === 'md' ? 8 : 6 }} role="img" aria-label={SUB_KEYS.map((k) => `${SUB_LABEL[k]} ${scores[k]}`).join(', ')}>
      {SUB_KEYS.map((k) => {
        const v = scores[k]
        const b = band(v)
        return (
          <span key={k} className="flex min-w-0 flex-1 flex-col gap-1">
            {labels && size !== 'xs' && (
              <span className={`flex items-baseline justify-between gap-1 ${size === 'md' ? 'text-[12px]' : 'text-[10.5px]'} font-bold ${tone === 'ink' ? 'text-on-ink-2' : 'text-text-2'}`}>
                <span className="truncate">{SUB_LABEL[k]}</span>
                <span className={`num ${tone === 'ink' ? 'text-on-ink' : 'text-text'}`}>{v}</span>
              </span>
            )}
            <span className="relative block w-full overflow-hidden rounded-full" style={{ height: h, background: tone === 'ink' ? 'rgb(255 255 255 / 0.14)' : 'var(--paper-200)' }}>
              <motion.span className="absolute inset-y-0 left-0 rounded-full" style={{ background: BAND[b].fill }} initial={{ width: 0 }} animate={{ width: `${v}%` }} transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1], delay: 0.1 }} />
            </span>
          </span>
        )
      })}
    </div>
  )
}

/** A score as a pill: "84 · Strong". */
export function ScorePill({ value, className = '', size = 'sm' }: { value: number; className?: string; size?: 'sm' | 'md' }) {
  const b = band(value)
  return (
    <span className={`num inline-flex items-center gap-1.5 whitespace-nowrap rounded-full font-extrabold ${size === 'md' ? 'h-8 px-3 text-[13px]' : 'h-6 px-2 text-[11px]'} ${className}`} style={{ background: BAND[b].soft, color: BAND[b].onSoft }}>
      <span className="inline-block h-2 w-2 rotate-45 rounded-[1px]" style={{ background: BAND[b].fill }} />
      {value}
      <span className="font-semibold">· {BAND[b].label}</span>
    </span>
  )
}

/** A big number with a small unit: 84 /100, 7 of 10. */
export function Figure({ value, unit, size = 56, className = '', tone }: { value: ReactNode; unit?: string; size?: number; className?: string; tone?: string }) {
  return (
    <span className={`figure num ${className}`} style={{ fontSize: size, color: tone }}>
      {value}
      {unit && <span className="unit">{unit}</span>}
    </span>
  )
}

/** VIP badge. */
export function Vip({ size = 14, label = 'VIP', tone = 'gold', className = '' }: { size?: number; label?: string; tone?: 'gold' | 'light' | 'ink'; className?: string }) {
  const color = tone === 'light' ? 'var(--gold-light)' : tone === 'ink' ? 'var(--text)' : 'var(--gold-text)'
  return (
    <span className={`inline-flex items-center gap-1 whitespace-nowrap text-[12px] font-extrabold uppercase tracking-[0.08em] ${className}`} style={{ color }}>
      <BadgeCheck size={size} strokeWidth={2.4} aria-hidden />
      {label}
    </span>
  )
}

/** Rating as a gold star + number + count. */
export function Stars({ rating, count, size = 13, tone = 'paper', className = '' }: { rating: number; count?: number; size?: number; tone?: 'paper' | 'ink'; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1 whitespace-nowrap font-bold ${className}`} style={{ fontSize: size }}>
      <Star size={size} strokeWidth={0} fill="var(--gold)" aria-hidden />
      <span className={tone === 'ink' ? 'text-on-ink' : 'text-text'}>{rating.toFixed(1)}</span>
      {count !== undefined && <span className={`font-semibold ${tone === 'ink' ? 'text-on-ink-2' : 'text-text-2'}`}>({count})</span>}
    </span>
  )
}

/** Five stars for a helpfulness rating. */
export function StarRow({ rating, size = 12, onPick, className = '' }: { rating: number; size?: number; onPick?: (n: number) => void; className?: string }) {
  if (onPick)
    return (
      <span className={`inline-flex items-center ${className}`} role="radiogroup" aria-label="How helpful was this?">
        {[1, 2, 3, 4, 5].map((i) => (
          <motion.button key={i} type="button" role="radio" aria-checked={i === rating} aria-label={`${i} of 5`} whileTap={{ scale: 0.86 }} onClick={() => onPick(i)} className="grid h-11 w-11 place-items-center">
            <Star size={size} strokeWidth={i <= rating ? 0 : 1.8} fill={i <= rating ? 'var(--gold)' : 'transparent'} className={i <= rating ? '' : 'text-text-3'} aria-hidden />
          </motion.button>
        ))}
      </span>
    )
  return (
    <span className={`inline-flex items-center gap-0.5 ${className}`} role="img" aria-label={`${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} size={size} strokeWidth={0} fill={i <= rating ? 'var(--gold)' : 'var(--paper-300)'} aria-hidden />
      ))}
    </span>
  )
}

/** A colour chip for palettes. */
export function Swatch({ hex, name, size = 44, label = true, ring = false, avoid = false, className = '' }: { hex: string; name?: string; size?: number; label?: boolean; ring?: boolean; avoid?: boolean; className?: string }) {
  return (
    <span className={`inline-flex shrink-0 flex-col items-center gap-1.5 ${className}`} style={{ width: size }}>
      <span
        className="relative block overflow-hidden"
        style={{ width: size, height: size, borderRadius: size > 60 ? 16 : 12, background: hex, boxShadow: ring ? '0 0 0 2px var(--surface), 0 0 0 4px var(--gold)' : 'inset 0 0 0 1px rgb(17 17 17 / 0.08)' }}
        aria-hidden
      >
        {avoid && <span className="absolute inset-0 bg-[linear-gradient(135deg,transparent_46%,rgb(255_255_255/0.9)_46%,rgb(255_255_255/0.9)_54%,transparent_54%)]" />}
      </span>
      {label && name && <span className="w-full truncate text-center text-[10.5px] font-bold text-text-2">{name}</span>}
    </span>
  )
}

/** Progress as a thin gold bar on paper or ink. */
export function Bar({ value, tone = 'gold', height = 6, className = '', track }: { value: number; tone?: 'gold' | 'ink' | 'danger' | 'success'; height?: number; className?: string; track?: string }) {
  const fill = tone === 'ink' ? 'var(--ink)' : tone === 'danger' ? 'var(--danger)' : tone === 'success' ? 'var(--success)' : 'var(--gold)'
  return (
    <span className={`relative block w-full overflow-hidden rounded-full ${className}`} style={{ height, background: track ?? 'var(--surface-high)' }} role="progressbar" aria-valuenow={Math.round(value)} aria-valuemin={0} aria-valuemax={100}>
      <motion.span className="absolute inset-y-0 left-0 rounded-full" style={{ background: fill }} initial={{ width: 0 }} animate={{ width: `${Math.min(100, Math.max(0, value))}%` }} transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }} />
    </span>
  )
}

/** The in-app weather chip: temperature, condition, wind. */
export function WeatherChip({ tempF, summary, windMph, tone = 'paper', className = '' }: { tempF: number; summary: string; windMph: number; tone?: 'paper' | 'ink' | 'glass'; className?: string }) {
  const cls = tone === 'ink' ? 'bg-[rgb(255_255_255/0.12)] text-on-ink' : tone === 'glass' ? 'glass text-text' : 'bg-[var(--surface-high)] text-text'
  return (
    <span className={`inline-flex h-8 items-center gap-2 whitespace-nowrap rounded-full px-3 text-[12px] font-bold ${cls} ${className}`}>
      <span className="num text-[13px]">{tempF}°F</span>
      <span className={tone === 'ink' ? 'text-on-ink-2' : 'text-text-2'}>{summary}</span>
      <span className={`num ${tone === 'ink' ? 'text-on-ink-2' : 'text-text-2'}`}>· {windMph} mph</span>
    </span>
  )
}
