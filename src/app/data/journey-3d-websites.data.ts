import { Scene3DKind, TemplateCategory, WebsiteEvent, WebsiteTemplate } from '../core/models/wedding-template.model';
import { FONT, WORDING } from './design-tokens';

/**
 * 3D Journey collection (W63 … W82): realistic 3D scenes that guests walk
 * through as they scroll – and can drag to look around.
 * Ten scenes × two colour stories.
 */
const EVENTS = {
  general: [
    { name: 'Welcome Dinner', dayOffset: -1, time: '19:00' },
    { name: 'Wedding Ceremony', dayOffset: 0, time: '' },
    { name: 'Reception', dayOffset: 0, time: '19:30' },
  ],
  hindu: [
    { name: 'Mehendi & Sangeet', dayOffset: -1, time: '18:00' },
    { name: 'Wedding Muhurtham', dayOffset: 0, time: '' },
    { name: 'Reception', dayOffset: 0, time: '19:00' },
  ],
  christian: [
    { name: 'Holy Matrimony', dayOffset: 0, time: '' },
    { name: 'Cake & Toast', dayOffset: 0, time: '13:00' },
    { name: 'Reception Dinner', dayOffset: 0, time: '18:30' },
  ],
  kerala: [
    { name: 'Haldi', dayOffset: -1, time: '10:00' },
    { name: 'Thalikettu (Wedding)', dayOffset: 0, time: '' },
    { name: 'Reception', dayOffset: 0, time: '18:30' },
  ],
  nikah: [
    { name: 'Mehendi Night', dayOffset: -1, time: '19:00' },
    { name: 'Nikah Ceremony', dayOffset: 0, time: '' },
    { name: 'Walima Reception', dayOffset: 1, time: '19:30' },
  ],
} satisfies Record<string, WebsiteEvent[]>;

type JourneyInput = Omit<
  WebsiteTemplate,
  'kind' | 'id' | 'code' | 'name' | 'style' | 'slug' | 'supportsPhoto' | 'animated' | 'threeD' | 'hero' | 'scene3d' | 'category'
> & { scene: Scene3DKind; category: TemplateCategory };

function defineJourney(number: number, style: string, { scene, ...input }: JourneyInput): WebsiteTemplate {
  const kebab = style.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  return {
    kind: 'website',
    id: `w${number}`,
    code: `W${number}`,
    name: `W${number} Wedding Website`,
    style,
    slug: `w${number}-${kebab}`,
    supportsPhoto: true,
    animated: true,
    threeD: true,
    isNew: true,
    hero: 'journey3d',
    scene3d: scene,
    ...input,
    tags: ['3d', '3d journey', 'walk-through', 'animated', ...input.tags],
  };
}

export const JOURNEY_3D_WEBSITES: readonly WebsiteTemplate[] = [
  // ----- Garden aisle ---------------------------------------------------------------------
  defineJourney(63, 'Garden Aisle', {
    scene: 'garden', category: 'floral', sectionStyle: 'cards', motif: 'leaf', popular: true,
    description: 'Walk down a sunlit garden aisle – white chairs, string lights and a flower arch waiting at the end.',
    theme: { bg: '#f4f1e8', surface: '#fbfaf5', ink: '#2f3b2f', primary: '#3f6b48', accent: '#c9a24e', soft: '#6b786a', fontScript: FONT.allura, fontHeading: FONT.cormorant, fontBody: FONT.josefin, pattern: 'none' },
    wording: WORDING.general, events: EVENTS.general, tags: ['garden', 'outdoor', 'flower arch'],
  }),
  defineJourney(64, 'Blossom Chapel Garden', {
    scene: 'garden', category: 'christian', sectionStyle: 'classic', motif: 'cross',
    description: 'A blush-pink garden ceremony – stroll past the guests to the blossom arch for your vows.',
    theme: { bg: '#fbf0f1', surface: '#fff8f8', ink: '#4f3a40', primary: '#c0607a', accent: '#d7a77d', soft: '#8d7279', fontScript: FONT.pinyon, fontHeading: FONT.cormorant, fontBody: FONT.lora, pattern: 'none' },
    wording: WORDING.christian, events: EVENTS.christian, tags: ['garden', 'church', 'blush'],
  }),

  // ----- Palace courtyard ----------------------------------------------------------------------
  defineJourney(65, 'Mughal Courtyard', {
    scene: 'palace', category: 'royal', sectionStyle: 'classic', motif: 'mandala', popular: true,
    description: 'Glide along a reflecting pool between carved arcades and cypress trees to a glowing palace gate.',
    theme: { bg: '#2a0f1a', surface: '#3a1624', ink: '#f8e9d6', primary: '#f2cf7a', accent: '#d9aa4c', soft: '#e6c7a8', fontScript: FONT.greatVibes, fontHeading: FONT.cinzel, fontBody: FONT.cormorant, pattern: 'none' },
    wording: WORDING.hindu, events: EVENTS.hindu, tags: ['palace', 'mughal', 'royal'],
  }),
  defineJourney(66, 'Palace of Pearls Nikah', {
    scene: 'palace', category: 'nikah', sectionStyle: 'cards', motif: 'crescent',
    description: 'An ivory palace courtyard at golden hour – walk past lanterns and fountains to the Nikah gate.',
    theme: { bg: '#f7f0e2', surface: '#fffaf0', ink: '#3f3324', primary: '#1f5a46', accent: '#c4a04f', soft: '#7d6c55', fontScript: FONT.greatVibes, fontHeading: FONT.marcellus, fontBody: FONT.cormorant, pattern: 'none' },
    wording: WORDING.nikahArabic, events: EVENTS.nikah, tags: ['palace', 'courtyard', 'pearl'],
  }),

  // ----- Beach mandap ----------------------------------------------------------------------------
  defineJourney(67, 'Sunset Beach Vows', {
    scene: 'beach', category: 'destination', sectionStyle: 'cards', motif: 'wave', popular: true,
    description: 'Walk the torch-lit aisle across the sand to a draped mandap, then turn to the sun setting over the waves.',
    theme: { bg: '#fdf1e6', surface: '#fff8f1', ink: '#3f2f2a', primary: '#d0614c', accent: '#e3a15a', soft: '#8a6f64', fontScript: FONT.sacramento, fontHeading: FONT.playfair, fontBody: FONT.josefin, pattern: 'none' },
    wording: WORDING.general, events: EVENTS.general, tags: ['beach', 'sunset', 'destination'],
  }),
  defineJourney(68, 'Ocean Nikah', {
    scene: 'beach', category: 'nikah', sectionStyle: 'editorial', motif: 'crescent',
    description: 'A seaside Nikah: torches on the sand, a white mandap and the ocean glowing at dusk.',
    theme: { bg: '#eef5f5', surface: '#f8fbfb', ink: '#1f3a40', primary: '#1f6f7a', accent: '#d2a44e', soft: '#5d7a7f', fontScript: FONT.pinyon, fontHeading: FONT.marcellus, fontBody: FONT.lora, pattern: 'none' },
    wording: WORDING.nikahPairs, events: EVENTS.nikah, tags: ['beach', 'ocean', 'nikah'],
  }),

  // ----- Reception hall ----------------------------------------------------------------------------
  defineJourney(69, 'Grand Reception', {
    scene: 'hall', category: 'royal', sectionStyle: 'editorial', motif: 'deco', popular: true,
    description: 'Step into a glittering ballroom – crystal chandeliers, candle-lit tables and a floral stage for the couple.',
    theme: { bg: '#120d14', surface: '#1d1620', ink: '#f2e8d8', primary: '#9c2f4c', accent: '#d6ad55', soft: '#b3a08c', fontScript: FONT.greatVibes, fontHeading: FONT.cinzel, fontBody: FONT.cormorant, pattern: 'none' },
    wording: WORDING.general, events: EVENTS.general, tags: ['reception', 'ballroom', 'chandelier'],
  }),
  defineJourney(70, 'Crystal Ballroom', {
    scene: 'hall', category: 'modern', sectionStyle: 'cards', motif: 'sparkle',
    description: 'A blush-and-gold reception hall with a fairy-light curtain – walk between the tables to the stage.',
    theme: { bg: '#fbf1f2', surface: '#fff8f9', ink: '#4a3438', primary: '#d58aa0', accent: '#caa46a', soft: '#8f767b', fontScript: FONT.parisienne, fontHeading: FONT.playfair, fontBody: FONT.poppins, pattern: 'none' },
    wording: WORDING.general, events: EVENTS.general, tags: ['reception', 'blush', 'fairy lights'],
  }),

  // ----- Wedding cake -------------------------------------------------------------------------------------
  defineJourney(71, 'Sweet Forever', {
    scene: 'cake', category: 'minimal', sectionStyle: 'editorial', motif: 'rings',
    description: 'Circle a five-tier wedding cake with cascading flowers, candles and crystal glasses, up to the ring topper.',
    theme: { bg: '#faf7f1', surface: '#ffffff', ink: '#2d2a26', primary: '#c48a9a', accent: '#c9a254', soft: '#7a736a', fontScript: FONT.italiana, fontHeading: FONT.montserrat, fontBody: FONT.montserrat, pattern: 'none' },
    wording: WORDING.general, events: EVENTS.general, tags: ['cake', 'minimal', 'elegant'],
  }),
  defineJourney(72, 'Royal Cake Ceremony', {
    scene: 'cake', category: 'vintage', sectionStyle: 'classic', motif: 'rose',
    description: 'A candle-lit burgundy setting around a gilded wedding cake – rich, romantic and close-up.',
    theme: { bg: '#2a1016', surface: '#3a1820', ink: '#f6e6d8', primary: '#a8324e', accent: '#d9b062', soft: '#d2b6a6', fontScript: FONT.greatVibes, fontHeading: FONT.playfair, fontBody: FONT.lora, pattern: 'none' },
    wording: WORDING.general, events: EVENTS.general, tags: ['cake', 'burgundy', 'candle-lit'],
  }),

  // ----- Islamic scenes as walk-throughs --------------------------------------------------------------------
  defineJourney(73, 'Walk to the Masjid', {
    scene: 'mosque', category: 'nikah', sectionStyle: 'classic', motif: 'dome', popular: true,
    description: 'Approach a golden-domed masjid under the stars, circle it and rise above the dome.',
    theme: { bg: '#070f2b', surface: '#14214a', ink: '#e6ebf8', primary: '#f4dc9a', accent: '#e0b65c', soft: '#a5b2d6', fontScript: FONT.greatVibes, fontHeading: FONT.marcellus, fontBody: FONT.cormorant, pattern: 'none' },
    wording: WORDING.nikahArabic, events: EVENTS.nikah, tags: ['mosque', 'night', 'nikah'],
  }),
  defineJourney(74, 'Dawn Masjid Journey', {
    scene: 'mosque', category: 'nikah', sectionStyle: 'cards', motif: 'dome',
    description: 'A pearl-white masjid at dawn – walk around it as the light glows in its windows.',
    theme: { bg: '#f6efe4', surface: '#fffaf2', ink: '#3f3324', primary: '#8a6420', accent: '#c9a14a', soft: '#8a7a62', fontScript: FONT.pinyon, fontHeading: FONT.cinzel, fontBody: FONT.cormorant, pattern: 'none' },
    wording: WORDING.nikahPairs, events: EVENTS.nikah, tags: ['mosque', 'dawn', 'pearl'],
  }),
  defineJourney(75, 'Lantern Walk', {
    scene: 'lanterns', category: 'nikah', sectionStyle: 'classic', motif: 'lantern',
    description: 'Fly through a festival of floating brass lanterns in a royal-purple night.',
    theme: { bg: '#1c0b33', surface: '#2a1450', ink: '#f1e9ff', primary: '#f6d98e', accent: '#e8a845', soft: '#c3b2e0', fontScript: FONT.greatVibes, fontHeading: FONT.marcellus, fontBody: FONT.cormorant, pattern: 'none' },
    wording: WORDING.nikahLove, events: EVENTS.nikah, tags: ['lanterns', 'purple', 'festival'],
  }),
  defineJourney(76, 'Kerala Lantern Night', {
    scene: 'lanterns', category: 'kerala', sectionStyle: 'cards', motif: 'diya',
    description: 'Golden lanterns over deep mural green – a glowing walk-through for a Kerala wedding.',
    theme: { bg: '#0d3324', surface: '#134330', ink: '#f2e8cc', primary: '#f0cd73', accent: '#d4a83f', soft: '#bcd1bf', fontScript: FONT.allura, fontHeading: FONT.marcellus, fontBody: FONT.lora, pattern: 'none' },
    wording: WORDING.kerala, events: EVENTS.kerala, tags: ['kerala', 'lanterns', 'green'],
  }),
  defineJourney(77, 'Ring Journey', {
    scene: 'rings', category: 'modern', sectionStyle: 'editorial', motif: 'rings', popular: true,
    description: 'Orbit two interlocked wedding rings and a sparkling diamond – sleek black and gold.',
    theme: { bg: '#0c0b0d', surface: '#18161b', ink: '#efe6d2', primary: '#e8c675', accent: '#d4a948', soft: '#a69a80', fontScript: FONT.greatVibes, fontHeading: FONT.cinzel, fontBody: FONT.cormorant, pattern: 'none' },
    wording: WORDING.general, events: EVENTS.general, tags: ['rings', 'black gold', 'luxury'],
  }),
  defineJourney(78, 'Rose Gold Promise', {
    scene: 'rings', category: 'floral', sectionStyle: 'cards', motif: 'rose',
    description: 'Circle rose-gold rings in a soft blush glow – a romantic, modern walk-around.',
    theme: { bg: '#f8e8e6', surface: '#fdf4f2', ink: '#5a3b3b', primary: '#b05a6e', accent: '#c98e7c', soft: '#93727a', fontScript: FONT.parisienne, fontHeading: FONT.cormorant, fontBody: FONT.lora, pattern: 'none' },
    wording: WORDING.general, events: EVENTS.general, tags: ['rings', 'rose gold', 'blush'],
  }),
  defineJourney(79, 'Geometry of Love', {
    scene: 'girih', category: 'nikah', sectionStyle: 'cards', motif: 'star8',
    description: 'Dive into turning gold Islamic stars in front of a turquoise mosaic wall.',
    theme: { bg: '#062b3a', surface: '#0c3e52', ink: '#e4f4f6', primary: '#4fd1c5', accent: '#e2bb63', soft: '#9cc7cf', fontScript: FONT.pinyon, fontHeading: FONT.marcellus, fontBody: FONT.lora, pattern: 'none' },
    wording: WORDING.nikahPairs, events: EVENTS.nikah, tags: ['geometric', 'turquoise', 'stars'],
  }),
  defineJourney(80, 'Ruby Star Journey', {
    scene: 'girih', category: 'nikah', sectionStyle: 'classic', motif: 'star8',
    description: 'Fly through ruby-and-gold eight-point stars to the heart of an octagon medallion.',
    theme: { bg: '#3d0816', surface: '#5a0f22', ink: '#f7e6cf', primary: '#ff7a8a', accent: '#e0b453', soft: '#e9c7a3', fontScript: FONT.greatVibes, fontHeading: FONT.cinzel, fontBody: FONT.cormorant, pattern: 'none' },
    wording: WORDING.nikahArabic, events: EVENTS.nikah, tags: ['geometric', 'ruby', 'royal'],
  }),
  defineJourney(81, 'Moonlit Nikah Journey', {
    scene: 'crescent', category: 'nikah', sectionStyle: 'classic', motif: 'crescent', popular: true,
    description: 'Drift around a giant golden crescent and star while lanterns orbit in a violet night.',
    theme: { bg: '#160a2e', surface: '#24124a', ink: '#efe6fb', primary: '#f5d98f', accent: '#e4b24f', soft: '#c3b2e0', fontScript: FONT.greatVibes, fontHeading: FONT.marcellus, fontBody: FONT.cormorant, pattern: 'none' },
    wording: WORDING.nikahArabic, events: EVENTS.nikah, tags: ['crescent', 'moon', 'violet'],
  }),
  defineJourney(82, 'Silver Crescent Walk', {
    scene: 'crescent', category: 'nikah', sectionStyle: 'editorial', motif: 'crescent',
    description: 'A calm, modern walk around a silver crescent on a charcoal night.',
    theme: { bg: '#101216', surface: '#1c2027', ink: '#eceff4', primary: '#dfe6f0', accent: '#b9c3d0', soft: '#9aa3b1', fontScript: FONT.allura, fontHeading: FONT.montserrat, fontBody: FONT.montserrat, pattern: 'none' },
    wording: WORDING.nikahPairs, events: EVENTS.nikah, tags: ['crescent', 'silver', 'modern'],
  }),
];
