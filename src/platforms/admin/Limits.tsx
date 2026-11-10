import { motion } from 'framer-motion'
import { Bell, Save } from 'lucide-react'
import { useState, type ChangeEvent } from 'react'
import { Bar, BarChart, CartesianGrid, Cell, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Badge } from '../../components/Badge'
import { IceRing } from '../../components/Brand'
import { Button } from '../../components/Button'
import { CHART } from '../../components/Charts'
import { Input } from '../../components/Form'
import { KPI, LIMIT_EVENTS, SPEND } from '../../data/admin'
import { pct, usd } from '../../data/clock'
import { useNav } from '../../lib/navigation'
import { session, useSession } from '../../lib/store'
import { track } from '../../lib/tracker'
import { listItem, listParent } from '../../motion/transitions'
import { ConsoleShell, Panel } from '../console/shell'

/* admin.limits: the daily and hourly analysis caps, per-IP and per-device
   limits on login, sign-up, verification and reset, the global AI spend
   cap with its alert threshold, and the photo retention period. All
   editable without a redeploy; enforced server-side. */

type FormKey = 'daily' | 'hourly' | 'verify' | 'login' | 'signup' | 'reset' | 'spendCap' | 'alertPct' | 'retention'

export default function AdminLimits() {
  const { toast } = useNav()
  const limits = useSession((s) => s.limits)
  const [form, setForm] = useState<Record<FormKey, string>>({
    daily: String(limits.daily),
    hourly: String(limits.hourly),
    verify: String(limits.verifyPerHour),
    login: String(limits.loginPerHour),
    signup: String(limits.signupPerHourIp),
    reset: String(limits.resetPerHour),
    spendCap: String(limits.spendCap),
    alertPct: String(limits.alertPct),
    retention: String(limits.retentionMonths),
  })
  const spentPct = pct(KPI.spendMonth, limits.spendCap)
  const field = (k: FormKey) => ({ value: form[k], onChange: (e: ChangeEvent<HTMLInputElement>) => setForm((s) => ({ ...s, [k]: e.target.value })), inputMode: 'numeric' as const })

  const save = () => {
    const n = (v: string) => Number(v)
    const all = Object.values(form)
    if (all.some((v) => !v.trim() || Number.isNaN(n(v)) || n(v) < 0)) return toast('Every limit needs a whole number', 'warn')
    if (n(form.hourly) < n(form.daily) / 24) return toast('The hourly cap can’t be lower than a day’s share', 'warn')
    session.setLimits({
      daily: n(form.daily),
      hourly: n(form.hourly),
      verifyPerHour: n(form.verify),
      loginPerHour: n(form.login),
      signupPerHourIp: n(form.signup),
      resetPerHour: n(form.reset),
      spendCap: n(form.spendCap),
      alertPct: n(form.alertPct),
      retentionMonths: n(form.retention),
    })
    track('admin_limits_save', form.daily)
    toast(`Saved. ${form.daily} per day, ${form.hourly} per hour, cap ${usd(n(form.spendCap))}. Live now, no redeploy.`, 'accent')
  }

  const dailyShare = limits.spendCap / 30

  return (
    <ConsoleShell
      active="admin.limits"
      title="Limits & spend"
      sub="Enforced on the server, even against a modified app. Editable here without a redeploy."
      actions={
        <Button size="sm" variant="ink" icon={Save} onClick={save}>
          Save limits
        </Button>
      }
    >
      <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-6 px-8 pb-10 max-md:grid-cols-1 max-md:px-4">
        <div className="flex flex-col gap-6">
          <Panel title="Analysis limits" action={<Badge tone="accent">per member</Badge>}>
            <motion.div variants={listParent} initial="hidden" animate="show" className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
              <motion.div variants={listItem}>
                <Input label="Analyses per day" {...field('daily')} hint="Resets at local midnight" />
              </motion.div>
              <motion.div variants={listItem}>
                <Input label="Anti-abuse cap per hour" {...field('hourly')} hint="Rolling 60 minutes" />
              </motion.div>
            </motion.div>
            <div className="mt-4 rounded-[var(--r-card)] bg-ink p-4 text-on-ink">
              <p className="label text-gold-light">The message members see</p>
              <p className="mt-1 text-[14px]">“You’ve reached today’s limit. Try again in 3 hours.”</p>
              <p className="meta mt-1 text-on-ink-2">HTTP 429 · retry-after header · refusals count, failed photos don’t</p>
            </div>
          </Panel>

          <Panel title="Abuse limits" action={<span className="meta text-text-2">per IP and per device</span>}>
            <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
              <Input label="Verification attempts / hour" {...field('verify')} />
              <Input label="Login attempts / hour" {...field('login')} />
              <Input label="Sign-ups / hour / IP" {...field('signup')} />
              <Input label="Password resets / hour" {...field('reset')} />
            </div>
            <ul className="mt-4 divide-y divide-[var(--rule)]">
              {LIMIT_EVENTS.filter((e) => e.kind === 'verify' || e.kind === 'login').map((e) => (
                <li key={e.id} className="flex items-center gap-3 py-2 text-[12.5px]">
                  <span className="meta w-[96px] shrink-0 text-text-2">
                    {e.iso.slice(5)} {e.time}
                  </span>
                  <Badge tone="danger">{e.kind}</Badge>
                  <span className="truncate">{e.detail}</span>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel title="Photo retention">
            <Input label="Months before outfit photos auto-delete" {...field('retention')} hint="Unless the member ticks “Keep my photos”. Scores and text stay in history without the photo." />
          </Panel>
        </div>

        <div className="flex flex-col gap-6">
          <Panel title="AI spend cap" action={<Badge tone={spentPct >= limits.alertPct ? 'warn' : 'success'}>{spentPct}% used</Badge>}>
            <div className="flex items-center gap-5">
              <IceRing value={spentPct} size={120} stroke={9} color={spentPct >= limits.alertPct ? 'var(--gold)' : 'var(--text)'}>
                <span className="figure num text-[30px]">{usd(KPI.spendMonth)}</span>
                <span className="label text-text-2">of {usd(limits.spendCap)}</span>
              </IceRing>
              <div className="flex-1">
                <div className="grid grid-cols-2 gap-3">
                  <Input label="Monthly cap (USD)" {...field('spendCap')} dense />
                  <Input label="Alert at (%)" {...field('alertPct')} dense />
                </div>
                <p className="mt-2 flex items-center gap-1.5 text-[12px] text-text-2">
                  <Bell size={12} aria-hidden /> Alert emailed Nov 8 at 80% to hazel@demo-iceycrew.app
                </p>
              </div>
            </div>
            <div className="mt-4 h-[160px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={SPEND} margin={{ top: 4, right: 8, left: -22, bottom: 0 }}>
                  <CartesianGrid stroke={CHART.grid} vertical={false} />
                  <XAxis dataKey="d" tick={CHART.axis} axisLine={false} tickLine={false} />
                  <YAxis tick={CHART.axis} axisLine={false} tickLine={false} width={46} tickFormatter={(v: number) => `$${v}`} />
                  <Tooltip {...CHART.tooltip} formatter={(v: number) => [usd(v), 'AI spend']} />
                  <ReferenceLine y={dailyShare} stroke={CHART.series.gold} strokeDasharray="4 4" />
                  <Bar dataKey="usd" radius={[5, 5, 0, 0]}>
                    {SPEND.map((s) => (
                      <Cell key={s.d} fill={s.usd > dailyShare ? CHART.series.gold : CHART.series.ink} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="meta mt-2 text-text-3">November, by day. Dashed line: the cap’s daily share. At 100% analyses pause with a friendly message until the month resets or the cap is raised.</p>
          </Panel>

          <Panel title="What happens at the limit">
            <ol className="flex flex-col gap-2.5 text-[13px]">
              {['The backend returns HTTP 429 with a retry-after value.', 'The app shows the friendly message with the real wait, and keeps history open.', 'The event is logged with member, kind and time; it appears under Usage.', 'Limits reset correctly: daily at local midnight, hourly on a rolling window, spend on the 1st.'].map((t, i) => (
                <li key={t} className="flex gap-3">
                  <span className="num grid h-6 w-6 shrink-0 place-items-center rounded-full bg-gold text-[11px] font-bold text-on-gold">{i + 1}</span>
                  {t}
                </li>
              ))}
            </ol>
          </Panel>
        </div>
      </div>
    </ConsoleShell>
  )
}
