import { motion } from 'framer-motion'
import { ArrowUpRight, Camera, ChevronLeft, RotateCcw, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Swatch } from '../../components/Brand'
import { Button } from '../../components/Button'
import { Confetti } from '../../components/Confetti'
import { HeroImage } from '../../components/Media'
import { BottomSheet } from '../../components/Sheet'
import { DEEP_AUTUMN, SEASONS_SHORT } from '../../data/content'
import { useNav } from '../../lib/navigation'
import { session } from '../../lib/store'
import { track } from '../../lib/tracker'
import { spring, tap } from '../../motion/springs'
import { listItem, listParent } from '../../motion/transitions'
import { MobileScreen, safeTop } from '../mobileShell'

/* app.colours: the result. Undertone, season, a palette of 14 best
   colours, four to avoid, the best metals (gold first: IceyCrew's own
   world). Saved to the profile; retake or clear. */

export default function AppColours() {
  const { navigate, back, canGoBack, toast } = useNav()
  const [clear, setClear] = useState(false)
  const s = DEEP_AUTUMN
  return (
    <MobileScreen
      bg="var(--bg)"
      cap="var(--night)"
      overlay={
        <BottomSheet open={clear} onClose={() => setClear(false)} title="Clear my colour result?">
          <p className="text-[14px] leading-snug text-text-2">Your season, palette and metals are removed from your profile and analyses stop referencing them. You can retake the quiz any time; the same answers give the same result.</p>
          <div className="mt-4 flex gap-2">
            <Button block variant="outline" onClick={() => setClear(false)}>
              Keep it
            </Button>
            <Button block variant="danger" icon={Trash2} onClick={() => { track('colour_clear'); session.clearColour(); setClear(false); navigate('app.mystyle') }}>
              Clear result
            </Button>
          </div>
        </BottomSheet>
      }
    >
      <motion.div variants={listParent} initial="hidden" animate="show">
        {/* ── Hero: the palette as a colour-block hero ── */}
        <div className="relative overflow-hidden bg-night text-on-night">
          <Confetti count={36} origin={0.25} />
          <div className="absolute inset-x-0 flex items-center justify-between px-3" style={{ top: safeTop(4) }}>
            {canGoBack ? (
              <motion.button type="button" whileTap={tap} transition={spring.ui} onClick={() => { track('go_back'); back() }} aria-label="Back" className="flex h-11 items-center gap-0.5 rounded-full bg-[rgb(255_255_255/0.12)] pl-1 pr-3 text-[15px] font-semibold text-white">
                <ChevronLeft size={24} aria-hidden /> Back
              </motion.button>
            ) : (
              <span />
            )}
            <span className="label rounded-full bg-[rgb(255_255_255/0.12)] px-3 py-1.5">Saved to your profile</span>
          </div>
          <div className="px-5 pb-6" style={{ paddingTop: safeTop(64) }}>
            <span className="label text-gold-light">My Colours</span>
            <h1 className="grot mt-1 text-[48px] leading-[0.92]">{s.name}</h1>
            <p className="mt-3 max-w-[30ch] text-[14.5px] leading-snug text-on-night-2">{s.summary}</p>
          </div>
          <div className="grid grid-cols-7">
            {s.palette.map((c) => (
              <motion.span key={c.hex} variants={listItem} className="aspect-[1/1.15]" style={{ background: c.hex }} aria-hidden />
            ))}
          </div>
        </div>

        {/* ── Undertone · depth · metals: asymmetric bento ── */}
        <motion.div variants={listItem} className="mx-5 mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-[var(--r-card)] bg-[var(--surface)] p-4 shadow-[var(--shadow-raised)]">
            <span className="label text-text-2">Undertone</span>
            <span className="grot mt-1 block text-[26px]">{s.undertone}</span>
            <span className="text-[12.5px] text-text-2">Green veins, tans easily</span>
          </div>
          <div className="rounded-[var(--r-card)] bg-[var(--surface)] p-4 shadow-[var(--shadow-raised)]">
            <span className="label text-text-2">Depth</span>
            <span className="grot mt-1 block text-[26px]">Deep</span>
            <span className="text-[12.5px] text-text-2">Dark hair and eyes</span>
          </div>
          <div className="relative col-span-2 overflow-hidden rounded-[var(--r-card)] bg-gold p-4 text-on-gold">
            <div aria-hidden className="facet" style={{ opacity: 0.25 }} />
            <span className="label text-[var(--on-accent-2)]">Best metal tones</span>
            <span className="grot mt-1 block text-[26px]">{s.metals.join(' · ')}</span>
            <span className="mt-1 block text-[12.5px] leading-snug text-[var(--on-accent-2)]">{s.metalNote}</span>
          </div>
        </motion.div>

        {/* ── The palette, named ── */}
        <motion.section variants={listItem} className="mt-7 px-5">
          <h2 className="grot text-[24px]">Your {s.palette.length} best colours</h2>
          <div className="mt-3 grid grid-cols-5 gap-x-2 gap-y-3">
            {s.palette.map((c) => (
              <Swatch key={c.hex} hex={c.hex} name={c.name} size={60} />
            ))}
          </div>
        </motion.section>

        <motion.section variants={listItem} className="mt-6 px-5">
          <h2 className="grot text-[24px]">Colours to avoid</h2>
          <p className="mt-1 text-[13px] text-text-2">They wash a warm, deep colouring out. Keep them away from the face; fine as a shoe or a bag.</p>
          <div className="mt-3 flex gap-3">
            {s.avoid.map((c) => (
              <Swatch key={c.hex} hex={c.hex} name={c.name} size={60} avoid />
            ))}
          </div>
        </motion.section>

        {/* ── Jewellery tie-in ── */}
        <motion.div variants={listItem} className="mx-5 mt-7">
          <HeroImage src="goldNecklace" alt="" scrim="b" width={800} className="aspect-[16/10] rounded-[var(--r-container)]">
            <div className="flex h-full flex-col justify-end p-5 text-on-night">
              <span className="label text-gold-light">Gold first</span>
              <span className="grot text-[24px]">Warm metals, close to the skin</span>
              <button type="button" onClick={() => { track('shop_gold'); toast('Opens iceycrew.com gold pieces in the browser', 'info') }} className="mt-2 flex h-11 items-center gap-1 text-[13px] font-bold text-gold-light">
                See gold pieces on iceycrew.com <ArrowUpRight size={14} aria-hidden />
              </button>
            </div>
          </HeroImage>
        </motion.div>

        <motion.div variants={listItem} className="mx-5 mt-6 rounded-[var(--r-card)] bg-[var(--surface-tint)] p-4">
          <p className="text-[13px] font-bold">One of {SEASONS_SHORT.length} seasons</p>
          <p className="mt-1 text-[12.5px] leading-snug text-text-2">{SEASONS_SHORT.join(' · ')}. The quiz is deterministic: the same eight answers always give the same season.</p>
        </motion.div>

        <motion.div variants={listItem} className="mt-6 flex flex-col gap-2 px-5">
          <Button size="lg" block icon={Camera} onClick={() => { track('open_camera', 'colours'); navigate('app.camera') }}>
            Scan an outfit in these colours
          </Button>
          <div className="flex gap-2">
            <Button block variant="outline" icon={RotateCcw} onClick={() => { track('colour_retake'); navigate('app.colourquiz') }}>
              Retake the quiz
            </Button>
            <Button block variant="ghost" icon={Trash2} onClick={() => setClear(true)}>
              Clear result
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </MobileScreen>
  )
}
