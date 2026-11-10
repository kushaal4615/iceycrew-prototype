import { motion } from 'framer-motion'
import { ArrowUpRight, BellOff, ChevronRight, Download, FileText, Flag, Globe, KeyRound, LifeBuoy, Lock, LogOut, Shield, Trash2, UserX } from 'lucide-react'
import { useState } from 'react'
import { Avatar } from '../../components/Avatar'
import { Vip } from '../../components/Brand'
import { Button, Pressable } from '../../components/Button'
import { Toggle } from '../../components/Form'
import { BottomSheet } from '../../components/Sheet'
import { SCORED } from '../../data/analyses'
import { fmtUS } from '../../data/clock'
import { DEMO_PROFILE } from '../../data/demoFill'
import { useNav } from '../../lib/navigation'
import { session, useSession } from '../../lib/store'
import { track } from '../../lib/tracker'
import { listItem, listParent } from '../../motion/transitions'
import { MobileScreen, TopBar } from '../mobileShell'

/* app.account: profile; VIP status and the next renewal from our own
   membership record, with "Manage membership"; privacy (delete photos,
   "Keep my photos", download my data, delete account); help, terms,
   privacy, log out; report a problem. */

export default function AppAccount() {
  const { navigate, reset, toast } = useNav()
  const keep = useSession((s) => s.keepPhotos)
  const deleted = useSession((s) => s.deletedPhotos)
  const membership = useSession((s) => s.membership)
  const [confirm, setConfirm] = useState<'photos' | 'account' | null>(null)

  const Row = ({ icon: Icon, label, sub, onClick, danger = false, trailing }: { icon: typeof Lock; label: string; sub?: string; onClick: () => void; danger?: boolean; trailing?: React.ReactNode }) => (
    <li>
      <Pressable onClick={onClick} className="flex min-h-[56px] items-center gap-3 px-5 py-2.5 hover:bg-[var(--surface-raised)]">
        <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full ${danger ? 'bg-danger-soft text-danger-text' : 'bg-[var(--surface-high)] text-text'}`}>
          <Icon size={17} aria-hidden />
        </span>
        <span className="min-w-0 flex-1">
          <span className={`block text-[15px] font-semibold ${danger ? 'text-danger-text' : 'text-text'}`}>{label}</span>
          {sub && <span className="block truncate text-[12.5px] text-text-2">{sub}</span>}
        </span>
        {trailing ?? <ChevronRight size={16} className="shrink-0 text-text-3" aria-hidden />}
      </Pressable>
    </li>
  )

  return (
    <MobileScreen
      header={<TopBar title="Account & Settings" />}
      overlay={
        <BottomSheet open={!!confirm} onClose={() => setConfirm(null)} title={confirm === 'photos' ? 'Delete photos and analyses?' : 'Delete your account?'}>
          <p className="text-[14px] leading-snug text-text-2">
            {confirm === 'photos' ? `All ${SCORED.length} outfit photos and their analyses are removed from our servers now. This can’t be undone.` : 'Your account, profile, photos and history are deleted completely. Your VIP subscription on iceycrew.com is separate and stays as it is.'}
          </p>
          <div className="mt-4 flex gap-2">
            <Button block variant="outline" onClick={() => setConfirm(null)}>
              Cancel
            </Button>
            <Button
              block
              variant="danger"
              icon={Trash2}
              onClick={() => {
                if (confirm === 'photos') {
                  track('delete_photos')
                  session.deletePhotos()
                  setConfirm(null)
                  toast('Photos and analyses deleted', 'danger')
                } else {
                  track('delete_account')
                  setConfirm(null)
                  session.reset()
                  reset('app.welcome')
                }
              }}
            >
              {confirm === 'photos' ? 'Delete' : 'Delete account'}
            </Button>
          </div>
        </BottomSheet>
      }
    >
      <motion.div variants={listParent} initial="hidden" animate="show">
        {/* ── Profile ── */}
        <motion.div variants={listItem} className="flex items-center gap-4 px-5 pt-2">
          <Avatar who="maya" size={72} ring />
          <div className="min-w-0 flex-1">
            <p className="grot text-[26px]">{DEMO_PROFILE.name}</p>
            <p className="truncate text-[13px] text-text-2">{DEMO_PROFILE.email}</p>
            <button type="button" onClick={() => toast('Edit name, photo and email', 'info')} className="mt-1 h-9 text-[13px] font-bold text-gold-ink">
              Edit profile
            </button>
          </div>
        </motion.div>

        {/* ── Membership record ── */}
        <motion.div variants={listItem} className="relative mx-5 mt-5 overflow-hidden rounded-[var(--r-container)] bg-ink p-5 text-on-ink">
          <div aria-hidden className="facet" style={{ opacity: 0.3 }} />
          <div className="flex items-center justify-between">
            <Vip tone="light" label="VIP membership" />
            <span className={`label rounded-full px-2.5 py-1 ${membership === 'active' ? 'bg-success-soft text-on-success-soft' : 'bg-danger-soft text-on-danger-soft'}`}>{membership === 'active' ? 'Active' : 'Lapsed'}</span>
          </div>
          <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-[13px]">
            <div>
              <dt className="label text-on-ink-2">Next renewal</dt>
              <dd className="num mt-0.5 font-bold">{fmtUS('2026-12-03', true)}</dd>
            </div>
            <div>
              <dt className="label text-on-ink-2">Billed by</dt>
              <dd className="mt-0.5 font-bold">IceyCrew store · monthly</dd>
            </div>
            <div>
              <dt className="label text-on-ink-2">Member since</dt>
              <dd className="num mt-0.5 font-bold">{fmtUS('2026-03-03', true)}</dd>
            </div>
            <div>
              <dt className="label text-on-ink-2">Level</dt>
              <dd className="mt-0.5 font-bold">VIP · one level today</dd>
            </div>
          </dl>
          <p className="meta mt-3 text-on-ink-2">Renewals are automatic; the app picks them up without you doing anything.</p>
          <Button size="sm" variant="accent" className="mt-3" trailing={ArrowUpRight} onClick={() => { track('manage_membership', 'account'); toast('Opens iceycrew.com/account/subscriptions in the browser', 'info') }}>
            Manage membership
          </Button>
        </motion.div>

        {/* ── Privacy ── */}
        <motion.p variants={listItem} className="label mt-7 px-5 text-text-2">Privacy</motion.p>
        <motion.ul variants={listItem} className="mt-1 divide-y divide-[var(--rule)]">
          <li className="flex min-h-[64px] items-center gap-3 px-5 py-2.5">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[var(--surface-high)] text-text">
              <Shield size={17} aria-hidden />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[15px] font-semibold">Keep my photos</span>
              <span className="block text-[12.5px] leading-snug text-text-2">{keep ? 'On: photos stay until you delete them.' : 'Off: photos auto-delete 12 months after each scan. Scores and tips stay.'}</span>
            </span>
            <Toggle on={keep} onChange={(v) => { session.setKeepPhotos(v); track('keep_photos', v) }} label="Keep my photos" />
          </li>
          <Row icon={Trash2} label={deleted ? 'Photos and analyses deleted' : 'Delete photos and analyses'} sub={deleted ? 'Done this session' : 'Removes every outfit photo and its analysis now'} onClick={() => setConfirm('photos')} />
          <Row icon={Download} label="Download my data" sub="Profile, answers, analyses as JSON, emailed within 24h" onClick={() => { track('download_data'); toast('We’ll email a download link to maya.delgado@… within 24 hours', 'accent') }} />
          <Row icon={UserX} label="Delete account" sub="Complete deletion, available here" onClick={() => setConfirm('account')} danger />
        </motion.ul>

        {/* ── App ── */}
        <motion.p variants={listItem} className="label mt-6 px-5 text-text-2">App</motion.p>
        <motion.ul variants={listItem} className="mt-1 divide-y divide-[var(--rule)]">
          <Row icon={Globe} label="Region and formats" sub="United States · °F · 11/10/2026 · “color”" onClick={() => toast('Formats follow your device region. English only in v1; more languages later.', 'info')} />
          <Row icon={BellOff} label="Notifications" sub="In-app notices only; push arrives in a later phase" onClick={() => toast('No push at launch. Notices appear inside the app.', 'neutral')} />
          <Row icon={KeyRound} label="Password and sign-in" sub="Reset password · Apple · Google · stays linked to your order" onClick={() => { track('password_reset'); toast('Reset link sent to maya.delgado@…', 'info') }} />
          <Row icon={Lock} label="What lapsed members see" sub="Preview the locked screen" onClick={() => { track('preview_locked'); session.setMembership('lapsed'); navigate('app.locked') }} />
        </motion.ul>

        {/* ── Help ── */}
        <motion.p variants={listItem} className="label mt-6 px-5 text-text-2">Help</motion.p>
        <motion.ul variants={listItem} className="mt-1 divide-y divide-[var(--rule)]">
          <Row icon={Flag} label="Report a problem" sub="Bug, wrong AI feedback, or anything else" onClick={() => { track('report_problem_link', 'account'); navigate('app.report') }} />
          <Row icon={LifeBuoy} label="Help & support" sub="support@iceycrew.com · replies within a day" onClick={() => toast('Opens the support page in the in-app browser', 'info')} />
          <Row icon={FileText} label="Terms of Service" onClick={() => toast('Terms open in the in-app browser', 'info')} />
          <Row icon={FileText} label="Privacy Policy" sub="CCPA/CPRA · PIPEDA · UK GDPR · Privacy Act 1988" onClick={() => toast('Privacy Policy opens in the in-app browser', 'info')} />
          <Row icon={LogOut} label="Log out" sub="Signed in on this phone since Mar 3" onClick={() => { track('logout'); reset('app.welcome') }} />
        </motion.ul>
        <motion.p variants={listItem} className="meta mx-5 mt-5 text-text-3">App 1.0.4 (112) · iPhone 16 Pro · iOS 19.1 · US</motion.p>
      </motion.div>
    </MobileScreen>
  )
}
