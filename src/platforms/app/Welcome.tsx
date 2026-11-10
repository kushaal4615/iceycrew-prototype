import { motion } from 'framer-motion'
import { ArrowRight, ArrowUpRight, Smartphone } from 'lucide-react'
import { IceRing, ScoreStrip, Wordmark } from '../../components/Brand'
import { Button } from '../../components/Button'
import { HeroImage } from '../../components/Media'
import { TODAY } from '../../data/analyses'
import { useNav } from '../../lib/navigation'
import { track } from '../../lib/tracker'
import { listItem, listParent } from '../../motion/transitions'
import { Dock, MobileScreen, safeBottom, safeTop } from '../mobileShell'

/* app.welcome: the entry screen. A full-bleed photograph runs behind the
   status bar; the two options the brief asks for sit in the dock:
   "I'm a VIP member: verify" and "Become a VIP" (links to the store). */

export default function AppWelcome() {
  const { navigate, toast } = useNav()
  return (
    <MobileScreen
      padBottom={false}
      bg="var(--night)"
      dock={
        <Dock tone="clear">
          <div className="flex w-full flex-col gap-2">
            <Button
              size="lg"
              block
              trailing={ArrowRight}
              onClick={() => {
                track('verify_start')
                navigate('app.verify')
              }}
            >
              I’m a VIP member: verify
            </Button>
            <Button
              size="lg"
              block
              variant="white"
              trailing={ArrowUpRight}
              onClick={() => {
                track('become_vip')
                toast('Opens iceycrew.com/products/vip-membership in the browser', 'info')
              }}
            >
              Become a VIP
            </Button>
            <button
              type="button"
              onClick={() => {
                track('login_instead')
                navigate('app.home')
              }}
              className="flex h-11 w-full items-center justify-center text-[13px] font-bold text-on-night"
            >
              Already have an account? <span className="ml-1 text-gold-light underline underline-offset-4">Log in</span>
            </button>
          </div>
        </Dock>
      }
      dockHeight={176}
    >
      <div className="relative h-full min-h-[760px]">
        <HeroImage src="fitBlueCoat" alt="" scrim="none" width={1000} className="absolute inset-0" position="center 20%" />
        <div aria-hidden className="pointer-events-none absolute inset-0 [background:linear-gradient(to_bottom,rgb(10_10_10/0.55)_0%,rgb(10_10_10/0.05)_30%,rgb(10_10_10/0.2)_50%,rgb(10_10_10/0.92)_78%,var(--night)_100%)]" />
        <div aria-hidden className="grain" />
        <div aria-hidden className="facet" style={{ right: '-20%', bottom: '28%', width: '70%', opacity: 0.35 }} />

        <motion.div variants={listParent} initial="hidden" animate="show" className="relative flex h-full flex-col px-5" style={{ paddingTop: safeTop(12), paddingBottom: safeBottom(190) }}>
          <motion.div variants={listItem} className="flex items-center justify-between">
            <Wordmark tone="light" size={13} />
            <span className="label inline-flex h-7 items-center gap-1.5 rounded-full bg-[rgb(255_255_255/0.16)] px-2.5 text-on-night backdrop-blur-md">
              <Smartphone size={12} aria-hidden /> iOS · Android
            </span>
          </motion.div>

          {/* the floating scorecard: the product in one glance */}
          <motion.div variants={listItem} className="mt-auto">
            <div className="glass inline-flex max-w-[300px] items-center gap-4 rounded-[var(--r-container)] p-3 pr-5">
              <IceRing value={TODAY.overall} size={84} stroke={6} label="/100" delay={0.5} />
              <div className="min-w-0 flex-1">
                <p className="label text-gold-ink">Today’s fit · scored just now</p>
                <p className="mt-0.5 truncate text-[14px] font-bold text-text">Burgundy coat · Work · rain</p>
                <ScoreStrip scores={TODAY.sub} size="xs" labels={false} className="mt-2" />
              </div>
            </div>
          </motion.div>

          <motion.h1 variants={listItem} className="grot mt-6 text-[52px] leading-[0.92] text-on-night">
            Your outfit, <em className="text-gold-light">scored.</em>
          </motion.h1>
          <motion.p variants={listItem} className="mt-3 max-w-[32ch] text-[15px] leading-snug text-on-night-2">
            Photograph what you’re wearing. Get a score out of 100, what’s working, what could be better, and three to five ways to level it up, all tuned to your own style and colours.
          </motion.p>
          <motion.p variants={listItem} className="meta mt-4 text-on-night-2">
            VIP members only · 16+ · one place, no contradictions
          </motion.p>
        </motion.div>
      </div>
    </MobileScreen>
  )
}
