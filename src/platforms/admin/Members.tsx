import { motion } from 'framer-motion'
import { ArrowUpDown, ChevronLeft, ChevronRight, Download, Mail, StickyNote } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Avatar } from '../../components/Avatar'
import { Badge, Chip } from '../../components/Badge'
import { IceRing, ScorePill } from '../../components/Brand'
import { Button, Pressable } from '../../components/Button'
import { TextArea } from '../../components/Form'
import { Drawer } from '../../components/Sheet'
import { COUNTRY_LABEL, MEMBERS, PROVIDER_EVENTS, STATUS_LABEL, memberById, type MemberStatus } from '../../data/admin'
import { fmtUS } from '../../data/clock'
import { DEMO_CRM } from '../../data/demoFill'
import { useNav } from '../../lib/navigation'
import { session, useSession } from '../../lib/store'
import { track } from '../../lib/tracker'
import { listItem, listParent } from '../../motion/transitions'
import { ConsoleShell, Panel } from '../console/shell'

/* admin.members: users and their membership status, as the provider-
   neutral record: status, paid-until, level, provider and the provider's
   IDs (with room for a second provider ID for the CRM migration). Table
   with filters, sort and pagination; a row opens the inspector drawer. */

type Sort = 'name' | 'paidUntil' | 'scans30d' | 'avgScore'
const PAGE = 10
const TONE: Record<MemberStatus, 'success' | 'warn' | 'danger' | 'neutral'> = { active: 'success', cancelled: 'warn', lapsed: 'danger', refunded: 'neutral' }

export default function AdminMembers() {
  const { toast } = useNav()
  const viewing = useSession((s) => s.viewingMember)
  const notes = useSession((s) => s.memberNotes)
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState<'all' | MemberStatus>('all')
  const [country, setCountry] = useState<'all' | 'US' | 'CA' | 'UK' | 'AU'>('all')
  const [sort, setSort] = useState<Sort>('paidUntil')
  const [dir, setDir] = useState<1 | -1>(1)
  const [page, setPage] = useState(0)
  const [note, setNote] = useState('')

  const rows = useMemo(() => {
    const r = MEMBERS.filter((m) => (status === 'all' || m.status === status) && (country === 'all' || m.country === country))
    r.sort((a, b) => {
      const va = a[sort]
      const vb = b[sort]
      return (typeof va === 'string' ? va.localeCompare(vb as string) : (va as number) - (vb as number)) * dir
    })
    return r
  }, [status, country, sort, dir])
  const paged = rows.slice(page * PAGE, page * PAGE + PAGE)
  const m = memberById(viewing)
  const counts = { active: MEMBERS.filter((x) => x.status === 'active').length, cancelled: MEMBERS.filter((x) => x.status === 'cancelled').length, lapsed: MEMBERS.filter((x) => x.status === 'lapsed').length, refunded: MEMBERS.filter((x) => x.status === 'refunded').length }

  const openRow = (id: string) => {
    session.viewMember(id)
    track('admin_open_member', id)
    setNote(notes[id] ?? '')
    setOpen(true)
  }
  const toggleSort = (k: Sort) => {
    if (sort === k) setDir((d) => (d === 1 ? -1 : 1))
    else {
      setSort(k)
      setDir(1)
    }
  }
  const Th = ({ k, children, className = '' }: { k: Sort; children: string; className?: string }) => (
    <th className={`py-2 text-left ${className}`}>
      <button type="button" onClick={() => toggleSort(k)} className="label inline-flex items-center gap-1 text-text-2 hover:text-text">
        {children} <ArrowUpDown size={11} className={sort === k ? 'text-text' : 'text-text-3'} aria-hidden />
      </button>
    </th>
  )

  return (
    <ConsoleShell
      active="admin.members"
      title="Members & status"
      sub={`${MEMBERS.length} shown of 1,284 · one provider-neutral record each · Shopify adapter`}
      actions={
        <>
          <Button size="sm" variant="outline" icon={Download} onClick={() => { session.exportData(); toast('Members CSV queued · emailed to hazel@', 'accent') }}>
            Export CSV
          </Button>
          <Button size="sm" variant="ink" icon={Mail} onClick={() => toast('Compose: in-app notice to all active members (no push at launch)', 'info')}>
            In-app notice
          </Button>
        </>
      }
    >
      {/* status strip */}
      <div className="grid grid-cols-4 gap-3 px-8 max-md:grid-cols-2 max-md:px-4">
        {(['active', 'cancelled', 'lapsed', 'refunded'] as MemberStatus[]).map((s) => (
          <Pressable key={s} onClick={() => { setStatus(status === s ? 'all' : s); setPage(0) }} className={`rounded-[var(--r-card)] p-4 ${status === s ? 'bg-ink text-on-ink' : 'bg-[var(--surface)] shadow-[var(--shadow-raised)]'}`}>
            <span className={`label ${status === s ? 'text-on-ink-2' : 'text-text-2'}`}>{STATUS_LABEL[s].split(' · ')[0]}</span>
            <span className="figure num mt-1 block text-[34px]">{counts[s]}</span>
            <span className={`meta ${status === s ? 'text-on-ink-2' : 'text-text-2'}`}>{s === 'active' ? 'renew automatically' : s === 'cancelled' ? 'access to month end' : s === 'lapsed' ? 'failed payment · locked' : 'removed at once'}</span>
          </Pressable>
        ))}
      </div>

      <div className="px-8 pt-5 max-md:px-4">
        <div className="scroll-x flex gap-1.5 pb-1">
          {(['all', 'US', 'CA', 'UK', 'AU'] as const).map((c) => (
            <button key={c} type="button" aria-pressed={country === c} onClick={() => { if (country === c) return toast(c === 'all' ? 'Showing every country' : `Already filtered to ${COUNTRY_LABEL[c]}`, 'neutral'); setCountry(c); setPage(0) }} className="shrink-0">
              <Chip on={country === c}>{c === 'all' ? 'All countries' : COUNTRY_LABEL[c]}</Chip>
            </button>
          ))}
          <span className="meta ml-auto self-center text-text-2">{rows.length} members · page {page + 1} of {Math.max(1, Math.ceil(rows.length / PAGE))}</span>
        </div>

        <Panel pad={false} className="mt-3 overflow-hidden">
          <table className="w-full border-collapse text-[13px] max-md:hidden">
            <thead>
              <tr className="border-b border-[var(--rule)] bg-[var(--surface-raised)]">
                <Th k="name" className="pl-5">Member</Th>
                <th className="label py-2 text-left text-text-2">Status</th>
                <Th k="paidUntil">Paid until</Th>
                <th className="label py-2 text-left text-text-2">Provider IDs</th>
                <Th k="scans30d">Scans 30d</Th>
                <Th k="avgScore">Avg score</Th>
                <th className="label py-2 text-left text-text-2">Season</th>
                <th className="py-2 pr-5" />
              </tr>
            </thead>
            <motion.tbody variants={listParent} initial="hidden" animate="show">
              {paged.map((r) => (
                <motion.tr key={r.id} variants={listItem} onClick={() => openRow(r.id)} className="cursor-pointer border-b border-[var(--rule)] hover:bg-[var(--surface-raised)]">
                  <td className="py-2.5 pl-5">
                    <span className="flex items-center gap-3">
                      <Avatar who={r.photo} size={34} />
                      <span className="min-w-0">
                        <span className="block max-w-[180px] truncate font-bold">{r.name}</span>
                        <span className="meta block text-text-2">{r.city} · {r.country}</span>
                      </span>
                    </span>
                  </td>
                  <td className="py-2.5"><Badge tone={TONE[r.status]}>{STATUS_LABEL[r.status].split(' · ')[0]}</Badge></td>
                  <td className="num py-2.5 font-semibold">{fmtUS(r.paidUntil)}</td>
                  <td className="py-2.5"><span className="meta block max-w-[200px] truncate text-text-2">{r.providerIds.order} · {r.providerIds.subscription}</span></td>
                  <td className="num py-2.5 font-semibold">{r.scans30d}{r.limitHits30d > 0 && <span className="label ml-1.5 rounded-full bg-gold-soft px-1.5 py-0.5 text-on-gold-soft">{r.limitHits30d} limit</span>}</td>
                  <td className="py-2.5"><ScorePill value={r.avgScore} /></td>
                  <td className="py-2.5 text-text-2">{r.colourSeason ?? '—'}</td>
                  <td className="py-2.5 pr-5 text-right"><ChevronRight size={16} className="inline text-text-3" aria-hidden /></td>
                </motion.tr>
              ))}
            </motion.tbody>
          </table>
          {/* phone: stacked row cards */}
          <ul className="divide-y divide-[var(--rule)] md:hidden">
            {paged.map((r) => (
              <li key={r.id}>
                <Pressable onClick={() => openRow(r.id)} className="flex items-center gap-3 px-4 py-3">
                  <Avatar who={r.photo} size={40} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[14px] font-bold">{r.name}</span>
                    <span className="meta block text-text-2">{r.country} · paid until {fmtUS(r.paidUntil)} · {r.scans30d} scans</span>
                  </span>
                  <Badge tone={TONE[r.status]}>{STATUS_LABEL[r.status].split(' · ')[0]}</Badge>
                  <ChevronRight size={16} className="text-text-3" aria-hidden />
                </Pressable>
              </li>
            ))}
          </ul>
          <div className="flex items-center justify-between px-5 py-3">
            <span className="meta text-text-2">Showing {page * PAGE + 1}–{Math.min(rows.length, (page + 1) * PAGE)} of {rows.length}</span>
            <span className="flex gap-1">
              <button type="button" onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0} aria-label="Previous page" className="grid h-9 w-9 place-items-center rounded-full disabled:opacity-40 hover:bg-[var(--surface-high)]"><ChevronLeft size={16} /></button>
              <button type="button" onClick={() => setPage((p) => ((p + 1) * PAGE < rows.length ? p + 1 : p))} disabled={(page + 1) * PAGE >= rows.length} aria-label="Next page" className="grid h-9 w-9 place-items-center rounded-full disabled:opacity-40 hover:bg-[var(--surface-high)]"><ChevronRight size={16} /></button>
            </span>
          </div>
        </Panel>
        <p className="meta mt-3 pb-8 text-text-3">Status syncs from Shopify webhooks (renewal, cancellation, refund, failed billing) and is re-checked at login and daily. The app reads only this record, never Shopify.</p>
      </div>

      <Drawer open={open} onClose={() => setOpen(false)} title={m.name} width={460}>
        <div className="flex items-center gap-4">
          <Avatar who={m.photo} size={64} ring />
          <div className="min-w-0">
            <p className="truncate text-[14px] text-text-2">{m.email}</p>
            <p className="meta mt-0.5 text-text-2">{m.city} · {COUNTRY_LABEL[m.country]} · joined {fmtUS(m.joined, true)}</p>
            <Badge tone={TONE[m.status]} className="mt-2">{STATUS_LABEL[m.status]}</Badge>
          </div>
        </div>

        <div className="mt-5 rounded-[var(--r-card)] bg-ink p-4 text-on-ink">
          <p className="label text-gold-light">Membership record · provider-neutral</p>
          <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-2 text-[12.5px]">
            <dt className="text-on-ink-2">status</dt><dd className="font-bold">{m.status}</dd>
            <dt className="text-on-ink-2">paid_until</dt><dd className="num font-bold">{m.paidUntil}</dd>
            <dt className="text-on-ink-2">level</dt><dd className="font-bold">{m.level}</dd>
            <dt className="text-on-ink-2">provider</dt><dd className="font-bold">{m.provider}</dd>
            <dt className="text-on-ink-2">customer_id</dt><dd className="meta truncate">{m.providerIds.customer}</dd>
            <dt className="text-on-ink-2">subscription_id</dt><dd className="meta">{m.providerIds.subscription}</dd>
            <dt className="text-on-ink-2">order_id</dt><dd className="meta">{m.providerIds.order}</dd>
            <dt className="text-on-ink-2">crm_id</dt><dd className="meta text-on-ink-2">{m.providerIds.crm ?? `— (matched by ${DEMO_CRM.matchBy} on migration)`}</dd>
          </dl>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          <div className="flex flex-col items-center rounded-[var(--r-card)] bg-[var(--surface-raised)] p-3">
            <IceRing value={m.avgScore} size={56} stroke={5}><span className="num text-[15px] font-bold">{m.avgScore}</span></IceRing>
            <span className="label mt-1.5 text-text-2">Avg score</span>
          </div>
          <div className="flex flex-col items-center justify-center rounded-[var(--r-card)] bg-[var(--surface-raised)] p-3">
            <span className="figure num text-[30px]">{m.scans30d}</span>
            <span className="label mt-1 text-text-2">Scans 30d</span>
          </div>
          <div className="flex flex-col items-center justify-center rounded-[var(--r-card)] bg-[var(--surface-raised)] p-3">
            <span className="figure num text-[30px]">{m.helpfulness.toFixed(1)}</span>
            <span className="label mt-1 text-text-2">Helpful</span>
          </div>
        </div>

        <dl className="mt-4 divide-y divide-[var(--rule)] text-[13px]">
          {[
            ['Onboarding', m.onboarding],
            ['Colour season', m.colourSeason ?? 'Quiz not taken'],
            ['Scans today', `${m.scansToday} of 10`],
            ['Limit hits · 30d', `${m.limitHits30d}`],
            ['Last event', `${m.lastEvent.type.replace('_', ' ')} · ${fmtUS(m.lastEvent.iso)}`],
          ].map(([k, v]) => (
            <div key={k} className="flex items-center justify-between py-2.5">
              <dt className="text-text-2">{k}</dt>
              <dd className="font-semibold">{v}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-4">
          <p className="label mb-2 text-text-2">Recent provider events</p>
          <ul className="flex flex-col gap-1.5">
            {PROVIDER_EVENTS.filter((e) => e.member === m.id).concat(PROVIDER_EVENTS.slice(0, 2)).slice(0, 3).map((e) => (
              <li key={e.id} className="meta flex items-center justify-between rounded-[var(--r-control)] bg-[var(--surface-raised)] px-3 py-2 text-text-2">
                <span className="truncate">{e.raw}</span>
                <span className="font-bold text-text">{e.event}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-4">
          <TextArea label="Internal note" rows={3} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Visible to staff only" />
          <div className="mt-2 flex gap-2">
            <Button size="sm" variant="ink" icon={StickyNote} onClick={() => { session.noteMember(m.id, note); track('admin_member_note', m.id); toast('Note saved', 'accent') }}>
              Save note
            </Button>
            <Button size="sm" variant="outline" onClick={() => toast(`Re-checked with Shopify: ${m.status}, paid until ${m.paidUntil}`, 'info')}>
              Re-check status now
            </Button>
          </div>
        </div>
      </Drawer>
    </ConsoleShell>
  )
}
