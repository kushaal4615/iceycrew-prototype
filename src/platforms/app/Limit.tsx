import { motion } from 'framer-motion'
import { ArrowUpRight, Clock3, History, House } from 'lucide-react'
import { IceRing } from '../../components/Brand'
import { Button } from '../../components/Button'
import { ALLOWANCE } from '../../data/analyses'
import { useNav } from '../../lib/navigation'
import { useSession } from '../../lib/store'
import { track } from '../../lib/tracker'
import { listItem, listParent } from '../../motion/transitions'
import { MobileScreen, TopBar } from '../mobileShell'

/* app.limit: the daily limit reached. The brief's friendly message, the
   ring full, the other error states the app can show, and the subtle nudge
   from the call: more scans come with a higher tier later, managed on the
   website, never in-app. */

const ERRORS = [
  ['Blurry photo', 'That one’s a little blurry. Hold still and try again in better light.'],
  ['No person detected', 'We couldn’t find anyone in the photo. Step into the guide and retake.'],
  ['Outfit not fully visible', 'Step back so your whole outfit fits the guide, head to shoes.'],
  ['Offline', 'You’re offline. Your photo stays on your phone until you reconnect.'],
  ['Server error', 'Something went wrong on our side. Nothing was charged to your limit. Try again in a minute.'],
]

export default function AppLimit() {
  const { navigate, toast } = useNav()
  const daily = useSession((s) => s.limits.daily)
  const hourly = useSession((s) => s.limits.hourly)
  return (
    <MobileScreen bg="var(--night)" header={<TopBar title="Today’s limit" tone="night" />}>
      <motion.div variants={listParent} initial="hidden" animate="show" className="px-5 text-on-night">
        <motion.div variants={listItem} className="flex flex-col items-center pt-4 text-center">
          <IceRing value={100} size={168} stroke={10} tone="ink" label={`of ${daily} today`} delay={0.2}>
            <span className="figure num text-[56px] text-on-night">
              {daily}
            </span>
            <span className="label text-on-night-2">of {daily} today</span>
          </IceRing>
          <h1 className="grot mt-6 text-[34px] leading-[0.98]">You’ve reached today’s limit.</h1>
          <p className="mt-2 text-[15px] text-on-night-2">Try again in {ALLOWANCE.resetsIn}.</p>
          <span className="meta mt-3 inline-flex items-center gap-1.5 rounded-full bg-[rgb(255_255_255/0.12)] px-3 py-1.5">
            <Clock3 size={12} aria-hidden /> HTTP 429 · retry-after {ALLOWANCE.resetsIn}
          </span>
        </motion.div>

        <motion.div variants={listItem} className="mt-7 grid grid-cols-2 gap-2">
          <div className="rounded-[var(--r-card)] bg-[rgb(255_255_255/0.07)] p-4">
            <span className="label text-on-night-2">Per day</span>
            <span className="figure num mt-1 block text-[34px]">{daily}</span>
            <span className="meta text-on-night-2">resets at midnight</span>
          </div>
          <div className="rounded-[var(--r-card)] bg-[rgb(255_255_255/0.07)] p-4">
            <span className="label text-on-night-2">Per hour</span>
            <span className="figure num mt-1 block text-[34px]">{hourly}</span>
            <span className="meta text-on-night-2">anti-abuse cap</span>
          </div>
        </motion.div>

        <motion.div variants={listItem} className="relative mt-4 overflow-hidden rounded-[var(--r-container)] bg-gold p-5 text-on-gold">
          <div aria-hidden className="facet" style={{ opacity: 0.25 }} />
          <p className="label text-[var(--on-accent-2)]">Coming later</p>
          <p className="grot mt-1 text-[22px] leading-[1.02]">More scans with a higher membership.</p>
          <p className="mt-2 text-[13px] leading-snug text-[var(--on-accent-2)]">One VIP level today. When tiers arrive, upgrades happen on iceycrew.com, never inside the app.</p>
          <Button variant="ink" size="sm" className="mt-3" trailing={ArrowUpRight} onClick={() => { track('manage_membership', 'limit'); toast('Opens iceycrew.com/account/subscriptions in the browser', 'info') }}>
            Manage membership
          </Button>
        </motion.div>

        <motion.div variants={listItem} className="mt-6">
          <p className="label text-on-night-2">Other messages you might see</p>
          <ul className="mt-2 divide-y divide-[rgb(255_255_255/0.1)]">
            {ERRORS.map(([t, m]) => (
              <li key={t} className="py-3">
                <span className="block text-[14px] font-bold">{t}</span>
                <span className="block text-[12.5px] leading-snug text-on-night-2">{m}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div variants={listItem} className="mt-6 flex flex-col gap-2">
          <Button size="lg" block variant="white" icon={History} onClick={() => { track('open_history', 'limit'); navigate('app.history') }}>
            Browse your history
          </Button>
          <Button size="lg" block variant="nightOutline" icon={House} onClick={() => navigate('app.home')}>
            Back to Home
          </Button>
        </motion.div>
      </motion.div>
    </MobileScreen>
  )
}
