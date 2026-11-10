import { motion } from 'framer-motion'
import { ArrowUpRight, Download, Inbox, TrendingUp } from 'lucide-react'
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Avatar } from '../../components/Avatar'
import { Badge } from '../../components/Badge'
import { Bar as BrandBar, IceRing } from '../../components/Brand'
import { Button, Pressable } from '../../components/Button'
import { CHART } from '../../components/Charts'
import { HeroImage } from '../../components/Media'
import { COUNTRY_LABEL, DAILY, FUNNEL, KPI, MEMBERS, PROVIDER_EVENTS, REPORTS, memberById, type Country } from '../../data/admin'
import { CLOCK, compact, pct, usd } from '../../data/clock'
import { useNav } from '../../lib/navigation'
import { newReports, session, useSession } from '../../lib/store'
import { track } from '../../lib/tracker'
import { listItem, listParent } from '../../motion/transitions'
import { ConsoleShell, Panel } from '../console/shell'

/* admin.overview: a photographic header band with four oversized figures,
   then a chart-led layout (analyses per day · the onboarding funnel), the
   four launch markets, the membership event feed and the new reports. */

const HEADLINE = [
  { label: 'Active members', value: KPI.active.toLocaleString('en-US'), delta: `+${KPI.newThisMonth} joined this month`, up: true },
  { label: 'Analyses · 30d', value: KPI.analyses30d.toLocaleString('en-US'), delta: `${KPI.analysesPerActive} per active member`, up: true },
  { label: 'Average score', value: `${KPI.avgScore}`, delta: 'median latency 6.8s · p95 9.4s', up: true },
  { label: 'Helpfulness', value: KPI.helpfulness.toFixed(1), delta: `${KPI.helpfulnessN.toLocaleString('en-US')} ratings · +0.2 vs Oct`, up: true },
]

const EVENT_TONE: Record<string, 'success' | 'danger' | 'warn' | 'info'> = { renewed: 'success', verified: 'info', cancelled: 'warn', 'payment failed': 'danger', refunded: 'danger' }

export default function AdminOverview() {
  const { navigate, toast } = useNav()
  const pending = useSession(newReports)
  const exports = useSession((s) => s.exports)
  const spendPct = pct(KPI.spendMonth, KPI.spendCap)
  const openMember = (id: string) => {
    session.viewMember(id)
    track('admin_open_member', id)
    navigate('admin.members')
  }
  const total = Object.values(KPI.byCountry).reduce((a, b) => a + b, 0)

  return (
    <ConsoleShell active="admin.overview" title="Overview" bleed>
      {/* ── Header band ── */}
      <HeroImage src="fitBeige" alt="" scrim="full" width={1600} position="center 30%" className="min-h-[300px] text-on-night max-md:min-h-[360px]">
        <div aria-hidden className="scrim-b pointer-events-none absolute inset-0" />
        <div aria-hidden className="grain" />
        <div aria-hidden className="facet" style={{ right: '-6%', bottom: '-40%', width: '34%', opacity: 0.4 }} />
        <motion.div variants={listParent} initial="hidden" animate="show" className="relative flex h-full flex-col justify-between px-8 pb-7 pt-6 max-md:px-4 max-md:pb-5">
          <motion.div variants={listItem} className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="meta text-on-night-2">
                {CLOCK.date} · {CLOCK.time} {CLOCK.tz}
              </p>
              <h1 className="grot mt-2 text-[40px] leading-[0.95] text-on-night max-md:text-[30px]">
                Good morning, Hazel. <em className="text-gold-light">{KPI.analysesToday} scans</em> so far today.
              </h1>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="white" icon={Inbox} onClick={() => navigate('admin.reports')}>
                Reports · {pending}
              </Button>
              <motion.button type="button" whileTap={{ scale: 0.96 }} onClick={() => { session.exportData(); track('admin_export'); toast(`Export ${exports + 1} queued: members, analyses, events as CSV · emailed to hazel@`, 'accent') }} className="inline-flex h-9 items-center gap-1.5 rounded-full px-3.5 text-[13px] font-bold ring-1 ring-inset ring-[rgb(255_255_255/0.4)] hover:bg-[rgb(255_255_255/0.12)]" style={{ color: 'var(--on-night)' }}>
                <Download size={14} aria-hidden /> Export data
              </motion.button>
            </div>
          </motion.div>

          <div className="mt-8 grid grid-cols-4 gap-6 max-md:grid-cols-2 max-md:gap-x-4 max-md:gap-y-5">
            {HEADLINE.map((h) => (
              <motion.div key={h.label} variants={listItem} className="min-w-0 border-l border-[rgb(255_255_255/0.22)] pl-4">
                <span className="label text-on-night-2">{h.label}</span>
                <span className="figure num mt-1 block text-[56px] text-on-night max-md:text-[40px]">{h.value}</span>
                <span className="mt-1.5 flex items-center gap-1 truncate text-[12.5px] font-semibold text-on-night-2">
                  {h.up && <TrendingUp size={13} className="shrink-0 text-gold-light" aria-hidden />}
                  {h.delta}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </HeroImage>

      {/* ── Analyses per day · funnel ── */}
      <div className="grid grid-cols-[minmax(0,1.7fr)_minmax(300px,1fr)] gap-6 px-8 pt-6 max-md:grid-cols-1 max-md:px-4">
        <Panel
          title="Analyses per day"
          action={
            <span className="meta text-text-2">
              14 days · {DAILY.reduce((s, d) => s + d.requested, 0).toLocaleString('en-US')} requested · {DAILY.reduce((s, d) => s + d.failed, 0)} failed · {DAILY.reduce((s, d) => s + d.refused, 0)} refused
            </span>
          }
        >
          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={DAILY} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
                <CartesianGrid stroke={CHART.grid} vertical={false} />
                <XAxis dataKey="d" tick={CHART.axis} axisLine={false} tickLine={false} tickMargin={8} interval={1} />
                <YAxis tick={CHART.axis} axisLine={false} tickLine={false} width={48} />
                <Tooltip {...CHART.tooltip} />
                <Area type="monotone" dataKey="completed" name="Completed" stroke={CHART.series.ink} strokeWidth={2} fill={CHART.series.ink} fillOpacity={0.12} />
                <Area type="monotone" dataKey="failed" name="Failed" stroke={CHART.series.gold} strokeWidth={2.5} fill={CHART.series.gold} fillOpacity={0.5} />
                <Area type="monotone" dataKey="refused" name="Refused" stroke={CHART.series.danger} strokeWidth={2.5} fill={CHART.series.danger} fillOpacity={0.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 grid grid-cols-4 gap-3 max-md:grid-cols-2">
            {[
              ['Completed', `${pct(DAILY.reduce((s, d) => s + d.completed, 0), DAILY.reduce((s, d) => s + d.requested, 0))}%`, CHART.series.ink],
              ['Failed', `${KPI.failures30d}`, CHART.series.gold],
              ['Refused · moderation', `${KPI.refusals30d}`, CHART.series.danger],
              ['Limit hits', `${KPI.limitHits30d}`, CHART.series.tertiary],
            ].map(([k, v, c]) => (
              <div key={k} className="flex items-center gap-2.5 rounded-[var(--r-control)] bg-[var(--surface-raised)] px-3 py-2">
                <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: c }} aria-hidden />
                <span className="min-w-0">
                  <span className="label block truncate text-text-2">{k}</span>
                  <span className="num block text-[18px] font-bold">{v}</span>
                </span>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Onboarding funnel" action={<Badge tone="accent">{KPI.onboardingCompletion}% complete</Badge>}>
          <ul className="flex flex-col gap-2">
            {FUNNEL.map((f, i) => (
              <li key={f.step} className="grid grid-cols-[108px_1fr_36px] items-center gap-2 text-[12.5px]">
                <span className={`truncate ${i === 0 || i === FUNNEL.length - 1 ? 'font-bold' : 'text-text-2'}`}>{f.step}</span>
                <BrandBar value={(f.n / FUNNEL[0].n) * 100} height={10} tone={i === FUNNEL.length - 1 ? 'gold' : 'ink'} />
                <span className="num text-right font-semibold">{f.n}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[12px] leading-relaxed text-text-2">Drop-offs are logged by step. The biggest, Q2 body type, lost 6 of 137 in 30 days; the deck lost 2.</p>
        </Panel>
      </div>

      {/* ── Four markets ── */}
      <section className="mx-8 mt-6 overflow-hidden rounded-[var(--r-container)] bg-ink text-on-ink max-md:mx-4">
        <div className="grid grid-cols-4 divide-x divide-[rgb(255_255_255/0.12)] max-md:grid-cols-2 max-md:divide-x-0">
          {(Object.keys(KPI.byCountry) as Country[]).map((c) => (
            <div key={c} className="px-6 py-5 max-md:px-4">
              <span className="label text-on-ink-2">{COUNTRY_LABEL[c]}</span>
              <span className="figure num mt-1 block text-[44px]">{KPI.byCountry[c].toLocaleString('en-US')}</span>
              <span className="meta text-on-ink-2">{pct(KPI.byCountry[c], total)}% of members · {c === 'US' ? '°F · MM/DD · color' : c === 'CA' ? '°C · DD/MM · colour' : '°C · DD/MM · colour'}</span>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[rgb(255_255_255/0.12)] px-7 py-3 max-md:px-5">
          <p className="text-[12.5px] font-semibold text-on-ink-2">Four launch markets, English only in v1. Hosting prioritised for North America: us-east-1 primary, ca-central-1 read replica.</p>
          <button type="button" onClick={() => navigate('admin.settings')} className="flex h-9 items-center gap-1 rounded-full px-3 text-[13px] font-bold text-gold-light hover:bg-[rgb(255_255_255/0.08)]">
            Regions & languages <ArrowUpRight size={15} aria-hidden />
          </button>
        </div>
      </section>

      {/* ── Events feed · spend · new reports ── */}
      <div className="grid grid-cols-[minmax(0,1fr)_280px_300px] gap-6 px-8 pb-8 pt-6 max-md:grid-cols-1 max-md:px-4">
        <Panel title="Membership events" action={<span className="meta text-text-2">provider-neutral · from Shopify webhooks</span>}>
          <ul className="-mx-2 flex flex-col">
            {PROVIDER_EVENTS.map((e) => {
              const m = memberById(e.member)
              return (
                <li key={e.id}>
                  <Pressable onClick={() => openMember(m.id)} className="flex min-h-[56px] items-center gap-3 rounded-[var(--r-control)] px-2 py-1.5 hover:bg-[var(--surface-high)]">
                    <Avatar who={m.photo} size={36} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13.5px] font-bold">{m.name}</span>
                      <span className="meta block truncate text-text-2">{e.raw} → paid until {e.paidUntil}</span>
                    </span>
                    <Badge tone={EVENT_TONE[e.event] ?? 'neutral'}>{e.event}</Badge>
                    <span className="meta w-[84px] shrink-0 text-right text-text-2">{e.iso.slice(5)} {e.time}</span>
                  </Pressable>
                </li>
              )
            })}
          </ul>
        </Panel>

        <Panel title="AI spend">
          <div className="flex items-center gap-4">
            <IceRing value={spendPct} size={96} stroke={8} color={spendPct >= 80 ? 'var(--gold)' : 'var(--ink)'}>
              <span className="num text-[22px] font-bold">{spendPct}%</span>
            </IceRing>
            <div className="min-w-0">
              <span className="figure num block text-[32px]">{usd(KPI.spendMonth)}</span>
              <span className="text-[12.5px] text-text-2">of {usd(KPI.spendCap)} cap · Nov</span>
            </div>
          </div>
          <p className="mt-3 text-[12px] leading-relaxed text-text-2">Alert at 80% emailed Nov 8. ~$0.11 per analysis. Change the cap under Limits & spend.</p>
          <Button size="sm" variant="outline" block className="mt-3" onClick={() => navigate('admin.limits')}>
            Limits & spend
          </Button>
        </Panel>

        <Panel title="New reports" action={<Badge tone="warn">{pending} new</Badge>}>
          <ul className="-mx-2 flex flex-col">
            {REPORTS.filter((r) => r.status === 'new').slice(0, 4).map((r) => {
              const m = memberById(r.member)
              return (
                <li key={r.id}>
                  <Pressable onClick={() => { session.viewReport(r.id); navigate('admin.reports') }} className="flex min-h-[52px] items-start gap-3 rounded-[var(--r-control)] px-2 py-2 hover:bg-[var(--surface-high)]">
                    <Avatar who={m.photo} size={30} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13px] font-bold">{r.category}</span>
                      <span className="line-clamp-2 text-[12px] leading-snug text-text-2">{r.description}</span>
                    </span>
                  </Pressable>
                </li>
              )
            })}
          </ul>
        </Panel>
      </div>

      {/* member chart: quiet, bottom */}
      <div className="px-8 pb-10 max-md:px-4">
        <Panel title="Scans per member · top 12 this month" flat pad={false}>
          <div className="h-[160px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[...MEMBERS].sort((a, b) => b.scans30d - a.scans30d).slice(0, 12)} margin={{ top: 4, right: 8, left: -18, bottom: 0 }}>
                <CartesianGrid stroke={CHART.grid} vertical={false} />
                <XAxis dataKey="name" tick={CHART.axis} axisLine={false} tickLine={false} tickFormatter={(v: string) => v.split(' ')[0]} />
                <YAxis tick={CHART.axis} axisLine={false} tickLine={false} width={40} />
                <Tooltip {...CHART.tooltip} formatter={(v: number) => [`${v} scans`, '30 days']} />
                <Bar dataKey="scans30d" radius={[6, 6, 0, 0]}>
                  {[...MEMBERS].sort((a, b) => b.scans30d - a.scans30d).slice(0, 12).map((m) => (
                    <Cell key={m.id} fill={m.limitHits30d > 0 ? CHART.series.gold : CHART.series.ink} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="meta mt-2 text-text-3">Gold bars hit a limit this month. Per-user usage detail is under Members and Usage. {compact(KPI.articleOpens30d)} article opens in 30 days.</p>
        </Panel>
      </div>
    </ConsoleShell>
  )
}
