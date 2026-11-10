import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Check, CircleHelp, Hash, Loader2, Mail, ShieldAlert } from 'lucide-react'
import { useState } from 'react'
import { Vip } from '../../components/Brand'
import { Button } from '../../components/Button'
import { Input } from '../../components/Form'
import { HeroImage } from '../../components/Media'
import { BottomSheet } from '../../components/Sheet'
import { DEMO_VERIFY } from '../../data/demoFill'
import { useNav } from '../../lib/navigation'
import { session } from '../../lib/store'
import { track } from '../../lib/tracker'
import { spring } from '../../motion/springs'
import { fadeUp, listItem, listParent } from '../../motion/transitions'
import { Dock, MobileScreen, TopBar } from '../mobileShell'

/* app.verify: checkout email + order number, then the five Shopify checks
   animate to ticks. Every failure reason has its own friendly message
   (shown from the "Other outcomes" row), rate-limited at 5 per hour. */

const CHECKS = [
  'Order exists on the IceyCrew store',
  'Email matches the order (not case-sensitive)',
  'Order contains the VIP membership product',
  'VIP subscription is active and paid',
  'Order is not already linked to another account',
]

const OUTCOMES: { id: string; label: string; message: string }[] = [
  { id: 'nf', label: 'Order not found', message: 'We couldn’t find that order number. Check the confirmation email from IceyCrew: it starts with #IC-.' },
  { id: 'em', label: 'Email mismatch', message: 'That email doesn’t match the order. Try the one you used at checkout.' },
  { id: 'np', label: 'No VIP in order', message: 'This order doesn’t include VIP membership. Become a VIP on iceycrew.com and come back with that order.' },
  { id: 'in', label: 'Not active', message: 'Your VIP subscription isn’t active right now. Manage it on iceycrew.com, then verify again.' },
  { id: 'al', label: 'Already linked', message: 'This order is already linked to an account. Log in instead, or contact support if that wasn’t you.' },
]

export default function AppVerify() {
  const { navigate, toast } = useNav()
  const [email, setEmail] = useState(DEMO_VERIFY.email)
  const [order, setOrder] = useState(DEMO_VERIFY.order)
  const [phase, setPhase] = useState<'form' | 'checking' | 'done'>('form')
  const [passed, setPassed] = useState(0)
  const [help, setHelp] = useState(false)
  const [error, setError] = useState<string | undefined>()

  const submit = () => {
    if (!email.includes('@')) return setError('Enter the email you used at checkout')
    if (!/^#?IC-\d{4,6}$/i.test(order.trim())) return setError('Order numbers look like #IC-48213')
    setError(undefined)
    track('verify_submit', order)
    setPhase('checking')
    CHECKS.forEach((_, i) => window.setTimeout(() => setPassed(i + 1), 320 * (i + 1)))
    window.setTimeout(() => {
      setPhase('done')
      session.verify()
    }, 320 * CHECKS.length + 380)
  }

  return (
    <MobileScreen
      header={<TopBar title="Verify your VIP order" />}
      dock={
        <Dock tone="surface">
          {phase === 'done' ? (
            <Button size="lg" block trailing={ArrowRight} onClick={() => { track('verify_continue'); navigate('app.signup') }}>
              Create my account
            </Button>
          ) : (
            <Button size="lg" block trailing={ArrowRight} onClick={submit} disabled={phase === 'checking'} aria-busy={phase === 'checking'}>
              {phase === 'checking' ? 'Checking with the store…' : 'Verify my order'}
            </Button>
          )}
        </Dock>
      }
      overlay={
        <BottomSheet open={help} onClose={() => setHelp(false)} title="Where’s my order number?">
          <p className="text-[15px] leading-relaxed text-text-2">It’s in the order confirmation email from IceyCrew, in the subject line and at the top of the receipt. It starts with <span className="font-bold text-text">#IC-</span>. You can also find it under Orders in your IceyCrew customer portal.</p>
          <HeroImage src="goldNecklace" alt="" scrim="b" width={700} className="mt-4 aspect-[16/9] rounded-[var(--r-card)]">
            <div className="flex h-full flex-col justify-end p-4 text-on-night">
              <span className="label text-gold-light">Order confirmation</span>
              <span className="grot text-[22px]">Your IceyCrew order #IC-48213</span>
              <span className="meta mt-1 text-on-night-2">VIP Membership · monthly · paid</span>
            </div>
          </HeroImage>
          <Button block className="mt-5" variant="ink" onClick={() => setHelp(false)}>
            Got it
          </Button>
        </BottomSheet>
      }
    >
      <motion.div variants={listParent} initial="hidden" animate="show" className="px-5 pt-2">
        <motion.div variants={listItem} className="flex items-center gap-2">
          <Vip />
          <span className="meta text-text-2">· monthly, billed by the IceyCrew store</span>
        </motion.div>
        <motion.h1 variants={listItem} className="grot mt-2 text-[34px]">
          Two things from your <em>checkout email.</em>
        </motion.h1>
        <motion.p variants={listItem} className="mt-2 text-[14px] leading-snug text-text-2">
          We check them with the store once. The app itself never talks to Shopify; it asks our membership layer, which does.
        </motion.p>
        <motion.ul variants={listItem} className="scroll-x -mx-5 mt-3 flex gap-1.5 px-5">
          {['Order placed 8 months ago', 'Renewal due Dec 3', 'Monthly · $19.99', 'Subscription active'].map((t) => (
            <li key={t} className="label inline-flex h-7 shrink-0 snap-start items-center rounded-full bg-[var(--surface-high)] px-2.5 text-text">{t}</li>
          ))}
        </motion.ul>

        <motion.div variants={listItem} className="mt-6 flex flex-col gap-4">
          <Input label="Checkout email" type="email" inputMode="email" autoComplete="email" value={email} onChange={(e) => { setEmail(e.target.value); setError(undefined) }} leading={<Mail size={16} />} error={error && !email.includes('@') ? error : undefined} disabled={phase !== 'form'} />
          <Input
            label="Order number"
            value={order}
            onChange={(e) => { setOrder(e.target.value); setError(undefined) }}
            leading={<Hash size={16} />}
            trailing={
              <button type="button" onClick={() => setHelp(true)} aria-label="Where is my order number?" className="-mr-2 grid h-10 w-10 place-items-center rounded-full text-text-2 hover:bg-[var(--surface-high)]">
                <CircleHelp size={18} />
              </button>
            }
            error={error && email.includes('@') ? error : undefined}
            disabled={phase !== 'form'}
          />
        </motion.div>

        {/* the five checks */}
        <motion.div variants={listItem} className="mt-6 rounded-[var(--r-card)] bg-[var(--surface)] p-4 shadow-[var(--shadow-raised)]">
          <div className="flex items-center justify-between">
            <span className="label text-text-2">What we check</span>
            <AnimatePresence mode="wait">
              {phase === 'checking' && (
                <motion.span key="spin" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="meta flex items-center gap-1.5 text-text-2">
                  <Loader2 size={12} className="animate-spin" aria-hidden /> Shopify Admin API
                </motion.span>
              )}
              {phase === 'done' && (
                <motion.span key="ok" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={spring.pop} className="label rounded-full bg-success-soft px-2.5 py-1 text-on-success-soft">
                  Verified · linked
                </motion.span>
              )}
            </AnimatePresence>
          </div>
          <ol className="mt-3 flex flex-col gap-2.5">
            {CHECKS.map((c, i) => {
              const ok = passed > i
              return (
                <li key={c} className="flex items-center gap-3">
                  <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full transition-colors duration-200 ${ok ? 'bg-gold text-on-gold' : 'bg-[var(--surface-high)] text-text-3'}`}>
                    {ok ? (
                      <motion.span initial={{ scale: 0.4 }} animate={{ scale: 1 }} transition={spring.pop} className="grid place-items-center">
                        <Check size={14} strokeWidth={3} aria-hidden />
                      </motion.span>
                    ) : (
                      <span className="num text-[11px] font-bold">{i + 1}</span>
                    )}
                  </span>
                  <span className={`text-[13.5px] ${ok ? 'font-semibold text-text' : 'text-text-2'}`}>{c}</span>
                </li>
              )
            })}
          </ol>
        </motion.div>

        <AnimatePresence>
          {phase === 'done' && (
            <motion.div variants={fadeUp} initial="hidden" animate="show" exit={{ opacity: 0 }} className="mt-4 overflow-hidden rounded-[var(--r-card)] bg-ink p-4 text-on-ink">
              <div aria-hidden className="facet-soft" />
              <p className="label text-gold-light">Linked to your membership record</p>
              <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1.5 text-[12.5px]">
                <dt className="text-on-ink-2">Status</dt>
                <dd className="font-bold">Active · VIP</dd>
                <dt className="text-on-ink-2">Paid until</dt>
                <dd className="num font-bold">Dec 3, 2026</dd>
                <dt className="text-on-ink-2">Provider</dt>
                <dd className="font-bold">Shopify · #IC-48213</dd>
              </dl>
            </motion.div>
          )}
        </AnimatePresence>

        {/* the error-state preview, for the demo */}
        <motion.div variants={listItem} className="mt-6">
          <p className="label flex items-center gap-1.5 text-text-2">
            <ShieldAlert size={12} aria-hidden /> Other outcomes, each with its own message
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {OUTCOMES.map((o) => (
              <button
                key={o.id}
                type="button"
                onClick={() => {
                  track('verify_outcome_preview', o.id)
                  toast(o.message, o.id === 'al' ? 'info' : 'warn')
                }}
                className="h-9 rounded-full bg-[var(--surface-high)] px-3 text-[12.5px] font-bold text-text"
              >
                {o.label}
              </button>
            ))}
            <button type="button" onClick={() => { track('login_instead'); navigate('app.home') }} className="h-9 rounded-full px-3 text-[12.5px] font-bold text-gold-ink ring-1 ring-inset ring-[var(--gold)]">
              Log in instead
            </button>
          </div>
          <p className="meta mt-3 text-text-3">Failed attempts are limited to 5 per hour per device and IP. Messages never reveal another customer’s details.</p>
        </motion.div>
      </motion.div>
    </MobileScreen>
  )
}
