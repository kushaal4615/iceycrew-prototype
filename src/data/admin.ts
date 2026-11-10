import type { MediaKey } from './media'

/* The admin's world: members and their provider-neutral membership
   records, usage and analytics, limits and spend, the bug inbox, the AI
   configuration and the content editors. Every number is a demo value. */

export type MemberStatus = 'active' | 'cancelled' | 'lapsed' | 'refunded'
export type Country = 'US' | 'CA' | 'UK' | 'AU'
export type Member = {
  id: string
  name: string
  email: string
  photo: MediaKey
  country: Country
  city: string
  status: MemberStatus
  level: 'VIP'
  paidUntil: string
  joined: string
  provider: 'shopify'
  providerIds: { customer: string; subscription: string; order: string; crm?: string }
  scans30d: number
  scansToday: number
  avgScore: number
  helpfulness: number
  onboarding: 'complete' | `dropped at step ${number}`
  colourSeason?: string
  lastEvent: { type: 'renewed' | 'cancelled' | 'payment_failed' | 'refunded' | 'verified'; iso: string }
  limitHits30d: number
}

export const MEMBERS: Member[] = [
  { id: 'm1', name: 'Maya Delgado', email: 'maya.delgado@demo-iceycrew.app', photo: 'maya', country: 'US', city: 'Chicago, IL', status: 'active', level: 'VIP', paidUntil: '2026-12-03', joined: '2026-03-03', provider: 'shopify', providerIds: { customer: 'gid://shopify/Customer/7731420', subscription: 'sub_A91K2Q', order: '#IC-48213' }, scans30d: 9, scansToday: 3, avgScore: 80, helpfulness: 4.3, onboarding: 'complete', colourSeason: 'Deep Autumn', lastEvent: { type: 'renewed', iso: '2026-11-03' }, limitHits30d: 0 },
  { id: 'm2', name: 'Jordan Reyes', email: 'jordan.reyes@demo-iceycrew.app', photo: 'jordan', country: 'US', city: 'Atlanta, GA', status: 'active', level: 'VIP', paidUntil: '2026-11-28', joined: '2026-02-12', provider: 'shopify', providerIds: { customer: 'gid://shopify/Customer/7702118', subscription: 'sub_B22M7T', order: '#IC-47910' }, scans30d: 22, scansToday: 6, avgScore: 76, helpfulness: 4.6, onboarding: 'complete', colourSeason: 'Deep Winter', lastEvent: { type: 'renewed', iso: '2026-10-28' }, limitHits30d: 2 },
  { id: 'm3', name: 'Priya Natarajan', email: 'priya.n@demo-iceycrew.app', photo: 'priya', country: 'CA', city: 'Toronto, ON', status: 'active', level: 'VIP', paidUntil: '2026-11-19', joined: '2026-04-19', provider: 'shopify', providerIds: { customer: 'gid://shopify/Customer/7811003', subscription: 'sub_C31P9A', order: '#IC-48902' }, scans30d: 14, scansToday: 1, avgScore: 82, helpfulness: 4.8, onboarding: 'complete', colourSeason: 'Warm Autumn', lastEvent: { type: 'renewed', iso: '2026-10-19' }, limitHits30d: 0 },
  { id: 'm4', name: 'Marcus Bell', email: 'marcus.bell@demo-iceycrew.app', photo: 'marcus', country: 'US', city: 'Houston, TX', status: 'lapsed', level: 'VIP', paidUntil: '2026-11-04', joined: '2026-05-04', provider: 'shopify', providerIds: { customer: 'gid://shopify/Customer/7842771', subscription: 'sub_D40Q1Z', order: '#IC-49311' }, scans30d: 3, scansToday: 0, avgScore: 79, helpfulness: 4.0, onboarding: 'complete', colourSeason: 'Cool Winter', lastEvent: { type: 'payment_failed', iso: '2026-11-04' }, limitHits30d: 0 },
  { id: 'm5', name: 'Theo Lindqvist', email: 'theo.l@demo-iceycrew.app', photo: 'theo', country: 'UK', city: 'Manchester', status: 'active', level: 'VIP', paidUntil: '2026-12-01', joined: '2026-06-01', provider: 'shopify', providerIds: { customer: 'gid://shopify/Customer/7900412', subscription: 'sub_E58R3V', order: '#IC-50120' }, scans30d: 11, scansToday: 2, avgScore: 74, helpfulness: 4.1, onboarding: 'complete', lastEvent: { type: 'renewed', iso: '2026-11-01' }, limitHits30d: 1 },
  { id: 'm6', name: 'Chloe Martin', email: 'chloe.martin@demo-iceycrew.app', photo: 'chloe', country: 'US', city: 'Los Angeles, CA', status: 'active', level: 'VIP', paidUntil: '2026-11-22', joined: '2026-07-22', provider: 'shopify', providerIds: { customer: 'gid://shopify/Customer/7955208', subscription: 'sub_F61S8B', order: '#IC-50877' }, scans30d: 31, scansToday: 10, avgScore: 83, helpfulness: 4.9, onboarding: 'complete', colourSeason: 'Light Spring', lastEvent: { type: 'renewed', iso: '2026-10-22' }, limitHits30d: 4 },
  { id: 'm7', name: 'Luca Moretti', email: 'luca.m@demo-iceycrew.app', photo: 'luca', country: 'AU', city: 'Melbourne', status: 'active', level: 'VIP', paidUntil: '2026-11-26', joined: '2026-08-26', provider: 'shopify', providerIds: { customer: 'gid://shopify/Customer/8010551', subscription: 'sub_G73T2C', order: '#IC-51540' }, scans30d: 7, scansToday: 0, avgScore: 71, helpfulness: 3.9, onboarding: 'complete', lastEvent: { type: 'renewed', iso: '2026-10-26' }, limitHits30d: 0 },
  { id: 'm8', name: 'Nina Okafor', email: 'nina.okafor@demo-iceycrew.app', photo: 'nina', country: 'UK', city: 'London', status: 'cancelled', level: 'VIP', paidUntil: '2026-11-30', joined: '2026-03-30', provider: 'shopify', providerIds: { customer: 'gid://shopify/Customer/7760930', subscription: 'sub_H85U6D', order: '#IC-48450' }, scans30d: 5, scansToday: 0, avgScore: 77, helpfulness: 4.2, onboarding: 'complete', colourSeason: 'Soft Summer', lastEvent: { type: 'cancelled', iso: '2026-11-06' }, limitHits30d: 0 },
  { id: 'm9', name: 'Dev Patel', email: 'dev.patel@demo-iceycrew.app', photo: 'dev', country: 'CA', city: 'Vancouver, BC', status: 'active', level: 'VIP', paidUntil: '2026-11-15', joined: '2026-09-15', provider: 'shopify', providerIds: { customer: 'gid://shopify/Customer/8066120', subscription: 'sub_I97V1E', order: '#IC-52233' }, scans30d: 18, scansToday: 4, avgScore: 78, helpfulness: 4.4, onboarding: 'complete', colourSeason: 'Deep Autumn', lastEvent: { type: 'renewed', iso: '2026-10-15' }, limitHits30d: 1 },
  { id: 'm10', name: 'Amara Diallo', email: 'amara.d@demo-iceycrew.app', photo: 'amara', country: 'US', city: 'Brooklyn, NY', status: 'active', level: 'VIP', paidUntil: '2026-12-05', joined: '2026-10-05', provider: 'shopify', providerIds: { customer: 'gid://shopify/Customer/8120874', subscription: 'sub_J02W4F', order: '#IC-52911' }, scans30d: 12, scansToday: 2, avgScore: 85, helpfulness: 4.7, onboarding: 'complete', colourSeason: 'Bright Spring', lastEvent: { type: 'renewed', iso: '2026-11-05' }, limitHits30d: 0 },
  { id: 'm11', name: 'Elena Russo', email: 'elena.russo@demo-iceycrew.app', photo: 'elena', country: 'US', city: 'Miami, FL', status: 'refunded', level: 'VIP', paidUntil: '2026-10-29', joined: '2026-10-01', provider: 'shopify', providerIds: { customer: 'gid://shopify/Customer/8118330', subscription: 'sub_K14X8G', order: '#IC-52860' }, scans30d: 2, scansToday: 0, avgScore: 69, helpfulness: 2.5, onboarding: 'complete', lastEvent: { type: 'refunded', iso: '2026-10-29' }, limitHits30d: 0 },
  { id: 'm12', name: 'Sam Whitfield', email: 'sam.w@demo-iceycrew.app', photo: 'sam', country: 'UK', city: 'Leeds', status: 'active', level: 'VIP', paidUntil: '2026-11-18', joined: '2026-06-18', provider: 'shopify', providerIds: { customer: 'gid://shopify/Customer/7921556', subscription: 'sub_L26Y3H', order: '#IC-50390' }, scans30d: 4, scansToday: 0, avgScore: 73, helpfulness: 4.0, onboarding: 'dropped at step 4', lastEvent: { type: 'renewed', iso: '2026-10-18' }, limitHits30d: 0 },
  { id: 'm13', name: 'Layla Haddad', email: 'layla.h@demo-iceycrew.app', photo: 'layla', country: 'CA', city: 'Montréal, QC', status: 'active', level: 'VIP', paidUntil: '2026-11-24', joined: '2026-08-24', provider: 'shopify', providerIds: { customer: 'gid://shopify/Customer/8004981', subscription: 'sub_M38Z7I', order: '#IC-51477' }, scans30d: 16, scansToday: 3, avgScore: 81, helpfulness: 4.5, onboarding: 'complete', colourSeason: 'Cool Summer', lastEvent: { type: 'renewed', iso: '2026-10-24' }, limitHits30d: 0 },
  { id: 'm14', name: 'Noah Fischer', email: 'noah.f@demo-iceycrew.app', photo: 'noah', country: 'US', city: 'Denver, CO', status: 'active', level: 'VIP', paidUntil: '2026-12-02', joined: '2026-04-02', provider: 'shopify', providerIds: { customer: 'gid://shopify/Customer/7790214', subscription: 'sub_N40A2J', order: '#IC-48700' }, scans30d: 8, scansToday: 1, avgScore: 75, helpfulness: 4.1, onboarding: 'complete', lastEvent: { type: 'renewed', iso: '2026-11-02' }, limitHits30d: 0 },
  { id: 'm15', name: 'Kai Tanaka', email: 'kai.tanaka@demo-iceycrew.app', photo: 'kai', country: 'US', city: 'Seattle, WA', status: 'active', level: 'VIP', paidUntil: '2026-11-12', joined: '2026-09-12', provider: 'shopify', providerIds: { customer: 'gid://shopify/Customer/8060007', subscription: 'sub_O52B5K', order: '#IC-52150' }, scans30d: 25, scansToday: 7, avgScore: 79, helpfulness: 4.3, onboarding: 'complete', colourSeason: 'Deep Winter', lastEvent: { type: 'renewed', iso: '2026-10-12' }, limitHits30d: 3 },
  { id: 'm16', name: 'Grace Whitlock', email: 'grace.w@demo-iceycrew.app', photo: 'grace', country: 'AU', city: 'Sydney', status: 'active', level: 'VIP', paidUntil: '2026-11-21', joined: '2026-07-21', provider: 'shopify', providerIds: { customer: 'gid://shopify/Customer/7950002', subscription: 'sub_P64C9L', order: '#IC-50811' }, scans30d: 6, scansToday: 0, avgScore: 80, helpfulness: 4.6, onboarding: 'complete', colourSeason: 'Light Summer', lastEvent: { type: 'renewed', iso: '2026-10-21' }, limitHits30d: 0 },
  { id: 'm17', name: 'Omar Haddad', email: 'omar.h@demo-iceycrew.app', photo: 'omar', country: 'US', city: 'Dearborn, MI', status: 'lapsed', level: 'VIP', paidUntil: '2026-10-31', joined: '2026-05-31', provider: 'shopify', providerIds: { customer: 'gid://shopify/Customer/7880413', subscription: 'sub_Q76D1M', order: '#IC-49800' }, scans30d: 1, scansToday: 0, avgScore: 72, helpfulness: 3.8, onboarding: 'complete', lastEvent: { type: 'payment_failed', iso: '2026-10-31' }, limitHits30d: 0 },
  { id: 'm18', name: 'Ava Lindgren', email: 'ava.l@demo-iceycrew.app', photo: 'ava', country: 'CA', city: 'Calgary, AB', status: 'active', level: 'VIP', paidUntil: '2026-11-27', joined: '2026-10-27', provider: 'shopify', providerIds: { customer: 'gid://shopify/Customer/8150220', subscription: 'sub_R88E4N', order: '#IC-53205' }, scans30d: 9, scansToday: 2, avgScore: 77, helpfulness: 4.2, onboarding: 'complete', lastEvent: { type: 'verified', iso: '2026-10-27' }, limitHits30d: 0 },
  { id: 'm19', name: 'Zoe Adeyemi', email: 'zoe.a@demo-iceycrew.app', photo: 'zoe', country: 'UK', city: 'Birmingham', status: 'active', level: 'VIP', paidUntil: '2026-11-14', joined: '2026-04-14', provider: 'shopify', providerIds: { customer: 'gid://shopify/Customer/7800670', subscription: 'sub_S90F7O', order: '#IC-48810' }, scans30d: 13, scansToday: 1, avgScore: 84, helpfulness: 4.8, onboarding: 'complete', colourSeason: 'Deep Autumn', lastEvent: { type: 'renewed', iso: '2026-10-14' }, limitHits30d: 0 },
  { id: 'm20', name: 'Ben Carter', email: 'ben.carter@demo-iceycrew.app', photo: 'ben', country: 'US', city: 'Austin, TX', status: 'active', level: 'VIP', paidUntil: '2026-11-29', joined: '2026-08-29', provider: 'shopify', providerIds: { customer: 'gid://shopify/Customer/8012290', subscription: 'sub_T02G3P', order: '#IC-51602' }, scans30d: 10, scansToday: 1, avgScore: 70, helpfulness: 3.7, onboarding: 'complete', lastEvent: { type: 'renewed', iso: '2026-10-29' }, limitHits30d: 0 },
  { id: 'm21', name: 'Ruth Mensah', email: 'ruth.m@demo-iceycrew.app', photo: 'ruth', country: 'UK', city: 'Bristol', status: 'active', level: 'VIP', paidUntil: '2026-11-23', joined: '2026-10-23', provider: 'shopify', providerIds: { customer: 'gid://shopify/Customer/8141009', subscription: 'sub_U14H6Q', order: '#IC-53140' }, scans30d: 3, scansToday: 0, avgScore: 78, helpfulness: 4.0, onboarding: 'dropped at step 6', lastEvent: { type: 'verified', iso: '2026-10-23' }, limitHits30d: 0 },
  { id: 'm22', name: 'Mila Jensen', email: 'mila.j@demo-iceycrew.app', photo: 'mila', country: 'US', city: 'Portland, OR', status: 'active', level: 'VIP', paidUntil: '2026-12-04', joined: '2026-06-04', provider: 'shopify', providerIds: { customer: 'gid://shopify/Customer/7905110', subscription: 'sub_V26I9R', order: '#IC-50200' }, scans30d: 15, scansToday: 2, avgScore: 82, helpfulness: 4.5, onboarding: 'complete', colourSeason: 'Warm Spring', lastEvent: { type: 'renewed', iso: '2026-11-04' }, limitHits30d: 1 },
  { id: 'm23', name: 'June Park', email: 'june.park@demo-iceycrew.app', photo: 'june', country: 'US', city: 'San Diego, CA', status: 'active', level: 'VIP', paidUntil: '2026-11-16', joined: '2026-09-16', provider: 'shopify', providerIds: { customer: 'gid://shopify/Customer/8071230', subscription: 'sub_W38J2S', order: '#IC-52300' }, scans30d: 20, scansToday: 5, avgScore: 80, helpfulness: 4.4, onboarding: 'complete', colourSeason: 'Deep Winter', lastEvent: { type: 'renewed', iso: '2026-10-16' }, limitHits30d: 2 },
  { id: 'm24', name: 'Harper Quinn', email: 'harper.q@demo-iceycrew.app', photo: 'harper', country: 'AU', city: 'Brisbane', status: 'active', level: 'VIP', paidUntil: '2026-11-20', joined: '2026-10-20', provider: 'shopify', providerIds: { customer: 'gid://shopify/Customer/8138821', subscription: 'sub_X40K5T', order: '#IC-53088' }, scans30d: 5, scansToday: 0, avgScore: 76, helpfulness: 4.1, onboarding: 'dropped at step 2', lastEvent: { type: 'verified', iso: '2026-10-20' }, limitHits30d: 0 },
]

export const memberById = (id: string) => MEMBERS.find((m) => m.id === id) ?? MEMBERS[0]

export const STATUS_LABEL: Record<MemberStatus, string> = { active: 'Active', cancelled: 'Cancelled · to month end', lapsed: 'Lapsed', refunded: 'Refunded' }
export const COUNTRY_LABEL: Record<Country, string> = { US: 'United States', CA: 'Canada', UK: 'United Kingdom', AU: 'Australia' }

/* ── Headline figures ───────────────────────────────────────── */
export const KPI = {
  members: 1284,
  active: 1163,
  cancelled: 48,
  lapsed: 61,
  refunded: 12,
  newThisMonth: 86,
  renewalsDue7d: 212,
  analysesToday: 318,
  analyses30d: 9412,
  analysesPerActive: 8.1,
  avgScore: 77,
  helpfulness: 4.4,
  helpfulnessN: 5120,
  medianLatency: 6.8,
  p95Latency: 9.4,
  refusals30d: 41,
  failures30d: 212,
  limitHits30d: 97,
  onboardingCompletion: 86,
  colourQuizDone: 712,
  articleOpens30d: 4120,
  reportsNew: 7,
  spendMonth: 1046,
  spendCap: 1500,
  byCountry: { US: 742, CA: 214, UK: 231, AU: 97 },
}

/* 14 days of analyses: requested · completed · failed · refused */
export const DAILY = [
  { d: '28 Oct', requested: 286, completed: 272, failed: 11, refused: 3 },
  { d: '29 Oct', requested: 301, completed: 288, failed: 9, refused: 4 },
  { d: '30 Oct', requested: 322, completed: 309, failed: 10, refused: 3 },
  { d: '31 Oct', requested: 410, completed: 392, failed: 14, refused: 4 },
  { d: '1 Nov', requested: 388, completed: 371, failed: 12, refused: 5 },
  { d: '2 Nov', requested: 297, completed: 284, failed: 9, refused: 4 },
  { d: '3 Nov', requested: 311, completed: 299, failed: 8, refused: 4 },
  { d: '4 Nov', requested: 305, completed: 292, failed: 10, refused: 3 },
  { d: '5 Nov', requested: 334, completed: 320, failed: 11, refused: 3 },
  { d: '6 Nov', requested: 349, completed: 336, failed: 9, refused: 4 },
  { d: '7 Nov', requested: 372, completed: 358, failed: 10, refused: 4 },
  { d: '8 Nov', requested: 441, completed: 424, failed: 13, refused: 4 },
  { d: '9 Nov', requested: 356, completed: 342, failed: 11, refused: 3 },
  { d: '10 Nov', requested: 318, completed: 306, failed: 9, refused: 3 },
]

/* 12 months of members: joined · lapsed */
export const MONTHLY = [
  { m: 'Dec', joined: 38, lapsed: 4, active: 312 },
  { m: 'Jan', joined: 64, lapsed: 6, active: 370 },
  { m: 'Feb', joined: 81, lapsed: 9, active: 442 },
  { m: 'Mar', joined: 120, lapsed: 11, active: 551 },
  { m: 'Apr', joined: 97, lapsed: 14, active: 634 },
  { m: 'May', joined: 88, lapsed: 12, active: 710 },
  { m: 'Jun', joined: 102, lapsed: 15, active: 797 },
  { m: 'Jul', joined: 79, lapsed: 13, active: 863 },
  { m: 'Aug', joined: 94, lapsed: 10, active: 947 },
  { m: 'Sep', joined: 108, lapsed: 16, active: 1039 },
  { m: 'Oct', joined: 118, lapsed: 19, active: 1138 },
  { m: 'Nov', joined: 86, lapsed: 9, active: 1163 },
]

/* onboarding funnel, last 30 days */
export const FUNNEL = [
  { step: 'Verified', n: 142 },
  { step: 'Account created', n: 139 },
  { step: 'Q1 Sections', n: 137 },
  { step: 'Q2 Body type', n: 131 },
  { step: 'Q3 Height & fit', n: 129 },
  { step: 'Q4 Occasions', n: 127 },
  { step: 'Q5 Budget', n: 126 },
  { step: 'Q6 Colours', n: 124 },
  { step: 'Swipe deck', n: 122 },
  { step: 'Home', n: 122 },
]

export const HELPFULNESS = [
  { stars: 5, n: 2611 },
  { stars: 4, n: 1588 },
  { stars: 3, n: 614 },
  { stars: 2, n: 205 },
  { stars: 1, n: 102 },
]

export const OCCASION_MIX = [
  { name: 'Work', n: 2890 },
  { name: 'Casual', n: 2412 },
  { name: 'Night out', n: 1130 },
  { name: 'Date', n: 894 },
  { name: 'None', n: 1086 },
  { name: 'Wedding / event', n: 402 },
  { name: 'Travel', n: 361 },
  { name: 'Interview', n: 237 },
]

export type LimitEvent = { id: string; iso: string; time: string; member: string; kind: 'daily' | 'hourly' | 'verify' | 'login' | 'spend-alert'; detail: string }
export const LIMIT_EVENTS: LimitEvent[] = [
  { id: 'l1', iso: '2026-11-10', time: '07:58', member: 'm6', kind: 'daily', detail: '10 of 10 today · retry-after 16h 02m' },
  { id: 'l2', iso: '2026-11-10', time: '07:41', member: 'm15', kind: 'hourly', detail: '30 in 60 min · retry-after 19m' },
  { id: 'l3', iso: '2026-11-10', time: '06:12', member: '—', kind: 'verify', detail: '5 failed verifications / hour · device 9a1f… · IP 73.22.•.•' },
  { id: 'l4', iso: '2026-11-09', time: '22:30', member: 'm23', kind: 'daily', detail: '10 of 10 today · retry-after 1h 30m' },
  { id: 'l5', iso: '2026-11-09', time: '21:05', member: 'm2', kind: 'daily', detail: '10 of 10 today · retry-after 2h 55m' },
  { id: 'l6', iso: '2026-11-09', time: '14:20', member: '—', kind: 'login', detail: '12 failed logins / hour · IP 185.220.•.• · blocked 1h' },
  { id: 'l7', iso: '2026-11-08', time: '19:48', member: 'm6', kind: 'daily', detail: '10 of 10 today · retry-after 4h 12m' },
  { id: 'l8', iso: '2026-11-08', time: '11:00', member: '—', kind: 'spend-alert', detail: 'AI spend passed 80% of the $1,500 monthly cap · email sent to hazel@' },
  { id: 'l9', iso: '2026-11-07', time: '20:16', member: 'm9', kind: 'daily', detail: '10 of 10 today · retry-after 3h 44m' },
  { id: 'l10', iso: '2026-11-07', time: '09:33', member: 'm22', kind: 'hourly', detail: '30 in 60 min · retry-after 27m' },
  { id: 'l11', iso: '2026-11-06', time: '18:02', member: 'm5', kind: 'daily', detail: '10 of 10 today · retry-after 5h 58m' },
  { id: 'l12', iso: '2026-11-05', time: '08:50', member: '—', kind: 'verify', detail: '5 failed verifications / hour · device 44c0… · IP 99.105.•.•' },
]

/* ── Bug reports inbox ──────────────────────────────────────── */
export type ReportCategory = 'Bug' | 'Wrong/bad AI feedback' | 'Other'
export type ReportStatus = 'new' | 'in progress' | 'fixed'
export type Report = { id: string; member: string; category: ReportCategory; status: ReportStatus; iso: string; time: string; description: string; screenshot?: MediaKey; app: string; device: string; os: string; country: Country; screen: string; analysisId?: string; emailSent: boolean }
export const REPORTS: Report[] = [
  { id: 'r1', member: 'm2', category: 'Wrong/bad AI feedback', status: 'new', iso: '2026-11-10', time: '07:52', description: 'It told me my navy suit was "too casual for an interview". It is a suit. Occasion score 58 feels wrong.', screenshot: 'fitNavySuit', app: '1.0.4 (112)', device: 'iPhone 15', os: 'iOS 19.1', country: 'US', screen: 'Analysis', analysisId: 'an_8f21c', emailSent: true },
  { id: 'r2', member: 'm6', category: 'Bug', status: 'new', iso: '2026-11-10', time: '06:40', description: 'The processing animation ran for about 25 seconds and then went back to the camera with no message.', app: '1.0.4 (112)', device: 'Pixel 9', os: 'Android 16', country: 'US', screen: 'Processing', emailSent: true },
  { id: 'r3', member: 'm13', category: 'Other', status: 'new', iso: '2026-11-09', time: '21:14', description: 'Can the weather show °C? I am in Montréal and the app shows °F.', app: '1.0.4 (112)', device: 'iPhone 14', os: 'iOS 19.0', country: 'CA', screen: 'Camera', emailSent: true },
  { id: 'r4', member: 'm15', category: 'Bug', status: 'in progress', iso: '2026-11-09', time: '18:03', description: 'Swipe deck: card 17 would not swipe left, had to use the button.', screenshot: 'fitLeather', app: '1.0.4 (112)', device: 'Galaxy S25', os: 'Android 16', country: 'US', screen: 'Swipe deck', emailSent: true },
  { id: 'r5', member: 'm19', category: 'Wrong/bad AI feedback', status: 'new', iso: '2026-11-09', time: '12:31', description: 'My colour quiz said Deep Autumn but the analysis keeps suggesting silver. Shouldn’t it use my metals?', app: '1.0.4 (112)', device: 'iPhone 13', os: 'iOS 18.6', country: 'UK', screen: 'Analysis', analysisId: 'an_71bd0', emailSent: true },
  { id: 'r6', member: 'm9', category: 'Bug', status: 'in progress', iso: '2026-11-08', time: '09:17', description: 'Pull-to-refresh on Home spins forever when I am on the office wifi.', app: '1.0.3 (108)', device: 'iPhone 16 Pro', os: 'iOS 19.1', country: 'CA', screen: 'Home', emailSent: true },
  { id: 'r7', member: 'm23', category: 'Other', status: 'new', iso: '2026-11-08', time: '08:05', description: 'Would love a way to compare two scans side by side.', app: '1.0.4 (112)', device: 'iPhone 15 Pro', os: 'iOS 19.1', country: 'US', screen: 'History', emailSent: true },
  { id: 'r8', member: 'm3', category: 'Wrong/bad AI feedback', status: 'fixed', iso: '2026-11-06', time: '16:48', description: 'Feedback used "color" spelling; I am in Canada.', app: '1.0.3 (108)', device: 'iPhone 14', os: 'iOS 18.6', country: 'CA', screen: 'Analysis', analysisId: 'an_5c0aa', emailSent: true },
  { id: 'r9', member: 'm5', category: 'Bug', status: 'fixed', iso: '2026-11-05', time: '11:22', description: 'Article from GQ opened but the Done button was hidden behind the browser bar.', screenshot: 'fitGreyJacket', app: '1.0.3 (108)', device: 'Pixel 8a', os: 'Android 15', country: 'UK', screen: 'Article', emailSent: true },
  { id: 'r10', member: 'm22', category: 'Bug', status: 'new', iso: '2026-11-04', time: '19:59', description: 'The "Keep my photos" toggle flips back off after I restart the app.', app: '1.0.4 (112)', device: 'iPhone 15', os: 'iOS 19.0', country: 'US', screen: 'Account & Settings', emailSent: true },
  { id: 'r11', member: 'm16', category: 'Other', status: 'fixed', iso: '2026-11-02', time: '07:30', description: 'The date on history shows 11/02; in Australia it should be 02/11.', app: '1.0.3 (108)', device: 'iPhone 13', os: 'iOS 18.5', country: 'AU', screen: 'History', emailSent: true },
  { id: 'r12', member: 'm10', category: 'Wrong/bad AI feedback', status: 'fixed', iso: '2026-10-30', time: '13:12', description: 'It scored a blurry photo instead of asking me to retake.', app: '1.0.3 (108)', device: 'iPhone 16', os: 'iOS 19.1', country: 'US', screen: 'Analysis', analysisId: 'an_3e97b', emailSent: true },
]

/* ── AI configuration ───────────────────────────────────────── */
export const AI = {
  provider: 'OpenAI · GPT-5 Vision',
  alternatives: ['Anthropic · Claude Fable 5.1', 'Google · Gemini 3 Pro Vision'],
  model: 'gpt-5-vision',
  costPerAnalysis: 0.11,
  promptVersion: 'v14 · 6 Nov 2026',
  temperature: 0.3,
  maxTokens: 900,
  timeoutS: 9,
  retry: 1,
  systemPrompt: `You are a personal stylist for IceyCrew VIP members. Rate the outfit in the photo out of 100 overall and on four sub-scores (fit, colour, cohesion, occasion), each 0–100. Use the member's style profile and colour season when given. If an occasion or weather is given, the occasion score must reflect both; otherwise rate general suitability. Write positives first, then negatives phrased constructively, then 3–5 actionable tips. Each tip names an item type, suggested colour(s), material, fit and a priority. Use the member's regional spelling (country code supplied). Refuse nude or sexual images, unsuitable content, and photos that appear to show children; return refusal=true and no scores. Return JSON only, matching the schema.`,
  criteria: [
    { key: 'fit', label: 'Fit', weight: 30, note: 'Proportion, length, where seams sit, ease vs. the member’s stated fit preference' },
    { key: 'colour', label: 'Colour', weight: 25, note: 'Palette harmony; the member’s colour season when known; metals' },
    { key: 'cohesion', label: 'Cohesion', weight: 25, note: 'Do the pieces belong together: formality, era, texture, one statement' },
    { key: 'occasion', label: 'Occasion', weight: 20, note: 'Suitability for the occasion chip and the weather; general suitability when none' },
  ],
  schema: `{
  "refusal": boolean,
  "overall": 0–100,
  "sub": { "fit": 0–100, "colour": 0–100, "cohesion": 0–100, "occasion": 0–100 },
  "positives": string[],
  "negatives": string[],
  "tips": [{ "text", "item", "colours": string[], "material", "fit", "priority": "high|medium|low" }],
  "tags": string[]
}`,
  recentRuns: [
    { id: 'an_9c41d', member: 'm1', ms: 6420, valid: true, retried: false, overall: 84 },
    { id: 'an_9c3f0', member: 'm23', ms: 7110, valid: true, retried: false, overall: 79 },
    { id: 'an_9c3e2', member: 'm6', ms: 9380, valid: true, retried: true, overall: 88 },
    { id: 'an_9c3d7', member: 'm15', ms: 5940, valid: true, retried: false, overall: 73 },
    { id: 'an_9c3c1', member: 'm2', ms: 6870, valid: false, retried: true, overall: 0 },
    { id: 'an_9c3b9', member: 'm9', ms: 6210, valid: true, retried: false, overall: 81 },
  ],
}

export const LIMITS = { daily: 10, hourly: 30, verifyPerHour: 5, loginPerHour: 10, signupPerHourIp: 20, resetPerHour: 3, spendCap: 1500, alertPct: 80, retentionMonths: 12, deckSize: 20 }

/* AI spend by day this month (USD) */
export const SPEND = [
  { d: '1', usd: 42 }, { d: '2', usd: 33 }, { d: '3', usd: 34 }, { d: '4', usd: 34 }, { d: '5', usd: 37 },
  { d: '6', usd: 38 }, { d: '7', usd: 41 }, { d: '8', usd: 49 }, { d: '9', usd: 39 }, { d: '10', usd: 35 },
]

/* newsletter ingestion */
export const FEED = {
  source: 'https://iceycrew.com/pages/style-tips',
  jsonPath: '/feeds/style-tips/2026-W45.json',
  lastPull: '2026-11-10 06:00 CST',
  nextPull: '2026-11-10 12:00 CST',
  everyH: 6,
  articles: 12,
  broken: 1,
  editions: 46,
}

/* provider adapter + events */
export const PROVIDER_EVENTS = [
  { id: 'e1', iso: '2026-11-10', time: '07:31', member: 'm22', raw: 'subscription_contracts/update', event: 'renewed', paidUntil: '2026-12-04' },
  { id: 'e2', iso: '2026-11-10', time: '06:58', member: 'm18', raw: 'orders/paid', event: 'renewed', paidUntil: '2026-11-27' },
  { id: 'e3', iso: '2026-11-09', time: '23:12', member: 'm4', raw: 'subscription_billing_attempts/failure', event: 'payment failed', paidUntil: '2026-11-04' },
  { id: 'e4', iso: '2026-11-09', time: '14:05', member: 'm8', raw: 'subscription_contracts/update', event: 'cancelled', paidUntil: '2026-11-30' },
  { id: 'e5', iso: '2026-11-08', time: '10:44', member: 'm11', raw: 'refunds/create', event: 'refunded', paidUntil: '2026-10-29' },
  { id: 'e6', iso: '2026-11-08', time: '09:02', member: 'm21', raw: 'orders/paid', event: 'verified', paidUntil: '2026-11-23' },
]
