import { Scene3DKind, TemplateCategory, WebsiteEvent, WebsiteTemplate } from '../core/models/wedding-template.model';
import { FONT, WORDING } from './design-tokens';

/**
 * Venue series (W93 … W105): cinematic 3D walk-throughs of a dressed wedding
 * venue – stairs, doors, corridors, curtains, gates – that end in front of an
 * invitation panel carrying the couple's own names, date and venue.
 * Every design has its own scene, so no two look alike.
 */
const EVENTS = {
  nikah: [
    { name: 'Mehendi Night', dayOffset: -1, time: '19:00' },
    { name: 'Nikah Ceremony', dayOffset: 0, time: '' },
    { name: 'Walima Reception', dayOffset: 1, time: '19:30' },
  ],
  nikahSimple: [
    { name: 'Nikah', dayOffset: 0, time: '' },
    { name: 'Reception', dayOffset: 0, time: '19:00' },
  ],
  general: [
    { name: 'Wedding Ceremony', dayOffset: 0, time: '' },
    { name: 'Dinner & Dance', dayOffset: 0, time: '19:30' },
  ],
  hindu: [
    { name: 'Haldi & Mehendi', dayOffset: -1, time: '17:00' },
    { name: 'Wedding Muhurtham', dayOffset: 0, time: '' },
    { name: 'Reception', dayOffset: 0, time: '19:00' },
  ],
  christian: [
    { name: 'Holy Matrimony', dayOffset: 0, time: '' },
    { name: 'Reception Dinner', dayOffset: 0, time: '18:30' },
  ],
} satisfies Record<string, WebsiteEvent[]>;

type VenueInput = Omit<
  WebsiteTemplate,
  'kind' | 'id' | 'code' | 'name' | 'style' | 'slug' | 'supportsPhoto' | 'animated' | 'threeD' | 'hero' | 'scene3d' | 'category' | 'venue3d'
> & { scene: Scene3DKind; category: TemplateCategory };

function defineVenue(number: number, style: string, { scene, ...input }: VenueInput): WebsiteTemplate {
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
    venue3d: true,
    ...input,
    tags: ['3d', '3d venue', 'walk-through', 'cinematic', 'animated', ...input.tags],
  };
}

export const VENUE_3D_WEBSITES: readonly WebsiteTemplate[] = [
  defineVenue(93, 'Moonlit Palace Stairs', {
    scene: 'moonstairs', category: 'nikah', sectionStyle: 'classic', motif: 'dome', popular: true,
    description: 'Climb a candle-lit marble staircase under the moon to a domed pavilion – velvet curtains part to reveal your invitation.',
    theme: { bg: '#2a0a12', surface: '#3a1019', ink: '#f6e6cf', primary: '#e8c77a', accent: '#d9aa55', soft: '#d6bfa3', fontScript: FONT.greatVibes, fontHeading: FONT.cinzel, fontBody: FONT.cormorant, pattern: 'none' },
    wording: WORDING.nikahArabic, events: EVENTS.nikah, tags: ['palace', 'stairs', 'moon', 'red carpet', 'curtain'],
  }),
  defineVenue(94, 'Through the Portal', {
    scene: 'portal', category: 'destination', sectionStyle: 'editorial', motif: 'leaf', popular: true,
    description: 'Glide through a glowing flower-lit tunnel and burst out into a mountain valley where your invitation waits by the lake.',
    theme: { bg: '#f6f3ec', surface: '#fffdf8', ink: '#2e3a33', primary: '#3f6b52', accent: '#c49a4a', soft: '#6f7a72', fontScript: FONT.allura, fontHeading: FONT.playfair, fontBody: FONT.josefin, pattern: 'none' },
    wording: WORDING.general, events: EVENTS.general, tags: ['tunnel', 'mountains', 'lake', 'adventure'],
  }),
  defineVenue(95, 'Lilac Garden Door', {
    scene: 'floraldoor', category: 'nikah', sectionStyle: 'cards', motif: 'rose',
    description: 'Carved wooden doors in a lilac flower arch swing open onto a fairy-lit garden path that leads to your invitation.',
    theme: { bg: '#f5f0f8', surface: '#fcfaff', ink: '#43385a', primary: '#8a6bb8', accent: '#c29a5b', soft: '#7d7290', fontScript: FONT.parisienne, fontHeading: FONT.marcellus, fontBody: FONT.lora, pattern: 'none' },
    wording: WORDING.nikahArabic, events: EVENTS.nikahSimple, tags: ['door', 'garden', 'lavender', 'flowers'],
  }),
  defineVenue(96, 'Rose Cathedral Corridor', {
    scene: 'gothic', category: 'royal', sectionStyle: 'editorial', motif: 'rose', popular: true,
    description: 'Walk a burgundy corridor of pointed arches, candles and roses to a gilded arch holding your invitation.',
    theme: { bg: '#1e070d', surface: '#2c0b14', ink: '#f3dfd2', primary: '#d79aa5', accent: '#d6a35f', soft: '#c3a59c', fontScript: FONT.pinyon, fontHeading: FONT.cinzelDeco, fontBody: FONT.cormorant, pattern: 'none' },
    wording: WORDING.general, events: EVENTS.general, tags: ['burgundy', 'gothic', 'candles', 'roses'],
  }),
  defineVenue(97, 'Pearl & Satin', {
    scene: 'pearl', category: 'nikah', sectionStyle: 'classic', motif: 'crescent',
    description: 'Ivory satin moves like water, pearl strands hang in the air and gold rings turn beside a pearl-framed invitation.',
    theme: { bg: '#faf4ea', surface: '#fffbf4', ink: '#5c4a30', primary: '#b4893f', accent: '#c9a05a', soft: '#8f7c62', fontScript: FONT.greatVibes, fontHeading: FONT.italiana, fontBody: FONT.cormorant, pattern: 'none' },
    wording: WORDING.nikahArabic, events: EVENTS.nikah, tags: ['pearl', 'satin', 'ivory', 'luxury'],
  }),
  defineVenue(98, 'Storybook Waterfall', {
    scene: 'storybook', category: 'floral', sectionStyle: 'cards', motif: 'leaf', popular: true,
    description: 'A fairytale valley – waterfall, drifting clouds and a wooden bridge where the couple waits beside your invitation.',
    theme: { bg: '#eef5fb', surface: '#ffffff', ink: '#2f4256', primary: '#3d6fa8', accent: '#d39b55', soft: '#66788a', fontScript: FONT.dancing, fontHeading: FONT.playfair, fontBody: FONT.poppins, pattern: 'none' },
    wording: WORDING.general, events: EVENTS.general, tags: ['waterfall', 'bridge', 'illustrated', 'clouds'],
  }),
  defineVenue(99, 'Champagne Mirror Aisle', {
    scene: 'mirrorhall', category: 'modern', sectionStyle: 'editorial', motif: 'sparkle', popular: true,
    description: 'A mirror aisle reflecting chandeliers and champagne drapes, lined with hydrangeas, ending at black arched signboards.',
    theme: { bg: '#f4eee6', surface: '#fbf8f3', ink: '#2e2925', primary: '#8c7458', accent: '#c4a77d', soft: '#7d7368', fontScript: FONT.allura, fontHeading: FONT.cormorant, fontBody: FONT.montserrat, pattern: 'none' },
    wording: WORDING.general, events: EVENTS.general, tags: ['mirror', 'champagne', 'chandelier', 'signboard'],
  }),
  defineVenue(100, 'Floral Grotto Lake', {
    scene: 'grotto', category: 'christian', sectionStyle: 'classic', motif: 'cross',
    description: 'Pass beneath six arches of white blooms over still water to twin stone tablets carrying your vows.',
    theme: { bg: '#f3f1ed', surface: '#fbfaf8', ink: '#3b3834', primary: '#7d6c55', accent: '#a88f68', soft: '#7c776f', fontScript: FONT.pinyon, fontHeading: FONT.cormorant, fontBody: FONT.lora, pattern: 'none' },
    wording: WORDING.christian, events: EVENTS.christian, tags: ['white flowers', 'water', 'arches', 'tablets'],
  }),
  defineVenue(101, 'Spotlight Easel Gallery', {
    scene: 'gallery', category: 'traditional', sectionStyle: 'cards', motif: 'mandala',
    description: 'Step through a carved wooden gateway into a linen-draped gallery where three spot-lit easels present your invitation.',
    theme: { bg: '#f7f1e7', surface: '#fffaf2', ink: '#3b2f25', primary: '#8a5a2b', accent: '#b8955f', soft: '#7c6c5c', fontScript: FONT.greatVibes, fontHeading: FONT.marcellus, fontBody: FONT.cormorant, pattern: 'none' },
    wording: WORDING.hindu, events: EVENTS.hindu, tags: ['gallery', 'easel', 'spotlight', 'carved wood'],
  }),
  defineVenue(102, 'Olive Velvet Arches', {
    scene: 'velvet', category: 'vintage', sectionStyle: 'editorial', motif: 'deco',
    description: 'Olive velvet curtains in every arch, peonies and pendant lamps – a glowing monogram floats you to the glass invitation.',
    theme: { bg: '#1d1d10', surface: '#2a2a17', ink: '#f1ecd2', primary: '#d9c77e', accent: '#c9b26a', soft: '#b5ad8a', fontScript: FONT.greatVibes, fontHeading: FONT.italiana, fontBody: FONT.josefin, pattern: 'none' },
    wording: WORDING.general, events: EVENTS.general, tags: ['olive', 'velvet', 'monogram', 'glass'],
  }),
  defineVenue(103, 'Moonlight Arcade Nikah', {
    scene: 'arcade', category: 'nikah', sectionStyle: 'classic', motif: 'star8', popular: true,
    description: 'Globe lamps and white blooms along a polished arcade – the bride and groom walk ahead of you to a glass invitation.',
    theme: { bg: '#121214', surface: '#1c1c20', ink: '#f2ede4', primary: '#e3d3ad', accent: '#cdb385', soft: '#a9a296', fontScript: FONT.pinyon, fontHeading: FONT.marcellus, fontBody: FONT.montserrat, pattern: 'none' },
    wording: WORDING.nikahPairs, events: EVENTS.nikahSimple, tags: ['modern', 'arches', 'globe lamps', 'couple'],
  }),
  defineVenue(104, 'Velvet Theatre Envelope', {
    scene: 'theatre', category: 'modern', sectionStyle: 'bold', motif: 'heart', popular: true,
    description: 'Red theatre curtains part, a black-and-gold envelope opens on stage and your invitation rises into the spotlight.',
    theme: { bg: '#190407', surface: '#26070b', ink: '#f7e6d6', primary: '#e1b866', accent: '#c9a14f', soft: '#c7a596', fontScript: FONT.greatVibes, fontHeading: FONT.playfair, fontBody: FONT.poppins, pattern: 'none' },
    wording: WORDING.general, events: EVENTS.general, tags: ['theatre', 'envelope', 'red curtain', 'reveal'],
  }),
  defineVenue(105, 'Ivory Ballroom Gate', {
    scene: 'ballroom', category: 'nikah', sectionStyle: 'classic', motif: 'dome',
    description: 'Follow the couple down a candle-lit floral aisle in an ivory ballroom until a ribboned gate swings open to your invitation.',
    theme: { bg: '#fbf6ee', surface: '#fffdf8', ink: '#40362b', primary: '#9b7b4c', accent: '#c4a26a', soft: '#85786a', fontScript: FONT.parisienne, fontHeading: FONT.cinzel, fontBody: FONT.cormorant, pattern: 'none' },
    wording: WORDING.nikahArabic, events: EVENTS.nikah, tags: ['ballroom', 'ivory', 'gate', 'ribbon', 'chandelier'],
  }),
];
