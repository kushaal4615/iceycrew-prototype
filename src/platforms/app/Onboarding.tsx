import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Check, Save } from 'lucide-react'
import { Button } from '../../components/Button'
import { HeroImage } from '../../components/Media'
import { QUESTIONS } from '../../data/content'
import { useNav } from '../../lib/navigation'
import { session, useSession } from '../../lib/store'
import { track } from '../../lib/tracker'
import { spring, tap } from '../../motion/springs'
import { listItem, listParent } from '../../motion/transitions'
import { Dock, MobileScreen, StepBar, safeTop } from '../mobileShell'

/* app.onboarding: "Hi Maya! Let's get to know your style first…", then one
   multiple-choice question per screen with a progress bar. Answers are
   pre-selected from Maya's stored profile, so every step is one tap.
   Resumable: the step is kept in the session. */

const TOTAL = QUESTIONS.length + 1

export default function AppOnboarding() {
  const { navigate, back, canGoBack, toast } = useNav()
  const step = useSession((s) => s.onboardingStep)
  const answers = useSession((s) => s.onboardingAnswers)
  const q = step > 0 ? QUESTIONS[step - 1] : null
  const chosen = q ? answers[q.id] ?? [] : []

  const next = () => {
    if (q && chosen.length === 0) return toast('Pick at least one option to continue', 'warn')
    if (step < QUESTIONS.length) {
      track('onboarding_next', step + 1)
      session.setOnboardingStep(step + 1)
    } else {
      track('onboarding_questions_done')
      session.setOnboardingStep(0)
      navigate('app.swipe')
    }
  }
  const prev = () => {
    if (step === 0) return back()
    session.setOnboardingStep(step - 1)
  }
  const pick = (id: string) => {
    if (!q) return
    if (q.multi) session.answer(q.id, chosen.includes(id) ? chosen.filter((x) => x !== id) : [...chosen, id])
    else session.answer(q.id, [id])
  }

  return (
    <MobileScreen
      header={step === 0 ? undefined : <StepBar step={step} total={TOTAL} label={`${q!.topic} · question ${step} of ${QUESTIONS.length}`} onBack={prev} />}
      dock={
        <Dock tone="surface">
          {step === 0 ? (
            <Button size="lg" block trailing={ArrowRight} onClick={next}>
              Let’s go
            </Button>
          ) : (
            <>
              <button
                type="button"
                onClick={() => {
                  track('onboarding_save_exit', step)
                  toast(`Saved at question ${step}. You can pick up where you left off.`, 'info')
                  if (canGoBack) back()
                  else navigate('app.swipe')
                }}
                aria-label="Save and continue later"
                className="grid h-[56px] w-[56px] shrink-0 place-items-center rounded-full bg-[var(--surface-high)] text-text"
              >
                <Save size={20} />
              </button>
              <Button size="lg" block trailing={ArrowRight} onClick={next}>
                {step === QUESTIONS.length ? 'On to the swipe deck' : 'Continue'}
              </Button>
            </>
          )}
        </Dock>
      }
    >
      <AnimatePresence mode="wait" initial={false}>
        {step === 0 ? (
          <motion.div key="greet" initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -18 }} transition={spring.page} className="relative">
            <HeroImage src="rackNeutrals" alt="" scrim="b" width={900} className="h-[380px]" position="center 40%">
              <div className="flex h-full flex-col justify-end p-5 text-on-night" style={{ paddingTop: safeTop(0) }}>
                <span className="label text-gold-light">Step 1 of {TOTAL} · about a minute</span>
                <h1 className="grot mt-2 text-[40px] leading-[0.95]">
                  Hi Maya! Let’s get to know your <em className="text-gold-light">style</em> first…
                </h1>
              </div>
            </HeroImage>
            <motion.ul variants={listParent} initial="hidden" animate="show" className="px-5 pt-5">
              {[
                ['6 quick questions', 'Sections, body shape, height and fit, occasions, budget, colours'],
                ['A 20-card swipe deck', 'Right for like, left for not you. Tap buttons work too'],
                ['Then every scan knows you', 'Your answers and likes are the basis for every analysis'],
              ].map(([t, s], i) => (
                <motion.li key={t} variants={listItem} className="flex gap-3 py-3">
                  <span className="num grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gold text-[13px] font-extrabold text-on-gold">{i + 1}</span>
                  <span>
                    <span className="block text-[15px] font-bold">{t}</span>
                    <span className="block text-[13px] text-text-2">{s}</span>
                  </span>
                </motion.li>
              ))}
            </motion.ul>
            <ul className="scroll-x mt-2 flex gap-1.5 px-5">
              {QUESTIONS.map((x, i) => (
                <li key={x.id} className="label inline-flex h-7 shrink-0 snap-start items-center gap-1.5 rounded-full bg-[var(--surface-high)] px-2.5 text-text">
                  <span className="num text-gold-ink">{i + 1}</span> {x.topic}
                </li>
              ))}
            </ul>
            <p className="meta mt-3 px-5 text-text-3">Quit halfway and we save your place: Maya last stopped at question 4, 2 days ago. Scans stay locked until you finish.</p>
          </motion.div>
        ) : (
          <motion.div key={q!.id} initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -18 }} transition={spring.page} className="px-5 pt-3">
            <h1 className="grot text-[32px] leading-[1]">{q!.prompt}</h1>
            <p className="mt-2 text-[13px] text-text-2">{q!.multi ? 'Choose all that apply.' : 'Choose one.'} {q!.illustrated ? 'Shapes are a guide, not a rule.' : ''}</p>
            <motion.ul variants={listParent} initial="hidden" animate="show" className={`mt-5 ${q!.illustrated ? 'grid grid-cols-3 gap-2.5' : 'flex flex-col gap-2'}`}>
              {q!.options.map((o) => {
                const on = chosen.includes(o.id)
                if (q!.illustrated)
                  return (
                    <motion.li key={o.id} variants={listItem}>
                      <motion.button type="button" whileTap={tap} transition={spring.ui} onClick={() => pick(o.id)} aria-pressed={on} className={`flex aspect-[4/5] w-full flex-col items-center justify-end gap-2 rounded-[var(--r-card)] p-3 transition-colors ${on ? 'bg-ink text-on-ink' : 'bg-[var(--surface)] text-text shadow-[var(--shadow-raised)]'}`}>
                        {o.glyph ? (
                          <svg viewBox="0 0 32 24" className="h-14 w-14" aria-hidden>
                            <path d={o.glyph} fill={on ? 'var(--gold)' : 'var(--paper-300)'} />
                          </svg>
                        ) : (
                          <span className={`grid h-14 w-14 place-items-center rounded-full ${on ? 'bg-[rgb(255_255_255/0.12)]' : 'bg-[var(--surface-high)]'}`}>—</span>
                        )}
                        <span className="text-center text-[12.5px] font-bold leading-tight">{o.label}</span>
                      </motion.button>
                    </motion.li>
                  )
                return (
                  <motion.li key={o.id} variants={listItem}>
                    <motion.button type="button" whileTap={tap} transition={spring.ui} onClick={() => pick(o.id)} aria-pressed={on} className={`flex min-h-[56px] w-full items-center gap-3 rounded-[var(--r-card)] px-4 text-left transition-colors ${on ? 'bg-ink text-on-ink' : 'bg-[var(--surface)] text-text shadow-[var(--shadow-raised)]'}`}>
                      <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full ${on ? 'bg-gold text-on-gold' : 'ring-1 ring-inset ring-[var(--rule-strong)]'}`}>{on && <Check size={14} strokeWidth={3} aria-hidden />}</span>
                      <span className="flex-1 text-[15px] font-semibold">{o.label}</span>
                      {o.sub && <span className={`text-[12px] ${on ? 'text-on-ink-2' : 'text-text-2'}`}>{o.sub}</span>}
                    </motion.button>
                  </motion.li>
                )
              })}
            </motion.ul>
            <p className="meta mt-5 text-text-3">Questions are editable in the admin panel. Your answers are saved to your profile.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </MobileScreen>
  )
}
