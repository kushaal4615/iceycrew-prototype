import { motion } from 'framer-motion'
import { Check, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Mark } from '../../components/Brand'
import { HeroImage } from '../../components/Media'
import { WEATHER } from '../../data/clock'
import { useNav } from '../../lib/navigation'
import { useSession } from '../../lib/store'
import { track } from '../../lib/tracker'
import { spring } from '../../motion/springs'
import { MobileScreen, safeBottom, safeTop } from '../mobileShell'

/* app.processing: the branded processing animation. Five steps tick over
   the blurred photo while the gold ring spins; the app redirects to the
   Analysis page by itself (target under 10 seconds end to end). The bottom
   nav is hidden here. */

const STEPS = ['Uploading, encrypted', 'Content check', 'Reading the fit', 'Scoring against your profile and colours', 'Writing your tips']

export default function AppProcessing() {
  const { navigate } = useNav()
  const occasion = useSession((s) => s.occasion)
  const other = useSession((s) => s.otherOccasion)
  const weatherOn = useSession((s) => s.weatherOn)
  const [done, setDone] = useState(0)
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    const timers = STEPS.map((_, i) => window.setTimeout(() => setDone(i + 1), 560 * (i + 1)))
    const tick = window.setInterval(() => setElapsed((e) => e + 0.1), 100)
    const go = window.setTimeout(() => {
      track('analysis_completed', 'a-today', { ms: 3400 })
      navigate('app.analysis')
    }, 560 * STEPS.length + 520)
    return () => {
      timers.forEach(window.clearTimeout)
      window.clearInterval(tick)
      window.clearTimeout(go)
    }
  }, [navigate])

  return (
    <MobileScreen padBottom={false} bg="var(--night)">
      <div className="relative h-full min-h-[720px] overflow-hidden text-on-night">
        <HeroImage src="fitWorkCoat" alt="" scrim="none" width={800} className="absolute inset-0 scale-105 blur-[14px]" position="center 30%" />
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[rgb(10_10_10/0.72)]" />
        <div aria-hidden className="grain" />

        <div className="absolute inset-x-0 flex items-center justify-between px-3" style={{ top: safeTop(4) }}>
          <span className="meta rounded-full bg-[rgb(255_255_255/0.12)] px-3 py-1.5">
            {occasion ? (occasion === 'Other' ? other : occasion) : 'No occasion'} · {weatherOn ? `${WEATHER.tempF}°F ${WEATHER.summary.toLowerCase()}` : 'no weather'}
          </span>
          <button type="button" onClick={() => { track('analysis_cancel'); navigate('app.camera') }} aria-label="Cancel" className="grid h-11 w-11 place-items-center rounded-full bg-[rgb(255_255_255/0.12)]">
            <X size={20} aria-hidden />
          </button>
        </div>

        <div className="relative flex h-full flex-col items-center justify-center px-8" style={{ paddingBottom: safeBottom(40) }}>
          {/* the Ice Ring, indeterminate: a gold arc chasing the diamond */}
          <span className="relative grid h-[168px] w-[168px] place-items-center">
            <motion.svg width="168" height="168" viewBox="0 0 168 168" className="absolute inset-0" animate={{ rotate: 360 }} transition={{ duration: 1.6, repeat: Infinity, ease: 'linear' }} aria-hidden>
              <circle cx="84" cy="84" r="76" fill="none" stroke="rgb(255 255 255 / 0.12)" strokeWidth="7" />
              <circle cx="84" cy="84" r="76" fill="none" stroke="var(--gold)" strokeWidth="7" strokeLinecap="round" strokeDasharray="150 328" />
              <path d="M84 0 L92 8 L84 16 L76 8 Z" fill="var(--gold)" />
            </motion.svg>
            <motion.span animate={{ scale: [1, 1.08, 1] }} transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }} className="grid place-items-center">
              <Mark size={56} />
            </motion.span>
          </span>
          <p className="label mt-7 text-gold-light">Reading your fit</p>
          <p className="grot mt-2 text-center text-[32px] leading-[1]">
            Scoring against <em className="text-gold-light">your</em> profile
          </p>
          <p className="num mt-3 text-[13px] font-semibold text-on-night-2">{elapsed.toFixed(1)}s · target under 10s</p>

          <ol className="mt-8 w-full max-w-[300px] space-y-2.5">
            {STEPS.map((s, i) => {
              const ok = done > i
              const active = done === i
              return (
                <motion.li key={s} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ ...spring.ui, delay: i * 0.08 }} className="flex items-center gap-3">
                  <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full ${ok ? 'bg-gold text-on-gold' : active ? 'ring-2 ring-[var(--gold)]' : 'ring-1 ring-[rgb(255_255_255/0.25)]'}`}>
                    {ok ? <Check size={13} strokeWidth={3} aria-hidden /> : active ? <motion.span className="h-2 w-2 rounded-full bg-gold" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 0.9, repeat: Infinity }} /> : null}
                  </span>
                  <span className={`text-[14px] ${ok ? 'font-semibold text-on-night' : active ? 'font-semibold text-on-night' : 'text-on-night-2'}`}>{s}</span>
                </motion.li>
              )
            })}
          </ol>
          <ul className="scroll-x mt-8 flex w-full gap-1.5" aria-label="Sent with this request">
            {['Photo · encrypted', 'Style profile', 'Colour profile · Deep Autumn', occasion ? `Occasion · ${occasion === 'Other' ? other : occasion}` : 'No occasion', weatherOn ? `Weather · ${WEATHER.tempF}°F` : 'No weather', 'Country · US'].map((t) => (
              <li key={t} className="label inline-flex h-7 shrink-0 snap-start items-center rounded-full bg-[rgb(255_255_255/0.12)] px-2.5 text-on-night">{t}</li>
            ))}
          </ul>
          <p className="meta mt-4 text-center text-on-night-2">One request, one JSON answer, validated by the backend before you see it.</p>
        </div>
      </div>
    </MobileScreen>
  )
}
