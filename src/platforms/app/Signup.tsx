import { motion } from 'framer-motion'
import { ArrowRight, Apple, Eye, EyeOff, Lock, Mail, ShieldCheck } from 'lucide-react'
import { useState } from 'react'
import { Vip } from '../../components/Brand'
import { Button } from '../../components/Button'
import { CheckMark, Field, Input } from '../../components/Form'
import { DEMO_SIGNUP } from '../../data/demoFill'
import { useNav } from '../../lib/navigation'
import { track } from '../../lib/tracker'
import { listItem, listParent } from '../../motion/transitions'
import { Dock, MobileScreen, TopBar } from '../mobileShell'

/* app.signup: create the account after verification. Email is pre-filled
   from the order; Apple and Google keep the account linked to the same
   Shopify customer; 16+ is confirmed with a date of birth. */

function GoogleG() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
      <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.6l6.7-6.7C35.6 2.6 30.2 0 24 0 14.6 0 6.6 5.4 2.7 13.2l7.8 6.1C12.4 13.4 17.7 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4 7.1-10 7.1-17.5z" />
      <path fill="#FBBC05" d="M10.5 28.7c-.5-1.5-.8-3-.8-4.7s.3-3.2.8-4.7l-7.8-6.1C1 16.4 0 20.1 0 24s1 7.6 2.7 10.8l7.8-6.1z" />
      <path fill="#34A853" d="M24 48c6.2 0 11.6-2 15.4-5.6l-7.5-5.8c-2.1 1.4-4.8 2.3-7.9 2.3-6.3 0-11.6-3.9-13.5-9.3l-7.8 6.1C6.6 42.6 14.6 48 24 48z" />
    </svg>
  )
}

export default function AppSignup() {
  const { navigate, toast } = useNav()
  const [email, setEmail] = useState(DEMO_SIGNUP.email)
  const [password, setPassword] = useState(DEMO_SIGNUP.password)
  const [dob, setDob] = useState(DEMO_SIGNUP.dob)
  const [over16, setOver16] = useState(DEMO_SIGNUP.over16)
  const [show, setShow] = useState(false)
  const [error, setError] = useState<string | undefined>()

  const go = (method: string) => {
    track('create_account', method)
    navigate('app.onboarding')
  }
  const submit = () => {
    if (!email.includes('@')) return setError('Enter a valid email')
    if (password.length < 8) return setError('Use at least 8 characters')
    if (!over16) return setError('You need to be 16 or older to use the app')
    setError(undefined)
    go('email')
  }

  return (
    <MobileScreen
      header={<TopBar title="Create your account" />}
      dock={
        <Dock tone="surface">
          <Button size="lg" block trailing={ArrowRight} onClick={submit}>
            Create account
          </Button>
        </Dock>
      }
    >
      <motion.div variants={listParent} initial="hidden" animate="show" className="px-5 pt-2">
        <motion.div variants={listItem} className="flex items-center gap-2">
          <Vip label="VIP verified" />
          <span className="meta text-text-2">· linked to #IC-48213</span>
        </motion.div>
        <motion.h1 variants={listItem} className="grot mt-2 text-[34px]">
          Nearly there, <em>Maya.</em>
        </motion.h1>
        <motion.p variants={listItem} className="mt-2 text-[14px] leading-snug text-text-2">
          Pick how you’d like to sign in. Whichever you choose, your account stays linked to the verified VIP order.
        </motion.p>
        <motion.ul variants={listItem} className="scroll-x -mx-5 mt-4 flex gap-1.5 px-5">
          {[['Password reset', 'any time'], ['Persistent session', 'stays signed in'], ['Log out', 'from Account'], ['Delete account', 'complete, in-app']].map(([t, s]) => (
            <li key={t} className="label inline-flex h-7 shrink-0 snap-start items-center gap-1.5 rounded-full bg-[var(--surface-high)] px-2.5 text-text">
              {t} <span className="font-semibold normal-case tracking-normal text-text-2">· {s}</span>
            </li>
          ))}
        </motion.ul>

        <motion.div variants={listItem} className="mt-5 grid grid-cols-2 gap-2">
          <Button variant="ink" size="lg" icon={Apple} onClick={() => go('apple')}>
            Apple
          </Button>
          <Button variant="outline" size="lg" onClick={() => go('google')} className="gap-2.5">
            <GoogleG /> Google
          </Button>
        </motion.div>

        <motion.div variants={listItem} className="my-5 flex items-center gap-3">
          <span className="h-px flex-1 bg-[var(--rule-strong)]" />
          <span className="label text-text-2">or with email</span>
          <span className="h-px flex-1 bg-[var(--rule-strong)]" />
        </motion.div>

        <motion.div variants={listItem} className="flex flex-col gap-4">
          <Input label="Email" hint="Pre-filled from your order. We’ll send a confirmation link." type="email" autoComplete="email" value={email} onChange={(e) => { setEmail(e.target.value); setError(undefined) }} leading={<Mail size={16} />} error={error && !email.includes('@') ? error : undefined} />
          <Input
            label="Password"
            type={show ? 'text' : 'password'}
            autoComplete="new-password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(undefined) }}
            leading={<Lock size={16} />}
            trailing={
              <button type="button" onClick={() => setShow((s) => !s)} aria-label={show ? 'Hide password' : 'Show password'} aria-pressed={show} className="-mr-2 grid h-10 w-10 place-items-center rounded-full text-text-2 hover:bg-[var(--surface-high)]">
                {show ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            }
            error={error && email.includes('@') && password.length < 8 ? error : undefined}
          />
          <Input label="Date of birth" type="date" value={dob} onChange={(e) => setDob(e.target.value)} hint="Minimum age 16. Under-16s can’t create an account." />
          <Field label="Age confirmation" error={error && over16 === false ? error : undefined}>
            <button type="button" role="checkbox" aria-checked={over16} onClick={() => { setOver16((v) => !v); setError(undefined) }} className="flex min-h-[48px] w-full items-center gap-3 rounded-[var(--r-control)] bg-[var(--surface)] px-3.5 text-left text-[14px] font-semibold shadow-[var(--shadow-raised)]">
              <CheckMark on={over16} />
              I confirm I’m 16 or older
            </button>
          </Field>
        </motion.div>

        <motion.div variants={listItem} className="mt-5 flex gap-3 rounded-[var(--r-card)] bg-[var(--surface-tint)] p-4">
          <ShieldCheck size={18} className="mt-0.5 shrink-0 text-gold-ink" aria-hidden />
          <p className="text-[12.5px] leading-relaxed text-text-2">
            <span className="font-bold text-text">One record, whichever door you use.</span> Sign in with Apple or Google under a different email and the account still points at Shopify customer 7731420 and subscription sub_A91K2Q. Password reset, persistent sessions, logout and account deletion are all in Account & Settings.
          </p>
        </motion.div>

        <motion.p variants={listItem} className="mt-4 text-center text-[12px] text-text-2">
          By continuing you agree to the{' '}
          <button type="button" onClick={() => toast('Terms of Service open in the in-app browser', 'info')} className="font-bold text-text underline underline-offset-4">
            Terms
          </button>{' '}
          and{' '}
          <button type="button" onClick={() => toast('Privacy Policy opens in the in-app browser', 'info')} className="font-bold text-text underline underline-offset-4">
            Privacy Policy
          </button>
          .
        </motion.p>
      </motion.div>
    </MobileScreen>
  )
}
