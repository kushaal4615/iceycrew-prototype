import { motion } from 'framer-motion'
import { Check, ChevronDown, Minus, Play, Plus, Save, X } from 'lucide-react'
import { useState } from 'react'
import { Avatar } from '../../components/Avatar'
import { Badge } from '../../components/Badge'
import { Bar as BrandBar } from '../../components/Brand'
import { Button } from '../../components/Button'
import { Field, TextArea } from '../../components/Form'
import { AI, memberById } from '../../data/admin'
import { DEMO_PROMPT_NOTE } from '../../data/demoFill'
import { useNav } from '../../lib/navigation'
import { session, useSession } from '../../lib/store'
import { track } from '../../lib/tracker'
import { listItem, listParent } from '../../motion/transitions'
import { ConsoleShell, Panel } from '../console/shell'

/* admin.ai: the vision model and its cost, the system prompt and rating
   criteria (editable without an app update), the JSON schema the backend
   validates, retry, regional spelling, and a test run. Split panel. */

export default function AdminAi() {
  const { toast } = useNav()
  const saved = useSession((s) => s.promptSaved)
  const [prompt, setPrompt] = useState(AI.systemPrompt)
  const [note, setNote] = useState(DEMO_PROMPT_NOTE)
  const [weights, setWeights] = useState(AI.criteria.map((c) => c.weight))
  const [provider, setProvider] = useState(AI.provider)
  const [testing, setTesting] = useState(false)
  const total = weights.reduce((a, b) => a + b, 0)
  const bump = (i: number, delta: number) => setWeights((w) => w.map((x, j) => (j === i ? Math.min(100, Math.max(0, x + delta)) : x)))

  const save = () => {
    if (!prompt.trim()) return toast('The system prompt can’t be empty', 'warn')
    if (total !== 100) return toast(`Criteria weights add up to ${total}%, they need to be 100%`, 'warn')
    session.savePrompt()
    track('admin_prompt_save', 'v15')
    toast('Saved as prompt v15 · live for the next analysis, no app update', 'accent')
  }
  const test = () => {
    setTesting(true)
    track('admin_prompt_test')
    window.setTimeout(() => {
      setTesting(false)
      toast('Test run on sample photo: overall 83 · fit 86 · colour 90 · cohesion 81 · occasion 75 · 6.9s · JSON valid', 'accent')
    }, 1400)
  }

  return (
    <ConsoleShell
      active="admin.ai"
      title="AI prompts & criteria"
      sub={`${provider} · ~$${AI.costPerAnalysis.toFixed(2)} per analysis · prompt ${saved ? 'v15 · just now' : AI.promptVersion}`}
      actions={
        <>
          <Button size="sm" variant="outline" icon={Play} onClick={test} aria-busy={testing}>
            {testing ? 'Running…' : 'Test on a sample photo'}
          </Button>
          <Button size="sm" variant="ink" icon={Save} onClick={save}>
            Save as v15
          </Button>
        </>
      }
    >
      <div className="grid grid-cols-[minmax(0,1.5fr)_minmax(320px,1fr)] gap-6 px-8 pb-10 max-md:grid-cols-1 max-md:px-4">
        <div className="flex flex-col gap-6">
          <Panel title="System prompt" action={<Badge tone={saved ? 'success' : 'neutral'}>{saved ? 'v15 live' : 'v14 live'}</Badge>}>
            <TextArea label="Instructions sent with every request" rows={11} value={prompt} onChange={(e) => setPrompt(e.target.value)} className="font-[DM_Mono] text-[12.5px] leading-relaxed" />
            <div className="mt-3">
              <TextArea label="Change note" rows={2} value={note} onChange={(e) => setNote(e.target.value)} hint="Versioned. Analyses record which prompt version scored them." />
            </div>
          </Panel>

          <Panel title="Rating criteria" action={<span className={`meta ${total === 100 ? 'text-text-2' : 'text-danger-text'}`}>weights {total}%</span>}>
            <motion.ul variants={listParent} initial="hidden" animate="show" className="flex flex-col gap-3">
              {AI.criteria.map((c, i) => (
                <motion.li key={c.key} variants={listItem} className="grid grid-cols-[96px_1fr_150px] items-center gap-4 max-md:grid-cols-1 max-md:gap-1">
                  <span>
                    <span className="block text-[14px] font-bold">{c.label}</span>
                    <span className="num text-[12px] text-text-2">{weights[i]}%</span>
                  </span>
                  <span className="text-[12.5px] leading-snug text-text-2">{c.note}</span>
                  <span className="flex items-center gap-1.5">
                    <button type="button" onClick={() => bump(i, -5)} aria-label={`Lower ${c.label}`} className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[var(--surface-high)] text-text">
                      <Minus size={14} strokeWidth={3} />
                    </button>
                    <BrandBar value={weights[i]} height={8} tone={i === 0 ? 'gold' : 'ink'} className="w-[60px]" />
                    <button type="button" onClick={() => bump(i, 5)} aria-label={`Raise ${c.label}`} className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[var(--surface-high)] text-text">
                      <Plus size={14} strokeWidth={3} />
                    </button>
                  </span>
                </motion.li>
              ))}
            </motion.ul>
            <p className="meta mt-3 text-text-3">The overall score is the weighted mean of the four, rounded. Occasion falls back to general suitability when no chip or weather is given.</p>
          </Panel>
        </div>

        <div className="flex flex-col gap-6">
          <Panel title="Model">
            <Field label="Vision provider" hint="The backend holds the key; nothing ships in the app. Swapping providers is a config change.">
              <div className="relative">
                <select
                  value={provider}
                  onChange={(e) => {
                    setProvider(e.target.value)
                    track('admin_provider', e.target.value)
                  }}
                  aria-label="Provider"
                  className="well h-12 w-full appearance-none rounded-[var(--r-control)] px-3.5 pr-10 text-[14px] font-semibold outline-none ring-1 ring-inset ring-[var(--rule-strong)] focus:ring-2 focus:ring-[var(--gold)]"
                >
                  {[AI.provider, ...AI.alternatives].map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
                <ChevronDown size={16} aria-hidden className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-text-2" />
              </div>
            </Field>
            <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-[13px]">
              {[
                ['Temperature', `${AI.temperature}`],
                ['Max tokens', `${AI.maxTokens}`],
                ['Timeout', `${AI.timeoutS}s`],
                ['Retry on invalid', `${AI.retry} time`],
                ['Cost / analysis', `$${AI.costPerAnalysis.toFixed(2)}`],
                ['Spelling', 'by country: US color · CA/UK/AU colour'],
              ].map(([k, v]) => (
                <div key={k} className="rounded-[var(--r-control)] bg-[var(--surface-raised)] px-3 py-2">
                  <dt className="label text-text-2">{k}</dt>
                  <dd className="mt-0.5 font-semibold">{v}</dd>
                </div>
              ))}
            </dl>
          </Panel>

          <Panel title="Every request includes">
            <ul className="flex flex-col gap-1.5 text-[13px]">
              {['The photo (encrypted upload)', 'The style profile: answers + liked styles', 'The colour profile: season, palette, metals', 'Occasion and weather, when given', 'The member’s country, for spelling and units'].map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <Check size={14} className="shrink-0 text-gold-ink" strokeWidth={3} aria-hidden /> {t}
                </li>
              ))}
            </ul>
          </Panel>

          <Panel title="Structured output · validated before display">
            <pre className="scroll-x rounded-[var(--r-control)] bg-ink p-3 font-[DM_Mono] text-[11.5px] leading-relaxed text-on-ink">{AI.schema}</pre>
            <p className="meta mt-2 text-text-3">Invalid JSON is retried once; a second failure shows the member a friendly error and logs the run.</p>
          </Panel>

          <Panel title="Recent runs">
            <ul className="divide-y divide-[var(--rule)]">
              {AI.recentRuns.map((r) => {
                const m = memberById(r.member)
                return (
                  <li key={r.id} className="flex items-center gap-3 py-2 text-[12.5px]">
                    <Avatar who={m.photo} size={26} />
                    <span className="meta w-[72px] shrink-0 text-text-2">{r.id}</span>
                    <span className="num w-[52px] shrink-0 font-semibold">{(r.ms / 1000).toFixed(1)}s</span>
                    <span className="min-w-0 flex-1">
                      {r.valid ? (
                        <span className="inline-flex items-center gap-1 font-semibold text-on-success-soft">
                          <Check size={13} strokeWidth={3} aria-hidden /> valid · {r.overall}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-danger-text">
                          <X size={13} strokeWidth={3} aria-hidden /> invalid · friendly error
                        </span>
                      )}
                    </span>
                    {r.retried && <Badge tone="warn">retried</Badge>}
                  </li>
                )
              })}
            </ul>
          </Panel>
        </div>
      </div>
    </ConsoleShell>
  )
}
