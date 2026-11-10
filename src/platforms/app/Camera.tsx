import { AnimatePresence, motion } from 'framer-motion'
import { Check, Images, MapPin, RefreshCcw, Sparkles, X, Zap } from 'lucide-react'
import { useState } from 'react'
import { WeatherChip } from '../../components/Brand'
import { Button } from '../../components/Button'
import { Input } from '../../components/Form'
import { HeroImage } from '../../components/Media'
import { BottomSheet } from '../../components/Sheet'
import { WEATHER } from '../../data/clock'
import { OCCASIONS, type Occasion } from '../../data/content'
import { DEMO_CITY, DEMO_OTHER_OCCASION } from '../../data/demoFill'
import { useNav } from '../../lib/navigation'
import { scansUsed, session, useSession } from '../../lib/store'
import { track } from '../../lib/tracker'
import { spring, tap } from '../../motion/springs'
import { MobileScreen, safeBottom, safeTop } from '../mobileShell'

/* app.camera: the viewfinder with the full-body guide overlay, gallery
   upload, the "Analyse this outfit?" banner with Analyse / Retake, the
   occasion chips and the weather (location or a typed city). The bottom
   nav is hidden here. */

export default function AppCamera() {
  const { back, navigate, toast } = useNav()
  const occasion = useSession((s) => s.occasion)
  const other = useSession((s) => s.otherOccasion)
  const weatherOn = useSession((s) => s.weatherOn)
  const used = useSession(scansUsed)
  const daily = useSession((s) => s.limits.daily)
  const [captured, setCaptured] = useState(false)
  const [flash, setFlash] = useState(false)
  const [otherOpen, setOtherOpen] = useState(false)
  const [weatherOpen, setWeatherOpen] = useState(false)
  const [otherText, setOtherText] = useState(other || DEMO_OTHER_OCCASION)
  const [city, setCity] = useState(DEMO_CITY)

  const capture = (how: 'shutter' | 'gallery') => {
    track('photo_taken', how)
    setCaptured(true)
  }
  const analyse = () => {
    if (used >= daily) {
      track('rate_limit_hit', 'daily')
      return navigate('app.limit')
    }
    track('analysis_requested', occasion ?? 'none', { weather: weatherOn })
    session.scan()
    navigate('app.processing')
  }
  const pickOccasion = (o: Occasion) => {
    if (o === 'Other') {
      setOtherOpen(true)
      return
    }
    session.setOccasion(occasion === o ? null : o)
  }

  return (
    <MobileScreen
      padBottom={false}
      bg="var(--night)"
      overlay={
        <>
          <BottomSheet open={otherOpen} onClose={() => setOtherOpen(false)} title="Other occasion">
            <Input label="What are you dressing for?" value={otherText} onChange={(e) => setOtherText(e.target.value)} hint="Free text. Sent with the analysis so the Occasion score can use it." />
            <Button
              block
              className="mt-4"
              onClick={() => {
                if (!otherText.trim()) return toast('Type an occasion, or skip it', 'warn')
                session.setOtherOccasion(otherText.trim())
                session.setOccasion('Other')
                setOtherOpen(false)
              }}
            >
              Use “{otherText.trim() || '…'}”
            </Button>
          </BottomSheet>
          <BottomSheet open={weatherOpen} onClose={() => setWeatherOpen(false)} title="Weather for this scan">
            <p className="text-[14px] leading-snug text-text-2">With location permission the app fetches today’s temperature, rain and wind. Without it, type a city, or skip. The fetch adds under a second.</p>
            <div className="mt-4 rounded-[var(--r-card)] bg-[var(--surface-tint)] p-4">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-[14px] font-bold">
                  <MapPin size={16} className="text-gold-ink" aria-hidden /> Location · allowed on first use
                </span>
                <span className="label rounded-full bg-success-soft px-2 py-1 text-on-success-soft">Granted</span>
              </div>
              <p className="meta mt-2 text-text-2">
                {WEATHER.city} · {WEATHER.tempF}°F ({WEATHER.tempC}°C) · {WEATHER.summary} · rain {WEATHER.rainPct}% · wind {WEATHER.windMph} mph · high {WEATHER.high}° low {WEATHER.low}°
              </p>
            </div>
            <div className="mt-4">
              <Input label="Or type a city" value={city} onChange={(e) => setCity(e.target.value)} leading={<MapPin size={16} />} />
            </div>
            <div className="mt-4 flex gap-2">
              <Button variant="outline" block onClick={() => { session.setWeather(false); setWeatherOpen(false); toast('Weather skipped for this scan', 'neutral') }}>
                Skip weather
              </Button>
              <Button block onClick={() => { session.setWeather(true); setWeatherOpen(false); toast(`Weather from ${city.trim() || WEATHER.city}`, 'accent') }}>
                Use weather
              </Button>
            </div>
          </BottomSheet>
        </>
      }
    >
      <div className="relative h-full min-h-[720px] overflow-hidden">
        {/* the live viewfinder (a photograph stands in for the camera feed) */}
        <HeroImage src="fitWorkCoat" alt="" scrim="none" width={1000} className="absolute inset-0" position="center 30%" />
        <div aria-hidden className="pointer-events-none absolute inset-0 [background:linear-gradient(to_bottom,rgb(10_10_10/0.7)_0%,rgb(10_10_10/0)_22%,rgb(10_10_10/0)_55%,rgb(10_10_10/0.85)_100%)]" />
        <AnimatePresence>{flash && <motion.div key="flash" aria-hidden className="pointer-events-none absolute inset-0 bg-white" initial={{ opacity: 0.9 }} animate={{ opacity: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }} onAnimationComplete={() => setFlash(false)} />}</AnimatePresence>

        {/* full-body guide overlay */}
        {!captured && (
          <svg aria-hidden className="pointer-events-none absolute inset-x-0 mx-auto h-[58%] w-auto top-[17%]" viewBox="0 0 120 300" fill="none">
            <circle cx="60" cy="34" r="22" stroke="rgba(255,255,255,0.85)" strokeWidth="2" strokeDasharray="6 6" />
            <path d="M34 70h52c10 0 18 8 18 18v70c0 6-4 10-10 10h-6v110c0 6-4 10-10 10H42c-6 0-10-4-10-10V168h-6c-6 0-10-4-10-10V88c0-10 8-18 18-18Z" stroke="rgba(255,255,255,0.85)" strokeWidth="2" strokeDasharray="6 6" />
            <path d="M60 168v120" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeDasharray="6 6" />
          </svg>
        )}
        {!captured && (
          <div className="pointer-events-none absolute inset-x-0 top-[12%] flex justify-center">
            <span className="label rounded-full bg-[rgb(10_10_10/0.55)] px-3 py-1.5 text-on-night backdrop-blur-md">Fit your whole body in the guide</span>
          </div>
        )}
        {!captured && (
          <div aria-hidden className="pointer-events-none absolute inset-x-6 bottom-[34%] top-[16%]">
            {['top-0 left-0 border-t-2 border-l-2 rounded-tl-[14px]', 'top-0 right-0 border-t-2 border-r-2 rounded-tr-[14px]', 'bottom-0 left-0 border-b-2 border-l-2 rounded-bl-[14px]', 'bottom-0 right-0 border-b-2 border-r-2 rounded-br-[14px]'].map((c) => (
              <span key={c} className={`absolute h-6 w-6 border-white/80 ${c}`} />
            ))}
          </div>
        )}

        {/* top controls */}
        <div className="absolute inset-x-0 flex items-center justify-between px-3" style={{ top: safeTop(4) }}>
          <motion.button type="button" whileTap={tap} transition={spring.ui} onClick={() => { track('camera_close'); back() }} aria-label="Close the camera" className="grid h-11 w-11 place-items-center rounded-full bg-[rgb(10_10_10/0.5)] text-white backdrop-blur-md">
            <X size={22} aria-hidden />
          </motion.button>
          <button type="button" onClick={() => setWeatherOpen(true)} aria-label="Weather for this scan" className="pointer-events-auto">
            {weatherOn ? <WeatherChip tempF={WEATHER.tempF} summary={WEATHER.summary} windMph={WEATHER.windMph} tone="ink" className="bg-[rgb(10_10_10/0.55)] backdrop-blur-md" /> : <span className="label inline-flex h-8 items-center rounded-full bg-[rgb(10_10_10/0.55)] px-3 text-on-night backdrop-blur-md">Weather off · tap to add</span>}
          </button>
          <div className="flex gap-1.5">
            <motion.button type="button" whileTap={tap} transition={spring.ui} onClick={() => { setFlash(true); toast('Flash: auto', 'neutral') }} aria-label="Flash" className="grid h-11 w-11 place-items-center rounded-full bg-[rgb(10_10_10/0.5)] text-white backdrop-blur-md">
              <Zap size={20} aria-hidden />
            </motion.button>
            <motion.button type="button" whileTap={tap} transition={spring.ui} onClick={() => toast('Switched to the front camera', 'neutral')} aria-label="Flip camera" className="grid h-11 w-11 place-items-center rounded-full bg-[rgb(10_10_10/0.5)] text-white backdrop-blur-md">
              <RefreshCcw size={20} aria-hidden />
            </motion.button>
          </div>
        </div>

        {/* bottom: occasion chips + banner or shutter */}
        <div className="absolute inset-x-0 bottom-0 flex flex-col gap-3 px-4" style={{ paddingBottom: safeBottom(8) }}>
          <div className="scroll-x -mx-4 flex gap-1.5 px-4">
            {OCCASIONS.map((o) => {
              const on = occasion === o
              return (
                <motion.button key={o} type="button" whileTap={tap} transition={spring.ui} onClick={() => pickOccasion(o)} aria-pressed={on} className={`h-9 shrink-0 snap-start whitespace-nowrap rounded-full px-3.5 text-[13px] font-bold backdrop-blur-md ${on ? 'bg-gold text-on-gold' : 'bg-[rgb(255_255_255/0.16)] text-white'}`}>
                  {on && <Check size={13} strokeWidth={3} className="mr-1 inline" aria-hidden />}
                  {o === 'Other' && other && occasion === 'Other' ? other : o}
                </motion.button>
              )
            })}
            <button type="button" onClick={() => { session.setOccasion(null); toast('Occasion skipped. The Occasion score rates general suitability.', 'neutral') }} className="h-9 shrink-0 snap-start whitespace-nowrap rounded-full px-3.5 text-[13px] font-bold text-on-night-2">
              Skip
            </button>
          </div>

          <AnimatePresence mode="wait" initial={false}>
            {captured ? (
              <motion.div key="banner" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 24, transition: { duration: 0.15 } }} transition={spring.sheet} className="glass rounded-[var(--r-container)] p-3">
                <div className="flex items-center gap-3 px-1 pb-2">
                  <Sparkles size={18} className="text-gold-ink" aria-hidden />
                  <span className="min-w-0 flex-1">
                    <span className="block text-[16px] font-bold text-text">Analyse this outfit?</span>
                    <span className="meta block text-text-2">
                      {occasion ? (occasion === 'Other' ? other : occasion) : 'No occasion'} · {weatherOn ? `${WEATHER.tempF}°F ${WEATHER.summary.toLowerCase()}` : 'no weather'} · scan {used + 1} of {daily} today
                    </span>
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="lg" block onClick={() => { track('retake'); setCaptured(false) }}>
                    Retake
                  </Button>
                  <Button size="lg" block onClick={analyse} trailing={Sparkles}>
                    Analyse
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.div key="shutter" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.12 } }} className="flex items-center justify-between px-2 pb-1">
                <motion.button type="button" whileTap={tap} transition={spring.ui} onClick={() => capture('gallery')} aria-label="Upload from your gallery" className="flex h-12 items-center gap-2 rounded-full bg-[rgb(255_255_255/0.16)] pl-2 pr-4 text-[13px] font-bold text-white backdrop-blur-md">
                  <HeroImage src="fitPlaid" alt="" scrim="none" width={120} className="h-8 w-8 rounded-[8px]" position="top" />
                  <Images size={16} aria-hidden /> Gallery
                </motion.button>
                <motion.button type="button" whileTap={{ scale: 0.9 }} transition={spring.ui} onClick={() => { setFlash(true); capture('shutter') }} aria-label="Take the photo" className="grid h-[82px] w-[82px] place-items-center rounded-full border-[4px] border-white">
                  <span className="block h-[64px] w-[64px] rounded-full bg-gold shadow-[var(--glow-gold)]" />
                </motion.button>
                <span className="meta w-[104px] text-right text-on-night-2">Encrypted · deleted after 12 months unless kept</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </MobileScreen>
  )
}
