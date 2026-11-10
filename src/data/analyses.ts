import type { SubScores } from '../components/Brand'
import type { Occasion } from './content'
import type { MediaKey } from './media'

/* Maya's analyses. The current one (a-today) is the scan she makes in the
   demo; the rest is her history since she joined on 3 Mar 2026. Every
   analysis is stored with its tags, occasion, weather and helpfulness
   rating (brief §7.1). Two rows are not scores: a refusal and a failure,
   logged without the image, counting toward the daily limit (§5.2). */

export type Tip = { id: string; text: string; item: string; colours: string[]; material?: string; fit?: string; priority: 'high' | 'medium' | 'low' }
export type Weather = { tempF: number; summary: string; windMph: number; rainPct: number; city: string }
export type Analysis = {
  id: string
  dateIso: string
  time: string
  minutesAgo: number
  photo?: MediaKey
  photoDeleted?: boolean
  state: 'scored' | 'refused' | 'failed'
  failReason?: string
  overall: number
  sub: SubScores
  occasion?: Occasion
  weather?: Weather
  tags: string[]
  title: string
  positives: string[]
  negatives: string[]
  tips: Tip[]
  helpfulness?: number
  comment?: string
  country: 'US'
}

const W: Weather = { tempF: 41, summary: 'Light rain', windMph: 14, rainPct: 70, city: 'Chicago, IL' }

export const TODAY: Analysis = {
  id: 'a-today',
  dateIso: '2026-11-10',
  time: '08:14',
  minutesAgo: 0,
  photo: 'fitWorkCoat',
  state: 'scored',
  overall: 84,
  sub: { fit: 88, colour: 91, cohesion: 82, occasion: 74 },
  occasion: 'Work',
  weather: W,
  tags: ['wool coat', 'burgundy', 'tonal layering', 'sunglasses', 'tote'],
  title: 'Burgundy wool coat, camel knit, black trousers',
  positives: [
    'Burgundy is squarely in your Deep Autumn palette; it warms your skin instead of fighting it.',
    'The coat length hits mid-thigh, which balances your proportions and keeps the line long.',
    'Camel under burgundy is tonal layering done right: two warm neighbours, no clash.',
    'The black trouser grounds the look and keeps it work-ready rather than weekend.',
  ],
  negatives: [
    'With 70% rain forecast, the wool shoulders will soak through by the second block. A layer that sheds water would keep the look intact.',
    'The tote and sunglasses push this toward “shopping day”; at work the bag reads a little casual.',
    'The shoe is hidden, so the fit score assumes a closed, flat shoe. A boot would lift Occasion.',
  ],
  tips: [
    { id: 't1', text: 'Swap in a black ankle boot with a low block heel. It handles the rain and takes the outfit from 74 to the high 80s on Occasion.', item: 'Shoes', colours: ['Black'], material: 'Leather', fit: 'Ankle', priority: 'high' },
    { id: 't2', text: 'Add one gold piece near the face: a thin chain or small hoops. Your season leads with gold, and the coat collar is waiting for it.', item: 'Jewellery', colours: ['Gold'], material: 'Gold', priority: 'high' },
    { id: 't3', text: 'Carry a structured black bag instead of the tote for work days; keep the tote for weekends.', item: 'Bag', colours: ['Black'], material: 'Leather', fit: 'Structured', priority: 'medium' },
    { id: 't4', text: 'A cream scarf tucked under the collar adds a third tone and keeps the wind off on a 14 mph morning.', item: 'Scarf', colours: ['Cream'], material: 'Wool', priority: 'low' },
  ],
  country: 'US',
}

export const HISTORY: Analysis[] = [
  TODAY,
  { id: 'a2', dateIso: '2026-11-08', time: '19:40', minutesAgo: 60 * 36 + 34, photo: 'fitYellow', state: 'scored', overall: 72, sub: { fit: 80, colour: 61, cohesion: 78, occasion: 69 }, occasion: 'Night out', weather: { tempF: 48, summary: 'Clear', windMph: 8, rainPct: 0, city: 'Chicago, IL' }, tags: ['tracksuit', 'monochrome', 'white boot'], title: 'Yellow tracksuit, white boots', positives: ['Head-to-toe one colour is a confident move and the proportions work.', 'The white boot breaks the block exactly where it should.'], negatives: ['Bright yellow is outside your Deep Autumn palette; a mustard or ochre version would do the same thing and flatter more.', 'For a night out the fabric reads sporty; one sharper layer would lift it.'], tips: [{ id: 'a2t1', text: 'Try the same shape in mustard or ochre.', item: 'Tracksuit', colours: ['Mustard', 'Ochre'], priority: 'high' }, { id: 'a2t2', text: 'Add a black leather jacket over the top for the evening.', item: 'Jacket', colours: ['Black'], material: 'Leather', priority: 'medium' }, { id: 'a2t3', text: 'Gold hoops to tie the yellow back to your season.', item: 'Jewellery', colours: ['Gold'], priority: 'low' }], helpfulness: 4, comment: 'Fair, the yellow was a risk.', country: 'US' },
  { id: 'a3', dateIso: '2026-11-05', time: '07:52', minutesAgo: 60 * 24 * 5, photo: 'fitPlaid', state: 'scored', overall: 89, sub: { fit: 90, colour: 88, cohesion: 92, occasion: 86 }, occasion: 'Work', weather: { tempF: 44, summary: 'Overcast', windMph: 11, rainPct: 20, city: 'Chicago, IL' }, tags: ['plaid coat', 'long line', 'black base'], title: 'Long plaid coat over black', positives: ['The long coat over an all-black base is your strongest formula so far.', 'The plaid’s rust thread sits in your palette.'], negatives: ['The hem skims the ankle; with the flat shoe it shortens the leg a touch.'], tips: [{ id: 'a3t1', text: 'A boot with a 1–2 inch heel restores the line under a long coat.', item: 'Shoes', colours: ['Black'], fit: 'Heeled boot', priority: 'medium' }, { id: 'a3t2', text: 'Keep the bag small so the coat stays the statement.', item: 'Bag', colours: ['Black', 'Chocolate'], priority: 'low' }, { id: 'a3t3', text: 'A gold watch or cuff at the wrist, the only place the coat leaves open.', item: 'Jewellery', colours: ['Gold'], priority: 'low' }], helpfulness: 5, country: 'US' },
  { id: 'a4', dateIso: '2026-11-02', time: '12:10', minutesAgo: 60 * 24 * 8, photo: 'fitRedSweater', state: 'scored', overall: 78, sub: { fit: 82, colour: 84, cohesion: 72, occasion: 75 }, occasion: 'Casual', weather: { tempF: 52, summary: 'Sunny', windMph: 6, rainPct: 0, city: 'Chicago, IL' }, tags: ['red knit', 'light denim', 'quilted bag'], title: 'Red knit, light-wash jeans', positives: ['Tomato red is one of your best brights.', 'The oversized knit with a straight jean is the relaxed fit you told us you like.'], negatives: ['Light-wash denim lightens the whole look; a mid or dark wash keeps the depth your season wants.', 'The quilted bag’s silver chain fights the red; gold hardware would sit better.'], tips: [{ id: 'a4t1', text: 'Swap to a dark-wash straight jean.', item: 'Jeans', colours: ['Dark indigo'], material: 'Denim', fit: 'Straight', priority: 'high' }, { id: 'a4t2', text: 'Choose a bag with gold hardware.', item: 'Bag', colours: ['Black', 'Chocolate'], priority: 'medium' }, { id: 'a4t3', text: 'A tan boot would echo the warmth of the red.', item: 'Shoes', colours: ['Tan'], material: 'Suede', priority: 'low' }], helpfulness: 4, country: 'US' },
  { id: 'a5', dateIso: '2026-10-29', time: '18:05', minutesAgo: 60 * 24 * 12, photo: 'fitKnit', state: 'scored', overall: 81, sub: { fit: 79, colour: 76, cohesion: 88, occasion: 83 }, occasion: 'Date', weather: { tempF: 55, summary: 'Clear', windMph: 9, rainPct: 10, city: 'Chicago, IL' }, tags: ['off-shoulder knit', 'black trouser'], title: 'Grey off-shoulder knit, black trousers', positives: ['The off-shoulder neckline is the one detail that makes this a date outfit, and it is enough.', 'Black trousers with a tapered leg: clean.'], negatives: ['Cool grey is a borderline colour for you; a warm taupe or camel knit would do more for your skin.'], tips: [{ id: 'a5t1', text: 'Look for the same knit in taupe, camel or chocolate.', item: 'Knit', colours: ['Taupe', 'Camel', 'Chocolate'], material: 'Wool blend', priority: 'high' }, { id: 'a5t2', text: 'A pointed black flat sharpens the trouser.', item: 'Shoes', colours: ['Black'], fit: 'Pointed flat', priority: 'medium' }, { id: 'a5t3', text: 'One gold pendant on the bare collarbone.', item: 'Jewellery', colours: ['Gold'], priority: 'medium' }], helpfulness: 5, comment: 'Bought the camel one.', country: 'US' },
  { id: 'a6', dateIso: '2026-10-24', time: '09:31', minutesAgo: 60 * 24 * 17, state: 'refused', failReason: 'Photo not analysed: the image did not pass our content check. It was not stored. This counts toward today’s limit.', overall: 0, sub: { fit: 0, colour: 0, cohesion: 0, occasion: 0 }, tags: [], title: 'Not analysed', positives: [], negatives: [], tips: [], country: 'US' },
  { id: 'a7', dateIso: '2026-10-21', time: '07:48', minutesAgo: 60 * 24 * 20, photo: 'fitBlueCoat', state: 'scored', overall: 86, sub: { fit: 87, colour: 79, cohesion: 90, occasion: 88 }, occasion: 'Travel', weather: { tempF: 58, summary: 'Partly cloudy', windMph: 7, rainPct: 10, city: 'Milan, IT' }, tags: ['pale blue coat', 'crossbody', 'white sneaker'], title: 'Pale blue coat, crossbody, white sneakers', positives: ['Coat, bag and sneaker all talk to each other: the cohesion score shows it.', 'A crossbody is the right bag for a travel day and it keeps the line clean.'], negatives: ['Pale blue is on the cool side for you; a camel or olive coat in the same cut would score higher on Colour.'], tips: [{ id: 'a7t1', text: 'Same coat silhouette in camel for the next trip.', item: 'Coat', colours: ['Camel', 'Olive'], material: 'Wool', fit: 'Straight, mid-thigh', priority: 'medium' }, { id: 'a7t2', text: 'Gold-tone hardware on the bag strap.', item: 'Bag', colours: ['Tan'], priority: 'low' }, { id: 'a7t3', text: 'A cream scarf to warm the blue toward your palette.', item: 'Scarf', colours: ['Cream'], priority: 'low' }], helpfulness: 5, country: 'US' },
  { id: 'a8', dateIso: '2026-10-18', time: '20:22', minutesAgo: 60 * 24 * 23, photo: 'fitTealJump', state: 'scored', overall: 77, sub: { fit: 74, colour: 86, cohesion: 80, occasion: 68 }, occasion: 'Night out', weather: { tempF: 50, summary: 'Clear', windMph: 12, rainPct: 0, city: 'Chicago, IL' }, tags: ['jumpsuit', 'deep teal', 'halter'], title: 'Deep teal halter jumpsuit', positives: ['Deep teal is a Deep Autumn colour and it shows.', 'The halter opens the shoulder and the wide leg balances it.'], negatives: ['The waist sits slightly high for your proportions; a belt would place it.', 'Without a jacket this reads summer; for an October night a cropped leather layer keeps it.'], tips: [{ id: 'a8t1', text: 'A thin gold or chocolate belt at the natural waist.', item: 'Belt', colours: ['Gold', 'Chocolate'], material: 'Leather', priority: 'high' }, { id: 'a8t2', text: 'Cropped black leather jacket on top.', item: 'Jacket', colours: ['Black'], material: 'Leather', fit: 'Cropped', priority: 'medium' }, { id: 'a8t3', text: 'Gold drop earrings to carry the warmth up.', item: 'Jewellery', colours: ['Gold'], priority: 'low' }], helpfulness: 3, country: 'US' },
  { id: 'a9', dateIso: '2026-10-12', time: '08:03', minutesAgo: 60 * 24 * 29, state: 'failed', failReason: 'Outfit not fully visible: the photo stopped at the knee. Step back so the full body fits the guide, then try again. This did not count toward your limit.', overall: 0, sub: { fit: 0, colour: 0, cohesion: 0, occasion: 0 }, tags: [], title: 'Not analysed', positives: [], negatives: [], tips: [], country: 'US' },
  { id: 'a10', dateIso: '2026-10-04', time: '15:45', minutesAgo: 60 * 24 * 37, photo: 'fitStairsWhite', state: 'scored', overall: 83, sub: { fit: 84, colour: 72, cohesion: 90, occasion: 86 }, occasion: 'Wedding / event', weather: { tempF: 66, summary: 'Sunny', windMph: 5, rainPct: 0, city: 'Nashville, TN' }, tags: ['white dress', 'off-shoulder', 'ruffle'], title: 'White off-shoulder dress', positives: ['Simple shape, one detail, nothing competing: the cohesion is excellent.', 'The length is right for a daytime wedding.'], negatives: ['Pure white is the one white to be careful with for your season; ivory or cream would be gentler.', 'No jewellery at all leaves the neckline a little bare for an event.'], tips: [{ id: 'a10t1', text: 'Choose ivory or cream over optic white.', item: 'Dress', colours: ['Ivory', 'Cream'], priority: 'high' }, { id: 'a10t2', text: 'A gold chain and small studs for the event.', item: 'Jewellery', colours: ['Gold'], priority: 'high' }, { id: 'a10t3', text: 'A tan or bronze heeled sandal.', item: 'Shoes', colours: ['Tan', 'Bronze'], priority: 'medium' }], helpfulness: 5, country: 'US' },
  { id: 'a11', dateIso: '2026-09-20', time: '07:58', minutesAgo: 60 * 24 * 51, photo: 'fitHoodie', state: 'scored', overall: 75, sub: { fit: 78, colour: 70, cohesion: 76, occasion: 76 }, occasion: 'Casual', weather: { tempF: 61, summary: 'Overcast', windMph: 10, rainPct: 30, city: 'Chicago, IL' }, tags: ['hoodie', 'denim jacket', 'layering'], title: 'Grey hoodie under a denim jacket', positives: ['Hoodie under denim is your signature layer and it fits well.', 'Both layers sit at the hip; the proportions are tidy.'], negatives: ['Grey and mid-blue together are cool tones; a chocolate or olive hoodie would warm the whole look.'], tips: [{ id: 'a11t1', text: 'Swap the grey hoodie for olive or chocolate.', item: 'Hoodie', colours: ['Olive', 'Chocolate'], material: 'Cotton fleece', fit: 'Relaxed', priority: 'high' }, { id: 'a11t2', text: 'Darker denim jacket for depth.', item: 'Jacket', colours: ['Dark indigo'], material: 'Denim', priority: 'medium' }, { id: 'a11t3', text: 'Tan sneaker to add warmth at the base.', item: 'Shoes', colours: ['Tan'], priority: 'low' }], helpfulness: 4, country: 'US' },
  { id: 'a12', dateIso: '2026-08-30', time: '18:30', minutesAgo: 60 * 24 * 72, photo: 'fitRedRocks', state: 'scored', overall: 80, sub: { fit: 83, colour: 85, cohesion: 76, occasion: 77 }, occasion: 'Casual', weather: { tempF: 79, summary: 'Sunny', windMph: 9, rainPct: 0, city: 'Chicago, IL' }, tags: ['red top', 'jeans', 'coastal'], title: 'Red top, straight jeans', positives: ['Red with a straight jean is a simple pairing that flatters you.'], negatives: ['The jean wash is a touch light; a darker one deepens the look.'], tips: [{ id: 'a12t1', text: 'Dark-wash jean.', item: 'Jeans', colours: ['Dark indigo'], material: 'Denim', priority: 'medium' }, { id: 'a12t2', text: 'Gold hoops.', item: 'Jewellery', colours: ['Gold'], priority: 'low' }, { id: 'a12t3', text: 'Tan sandal.', item: 'Shoes', colours: ['Tan'], priority: 'low' }], helpfulness: 4, country: 'US' },
  { id: 'a13', dateIso: '2026-03-08', time: '08:20', minutesAgo: 60 * 24 * 247, photoDeleted: false, photo: 'fitWhiteJacket', state: 'scored', overall: 71, sub: { fit: 76, colour: 64, cohesion: 72, occasion: 72 }, occasion: 'Work', weather: { tempF: 38, summary: 'Cloudy', windMph: 16, rainPct: 20, city: 'Chicago, IL' }, tags: ['white jacket', 'first scan'], title: 'White jacket, black base (your first scan)', positives: ['A clean two-tone base.'], negatives: ['Optic white against black is high contrast and cool; your season prefers cream against chocolate.'], tips: [{ id: 'a13t1', text: 'Cream jacket instead of optic white.', item: 'Jacket', colours: ['Cream'], priority: 'high' }, { id: 'a13t2', text: 'Chocolate trousers for a warmer base.', item: 'Trousers', colours: ['Chocolate'], priority: 'medium' }, { id: 'a13t3', text: 'Gold studs.', item: 'Jewellery', colours: ['Gold'], priority: 'low' }], helpfulness: 3, country: 'US' },
]

export const analysisById = (id: string) => HISTORY.find((a) => a.id === id) ?? TODAY
export const SCORED = HISTORY.filter((a) => a.state === 'scored')
export const LAST_BEFORE_TODAY = HISTORY.find((a) => a.id !== 'a-today' && a.state === 'scored')!
/** the score trend, oldest first */
export const TREND = [...SCORED].reverse().map((a) => a.overall)
export const AVG_SCORE = Math.round(SCORED.reduce((s, a) => s + a.overall, 0) / SCORED.length)
export const BEST = SCORED.reduce((b, a) => (a.overall > b.overall ? a : b), SCORED[0])

/* Today's allowance (brief §7.2: 10 per day). Before the demo scan Maya has used 3. */
export const ALLOWANCE = { daily: 10, usedBefore: 3, hourly: 30, resetsIn: '15h 46m' }
