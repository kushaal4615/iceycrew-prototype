import { motion } from 'framer-motion'
import { GripVertical, Pencil, Plus, RotateCcw, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Badge, Chip } from '../../components/Badge'
import { Button, Pressable } from '../../components/Button'
import { Input } from '../../components/Form'
import { HeroImage } from '../../components/Media'
import { Modal } from '../../components/Sheet'
import { Segmented } from '../../components/Tabs'
import { COLOUR_QUIZ, DECK, QUESTIONS, TAG_LABEL, type Question } from '../../data/content'
import { DEMO_QUESTION_EDIT } from '../../data/demoFill'
import { useNav } from '../../lib/navigation'
import { session, useSession } from '../../lib/store'
import { track } from '../../lib/tracker'
import { listItem, listParent } from '../../motion/transitions'
import { ConsoleShell, Panel } from '../console/shell'

/* admin.content: edit the onboarding questions, the colour quiz and the
   swipe deck (size, tags, source and licence per image). Master-detail:
   the list on the left, the editor on the right. */

type Tab = 'questions' | 'quiz' | 'deck'

export default function AdminContent() {
  const { toast } = useNav()
  const edits = useSession((s) => s.questionEdits)
  const removed = useSession((s) => s.deckRemoved)
  const deckSize = useSession((s) => s.limits.deckSize)
  const [tab, setTab] = useState<Tab>('questions')
  const [selected, setSelected] = useState<string>(QUESTIONS[0].id)
  const [editing, setEditing] = useState<Question | null>(null)
  const [prompt, setPrompt] = useState(DEMO_QUESTION_EDIT.prompt)
  const [newOption, setNewOption] = useState(DEMO_QUESTION_EDIT.option)
  const list = tab === 'questions' ? QUESTIONS : COLOUR_QUIZ
  const q = list.find((x) => x.id === selected) ?? list[0]
  const live = DECK.filter((c) => !removed.includes(c.id))

  return (
    <ConsoleShell
      active="admin.content"
      title="Questions, quiz & deck"
      sub="Editable here without an app update: onboarding questions, the colour quiz, and the swipe deck"
      actions={<Segmented items={[{ id: 'questions', label: 'Onboarding', count: QUESTIONS.length }, { id: 'quiz', label: 'Colour quiz', count: COLOUR_QUIZ.length }, { id: 'deck', label: 'Swipe deck', count: live.length }]} value={tab} onChange={(t) => { if (t === tab) return toast(`Already on ${t === 'deck' ? 'the swipe deck' : t === 'quiz' ? 'the colour quiz' : 'onboarding'}`, 'neutral'); setTab(t); setSelected(t === 'quiz' ? COLOUR_QUIZ[0].id : QUESTIONS[0].id) }} />}
    >
      {tab !== 'deck' ? (
        <div className="grid grid-cols-[360px_minmax(0,1fr)] gap-6 px-8 pb-10 max-md:grid-cols-1 max-md:px-4">
          <Panel pad={false} title={tab === 'questions' ? 'Onboarding questions' : 'Colour quiz'} action={<Button size="sm" variant="outline" icon={Plus} onClick={() => toast('New question added at the end · draft until published', 'accent')}>Add</Button>}>
            <motion.ol variants={listParent} initial="hidden" animate="show" className="divide-y divide-[var(--rule)]">
              {list.map((x, i) => (
                <motion.li key={x.id} variants={listItem}>
                  <Pressable onClick={() => setSelected(x.id)} className={`flex items-start gap-3 px-4 py-3 ${x.id === q.id ? 'bg-[var(--surface-tint)]' : 'hover:bg-[var(--surface-raised)]'}`}>
                    <GripVertical size={16} className="mt-0.5 shrink-0 text-text-3" aria-hidden />
                    <span className="num mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-[6px] bg-ink text-[11px] font-bold text-on-ink">{i + 1}</span>
                    <span className="min-w-0 flex-1">
                      <span className="label block text-text-2">{x.topic}</span>
                      <span className="block text-[13.5px] font-semibold leading-snug">{edits[x.id] ?? x.prompt}</span>
                      <span className="meta mt-1 block text-text-2">{x.options.length} options · {x.multi ? 'multi' : 'single'}{x.illustrated ? ' · illustrated' : ''} · {edits[x.id] ? 'draft · edited just now' : i % 3 === 0 ? 'updated 2d ago' : 'updated Oct 28'}</span>
                    </span>
                  </Pressable>
                </motion.li>
              ))}
            </motion.ol>
          </Panel>

          <div className="flex flex-col gap-6">
            <Panel title="Question" action={<Badge tone={edits[q.id] ? 'warn' : 'success'}>{edits[q.id] ? 'Edited · unpublished' : 'Live'}</Badge>}>
              <p className="grot text-[28px] leading-[1.02]">{edits[q.id] ?? q.prompt}</p>
              <p className="mt-1 text-[13px] text-text-2">{q.topic} · {q.multi ? 'choose all that apply' : 'choose one'}</p>
              <ul className="mt-4 grid grid-cols-2 gap-2 max-md:grid-cols-1">
                {q.options.map((o) => (
                  <li key={o.id} className="flex items-center justify-between gap-2 rounded-[var(--r-control)] bg-[var(--surface-raised)] px-3 py-2.5 text-[13.5px] font-semibold">
                    {o.label}
                    <button type="button" onClick={() => toast(`Option “${o.label}”: edit label, reorder, or hide`, 'info')} aria-label={`Edit ${o.label}`} className="grid h-8 w-8 place-items-center rounded-full text-text-2 hover:bg-[var(--surface-high)]">
                      <Pencil size={14} />
                    </button>
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button size="sm" variant="ink" icon={Pencil} onClick={() => { setPrompt(edits[q.id] ?? q.prompt); setEditing(q) }}>
                  Edit wording
                </Button>
                <Button size="sm" variant="outline" icon={Plus} onClick={() => toast(`Added “${newOption}” to ${q.topic}`, 'accent')}>
                  Add option
                </Button>
                {edits[q.id] && (
                  <Button size="sm" variant="ghost" icon={RotateCcw} onClick={() => session.editQuestion(q.id, q.prompt)}>
                    Revert
                  </Button>
                )}
              </div>
            </Panel>
            <Panel title="Answers · last 30 days">
              <ul className="flex flex-col gap-2">
                {q.options.slice(0, 6).map((o, i) => {
                  const v = [38, 27, 14, 11, 6, 4][i] ?? 3
                  return (
                    <li key={o.id} className="grid grid-cols-[1fr_120px_40px] items-center gap-3 text-[13px]">
                      <span className="truncate">{o.label}</span>
                      <span className="relative block h-2.5 overflow-hidden rounded-full bg-[var(--surface-high)]">
                        <span className="absolute inset-y-0 left-0 rounded-full bg-ink" style={{ width: `${v}%` }} />
                      </span>
                      <span className="num text-right text-text-2">{v}%</span>
                    </li>
                  )
                })}
              </ul>
              <p className="meta mt-3 text-text-3">{tab === 'quiz' ? 'The same answers always give the same season; changing options changes the mapping table, versioned.' : 'Onboarding drop-off at this step: 2–6 members per month.'}</p>
            </Panel>
          </div>
        </div>
      ) : (
        <div className="px-8 pb-10 max-md:px-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-[13.5px] font-semibold">Deck size shown to members</span>
            <div className="flex items-center gap-1">
              {[16, 20, 24].map((n) => (
                <button key={n} type="button" aria-pressed={deckSize === n} onClick={() => { if (deckSize === n) return toast(`Deck size is already ${n}`, 'neutral'); session.setLimits({ deckSize: n }); track('admin_deck_size', n) }} className="shrink-0">
                  <Chip on={deckSize === n}>{n} cards</Chip>
                </button>
              ))}
            </div>
            <span className="meta ml-auto text-text-2">{live.length} licensed images · tagged by style · source and licence on each</span>
          </div>
          <motion.ul variants={listParent} initial="hidden" animate="show" className="mt-4 grid grid-cols-6 gap-3 max-md:grid-cols-2">
            {DECK.map((c, i) => {
              const off = removed.includes(c.id)
              return (
                <motion.li key={c.id} variants={listItem} className={`overflow-hidden rounded-[var(--r-card)] bg-[var(--surface)] shadow-[var(--shadow-raised)] ${off ? 'opacity-50' : ''} ${i >= deckSize ? 'ring-2 ring-[var(--gold)]' : ''}`}>
                  <HeroImage src={c.image} alt={c.title} scrim="b" width={400} className="aspect-[3/4]" position="top">
                    <div className="flex h-full flex-col justify-between p-2.5">
                      <span className="label self-start rounded-full bg-[rgb(255_255_255/0.9)] px-2 py-1 text-text">{TAG_LABEL[c.tag]}</span>
                      <span className="text-[12.5px] font-bold text-on-night">{c.title}</span>
                    </div>
                  </HeroImage>
                  <div className="flex items-center justify-between px-2.5 py-2">
                    <span className="meta truncate text-text-2">{c.source} · {c.licence}</span>
                    <button type="button" onClick={() => (off ? session.restoreCard(c.id) : session.removeCard(c.id))} aria-label={off ? 'Restore card' : 'Remove card'} className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-text-2 hover:bg-[var(--surface-high)]">
                      {off ? <RotateCcw size={14} /> : <Trash2 size={14} />}
                    </button>
                  </div>
                </motion.li>
              )
            })}
          </motion.ul>
          <p className="meta mt-3 text-text-3">Cards beyond the deck size are outlined in gold and held in reserve. Every image is licensed for commercial use; the source-and-licence list exports with the deck.</p>
        </div>
      )}

      <Modal open={!!editing} onClose={() => setEditing(null)} title="Edit wording">
        {editing && (
          <>
            <Input label="Question" value={prompt} onChange={(e) => setPrompt(e.target.value)} hint="Members see the change on their next onboarding or recalibration. No app update." />
            <div className="mt-4">
              <Input label="New option (optional)" value={newOption} onChange={(e) => setNewOption(e.target.value)} />
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setEditing(null)}>
                Cancel
              </Button>
              <Button
                variant="ink"
                onClick={() => {
                  if (!prompt.trim()) return toast('The question needs some wording', 'warn')
                  session.editQuestion(editing.id, prompt.trim())
                  track('admin_question_edit', editing.id)
                  setEditing(null)
                  toast('Saved as a draft · publish from the list', 'accent')
                }}
              >
                Save draft
              </Button>
            </div>
          </>
        )}
      </Modal>
    </ConsoleShell>
  )
}
