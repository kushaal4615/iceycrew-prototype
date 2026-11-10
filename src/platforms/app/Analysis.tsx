import { motion } from 'framer-motion'
import { ArrowUpRight, Camera, Check, ChevronLeft, Flag, MapPin, Send, Share, TriangleAlert } from 'lucide-react'
import { useState } from 'react'
import { IceRing, ScoreStrip, StarRow, SUB_KEYS, SUB_LABEL, Swatch, band, BAND } from '../../components/Brand'
import { Button } from '../../components/Button'
import { TextArea } from '../../components/Form'
import { HeroImage } from '../../components/Media'
import { analysisById, TODAY } from '../../data/analyses'
import { fmtUS } from '../../data/clock'
import { DEEP_AUTUMN } from '../../data/content'
import { DEMO_HELPFUL_COMMENT } from '../../data/demoFill'
import { useNav } from '../../lib/navigation'
import { session, useSession } from '../../lib/store'
import { track } from '../../lib/tracker'
import { spring, tap } from '../../motion/springs'
import { listItem, listParent } from '../../motion/transitions'
import { MobileScreen, safeTop } from '../mobileShell'

/* app.analysis: the photo as the hero with occasion and weather over it;
   the overall score in the Ice Ring and the four sub-scores; what's
   working, what could be better, 3–5 tips tagged with item, colours,
   material, fit and priority; the 1–5 helpfulness rating with a comment;
   the small "Report a problem" link. */

const NAMED: Record<string, string> = { Black: '#1C1A17', Gold: '#E6B316', Cream: '#EADBC2', Tan: '#C58A4A', Chocolate: '#5B2A1E', Camel: '#D9A066', Olive: '#4A5A23', 'Dark indigo': '#1F2A4D', Mustard: '#C78A2B', Ochre: '#B87A1E', Taupe: '#8B7D6B', Ivory: '#F4EEDC', Bronze: '#9C6B2F', Burgundy: '#7A1F2B', Silver: '#B9BCC2' }

export default function AppAnalysis() {
  const { navigate, back, canGoBack, toast } = useNav()
  const id = useSession((s) => s.viewingAnalysis)
  const a = analysisById(id)
  const rated = useSession((s) => s.helpfulness[a.id] ?? a.helpfulness ?? 0)
  const sentComment = useSession((s) => s.comments[a.id])
  const [comment, setComment] = useState(a.comment ?? DEMO_HELPFUL_COMMENT)
  const [saved, setSaved] = useState(false)
  const isToday = a.id === TODAY.id

  const sendRating = () => {
    if (!rated) return toast('Tap a star first', 'warn')
    session.comment(a.id, comment.trim())
    track('helpfulness', rated, { analysis: a.id, comment: !!comment.trim() })
    toast('Thanks. Your rating and note are stored with this analysis.', 'accent')
  }

  return (
    <MobileScreen tab="camera" bg="var(--bg)" cap="var(--night)">
      <motion.div variants={listParent} initial="hidden" animate="show">
        {/* ── Hero: the photo ── */}
        <div className="relative">
          {a.photo ? (
            <HeroImage src={a.photo} alt={a.title} scrim="both" width={1000} className="h-[520px]" position="center 25%" />
          ) : (
            <div className="grid h-[320px] place-items-center bg-ink text-on-ink-2">Photo deleted after 12 months · scores kept</div>
          )}
          <div className="absolute inset-x-0 flex items-center justify-between px-3" style={{ top: safeTop(4) }}>
            {canGoBack ? (
              <motion.button type="button" whileTap={tap} transition={spring.ui} onClick={() => { track('go_back'); back() }} aria-label="Back" className="flex h-11 items-center gap-0.5 rounded-full bg-[rgb(10_10_10/0.45)] pl-1 pr-3 text-[15px] font-semibold text-white backdrop-blur-md">
                <ChevronLeft size={24} aria-hidden /> Back
              </motion.button>
            ) : (
              <span />
            )}
            <motion.button type="button" whileTap={tap} transition={spring.ui} onClick={() => { track('share_analysis', a.id); toast('Share sheet: your score card as an image', 'info') }} aria-label="Share" className="grid h-11 w-11 place-items-center rounded-full bg-[rgb(10_10_10/0.45)] text-white backdrop-blur-md">
              <Share size={20} aria-hidden />
            </motion.button>
          </div>
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 px-5 pb-5">
            <div className="min-w-0">
              <p className="label text-gold-light">{isToday ? 'Just now' : fmtUS(a.dateIso, true)} · {a.time}</p>
              <h1 className="grot mt-1 text-[30px] leading-[0.98] text-on-night">{a.title}</h1>
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                <span className="label rounded-full bg-[rgb(255_255_255/0.92)] px-2.5 py-1.5 text-text">{a.occasion ?? 'No occasion'}</span>
                {a.weather && (
                  <span className="label inline-flex items-center gap-1 rounded-full bg-[#1f1f1e] px-2.5 py-1.5 text-gold-light">
                    <MapPin size={11} aria-hidden /> {a.weather.city} · {a.weather.tempF}°F · {a.weather.summary} · {a.weather.windMph} mph
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── Score block: the Ice Ring lapping the hero ── */}
        <motion.div variants={listItem} className="relative z-10 -mt-7 mx-5 rounded-[var(--r-container)] bg-[var(--surface)] p-5 shadow-[var(--shadow-floating)]">
          <div className="flex items-center gap-5">
            <IceRing value={a.overall} size={132} stroke={9} label="out of 100" delay={0.25} />
            <div className="min-w-0 flex-1">
              <p className="label text-text-2">Overall</p>
              <p className="grot mt-1 text-[24px] leading-[1]">{BAND[band(a.overall)].label}</p>
              <p className="mt-2 text-[12.5px] leading-snug text-text-2">
                {isToday ? 'Up 12 on your last fit. ' : ''}
                Scored on fashion conventions and your own profile: elevated streetwear, {DEEP_AUTUMN.name}.
              </p>
            </div>
          </div>
          <div className="mt-5 grid grid-cols-4 gap-2">
            {SUB_KEYS.map((k) => {
              const v = a.sub[k]
              return (
                <div key={k} className="flex flex-col items-center">
                  <IceRing value={v} size={62} stroke={5} delay={0.4}>
                    <span className="num text-[17px] font-bold">{v}</span>
                  </IceRing>
                  <span className="mt-1.5 text-[11px] font-bold text-text-2">{SUB_LABEL[k]}</span>
                </div>
              )
            })}
          </div>
          <ScoreStrip scores={a.sub} size="sm" labels={false} className="mt-4" />
          <p className="meta mt-3 text-text-3">{a.occasion ? `Occasion reflects “${a.occasion}” and the weather.` : 'No occasion given: Occasion rates general suitability.'} Dates and units follow your region: US · °F · {fmtUS(a.dateIso)}.</p>
        </motion.div>

        {/* ── What's working ── */}
        <motion.section variants={listItem} className="mt-7 px-5">
          <h2 className="grot text-[24px]">What’s working</h2>
          <ul className="mt-3 flex flex-col gap-3">
            {a.positives.map((p) => (
              <li key={p} className="flex gap-3">
                <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-gold text-on-gold">
                  <Check size={14} strokeWidth={3} aria-hidden />
                </span>
                <span className="text-[15px] leading-snug text-text">{p}</span>
              </li>
            ))}
          </ul>
        </motion.section>

        {/* ── What could be better ── */}
        <motion.section variants={listItem} className="mt-7 px-5">
          <h2 className="grot text-[24px]">What could be better</h2>
          <ul className="mt-3 flex flex-col gap-3">
            {a.negatives.map((n) => (
              <li key={n} className="flex gap-3">
                <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-ink text-on-ink">
                  <TriangleAlert size={13} strokeWidth={2.6} aria-hidden />
                </span>
                <span className="text-[15px] leading-snug text-text">{n}</span>
              </li>
            ))}
          </ul>
        </motion.section>

        {/* ── Level up your fit ── */}
        <motion.section variants={listItem} className="mt-8 bg-ink py-6 text-on-ink">
          <div className="px-5">
            <p className="label text-gold-light">{a.tips.length} tips · tagged for your closet</p>
            <h2 className="grot mt-1 text-[30px]">Level up your fit</h2>
          </div>
          <ol className="mt-4 flex flex-col gap-3 px-5">
            {a.tips.map((t, i) => (
              <li key={t.id} className={`rounded-[var(--r-card)] p-4 ${i === 0 ? 'bg-gold text-on-gold' : 'bg-[rgb(255_255_255/0.07)]'}`}>
                <div className="flex items-start gap-3">
                  <span className={`num grid h-7 w-7 shrink-0 place-items-center rounded-full text-[12px] font-extrabold ${i === 0 ? 'bg-[rgb(0_0_0/0.15)]' : 'bg-gold text-on-gold'}`}>{i + 1}</span>
                  <p className="text-[14.5px] leading-snug">{t.text}</p>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-1.5 pl-10">
                  <span className={`label rounded-full px-2 py-1 ${i === 0 ? 'bg-[rgb(0_0_0/0.12)]' : 'bg-[#2b2b2a]'}`}>{t.item}</span>
                  {t.colours.map((c) => (
                    <span key={c} className={`label inline-flex items-center gap-1.5 rounded-full px-2 py-1 ${i === 0 ? 'bg-[rgb(0_0_0/0.12)]' : 'bg-[#2b2b2a]'}`}>
                      <span className="h-3 w-3 rounded-full ring-1 ring-[rgb(255_255_255/0.4)]" style={{ background: NAMED[c] ?? '#888' }} aria-hidden /> {c}
                    </span>
                  ))}
                  {t.material && <span className={`label rounded-full px-2 py-1 ${i === 0 ? 'bg-[rgb(0_0_0/0.12)]' : 'bg-[#2b2b2a]'}`}>{t.material}</span>}
                  {t.fit && <span className={`label rounded-full px-2 py-1 ${i === 0 ? 'bg-[rgb(0_0_0/0.12)]' : 'bg-[#2b2b2a]'}`}>{t.fit}</span>}
                  <span className={`label ml-auto ${i === 0 ? 'text-[var(--on-accent-2)]' : 'text-gold-light'}`}>{t.priority} priority</span>
                </div>
              </li>
            ))}
          </ol>
          <div className="mt-5 flex items-center gap-3 px-5">
            <span className="flex -space-x-1">
              {DEEP_AUTUMN.palette.slice(0, 6).map((c) => (
                <Swatch key={c.hex} hex={c.hex} size={22} label={false} className="ring-2 ring-[var(--ink)]" />
              ))}
            </span>
            <button type="button" onClick={() => { track('open_colours', 'analysis'); navigate('app.colours') }} className="flex h-11 items-center gap-1 text-[13px] font-bold text-gold-light">
              Tips use your {DEEP_AUTUMN.name} palette <ArrowUpRight size={14} aria-hidden />
            </button>
          </div>
        </motion.section>

        {/* ── Helpfulness ── */}
        <motion.section variants={listItem} className="mx-5 mt-7 rounded-[var(--r-container)] bg-[var(--surface)] p-5 shadow-[var(--shadow-raised)]">
          <h2 className="grot text-[22px]">How helpful was this?</h2>
          <div className="mt-2 flex items-center justify-between">
            <StarRow rating={rated} size={26} onPick={(n) => { session.rate(a.id, n); track('helpfulness_pick', n) }} />
            <span className="meta text-text-2">{rated ? `${rated} of 5` : 'Tap a star'}</span>
          </div>
          <div className="mt-3">
            <TextArea label="Optional comment" rows={3} value={comment} onChange={(e) => setComment(e.target.value)} hint="Stored with this analysis and its tags, for analytics." />
          </div>
          <div className="mt-3 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => {
                track('report_problem_link', a.id)
                navigate('app.report')
              }}
              className="flex h-11 items-center gap-1.5 text-[13px] font-bold text-text-2 underline-offset-4 hover:underline"
            >
              <Flag size={14} aria-hidden /> Report a problem
            </button>
            <Button size="sm" variant="ink" icon={Send} onClick={sendRating}>
              {sentComment !== undefined ? 'Update' : 'Send'}
            </Button>
          </div>
        </motion.section>

        <motion.div variants={listItem} className="mt-6 flex flex-col items-center gap-3 px-5">
          <Button size="lg" block icon={Camera} onClick={() => { track('open_camera', 'analysis'); navigate('app.camera') }}>
            Scan another outfit
          </Button>
          <button
            type="button"
            onClick={() => {
              setSaved(true)
              track('open_history', 'analysis')
              navigate('app.history')
            }}
            className="flex h-11 items-center text-[13px] font-bold text-text-2"
          >
            {saved ? 'Saved' : 'Saved to your history'} · see all scans
          </button>
        </motion.div>
      </motion.div>
    </MobileScreen>
  )
}
