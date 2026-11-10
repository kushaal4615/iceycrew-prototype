import { motion } from 'framer-motion'
import { ArrowRight, Check, Palette, Pencil, RefreshCw, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { Bar, Swatch } from '../../components/Brand'
import { Button, Pressable } from '../../components/Button'
import { HeroImage, Rail } from '../../components/Media'
import { BottomSheet } from '../../components/Sheet'
import { DECK, DEEP_AUTUMN, QUESTIONS, STYLE_PROFILE, TAG_LABEL, type Question } from '../../data/content'
import { fmtUS } from '../../data/clock'
import { useNav } from '../../lib/navigation'
import { session, useSession } from '../../lib/store'
import { track } from '../../lib/tracker'
import { spring, tap } from '../../motion/springs'
import { listItem, listParent } from '../../motion/transitions'
import { AvatarBar, MobileScreen, SectionHead } from '../mobileShell'

/* app.mystyle: the AI-written summary as the header, the liked looks, the
   onboarding answers (editable in a sheet), "Recalibrate my style", and
   the My Colours card with the opt-in "Find my colours" entry. */

export default function AppMyStyle() {
  const { navigate, toast } = useNav()
  const answers = useSession((s) => s.onboardingAnswers)
  const likes = useSession((s) => s.likes)
  const colourDone = useSession((s) => s.colourDone)
  const [editing, setEditing] = useState<Question | null>(null)
  const [recal, setRecal] = useState(false)
  const liked = DECK.filter((c) => likes.includes(c.id))
  const label = (q: Question) => (answers[q.id] ?? []).map((id) => q.options.find((o) => o.id === id)?.label ?? id).join(', ') || 'Not answered'
  const maxTag = Math.max(...STYLE_PROFILE.likedTags.map((t) => t.n))

  return (
    <MobileScreen
      tab="mystyle"
      header={<AvatarBar eyebrow="My Style" title={`Updated ${fmtUS(STYLE_PROFILE.updatedIso)}`} />}
      overlay={
        <>
          <BottomSheet open={!!editing} onClose={() => setEditing(null)} title={editing?.prompt ?? ''}>
            {editing && (
              <>
                <ul className="flex flex-col gap-2">
                  {editing.options.map((o) => {
                    const on = (answers[editing.id] ?? []).includes(o.id)
                    return (
                      <li key={o.id}>
                        <button
                          type="button"
                          aria-pressed={on}
                          onClick={() => {
                            const cur = answers[editing.id] ?? []
                            session.answer(editing.id, editing.multi ? (on ? cur.filter((x) => x !== o.id) : [...cur, o.id]) : [o.id])
                          }}
                          className={`flex min-h-[52px] w-full items-center gap-3 rounded-[var(--r-card)] px-4 text-left ${on ? 'bg-ink text-on-ink' : 'bg-[var(--surface-high)] text-text'}`}
                        >
                          <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full ${on ? 'bg-gold text-on-gold' : 'ring-1 ring-inset ring-[var(--rule-strong)]'}`}>{on && <Check size={14} strokeWidth={3} aria-hidden />}</span>
                          <span className="text-[15px] font-semibold">{o.label}</span>
                        </button>
                      </li>
                    )
                  })}
                </ul>
                <Button block className="mt-4" onClick={() => { track('preference_edit', editing.id); setEditing(null); toast('Saved. Your next scan uses it.', 'accent') }}>
                  Save
                </Button>
              </>
            )}
          </BottomSheet>
          <BottomSheet open={recal} onClose={() => setRecal(false)} title="Recalibrate my style">
            <p className="text-[14px] leading-snug text-text-2">Re-run the questions, the swipe deck, or both. Your summary updates when you finish.</p>
            <div className="mt-4 flex flex-col gap-2">
              <Button block variant="ink" trailing={ArrowRight} onClick={() => { track('recalibrate', 'questions'); session.startRecalibrate(); setRecal(false); navigate('app.onboarding') }}>
                Re-run the questions
              </Button>
              <Button block variant="outline" trailing={ArrowRight} onClick={() => { track('recalibrate', 'deck'); session.resetDeck(); setRecal(false); navigate('app.swipe') }}>
                Redo the swipe deck
              </Button>
            </div>
          </BottomSheet>
        </>
      }
    >
      <motion.div variants={listParent} initial="hidden" animate="show">
        {/* ── AI summary header ── */}
        <motion.div variants={listItem} className="px-5 pt-1">
          <span className="label inline-flex items-center gap-1.5 text-gold-ink">
            <Sparkles size={12} aria-hidden /> Your style, in a sentence
          </span>
          <h1 className="grot mt-2 text-[34px] leading-[0.98]">
            You lean <em>elevated streetwear</em>: neutral tones, relaxed fits, one gold piece that does the talking.
          </h1>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {STYLE_PROFILE.keywords.map((k) => (
              <span key={k} className="label rounded-full bg-[var(--surface-high)] px-2.5 py-1.5 text-text">{k}</span>
            ))}
          </div>
        </motion.div>

        {/* ── Liked looks rail ── */}
        <SectionHead className="mt-7" eyebrow={`${likes.length} likes in the deck`} title="Looks you liked" action="Redo deck" onAction={() => { session.resetDeck(); navigate('app.swipe') }} />
        <motion.div variants={listItem} className="mt-3">
          <Rail>
            {liked.map((c) => (
              <div key={c.id} className="w-[120px] shrink-0 snap-start">
                <HeroImage src={c.image} alt={c.title} scrim="b" width={300} className="aspect-[3/4] rounded-[var(--r-card)]" position="top">
                  <div className="flex h-full flex-col justify-end p-2.5">
                    <span className="label text-gold-light">{TAG_LABEL[c.tag]}</span>
                  </div>
                </HeroImage>
              </div>
            ))}
          </Rail>
        </motion.div>

        {/* ── Tag mix ── */}
        <motion.div variants={listItem} className="mx-5 mt-5 rounded-[var(--r-card)] bg-[var(--surface)] p-4 shadow-[var(--shadow-raised)]">
          <p className="label text-text-2">What your likes say</p>
          <ul className="mt-3 flex flex-col gap-2.5">
            {STYLE_PROFILE.likedTags.map((t) => (
              <li key={t.tag} className="grid grid-cols-[88px_1fr_28px] items-center gap-3 text-[13px]">
                <span className="font-bold">{TAG_LABEL[t.tag]}</span>
                <Bar value={(t.n / maxTag) * 100} height={8} tone={t.n === maxTag ? 'gold' : 'ink'} />
                <span className="num text-right font-semibold text-text-2">{t.n}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* ── Preferences, editable ── */}
        <SectionHead className="mt-7" title="Your preferences" eyebrow="From onboarding · tap to edit" />
        <motion.ul variants={listItem} className="mt-2 divide-y divide-[var(--rule)]">
          {QUESTIONS.map((q) => (
            <li key={q.id}>
              <Pressable onClick={() => { track('open_preference', q.id); setEditing(q) }} className="flex min-h-[60px] items-center gap-3 px-5 py-3 hover:bg-[var(--surface-raised)]">
                <span className="min-w-0 flex-1">
                  <span className="label block text-text-2">{q.topic}</span>
                  <span className="block truncate text-[15px] font-semibold text-text">{label(q)}</span>
                </span>
                <Pencil size={16} className="shrink-0 text-text-3" aria-hidden />
              </Pressable>
            </li>
          ))}
        </motion.ul>

        <motion.div variants={listItem} className="mt-4 px-5">
          <Button block variant="ink" size="lg" icon={RefreshCw} onClick={() => { track('open_recalibrate'); setRecal(true) }}>
            Recalibrate my style
          </Button>
        </motion.div>

        {/* ── My Colours card ── */}
        <motion.div variants={listItem} className="mx-5 mt-7 overflow-hidden rounded-[var(--r-container)] bg-ink text-on-ink">
          {colourDone ? (
            <>
              <div className="grid grid-cols-7 gap-0">
                {DEEP_AUTUMN.palette.slice(0, 14).map((c) => (
                  <span key={c.hex} className="aspect-square" style={{ background: c.hex }} aria-hidden />
                ))}
              </div>
              <div className="p-5">
                <span className="label text-gold-light">My Colours</span>
                <p className="grot mt-1 text-[28px]">{DEEP_AUTUMN.name}</p>
                <p className="mt-1.5 text-[13px] text-on-ink-2">{DEEP_AUTUMN.undertone} undertone · {DEEP_AUTUMN.depth.toLowerCase()} · {DEEP_AUTUMN.metals.join(', ')}</p>
                <div className="mt-4 flex gap-2">
                  <Button block variant="accent" trailing={ArrowRight} onClick={() => { track('open_colours', 'mystyle'); navigate('app.colours') }}>
                    See my palette
                  </Button>
                  <motion.button type="button" whileTap={tap} transition={spring.ui} onClick={() => { track('colour_retake'); navigate('app.colourquiz') }} className="h-11 shrink-0 rounded-full px-4 text-[14px] font-bold text-on-ink ring-1 ring-inset ring-[rgb(255_255_255/0.3)]">
                    Retake
                  </motion.button>
                </div>
              </div>
            </>
          ) : (
            <div className="relative p-5">
              <div aria-hidden className="facet" style={{ opacity: 0.35 }} />
              <span className="label text-gold-light">My Colours · opt-in</span>
              <p className="grot mt-1 text-[28px]">Find my colours</p>
              <p className="mt-1.5 text-[13px] text-on-ink-2">Eight quick questions give your undertone, colour season, a palette of best colours and the metals that suit you. Used in every analysis after.</p>
              <div className="mt-3 flex -space-x-1">
                {DEEP_AUTUMN.palette.slice(0, 6).map((c) => (
                  <Swatch key={c.hex} hex={c.hex} size={24} label={false} className="ring-2 ring-[var(--ink)]" />
                ))}
              </div>
              <Button block className="mt-4" icon={Palette} onClick={() => { track('colour_start', 'mystyle'); navigate('app.colourquiz') }}>
                Find my colours
              </Button>
            </div>
          )}
        </motion.div>
        <motion.p variants={listItem} className="meta mx-5 mt-4 text-text-3">Your answers and likes are stored on your profile and are the basis for every analysis.</motion.p>
      </motion.div>
    </MobileScreen>
  )
}
