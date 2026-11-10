import { motion } from 'framer-motion'
import { ArrowRight, Camera, ChevronRight, CloudRain, Palette, RefreshCw } from 'lucide-react'
import { useState } from 'react'
import { IceRing, ScorePill, ScoreStrip, Vip, WeatherChip } from '../../components/Brand'
import { Button, Pressable } from '../../components/Button'
import { HeroImage, Rail } from '../../components/Media'
import { AVG_SCORE, HISTORY, LAST_BEFORE_TODAY, SCORED, TODAY } from '../../data/analyses'
import { CLOCK, WEATHER } from '../../data/clock'
import { ARTICLES, DEEP_AUTUMN, EDITION, PRACTICE, STYLE_PROFILE } from '../../data/content'
import { useNav } from '../../lib/navigation'
import { scansUsed, session, useSession } from '../../lib/store'
import { track } from '../../lib/tracker'
import { listItem, listParent } from '../../motion/transitions'
import { ArticleCard } from './_shared'
import { AvatarBar, MobileScreen, SectionHead } from '../mobileShell'

/* app.home: the default screen after login. A greeting by name and the
   camera call to action; the style summary from onboarding; the "your last
   fit scored 72, try again?" card; then the newsletter feed as cards in
   the app's own design, newest first, with pull-to-refresh. */

export default function AppHome() {
  const { navigate, toast } = useNav()
  const used = useSession(scansUsed)
  const daily = useSession((s) => s.limits.daily)
  const scanned = useSession((s) => s.scannedToday)
  const read = useSession((s) => s.readArticles)
  const colourDone = useSession((s) => s.colourDone)
  const [refreshing, setRefreshing] = useState(false)
  const latest = scanned ? TODAY : LAST_BEFORE_TODAY
  const recent = (scanned ? HISTORY : HISTORY.filter((a) => a.id !== 'a-today')).filter((a) => a.state === 'scored').slice(0, 6)
  const hour = Math.floor(CLOCK.nowMin / 60)
  const greet = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  const refresh = () => {
    setRefreshing(true)
    track('feed_refresh')
    window.setTimeout(() => {
      setRefreshing(false)
      toast('Feed is up to date · The Edit, week of Nov 8', 'accent')
    }, 900)
  }

  return (
    <MobileScreen tab="home" header={<AvatarBar eyebrow={`${CLOCK.dateUS} · ${WEATHER.city}`} title={<Vip label="VIP member" />} />}>
      <motion.div variants={listParent} initial="hidden" animate="show">
        {/* ── Hero: greeting + the camera CTA ── */}
        <motion.div variants={listItem} className="px-5 pt-1">
          <h1 className="grot text-[40px] leading-[0.95]">
            {greet}, <em>Maya.</em>
          </h1>
          <p className="mt-2 text-[14.5px] leading-snug text-text-2">{STYLE_PROFILE.summary}</p>
        </motion.div>

        <motion.div variants={listItem} className="mt-5 px-5">
          <Pressable
            onClick={() => {
              track('open_camera', 'home_hero')
              navigate('app.camera')
            }}
            className="relative overflow-hidden rounded-[var(--r-container)] bg-ink text-on-ink shadow-[var(--shadow-floating)]"
          >
            <HeroImage src="fitPlaid" alt="" scrim="none" width={900} className="absolute inset-0 opacity-70" position="center 30%" />
            <div aria-hidden className="pointer-events-none absolute inset-0 [background:linear-gradient(100deg,rgb(10_10_10/0.92)_0%,rgb(10_10_10/0.78)_45%,rgb(10_10_10/0.25)_100%)]" />
            <div aria-hidden className="facet-soft" />
            <div className="relative flex items-center gap-4 p-5">
              <div className="min-w-0 flex-1">
                <span className="label text-gold-light">Style assistant</span>
                <span className="grot mt-1 block text-[28px] leading-[0.98]">Scan today’s outfit</span>
                <span className="mt-2 flex flex-wrap items-center gap-2">
                  <WeatherChip tempF={WEATHER.tempF} summary={WEATHER.summary} windMph={WEATHER.windMph} tone="ink" />
                  <span className="meta text-on-ink-2">
                    {used} of {daily} today
                  </span>
                </span>
              </div>
              <span className="grid h-[64px] w-[64px] shrink-0 place-items-center rounded-full bg-gold text-on-gold shadow-[var(--glow-gold)]">
                <Camera size={30} strokeWidth={2.3} aria-hidden />
              </span>
            </div>
          </Pressable>
        </motion.div>

        {/* ── Last fit + allowance: asymmetric bento ── */}
        <motion.div variants={listItem} className="mt-3 grid grid-cols-[1.6fr_1fr] gap-3 px-5">
          <Pressable
            onClick={() => {
              session.viewAnalysis(latest.id)
              track('open_last_fit', latest.id)
              navigate('app.analysis')
            }}
            className="flex min-w-0 gap-3 rounded-[var(--r-card)] bg-[var(--surface)] p-3 shadow-[var(--shadow-raised)]"
          >
            {latest.photo && <HeroImage src={latest.photo} alt="" scrim="none" width={240} className="h-[96px] w-[72px] shrink-0 rounded-[10px]" position="top" />}
            <span className="min-w-0 flex-1">
              <span className="label block text-text-2">{scanned ? 'Today' : 'Your last fit'}</span>
              <span className="grot mt-1 block text-[24px] leading-none">
                {latest.overall}
                <span className="unit text-text-2">/100</span>
              </span>
              <span className="mt-1 block truncate text-[12.5px] font-semibold text-text">{latest.title}</span>
              <span className="mt-1.5 flex items-center gap-1 text-[12px] font-bold text-gold-ink">
                {scanned ? 'See the full analysis' : 'Try again?'} <ArrowRight size={12} aria-hidden />
              </span>
            </span>
          </Pressable>
          <Pressable
            onClick={() => {
              track('open_allowance')
              navigate(used >= daily ? 'app.limit' : 'app.history')
            }}
            className="flex min-w-0 flex-col items-center justify-center rounded-[var(--r-card)] bg-[var(--surface)] p-3 shadow-[var(--shadow-raised)]"
          >
            <IceRing value={(used / daily) * 100} size={78} stroke={6} color="var(--text)" delay={0.3}>
              <span className="num text-[20px] font-bold leading-none">
                {used}
                <span className="text-[11px] font-semibold text-text-2">/{daily}</span>
              </span>
            </IceRing>
            <span className="label mt-2 text-text-2">Scans today</span>
          </Pressable>
        </motion.div>

        {/* ── Colours ── */}
        <motion.div variants={listItem} className="mt-3 px-5">
          <Pressable
            onClick={() => {
              track('open_colours', 'home')
              navigate(colourDone ? 'app.colours' : 'app.colourquiz')
            }}
            className="flex items-center gap-3 rounded-full bg-[var(--surface-tint)] py-2 pl-2 pr-4"
          >
            <span className="flex -space-x-1.5">
              {DEEP_AUTUMN.palette.slice(0, 5).map((c) => (
                <span key={c.hex} className="h-7 w-7 rounded-full ring-2 ring-[var(--bg)]" style={{ background: c.hex }} aria-hidden />
              ))}
            </span>
            <span className="min-w-0 flex-1 text-[13px] font-bold text-text">
              {colourDone ? (
                <>
                  My Colours · <span className="text-gold-ink">{DEEP_AUTUMN.name}</span> · gold first
                </>
              ) : (
                'Find my colours · 8 questions'
              )}
            </span>
            <Palette size={16} className="shrink-0 text-text-2" aria-hidden />
          </Pressable>
        </motion.div>

        {/* ── Recent scans rail ── */}
        <SectionHead className="mt-7" eyebrow={`${SCORED.length} scans · average ${AVG_SCORE}`} title="Recent scans" action="History" onAction={() => navigate('app.history')} />
        <motion.div variants={listItem} className="mt-3">
          <Rail>
            {recent.map((a) => (
              <Pressable
                key={a.id}
                onClick={() => {
                  session.viewAnalysis(a.id)
                  track('open_analysis', a.id)
                  navigate('app.analysis')
                }}
                className="w-[132px] shrink-0 snap-start"
              >
                {a.photo && (
                  <HeroImage src={a.photo} alt="" scrim="b" width={320} className="aspect-[3/4] rounded-[var(--r-card)]" position="top">
                    <div className="flex h-full flex-col justify-between p-2.5">
                      <ScorePill value={a.overall} className="self-start" />
                      <div>
                        <span className="label block text-gold-light">{a.occasion ?? 'No occasion'}</span>
                        <ScoreStrip scores={a.sub} size="xs" labels={false} tone="ink" className="mt-1.5" />
                      </div>
                    </div>
                  </HeroImage>
                )}
              </Pressable>
            ))}
            <Pressable onClick={() => navigate('app.history')} className="flex w-[100px] shrink-0 snap-start items-center justify-center rounded-[var(--r-card)] bg-[var(--surface-high)] text-[13px] font-bold text-text">
              +{HISTORY.length - recent.length} more <ChevronRight size={14} aria-hidden />
            </Pressable>
          </Rail>
        </motion.div>

        {/* ── The newsletter feed ── */}
        <motion.div variants={listItem} className="mt-8 border-t-4 border-[var(--text)] px-5 pt-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="label text-gold-ink">Style tips · from iceycrew.com</p>
              <h2 className="grot mt-1 text-[34px] leading-[0.95]">{EDITION.title}</h2>
              <p className="meta mt-1.5 text-text-2">{EDITION.week} · newest first</p>
            </div>
            <button type="button" onClick={refresh} aria-label="Refresh the feed" className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[var(--surface-high)] text-text">
              <RefreshCw size={17} className={refreshing ? 'animate-spin' : ''} aria-hidden />
            </button>
          </div>
          <p className="mt-3 text-[14px] leading-snug text-text-2">{EDITION.intro}</p>
        </motion.div>

        <motion.ul variants={listParent} initial="hidden" animate="show" className="mt-5 flex flex-col gap-4 px-5">
          {ARTICLES.slice(0, 4).map((a) => (
            <ArticleCard key={a.id} a={a} wide read={read.includes(a.id)} />
          ))}
        </motion.ul>

        <motion.div variants={listItem} className="mx-5 mt-5 overflow-hidden rounded-[var(--r-container)] bg-ink p-5 text-on-ink">
          <div aria-hidden className="facet" style={{ opacity: 0.35 }} />
          <span className="label text-gold-light">This week, for you</span>
          <h3 className="grot mt-1 text-[24px]">{PRACTICE.title}</h3>
          <p className="mt-2 text-[13.5px] leading-relaxed text-on-ink-2">{PRACTICE.body}</p>
          <Button variant="accent" size="sm" className="mt-4" icon={Camera} onClick={() => { track('open_camera', 'practice'); navigate('app.camera') }}>
            Try one and scan it
          </Button>
        </motion.div>

        <motion.ul variants={listParent} initial="hidden" animate="show" className="mt-5 flex flex-col gap-4 px-5">
          {ARTICLES.slice(4).map((a) => (
            <ArticleCard key={a.id} a={a} wide read={read.includes(a.id)} />
          ))}
        </motion.ul>

        <motion.p variants={listItem} className="meta mx-5 mt-6 flex items-start gap-2 text-text-3">
          <CloudRain size={13} className="mt-0.5 shrink-0" aria-hidden />
          Picked from {EDITION.pickedFrom} articles published this week, ranked on how {EDITION.criteria} each idea is. {EDITION.updated}.
        </motion.p>
      </motion.div>
    </MobileScreen>
  )
}
