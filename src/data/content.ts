import type { MediaKey } from './media'

/* Editorial content: the newsletter feed (the real "The Edit" edition
   published at iceycrew.com/pages/style-tips for the week of 8 Nov 2026,
   titles and sources as the page lists them; the notes are the page's own
   one-line takeaways), the onboarding questions, the swipe deck, the
   colour quiz and the colour seasons. Everything editable in the admin
   panel in the real build lives here as data. */

/* ── Newsletter ─────────────────────────────────────────────── */
export type Article = { id: string; title: string; source: string; domain: string; note: string; image: MediaKey; publishedIso: string; paywalled?: boolean; broken?: boolean; readMin: number }

export const EDITION = { title: 'The Edit', week: 'Week of November 8, 2026', intro: "This week's edit is all about getting more from what you own, from flats and boots to jeans in surprising shades, with a few smart buys for the cold months ahead.", pickedFrom: 100, updated: 'Updated every Sunday', criteria: 'wearable, helpful, affordable, lasting, seasonal and inclusive' }

export const ARTICLES: Article[] = [
  { id: 'ar1', title: 'Seven Ways to Wear Flats With Jeans This Fall', source: 'Elle', domain: 'elle.com', note: 'Pair the flats you already own with your best-fitting jeans and add one layer, like a trench or a chunky sweater, to make it look planned.', image: 'flatTee', publishedIso: '2026-11-08', readMin: 4 },
  { id: 'ar2', title: "Black Boots and a Midi Skirt: Fall's Easiest Formula", source: 'Glamour', domain: 'glamour.com', note: 'Pull out a midi skirt and your black boots, then try them with a sweater you already love.', image: 'fitRuffle', publishedIso: '2026-11-08', readMin: 3 },
  { id: 'ar3', title: 'What Stylish Over-50s Are Wearing This Winter', source: 'Who What Wear', domain: 'whowhatwear.com', note: 'Try layering a slip or satin dress over trousers you own, and add a blazer to keep it grounded.', image: 'fitBlueCoat', publishedIso: '2026-11-08', readMin: 5 },
  { id: 'ar4', title: 'Reversible Jackets: Two Looks for the Price of One', source: 'Who What Wear', domain: 'whowhatwear.com', note: 'If you need a new coat, check the reversible options first, and make sure both sides work with what you already wear.', image: 'fitBrownLeather', publishedIso: '2026-11-07', readMin: 3 },
  { id: 'ar5', title: 'Why Brown Jeans Are Worth Wearing With Heels', source: 'Glamour', domain: 'glamour.com', note: 'Wear brown trousers or jeans with black shoes and a black belt for a simple, grown-up combination.', image: 'flatTrousers', publishedIso: '2026-11-07', readMin: 3 },
  { id: 'ar6', title: "The Best Men's Raincoats, Tested by GQ", source: 'GQ · Menswear', domain: 'gq.com', note: 'Before buying anything new, check that your current rain jacket fits well and add it to your outfit planning on wet days.', image: 'fitGreyJacket', publishedIso: '2026-11-06', readMin: 7, paywalled: true },
  { id: 'ar7', title: 'Athena Calderone on Leaning Into Holiday Glamour', source: 'Marie Claire', domain: 'marieclaire.com', note: 'Choose one shiny accent, like a silver hair pin or metallic shoes, to dress up a simple outfit for a party.', image: 'goldEarrings', publishedIso: '2026-11-06', readMin: 6 },
  { id: 'ar8', title: 'The Trench Coat Is Back (It Never Left)', source: 'Vogue', domain: 'vogue.com', note: 'A belted trench over a hoodie is the easiest way to make streetwear look finished on a rainy day.', image: 'fitPlaid', publishedIso: '2026-11-01', readMin: 4 },
  { id: 'ar9', title: 'How to Build a Capsule Wardrobe in 12 Pieces', source: 'Harper’s Bazaar', domain: 'harpersbazaar.com', note: 'Start with what you already reach for three times a week; the capsule is already half built.', image: 'rackNeutrals', publishedIso: '2026-11-01', readMin: 8 },
  { id: 'ar10', title: 'The Sneakers Fashion Editors Are Wearing to the Office', source: 'Refinery29', domain: 'refinery29.com', note: 'A clean white or tan sneaker reads as smart with tailored trousers; keep the laces fresh.', image: 'shoeTan', publishedIso: '2026-10-31', readMin: 3, broken: true },
  { id: 'ar11', title: 'Gold or Silver? A Stylist on Mixing Metals', source: 'InStyle', domain: 'instyle.com', note: 'If your season is warm, lead with gold and let one silver piece be the accent, never the other way around.', image: 'goldPendants', publishedIso: '2026-10-25', readMin: 4 },
  { id: 'ar12', title: 'Layering for a 40°F Morning That Turns Into a 60°F Afternoon', source: 'The Cut', domain: 'thecut.com', note: 'Three thin layers beat one thick one; the middle layer is the one that should look good on its own.', image: 'fitHoodie', publishedIso: '2026-10-25', readMin: 5 },
]

export const PRACTICE = {
  title: 'Putting it into practice',
  body: 'Start with your closet: pull out your jeans, a midi skirt if you have one, black boots, and any flats or loafers. Try three outfits: flats with your best jeans and a trench or cardigan, boots with the skirt and a cozy sweater, and a satin or slip dress layered over trousers with a blazer. If a coat is on your list, put your existing one through the same test before buying.',
}

export const articleById = (id: string) => ARTICLES.find((a) => a.id === id) ?? ARTICLES[0]

/* ── Onboarding questions ───────────────────────────────────── */
export type Question = { id: string; topic: string; prompt: string; options: { id: string; label: string; sub?: string; glyph?: string }[]; multi?: boolean; illustrated?: boolean }

export const QUESTIONS: Question[] = [
  { id: 'q-sections', topic: 'Sections', prompt: 'Which sections do you shop?', options: [{ id: 'womens', label: 'Womenswear' }, { id: 'mens', label: 'Menswear' }, { id: 'both', label: 'Both' }] },
  { id: 'q-body', topic: 'Body type', prompt: 'Which shape is closest to yours?', illustrated: true, options: [{ id: 'rect', label: 'Straight', glyph: 'M12 2h8v20h-8z' }, { id: 'hour', label: 'Hourglass', glyph: 'M10 2h12l-4 10 4 10H10l4-10z' }, { id: 'pear', label: 'Pear', glyph: 'M13 2h6l5 20H8z' }, { id: 'tri', label: 'Inverted triangle', glyph: 'M8 2h16l-5 20h-6z' }, { id: 'apple', label: 'Apple', glyph: 'M12 2h8l3 10-3 10h-8l-3-10z' }, { id: 'skip', label: 'Rather not say' }] },
  { id: 'q-height', topic: 'Height & fit', prompt: 'How tall are you, and how do you like things to fit?', options: [{ id: 'short-relaxed', label: 'Under 5′4″ · relaxed' }, { id: 'short-fitted', label: 'Under 5′4″ · fitted' }, { id: 'mid-relaxed', label: '5′4″–5′9″ · relaxed' }, { id: 'mid-fitted', label: '5′4″–5′9″ · fitted' }, { id: 'tall-relaxed', label: 'Over 5′9″ · relaxed' }, { id: 'tall-fitted', label: 'Over 5′9″ · fitted' }] },
  { id: 'q-occasions', topic: 'Occasions', prompt: 'What do you dress for most weeks?', multi: true, options: [{ id: 'work', label: 'Work' }, { id: 'casual', label: 'Casual days' }, { id: 'night', label: 'Nights out' }, { id: 'date', label: 'Dates' }, { id: 'gym', label: 'Gym & errands' }, { id: 'events', label: 'Weddings & events' }] },
  { id: 'q-budget', topic: 'Budget', prompt: 'When you buy a new piece, what do you usually spend?', options: [{ id: 'b1', label: 'Under $50' }, { id: 'b2', label: '$50–150' }, { id: 'b3', label: '$150–400' }, { id: 'b4', label: '$400+' }] },
  { id: 'q-colours', topic: 'Colours', prompt: 'Colours you love to wear', multi: true, options: [{ id: 'black', label: 'Black' }, { id: 'white', label: 'White & cream' }, { id: 'camel', label: 'Camel & tan' }, { id: 'olive', label: 'Olive' }, { id: 'burgundy', label: 'Burgundy' }, { id: 'navy', label: 'Navy' }, { id: 'pastel', label: 'Pastels' }, { id: 'brights', label: 'Brights' }] },
  { id: 'q-avoid', topic: 'Colours', prompt: 'Colours you avoid', multi: true, options: [{ id: 'neon', label: 'Neon' }, { id: 'pastel', label: 'Pastels' }, { id: 'orange', label: 'Orange' }, { id: 'pink', label: 'Pink' }, { id: 'yellow', label: 'Yellow' }, { id: 'none', label: 'Nothing, I wear it all' }] },
]

/* Maya's answers (stored per user, the basis for every analysis) */
export const MAYA_ANSWERS: Record<string, string[]> = {
  'q-sections': ['womens'],
  'q-body': ['hour'],
  'q-height': ['mid-relaxed'],
  'q-occasions': ['work', 'casual', 'night'],
  'q-budget': ['b2'],
  'q-colours': ['black', 'camel', 'burgundy', 'olive'],
  'q-avoid': ['neon', 'pastel'],
}

/* ── Swipe deck ──────────────────────────────────────────────── */
export type StyleTag = 'streetwear' | 'minimalist' | 'classic' | 'editorial' | 'romantic' | 'sporty' | 'bold' | 'preppy'
export type DeckCard = { id: string; image: MediaKey; tag: StyleTag; title: string; source: string; licence: string }

const L = 'Unsplash License'
export const DECK: DeckCard[] = [
  { id: 'd01', image: 'fitHoodie', tag: 'streetwear', title: 'Hoodie under denim', source: 'Unsplash', licence: L },
  { id: 'd02', image: 'fitBeige', tag: 'minimalist', title: 'Pale shirt, wide trousers', source: 'Unsplash', licence: L },
  { id: 'd03', image: 'fitNavySuit', tag: 'classic', title: 'Navy suit, soft tie', source: 'Unsplash', licence: L },
  { id: 'd04', image: 'fitStripes', tag: 'editorial', title: 'Striped wide-leg on teal', source: 'Unsplash', licence: L },
  { id: 'd05', image: 'fitFloral', tag: 'romantic', title: 'Floral dress by the sea', source: 'Unsplash', licence: L },
  { id: 'd06', image: 'fitRedTee', tag: 'sporty', title: 'Red tee, black jacket', source: 'Unsplash', licence: L },
  { id: 'd07', image: 'fitLeopard', tag: 'bold', title: 'Leopard shirt after dark', source: 'Unsplash', licence: L },
  { id: 'd08', image: 'fitRoundFrame', tag: 'preppy', title: 'Tan trousers, white sneakers', source: 'Unsplash', licence: L },
  { id: 'd09', image: 'fitYellow', tag: 'streetwear', title: 'Head-to-toe yellow', source: 'Unsplash', licence: L },
  { id: 'd10', image: 'fitTurtleneck', tag: 'minimalist', title: 'Black turtleneck, orange beanie', source: 'Unsplash', licence: L },
  { id: 'd11', image: 'fitWaistcoat', tag: 'classic', title: 'Waistcoat and tie', source: 'Unsplash', licence: L },
  { id: 'd12', image: 'fitNeon', tag: 'editorial', title: 'Neon pink and blue', source: 'Unsplash', licence: L },
  { id: 'd13', image: 'fitStairsWhite', tag: 'romantic', title: 'White off-shoulder dress', source: 'Unsplash', licence: L },
  { id: 'd14', image: 'fitPinkSweat', tag: 'streetwear', title: 'Pink sweatshirt, ripped jeans', source: 'Unsplash', licence: L },
  { id: 'd15', image: 'fitCheckSuit', tag: 'classic', title: 'Blue check three-piece', source: 'Unsplash', licence: L },
  { id: 'd16', image: 'fitAfro', tag: 'minimalist', title: 'All black, clean lines', source: 'Unsplash', licence: L },
  { id: 'd17', image: 'fitLeather', tag: 'bold', title: 'Black leather, brick wall', source: 'Unsplash', licence: L },
  { id: 'd18', image: 'fitSkeleTee', tag: 'streetwear', title: 'Graphic tee, light denim', source: 'Unsplash', licence: L },
  { id: 'd19', image: 'fitPuffer', tag: 'sporty', title: 'White puffer', source: 'Unsplash', licence: L },
  { id: 'd20', image: 'fitPolka', tag: 'romantic', title: 'Polka-dot dress', source: 'Unsplash', licence: L },
  { id: 'd21', image: 'fitRooftopBlack', tag: 'minimalist', title: 'Black tee, black jeans', source: 'Unsplash', licence: L },
  { id: 'd22', image: 'fitHat', tag: 'preppy', title: 'White knit, black hat', source: 'Unsplash', licence: L },
  { id: 'd23', image: 'fitPearls', tag: 'bold', title: 'Curls, shades and pearls', source: 'Unsplash', licence: L },
  { id: 'd24', image: 'fitTealJump', tag: 'editorial', title: 'Teal jumpsuit', source: 'Unsplash', licence: L },
]

export const TAG_LABEL: Record<StyleTag, string> = { streetwear: 'Streetwear', minimalist: 'Minimalist', classic: 'Classic', editorial: 'Editorial', romantic: 'Romantic', sporty: 'Sporty', bold: 'Bold', preppy: 'Preppy' }

/* Maya liked these in her onboarding (stored per user) */
export const MAYA_LIKES = ['d01', 'd02', 'd09', 'd10', 'd14', 'd16', 'd18', 'd21', 'd06', 'd19', 'd23']

/* ── Style profile ──────────────────────────────────────────── */
export const STYLE_PROFILE = {
  summary: 'You lean elevated streetwear: neutral tones, relaxed fits, one gold piece that does the talking.',
  archetype: 'Elevated streetwear',
  keywords: ['Relaxed fits', 'Neutral base', 'One statement layer', 'Clean sneakers', 'Gold accents'],
  likedTags: [
    { tag: 'streetwear' as StyleTag, n: 5 },
    { tag: 'minimalist' as StyleTag, n: 4 },
    { tag: 'sporty' as StyleTag, n: 2 },
    { tag: 'bold' as StyleTag, n: 1 },
  ],
  updatedIso: '2026-11-02',
}

/* ── Colour quiz ────────────────────────────────────────────── */
export const COLOUR_QUIZ: Question[] = [
  { id: 'c-veins', topic: 'Undertone', prompt: 'In daylight, the veins on your inner wrist look…', options: [{ id: 'blue', label: 'Blue or purple' }, { id: 'green', label: 'Green or olive' }, { id: 'mixed', label: 'Hard to tell, a mix' }] },
  { id: 'c-sun', topic: 'Undertone', prompt: 'When you spend time in the sun, your skin usually…', options: [{ id: 'burns', label: 'Burns first, then maybe tans' }, { id: 'tans', label: 'Tans easily, rarely burns' }, { id: 'both', label: 'A little of both' }] },
  { id: 'c-hair', topic: 'Contrast', prompt: 'Your natural hair colour is closest to…', options: [{ id: 'black', label: 'Black' }, { id: 'darkbrown', label: 'Dark brown' }, { id: 'lightbrown', label: 'Light brown' }, { id: 'blonde', label: 'Blonde' }, { id: 'red', label: 'Red or auburn' }, { id: 'grey', label: 'Grey or white' }] },
  { id: 'c-eyes', topic: 'Contrast', prompt: 'Your eyes are…', options: [{ id: 'darkbrown', label: 'Dark brown' }, { id: 'brown', label: 'Brown or hazel' }, { id: 'green', label: 'Green' }, { id: 'blue', label: 'Blue or grey' }] },
  { id: 'c-metal', topic: 'Metals', prompt: 'Which metal looks better against your skin?', options: [{ id: 'gold', label: 'Gold' }, { id: 'silver', label: 'Silver' }, { id: 'both', label: 'Both look fine' }] },
  { id: 'c-white', topic: 'Warmth', prompt: 'Which white suits you better?', options: [{ id: 'cream', label: 'Cream or ivory' }, { id: 'pure', label: 'Bright, pure white' }, { id: 'either', label: 'Either' }] },
  { id: 'c-compliments', topic: 'Depth', prompt: 'People compliment you most in…', options: [{ id: 'deep', label: 'Deep, rich colours' }, { id: 'soft', label: 'Soft, muted colours' }, { id: 'bright', label: 'Bright, clear colours' }, { id: 'unsure', label: 'Not sure' }] },
  { id: 'c-blush', topic: 'Warmth', prompt: 'Which blush or lip shade looks most natural on you?', options: [{ id: 'peach', label: 'Peach or coral' }, { id: 'pink', label: 'Pink or berry' }, { id: 'brick', label: 'Brick or terracotta' }] },
]

export const MAYA_COLOUR_ANSWERS: Record<string, string[]> = {
  'c-veins': ['green'],
  'c-sun': ['tans'],
  'c-hair': ['darkbrown'],
  'c-eyes': ['darkbrown'],
  'c-metal': ['gold'],
  'c-white': ['cream'],
  'c-compliments': ['deep'],
  'c-blush': ['brick'],
}

export type Season = { id: string; name: string; undertone: 'Warm' | 'Cool' | 'Neutral'; depth: string; metals: string[]; metalNote: string; palette: { hex: string; name: string }[]; avoid: { hex: string; name: string }[]; summary: string }

export const DEEP_AUTUMN: Season = {
  id: 'deep-autumn',
  name: 'Deep Autumn',
  undertone: 'Warm',
  depth: 'Deep and rich',
  metals: ['Gold', 'Bronze', 'Copper'],
  metalNote: 'Warm metals sit closest to your skin. Yellow gold first; bronze and copper for texture. Silver reads cold against a warm undertone, so keep it to one piece.',
  palette: [
    { hex: '#5B2A1E', name: 'Chocolate' },
    { hex: '#7A1F2B', name: 'Burgundy' },
    { hex: '#8A4B12', name: 'Rust' },
    { hex: '#A6651D', name: 'Caramel' },
    { hex: '#C78A2B', name: 'Mustard' },
    { hex: '#4A5A23', name: 'Olive' },
    { hex: '#1F4D3A', name: 'Forest' },
    { hex: '#0F3B4C', name: 'Deep teal' },
    { hex: '#2B2E6B', name: 'Ink navy' },
    { hex: '#5E2D5C', name: 'Aubergine' },
    { hex: '#B6412E', name: 'Tomato' },
    { hex: '#D9A066', name: 'Camel' },
    { hex: '#EADBC2', name: 'Cream' },
    { hex: '#1C1A17', name: 'Soft black' },
  ],
  avoid: [
    { hex: '#F4C2D1', name: 'Icy pink' },
    { hex: '#BFE3F2', name: 'Powder blue' },
    { hex: '#E4E4E8', name: 'Pure grey' },
    { hex: '#C8F542', name: 'Neon lime' },
  ],
  summary: 'Deep Autumn: warm undertone with depth. Rich, earthy colours with weight suit you best; pale, icy shades wash you out. Lead with gold.',
}

export const SEASONS_SHORT = ['Light Spring', 'Warm Spring', 'Bright Spring', 'Light Summer', 'Cool Summer', 'Soft Summer', 'Soft Autumn', 'Warm Autumn', 'Deep Autumn', 'Deep Winter', 'Cool Winter', 'Bright Winter']

/* ── Occasions ──────────────────────────────────────────────── */
export type Occasion = 'Work' | 'Casual' | 'Date' | 'Night out' | 'Wedding / event' | 'Interview' | 'Travel' | 'Other'
export const OCCASIONS: Occasion[] = ['Work', 'Casual', 'Date', 'Night out', 'Wedding / event', 'Interview', 'Travel', 'Other']
