import { useSyncExternalStore } from 'react'
import { MAYA_ANSWERS, MAYA_COLOUR_ANSWERS, MAYA_LIKES, type Occasion } from '../data/content'
import { ALLOWANCE } from '../data/analyses'
import { LIMITS, REPORTS, type ReportStatus } from '../data/admin'

/* Session state shared by every screen. In the real build all of this
   lives on the server; the prototype keeps it in memory so the demo behaves
   consistently across the two platforms: the scan Maya makes appears in
   her history and in the admin's usage, a report she sends lands in the
   admin inbox, a limit Hazel edits shows on Maya's allowance ring. */

export type Membership = 'active' | 'lapsed'

export type SessionState = {
  /* Member App */
  verified: boolean
  onboardingStep: number
  onboardingAnswers: Record<string, string[]>
  swipeIndex: number
  likes: string[]
  dislikes: string[]
  onboardingDone: boolean
  colourDone: boolean
  colourAnswers: Record<string, string[]>
  viewingArticle: string
  viewingAnalysis: string
  occasion: Occasion | null
  otherOccasion: string
  weatherOn: boolean
  scansToday: number
  scannedToday: boolean
  helpfulness: Record<string, number>
  comments: Record<string, string>
  reportsSent: string[]
  keepPhotos: boolean
  membership: Membership
  deletedPhotos: boolean
  readArticles: string[]
  /* Admin */
  viewingMember: string
  viewingReport: string
  reportStatus: Record<string, ReportStatus>
  replied: string[]
  limits: typeof LIMITS
  provider: 'shopify' | 'crm'
  crmStaged: boolean
  promptSaved: boolean
  questionEdits: Record<string, string>
  deckRemoved: string[]
  exports: number
  memberNotes: Record<string, string>
}

const initial: SessionState = {
  verified: false,
  onboardingStep: 0,
  onboardingAnswers: MAYA_ANSWERS,
  swipeIndex: 14,
  likes: MAYA_LIKES.slice(0, 8),
  dislikes: ['d03', 'd04', 'd05', 'd07', 'd08', 'd11'],
  onboardingDone: true,
  colourDone: true,
  colourAnswers: MAYA_COLOUR_ANSWERS,
  viewingArticle: 'ar1',
  viewingAnalysis: 'a-today',
  occasion: 'Work',
  otherOccasion: '',
  weatherOn: true,
  scansToday: ALLOWANCE.usedBefore,
  scannedToday: false,
  helpfulness: {},
  comments: {},
  reportsSent: [],
  keepPhotos: false,
  membership: 'active',
  deletedPhotos: false,
  readArticles: [],
  viewingMember: 'm1',
  viewingReport: 'r1',
  reportStatus: {},
  replied: [],
  limits: LIMITS,
  provider: 'shopify',
  crmStaged: false,
  promptSaved: false,
  questionEdits: {},
  deckRemoved: [],
  exports: 0,
  memberNotes: {},
}

let state: SessionState = initial
const listeners = new Set<() => void>()

function set(patch: Partial<SessionState> | ((s: SessionState) => Partial<SessionState>)) {
  const next = typeof patch === 'function' ? patch(state) : patch
  state = { ...state, ...next }
  listeners.forEach((l) => l())
}

export function useSession<T>(select: (s: SessionState) => T): T {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb)
      return () => listeners.delete(cb)
    },
    () => select(state),
    () => select(state),
  )
}

export const getSession = () => state

const add = (list: string[], id: string) => (list.includes(id) ? list : [...list, id])
const remove = (list: string[], id: string) => list.filter((x) => x !== id)

export const session = {
  set,
  reset: () => set(initial),
  /* Member App */
  verify: () => set({ verified: true }),
  setOnboardingStep: (n: number) => set({ onboardingStep: n }),
  answer: (qid: string, ids: string[]) => set((s) => ({ onboardingAnswers: { ...s.onboardingAnswers, [qid]: ids } })),
  swipe: (cardId: string, like: boolean) =>
    set((s) => ({
      swipeIndex: s.swipeIndex + 1,
      likes: like ? add(remove(s.likes, cardId), cardId) : remove(s.likes, cardId),
      dislikes: like ? remove(s.dislikes, cardId) : add(remove(s.dislikes, cardId), cardId),
    })),
  undoSwipe: (cardId: string) => set((s) => ({ swipeIndex: Math.max(0, s.swipeIndex - 1), likes: remove(s.likes, cardId), dislikes: remove(s.dislikes, cardId) })),
  resetDeck: () => set({ swipeIndex: 0, likes: [], dislikes: [] }),
  finishOnboarding: () => set({ onboardingDone: true, onboardingStep: 0 }),
  startRecalibrate: () => set({ onboardingStep: 0 }),
  colourAnswer: (qid: string, ids: string[]) => set((s) => ({ colourAnswers: { ...s.colourAnswers, [qid]: ids } })),
  finishColour: () => set({ colourDone: true }),
  clearColour: () => set({ colourDone: false }),
  viewArticle: (id: string) => set((s) => ({ viewingArticle: id, readArticles: add(s.readArticles, id) })),
  viewAnalysis: (id: string) => set({ viewingAnalysis: id }),
  setOccasion: (o: Occasion | null) => set({ occasion: o }),
  setOtherOccasion: (t: string) => set({ otherOccasion: t }),
  setWeather: (on: boolean) => set({ weatherOn: on }),
  scan: () => set((s) => ({ scansToday: s.scannedToday ? s.scansToday : s.scansToday + 1, scannedToday: true, viewingAnalysis: 'a-today' })),
  rate: (id: string, n: number) => set((s) => ({ helpfulness: { ...s.helpfulness, [id]: n } })),
  comment: (id: string, t: string) => set((s) => ({ comments: { ...s.comments, [id]: t } })),
  sendReport: (id: string) => set((s) => ({ reportsSent: add(s.reportsSent, id) })),
  setKeepPhotos: (on: boolean) => set({ keepPhotos: on }),
  setMembership: (m: Membership) => set({ membership: m }),
  deletePhotos: () => set({ deletedPhotos: true }),
  /* Admin */
  viewMember: (id: string) => set({ viewingMember: id }),
  viewReport: (id: string) => set({ viewingReport: id }),
  setReportStatus: (id: string, st: ReportStatus) => set((s) => ({ reportStatus: { ...s.reportStatus, [id]: st } })),
  reply: (id: string) => set((s) => ({ replied: add(s.replied, id) })),
  setLimits: (patch: Partial<typeof LIMITS>) => set((s) => ({ limits: { ...s.limits, ...patch } })),
  setProvider: (p: 'shopify' | 'crm') => set({ provider: p }),
  stageCrm: () => set({ crmStaged: true }),
  savePrompt: () => set({ promptSaved: true }),
  editQuestion: (id: string, prompt: string) => set((s) => ({ questionEdits: { ...s.questionEdits, [id]: prompt } })),
  removeCard: (id: string) => set((s) => ({ deckRemoved: add(s.deckRemoved, id) })),
  restoreCard: (id: string) => set((s) => ({ deckRemoved: remove(s.deckRemoved, id) })),
  exportData: () => set((s) => ({ exports: s.exports + 1 })),
  noteMember: (id: string, t: string) => set((s) => ({ memberNotes: { ...s.memberNotes, [id]: t } })),
}

/** The effective status of a bug report after this session's decisions. */
export const reportStatusOf = (id: string, s: SessionState = state): ReportStatus => s.reportStatus[id] ?? REPORTS.find((r) => r.id === id)?.status ?? 'new'
/** Reports still new (badge) */
export const newReports = (s: SessionState = state) => REPORTS.filter((r) => reportStatusOf(r.id, s) === 'new').length + s.reportsSent.length
/** Scans used today, including the one made in this session */
export const scansUsed = (s: SessionState = state) => s.scansToday
