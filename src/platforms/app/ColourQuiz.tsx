import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Check } from 'lucide-react'
import { useState } from 'react'
import { Button } from '../../components/Button'
import { COLOUR_QUIZ } from '../../data/content'
import { useNav } from '../../lib/navigation'
import { session, useSession } from '../../lib/store'
import { track } from '../../lib/tracker'
import { spring, tap } from '../../motion/springs'
import { listItem, listParent } from '../../motion/transitions'
import { Dock, MobileScreen, StepBar } from '../mobileShell'

/* app.colourquiz: 6–10 questions (eight here), one per screen, editable in
   the admin. The wording stays neutral and inclusive; the same answers
   always give the same result. Answers are pre-selected from Maya's
   profile so every step is one tap. */

const SWATCH: Record<string, string> = { blue: '#5B7CC8', green: '#5E8C5A', mixed: '#8B8A7A', gold: '#E6B316', silver: '#B9BCC2', cream: '#EADBC2', pure: '#FFFFFF', peach: '#F2A07B', pink: '#E58BA6', brick: '#B5533C' }

export default function AppColourQuiz() {
  const { navigate, back, toast } = useNav()
  const answers = useSession((s) => s.colourAnswers)
  const [step, setStep] = useState(0)
  const q = COLOUR_QUIZ[step]
  const chosen = answers[q.id] ?? []

  const next = () => {
    if (!chosen.length) return toast('Pick one to continue', 'warn')
    if (step < COLOUR_QUIZ.length - 1) return setStep(step + 1)
    track('colour_quiz_completed')
    session.finishColour()
    navigate('app.colours')
  }

  return (
    <MobileScreen
      header={<StepBar step={step + 1} total={COLOUR_QUIZ.length} label={`${q.topic} · question ${step + 1} of ${COLOUR_QUIZ.length}`} onBack={() => (step === 0 ? back() : setStep(step - 1))} />}
      dock={
        <Dock tone="surface">
          <Button size="lg" block trailing={ArrowRight} onClick={next}>
            {step === COLOUR_QUIZ.length - 1 ? 'See my colours' : 'Continue'}
          </Button>
        </Dock>
      }
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={q.id} initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -18 }} transition={spring.page} className="px-5 pt-3">
          <h1 className="grot text-[32px] leading-[1]">{q.prompt}</h1>
          <p className="mt-2 text-[13px] text-text-2">No wrong answers. If you’re unsure, go with your first instinct.</p>
          <motion.ul variants={listParent} initial="hidden" animate="show" className="mt-5 flex flex-col gap-2">
            {q.options.map((o) => {
              const on = chosen.includes(o.id)
              const sw = SWATCH[o.id]
              return (
                <motion.li key={o.id} variants={listItem}>
                  <motion.button type="button" whileTap={tap} transition={spring.ui} onClick={() => session.colourAnswer(q.id, [o.id])} aria-pressed={on} className={`flex min-h-[60px] w-full items-center gap-3 rounded-[var(--r-card)] px-4 text-left transition-colors ${on ? 'bg-ink text-on-ink' : 'bg-[var(--surface)] text-text shadow-[var(--shadow-raised)]'}`}>
                    {sw ? <span className="h-8 w-8 shrink-0 rounded-full ring-1 ring-[rgb(17_17_17/0.12)]" style={{ background: sw }} aria-hidden /> : <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full ${on ? 'bg-gold text-on-gold' : 'ring-1 ring-inset ring-[var(--rule-strong)]'}`}>{on && <Check size={14} strokeWidth={3} aria-hidden />}</span>}
                    <span className="flex-1 text-[15px] font-semibold">{o.label}</span>
                    {sw && on && <Check size={18} strokeWidth={3} className="text-gold-light" aria-hidden />}
                  </motion.button>
                </motion.li>
              )
            })}
          </motion.ul>
          <ul className="scroll-x -mx-5 mt-5 flex gap-1.5 px-5" aria-label="Your answers so far">
            {COLOUR_QUIZ.slice(0, step).map((qq) => {
              const a = (answers[qq.id] ?? [])[0]
              const label = qq.options.find((o) => o.id === a)?.label ?? '—'
              return (
                <li key={qq.id} className="label inline-flex h-7 shrink-0 snap-start items-center gap-1.5 rounded-full bg-[var(--surface-high)] px-2.5 text-text">
                  {SWATCH[a] && <span className="h-3 w-3 rounded-full" style={{ background: SWATCH[a] }} aria-hidden />}
                  {qq.topic} <span className="font-semibold normal-case tracking-normal text-text-2">· {label}</span>
                </li>
              )
            })}
            {step === 0 && <li className="label inline-flex h-7 shrink-0 items-center rounded-full px-2.5 text-text-2 ring-1 ring-inset ring-[var(--rule-strong)]">8 questions · about a minute</li>}
          </ul>
          <div className="mt-4 rounded-[var(--r-card)] bg-[var(--surface-tint)] p-4 text-[12.5px] leading-snug text-text-2">
            {step < 2 ? 'Undertone questions look at how your skin behaves, not how light or dark it is.' : step < 4 ? 'Contrast questions set how deep or soft your palette should be.' : 'Metals and whites are the quickest tell: a warm undertone usually glows in gold and cream.'} The result is saved to your profile and referenced in every outfit analysis.
          </div>
        </motion.div>
      </AnimatePresence>
    </MobileScreen>
  )
}
