/** ZERO-TYPING AUDIT (v4): walks every flow from a fresh load using taps only (no keyboard).
 *  Each step taps the screen's primary action: the ember (accent) button in the dock,
 *  else the last accent button on screen. Usage: node scripts/zero-typing.mjs <baseUrl> [--phone] */
import { chromium, devices } from 'playwright'

const BASE = process.argv[2] ?? 'http://localhost:5302'
const PHONE = process.argv.includes('--phone')
const browser = await chromium.launch()
const ctx = PHONE ? await browser.newContext({ ...devices['iPhone 13'], viewport: { width: 390, height: 844 } }) : await browser.newContext({ viewport: { width: 1440, height: 900 } })
const page = await ctx.newPage()
const hash = () => page.evaluate(() => location.hash)
const go = async (h) => {
  await page.goto('about:blank')
  await page.goto(`${BASE}/#/${h}`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(900)
}
/** tap the primary (accent-filled) button; returns its label */
const primary = async (match) => {
  const label = await page.evaluate((src) => {
    const re = src ? new RegExp(src, 'i') : null
    const frame = document.querySelector('[data-stage-frame]')
    const dialogs = [...document.querySelectorAll('[role="dialog"]')].filter((d) => d.getBoundingClientRect().height > 0)
    const f = dialogs.length ? dialogs.at(-1) : frame
    const all = [...f.querySelectorAll('button')].filter((b) => {
      const r = b.getBoundingClientRect()
      if (!r.width || !r.height || b.disabled) return false
      const txt = (b.getAttribute('aria-label') || b.textContent || '').trim()
      if (re) return re.test(txt)
      return getComputedStyle(b).backgroundColor.replace(/\s/g, '').startsWith('rgb(230,179,22')
    })
    const docked = all.filter((b) => b.closest('[data-dock]'))
    const b = (docked.length ? docked : all).at(-1)
    if (!b) return null
    b.setAttribute('data-zt', '1')
    return (b.getAttribute('aria-label') || b.textContent || '').trim().slice(0, 40)
  }, match ? match.source : null)
  if (!label) throw new Error(`no primary button on ${await hash()}`)
  await page.locator('[data-zt="1"]').scrollIntoViewIfNeeded()
  await page.locator('[data-zt="1"]').click()
  await page.evaluate(() => document.querySelector('[data-zt]')?.removeAttribute('data-zt'))
  await page.waitForTimeout(900)
  return label
}
const errorsOnLoad = () =>
  page.evaluate(() => {
    const f = document.querySelector('[data-stage-frame]')
    return [...f.querySelectorAll('p, span')].filter((e) => /required|is required|enter your|doesn.t match|fill in/i.test(e.textContent || '') && getComputedStyle(e).color.replace(/\s/g, '').includes('168,35,47')).length
  })
const until = async (target, max = 14) => {
  for (let i = 0; i < max; i++) {
    const h = await hash()
    if (h === target) return true
    if (await errorsOnLoad()) return `validation error visible on ${h}`
    await primary()
  }
  return (await hash()) === target || `ended at ${await hash()}`
}

/* a change = the frame's text changed, or a toast appeared (phone mode renders toasts outside the frame) */
const snapshot = () => page.evaluate(() => (document.querySelector('[data-stage-frame]')?.innerText ?? '') + '\n' + [...document.querySelectorAll('[aria-live]')].map((e) => e.innerText).join('|'))
const changed = async (fn) => {
  const before = await snapshot()
  await fn()
  await page.waitForTimeout(500)
  return (await snapshot()) !== before || 'nothing changed'
}

const flows = [
  ['Member: welcome → verify → create account → onboarding', async () => {
    await go('app/welcome'); await primary(/verify/); await primary(/verify my order/); await page.waitForTimeout(2600); await primary(/create my account/); await primary(/create account/)
    return (await hash()) === '#/app/onboarding' || `ended at ${await hash()}`
  }],
  ['Member: 7 questions → swipe deck', async () => { await go('app/onboarding'); return until('#/app/swipe', 10) }],
  ['Member: finish the deck → home', async () => { await go('app/swipe'); return until('#/app/home', 10) }],
  ['Member: camera → analyse → processing → analysis', async () => { await go('app/camera'); await primary(/take the photo/); await primary(/^analyse/); await page.waitForTimeout(4200); return (await hash()) === '#/app/analysis' || `ended at ${await hash()}` }],
  ['Member: rate helpfulness and send the comment', async () => { await go('app/analysis'); await page.locator('[data-stage-frame] [aria-label="5 of 5"]').click(); return changed(() => primary(/^send|^update/)) }],
  ['Member: send a problem report', async () => { await go('app/report'); return changed(() => primary(/send report/)) }],
  ['Member: colour quiz → My Colours', async () => { await go('app/colourquiz'); return until('#/app/colours', 10) }],
  ['Member: edit a preference', async () => { await go('app/mystyle'); await primary(/sections/i); await page.waitForTimeout(400); return changed(() => primary(/^save/)) }],
  ['Member: other occasion from the camera', async () => { await go('app/camera'); await primary(/^other$/i); await page.waitForTimeout(400); return changed(() => primary(/^use /i)) }],
  ['Member: weather sheet', async () => { await go('app/camera'); await primary(/weather for this scan/i); await page.waitForTimeout(400); return changed(() => primary(/use weather/i)) }],
  ['Member: keep my photos toggle', async () => { await go('app/account'); return changed(() => page.locator('[data-stage-frame] [role="switch"]').first().click()) }],
  ['Member: delete photos (confirm sheet)', async () => { await go('app/account'); await primary(/delete photos/i); await page.waitForTimeout(400); return changed(() => primary(/^delete$/i)) }],
  ['Admin: sign-in', async () => { await go('admin/signin'); return until('#/admin/overview', 2) }],
  ['Admin: save limits', async () => { await go('admin/limits'); return changed(() => primary(/save limits/i)) }],
  ['Admin: save the prompt as v15', async () => { await go('admin/ai'); return changed(() => primary(/save as v15/i)) }],
  ['Admin: edit question wording', async () => { await go('admin/content'); await primary(/edit wording/i); await page.waitForTimeout(400); return changed(() => primary(/save draft/i)) }],
  ['Admin: reply to a report', async () => { await go('admin/reports'); return changed(() => primary(/send reply/i)) }],
  ['Admin: stage the CRM adapter', async () => { await go('admin/settings'); return changed(() => primary(/stage adapter|re-run mapping/i)) }],
  ['Admin: open a member and save a note', async () => { await go('admin/members'); await page.locator('[data-stage-frame] main tbody tr, [data-stage-frame] main ul li button').first().click(); await page.waitForTimeout(500); return changed(() => primary(/save note/i)) }],
  ['Admin: export analyses', async () => { await go('admin/usage'); return changed(() => primary(/export analyses/i)) }],
]


let pass = 0
const fails = []
for (const [name, fn] of flows) {
  try {
    const r = await fn()
    if (r === true) pass++
    else fails.push(`${name}: ${r}`)
  } catch (e) {
    fails.push(`${name}: ${String(e.message).split('\n')[0].slice(0, 110)}`)
  }
}
await browser.close()
console.log(`Zero-typing flows (${PHONE ? 'phone' : 'desktop'}): ${pass}/${flows.length} completed with taps only`)
fails.forEach((f) => console.log('  BLOCKED ' + f))
