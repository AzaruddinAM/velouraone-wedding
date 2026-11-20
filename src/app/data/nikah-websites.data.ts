import { WebsiteEvent, WebsiteTemplate } from '../core/models/wedding-template.model';
import { FONT, WORDING } from './design-tokens';

/**
 * Nikah collection – animated wedding websites (W35 … W52).
 * Six new animated heroes × three colour stories; sections fade in on scroll.
 */
const NIKAH_EVENTS = {
  classic: [
    { name: 'Mehendi Night', dayOffset: -1, time: '19:00' },
    { name: 'Nikah Ceremony', dayOffset: 0, time: '' },
    { name: 'Walima', dayOffset: 1, time: '19:00' },
  ],
  kerala: [
    { name: 'Mylanchi (Mehendi)', dayOffset: -1, time: '19:00' },
    { name: 'Nikah', dayOffset: 0, time: '' },
    { name: 'Walima Reception', dayOffset: 0, time: '19:30' },
  ],
  grand: [
    { name: 'Mehendi & Dholki', dayOffset: -2, time: '18:30' },
    { name: 'Nikah & Rukhsati', dayOffset: 0, time: '' },
    { name: 'Walima Dinner', dayOffset: 1, time: '20:00' },
  ],
} satisfies Record<string, WebsiteEvent[]>;

type NikahSiteInput = Omit<WebsiteTemplate, 'kind' | 'id' | 'code' | 'name' | 'style' | 'slug' | 'supportsPhoto' | 'category' | 'animated'>;

function defineNikahSite(number: number, style: string, input: NikahSiteInput): WebsiteTemplate {
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
    isNew: true,
    ...input,
    tags: ['nikah', 'animated', ...(input.scratch ? ['scratch'] : []), ...input.tags],
  };
}

export const NIKAH_WEBSITES: readonly WebsiteTemplate[] = [
  // ----- Lantern -------------------------------------------------------------------
  defineNikahSite(35, 'Lantern Glow', {
    description: 'Swinging golden lanterns, rising sparks and a self-drawing arch on a midnight sky.',
    hero: 'lantern', sectionStyle: 'classic', motif: 'lantern', popular: true,
    theme: { bg: '#0d1a3a', surface: '#13244d', ink: '#e9edf8', primary: '#f3d488', accent: '#d9b25a', soft: '#a9b6d6', fontScript: FONT.greatVibes, fontHeading: FONT.marcellus, fontBody: FONT.cormorant, pattern: 'none' },
    wording: WORDING.nikahArabic, events: NIKAH_EVENTS.classic, tags: ['lanterns', 'navy', 'gold'],
  }),
  defineNikahSite(36, 'Lantern Garden', {
    description: 'Brass lanterns over a sage-green garden with soft rounded cards.',
    hero: 'lantern', sectionStyle: 'cards', motif: 'lantern',
    theme: { bg: '#eef3ea', surface: '#f8fbf5', ink: '#2f4135', primary: '#2f5d46', accent: '#c4a04f', soft: '#617766', fontScript: FONT.allura, fontHeading: FONT.cormorant, fontBody: FONT.josefin, pattern: 'paper' },
    wording: WORDING.nikahPairs, events: NIKAH_EVENTS.kerala, tags: ['lanterns', 'sage', 'garden'],
  }),
  defineNikahSite(37, 'Rose Lanterns', {
    description: 'Dusty-rose lanterns and champagne glow with elegant editorial chapters.',
    hero: 'lantern', sectionStyle: 'editorial', motif: 'lantern',
    theme: { bg: '#f6e6e4', surface: '#fbf1ef', ink: '#5a3c40', primary: '#9c4a5a', accent: '#c99a6b', soft: '#8c6d70', fontScript: FONT.parisienne, fontHeading: FONT.playfair, fontBody: FONT.lora, pattern: 'none' },
    wording: WORDING.nikahLove, events: NIKAH_EVENTS.classic, tags: ['lanterns', 'blush', 'editorial'],
  }),

  // ----- Mosque moonrise ------------------------------------------------------------
  defineNikahSite(38, 'Masjid Moonrise', {
    description: 'A crescent rises over a glowing mosque skyline, with shooting stars across the night.',
    hero: 'mosque', sectionStyle: 'classic', motif: 'dome', popular: true,
    theme: { bg: '#070f2b', surface: '#121f4d', ink: '#e6ebf8', primary: '#f4dc9a', accent: '#e0b65c', soft: '#a5b2d6', fontScript: FONT.greatVibes, fontHeading: FONT.marcellus, fontBody: FONT.cormorant, pattern: 'none' },
    wording: WORDING.nikahArabic, events: NIKAH_EVENTS.grand, tags: ['mosque', 'moon', 'night'],
  }),
  defineNikahSite(39, 'Dusk Over Domes', {
    description: 'Plum-and-amber desert sunset, golden domes and warm rounded cards.',
    hero: 'mosque', sectionStyle: 'cards', motif: 'dome',
    theme: { bg: '#2c1238', surface: '#3d1a4a', ink: '#fbe9dc', primary: '#ffd48a', accent: '#f29e4c', soft: '#e7bfae', fontScript: FONT.pinyon, fontHeading: FONT.cormorant, fontBody: FONT.cormorant, pattern: 'none' },
    wording: WORDING.nikahLove, events: NIKAH_EVENTS.classic, tags: ['sunset', 'desert', 'plum'],
  }),
  defineNikahSite(40, 'Silver Night', {
    description: 'Charcoal sky and silver moonlight – a calm, modern Nikah website.',
    hero: 'mosque', sectionStyle: 'editorial', motif: 'crescent',
    theme: { bg: '#15171c', surface: '#20242c', ink: '#eceff4', primary: '#e6e9ef', accent: '#b8c0cc', soft: '#9aa3b1', fontScript: FONT.allura, fontHeading: FONT.marcellus, fontBody: FONT.lora, pattern: 'none' },
    wording: WORDING.nikahPairs, events: NIKAH_EVENTS.kerala, tags: ['silver', 'charcoal', 'modern'],
  }),

  // ----- Mashrabiya doors -----------------------------------------------------------
  defineNikahSite(41, 'Palace Doors', {
    description: 'Carved teak mashrabiya doors swing open to welcome your guests.',
    hero: 'doors', sectionStyle: 'classic', motif: 'crescent', popular: true,
    theme: { bg: '#fbf5ea', surface: '#f4eadb', ink: '#4a3524', primary: '#6b4226', accent: '#b8873e', soft: '#8a7058', fontScript: FONT.greatVibes, fontHeading: FONT.cinzel, fontBody: FONT.cormorant, pattern: 'damask' },
    wording: WORDING.nikahArabic, events: NIKAH_EVENTS.grand, tags: ['doors', 'teak', 'palace'],
  }),
  defineNikahSite(42, 'Andalus', {
    description: 'Terracotta Andalusian doors open onto sunny cream cards and courtyard calm.',
    hero: 'doors', sectionStyle: 'cards', motif: 'star8',
    theme: { bg: '#f7ece0', surface: '#fdf6ee', ink: '#5a3424', primary: '#a8482c', accent: '#d08a4a', soft: '#8e6a58', fontScript: FONT.parisienne, fontHeading: FONT.playfair, fontBody: FONT.lora, pattern: 'none' },
    wording: WORDING.nikahLove, events: NIKAH_EVENTS.classic, tags: ['andalusian', 'terracotta', 'courtyard'],
  }),
  defineNikahSite(43, 'Jade Courtyard', {
    description: 'Jade lattice doors, brass details and bold jade colour blocks.',
    hero: 'doors', sectionStyle: 'bold', motif: 'lantern',
    theme: { bg: '#eef5ef', surface: '#dcebe2', ink: '#22392e', primary: '#1f5b45', accent: '#c4a04f', soft: '#5f7a6d', fontScript: FONT.pinyon, fontHeading: FONT.marcellus, fontBody: FONT.josefin, pattern: 'none' },
    wording: WORDING.nikahPairs, events: NIKAH_EVENTS.kerala, tags: ['jade', 'lattice', 'bold'],
  }),

  // ----- Girih geometry -------------------------------------------------------------
  defineNikahSite(44, 'Iznik Blue', {
    description: 'Turquoise Iznik-tile stars turn around a white octagon medallion.',
    hero: 'girih', sectionStyle: 'cards', motif: 'star8',
    theme: { bg: '#e6f4f4', surface: '#ffffff', ink: '#173b4a', primary: '#1d4e89', accent: '#1aa0a8', soft: '#4f7480', fontScript: FONT.pinyon, fontHeading: FONT.marcellus, fontBody: FONT.lora, pattern: 'none' },
    wording: WORDING.nikahPairs, events: NIKAH_EVENTS.classic, tags: ['turquoise', 'tiles', 'geometric'],
  }),
  defineNikahSite(45, 'Girih Royale', {
    description: 'Maroon and gold geometric stars with a shimmering medallion – truly regal.',
    hero: 'girih', sectionStyle: 'classic', motif: 'star8', popular: true,
    theme: { bg: '#5a0f22', surface: '#6a142c', ink: '#f7e6cf', primary: '#f2cf7a', accent: '#d6aa4c', soft: '#e9c7a3', fontScript: FONT.greatVibes, fontHeading: FONT.cinzel, fontBody: FONT.cormorant, pattern: 'damask' },
    wording: WORDING.nikahArabic, events: NIKAH_EVENTS.grand, tags: ['maroon', 'gold', 'royal'],
  }),
  defineNikahSite(46, 'Geometry Minimal', {
    description: 'Black-and-white Islamic geometry with crisp, numbered editorial chapters.',
    hero: 'girih', sectionStyle: 'editorial', motif: 'star8',
    theme: { bg: '#fafaf8', surface: '#f0efeb', ink: '#1c1c1c', primary: '#1c1c1c', accent: '#b8954d', soft: '#6d6d6d', fontScript: FONT.italiana, fontHeading: FONT.montserrat, fontBody: FONT.montserrat, pattern: 'none' },
    wording: WORDING.nikahPairs, events: NIKAH_EVENTS.kerala, tags: ['minimal', 'black white', 'geometric'],
  }),

  // ----- Scratch to reveal -----------------------------------------------------------
  defineNikahSite(47, 'Scratch Our Date', {
    description: 'Guests scratch three golden coins on the opening screen to reveal your Nikah date – with confetti!',
    hero: 'scratch', sectionStyle: 'cards', motif: 'crescent', scratch: true, popular: true,
    theme: { bg: '#fbf4e6', surface: '#fffaf0', ink: '#45351f', primary: '#7a5418', accent: '#c99a3e', soft: '#8a785c', fontScript: FONT.greatVibes, fontHeading: FONT.cinzel, fontBody: FONT.cormorant, pattern: 'paper' },
    wording: WORDING.nikahArabic, events: NIKAH_EVENTS.classic, tags: ['scratch card', 'gold', 'surprise'],
  }),
  defineNikahSite(48, 'Blush Reveal', {
    description: 'Rose-gold scratch coins on blush pink, with petals drifting across the screen.',
    hero: 'scratch', sectionStyle: 'classic', motif: 'rose', scratch: true,
    theme: { bg: '#fbeef0', surface: '#fff7f8', ink: '#5a3a42', primary: '#b05a6e', accent: '#d39a86', soft: '#93727a', fontScript: FONT.parisienne, fontHeading: FONT.cormorant, fontBody: FONT.lora, pattern: 'none' },
    wording: WORDING.nikahLove, events: NIKAH_EVENTS.kerala, tags: ['scratch card', 'blush', 'rose gold'],
  }),
  defineNikahSite(49, 'Emerald Surprise', {
    description: 'Emerald and gold scratch-to-reveal opening with bold colour-block sections.',
    hero: 'scratch', sectionStyle: 'bold', motif: 'star8', scratch: true,
    theme: { bg: '#0f4436', surface: '#14553f', ink: '#eef3e6', primary: '#f0d28a', accent: '#d2aa4e', soft: '#b9d0c3', fontScript: FONT.greatVibes, fontHeading: FONT.marcellus, fontBody: FONT.josefin, pattern: 'none' },
    wording: WORDING.nikahPairs, events: NIKAH_EVENTS.grand, tags: ['scratch card', 'emerald', 'bold'],
  }),

  // ----- Petal shower -----------------------------------------------------------------
  defineNikahSite(50, 'Petal Shower', {
    description: 'Rose petals drift over an ivory arch while your names softly ink in.',
    hero: 'petals', sectionStyle: 'classic', motif: 'rose', popular: true,
    theme: { bg: '#fdf6f2', surface: '#f8ebe6', ink: '#5b4040', primary: '#a8495a', accent: '#d98f9a', soft: '#8f7272', fontScript: FONT.greatVibes, fontHeading: FONT.cormorant, fontBody: FONT.lora, pattern: 'paper' },
    wording: WORDING.nikahArabic, events: NIKAH_EVENTS.classic, tags: ['petals', 'ivory', 'rose'],
  }),
  defineNikahSite(51, 'Jasmine Nikah', {
    description: 'White jasmine petals and leaf green – a fresh Kerala Muslim wedding website.',
    hero: 'petals', sectionStyle: 'cards', motif: 'leaf',
    theme: { bg: '#f6faf3', surface: '#eaf3e4', ink: '#2c3d2c', primary: '#2f6a3f', accent: '#b9d6a8', soft: '#62775f', fontScript: FONT.allura, fontHeading: FONT.marcellus, fontBody: FONT.josefin, pattern: 'none' },
    wording: WORDING.nikahPairs, events: NIKAH_EVENTS.kerala, tags: ['jasmine', 'kerala', 'green'],
  }),
  defineNikahSite(52, 'Mehendi Petals', {
    description: 'Henna-green petals over warm sand, with editorial chapters for your Mehendi and Nikah.',
    hero: 'petals', sectionStyle: 'editorial', motif: 'paisley',
    theme: { bg: '#f3efdc', surface: '#ebe4cb', ink: '#4a3a22', primary: '#7a4a1f', accent: '#6b8e23', soft: '#7a6a4a', fontScript: FONT.greatVibes, fontHeading: FONT.playfair, fontBody: FONT.lora, pattern: 'paper' },
    wording: WORDING.nikahLove, events: NIKAH_EVENTS.grand, tags: ['mehendi', 'henna', 'petals'],
  }),
];
