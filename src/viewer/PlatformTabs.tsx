import { motion } from 'framer-motion'
import { ListChecks, Moon, Smartphone, PanelsTopLeft, Sun, type LucideIcon } from 'lucide-react'
import { PLATFORMS, type Platform, type View } from '../lib/navigation'
import { spring } from '../motion/springs'
import { session, useSession } from '../lib/store'
import { track } from '../lib/tracker'

/* The platform pill: one entry per platform, then the Full Feature List, then the
   light / dark switch for the product (brief §6: light and dark mode). */
const ICON: Record<Platform, LucideIcon> = { app: Smartphone, admin: PanelsTopLeft }
export function PlatformTabs({ view, onChange }: { view: View; onChange: (v: View) => void }) {
  const theme = useSession((s) => s.theme)
  const items: { id: View; label: string; icon: typeof ListChecks }[] = [
    ...PLATFORMS.map((p) => ({ id: p.id as View, label: p.label, icon: ICON[p.id] })),
  ]
  return (
    <nav aria-label="Prototype platforms" className="glass flex items-center gap-1 rounded-full p-1.5">
      {items.map((it) => {
        const on = view === it.id
        const Icon = it.icon
        return (
          <button
            key={it.id}
            type="button"
            onClick={() => onChange(it.id)}
            aria-current={on ? 'page' : undefined}
            className="relative flex h-10 items-center gap-2 whitespace-nowrap rounded-full px-4 text-[14px] font-bold"
          >
            {on && <motion.span layoutId="pill-active" className="absolute inset-0 -z-10 rounded-full bg-accent" transition={spring.frame} />}
            <Icon size={16} strokeWidth={2.2} className={`relative z-10 ${on ? 'text-on-accent' : 'text-text-2'}`} aria-hidden />
            <span className={`relative z-10 ${on ? 'text-on-accent' : 'text-text'}`}>{it.label}</span>
          </button>
        )
      })}
      <span aria-hidden className="mx-1.5 h-6 w-px bg-[var(--rule-strong)]" />
      <button
        type="button"
        onClick={() => onChange('features')}
        aria-current={view === 'features' ? 'page' : undefined}
        className={`relative flex h-10 items-center gap-2 whitespace-nowrap rounded-full px-4 text-[13px] font-semibold ${view === 'features' ? '' : 'ring-1 ring-inset ring-[var(--accent-text)]'}`}
      >
        {view === 'features' && <motion.span layoutId="pill-active" className="absolute inset-0 -z-10 rounded-full bg-accent" transition={spring.frame} />}
        <ListChecks size={16} strokeWidth={2.2} className={`relative z-10 ${view === 'features' ? 'text-on-accent' : 'text-text'}`} aria-hidden />
        <span className={`meta relative z-10 text-[12.5px] ${view === 'features' ? 'text-on-accent' : 'text-text'}`}>Full Feature List</span>
      </button>
      <span aria-hidden className="mx-1.5 h-6 w-px bg-[var(--rule-strong)]" />
      <button
        type="button"
        role="switch"
        aria-checked={theme === 'dark'}
        aria-label={theme === 'dark' ? 'Dark mode on. Switch the product to light mode' : 'Light mode on. Switch the product to dark mode'}
        onClick={() => {
          track('toggle_theme', theme === 'dark' ? 'light' : 'dark')
          session.toggleTheme()
        }}
        className="relative grid h-10 w-10 place-items-center rounded-full text-text hover:bg-[var(--surface-high)]"
      >
        <motion.span key={theme} initial={{ rotate: -40, opacity: 0, scale: 0.8 }} animate={{ rotate: 0, opacity: 1, scale: 1 }} transition={spring.ui} className="grid place-items-center">
          {theme === 'dark' ? <Sun size={17} strokeWidth={2.2} aria-hidden /> : <Moon size={17} strokeWidth={2.2} aria-hidden />}
        </motion.span>
      </button>
    </nav>
  )
}
