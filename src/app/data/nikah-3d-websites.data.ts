import { Scene3DKind, WebsiteEvent, WebsiteTemplate } from '../core/models/wedding-template.model';
import { FONT, WORDING } from './design-tokens';

/**
 * Nikah 3D collection – wedding websites with a real-time WebGL hero (W53 … W62).
 * Five 3D scenes (mosque, lanterns, rings, girih stars, crescent), two colour stories each.
 */
const EVENTS: readonly WebsiteEvent[] = [
  { name: 'Mehendi Night', dayOffset: -1, time: '19:00' },
  { name: 'Nikah Ceremony', dayOffset: 0, time: '' },
  { name: 'Walima Reception', dayOffset: 1, time: '19:30' },
];

const KERALA_EVENTS: readonly WebsiteEvent[] = [
  { name: 'Mylanchi (Mehendi)', dayOffset: -1, time: '19:00' },
  { name: 'Nikah', dayOffset: 0, time: '' },
  { name: 'Walima Reception', dayOffset: 0, time: '19:30' },
];

type Nikah3DInput = Omit<
  WebsiteTemplate,
  'kind' | 'id' | 'code' | 'name' | 'style' | 'slug' | 'supportsPhoto' | 'category' | 'animated' | 'threeD' | 'hero' | 'scene3d'
> & { scene: Scene3DKind };

function defineNikah3D(number: number, style: string, { scene, ...input }: Nikah3DInput): WebsiteTemplate {
  const kebab = style.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  return {
    kind: 'website',
    id: `w${number}`,
    code: `W${number}`,
    name: `W${number} Wedding Website`,
    style,
    slug: `w${number}-${kebab}`,
    category: 'nikah',
    supportsPhoto: true,
    animated: true,
    threeD: true,
    isNew: true,
    hero: 'scene3d',
    scene3d: scene,
    ...input,
    tags: ['nikah', '3d', 'animated', ...input.tags],
  };
}

export const NIKAH_3D_WEBSITES: readonly WebsiteTemplate[] = [
  // ----- 3D Mosque ------------------------------------------------------------------------
  defineNikah3D(53, 'Mosque of Light', {
    scene: 'mosque', sectionStyle: 'classic', motif: 'dome', popular: true,
    description: 'A golden-domed 3D mosque turns slowly under a starry sky, its arched windows glowing – move to look around it.',
    theme: { bg: '#070f2b', surface: '#14214a', ink: '#e6ebf8', primary: '#f4dc9a', accent: '#e0b65c', soft: '#a5b2d6', fontScript: FONT.greatVibes, fontHeading: FONT.marcellus, fontBody: FONT.cormorant, pattern: 'none' },
    wording: WORDING.nikahArabic, events: EVENTS, tags: ['mosque', 'night', 'gold'],
  }),
  defineNikah3D(54, 'Pearl Masjid', {
    scene: 'mosque', sectionStyle: 'cards', motif: 'dome',
    description: 'A pearl-white 3D masjid with gold domes on a soft dawn sky – light, airy and elegant.',
    theme: { bg: '#f6efe4', surface: '#fffaf2', ink: '#3f3324', primary: '#8a6420', accent: '#c9a14a', soft: '#8a7a62', fontScript: FONT.pinyon, fontHeading: FONT.cinzel, fontBody: FONT.cormorant, pattern: 'none' },
    wording: WORDING.nikahPairs, events: KERALA_EVENTS, tags: ['mosque', 'pearl', 'dawn'],
  }),

  // ----- 3D Lanterns ------------------------------------------------------------------------
  defineNikah3D(55, 'Lantern Sky', {
    scene: 'lanterns', sectionStyle: 'classic', motif: 'lantern', popular: true,
    description: 'Dozens of glowing 3D brass lanterns float and spin in a royal-purple night with rising sparks.',
    theme: { bg: '#1c0b33', surface: '#2a1450', ink: '#f1e9ff', primary: '#f6d98e', accent: '#e8a845', soft: '#c3b2e0', fontScript: FONT.greatVibes, fontHeading: FONT.marcellus, fontBody: FONT.cormorant, pattern: 'none' },
    wording: WORDING.nikahArabic, events: EVENTS, tags: ['lanterns', 'purple', 'festival'],
  }),
  defineNikah3D(56, 'Emerald Lantern Festival', {
    scene: 'lanterns', sectionStyle: 'editorial', motif: 'lantern',
    description: 'Warm golden lanterns drifting through a deep emerald night – festive and magical.',
    theme: { bg: '#062a20', surface: '#0d3d2f', ink: '#eaf3ec', primary: '#f2d690', accent: '#e3b14f', soft: '#a9c9b8', fontScript: FONT.allura, fontHeading: FONT.playfair, fontBody: FONT.lora, pattern: 'none' },
    wording: WORDING.nikahLove, events: KERALA_EVENTS, tags: ['lanterns', 'emerald', 'festival'],
  }),

  // ----- 3D Rings ----------------------------------------------------------------------------
  defineNikah3D(57, 'Golden Rings Nikah', {
    scene: 'rings', sectionStyle: 'editorial', motif: 'rings', popular: true,
    description: 'Two interlocked 3D wedding rings – yellow and rose gold with a sparkling diamond – rotating in black velvet.',
    theme: { bg: '#0c0b0d', surface: '#18161b', ink: '#efe6d2', primary: '#e8c675', accent: '#d4a948', soft: '#a69a80', fontScript: FONT.greatVibes, fontHeading: FONT.cinzel, fontBody: FONT.cormorant, pattern: 'none' },
    wording: WORDING.nikahPairs, events: EVENTS, tags: ['rings', 'black gold', 'luxury'],
  }),
  defineNikah3D(58, 'Rose Gold Union', {
    scene: 'rings', sectionStyle: 'cards', motif: 'rings',
    description: 'Rose-gold 3D rings turning in a blush glow – soft, romantic and modern.',
    theme: { bg: '#f8e8e6', surface: '#fdf4f2', ink: '#5a3b3b', primary: '#b05a6e', accent: '#c98e7c', soft: '#93727a', fontScript: FONT.parisienne, fontHeading: FONT.cormorant, fontBody: FONT.lora, pattern: 'none' },
    wording: WORDING.nikahLove, events: EVENTS, tags: ['rings', 'rose gold', 'blush'],
  }),

  // ----- 3D Girih stars -------------------------------------------------------------------------
  defineNikah3D(59, 'Girih Galaxy', {
    scene: 'girih', sectionStyle: 'cards', motif: 'star8',
    description: 'Golden 3D Islamic stars orbit a turning medallion in front of a turquoise mosaic wall.',
    theme: { bg: '#062b3a', surface: '#0c3e52', ink: '#e4f4f6', primary: '#4fd1c5', accent: '#e2bb63', soft: '#9cc7cf', fontScript: FONT.pinyon, fontHeading: FONT.marcellus, fontBody: FONT.lora, pattern: 'none' },
    wording: WORDING.nikahPairs, events: KERALA_EVENTS, tags: ['geometric', 'turquoise', 'stars'],
  }),
  defineNikah3D(60, 'Royal Star', {
    scene: 'girih', sectionStyle: 'classic', motif: 'star8', popular: true,
    description: 'A gold-and-ruby 3D eight-point star turns at the heart of an octagon – regal Islamic geometry.',
    theme: { bg: '#3d0816', surface: '#5a0f22', ink: '#f7e6cf', primary: '#ff7a8a', accent: '#e0b453', soft: '#e9c7a3', fontScript: FONT.greatVibes, fontHeading: FONT.cinzel, fontBody: FONT.cormorant, pattern: 'none' },
    wording: WORDING.nikahArabic, events: EVENTS, tags: ['geometric', 'ruby', 'royal'],
  }),

  // ----- 3D Crescent -------------------------------------------------------------------------------
  defineNikah3D(61, 'Crescent Dream', {
    scene: 'crescent', sectionStyle: 'classic', motif: 'crescent', popular: true,
    description: 'A giant golden 3D crescent and star float in a violet night while tiny lanterns orbit around them.',
    theme: { bg: '#160a2e', surface: '#24124a', ink: '#efe6fb', primary: '#f5d98f', accent: '#e4b24f', soft: '#c3b2e0', fontScript: FONT.greatVibes, fontHeading: FONT.marcellus, fontBody: FONT.cormorant, pattern: 'none' },
    wording: WORDING.nikahArabic, events: EVENTS, tags: ['crescent', 'moon', 'violet'],
  }),
  defineNikah3D(62, 'Silver Moon', {
    scene: 'crescent', sectionStyle: 'editorial', motif: 'crescent',
    description: 'A silver 3D crescent with orbiting lanterns on a charcoal night – calm, modern and minimal.',
    theme: { bg: '#101216', surface: '#1c2027', ink: '#eceff4', primary: '#dfe6f0', accent: '#b9c3d0', soft: '#9aa3b1', fontScript: FONT.allura, fontHeading: FONT.montserrat, fontBody: FONT.montserrat, pattern: 'none' },
    wording: WORDING.nikahPairs, events: KERALA_EVENTS, tags: ['crescent', 'silver', 'modern'],
  }),
];
