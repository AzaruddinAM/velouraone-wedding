import { WebsiteTemplate } from '../core/models/wedding-template.model';
import { FONT, WORDING } from './design-tokens';
import { VENUE_EVENTS as EVENTS, defineVenue } from './venue-3d-websites.data';

/**
 * Realistic series (W106 … W113): real-world HDR photographs light the scene and
 * form the backdrop, floors and fabrics use physically based textures, and the
 * furniture, chandeliers and lanterns are real 3D models (CC0, Poly Haven).
 * Each walk-through ends at a gilded frame holding the couple's invitation.
 */
const real = (input: Parameters<typeof defineVenue>[2]) => ({
  ...input,
  realistic: true,
  tags: ['realistic', 'hdri', 'real 3d models', ...input.tags],
});

export const REALISTIC_3D_WEBSITES: readonly WebsiteTemplate[] = [
  defineVenue(106, 'Crystal Ballroom Real', real({
    scene: 'realballroom', category: 'royal', sectionStyle: 'classic', motif: 'deco', popular: true,
    description: 'A real ballroom: crystal chandeliers, marble floor, rows of guest chairs and a velvet stage with your invitation in a gilded frame.',
    theme: { bg: '#f8f2e8', surface: '#fffbf4', ink: '#3e3428', primary: '#7a1f2e', accent: '#b8914a', soft: '#7e705f', fontScript: FONT.greatVibes, fontHeading: FONT.cinzel, fontBody: FONT.cormorant, pattern: 'none' },
    wording: WORDING.general, events: EVENTS.general, tags: ['ballroom', 'chandelier', 'marble'],
  })),
  defineVenue(107, 'Sunset Terrace Real', real({
    scene: 'realterrace', category: 'destination', sectionStyle: 'editorial', motif: 'leaf', popular: true,
    description: 'A parquet terrace under a real golden sunset – wooden benches, street lamps and greenery lead to your framed invitation.',
    theme: { bg: '#fbf3ea', surface: '#fffaf4', ink: '#43352a', primary: '#b0602f', accent: '#c4904c', soft: '#85715e', fontScript: FONT.allura, fontHeading: FONT.playfair, fontBody: FONT.josefin, pattern: 'none' },
    wording: WORDING.general, events: EVENTS.general, tags: ['sunset', 'terrace', 'outdoor'],
  })),
  defineVenue(108, 'Lantern Night Nikah Real', real({
    scene: 'reallantern', category: 'nikah', sectionStyle: 'classic', motif: 'lantern', popular: true,
    description: 'A real starry night: brass lanterns line the aisle, lantern chandeliers glow over an emerald velvet stage for the Nikah.',
    theme: { bg: '#0d1f1b', surface: '#132a25', ink: '#f4ead2', primary: '#e0bb63', accent: '#d2a44e', soft: '#b9ad92', fontScript: FONT.greatVibes, fontHeading: FONT.marcellus, fontBody: FONT.cormorant, pattern: 'none' },
    wording: WORDING.nikahArabic, events: EVENTS.nikah, tags: ['night', 'lanterns', 'emerald'],
  })),
  defineVenue(109, 'Royal Esplanade Real', real({
    scene: 'realesplanade', category: 'royal', sectionStyle: 'cards', motif: 'mandala',
    description: 'A grand open-air esplanade by day – marble aisle, brass vases and lamp posts up to your gilded invitation.',
    theme: { bg: '#f4f2ee', surface: '#fcfbf8', ink: '#2f3a4a', primary: '#2f4f7a', accent: '#a8843e', soft: '#6b7480', fontScript: FONT.pinyon, fontHeading: FONT.cinzel, fontBody: FONT.lora, pattern: 'none' },
    wording: WORDING.hindu, events: EVENTS.hindu, tags: ['esplanade', 'daylight', 'marble'],
  })),
  defineVenue(110, 'Golden Bay Real', real({
    scene: 'realbay', category: 'destination', sectionStyle: 'cards', motif: 'wave',
    description: 'A seaside deck over a real bay – benches, oil lamps and white blooms with the ocean and hills all around.',
    theme: { bg: '#f1f6f9', surface: '#fbfdfe', ink: '#264257', primary: '#2f6b8a', accent: '#c28d4a', soft: '#647d8c', fontScript: FONT.sacramento, fontHeading: FONT.playfair, fontBody: FONT.josefin, pattern: 'none' },
    wording: WORDING.christian, events: EVENTS.christian, tags: ['beach', 'bay', 'ocean'],
  })),
  defineVenue(111, 'Velvet Mirror Lounge Real', real({
    scene: 'reallounge', category: 'vintage', sectionStyle: 'editorial', motif: 'deco', popular: true,
    description: 'A plum velvet lounge with gilded wall mirrors, oil lamps on round tables and chandeliers over a parquet floor.',
    theme: { bg: '#1f0c15', surface: '#2b111d', ink: '#f3e1cf', primary: '#d9b066', accent: '#c99a55', soft: '#c3a593', fontScript: FONT.greatVibes, fontHeading: FONT.italiana, fontBody: FONT.cormorant, pattern: 'none' },
    wording: WORDING.general, events: EVENTS.general, tags: ['velvet', 'mirrors', 'lounge'],
  })),
  defineVenue(112, 'Cake & Candlelight Real', real({
    scene: 'realcake', category: 'modern', sectionStyle: 'cards', motif: 'heart',
    description: 'A three-tier strawberry cake under the spotlight, candle lanterns and chandeliers – your invitation framed beside it.',
    theme: { bg: '#fcf4f3', surface: '#fffafa', ink: '#4a2f33', primary: '#c06a7d', accent: '#c39a64', soft: '#8b7174', fontScript: FONT.parisienne, fontHeading: FONT.playfair, fontBody: FONT.poppins, pattern: 'none' },
    wording: WORDING.general, events: EVENTS.general, tags: ['cake', 'reception', 'candles'],
  })),
  defineVenue(113, 'Golden Frame Gallery Real', real({
    scene: 'realgallery', category: 'nikah', sectionStyle: 'classic', motif: 'star8',
    description: 'Three gilded frames on easels – monogram, names and full invitation – in a softly lit hall under chandeliers.',
    theme: { bg: '#f7f1e6', surface: '#fffaf1', ink: '#3a3026', primary: '#7a5a2b', accent: '#a5833f', soft: '#7d6e5c', fontScript: FONT.greatVibes, fontHeading: FONT.marcellus, fontBody: FONT.cormorant, pattern: 'none' },
    wording: WORDING.nikahPairs, events: EVENTS.nikahSimple, tags: ['gallery', 'frames', 'easel'],
  })),
];
