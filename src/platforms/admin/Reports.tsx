import { motion } from 'framer-motion'
import { Bug, Check, Mail, MessageSquareWarning, Send, Smartphone } from 'lucide-react'
import { useState } from 'react'
import { Avatar } from '../../components/Avatar'
import { Badge, Chip } from '../../components/Badge'
import { Button, Pressable } from '../../components/Button'
import { TextArea } from '../../components/Form'
import { HeroImage } from '../../components/Media'
import { Segmented } from '../../components/Tabs'
import { REPORTS, memberById, type ReportCategory, type ReportStatus } from '../../data/admin'
import { fmtUS } from '../../data/clock'
import { DEMO_REPORT_REPLY } from '../../data/demoFill'
import { useNav } from '../../lib/navigation'
import { reportStatusOf, session, useSession } from '../../lib/store'
import { track } from '../../lib/tracker'
import { listItem, listParent } from '../../motion/transitions'
import { ConsoleShell, Panel } from '../console/shell'

/* admin.reports: the bug reports inbox with filters by category and
   status (new / in progress / fixed). Master-detail: the list with the
   inspector beside it. Each report carries its screenshot and device data;
   each one also sent an email. */

const STATUS_TONE: Record<ReportStatus, 'warn' | 'info' | 'success'> = { new: 'warn', 'in progress': 'info', fixed: 'success' }
const CAT_ICON: Record<ReportCategory, typeof Bug> = { Bug: Bug, 'Wrong/bad AI feedback': MessageSquareWarning, Other: Mail }

export default function AdminReports() {
  const { navigate, toast } = useNav()
  const viewing = useSession((s) => s.viewingReport)
  const statuses = useSession((s) => s.reportStatus)
  const replied = useSession((s) => s.replied)
  const sentFromApp = useSession((s) => s.reportsSent)
  const [status, setStatus] = useState<'all' | ReportStatus>('new')
  const [cat, setCat] = useState<'all' | ReportCategory>('all')
  const [reply, setReply] = useState(DEMO_REPORT_REPLY)
  const rows = REPORTS.filter((r) => (status === 'all' || reportStatusOf(r.id, { reportStatus: statuses } as never) === status) && (cat === 'all' || r.category === cat))
  const r = REPORTS.find((x) => x.id === viewing) ?? REPORTS[0]
  const m = memberById(r.member)
  const st = statuses[r.id] ?? r.status
  const counts: Record<ReportStatus, number> = { new: REPORTS.filter((x) => (statuses[x.id] ?? x.status) === 'new').length, 'in progress': REPORTS.filter((x) => (statuses[x.id] ?? x.status) === 'in progress').length, fixed: REPORTS.filter((x) => (statuses[x.id] ?? x.status) === 'fixed').length }

  return (
    <ConsoleShell
      active="admin.reports"
      title="Bug reports"
      sub={`${REPORTS.length + sentFromApp.length} reports · ${counts.new + sentFromApp.length} new · every one also emailed the team`}
      actions={<Segmented items={[{ id: 'new', label: 'New', count: counts.new + sentFromApp.length }, { id: 'in progress', label: 'In progress', count: counts['in progress'] }, { id: 'fixed', label: 'Fixed', count: counts.fixed }, { id: 'all', label: 'All' }]} value={status} onChange={(v) => (v === status ? toast(`Already showing ${v === 'all' ? 'all reports' : v}`, 'neutral') : setStatus(v))} />}
    >
      <div className="px-8 max-md:px-4">
        <div className="flex flex-wrap gap-1.5">
          {(['all', 'Bug', 'Wrong/bad AI feedback', 'Other'] as const).map((c) => (
            <button key={c} type="button" aria-pressed={cat === c} onClick={() => (cat === c ? toast(c === 'all' ? 'Showing every category' : `Already filtered to ${c}`, 'neutral') : setCat(c))}>
              <Chip on={cat === c}>{c === 'all' ? 'All categories' : c}</Chip>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-[420px_minmax(0,1fr)] gap-6 px-8 pb-10 pt-4 max-md:grid-cols-1 max-md:px-4">
        <Panel pad={false}>
          <motion.ul variants={listParent} initial="hidden" animate="show" className="divide-y divide-[var(--rule)]">
            {sentFromApp.length > 0 && status !== 'fixed' && status !== 'in progress' && (
              <li className="flex items-start gap-3 bg-[var(--surface-tint)] px-4 py-3">
                <Avatar who="maya" size={36} />
                <span className="min-w-0 flex-1">
                  <span className="flex items-center justify-between gap-2">
                    <span className="truncate text-[13.5px] font-bold">Maya Delgado</span>
                    <span className="meta text-text-2">just now</span>
                  </span>
                  <span className="block text-[12.5px] font-semibold text-gold-ink">Wrong/bad AI feedback · from this session</span>
                  <span className="line-clamp-2 text-[12.5px] leading-snug text-text-2">The Occasion score says the tote reads casual, but this is the bag everyone at my office carries…</span>
                </span>
              </li>
            )}
            {rows.map((x) => {
              const mm = memberById(x.member)
              const Icon = CAT_ICON[x.category]
              const on = x.id === r.id
              return (
                <motion.li key={x.id} variants={listItem}>
                  <Pressable onClick={() => { session.viewReport(x.id); track('admin_open_report', x.id) }} className={`flex items-start gap-3 px-4 py-3 ${on ? 'bg-[var(--surface-tint)]' : 'hover:bg-[var(--surface-raised)]'}`}>
                    <Avatar who={mm.photo} size={36} />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center justify-between gap-2">
                        <span className="truncate text-[13.5px] font-bold">{mm.name}</span>
                        <span className="meta shrink-0 text-text-2">{x.iso.slice(5)} {x.time}</span>
                      </span>
                      <span className="mt-0.5 flex items-center gap-1.5 text-[12px] font-semibold text-text-2">
                        <Icon size={12} aria-hidden /> {x.category}
                        <Badge tone={STATUS_TONE[statuses[x.id] ?? x.status]}>{statuses[x.id] ?? x.status}</Badge>
                      </span>
                      <span className="mt-1 line-clamp-2 text-[12.5px] leading-snug text-text-2">{x.description}</span>
                    </span>
                  </Pressable>
                </motion.li>
              )
            })}
            {rows.length === 0 && <li className="px-4 py-10 text-center text-[13px] text-text-2">Nothing in this view.</li>}
          </motion.ul>
        </Panel>

        <div className="flex flex-col gap-6">
          <Panel
            title={r.category}
            action={
              <div className="flex gap-1">
                {(['new', 'in progress', 'fixed'] as ReportStatus[]).map((s) => (
                  <button key={s} type="button" aria-pressed={st === s} onClick={() => { if (st === s) return toast(`Already marked ${s}`, 'neutral'); session.setReportStatus(r.id, s); track('admin_report_status', s) }} className="shrink-0">
                    <Chip on={st === s}>{s}</Chip>
                  </button>
                ))}
              </div>
            }
          >
            <div className="flex items-start gap-4">
              <Avatar who={m.photo} size={48} />
              <div className="min-w-0 flex-1">
                <p className="text-[15px] font-bold">{m.name} <span className="font-medium text-text-2">· {m.email}</span></p>
                <p className="meta mt-0.5 text-text-2">{fmtUS(r.iso, true)} · {r.time} · {r.country}</p>
                <p className="mt-3 text-[15px] leading-relaxed">“{r.description}”</p>
              </div>
            </div>
            <div className="mt-5 grid grid-cols-[1fr_200px] gap-5 max-md:grid-cols-1">
              <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-[12.5px]">
                {[
                  ['App version', r.app],
                  ['Device', r.device],
                  ['OS', r.os],
                  ['Country', r.country],
                  ['Screen', r.screen],
                  ['Analysis ID', r.analysisId ?? '—'],
                  ['Email sent', r.emailSent ? 'Yes · support@' : 'No'],
                  ['Crash report', r.category === 'Bug' ? 'Sentry · linked' : '—'],
                ].map(([k, v]) => (
                  <div key={k} className="rounded-[var(--r-control)] bg-[var(--surface-raised)] px-3 py-2">
                    <dt className="label text-text-2">{k}</dt>
                    <dd className="mt-0.5 truncate font-semibold">{v}</dd>
                  </div>
                ))}
              </dl>
              <div>
                <p className="label mb-1.5 flex items-center gap-1.5 text-text-2"><Smartphone size={12} aria-hidden /> Screenshot</p>
                {r.screenshot ? (
                  <HeroImage src={r.screenshot} alt="Attached screenshot" scrim="none" width={400} className="aspect-[9/16] rounded-[var(--r-card)]" position="top" />
                ) : (
                  <div className="grid aspect-[9/16] place-items-center rounded-[var(--r-card)] bg-[var(--surface-high)] text-[12px] text-text-2">None attached</div>
                )}
              </div>
            </div>
            {r.analysisId && (
              <Button size="sm" variant="outline" className="mt-4" onClick={() => toast(`Opens analysis ${r.analysisId}: scores, prompt version v14, tags`, 'info')}>
                Open analysis {r.analysisId}
              </Button>
            )}
          </Panel>

          <Panel title="Reply" action={replied.includes(r.id) ? <Badge tone="success" icon={<Check size={12} aria-hidden />}>Sent</Badge> : undefined}>
            <TextArea label={`Email to ${m.email}`} rows={4} value={reply} onChange={(e) => setReply(e.target.value)} />
            <div className="mt-3 flex flex-wrap gap-2">
              <Button size="sm" variant="ink" icon={Send} onClick={() => { if (!reply.trim()) return toast('Write a reply first', 'warn'); session.reply(r.id); track('admin_report_reply', r.id); toast(`Reply sent to ${m.email}`, 'accent') }}>
                Send reply
              </Button>
              {r.category === 'Wrong/bad AI feedback' && (
                <Button size="sm" variant="outline" onClick={() => navigate('admin.ai')}>
                  Adjust the prompt
                </Button>
              )}
              <Button size="sm" variant="ghost" onClick={() => { session.viewMember(m.id); navigate('admin.members') }}>
                Open member
              </Button>
            </div>
          </Panel>
        </div>
      </div>
    </ConsoleShell>
  )
}
