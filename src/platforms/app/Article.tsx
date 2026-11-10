import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Bookmark, ChevronLeft, ChevronRight, Lock, Share, Unlink } from 'lucide-react'
import { Skeleton } from '../../components/Media'
import { HeroImage } from '../../components/Media'
import { Button } from '../../components/Button'
import { fmtUS } from '../../data/clock'
import { articleById } from '../../data/content'
import { useNav } from '../../lib/navigation'
import { useSession } from '../../lib/store'
import { track } from '../../lib/tracker'
import { fadeUp } from '../../motion/transitions'
import { MobileScreen, SAFE_TOP, safeBottom } from '../mobileShell'

/* app.article: the in-app browser (SFSafariViewController on iOS, Chrome
   Custom Tabs on Android). The publisher's page renders here; the app
   never copies the article. A "Done" button returns to the feed. The
   broken-link state shows a friendly error and a way back. */

export default function AppArticle() {
  const { back, toast } = useNav()
  const id = useSession((s) => s.viewingArticle)
  const a = articleById(id)
  const done = () => {
    track('article_done', a.id)
    back()
  }
  return (
    <MobileScreen padBottom={false} bg="#ffffff" header={
      <header className="relative z-20 shrink-0 border-b border-[rgb(0_0_0/0.08)] bg-[#F6F6F6] text-[#111]" style={{ paddingTop: SAFE_TOP }}>
        <div className="flex h-[48px] items-center gap-2 px-2">
          <button type="button" onClick={done} className="h-11 rounded-full px-3 text-[16px] font-semibold text-[#2332D5]">
            Done
          </button>
          <span className="flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-[10px] bg-[#E9E9EB] px-3 py-1.5 text-[13px] font-semibold text-[#111]">
            <Lock size={12} aria-hidden /> <span className="truncate">{a.domain}</span>
          </span>
          <button type="button" onClick={() => toast('Reader view would open here', 'info')} aria-label="Reader view" className="grid h-11 w-11 place-items-center rounded-full text-[#2332D5]">
            <span className="text-[14px] font-extrabold">Aa</span>
          </button>
        </div>
      </header>
    }>
      <div className="relative min-h-full pb-28">
        {a.broken ? (
          <motion.div variants={fadeUp} initial="hidden" animate="show" className="flex flex-col items-center px-8 pt-16 text-center">
            <span className="grid h-16 w-16 place-items-center rounded-full bg-[#F0F0F0] text-[#8A8A8A]">
              <Unlink size={26} aria-hidden />
            </span>
            <h1 className="grot mt-5 text-[26px] text-[#111]">That article isn’t available any more</h1>
            <p className="mt-2 text-[14px] leading-snug text-[#5E5E5A]">{a.source} has removed or moved the page. Nothing you did; links in the feed are checked, and this one will be dropped on the next pull.</p>
            <Button className="mt-6" variant="ink" icon={ArrowLeft} onClick={done}>
              Back to the feed
            </Button>
          </motion.div>
        ) : (
          <motion.article variants={fadeUp} initial="hidden" animate="show" className="text-[#111]">
            {/* the publisher's page, as the browser renders it */}
            <div className="flex items-center justify-between border-b border-[rgb(0_0_0/0.08)] px-5 py-3">
              <span className="font-[Playfair_Display] text-[22px] font-semibold tracking-[-0.02em]">{a.source.split(' · ')[0]}</span>
              <span className="label text-[#8A8A8A]">Fashion</span>
            </div>
            {a.paywalled && (
              <div className="flex items-center gap-3 bg-[#111] px-5 py-3 text-[#FAFAF8]">
                <Lock size={16} aria-hidden />
                <span className="text-[12.5px] leading-snug">This story is for {a.source.split(' · ')[0]} subscribers. The feed still shows it; no workaround is needed.</span>
              </div>
            )}
            <div className="px-5 pt-5">
              <p className="label text-[#8A8A8A]">{fmtUS(a.publishedIso, true)} · {a.readMin} min read</p>
              <h1 className="mt-2 font-[Playfair_Display] text-[30px] font-medium leading-[1.05] tracking-[-0.02em]">{a.title}</h1>
              <p className="mt-3 text-[13px] text-[#5E5E5A]">By the {a.source.split(' · ')[0]} editors</p>
            </div>
            <HeroImage src={a.image} alt="" scrim="none" width={900} className="mt-4 aspect-[4/3] w-full" position="center" />
            {/* body text belongs to the publisher: rendered by the browser, never copied into the app */}
            <div className="flex flex-col gap-3 px-5 pt-5" aria-label="Article body, rendered by the publisher">
              {[100, 96, 88, 92, 60, 0, 98, 94, 90, 72].map((w, i) => (w === 0 ? <span key={i} className="h-2" /> : <Skeleton key={i} className="h-3.5" style={{ width: `${w}%` }} />))}
              <p className="mt-2 rounded-[10px] bg-[#F6F6F6] p-3 text-[12px] leading-snug text-[#5E5E5A]">
                The publisher’s page loads here exactly as on the web. The app shows it inside an in-app browser and never copies or re-displays the text.
              </p>
              {[94, 88, 97, 80, 91, 66].map((w, i) => <Skeleton key={`b${i}`} className="h-3.5" style={{ width: `${w}%` }} />)}
            </div>
            <div className="mt-6 border-t border-[rgb(0_0_0/0.08)] px-5 pt-4">
              <p className="label text-[#8A8A8A]">More from {a.source.split(' · ')[0]}</p>
              <ul className="mt-3 grid grid-cols-1 gap-3">
                {[0, 1, 2].map((i) => (
                  <li key={i} className="flex items-center gap-3">
                    <Skeleton className="h-14 w-20 shrink-0 rounded-[8px]" />
                    <span className="flex min-w-0 flex-1 flex-col gap-2">
                      <Skeleton className="h-3.5" style={{ width: `${[92, 70, 84][i]}%` }} />
                      <Skeleton className="h-3" style={{ width: '40%' }} />
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.article>
        )}

        {/* the browser's own toolbar */}
        <nav aria-label="Browser" className="absolute inset-x-0 bottom-0 border-t border-[rgb(0_0_0/0.08)] bg-[#F6F6F6]" style={{ paddingBottom: safeBottom(0) }}>
          <div className="flex h-12 items-center justify-around px-2 text-[#2332D5]">
            <button type="button" onClick={done} aria-label="Back" className="grid h-11 w-11 place-items-center"><ChevronLeft size={24} /></button>
            <button type="button" onClick={() => toast('Nothing forward yet', 'neutral')} aria-label="Forward" className="grid h-11 w-11 place-items-center text-[#B5B5B0]"><ChevronRight size={24} /></button>
            <button type="button" onClick={() => { track('article_share', a.id); toast(`Share sheet: ${a.domain}`, 'info') }} aria-label="Share" className="grid h-11 w-11 place-items-center"><Share size={22} /></button>
            <button type="button" onClick={() => toast('Saved to Safari reading list', 'info')} aria-label="Bookmark" className="grid h-11 w-11 place-items-center"><Bookmark size={22} /></button>
            <button type="button" onClick={() => toast(`Opens ${a.domain} in Safari`, 'info')} aria-label="Open in Safari" className="grid h-11 w-11 place-items-center"><ArrowRight size={22} /></button>
          </div>
        </nav>
      </div>
    </MobileScreen>
  )
}
