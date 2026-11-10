import { motion } from 'framer-motion'
import { Camera, ChevronRight, Sparkles } from 'lucide-react'
import { Avatar } from '../../components/Avatar'
import { ScorePill, ScoreStrip } from '../../components/Brand'
import { Pressable } from '../../components/Button'
import { HeroImage } from '../../components/Media'
import { fmtUS, ago } from '../../data/clock'
import type { Analysis } from '../../data/analyses'
import type { Article } from '../../data/content'
import { useNav } from '../../lib/navigation'
import { session } from '../../lib/store'
import { track } from '../../lib/tracker'
import { listItem } from '../../motion/transitions'

/* Pieces shared by several Member App screens. */

/** A newsletter card: image, title, source, the IceyCrew note. */
export function ArticleCard({ a, wide = false, read = false }: { a: Article; wide?: boolean; read?: boolean }) {
  const { navigate } = useNav()
  return (
    <motion.li variants={listItem} className={wide ? 'w-full' : 'w-[248px] shrink-0 snap-start'}>
      <Pressable
        onClick={() => {
          session.viewArticle(a.id)
          track('open_article', a.id, { source: a.source })
          navigate('app.article')
        }}
        className="group overflow-hidden rounded-[var(--r-card)] bg-[var(--surface)] shadow-[var(--shadow-raised)]"
      >
        <HeroImage src={a.image} alt="" scrim="b" width={700} className={wide ? 'aspect-[16/10] w-full' : 'aspect-[4/3] w-full'}>
          <div className="flex h-full flex-col justify-end p-4">
            <span className="label text-gold-light">{a.source}</span>
            <span className={`grot mt-1 text-on-night ${wide ? 'text-[24px]' : 'text-[19px]'}`}>{a.title}</span>
          </div>
          {read && <span className="label absolute right-3 top-3 rounded-full bg-[rgb(255_255_255/0.9)] px-2 py-1 text-text">Read</span>}
          {a.paywalled && !read && <span className="label absolute right-3 top-3 rounded-full bg-[rgb(255_255_255/0.9)] px-2 py-1 text-text">Paywall</span>}
        </HeroImage>
        <div className="p-4 pt-3">
          <p className="text-[13px] leading-snug text-text">
            <span className="font-bold text-gold-ink">IceyCrew note · </span>
            {a.note}
          </p>
          <p className="meta mt-2 flex items-center justify-between text-text-2">
            <span>{fmtUS(a.publishedIso)} · {a.readMin} min read</span>
            <ChevronRight size={14} aria-hidden />
          </p>
        </div>
      </Pressable>
    </motion.li>
  )
}

/** A history row: thumbnail (or the deleted-photo placeholder), title, occasion, date, score pill and the strip. */
export function AnalysisRow({ a }: { a: Analysis }) {
  const { navigate } = useNav()
  const open = () => {
    session.viewAnalysis(a.id)
    track('open_analysis', a.id)
    navigate('app.analysis')
  }
  if (a.state !== 'scored')
    return (
      <motion.li variants={listItem}>
        <div className="flex gap-3 px-5 py-3">
          <span className="grid h-[72px] w-[56px] shrink-0 place-items-center rounded-[10px] bg-[var(--surface-high)] text-text-3">
            <Camera size={18} aria-hidden />
          </span>
          <span className="min-w-0 flex-1">
            <span className="flex items-center justify-between gap-2">
              <span className="text-[14px] font-bold text-text">{a.state === 'refused' ? 'Not analysed · content check' : 'Not analysed · outfit not fully visible'}</span>
              <span className="meta shrink-0 text-text-2">{fmtUS(a.dateIso)}</span>
            </span>
            <span className="mt-1 block text-[12.5px] leading-snug text-text-2">{a.failReason}</span>
            <span className={`label mt-2 inline-flex h-6 items-center rounded-full px-2.5 ${a.state === 'refused' ? 'bg-danger-soft text-on-danger-soft' : 'bg-[var(--surface-high)] text-text-2'}`}>{a.state === 'refused' ? 'Counted toward the limit' : 'Not counted'}</span>
          </span>
        </div>
      </motion.li>
    )
  return (
    <motion.li variants={listItem}>
      <Pressable onClick={open} className="flex gap-3 px-5 py-3 hover:bg-[var(--surface-raised)]">
        {a.photo && !a.photoDeleted ? (
          <HeroImage src={a.photo} alt="" scrim="none" width={200} className="h-[72px] w-[56px] shrink-0 rounded-[10px]" position="top" />
        ) : (
          <span className="grid h-[72px] w-[56px] shrink-0 place-items-center rounded-[10px] bg-[var(--surface-high)] text-text-3">
            <Camera size={18} aria-hidden />
          </span>
        )}
        <span className="min-w-0 flex-1">
          <span className="flex items-start justify-between gap-2">
            <span className="min-w-0">
              <span className="block truncate text-[14px] font-bold text-text">{a.title}</span>
              <span className="meta mt-0.5 block text-text-2">
                {a.occasion ?? 'No occasion'} · {a.weather ? `${a.weather.tempF}°F ${a.weather.summary}` : 'no weather'} · {a.minutesAgo === 0 ? 'just now' : ago(a.minutesAgo)}
              </span>
            </span>
            <ScorePill value={a.overall} />
          </span>
          <ScoreStrip scores={a.sub} size="xs" labels={false} className="mt-2.5" />
        </span>
      </Pressable>
    </motion.li>
  )
}

/** Maya's avatar + name line for sheets and profile heads. */
export function MayaLine({ sub }: { sub?: string }) {
  return (
    <span className="flex items-center gap-3">
      <Avatar who="maya" size={44} ring />
      <span className="min-w-0">
        <span className="block text-[15px] font-bold">Maya Delgado</span>
        {sub && <span className="block truncate text-[12.5px] text-text-2">{sub}</span>}
      </span>
    </span>
  )
}

export function AiEyebrow({ children }: { children: string }) {
  return (
    <span className="label inline-flex items-center gap-1.5 text-gold-ink">
      <Sparkles size={12} aria-hidden /> {children}
    </span>
  )
}
