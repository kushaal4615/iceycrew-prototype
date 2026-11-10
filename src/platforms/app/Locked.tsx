import { motion } from 'framer-motion'
import { ArrowUpRight, History, Lock, Undo2 } from 'lucide-react'
import { Vip, Wordmark } from '../../components/Brand'
import { Button } from '../../components/Button'
import { HeroImage } from '../../components/Media'
import { SCORED } from '../../data/analyses'
import { useNav } from '../../lib/navigation'
import { session } from '../../lib/store'
import { track } from '../../lib/tracker'
import { listItem, listParent } from '../../motion/transitions'
import { Dock, MobileScreen, safeBottom, safeTop } from '../mobileShell'

/* app.locked: what lapsed members and non-members see. A "Become a VIP"
   link to the store; lapsed members keep read-only history. Cancellation
   runs to month end, a refund or failed payment removes access at once,
   and access comes back automatically when a retry succeeds. */

const RULES = [
  ['Cancelled', 'Access continues to the end of the paid month, then lapsed.'],
  ['Failed payment', 'Access removed as soon as a renewal fails; restored automatically when a retry succeeds or you resubscribe.'],
  ['Refunded', 'Access removed immediately.'],
]

export default function AppLocked() {
  const { navigate, reset, toast } = useNav()
  const restore = () => {
    track('locked_restore_demo')
    session.setMembership('active')
    reset('app.home')
  }
  return (
    <MobileScreen
      padBottom={false}
      bg="var(--night)"
      dock={
        <Dock tone="night">
          <div className="flex w-full flex-col gap-2">
            <Button size="lg" block trailing={ArrowUpRight} onClick={() => { track('become_vip', 'locked'); toast('Opens iceycrew.com/products/vip-membership in the browser', 'info') }}>
              Become a VIP
            </Button>
            <Button size="lg" block variant="white" icon={History} onClick={() => { track('open_history', 'locked'); navigate('app.history') }}>
              Browse my history (read-only)
            </Button>
            <button type="button" onClick={restore} className="flex h-11 w-full items-center justify-center gap-1.5 text-[13px] font-bold text-on-night-2">
              <Undo2 size={14} aria-hidden /> Back to the demo as an active member
            </button>
          </div>
        </Dock>
      }
      dockHeight={190}
    >
      <div className="relative h-full min-h-[760px]">
        <HeroImage src="rackDark" alt="" scrim="none" width={900} className="absolute inset-0 opacity-60" position="center" />
        <div aria-hidden className="pointer-events-none absolute inset-0 [background:linear-gradient(to_bottom,rgb(10_10_10/0.5)_0%,rgb(10_10_10/0.75)_40%,var(--night)_75%)]" />
        <div aria-hidden className="grain" />
        <motion.div variants={listParent} initial="hidden" animate="show" className="relative flex h-full flex-col px-5 text-on-night" style={{ paddingTop: safeTop(12), paddingBottom: safeBottom(200) }}>
          <motion.div variants={listItem}>
            <Wordmark tone="light" size={13} />
          </motion.div>
          <motion.div variants={listItem} className="mt-16 grid h-16 w-16 place-items-center rounded-full bg-[rgb(255_255_255/0.12)]">
            <Lock size={28} aria-hidden />
          </motion.div>
          <motion.h1 variants={listItem} className="grot mt-5 text-[40px] leading-[0.95]">
            Your VIP membership has <em className="text-gold-light">lapsed.</em>
          </motion.h1>
          <motion.p variants={listItem} className="mt-3 max-w-[32ch] text-[14.5px] leading-snug text-on-night-2">
            The renewal on Nov 4 didn’t go through, so scans are paused. Your history is still here to read. Fix the payment on iceycrew.com and access comes straight back, no app update needed.
          </motion.p>
          <motion.div variants={listItem} className="mt-5 inline-flex items-center gap-2 self-start rounded-full bg-[rgb(255_255_255/0.1)] px-3 py-1.5">
            <Vip tone="light" label="Status" />
            <span className="meta text-on-night-2">lapsed · payment failed · paid until Nov 4</span>
          </motion.div>
          <motion.div variants={listItem} className="mt-5">
            <p className="label text-on-night-2">Your history stays · {SCORED.length} scans</p>
            <ul className="scroll-x -mx-5 mt-2 flex gap-2 px-5">
              {SCORED.slice(1, 7).map((a) => (
                <li key={a.id} className="w-[64px] shrink-0 snap-start">
                  {a.photo && (
                    <HeroImage src={a.photo} alt="" scrim="b" width={200} className="aspect-[3/4] rounded-[10px]" position="top">
                      <span className="num absolute bottom-1 left-1.5 text-[11px] font-extrabold text-on-night">{a.overall}</span>
                    </HeroImage>
                  )}
                </li>
              ))}
            </ul>
          </motion.div>
          <motion.ul variants={listItem} className="mt-5 divide-y divide-[rgb(255_255_255/0.1)]">
            {RULES.map(([t, m]) => (
              <li key={t} className="flex gap-3 py-3">
                <span className="label w-[108px] shrink-0 pt-0.5 text-gold-light">{t}</span>
                <span className="text-[12.5px] leading-snug text-on-night-2">{m}</span>
              </li>
            ))}
          </motion.ul>
        </motion.div>
      </div>
    </MobileScreen>
  )
}
