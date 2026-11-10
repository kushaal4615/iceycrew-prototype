/* Photography. Unsplash IDs (unsplash.com/license), hotlinked through
   images.unsplash.com. Every ID below was fetched on 10 Nov 2026 (HTTP 200)
   and looked at on a contact sheet for subject before being kept. People
   are stock models standing in for fictional members; no real person is
   presented as a customer. The swipe deck in the real build is a licensed
   starter set with a source-and-licence list (brief §4); these stand in
   for it in the demo. */

export const photo = (id: string, w = 800, extra = '') =>
  `https://images.unsplash.com/photo-${id}?w=${w}&q=80&auto=format&fit=crop${extra}`

const UNSPLASH = {
  /* Maya and the cast */
  maya: '1548142813-c348350df52b', // laughing woman, dark hair, leopard top, palms: Maya Delgado, the member
  hazel: '1580489944761-15a19d654956', // woman, hair up, white tee: Hazel, IceyCrew admin
  /* outfit scans and the swipe deck (full-body and three-quarter looks) */
  fitWorkCoat: '1483985988355-763728e1935b', // woman in a burgundy coat, sunglasses, shopping bags: today's scan
  fitYellow: '1515886657613-9f3515b0c78f', // all-yellow tracksuit, white boots, basketball court
  fitBlueCoat: '1539109136881-3be0616acf4b', // woman in a light blue coat and bag at the Duomo
  fitRedSweater: '1511511450040-677116ff389e', // red knit, jeans, quilted bag
  fitKnit: '1485231183945-fffde7cc051e', // grey off-shoulder knit, black trousers, shutter
  fitPlaid: '1485968579580-b6d095142e6e', // long plaid coat on a city pavement
  fitStairsWhite: '1515372039744-b8f02a3ae446', // white off-shoulder dress on stairs
  fitTealJump: '1495385794356-15371f348c31', // teal jumpsuit, hands on hips
  fitPolka: '1502716119720-b23a93e5fe1b', // burgundy polka-dot dress, dunes
  fitSkeleTee: '1503342217505-b0a15ec3261c', // black skeleton tee, light jeans, pink wall
  fitRooftopBlack: '1503341960582-b45751874cf0', // all-black tee and jeans on a rooftop
  fitStripes: '1509631179647-0177331693ae', // striped wide-leg trousers on teal
  fitRedRocks: '1514315384763-ba401779410f', // red top and jeans on coastal rocks
  fitWaistcoat: '1504593811423-6dd665756598', // man in waistcoat, tie and glasses outside a pub
  fitNeon: '1512646605205-78422b7c7896', // woman in pink and blue neon light
  fitPinkSweat: '1516826957135-700dedea698c', // pink sweatshirt and ripped jeans against a skip
  fitSuit: '1519085360753-af0119f7cbe7', // man in a dark suit, arms crossed
  fitLeather: '1520975954732-35dd22299614', // black leather jacket, sunglasses, brick wall
  fitHoodie: '1517841905240-472988babdf9', // grey hoodie under a denim jacket, blue wall
  fitTurtleneck: '1521119989659-a83eee488004', // black turtleneck and orange beanie, rooftop
  fitBeige: '1517445312882-bc9910d016b7', // pale blue shirt tucked into wide beige trousers
  fitRedTee: '1529139574466-a303027c1d8b', // red tee under a black jacket, sunglasses, flower
  fitNavySuit: '1534030347209-467a5b0ad3e6', // navy suit and tie in a glass tunnel
  fitLeopard: '1536766820879-059fec98ec0a', // leopard shirt and sunglasses, dark
  fitHat: '1543087903-1ac2ec7aa8c5', // white sweater and black hat, yellow wall
  fitRuffle: '1554412933-514a83d2f3c8', // black ruffle coat and wide hat, red arrow
  fitPuffer: '1589156191108-c762ff4b96ab', // white puffer jacket, red arrow
  fitCheckSuit: '1594938298603-c8148c4dae35', // blue check three-piece suit
  fitWhiteJacket: '1589156280159-27698a70f29e', // white jacket, city at dusk
  fitAfro: '1632765854612-9b02b6ec2b15', // black jacket, afro, grey studio
  fitFloral: '1496747611176-843222e1e57c', // floral dress by the sea
  fitBrownLeather: '1487222477894-8943e31ef7b2', // brown leather jacket and round sunglasses
  fitRoundFrame: '1488161628813-04466f872be2', // man seated in a round frame, tan trousers
  fitGreyJacket: '1521341957697-b93449760f30', // man in a grey jacket, hand in hair
  fitPearls: '1519345182560-3f2917c472ef', // man with long curls, sunglasses and pearls
  fitSleeveless: '1503443207922-dff7d543fd0e', // sleeveless tee, arms crossed, white wall
  fitBlueShirtTie: '1500648767791-00dcc994a43e', // man in a grey sweater over a shirt
  /* wardrobe, flat lays, shoes, bags */
  flatTee: '1467043237213-65f2da53396f', // white tee, grey jeans, brown boots flat lay
  flatTrousers: '1544441893-675973e31985', // grey trousers, white sneakers, watch flat lay
  rackTees: '1489987707025-afc232f7ea0f', // tees in red, yellow and brown on a rail
  rackNeutrals: '1558769132-cb1aea458c5e', // neutral knits and coats on a wooden rail
  rackSage: '1523381210434-271e8be1f52b', // sage shirts on wooden hangers
  rackStore: '1441986300917-64674bd600d8', // menswear store shelves
  rackDark: '1445205170230-053b83016050', // clothes rail in a dark shop window
  rackTieDye: '1601924994987-69e26d50dc26', // tie-dye jackets on a rail
  poncho: '1434389677669-e08b4cac3105', // cream poncho on a hanger
  shoeTan: '1549298916-b41d501d3772', // tan Air Force 1 on mustard fabric
  shoeRed: '1542291026-7eec264c27ff', // red Nike runner
  shoeVans: '1525966222134-fcfa99b8ae77', // burgundy Vans on yellow
  shoeJordan: '1556906781-9a412961c28c', // Jordans, feet up on a railing
  shoeGrey: '1460353581641-37baddab0fa2', // grey Nike, close
  shoeBlack: '1491553895911-0055eca6402d', // black Nike on white
  heelFloral: '1543163521-1bf539c55dd2', // floral heel on a blue plinth
  heelNavy: '1515347619252-60a4bf4fff4f', // navy suede heels held by the straps
  bagRed: '1584917865442-de89df76afd3', // red top-handle bag
  bagWhite: '1506152983158-b4a74a01c721', // white shoulder bag on linen
  tying: '1483721310020-03333e577078', // man tying an orange running shoe on the street
  /* jewellery: IceyCrew's own world */
  goldPendants: '1506630448388-4e683c67ddb0', // gold pendants on chains
  pearls: '1515562141207-7a88fb7ce338', // pearl necklace in a box
  goldEarrings: '1535556116002-6281ff3e9f36', // gold hoop earrings on paper
  sapphireEarrings: '1535632066927-ab7c9ab60908', // sapphire and diamond earrings on a leaf
  diamondBracelet: '1573408301185-9146fe634ad0', // diamond tennis bracelet on black
  heartPendant: '1588444837495-c6cfeb53f32d', // diamond heart pendant
  pendant: '1589128777073-263566ae5e4d', // cushion diamond pendant
  goldChainBracelet: '1602173574767-37ac01994b2a', // gold chain bracelet on a magazine
  ring: '1605100804763-247f67b3557e', // halo diamond ring, dark
  pendantWorn: '1611085583191-a3b181a88401', // gold pearl pendant on a white shirt
  goldHoops: '1617038220319-276d3cfab638', // gold earrings in shadow
  goldNecklace: '1599643478518-a784e5dc4c8f', // gold pendant necklace, warm
  /* textures */
  bubbles: '1550684848-fac1c5b4e853', // oil-and-water colour bubbles
  coral: '1560393464-5c69a73c5770', // coral goblet on coral
  makeup: '1522335789203-aabd1fc54bc9', // makeup flat lay
  /* members, staff and reviewers (stock faces) */
  jordan: '1463453091185-61582044d556', // man in a striped tee by graffiti
  priya: '1479936343636-73cdc5aae0c3', // woman in a white tee, sunlit street
  marcus: '1480429370139-e0132c086e2a', // man in a pinstripe double-breasted suit
  theo: '1456327102063-fb5054efe647', // man with a fade, profile
  chloe: '1469334031218-e382a71b716b', // woman with round sunglasses, yellow wall
  luca: '1480455624313-e29b44bbfde1', // bearded man in a burgundy sweater
  nina: '1489424731084-a5d8b219a5bb', // red-haired woman laughing
  dev: '1492562080023-ab3db95bfbce', // man in a black jacket, field
  amara: '1502685104226-ee32379fefbe', // laughing woman with red curls
  elena: '1494790108377-be9c29b29330', // laughing woman in red
  sam: '1500648767791-00dcc994a43e', // man in a grey sweater
  layla: '1488426862026-3ee34a7d66df', // woman in a denim jacket, pink wall
  noah: '1506794778202-cad84cf45f1d', // man in a shawl collar sweater
  kai: '1507003211169-0a1dd7228f2d', // man in a white tee, smiling
  grace: '1508214751196-bcfd4ca60f91', // woman with blonde hair at sunset
  omar: '1506277886164-e25aa3f4ef7f', // man in a green football jersey
  ava: '1509967419530-da38b4704bc6', // woman with straight auburn hair
  zoe: '1519699047748-de8e457a634e', // woman with an afro, pink
  isla: '1524504388940-b1c1722653e1', // woman with blonde waves, dark
  ben: '1522529599102-193c0d76b5b6', // smiling man in a grey tee
  ruth: '1531123897727-8f129e1688ce', // woman in a patterned collar
  mila: '1524250502761-1ac6f2e30d43', // blonde woman turning, sunlight
  june: '1534528741775-53994a69daeb', // woman in blue light
  harper: '1525134479668-1bee5c7c6845', // smiling woman in a denim jacket, field
  nia: '1530785602389-07594beb8b73', // smiling woman in a headwrap
  andre: '1531384441138-2736e62e0919', // man in a beret with a camera
  kofi: '1531901599143-df5010ab9438', // man in sunglasses, black and white
  sofia: '1529626455594-4ff0802cfb7e', // woman with long dark hair, blue frame
  leo: '1539571696357-5a69c17a67c6', // young man in a black hat
  rafael: '1544723795-3fb6469f5b39', // man in a cap and yellow tee
  ethan: '1552374196-c4e7ffc6e126', // man with long hair, white tee
  gus: '1552058544-f2b08422138a', // bearded man, black and white
  freya: '1554151228-14d9def656e4', // woman with freckles, hand on cheek
  tessa: '1573496359142-b8d87734a5a2', // woman in a grey blazer
  victor: '1560250097-0b93528c311a', // man with glasses and blazer
  rosa: '1567532939604-b6b5b0db2604', // woman with long dark hair, grey wall
  felix: '1570295999919-56ceb5ecca61', // man in a blue sweater
  oliver: '1568602471122-7832951cc4c5', // man with glasses and a floral shirt
  dana: '1573497019940-1c28c88b4f3e', // woman with curly hair and a striped blazer
  miles: '1566492031773-4f4e44671857', // man with glasses, striped tee
  jonah: '1611695434369-a8f5d76ceb7b', // laughing man in a blue tee
  bea: '1599566150163-29194dcaad36', // man with glasses, white tee, green wall
  hana: '1623717217554-72ca676de535', // laughing woman by the sea
  cara: '1662850886700-4ec19bd30d11', // woman with curly hair, green tee
  arlo: '1633332755192-727a05c4013d', // man with glasses, black tee
  evan: '1472099645785-5658abf4ff4e', // older man with glasses, green polo
  pat: '1543610892-0b1f7e6d8ac1', // man in a beanie and glasses
} as const

export const MEDIA = UNSPLASH
export type MediaKey = keyof typeof MEDIA

export const img = (key: MediaKey, w = 800) => photo(MEDIA[key], w)
export const face = (key: MediaKey, w = 160) => photo(MEDIA[key], w, `&h=${w}&crop=faces`)
