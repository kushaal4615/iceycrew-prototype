import { motion } from 'framer-motion'
import { Search, ShieldCheck } from 'lucide-react'
import { useState } from 'react'
import { Figure } from '../../components/Brand'
import { Sparkline } from '../../components/Charts'
import { Chip } from '../../components/Badge'
import { AVG_SCORE, BEST, HISTORY, SCORED, TREND, TODAY } from '../../data/analyses'
import { OCCASIONS } from '../../data/content'
import { DEMO_SEARCH_HISTORY } from '../../data/demoFill'
import { useNav } from '../../lib/navigation'
import { useSession } from '../../lib/store'
import { track } from '../../lib/tracker'
import { listParent } from '../../motion/transitions'
import { AnalysisRow } from './_shared'
import { MobileScreen, TopBar } from '../mobileShell'

/* app.history: every past analysis, browsable. Refusals and failures are
   listed as rows without an image. Photos auto-delete after 12 months
   unless kept; scores and text stay. Lapsed members keep this screen
   read-only. */

export default function AppHistory() {
  const { toast } = useNav()
  const scanned = useSession((s) => s.scannedToday)
  const keep = useSession((s) => s.keepPhotos)
  const membership = useSession((s) => s.membership)
  const [filter, setFilter] = useState<string>('All')
  const [q, setQ] = useState(DEMO_SEARCH_HISTORY)
  const [searching, setSearching] = useState(false)
  const rows = (scanned ? HISTORY : HISTORY.filter((a) => a.id !== TODAY.id)).filter((a) => (filter === 'All' ? true : filter === 'Not analysed' ? a.state !== 'scored' : a.occasion === filter)).filter((a) => (searching && q.trim() ? `${a.title} ${a.occasion ?? ''} ${a.tags.join(' ')}`.toLowerCase().includes(q.trim().toLowerCase()) : true))
  const scoredCount = scanned ? SCORED.length : SCORED.length - 1

  return (
    <MobileScreen
      tab="home"
      header={
        <TopBar
          large
          title="History"
          sub={`${scoredCount} scored · ${HISTORY.length - SCORED.length} not analysed · since Mar 3, 2026`}
          right={
            <button type="button" onClick={() => setSearching((v) => !v)} aria-label="Search history" aria-expanded={searching} className="grid h-11 w-11 place-items-center rounded-full">
              <Search size={20} />
            </button>
          }
        />
      }
    >
      {membership === 'lapsed' && (
        <div className="mx-5 mb-3 flex items-center gap-2 rounded-[var(--r-control)] bg-warn-soft px-3 py-2 text-[12.5px] font-semibold text-on-warn-soft">
          <ShieldCheck size={14} aria-hidden /> Read-only: your membership has lapsed. History stays; new scans need an active VIP.
        </div>
      )}
      {searching && (
        <div className="px-5 pb-3">
          <div className="well flex h-11 items-center gap-2 rounded-full px-4">
            <Search size={16} className="text-text-2" aria-hidden />
            <input value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search your scans" placeholder="Occasion, piece, colour" className="min-w-0 flex-1 bg-transparent text-[14px] outline-none placeholder:text-text-3" />
          </div>
        </div>
      )}

      {/* stat band: oversized numerals + the trend */}
      <div className="mx-5 grid grid-cols-[1fr_1fr_1.3fr] gap-2 rounded-[var(--r-container)] bg-ink p-4 text-on-ink">
        <div>
          <span className="label text-on-ink-2">Average</span>
          <Figure value={AVG_SCORE} size={44} className="mt-1 block" />
        </div>
        <div>
          <span className="label text-on-ink-2">Best</span>
          <Figure value={BEST.overall} size={44} className="mt-1 block text-gold-light" />
          <span className="meta block text-on-ink-2">{BEST.occasion}</span>
        </div>
        <div className="flex flex-col justify-between">
          <span className="label text-on-ink-2">Trend · {TREND.length} scans</span>
          <Sparkline data={TREND} width={110} height={40} color="var(--gold)" />
        </div>
      </div>

      <div className="scroll-x mt-4 flex gap-1.5 px-5">
        {['All', ...OCCASIONS.filter((o) => o !== 'Other' && o !== 'Interview'), 'Not analysed'].map((f) => (
          <button key={f} type="button" aria-pressed={filter === f} onClick={() => { if (filter === f) return toast(f === 'All' ? 'Showing every scan' : `Already filtered to ${f}`, 'neutral'); setFilter(f); track('history_filter', f) }} className="shrink-0 snap-start">
            <Chip on={filter === f}>{f}</Chip>
          </button>
        ))}
      </div>

      <motion.ul variants={listParent} initial="hidden" animate="show" className="mt-2 flex flex-col divide-y divide-[var(--rule)]">
        {rows.map((a) => (
          <AnalysisRow key={a.id} a={a} />
        ))}
        {rows.length === 0 && (
          <li className="px-5 py-10 text-center text-[14px] text-text-2">
            No scans match. <button type="button" onClick={() => { setFilter('All'); setQ('') }} className="font-bold text-text underline underline-offset-4">Clear filters</button>
          </li>
        )}
      </motion.ul>

      <div className="mx-5 mt-5 rounded-[var(--r-card)] bg-[var(--surface-tint)] p-4">
        <p className="text-[13px] font-bold">Photos and retention</p>
        <p className="mt-1 text-[12.5px] leading-snug text-text-2">
          {keep ? 'You chose “Keep my photos”, so outfit photos stay until you delete them.' : 'Outfit photos delete automatically 12 months after each scan: your first (Mar 8, 2026) goes on Mar 8, 2027.'} Scores, feedback and tips stay in history either way, shown without the photo.
        </p>
        <button type="button" onClick={() => toast('Retention is set in Account & Settings: “Keep my photos”', 'info')} className="mt-2 h-10 text-[13px] font-bold text-gold-ink">
          Change in Account & Settings
        </button>
      </div>
    </MobileScreen>
  )
}
