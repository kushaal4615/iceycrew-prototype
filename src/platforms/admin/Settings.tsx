import { motion } from 'framer-motion'
import { ArrowRight, Check, Globe, Link2, Plug, RefreshCw, Rss, Save } from 'lucide-react'
import { useState } from 'react'
import { Badge } from '../../components/Badge'
import { Button } from '../../components/Button'
import { Input, Toggle } from '../../components/Form'
import { Modal } from '../../components/Sheet'
import { FEED, PROVIDER_EVENTS } from '../../data/admin'
import { DEMO_CRM, DEMO_LINKS } from '../../data/demoFill'
import { useNav } from '../../lib/navigation'
import { session, useSession } from '../../lib/store'
import { track } from '../../lib/tracker'
import { listItem, listParent } from '../../motion/transitions'
import { ConsoleShell, Panel } from '../console/shell'

/* admin.settings: the swappable membership provider (Shopify adapter live,
   a CRM adapter staged, switched by config with no app update), the
   editable member links, the subscription app to confirm, membership
   levels, the newsletter feed source, languages and regions. */

export default function AdminSettings() {
  const { toast } = useNav()
  const provider = useSession((s) => s.provider)
  const staged = useSession((s) => s.crmStaged)
  const [links, setLinks] = useState(DEMO_LINKS)
  const [crm, setCrm] = useState(DEMO_CRM)
  const [confirm, setConfirm] = useState(false)
  const [subsApp, setSubsApp] = useState('To be confirmed by IceyCrew')
  const [dryRun, setDryRun] = useState(true)

  return (
    <ConsoleShell active="admin.settings" title="Membership provider & settings" sub="The app never talks to Shopify. It asks our membership layer; the layer asks the adapter that is switched on here." actions={<Button size="sm" variant="ink" icon={Save} onClick={() => { track('admin_settings_save'); toast('Settings saved · links update in the app on next launch', 'accent') }}>Save</Button>}>
      {/* the layer diagram as a band */}
      <section className="mx-8 overflow-hidden rounded-[var(--r-container)] bg-ink p-6 text-on-ink max-md:mx-4">
        <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-3 max-md:grid-cols-1">
          <div className="rounded-[var(--r-card)] bg-[rgb(255_255_255/0.08)] p-4">
            <span className="label text-on-ink-2">Mobile app</span>
            <span className="grot mt-1 block text-[20px]">“Verify this purchase”</span>
            <span className="meta mt-1 block text-on-ink-2">“Is this member active?” · no Shopify code</span>
          </div>
          <ArrowRight className="text-gold-light max-md:rotate-90 max-md:justify-self-center" aria-hidden />
          <div className="rounded-[var(--r-card)] bg-gold p-4 text-on-gold">
            <span className="label text-[var(--on-accent-2)]">Membership layer · our record</span>
            <span className="grot mt-1 block text-[20px]">status · paid_until · level · provider · IDs</span>
            <span className="meta mt-1 block text-[var(--on-accent-2)]">events: renewed · cancelled · payment failed · refunded</span>
          </div>
          <ArrowRight className="text-gold-light max-md:rotate-90 max-md:justify-self-center" aria-hidden />
          <div className="grid gap-2">
            <div className={`flex items-center justify-between rounded-[var(--r-card)] p-3 ${provider === 'shopify' ? 'bg-[rgb(255_255_255/0.14)]' : 'bg-[rgb(255_255_255/0.06)]'}`}>
              <span>
                <span className="block text-[14px] font-bold">Shopify adapter</span>
                <span className="meta text-on-ink-2">Admin API + subscription webhooks</span>
              </span>
              <Badge tone={provider === 'shopify' ? 'solid' : 'neutral'}>{provider === 'shopify' ? 'Live' : 'Standby'}</Badge>
            </div>
            <div className={`flex items-center justify-between rounded-[var(--r-card)] p-3 ${provider === 'crm' ? 'bg-[rgb(255_255_255/0.14)]' : 'bg-[rgb(255_255_255/0.06)]'}`}>
              <span>
                <span className="block text-[14px] font-bold">CRM adapter</span>
                <span className="meta text-on-ink-2">{staged || provider === 'crm' ? `${crm.name} · staged` : 'not configured'}</span>
              </span>
              <Badge tone={provider === 'crm' ? 'solid' : staged ? 'info' : 'neutral'}>{provider === 'crm' ? 'Live' : staged ? 'Ready' : 'Later'}</Badge>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-6 px-8 pb-10 pt-6 max-md:grid-cols-1 max-md:px-4">
        <div className="flex flex-col gap-6">
          <Panel title="Active provider" action={<Badge tone="accent">config, not code</Badge>}>
            <div className="flex flex-col gap-2">
              {(['shopify', 'crm'] as const).map((p) => (
                <button key={p} type="button" aria-pressed={provider === p} onClick={() => (p === 'crm' && !staged ? toast('Stage the CRM adapter first (below)', 'warn') : p !== provider ? setConfirm(true) : toast(`${p === 'shopify' ? 'Shopify' : crm.name} is already the live provider`, 'neutral'))} className={`flex min-h-[56px] w-full items-center gap-3 rounded-[var(--r-card)] px-4 text-left ${provider === p ? 'bg-ink text-on-ink' : 'bg-[var(--surface-raised)]'}`}>
                  <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full ${provider === p ? 'bg-gold text-on-gold' : 'ring-1 ring-inset ring-[var(--rule-strong)]'}`}>{provider === p && <Check size={14} strokeWidth={3} aria-hidden />}</span>
                  <span className="flex-1">
                    <span className="block text-[14.5px] font-bold">{p === 'shopify' ? 'Shopify' : `CRM · ${crm.name}`}</span>
                    <span className={`block text-[12px] ${provider === p ? 'text-on-ink-2' : 'text-text-2'}`}>{p === 'shopify' ? 'v1: purchase, monthly billing, status via webhooks' : 'Later: same events, matched by email, no re-verification'}</span>
                  </span>
                  <Plug size={16} aria-hidden />
                </button>
              ))}
            </div>
            <div className="mt-4">
              <Input label="Subscription app on Shopify" value={subsApp} onChange={(e) => setSubsApp(e.target.value)} hint="Shopify Subscriptions, Recharge or Loop. It decides which API and webhooks report status. Confirmed before that milestone starts." />
            </div>
            <dl className="mt-4 grid grid-cols-2 gap-2 text-[12.5px]">
              {[['Membership levels', 'VIP (one today; more added without a rebuild)'], ['Status re-check', 'at login + daily 04:00 UTC'], ['Webhooks', '4 subscribed · last 07:31'], ['Mock provider', 'used in the test suite']].map(([k, v]) => (
                <div key={k} className="rounded-[var(--r-control)] bg-[var(--surface-raised)] px-3 py-2">
                  <dt className="label text-text-2">{k}</dt>
                  <dd className="mt-0.5 font-semibold">{v}</dd>
                </div>
              ))}
            </dl>
          </Panel>

          <Panel title="CRM adapter · staged for later" action={staged ? <Badge tone="info">Staged</Badge> : undefined}>
            <div className="grid grid-cols-2 gap-3 max-md:grid-cols-1">
              <Input label="CRM" value={crm.name} onChange={(e) => setCrm({ ...crm, name: e.target.value })} dense />
              <Input label="Match existing members by" value={crm.matchBy} onChange={(e) => setCrm({ ...crm, matchBy: e.target.value })} dense />
            </div>
            <div className="mt-3">
              <Input label="API base" value={crm.apiBase} onChange={(e) => setCrm({ ...crm, apiBase: e.target.value })} dense />
            </div>
            <div className="mt-3 flex items-center justify-between rounded-[var(--r-control)] bg-[var(--surface-raised)] px-3 py-2.5">
              <span className="text-[13px] font-semibold">Dry run: map members, write nothing</span>
              <Toggle on={dryRun} onChange={setDryRun} label="Dry run" tone="ink" />
            </div>
            <Button size="sm" variant="outline" icon={RefreshCw} className="mt-3" onClick={() => { session.stageCrm(); track('admin_stage_crm', crm.name); toast(`${crm.name} adapter staged: 1,284 of 1,284 members matched by ${crm.matchBy}; nothing written`, 'accent') }}>
              {staged ? 'Re-run mapping' : 'Stage adapter'}
            </Button>
            <p className="meta mt-3 text-text-3">Each record can hold more than one provider ID, so a member keeps their history across the switch and never re-verifies.</p>
          </Panel>
        </div>

        <div className="flex flex-col gap-6">
          <Panel title="Links shown to members" action={<Link2 size={16} className="text-text-2" aria-hidden />}>
            <div className="flex flex-col gap-3">
              <Input label="“Become a VIP”" value={links.becomeVip} onChange={(e) => setLinks({ ...links, becomeVip: e.target.value })} dense />
              <Input label="“Manage membership”" value={links.manage} onChange={(e) => setLinks({ ...links, manage: e.target.value })} dense />
            </div>
            <p className="meta mt-3 text-text-3">Editable settings. Upgrades and billing happen on the website; the app never takes a payment.</p>
          </Panel>

          <Panel title="Newsletter feed" action={<Badge tone="success" icon={<Rss size={12} aria-hidden />}>Connected</Badge>}>
            <Input label="Source" value={links.feed} onChange={(e) => setLinks({ ...links, feed: e.target.value })} dense />
            <dl className="mt-3 grid grid-cols-2 gap-2 text-[12.5px]">
              {[['Read from', `JSON · ${FEED.jsonPath}`], ['Last pull', FEED.lastPull], ['Next pull', `${FEED.nextPull} · every ${FEED.everyH}h`], ['This edition', `${FEED.articles} links · ${FEED.broken} broken, dropped`]].map(([k, v]) => (
                <div key={k} className="rounded-[var(--r-control)] bg-[var(--surface-raised)] px-3 py-2">
                  <dt className="label text-text-2">{k}</dt>
                  <dd className="mt-0.5 truncate font-semibold">{v}</dd>
                </div>
              ))}
            </dl>
            <Button size="sm" variant="outline" icon={RefreshCw} className="mt-3" onClick={() => { track('admin_feed_pull'); toast('Pulled now: 12 links, 1 broken dropped, 0 new since 06:00', 'accent') }}>
              Pull now
            </Button>
            <p className="meta mt-3 text-text-3">The existing workflow keeps publishing to the page and to JSON; the app reads the JSON. New articles appear with no app update and no extra step.</p>
          </Panel>

          <Panel title="Languages & regions" action={<Globe size={16} className="text-text-2" aria-hidden />}>
            <motion.ul variants={listParent} initial="hidden" animate="show" className="divide-y divide-[var(--rule)]">
              {[
                ['English', 'Live · v1', true],
                ['Español', 'Strings file ready · switch on later', false],
                ['Français (CA)', 'Strings file ready · switch on later', false],
              ].map(([n, s, on]) => (
                <motion.li key={n as string} variants={listItem} className="flex items-center justify-between py-2.5">
                  <span>
                    <span className="block text-[14px] font-bold">{n as string}</span>
                    <span className="meta text-text-2">{s as string}</span>
                  </span>
                  <Toggle on={on as boolean} onChange={() => toast(on ? 'English stays on in v1' : `${n}: schema and strings are ready; enabling is a later phase`, 'info')} label={`${n}`} tone="ink" />
                </motion.li>
              ))}
            </motion.ul>
            <div className="mt-3 grid grid-cols-4 gap-2 text-center text-[12px] max-md:grid-cols-2">
              {[['US', '°F · MM/DD · color', 'us-east-1'], ['CA', '°C · DD/MM · colour', 'ca-central-1'], ['UK', '°C · DD/MM · colour', 'via us-east-1'], ['AU', '°C · DD/MM · colour', 'via us-east-1']].map(([c, f, r]) => (
                <div key={c} className="rounded-[var(--r-control)] bg-[var(--surface-raised)] px-2 py-2">
                  <span className="label block">{c}</span>
                  <span className="block text-text-2">{f}</span>
                  <span className="meta block text-text-3">{r}</span>
                </div>
              ))}
            </div>
            <p className="meta mt-3 text-text-3">No hard-coded text: every string lives in localisation files. Adding a language never rebuilds a screen. North America is prioritised for hosting.</p>
          </Panel>

          <Panel title="Recent provider events · normalised">
            <ul className="divide-y divide-[var(--rule)] text-[12.5px]">
              {PROVIDER_EVENTS.slice(0, 4).map((e) => (
                <li key={e.id} className="flex items-center justify-between py-2">
                  <span className="meta truncate text-text-2">{e.raw}</span>
                  <span className="font-bold">→ {e.event}</span>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      </div>

      <Modal open={confirm} onClose={() => setConfirm(false)} title={provider === 'shopify' ? 'Switch to the CRM adapter?' : 'Switch back to Shopify?'}>
        <p className="text-[14px] leading-relaxed text-text-2">{provider === 'shopify' ? `Membership checks move to ${crm.name}. Existing members are already matched by ${crm.matchBy}; nobody re-verifies, no app update ships, and the Shopify adapter goes to standby.` : 'Membership checks return to the Shopify adapter. Nothing changes in the app.'}</p>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="outline" onClick={() => setConfirm(false)}>
            Cancel
          </Button>
          <Button variant="ink" onClick={() => { const next = provider === 'shopify' ? 'crm' : 'shopify'; session.setProvider(next); track('admin_switch_provider', next); setConfirm(false); toast(`Provider switched to ${next === 'crm' ? crm.name : 'Shopify'} · 0 members affected`, 'accent') }}>
            Switch provider
          </Button>
        </div>
      </Modal>
    </ConsoleShell>
  )
}
