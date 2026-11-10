import { motion } from 'framer-motion'
import { Download } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Avatar } from '../../components/Avatar'
import { Badge } from '../../components/Badge'
import { IceRing, StarRow } from '../../components/Brand'
import { Button, Pressable } from '../../components/Button'
import { CHART } from '../../components/Charts'
import { DAILY, HELPFULNESS, KPI, LIMIT_EVENTS, MEMBERS, OCCASION_MIX, memberById } from '../../data/admin'
import { pct } from '../../data/clock'
import { useNav } from '../../lib/navigation'
import { session, useSession } from '../../lib/store'
import { track } from '../../lib/tracker'
import { listItem, listParent } from '../../motion/transitions'
import { ConsoleShell, Panel } from '../console/shell'

/* admin.usage: analysis counts, helpfulness ratings, the occasion mix,
   per-user usage and the limit-event log. Chart-led. */

const KIND_TONE: Record<string, 'warn' | 'danger' | 'info' | 'neutral'> = { daily: 'warn', hourly: 'warn', verify: 'danger', login: 'danger', 'spend-alert': 'info' }

export default function AdminUsage() {
  const { navigate, toast } = useNav()
  const scanned = useSession((s) => s.scannedToday)
  const totalRatings = HELPFULNESS.reduce((s, h) => s + h.n, 0)
  const avg = (HELPFULNESS.reduce((s, h) => s + h.stars * h.n, 0) / totalRatings).toFixed(2)
  const topUsers = [...MEMBERS].sort((a, b) => b.scans30d - a.scans30d).slice(0, 8)
  const openMember = (id: string) => {
    session.viewMember(id)
    track('admin_open_member', id)
    navigate('admin.members')
  }
  return (
    <ConsoleShell
      active="admin.usage"
      title="Usage & helpfulness"
      sub={`${(KPI.analyses30d + (scanned ? 1 : 0)).toLocaleString('en-US')} analyses in 30 days · ${KPI.analysesToday + (scanned ? 1 : 0)} today · stored with tags, occasion, weather and rating`}
      actions={
        <Button size="sm" variant="outline" icon={Download} onClick={() => { session.exportData(); toast('Usage export queued (analyses with tags, occasion, weather, rating) · CSV', 'accent') }}>
          Export analyses
        </Button>
      }
    >
      {/* chart-led: latency + completion */}
      <div className="grid grid-cols-[minmax(0,1.6fr)_minmax(300px,1fr)] gap-6 px-8 max-md:grid-cols-1 max-md:px-4">
        <Panel title="Requested vs completed" action={<span className="meta text-text-2">14 days · failures retried once · refusals logged without the image</span>}>
          <div className="h-[230px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={DAILY} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
                <CartesianGrid stroke={CHART.grid} vertical={false} />
                <XAxis dataKey="d" tick={CHART.axis} axisLine={false} tickLine={false} tickMargin={8} interval={1} />
                <YAxis tick={CHART.axis} axisLine={false} tickLine={false} width={48} />
                <Tooltip {...CHART.tooltip} />
                <Line type="monotone" dataKey="requested" name="Requested" stroke={CHART.series.tertiary} strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="completed" name="Completed" stroke={CHART.series.ink} strokeWidth={2.5} dot={{ r: 2.5, fill: CHART.series.ink }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-[12.5px]">
            <span><span className="font-bold">Median latency</span> {KPI.medianLatency}s</span>
            <span><span className="font-bold">p95</span> {KPI.p95Latency}s · target under 10s</span>
            <span><span className="font-bold">Invalid JSON retried</span> 1.8%</span>
            <span><span className="font-bold">Refusals</span> {KPI.refusals30d} · counted toward limits</span>
          </div>
        </Panel>

        <Panel title="Helpfulness" action={<Badge tone="accent">{avg} avg</Badge>}>
          <div className="flex items-center gap-4">
            <IceRing value={(Number(avg) / 5) * 100} size={92} stroke={8}>
              <span className="num text-[24px] font-bold">{avg}</span>
            </IceRing>
            <ul className="flex-1">
              {HELPFULNESS.map((h) => (
                <li key={h.stars} className="grid grid-cols-[52px_1fr_44px] items-center gap-2 py-1 text-[12px]">
                  <StarRow rating={h.stars} size={9} />
                  <span className="relative block h-2 overflow-hidden rounded-full bg-[var(--surface-high)]">
                    <span className="absolute inset-y-0 left-0 rounded-full bg-gold" style={{ width: `${pct(h.n, totalRatings)}%` }} />
                  </span>
                  <span className="num text-right text-text-2">{pct(h.n, totalRatings)}%</span>
                </li>
              ))}
            </ul>
          </div>
          <p className="mt-3 text-[12px] leading-relaxed text-text-2">{totalRatings.toLocaleString('en-US')} ratings with 1,204 comments, each linked to its analysis and tags. 1–2 star analyses are listed in the inbox when a report follows.</p>
        </Panel>
      </div>

      {/* occasion mix + top users */}
      <div className="grid grid-cols-[minmax(300px,1fr)_minmax(0,1.4fr)] gap-6 px-8 pt-6 max-md:grid-cols-1 max-md:px-4">
        <Panel title="Occasion mix" action={<span className="meta text-text-2">30 days</span>}>
          <div className="h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={OCCASION_MIX} layout="vertical" margin={{ top: 0, right: 16, left: 10, bottom: 0 }}>
                <CartesianGrid stroke={CHART.grid} horizontal={false} />
                <XAxis type="number" tick={CHART.axis} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" tick={CHART.axis} axisLine={false} tickLine={false} width={86} />
                <Tooltip {...CHART.tooltip} />
                <Bar dataKey="n" radius={[0, 6, 6, 0]}>
                  {OCCASION_MIX.map((o) => (
                    <Cell key={o.name} fill={o.name === 'None' ? CHART.series.muted : CHART.series.ink} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="meta mt-2 text-text-3">“None” = occasion skipped; the Occasion score then rates general suitability.</p>
        </Panel>

        <Panel title="Per-member usage" action={<span className="meta text-text-2">top 8 by scans · tap to open</span>}>
          <table className="w-full border-collapse text-[13px]">
            <thead>
              <tr className="label text-text-2">
                <th className="py-2 text-left font-extrabold">Member</th>
                <th className="py-2 text-right font-extrabold">Today</th>
                <th className="py-2 text-right font-extrabold">30d</th>
                <th className="py-2 text-right font-extrabold max-md:hidden">Avg</th>
                <th className="py-2 text-right font-extrabold">Limits</th>
              </tr>
            </thead>
            <motion.tbody variants={listParent} initial="hidden" animate="show">
              {topUsers.map((u) => (
                <motion.tr key={u.id} variants={listItem} onClick={() => openMember(u.id)} className="cursor-pointer border-t border-[var(--rule)] hover:bg-[var(--surface-raised)]">
                  <td className="py-2">
                    <span className="flex items-center gap-2.5">
                      <Avatar who={u.photo} size={30} />
                      <span className="truncate font-bold">{u.name}</span>
                    </span>
                  </td>
                  <td className="num py-2 text-right">{u.scansToday === 10 ? <Badge tone="warn">10 of 10</Badge> : `${u.scansToday} of 10`}</td>
                  <td className="num py-2 text-right font-semibold">{u.scans30d}</td>
                  <td className="num py-2 text-right text-text-2 max-md:hidden">{u.avgScore}</td>
                  <td className="num py-2 text-right">{u.limitHits30d > 0 ? <span className="font-bold text-gold-ink">{u.limitHits30d}</span> : <span className="text-text-3">0</span>}</td>
                </motion.tr>
              ))}
            </motion.tbody>
          </table>
        </Panel>
      </div>

      {/* limit events */}
      <div className="px-8 pb-10 pt-6 max-md:px-4">
        <Panel title="Limit events" action={<span className="meta text-text-2">{KPI.limitHits30d} in 30 days · enforced server-side · HTTP 429 with retry-after</span>}>
          <ul className="divide-y divide-[var(--rule)]">
            {LIMIT_EVENTS.map((e) => {
              const m = e.member === '—' ? null : memberById(e.member)
              return (
                <li key={e.id}>
                  <Pressable onClick={() => (m ? openMember(m.id) : navigate('admin.limits'))} className="flex min-h-[48px] items-center gap-3 py-2 hover:bg-[var(--surface-raised)]">
                    <span className="meta w-[110px] shrink-0 text-text-2">{e.iso.slice(5)} · {e.time}</span>
                    <Badge tone={KIND_TONE[e.kind]}>{e.kind}</Badge>
                    <span className="min-w-0 flex-1 truncate text-[13px]">{e.detail}</span>
                    {m ? (
                      <span className="flex items-center gap-2">
                        <Avatar who={m.photo} size={24} />
                        <span className="text-[12.5px] font-semibold max-md:hidden">{m.name}</span>
                      </span>
                    ) : (
                      <span className="meta text-text-3">no member</span>
                    )}
                  </Pressable>
                </li>
              )
            })}
          </ul>
        </Panel>
      </div>
    </ConsoleShell>
  )
}
