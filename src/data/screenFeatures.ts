import type { ScreenId } from '../lib/navigation'
import { F, FEATURE_INDEX, MODULES, type FeatureKey } from './featureIndex'

/* What each screen demonstrates, shown in the viewer's FEATURE PANEL.
   Features are keys into the requirements index, so every statement is
   the brief's or the call's own wording. Exhaustive by type: a screen
   without an entry fails the build. */

export type Persona = 'Member App' | 'Admin Panel'
export type ScreenFeatures = { persona: Persona; title: string; module: string; features: FeatureKey[] }

const app = (title: string, module: string, features: FeatureKey[]): ScreenFeatures => ({ persona: 'Member App', title, module, features })
const admin = (title: string, module: string, features: FeatureKey[]): ScreenFeatures => ({ persona: 'Admin Panel', title, module, features })

const M = MODULES

export const SCREEN_FEATURES: Record<ScreenId, ScreenFeatures> = {
  'app.welcome': app('Welcome', M.access, ['welcomeTwo', 'platforms', 'nameTbd', 'palette', 'painPoint', 'demoPromised', 'phonesOnly']),
  'app.verify': app('Verify your VIP order', M.access, ['verifyInputs', 'verifyChecks', 'shopifyVip', 'errorStates', 'verifyRateLimit']),
  'app.signup': app('Create your account', M.access, ['verifyLink', 'signinOptions', 'dob', 'age16', 'socialLinked']),
  'app.onboarding': app('Style questions', M.onboarding, ['greeting', 'mcq', 'resumable', 'questionsEditable', 'resultsStored']),
  'app.swipe': app('Swipe deck', M.onboarding, ['swipeDeck', 'deckTags', 'deckSize', 'analysisBlocked', 'animations', 'landsHome']),
  'app.home': app('Home', M.home, ['hero', 'bottomNav', 'homeDefault', 'feed', 'cards', 'newestFirst', 'tryAgainCard']),
  'app.article': app('In-app browser', M.home, ['inAppBrowser', 'brokenLinks', 'paywalled', 'feedAuto']),
  'app.camera': app('Camera', M.assistant, ['cameraGuide', 'analyseBanner', 'occasionChips', 'weatherLocation', 'weatherCity', 'navHidden', 'photoConsent']),
  'app.processing': app('Processing', M.assistant, ['processingAnim', 'autoRedirect', 'under10s', 'navHidden']),
  'app.analysis': app('Analysis', M.assistant, ['analysisPhoto', 'scores', 'occasionScore', 'working', 'better', 'levelUp', 'helpful']),
  'app.history': app('History', M.assistant, ['history', 'retention', 'moderation', 'worksWithout', 'analysisStored']),
  'app.limit': app('Daily limit reached', M.ai, ['limitMessage', 'dailyLimit', 'analysisErrors', 'threeTiersLater', 'noInAppPayments']),
  'app.mystyle': app('My Style', M.mystyle, ['styleSummary', 'prefsEditable', 'recalibrate', 'myColoursCard', 'findColours', 'resultsStored']),
  'app.colourquiz': app('Find my colours', M.mystyle, ['colourQuiz', 'findColours', 'colourNeutral', 'colourDeterministic']),
  'app.colours': app('My Colours', M.mystyle, ['colourOutput', 'colourSaved', 'colourDeterministic', 'myColoursCard']),
  'app.account': app('Account & Settings', M.account, ['avatarNav', 'profile', 'vipStatus', 'keepPhotos', 'privacyDelete', 'downloadData', 'helpLinks']),
  'app.report': app('Report a problem', M.account, ['reportEntry', 'reportForm', 'reportAuto', 'reportConfirm', 'reportDelivery']),
  'app.locked': app('Membership lapsed', M.access, ['lockedScreen', 'failedPayment', 'cancellation', 'refund', 'noInAppPayments']),

  'admin.signin': admin('Admin sign in', M.admin, ['adminUsers', 'appsBackend', 'ipLimits']),
  'admin.overview': admin('Overview', M.privacy, ['analyticsEvents', 'dashboardExport', 'markets', 'northAmerica', 'adminUsage', 'appsBackend']),
  'admin.members': admin('Members', M.provider, ['adminUsers', 'ownRecord', 'statusSync', 'neutralEvents', 'migration', 'cancellation', 'refund']),
  'admin.usage': admin('Usage & helpfulness', M.ai, ['adminUsage', 'analysisStored', 'limitLogs', 'helpful']),
  'admin.content': admin('Questions, quiz & deck', M.onboarding, ['adminContent', 'questionsEditable', 'deckSize', 'deckLicensing', 'colourQuiz']),
  'admin.ai': admin('AI prompts & criteria', M.ai, ['adminPrompts', 'promptsEditable', 'visionModel', 'requestIncludes', 'structuredOutput', 'retryOnce', 'spelling']),
  'admin.limits': admin('Limits & spend', M.ai, ['dailyLimit', 'ipLimits', 'spendCap', 'verifyRateLimit', 'retentionConfig']),
  'admin.reports': admin('Bug reports inbox', M.account, ['adminInbox', 'reportDelivery', 'reportAuto', 'crash']),
  'admin.settings': admin('Membership provider & settings', M.provider, ['oneLayer', 'adapters', 'providerConfig', 'moveToCrm', 'subsAppTbc', 'oneTierNow', 'englishSchema']),
}

export const featureText = (k: FeatureKey) => F[k]

/* Dev-time drift check: every module used on a screen exists in the index,
   and every feature a screen claims is in the index. */
if (import.meta.env.DEV) {
  const keys = new Set(FEATURE_INDEX.flatMap((m) => m.features.map((x) => x.key)))
  const modules = new Set(FEATURE_INDEX.map((m) => m.module))
  for (const [id, s] of Object.entries(SCREEN_FEATURES)) {
    if (!modules.has(s.module)) console.error(`[FEATURES] ${id} uses unknown module "${s.module}"`)
    for (const k of s.features) if (!keys.has(k)) console.error(`[FEATURES] ${id} claims "${k}", which is not in FEATURE_INDEX`)
    if (s.features.length < 3 || s.features.length > 7) console.error(`[FEATURES] ${id} has ${s.features.length} features (3–7 required)`)
  }
}
