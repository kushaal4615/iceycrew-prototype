/* ZERO-TYPING DEMO DATA (v4). Every input in the prototype mounts with one
   of these values already in it, so a visitor can walk every flow with taps
   alone. All credentials are dummies; the phone uses a fictional range.
   One consistent cast: Maya on the app, Hazel on the admin. */

/* ── Member App: Maya ── */
export const DEMO_VERIFY = { email: 'maya.delgado@demo-iceycrew.app', order: '#IC-48213' }
export const DEMO_SIGNUP = { email: 'maya.delgado@demo-iceycrew.app', password: 'Demo@2026', dob: '1998-06-14', over16: true, firstName: 'Maya', lastName: 'Delgado' }
export const DEMO_OTHER_OCCASION = 'Gallery opening'
export const DEMO_CITY = 'Chicago, IL'
export const DEMO_HELPFUL_COMMENT = 'Spot on about the boots. The gold tip is my favourite part.'
export const DEMO_REPORT = { category: 'Wrong/bad AI feedback' as const, description: 'The Occasion score says the tote reads casual, but this is the bag everyone at my office carries. 74 feels low for a work fit.', attachScreenshot: true }
export const DEMO_PROFILE = { name: 'Maya Delgado', email: 'maya.delgado@demo-iceycrew.app', country: 'United States' }
export const DEMO_SEARCH_HISTORY = 'Work'

/* ── Admin Panel: Hazel ── */
export const DEMO_ADMIN_LOGIN = { email: 'hazel@demo-iceycrew.app', password: 'Demo@2026', role: 'Owner' }
export const DEMO_ADMIN_SEARCH = 'Delgado'
export const DEMO_REPORT_REPLY = 'Thanks Jordan. We have raised the interview baseline for tailored suits in prompt v15; your analysis will re-score tonight.'
export const DEMO_QUESTION_EDIT = { prompt: 'When you buy a new piece, what do you usually spend?', option: '$150–400' }
export const DEMO_QUIZ_EDIT = 'In daylight, the veins on your inner wrist look…'
export const DEMO_PROMPT_NOTE = 'v15: raise the interview baseline for tailored suits; weight gold/silver by the colour profile.'
export const DEMO_LIMITS = { daily: '10', hourly: '30', verify: '5', spendCap: '1500', alertPct: '80', retention: '12', deckSize: '20' }
export const DEMO_LINKS = { becomeVip: 'https://iceycrew.com/products/vip-membership', manage: 'https://iceycrew.com/account/subscriptions', feed: 'https://iceycrew.com/pages/style-tips' }
export const DEMO_CRM = { name: 'HubSpot', apiBase: 'https://api.hubapi.com/crm/v3', matchBy: 'email' }
export const DEMO_EXPORT_RANGE = 'Last 30 days'

/* ── Shared ── */
export const DEMO_PHONE_US = '+1 (312) 555-0142'
