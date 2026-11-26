import { InviteStyle, TemplateCategory, WebsiteEvent, WebsiteTemplate } from '../core/models/wedding-template.model';
import { FONT, WORDING } from './design-tokens';

/**
 * Invite series (W83 … W92): mobile-first invitation websites with an opening
 * screen, original background music, scratch-to-see photo, event card with
 * directions & calendar, families, map, RSVP and a wishes wall.
 *
 * Every design uses a different opening + backdrop pair, so no two look alike.
 */
const EVENTS = {
  nikah: [
    { name: 'Nikah Ceremony', dayOffset: 0, time: '' },
    { name: 'Reception (after Maghrib)', dayOffset: 0, time: '19:00' },
  ],
  nikahGrand: [
    { name: 'Mehendi Night', dayOffset: -1, time: '19:00' },
    { name: 'Nikah', dayOffset: 0, time: '' },
    { name: 'Walima', dayOffset: 1, time: '13:00' },
  ],
  kerala: [
    { name: 'Mylanchi Night', dayOffset: -1, time: '19:30' },
    { name: 'Nikah', dayOffset: 0, time: '' },
    { name: 'Wedding Lunch', dayOffset: 0, time: '12:30' },
  ],
  general: [
    { name: 'Wedding Ceremony', dayOffset: 0, time: '' },
    { name: 'Reception Dinner', dayOffset: 0, time: '19:30' },
  ],
} satisfies Record<string, WebsiteEvent[]>;

type InviteInput = Omit<
  WebsiteTemplate,
  'kind' | 'id' | 'code' | 'name' | 'style' | 'slug' | 'supportsPhoto' | 'animated' | 'hero' | 'category'
> & { category: TemplateCategory; invite: InviteStyle };

function defineInvite(number: number, style: string, input: InviteInput): WebsiteTemplate {
  const kebab = style.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const { intro, backdrop } = input.invite;
  return {
    kind: 'website',
    id: `w${number}`,
    code: `W${number}`,
    name: `W${number} Wedding Website`,
    style,
    slug: `w${number}-${kebab}`,
    supportsPhoto: true,
    animated: true,
    isNew: true,
    hero: 'invite',
    ...input,
    scratch: true,
    tags: ['invite series', `${intro} opening`, `${backdrop} backdrop`, 'music', 'scratch', 'rsvp', ...input.tags],
  };
}

export const INVITE_WEBSITES: readonly WebsiteTemplate[] = [
  defineInvite(83, 'Ivory Envelope', {
    category: 'nikah', sectionStyle: 'classic', motif: 'rose', popular: true,
    invite: { intro: 'envelope', backdrop: 'palace', cards: 'framed', particles: 'petal' },
    description: 'A wax-sealed ivory envelope opens onto a palace staircase framed with roses – with soft music and a scratch-to-see photo.',
    theme: { bg: '#f8f1e6', surface: '#fbf6ee', ink: '#4a3428', primary: '#6b1f2e', accent: '#b8893e', soft: '#8a7262', fontScript: FONT.greatVibes, fontHeading: FONT.cinzel, fontBody: FONT.cormorant, pattern: 'none' },
    wording: WORDING.nikahPairs, events: EVENTS.nikah, tags: ['envelope', 'ivory', 'palace'],
  }),
  defineInvite(84, 'Emerald Verse', {
    category: 'nikah', sectionStyle: 'cards', motif: 'crescent', popular: true,
    invite: { intro: 'welcome', backdrop: 'dome', cards: 'glass', particles: 'star' },
    description: 'Opens on a Qur’an verse over an emerald dome – tap “Open Invitation” and the music begins.',
    theme: { bg: '#0c3b2e', surface: '#12503e', ink: '#eef3e6', primary: '#f1d48a', accent: '#d2aa4e', soft: '#b9d0c3', fontScript: FONT.greatVibes, fontHeading: FONT.playfair, fontBody: FONT.poppins, pattern: 'none' },
    wording: WORDING.nikahArabic, events: EVENTS.nikahGrand, tags: ['emerald', 'verse', 'dome'],
  }),
  defineInvite(85, 'Blush Garden Doors', {
    category: 'floral', sectionStyle: 'classic', motif: 'rose',
    invite: { intro: 'doors', backdrop: 'garden', cards: 'framed', particles: 'petal' },
    description: 'Carved doors swing open onto a blush flower arch with fairy lights and drifting petals.',
    theme: { bg: '#fbeff0', surface: '#fff7f7', ink: '#5a3b42', primary: '#a54a62', accent: '#cf9a7d', soft: '#8f727a', fontScript: FONT.parisienne, fontHeading: FONT.cormorant, fontBody: FONT.lora, pattern: 'none' },
    wording: WORDING.general, events: EVENTS.general, tags: ['doors', 'blush', 'garden'],
  }),
  defineInvite(86, 'Midnight Curtain', {
    category: 'nikah', sectionStyle: 'cards', motif: 'lantern',
    invite: { intro: 'curtain', backdrop: 'lanterns', cards: 'glass', particles: 'spark' },
    description: 'Velvet curtains rise on a midnight sky full of swinging lanterns and a glowing crescent.',
    theme: { bg: '#0d1a3a', surface: '#16264f', ink: '#e9edf8', primary: '#f3d488', accent: '#d9b25a', soft: '#a9b6d6', fontScript: FONT.pinyon, fontHeading: FONT.marcellus, fontBody: FONT.cormorant, pattern: 'none' },
    wording: WORDING.nikahLove, events: EVENTS.nikah, tags: ['curtain', 'lanterns', 'night'],
  }),
  defineInvite(87, 'Photo Story Nikah', {
    category: 'nikah', sectionStyle: 'editorial', motif: 'leaf', popular: true,
    invite: { intro: 'welcome', backdrop: 'photo', cards: 'editorial', particles: 'none' },
    description: 'Your own photo fills the screen behind the verse; inside, clean editorial pages tell your story.',
    theme: { bg: '#f6f4ef', surface: '#ffffff', ink: '#22302a', primary: '#1f4d3a', accent: '#c8a45a', soft: '#66756d', fontScript: FONT.italiana, fontHeading: FONT.playfair, fontBody: FONT.poppins, pattern: 'none' },
    wording: WORDING.nikahArabic, events: EVENTS.nikah, tags: ['photo', 'green', 'editorial'],
  }),
  defineInvite(88, 'Jaali Scroll', {
    category: 'royal', sectionStyle: 'classic', motif: 'mandala',
    invite: { intro: 'scroll', backdrop: 'jaali', cards: 'framed', particles: 'none' },
    description: 'A parchment scroll unrolls to a sandstone jaali arch with swinging tassels – warm and regal.',
    theme: { bg: '#f3e6d3', surface: '#faf2e6', ink: '#4a2f22', primary: '#8c3b24', accent: '#c4864a', soft: '#8a6a55', fontScript: FONT.greatVibes, fontHeading: FONT.cinzelDeco, fontBody: FONT.cormorant, pattern: 'none' },
    wording: WORDING.hindu, events: EVENTS.general, tags: ['scroll', 'jaali', 'sandstone'],
  }),
  defineInvite(89, 'Jasmine Envelope', {
    category: 'kerala', sectionStyle: 'editorial', motif: 'leaf',
    invite: { intro: 'envelope', backdrop: 'garden', cards: 'editorial', particles: 'petal' },
    description: 'A jasmine-white envelope with a green wax seal, opening onto a fresh garden – made for Kerala Muslim weddings.',
    theme: { bg: '#f5faf3', surface: '#ffffff', ink: '#243626', primary: '#2f6a3f', accent: '#8bb174', soft: '#5f7461', fontScript: FONT.allura, fontHeading: FONT.marcellus, fontBody: FONT.josefin, pattern: 'none' },
    wording: WORDING.nikahPairs, events: EVENTS.kerala, tags: ['jasmine', 'kerala', 'garden'],
  }),
  defineInvite(90, 'Royal Maroon Doors', {
    category: 'nikah', sectionStyle: 'cards', motif: 'star8',
    invite: { intro: 'doors', backdrop: 'dome', cards: 'glass', particles: 'star' },
    description: 'Heavy maroon doors with brass rings open to a gold-traced dome under the stars.',
    theme: { bg: '#3a0c18', surface: '#521428', ink: '#f8e9d6', primary: '#f2cf7a', accent: '#d6aa4c', soft: '#e6c7a8', fontScript: FONT.greatVibes, fontHeading: FONT.cinzel, fontBody: FONT.cormorant, pattern: 'none' },
    wording: WORDING.nikahArabic, events: EVENTS.nikahGrand, tags: ['maroon', 'doors', 'royal'],
  }),
  defineInvite(91, 'Lilac Lantern Scroll', {
    category: 'modern', sectionStyle: 'cards', motif: 'lantern',
    invite: { intro: 'scroll', backdrop: 'lanterns', cards: 'glass', particles: 'spark' },
    description: 'A lilac scroll unrolls into a dreamy lantern-lit night – playful, soft and modern.',
    theme: { bg: '#2a1b46', surface: '#3a2760', ink: '#f2ecff', primary: '#e8d6ff', accent: '#c9a6f2', soft: '#bfb0dc', fontScript: FONT.parisienne, fontHeading: FONT.josefin, fontBody: FONT.josefin, pattern: 'none' },
    wording: WORDING.general, events: EVENTS.general, tags: ['lilac', 'lanterns', 'scroll'],
  }),
  defineInvite(92, 'Golden Curtain Photo', {
    category: 'royal', sectionStyle: 'editorial', motif: 'deco',
    invite: { intro: 'curtain', backdrop: 'photo', cards: 'framed', particles: 'spark' },
    description: 'Gold-tasselled curtains part to reveal your photo – black-tie glamour with framed gold cards.',
    theme: { bg: '#111013', surface: '#1b1a1f', ink: '#efe6d2', primary: '#e8c675', accent: '#cfa548', soft: '#a69a80', fontScript: FONT.greatVibes, fontHeading: FONT.limelight, fontBody: FONT.poiret, pattern: 'none' },
    wording: WORDING.general, events: EVENTS.general, tags: ['black gold', 'curtain', 'photo'],
  }),
];

/**
 * Stationery series (W114 … W123): tactile openings – wax seal, satin bow, ink bloom,
 * crescent envelope, pocket card – on paper-like backdrops (cotton, linen, marble,
 * celestial night, watercolour). One standard type system for all ten:
 * Great Vibes (names), Cinzel (headings), Cormorant Garamond (text), Amiri (Arabic).
 */
const STANDARD_FONTS = { fontScript: FONT.greatVibes, fontHeading: FONT.cinzel, fontBody: FONT.cormorant, pattern: 'none' } as const;

export const STATIONERY_WEBSITES: readonly WebsiteTemplate[] = [
  defineInvite(114, 'Ivory Wax Seal', {
    category: 'nikah', sectionStyle: 'classic', motif: 'crescent', popular: true,
    invite: { intro: 'waxseal', backdrop: 'cotton', cards: 'framed', particles: 'petal' },
    description: 'A gold wax seal cracks, the ribbon slips and a vellum jacket lifts – revealing a gold-foil arch with flame lilies on handmade cotton paper.',
    theme: { bg: '#f7f0e4', surface: '#fdf8ef', ink: '#4a3326', primary: '#7a2232', accent: '#c29a4e', soft: '#8b7462', ...STANDARD_FONTS },
    wording: WORDING.nikahArabic, events: EVENTS.nikahGrand, tags: ['wax seal', 'vellum', 'cotton paper', 'stationery'],
  }),
  defineInvite(115, 'Linen & Poppy Bow', {
    category: 'floral', sectionStyle: 'classic', motif: 'rose', popular: true,
    invite: { intro: 'bow', backdrop: 'linen', cards: 'framed', particles: 'petal' },
    description: 'A satin bow unties and a linen envelope opens onto stitched poppies and an embroidery hoop with your initials.',
    theme: { bg: '#f2ebe0', surface: '#faf6ef', ink: '#3f332c', primary: '#b2384a', accent: '#c49a62', soft: '#86776b', ...STANDARD_FONTS },
    wording: WORDING.general, events: EVENTS.general, tags: ['linen', 'embroidery', 'poppies', 'stationery'],
  }),
  defineInvite(116, 'Burgundy Ink', {
    category: 'royal', sectionStyle: 'editorial', motif: 'deco', popular: true,
    invite: { intro: 'inkbloom', backdrop: 'marble', cards: 'editorial', particles: 'none' },
    description: 'A drop of wine-dark ink blooms across white marble to reveal your names, framed by gilded ink-cosmos flowers.',
    theme: { bg: '#f7f4ef', surface: '#ffffff', ink: '#2e2326', primary: '#6d1830', accent: '#b8924a', soft: '#7a6a6c', ...STANDARD_FONTS },
    wording: WORDING.general, events: EVENTS.general, tags: ['marble', 'ink', 'burgundy', 'stationery'],
  }),
  defineInvite(117, 'Midnight Crescent', {
    category: 'nikah', sectionStyle: 'cards', motif: 'crescent', popular: true,
    invite: { intro: 'crescent', backdrop: 'celestial', cards: 'glass', particles: 'star' },
    description: 'A midnight envelope sealed with a gold crescent opens to gold filigree, drifting silk veils and a sky full of stars.',
    theme: { bg: '#0f1a33', surface: '#18274a', ink: '#ece9f4', primary: '#f0d58e', accent: '#d3ad5a', soft: '#aab3cf', ...STANDARD_FONTS },
    wording: WORDING.nikahLove, events: EVENTS.nikah, tags: ['midnight', 'crescent', 'celestial', 'stationery'],
  }),
  defineInvite(118, 'Chateau Pocket', {
    category: 'christian', sectionStyle: 'classic', motif: 'leaf',
    invite: { intro: 'pocket', backdrop: 'watercolor', cards: 'framed', particles: 'petal' },
    description: 'The belly band slides off and the card rises from its pocket – onto a watercolour country estate at golden hour.',
    theme: { bg: '#f4efe6', surface: '#fbf8f2', ink: '#33402f', primary: '#4f6a45', accent: '#c19a62', soft: '#7a8473', ...STANDARD_FONTS },
    wording: WORDING.christian, events: EVENTS.general, tags: ['watercolour', 'estate', 'pocket fold', 'stationery'],
  }),
  defineInvite(119, 'Blush Marble Seal', {
    category: 'modern', sectionStyle: 'editorial', motif: 'heart',
    invite: { intro: 'waxseal', backdrop: 'marble', cards: 'editorial', particles: 'none' },
    description: 'A rose-gold wax seal and blush ribbon on a vellum jacket – opening onto soft marble with blush cosmos flowers.',
    theme: { bg: '#fbf3f1', surface: '#ffffff', ink: '#43302f', primary: '#b4677a', accent: '#c99a7d', soft: '#8f7774', ...STANDARD_FONTS },
    wording: WORDING.general, events: EVENTS.general, tags: ['blush', 'marble', 'wax seal', 'stationery'],
  }),
  defineInvite(120, 'Sage Garden Bow', {
    category: 'kerala', sectionStyle: 'cards', motif: 'leaf',
    invite: { intro: 'bow', backdrop: 'watercolor', cards: 'glass', particles: 'petal' },
    description: 'A sage satin bow unties to a soft watercolour garden at dusk – gentle and fresh for a Kerala Nikah.',
    theme: { bg: '#f1f4ec', surface: '#fafcf6', ink: '#2e3a2c', primary: '#5d7a55', accent: '#c4a466', soft: '#6f7c6b', ...STANDARD_FONTS },
    wording: WORDING.nikahPairs, events: EVENTS.kerala, tags: ['sage', 'bow', 'watercolour', 'stationery'],
  }),
  defineInvite(121, 'Indigo Ink Night', {
    category: 'modern', sectionStyle: 'cards', motif: 'sparkle',
    invite: { intro: 'inkbloom', backdrop: 'celestial', cards: 'glass', particles: 'star' },
    description: 'Indigo ink blooms across marble into a starry night with silver filigree and drifting veils.',
    theme: { bg: '#141a3a', surface: '#1e2650', ink: '#e8ebf8', primary: '#b9c4ff', accent: '#c7ccdf', soft: '#a3abcd', ...STANDARD_FONTS },
    wording: WORDING.general, events: EVENTS.general, tags: ['indigo', 'ink', 'night', 'stationery'],
  }),
  defineInvite(122, 'Marigold Pocket', {
    category: 'traditional', sectionStyle: 'classic', motif: 'mandala', popular: true,
    invite: { intro: 'pocket', backdrop: 'cotton', cards: 'framed', particles: 'petal' },
    description: 'A maroon pocket card with a gold belly band slides open onto cotton paper, a gold arch and marigold-orange lilies.',
    theme: { bg: '#fbf1e2', surface: '#fff8ec', ink: '#4a2c1c', primary: '#8c2a1e', accent: '#e09a2d', soft: '#8a6a52', ...STANDARD_FONTS },
    wording: WORDING.hindu, events: EVENTS.general, tags: ['marigold', 'pocket fold', 'cotton paper', 'stationery'],
  }),
  defineInvite(123, 'Teal Poppy Crescent', {
    category: 'nikah', sectionStyle: 'classic', motif: 'star8',
    invite: { intro: 'crescent', backdrop: 'linen', cards: 'framed', particles: 'petal' },
    description: 'A crescent-sealed envelope opens onto teal embroidered poppies, a running stitch and an embroidery hoop.',
    theme: { bg: '#eef2ef', surface: '#f8faf7', ink: '#22363a', primary: '#1f5c63', accent: '#c48a52', soft: '#62767a', ...STANDARD_FONTS },
    wording: WORDING.nikahArabic, events: EVENTS.nikah, tags: ['teal', 'linen', 'crescent', 'stationery'],
  }),
];
