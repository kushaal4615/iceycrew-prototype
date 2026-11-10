import { AnimatePresence, motion, useMotionValue, useTransform, type PanInfo } from 'framer-motion'
import { ArrowRight, Heart, RotateCcw, X } from 'lucide-react'
import { useState } from 'react'
import { Confetti } from '../../components/Confetti'
import { HeroImage } from '../../components/Media'
import { Button } from '../../components/Button'
import { Bar } from '../../components/Brand'
import { DECK, TAG_LABEL } from '../../data/content'
import { useNav } from '../../lib/navigation'
import { session, useSession } from '../../lib/store'
import { track } from '../../lib/tracker'
import { spring, tap } from '../../motion/springs'
import { fadeUp } from '../../motion/transitions'
import { Dock, MobileScreen, StepBar } from '../mobileShell'

/* app.swipe: the swipe deck. Drag right to like, left to pass, or tap the
   buttons. The deck size is the admin's setting (20). Maya resumes at card
   15, so the demo finishes in six swipes and lands on Home with her style
   summary. */

export default function AppSwipe() {
  const { reset, navigate, toast } = useNav()
  const index = useSession((s) => s.swipeIndex)
  const likes = useSession((s) => s.likes)
  const removed = useSession((s) => s.deckRemoved)
  const size = useSession((s) => s.limits.deckSize)
  const deck = DECK.filter((c) => !removed.includes(c.id)).slice(0, size)
  const card = deck[index]
  const done = index >= deck.length
  const [last, setLast] = useState<string | null>(null)
  const [fly, setFly] = useState<'left' | 'right' | null>(null)

  const x = useMotionValue(0)
  const rotate = useTransform(x, [-200, 200], [-12, 12])
  const likeOpacity = useTransform(x, [40, 140], [0, 1])
  const nopeOpacity = useTransform(x, [-40, -140], [0, 1])

  const decide = (like: boolean) => {
    if (!card || fly) return
    setFly(like ? 'right' : 'left')
    track(like ? 'swipe_like' : 'swipe_pass', card.id, { tag: card.tag })
    window.setTimeout(() => {
      session.swipe(card.id, like)
      setLast(card.id)
      setFly(null)
      x.set(0)
    }, 220)
  }
  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x > 90 || info.velocity.x > 600) decide(true)
    else if (info.offset.x < -90 || info.velocity.x < -600) decide(false)
  }
  const undo = () => {
    if (!last) return toast('Nothing to undo yet', 'neutral')
    session.undoSwipe(last)
    setLast(null)
  }

  return (
    <MobileScreen
      header={<StepBar step={8} total={8} label={done ? 'Swipe deck · complete' : `Swipe deck · card ${index + 1} of ${deck.length}`} onBack={() => navigate('app.onboarding')} />}
      bg="var(--bg)"
      padBottom={false}
      dock={
        done ? (
          <Dock tone="surface">
            <Button
              size="lg"
              block
              trailing={ArrowRight}
              onClick={() => {
                track('onboarding_done', likes.length)
                session.finishOnboarding()
                reset('app.home')
              }}
            >
              See my style on Home
            </Button>
          </Dock>
        ) : (
          <div className="pointer-events-auto flex items-center justify-center gap-5 pb-5">
            <motion.button type="button" whileTap={tap} transition={spring.ui} onClick={() => decide(false)} aria-label="Not my style" className="grid h-[64px] w-[64px] place-items-center rounded-full bg-[var(--surface)] text-text shadow-[var(--shadow-floating)]">
              <X size={28} strokeWidth={2.6} aria-hidden />
            </motion.button>
            <motion.button type="button" whileTap={tap} transition={spring.ui} onClick={undo} aria-label="Undo last swipe" className="grid h-11 w-11 place-items-center rounded-full bg-[var(--surface-high)] text-text-2">
              <RotateCcw size={18} aria-hidden />
            </motion.button>
            <motion.button type="button" whileTap={tap} transition={spring.ui} onClick={() => decide(true)} aria-label="I like this" className="grid h-[64px] w-[64px] place-items-center rounded-full bg-gold text-on-gold shadow-[var(--glow-gold)]">
              <Heart size={28} strokeWidth={2.6} aria-hidden />
            </motion.button>
          </div>
        )
      }
      dockHeight={110}
    >
      <div className="relative flex h-full flex-col px-5 pt-1">
        <div className="flex items-center justify-between">
          <p className="text-[13px] font-semibold text-text-2">Right for like, left for pass</p>
          <span className="num rounded-full bg-[var(--surface-high)] px-2.5 py-1 text-[12px] font-bold">
            <Heart size={11} className="mr-1 inline fill-current text-gold-ink" aria-hidden />
            {likes.length} liked
          </span>
        </div>
        <Bar value={(Math.min(index, deck.length) / deck.length) * 100} height={5} className="mt-2" />
        <ul className="scroll-x -mx-5 mt-2.5 flex gap-1.5 px-5" aria-label="Likes so far by style">
          {Object.entries(deck.filter((c) => likes.includes(c.id)).reduce<Record<string, number>>((acc, c) => ({ ...acc, [c.tag]: (acc[c.tag] ?? 0) + 1 }), {})).sort((a, b) => b[1] - a[1]).map(([tag, n]) => (
            <li key={tag} className="label inline-flex h-7 shrink-0 snap-start items-center gap-1.5 rounded-full bg-[var(--surface-high)] px-2.5 text-text">
              {TAG_LABEL[tag as keyof typeof TAG_LABEL]} <span className="num text-gold-ink">{n}</span>
            </li>
          ))}
          <li className="label inline-flex h-7 shrink-0 snap-start items-center rounded-full px-2.5 text-text-2 ring-1 ring-inset ring-[var(--rule-strong)]">{deck.length - Math.min(index, deck.length)} to go</li>
        </ul>

        <div className="relative mt-4 min-h-0 flex-1" style={{ marginBottom: 118 }}>
          {done ? (
            <motion.div variants={fadeUp} initial="hidden" animate="show" className="relative flex h-full flex-col items-center justify-center overflow-hidden rounded-[var(--r-container)] bg-ink p-6 text-center text-on-ink">
              <Confetti count={48} origin={0.3} />
              <div aria-hidden className="facet" style={{ opacity: 0.4 }} />
              <span className="label text-gold-light">Style profile built</span>
              <h2 className="grot mt-3 text-[34px] leading-[0.98]">
                Elevated <em className="text-gold-light">streetwear.</em>
              </h2>
              <p className="mt-3 max-w-[30ch] text-[14px] text-on-ink-2">Neutral tones, relaxed fits, one gold piece that does the talking. {likes.length} likes across {deck.length} cards: streetwear and minimalist led, a little sporty, one bold.</p>
              <div className="mt-5 flex flex-wrap justify-center gap-1.5">
                {['Streetwear', 'Minimalist', 'Sporty', 'Bold'].map((t) => (
                  <span key={t} className="label rounded-full bg-[rgb(255_255_255/0.12)] px-2.5 py-1.5 text-on-ink">{t}</span>
                ))}
              </div>
            </motion.div>
          ) : (
            <>
              {/* the next card peeks beneath */}
              {deck[index + 1] && (
                <div className="absolute inset-x-3 top-3 bottom-0 overflow-hidden rounded-[var(--r-container)] bg-[var(--surface-high)] shadow-[var(--shadow-raised)]">
                  <HeroImage src={deck[index + 1].image} alt="" scrim="none" width={700} className="h-full w-full opacity-70" position="top" />
                </div>
              )}
              <AnimatePresence>
                {card && (
                  <motion.div
                    key={card.id}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.9}
                    onDragEnd={onDragEnd}
                    style={{ x, rotate }}
                    animate={fly ? { x: fly === 'right' ? 520 : -520, rotate: fly === 'right' ? 18 : -18, opacity: 0 } : { x: 0, opacity: 1 }}
                    transition={fly ? { duration: 0.22 } : spring.sheet}
                    className="absolute inset-0 cursor-grab overflow-hidden rounded-[var(--r-container)] bg-[var(--surface)] shadow-[var(--shadow-floating)] active:cursor-grabbing"
                  >
                    <HeroImage src={card.image} alt={card.title} scrim="b" width={800} className="h-full w-full" position="top">
                      <div className="flex h-full flex-col justify-between p-4">
                        <div className="flex items-center justify-between">
                          <span className="label rounded-full bg-[rgb(255_255_255/0.9)] px-2.5 py-1.5 text-text">{TAG_LABEL[card.tag]}</span>
                          <span className="meta rounded-full bg-[rgb(10_10_10/0.5)] px-2.5 py-1.5 text-on-night backdrop-blur-md">
                            {index + 1} / {deck.length}
                          </span>
                        </div>
                        <div>
                          <p className="grot text-[26px] text-on-night">{card.title}</p>
                          <p className="meta mt-1 text-on-night-2">{card.source} · {card.licence}</p>
                        </div>
                      </div>
                    </HeroImage>
                    <motion.span style={{ opacity: likeOpacity }} className="label pointer-events-none absolute left-5 top-14 rotate-[-12deg] rounded-[8px] border-[3px] border-[var(--gold)] px-3 py-1.5 text-[16px] text-gold-light">
                      Like
                    </motion.span>
                    <motion.span style={{ opacity: nopeOpacity }} className="label pointer-events-none absolute right-5 top-14 rotate-[12deg] rounded-[8px] border-[3px] border-white px-3 py-1.5 text-[16px] text-white">
                      Pass
                    </motion.span>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}
        </div>
      </div>
    </MobileScreen>
  )
}
