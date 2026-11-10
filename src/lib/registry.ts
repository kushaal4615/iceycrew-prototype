import type { ComponentType } from 'react'
import type { ScreenId } from './navigation'

import AppWelcome from '../platforms/app/Welcome'
import AppVerify from '../platforms/app/Verify'
import AppSignup from '../platforms/app/Signup'
import AppOnboarding from '../platforms/app/Onboarding'
import AppSwipe from '../platforms/app/Swipe'
import AppHome from '../platforms/app/Home'
import AppArticle from '../platforms/app/Article'
import AppCamera from '../platforms/app/Camera'
import AppProcessing from '../platforms/app/Processing'
import AppAnalysis from '../platforms/app/Analysis'
import AppHistory from '../platforms/app/History'
import AppLimit from '../platforms/app/Limit'
import AppMyStyle from '../platforms/app/MyStyle'
import AppColourQuiz from '../platforms/app/ColourQuiz'
import AppColours from '../platforms/app/Colours'
import AppAccount from '../platforms/app/Account'
import AppReport from '../platforms/app/Report'
import AppLocked from '../platforms/app/Locked'
import AdminSignin from '../platforms/admin/Signin'
import AdminOverview from '../platforms/admin/Overview'
import AdminMembers from '../platforms/admin/Members'
import AdminUsage from '../platforms/admin/Usage'
import AdminContent from '../platforms/admin/Content'
import AdminAi from '../platforms/admin/Ai'
import AdminLimits from '../platforms/admin/Limits'
import AdminReports from '../platforms/admin/Reports'
import AdminSettings from '../platforms/admin/Settings'

export type ScreenDef = {
  component: ComponentType
  /** status-bar glyph colour over the top of this screen */
  statusTone?: 'dark' | 'light'
  /** URL path shown in the browser frame */
  path?: string
}

/* Exhaustive by type: an unregistered ScreenId fails the build. */
export const SCREENS: Record<ScreenId, ScreenDef> = {
  'app.welcome': { component: AppWelcome, statusTone: 'light' },
  'app.verify': { component: AppVerify, statusTone: 'dark' },
  'app.signup': { component: AppSignup, statusTone: 'dark' },
  'app.onboarding': { component: AppOnboarding, statusTone: 'dark' },
  'app.swipe': { component: AppSwipe, statusTone: 'dark' },
  'app.home': { component: AppHome, statusTone: 'dark' },
  'app.article': { component: AppArticle, statusTone: 'dark' },
  'app.camera': { component: AppCamera, statusTone: 'light' },
  'app.processing': { component: AppProcessing, statusTone: 'light' },
  'app.analysis': { component: AppAnalysis, statusTone: 'light' },
  'app.history': { component: AppHistory, statusTone: 'dark' },
  'app.limit': { component: AppLimit, statusTone: 'light' },
  'app.mystyle': { component: AppMyStyle, statusTone: 'dark' },
  'app.colourquiz': { component: AppColourQuiz, statusTone: 'dark' },
  'app.colours': { component: AppColours, statusTone: 'light' },
  'app.account': { component: AppAccount, statusTone: 'dark' },
  'app.report': { component: AppReport, statusTone: 'dark' },
  'app.locked': { component: AppLocked, statusTone: 'light' },
  'admin.signin': { component: AdminSignin, path: '/sign-in' },
  'admin.overview': { component: AdminOverview, path: '/' },
  'admin.members': { component: AdminMembers, path: '/members' },
  'admin.usage': { component: AdminUsage, path: '/usage' },
  'admin.content': { component: AdminContent, path: '/content/questions' },
  'admin.ai': { component: AdminAi, path: '/ai/prompts' },
  'admin.limits': { component: AdminLimits, path: '/limits' },
  'admin.reports': { component: AdminReports, path: '/reports?status=new' },
  'admin.settings': { component: AdminSettings, path: '/settings/membership' },
}
