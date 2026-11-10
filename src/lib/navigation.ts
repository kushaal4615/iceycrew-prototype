import { createContext, useContext } from 'react'

/* ─────────────────────────────────────────────────────────────
   The typed screen graph. Every screen the prototype can show is
   listed here. navigate() accepts only these IDs, so a typo or an
   unregistered screen fails the TypeScript build.
   ───────────────────────────────────────────────────────────── */

export const APP_SCREENS = [
  'app.welcome',
  'app.verify',
  'app.signup',
  'app.onboarding',
  'app.swipe',
  'app.home',
  'app.article',
  'app.camera',
  'app.processing',
  'app.analysis',
  'app.history',
  'app.limit',
  'app.mystyle',
  'app.colourquiz',
  'app.colours',
  'app.account',
  'app.report',
  'app.locked',
] as const

export const ADMIN_SCREENS = [
  'admin.signin',
  'admin.overview',
  'admin.members',
  'admin.usage',
  'admin.content',
  'admin.ai',
  'admin.limits',
  'admin.reports',
  'admin.settings',
] as const

export type AppScreenId = (typeof APP_SCREENS)[number]
export type AdminScreenId = (typeof ADMIN_SCREENS)[number]
/** any screen that renders inside the iPhone frame */
export type MobileScreenId = AppScreenId
/** any screen that renders inside the browser frame */
export type ConsoleScreenId = AdminScreenId
export type ScreenId = AppScreenId | AdminScreenId

export type Platform = 'app' | 'admin'
export type View = Platform | 'features'

export const ALL_SCREENS: readonly ScreenId[] = [...APP_SCREENS, ...ADMIN_SCREENS]

export const PLATFORMS: { id: Platform; label: string; sub: string; entry: ScreenId; frame: 'phone' | 'browser'; domain: string }[] = [
  { id: 'app', label: 'Member App', sub: 'Maya: verify, onboard, scan an outfit, read the score, find her colours', entry: 'app.welcome', frame: 'phone', domain: 'app.iceycrew.com' },
  { id: 'admin', label: 'Admin Panel', sub: 'Hazel: members, usage, the deck and quizzes, prompts, limits, the bug inbox', entry: 'admin.signin', frame: 'browser', domain: 'admin.iceycrew.com' },
]

export function platformOf(id: ScreenId): Platform {
  return id.split('.')[0] as Platform
}

export const frameOf = (p: Platform) => PLATFORMS.find((x) => x.id === p)!.frame
export const domainOf = (p: Platform) => PLATFORMS.find((x) => x.id === p)!.domain

export function isScreenId(value: string): value is ScreenId {
  return (ALL_SCREENS as readonly string[]).includes(value)
}

/* Hash form: #/app/home · #/admin/members · #/features */
export function screenToHash(id: ScreenId): string {
  const [p, s] = id.split('.')
  return `#/${p}/${s}`
}

export function hashToRoute(hash: string): { view: View; screen?: ScreenId } | null {
  const clean = hash.replace(/^#\/?/, '')
  if (!clean) return null
  if (clean === 'features') return { view: 'features' }
  const [p, s] = clean.split('/')
  const candidate = `${p}.${s}`
  if (isScreenId(candidate)) return { view: platformOf(candidate), screen: candidate }
  if (import.meta.env.DEV) console.error(`[NAV] unknown hash route "${hash}"`)
  return null
}

/* ─── Runtime navigation API, provided by the viewer ─── */

export type ToastTone = 'neutral' | 'accent' | 'warn' | 'danger' | 'info'

export type NavApi = {
  current: ScreenId
  /** push a screen onto its platform's stack (switches platform if needed) */
  navigate: (id: ScreenId) => void
  /** pop the current platform's stack */
  back: () => void
  /** replace the whole stack of the screen's platform with [id] (tab bars, sign-out) */
  reset: (id: ScreenId) => void
  canGoBack: boolean
  toast: (message: string, tone?: ToastTone) => void
}

export const NavContext = createContext<NavApi | null>(null)

export function useNav(): NavApi {
  const ctx = useContext(NavContext)
  if (!ctx) throw new Error('useNav must be used inside the PrototypeViewer')
  return ctx
}

/* ─── Static link map: every navigate() target each screen exposes.
   Used by the reachability assertion (lib/reachability.ts) so the
   graph is proved connected without a browser. Keep in step with
   the screens' own onClick handlers. ─── */
export const APP_TABS: AppScreenId[] = ['app.home', 'app.camera', 'app.mystyle']
const AT: AppScreenId[] = [...APP_TABS, 'app.account']
const ADMIN_NAV: AdminScreenId[] = ['admin.overview', 'admin.members', 'admin.usage', 'admin.content', 'admin.ai', 'admin.limits', 'admin.reports', 'admin.settings', 'admin.signin']

export const LINKS: Record<ScreenId, ScreenId[]> = {
  'app.welcome': ['app.verify', 'app.home'],
  'app.verify': ['app.signup', 'app.home'],
  'app.signup': ['app.onboarding'],
  'app.onboarding': ['app.swipe'],
  'app.swipe': ['app.home', 'app.onboarding'],
  'app.home': ['app.article', 'app.analysis', 'app.history', 'app.colours', 'app.limit', 'app.colourquiz', ...AT],
  'app.article': ['app.home'],
  'app.camera': ['app.processing', 'app.home', 'app.limit', 'app.history'],
  'app.processing': ['app.analysis', 'app.camera'],
  'app.analysis': ['app.report', 'app.history', 'app.colours', 'app.mystyle', ...AT],
  'app.history': ['app.analysis', ...AT],
  'app.limit': ['app.home', 'app.history', 'app.account'],
  'app.mystyle': ['app.colourquiz', 'app.colours', 'app.onboarding', 'app.swipe', 'app.history', ...AT],
  'app.colourquiz': ['app.colours', 'app.mystyle'],
  'app.colours': ['app.colourquiz', 'app.mystyle', 'app.camera'],
  'app.account': ['app.report', 'app.locked', 'app.history', 'app.welcome', 'app.mystyle', 'app.home'],
  'app.report': ['app.account', 'app.analysis'],
  'app.locked': ['app.history', 'app.welcome', 'app.home'],

  'admin.signin': ['admin.overview'],
  'admin.overview': [...ADMIN_NAV],
  'admin.members': [...ADMIN_NAV],
  'admin.usage': [...ADMIN_NAV],
  'admin.content': [...ADMIN_NAV],
  'admin.ai': [...ADMIN_NAV],
  'admin.limits': [...ADMIN_NAV],
  'admin.reports': [...ADMIN_NAV],
  'admin.settings': [...ADMIN_NAV],
}
