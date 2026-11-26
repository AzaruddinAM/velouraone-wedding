import { WebsiteEvent, WebsiteTemplate } from '../core/models/wedding-template.model';
import { FONT, WORDING } from './design-tokens';
import { NIKAH_WEBSITES } from './nikah-websites.data';
import { NIKAH_3D_WEBSITES } from './nikah-3d-websites.data';
import { JOURNEY_3D_WEBSITES } from './journey-3d-websites.data';
import { INVITE_WEBSITES, STATIONERY_WEBSITES } from './invite-websites.data';
import { assignSectionLooks } from './section-looks';
import { VENUE_3D_WEBSITES } from './venue-3d-websites.data';
import { REALISTIC_3D_WEBSITES } from './realistic-3d-websites.data';

/* ------------------------------------------------------------------ */
/*  Default schedule per ceremony style                                */
/* ------------------------------------------------------------------ */
const EVENTS = {
  hindu: [
    { name: 'Mehendi & Sangeet', dayOffset: -1, time: '18:00' },
    { name: 'Wedding Muhurtham', dayOffset: 0, time: '' },
    { name: 'Reception', dayOffset: 0, time: '19:00' },
  ],
  kerala: [
    { name: 'Haldi', dayOffset: -1, time: '10:00' },
    { name: 'Thalikettu (Wedding)', dayOffset: 0, time: '' },
    { name: 'Reception', dayOffset: 0, time: '18:30' },
  ],
  christian: [
    { name: 'Holy Matrimony', dayOffset: 0, time: '' },
    { name: 'Cake & Toast', dayOffset: 0, time: '13:00' },
    { name: 'Reception Dinner', dayOffset: 0, time: '18:30' },
  ],
  nikah: [
    { name: 'Mehendi Night', dayOffset: -1, time: '19:00' },
    { name: 'Nikah', dayOffset: 0, time: '' },
    { name: 'Walima', dayOffset: 1, time: '19:00' },
  ],
  general: [
    { name: 'Welcome Party', dayOffset: -1, time: '19:00' },
    { name: 'Wedding Ceremony', dayOffset: 0, time: '' },
    { name: 'Reception', dayOffset: 0, time: '19:30' },
  ],
} satisfies Record<string, WebsiteEvent[]>;

type WebsiteInput = Omit<WebsiteTemplate, 'kind' | 'id' | 'code' | 'name' | 'style' | 'slug' | 'supportsPhoto'>;

/** Builds the W-numbered website identity (`W7 Wedding Website`, `w7-the-wedding-issue`, …). */
function defineWebsite(number: number, style: string, input: WebsiteInput): WebsiteTemplate {
  const kebab = style.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  return {
    kind: 'website',
    id: `w${number}`,
    code: `W${number}`,
    name: `W${number} Wedding Website`,
    style,
    slug: `w${number}-${kebab}`,
    supportsPhoto: true,
    ...input,
  };
}

/* ------------------------------------------------------------------ */
/*  Websites                                                           */
/* ------------------------------------------------------------------ */
/** Every website gets its own look below the first screen – see section-looks.ts. */
export const WEDDING_WEBSITES: readonly WebsiteTemplate[] = assignSectionLooks([
  defineWebsite(1, 'Royal Palace', {
    description: 'Velvet maroon curtains part to reveal your names under a golden mandala – a palace welcome for every guest.',
    category: 'royal', hero: 'curtain', sectionStyle: 'classic', motif: 'mandala', popular: true,
    theme: { bg: '#4f0d1b', surface: '#62142a', ink: '#f6e7cf', primary: '#f3cf7a', accent: '#d4a64a', soft: '#e3c49c', fontScript: FONT.greatVibes, fontHeading: FONT.cinzel, fontBody: FONT.cormorant, pattern: 'damask' },
    wording: WORDING.hindu, events: EVENTS.hindu, tags: ['maroon', 'gold', 'curtains'],
  }),
  defineWebsite(2, 'Blush Garden', {
    description: 'Soft blush roses frame a dreamy, airy website with rounded cards and gentle script.',
    category: 'floral', hero: 'floral', sectionStyle: 'cards', motif: 'rose', popular: true,
    theme: { bg: '#fdf7f3', surface: '#f8e9e6', ink: '#5b4a46', primary: '#b9636b', accent: '#e3a3a6', soft: '#8f7d78', fontScript: FONT.parisienne, fontHeading: FONT.cormorant, fontBody: FONT.lora, pattern: 'paper' },
    wording: WORDING.general, events: EVENTS.general, tags: ['pastel', 'roses', 'romantic'],
  }),
  defineWebsite(3, 'Gatsby Gala', {
    description: 'Black and gold art deco with a spinning monogram seal and magazine-style sections.',
    category: 'vintage', hero: 'seal', sectionStyle: 'editorial', motif: 'deco', popular: true,
    theme: { bg: '#0e0e0e', surface: '#181818', ink: '#efe6d2', primary: '#e2bf6b', accent: '#c9a14a', soft: '#a8997b', fontScript: FONT.greatVibes, fontHeading: FONT.limelight, fontBody: FONT.poiret, pattern: 'sunburst' },
    wording: WORDING.general, events: EVENTS.general, tags: ['art deco', 'black', 'gold'],
  }),
  defineWebsite(4, 'Kerala Kasavu', {
    description: 'Kasavu saree borders, a glowing nilavilakku and calm cream sections – pure Kerala elegance.',
    category: 'kerala', hero: 'kasavu', sectionStyle: 'classic', motif: 'diya', popular: true,
    theme: { bg: '#f8f1de', surface: '#fffaf0', ink: '#4a3b1f', primary: '#7a1f1f', accent: '#c9a13b', soft: '#7d6a45', fontScript: FONT.allura, fontHeading: FONT.marcellus, fontBody: FONT.lora, pattern: 'none' },
    wording: WORDING.kerala, events: EVENTS.kerala, tags: ['kerala', 'kasavu', 'gold'],
  }),
  defineWebsite(5, 'Starlit Vows', {
    description: 'Twinkling stars and a moonlit sky open into midnight-blue cards with a live countdown.',
    category: 'modern', hero: 'starry', sectionStyle: 'cards', motif: 'sparkle',
    theme: { bg: '#0b1736', surface: '#13224a', ink: '#e7ecf7', primary: '#f1d9a0', accent: '#c8b27a', soft: '#a3b0cf', fontScript: FONT.pinyon, fontHeading: FONT.cormorant, fontBody: FONT.cormorant, pattern: 'none' },
    wording: WORDING.general, events: EVENTS.general, tags: ['night', 'stars', 'navy'],
  }),
  defineWebsite(6, 'Eucalyptus', {
    description: 'A hand-drawn eucalyptus wreath around your initials on fresh sage green.',
    category: 'floral', hero: 'wreath', sectionStyle: 'cards', motif: 'leaf',
    theme: { bg: '#eef2ea', surface: '#f8faf5', ink: '#3b4a3e', primary: '#3f5d47', accent: '#7f9b84', soft: '#6c7b6f', fontScript: FONT.allura, fontHeading: FONT.cormorant, fontBody: FONT.josefin, pattern: 'paper' },
    wording: WORDING.general, events: EVENTS.general, tags: ['greenery', 'sage', 'wreath'],
  }),
  defineWebsite(7, 'The Wedding Issue', {
    description: 'A fashion-magazine cover with your photo, huge type and numbered editorial chapters.',
    category: 'minimal', hero: 'editorial', sectionStyle: 'editorial', motif: 'rings', isNew: true,
    theme: { bg: '#fafaf8', surface: '#f1eee8', ink: '#1f1f1f', primary: '#1f1f1f', accent: '#c4673f', soft: '#7a7a7a', fontScript: FONT.italiana, fontHeading: FONT.montserrat, fontBody: FONT.montserrat, pattern: 'none' },
    wording: WORDING.general, events: EVENTS.general, tags: ['magazine', 'editorial', 'photo'],
  }),
  defineWebsite(8, 'Mandap Marigold', {
    description: 'Marigold torans, temple pillars and festive saffron – a celebration from the first scroll.',
    category: 'traditional', hero: 'toran', sectionStyle: 'classic', motif: 'mandala', popular: true,
    theme: { bg: '#fff1d9', surface: '#ffe6bd', ink: '#5c2b0c', primary: '#b3261e', accent: '#e8930c', soft: '#8a5a2b', fontScript: FONT.greatVibes, fontHeading: FONT.cinzel, fontBody: FONT.lora, pattern: 'dots' },
    wording: WORDING.hindu, events: EVENTS.hindu, tags: ['marigold', 'toran', 'festive'],
  }),
  defineWebsite(9, 'Scrapbook Love', {
    description: 'Taped polaroids, handwritten notes and kraft paper – your love story as a scrapbook.',
    category: 'modern', hero: 'polaroid', sectionStyle: 'cards', motif: 'heart', isNew: true,
    theme: { bg: '#e9dcc4', surface: '#f4e9d6', ink: '#3b2f2f', primary: '#c0392b', accent: '#d98b74', soft: '#6e5a4d', fontScript: FONT.caveat, fontHeading: FONT.caveat, fontBody: FONT.josefin, pattern: 'paper' },
    wording: WORDING.general, events: EVENTS.general, tags: ['photo', 'fun', 'kraft'],
  }),
  defineWebsite(10, 'Emerald Nikah', {
    description: 'An emerald jharokha arch with your photo, crescent moon and golden calligraphy.',
    category: 'nikah', hero: 'arch', sectionStyle: 'classic', motif: 'crescent', popular: true,
    theme: { bg: '#0d4436', surface: '#115443', ink: '#f2ead3', primary: '#f0cf82', accent: '#cfa94d', soft: '#bfd3c6', fontScript: FONT.greatVibes, fontHeading: FONT.marcellus, fontBody: FONT.cormorant, pattern: 'damask' },
    wording: WORDING.nikah, events: EVENTS.nikah, tags: ['emerald', 'arch', 'crescent'],
  }),
  defineWebsite(11, 'Pop & Party', {
    description: 'Hot pink, sunshine yellow and a scrolling ticker – the happiest wedding website around.',
    category: 'modern', hero: 'marquee', sectionStyle: 'bold', motif: 'heart', isNew: true,
    theme: { bg: '#ff4f7b', surface: '#ffd23f', ink: '#1d1d1d', primary: '#ffffff', accent: '#1d1d1d', soft: '#3d3d3d', fontScript: FONT.dancing, fontHeading: FONT.abril, fontBody: FONT.poppins, pattern: 'none' },
    wording: WORDING.general, events: EVENTS.general, tags: ['colourful', 'bold', 'fun'],
  }),
  defineWebsite(12, 'Chapel Bells', {
    description: 'A white chapel arch, dusty-blue details and soft cards for a graceful church wedding.',
    category: 'christian', hero: 'arch', sectionStyle: 'cards', motif: 'cross',
    theme: { bg: '#eef2f7', surface: '#ffffff', ink: '#33435a', primary: '#4b6a8f', accent: '#8ea6c4', soft: '#6b7a8f', fontScript: FONT.pinyon, fontHeading: FONT.cormorant, fontBody: FONT.cormorant, pattern: 'none' },
    wording: WORDING.christian, events: EVENTS.christian, tags: ['church', 'dusty blue', 'arch'],
  }),
  defineWebsite(13, 'Peacock Palace', {
    description: 'Peacock teal and gold with an ornate framed welcome and feather crests.',
    category: 'royal', hero: 'frame', sectionStyle: 'classic', motif: 'peacock',
    theme: { bg: '#0b3d48', surface: '#0f4c59', ink: '#e7f1ef', primary: '#f2cf72', accent: '#d2a944', soft: '#9cc4c0', fontScript: FONT.greatVibes, fontHeading: FONT.cinzel, fontBody: FONT.cormorant, pattern: 'damask' },
    wording: WORDING.hindu, events: EVENTS.hindu, tags: ['peacock', 'teal', 'gold'],
  }),
  defineWebsite(14, 'Lotus Temple', {
    description: 'Lotus pink and leaf green in a sacred framed welcome with gentle sections.',
    category: 'traditional', hero: 'frame', sectionStyle: 'cards', motif: 'lotus',
    theme: { bg: '#fdf3f5', surface: '#ffffff', ink: '#4c3540', primary: '#c2416b', accent: '#e58aa7', soft: '#7f6470', fontScript: FONT.greatVibes, fontHeading: FONT.marcellus, fontBody: FONT.lora, pattern: 'none' },
    wording: WORDING.hindu, events: EVENTS.hindu, tags: ['lotus', 'pink', 'sacred'],
  }),
  defineWebsite(15, 'Ocean Breeze', {
    description: 'Your photo full-screen with an ocean-blue overlay and breezy beach-wedding sections.',
    category: 'destination', hero: 'fullbleed', sectionStyle: 'cards', motif: 'wave', popular: true,
    theme: { bg: '#f6efe3', surface: '#e3f1f4', ink: '#2f4a52', primary: '#1f6f84', accent: '#e9b26d', soft: '#6f8a8f', fontScript: FONT.sacramento, fontHeading: FONT.josefin, fontBody: FONT.josefin, pattern: 'none' },
    wording: WORDING.general, events: EVENTS.general, tags: ['beach', 'photo', 'ocean'],
  }),
  defineWebsite(16, 'Rose Gold Story', {
    description: 'Split-screen photo and names in blush and rose gold, with elegant editorial chapters.',
    category: 'floral', hero: 'split', sectionStyle: 'editorial', motif: 'rose',
    theme: { bg: '#f7e9e4', surface: '#fbf3f0', ink: '#5a3b3b', primary: '#b76e79', accent: '#c9917f', soft: '#8f6d6a', fontScript: FONT.greatVibes, fontHeading: FONT.playfair, fontBody: FONT.lora, pattern: 'none' },
    wording: WORDING.general, events: EVENTS.general, tags: ['rose gold', 'blush', 'photo'],
  }),
  defineWebsite(17, 'Kolam Courtyard', {
    description: 'Mango-leaf toran, kolam patterns and mustard-maroon cards for a South Indian wedding.',
    category: 'traditional', hero: 'toran', sectionStyle: 'cards', motif: 'kolam',
    theme: { bg: '#fbf0d0', surface: '#fff8e4', ink: '#4a1f12', primary: '#7d1e1e', accent: '#c58a12', soft: '#7a5a35', fontScript: FONT.allura, fontHeading: FONT.marcellus, fontBody: FONT.lora, pattern: 'dots' },
    wording: WORDING.hindu, events: EVENTS.hindu, tags: ['kolam', 'south indian', 'mustard'],
  }),
  defineWebsite(18, 'Lavender Fields', {
    description: 'Lavender blooms and soft lilac cards – calm, romantic and airy.',
    category: 'floral', hero: 'floral', sectionStyle: 'cards', motif: 'leaf',
    theme: { bg: '#f5f1fa', surface: '#ebe4f5', ink: '#4a4160', primary: '#6f5a9e', accent: '#a996cf', soft: '#7c7392', fontScript: FONT.parisienne, fontHeading: FONT.cormorant, fontBody: FONT.cormorant, pattern: 'paper' },
    wording: WORDING.general, events: EVENTS.general, tags: ['lavender', 'pastel', 'floral'],
  }),
  defineWebsite(19, 'Mughal Jharokha', {
    description: 'An ivory Mughal arch with ruby accents, mandala crown and regal classic sections.',
    category: 'royal', hero: 'arch', sectionStyle: 'classic', motif: 'mandala',
    theme: { bg: '#f7efe2', surface: '#fffaf2', ink: '#4a2424', primary: '#9b1c31', accent: '#c19a4b', soft: '#7d5c55', fontScript: FONT.greatVibes, fontHeading: FONT.cinzel, fontBody: FONT.cormorant, pattern: 'damask' },
    wording: WORDING.hindu, events: EVENTS.hindu, tags: ['mughal', 'ivory', 'ruby'],
  }),
  defineWebsite(20, 'Navy Monogram', {
    description: 'A navy wax-seal monogram with rotating lettering and crisp editorial pages.',
    category: 'minimal', hero: 'seal', sectionStyle: 'editorial', motif: 'rings',
    theme: { bg: '#f9f8f4', surface: '#eef0f4', ink: '#1d2b44', primary: '#1d2b44', accent: '#b49a5e', soft: '#6a7385', fontScript: FONT.pinyon, fontHeading: FONT.cinzel, fontBody: FONT.cormorant, pattern: 'none' },
    wording: WORDING.general, events: EVENTS.general, tags: ['monogram', 'navy', 'luxury'],
  }),
  defineWebsite(21, 'Desert Boho', {
    description: 'Terracotta and sand with a split photo hero and warm boho cards.',
    category: 'destination', hero: 'split', sectionStyle: 'cards', motif: 'leaf',
    theme: { bg: '#f4e6d8', surface: '#fbf3ea', ink: '#5a3a2a', primary: '#c0603f', accent: '#d9a27c', soft: '#8a6b5a', fontScript: FONT.sacramento, fontHeading: FONT.playfair, fontBody: FONT.josefin, pattern: 'none' },
    wording: WORDING.general, events: EVENTS.general, tags: ['boho', 'terracotta', 'sunset'],
  }),
  defineWebsite(22, 'Mural Green', {
    description: 'Kerala mural green with gold kasavu borders and a peacock blessing.',
    category: 'kerala', hero: 'kasavu', sectionStyle: 'cards', motif: 'peacock',
    theme: { bg: '#123d2b', surface: '#184a35', ink: '#f2e8cc', primary: '#f0cd73', accent: '#d4a83f', soft: '#bcd1bf', fontScript: FONT.allura, fontHeading: FONT.marcellus, fontBody: FONT.lora, pattern: 'none' },
    wording: WORDING.kerala, events: EVENTS.kerala, tags: ['kerala', 'mural', 'green'],
  }),
  defineWebsite(23, 'Purple Night Nikah', {
    description: 'A royal-purple night sky with a golden crescent and classic gold sections.',
    category: 'nikah', hero: 'starry', sectionStyle: 'classic', motif: 'crescent',
    theme: { bg: '#2a1440', surface: '#3a1d58', ink: '#efe6f7', primary: '#f2d27f', accent: '#cfae5a', soft: '#c7b5dc', fontScript: FONT.greatVibes, fontHeading: FONT.marcellus, fontBody: FONT.cormorant, pattern: 'none' },
    wording: WORDING.nikah, events: EVENTS.nikah, tags: ['purple', 'stars', 'crescent'],
  }),
  defineWebsite(24, 'Vintage Postcard', {
    description: 'Sepia polaroids, postmarks and typewriter-style chapters – love letters from the past.',
    category: 'vintage', hero: 'polaroid', sectionStyle: 'editorial', motif: 'heart',
    theme: { bg: '#efe2c9', surface: '#f6ecda', ink: '#4b3a2c', primary: '#8c1c13', accent: '#b0412e', soft: '#7b6652', fontScript: FONT.dancing, fontHeading: FONT.playfair, fontBody: FONT.lora, pattern: 'paper' },
    wording: WORDING.general, events: EVENTS.general, tags: ['sepia', 'postcard', 'vintage'],
  }),
  defineWebsite(25, 'Grace Garden Church', {
    description: 'A white-and-emerald wreath with a delicate cross for a garden church wedding.',
    category: 'christian', hero: 'wreath', sectionStyle: 'classic', motif: 'cross',
    theme: { bg: '#fbfbf7', surface: '#f0f5f1', ink: '#2e3b32', primary: '#1f5a3f', accent: '#5d9474', soft: '#6c7a70', fontScript: FONT.pinyon, fontHeading: FONT.cormorant, fontBody: FONT.cormorant, pattern: 'none' },
    wording: WORDING.christian, events: EVENTS.christian, tags: ['church', 'greenery', 'white'],
  }),
  defineWebsite(26, 'Ruby Seal', {
    description: 'A glowing ruby-and-gold mandala seal with your initials and festive classic sections.',
    category: 'traditional', hero: 'seal', sectionStyle: 'classic', motif: 'mandala', popular: true,
    theme: { bg: '#8e1027', surface: '#a3152f', ink: '#fbe9d6', primary: '#f6d27d', accent: '#e0b453', soft: '#f1c6b0', fontScript: FONT.greatVibes, fontHeading: FONT.cinzel, fontBody: FONT.cormorant, pattern: 'none' },
    wording: WORDING.hindu, events: EVENTS.hindu, tags: ['red', 'mandala', 'gold'],
  }),
  defineWebsite(27, 'Mint Modern', {
    description: 'Cool mint and deep teal in a clean editorial layout with a photo cover.',
    category: 'minimal', hero: 'editorial', sectionStyle: 'editorial', motif: 'leaf',
    theme: { bg: '#e3f4ec', surface: '#f3fbf7', ink: '#17423d', primary: '#17423d', accent: '#2f9c86', soft: '#5d7f78', fontScript: FONT.italiana, fontHeading: FONT.josefin, fontBody: FONT.josefin, pattern: 'grid' },
    wording: WORDING.general, events: EVENTS.general, tags: ['mint', 'fresh', 'clean'],
  }),
  defineWebsite(28, 'Neon Sangeet', {
    description: 'Electric neon on midnight purple with a dancing ticker – made for a Sangeet night.',
    category: 'modern', hero: 'marquee', sectionStyle: 'bold', motif: 'sparkle',
    theme: { bg: '#1c0f33', surface: '#2a1748', ink: '#f4f0ff', primary: '#2ff3e0', accent: '#ff3ea5', soft: '#b7a8d8', fontScript: FONT.dancing, fontHeading: FONT.abril, fontBody: FONT.poppins, pattern: 'grid' },
    wording: WORDING.general, events: EVENTS.general, tags: ['neon', 'party', 'dark'],
  }),
  defineWebsite(29, 'Golden Laurel', {
    description: 'A gilded laurel wreath on jet black – timeless, dramatic and classic.',
    category: 'royal', hero: 'wreath', sectionStyle: 'classic', motif: 'leaf',
    theme: { bg: '#121212', surface: '#1c1c1c', ink: '#efe7d4', primary: '#e3c06e', accent: '#c9a14a', soft: '#a39880', fontScript: FONT.greatVibes, fontHeading: FONT.cinzel, fontBody: FONT.cormorant, pattern: 'none' },
    wording: WORDING.general, events: EVENTS.general, tags: ['black', 'gold', 'laurel'],
  }),
  defineWebsite(30, 'Tropical Resort', {
    description: 'Full-screen photo, palm-green overlay and bold sunset-orange blocks for a resort wedding.',
    category: 'destination', hero: 'fullbleed', sectionStyle: 'bold', motif: 'leaf',
    theme: { bg: '#f2f6ec', surface: '#e2eedb', ink: '#24402f', primary: '#2f6b4f', accent: '#e39b4a', soft: '#5f7a69', fontScript: FONT.sacramento, fontHeading: FONT.playfair, fontBody: FONT.josefin, pattern: 'none' },
    wording: WORDING.general, events: EVENTS.general, tags: ['tropical', 'resort', 'green'],
  }),
  defineWebsite(31, 'Cathedral Ivory', {
    description: 'Ivory and navy with ornate gold frames and a cross crest – a classic cathedral feel.',
    category: 'christian', hero: 'frame', sectionStyle: 'editorial', motif: 'cross',
    theme: { bg: '#fbf7ee', surface: '#f3eee2', ink: '#26324a', primary: '#1f2d4d', accent: '#b8954d', soft: '#6b7386', fontScript: FONT.pinyon, fontHeading: FONT.cinzel, fontBody: FONT.cormorant, pattern: 'none' },
    wording: WORDING.christian, events: EVENTS.christian, tags: ['ivory', 'navy', 'classic'],
  }),
  defineWebsite(32, 'Haldi Bright', {
    description: 'Turmeric yellow, marigold orange and bold blocks – joyful from top to bottom.',
    category: 'traditional', hero: 'toran', sectionStyle: 'bold', motif: 'lotus', isNew: true,
    theme: { bg: '#fff6c9', surface: '#ffeaa0', ink: '#5a3a00', primary: '#d35400', accent: '#f39c12', soft: '#8a6a2a', fontScript: FONT.dancing, fontHeading: FONT.marcellus, fontBody: FONT.poppins, pattern: 'dots' },
    wording: WORDING.hindu, events: EVENTS.hindu, tags: ['haldi', 'yellow', 'marigold'],
  }),
  defineWebsite(33, 'Henna Mehendi', {
    description: 'Mehendi-green paisleys and henna-brown script for a Mehendi night or Nikah.',
    category: 'nikah', hero: 'floral', sectionStyle: 'classic', motif: 'paisley',
    theme: { bg: '#f3efdc', surface: '#fbf7e6', ink: '#4a3a22', primary: '#7a4a1f', accent: '#6b8e23', soft: '#7a6a4a', fontScript: FONT.greatVibes, fontHeading: FONT.marcellus, fontBody: FONT.lora, pattern: 'paper' },
    wording: WORDING.nikah, events: EVENTS.nikah, tags: ['mehendi', 'paisley', 'henna'],
  }),
  defineWebsite(34, 'Midnight Gatsby', {
    description: 'Black velvet curtains, gold tassels and art deco chapters for a glamorous night.',
    category: 'vintage', hero: 'curtain', sectionStyle: 'editorial', motif: 'deco',
    theme: { bg: '#111014', surface: '#1b1a20', ink: '#efe6d2', primary: '#e2bf6b', accent: '#c9a14a', soft: '#a8997b', fontScript: FONT.greatVibes, fontHeading: FONT.cinzelDeco, fontBody: FONT.poiret, pattern: 'sunburst' },
    wording: WORDING.general, events: EVENTS.general, tags: ['black', 'gold', 'glam'],
  }),
  // Nikah collection (animated) – see nikah-websites.data.ts
  ...NIKAH_WEBSITES,
  // Nikah 3D collection (WebGL) – see nikah-3d-websites.data.ts
  ...NIKAH_3D_WEBSITES,
  // 3D Journey collection (scroll to walk through) – see journey-3d-websites.data.ts
  ...JOURNEY_3D_WEBSITES,
  // Invite series (opening screen, music, wishes wall) – see invite-websites.data.ts
  ...INVITE_WEBSITES,
  // Venue series (cinematic 3D walk-through to a named invitation) – see venue-3d-websites.data.ts
  ...VENUE_3D_WEBSITES,
  // Realistic series (real HDR light, PBR surfaces, CC0 GLB models) – see realistic-3d-websites.data.ts
  ...REALISTIC_3D_WEBSITES,
  // Stationery series (tactile openings, paper backdrops) – see invite-websites.data.ts
  ...STATIONERY_WEBSITES,
]);
