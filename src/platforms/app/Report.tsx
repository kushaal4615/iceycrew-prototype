import { AnimatePresence, motion } from 'framer-motion'
import { Check, Image as ImageIcon, Mail, Send } from 'lucide-react'
import { useState } from 'react'
import { Button } from '../../components/Button'
import { Segmented } from '../../components/Tabs'
import { CheckMark, TextArea } from '../../components/Form'
import { HeroImage } from '../../components/Media'
import { analysisById } from '../../data/analyses'
import { DEMO_REPORT } from '../../data/demoFill'
import { useNav } from '../../lib/navigation'
import { session, useSession } from '../../lib/store'
import { track } from '../../lib/tracker'
import { spring } from '../../motion/springs'
import { fadeUp, listItem, listParent } from '../../motion/transitions'
import { Dock, MobileScreen, TopBar } from '../mobileShell'

/* app.report: category, description, optional screenshot (the app offers
   the current screen); app version, device, OS, country, screen and the
   analysis ID attached automatically. Sent reports land in the admin inbox
   and send an email. */

type Cat = 'Bug' | 'Wrong/bad AI feedback' | 'Other'
const CATS: { id: Cat; label: string }[] = [
  { id: 'Bug', label: 'Bug' },
  { id: 'Wrong/bad AI feedback', label: 'AI feedback' },
  { id: 'Other', label: 'Other' },
]

export default function AppReport() {
  const { navigate, back, toast } = useNav()
  const id = useSession((s) => s.viewingAnalysis)
  const a = analysisById(id)
  const [cat, setCat] = useState<Cat>(DEMO_REPORT.category)
  const [text, setText] = useState(DEMO_REPORT.description)
  const [attach, setAttach] = useState(DEMO_REPORT.attachScreenshot)
  const [sent, setSent] = useState(false)

  const send = () => {
    if (!text.trim()) return toast('Add a line or two describing the problem', 'warn')
    track('problem_report_sent', cat, { analysis: a.id, screenshot: attach })
    session.sendReport(`new-${Date.now()}`)
    setSent(true)
  }

  const META = [
    ['Category', cat],
    ['App version', '1.0.4 (112)'],
    ['Device · OS', 'iPhone 16 Pro · iOS 19.1'],
    ['Country', 'United States'],
    ['Screen', 'Analysis'],
    ['Analysis ID', `an_${a.id === 'a-today' ? '9c41d' : a.id}`],
  ]

  return (
    <MobileScreen
      header={<TopBar title="Report a problem" />}
      dock={
        !sent ? (
          <Dock tone="surface">
            <Button size="lg" block icon={Send} onClick={send}>
              Send report
            </Button>
          </Dock>
        ) : undefined
      }
    >
      <AnimatePresence mode="wait">
        {sent ? (
          <motion.div key="sent" variants={fadeUp} initial="hidden" animate="show" className="flex flex-col items-center px-6 pt-10 text-center">
            <motion.span initial={{ scale: 0.5 }} animate={{ scale: 1 }} transition={spring.pop} className="grid h-20 w-20 place-items-center rounded-full bg-gold text-on-gold shadow-[var(--glow-gold)]">
              <Check size={36} strokeWidth={3} aria-hidden />
            </motion.span>
            <h1 className="grot mt-5 text-[30px]">Thanks, Maya. We’ve got it.</h1>
            <p className="mt-2 max-w-[32ch] text-[14px] leading-snug text-text-2">Your report is in the IceyCrew inbox, marked <span className="font-bold text-text">{cat}</span>, with the analysis ID attached. An email went to the team too. You’ll hear back at maya.delgado@…</p>
            <div className="mt-6 flex w-full flex-col gap-2">
              <Button block variant="ink" onClick={() => { track('report_back_analysis'); navigate('app.analysis') }}>
                Back to the analysis
              </Button>
              <Button block variant="outline" onClick={() => { track('report_back_account'); navigate('app.account') }}>
                Account & Settings
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div key="form" variants={listParent} initial="hidden" animate="show" className="px-5 pt-2">
            <motion.p variants={listItem} className="text-[14px] leading-snug text-text-2">Tell us what went wrong. Reports go straight to the admin inbox and email the team.</motion.p>
            <motion.div variants={listItem} className="mt-4">
              <p className="label mb-2 text-text-2">Category</p>
              <Segmented items={CATS} value={cat} onChange={(v) => { if (v === cat) return toast(`Category is already ${v}`, 'neutral'); setCat(v); track('report_category', v) }} full />
            </motion.div>
            <motion.div variants={listItem} className="mt-4">
              <TextArea label="What happened?" rows={5} value={text} onChange={(e) => setText(e.target.value)} />
            </motion.div>

            <motion.div variants={listItem} className="mt-4 rounded-[var(--r-card)] bg-[var(--surface)] p-3 shadow-[var(--shadow-raised)]">
              <button type="button" role="checkbox" aria-checked={attach} onClick={() => setAttach((v) => !v)} className="flex w-full items-center gap-3 text-left">
                <CheckMark on={attach} />
                <span className="min-w-0 flex-1">
                  <span className="block text-[14px] font-semibold">Attach a screenshot of the current screen</span>
                  <span className="block text-[12.5px] text-text-2">Optional. The app offers the screen you came from.</span>
                </span>
                <ImageIcon size={18} className="text-text-2" aria-hidden />
              </button>
              <AnimatePresence initial={false}>
                {attach && a.photo && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                    <div className="mt-3 flex items-center gap-3">
                      <HeroImage src={a.photo} alt="" scrim="none" width={200} className="h-[84px] w-[60px] rounded-[8px]" position="top" />
                      <span className="text-[12.5px] text-text-2">
                        Analysis · {a.title}
                        <br />
                        <span className="meta">screenshot_analysis_an_9c41d.png · 1.2 MB</span>
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            <motion.div variants={listItem} className="mt-5">
              <p className="label text-text-2">Attached automatically</p>
              <dl className="mt-2 divide-y divide-[var(--rule)] rounded-[var(--r-card)] bg-[var(--surface-tint)] px-4">
                {META.map(([k, v]) => (
                  <div key={k} className="flex items-center justify-between py-2.5 text-[13px]">
                    <dt className="text-text-2">{k}</dt>
                    <dd className="num font-semibold">{v}</dd>
                  </div>
                ))}
              </dl>
              <p className="meta mt-3 flex items-center gap-1.5 text-text-3">
                <Mail size={12} aria-hidden /> Each report also sends an email notification to the team.
              </p>
            </motion.div>
            <motion.div variants={listItem} className="mt-5">
              <p className="label text-text-2">Your previous reports</p>
              <ul className="mt-2 divide-y divide-[var(--rule)]">
                {[['Bug', 'Pull-to-refresh spun on office wifi', 'Oct 30', 'fixed'], ['Other', 'Asked for °C as well as °F', 'Oct 12', 'open']].map(([c, t, d, st]) => (
                  <li key={t} className="flex items-center gap-3 py-2.5">
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13.5px] font-semibold">{t}</span>
                      <span className="meta block text-text-2">{c} · {d}</span>
                    </span>
                    <span className={`label rounded-full px-2.5 py-1 ${st === 'fixed' ? 'bg-success-soft text-on-success-soft' : 'bg-warn-soft text-on-warn-soft'}`}>{st}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
            <button type="button" onClick={back} className="mt-3 h-11 text-[13px] font-bold text-text-2">
              Cancel
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </MobileScreen>
  )
}
