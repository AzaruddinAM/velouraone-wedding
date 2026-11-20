import { WeddingTemplate } from '../core/models/wedding-template.model';
import { FONT, WORDING } from './design-tokens';

/**
 * Nikah collection – animated invitation cards (V37 … V54).
 * Six new Islamic-art layouts, three colour stories each.
 * Kept in its own file so the collection is easy to find and extend.
 */
type NikahCardInput = Omit<WeddingTemplate, 'kind' | 'id' | 'code' | 'name' | 'style' | 'slug' | 'supportsPhoto' | 'category' | 'animated'>;

function defineNikahCard(number: number, style: string, input: NikahCardInput): WeddingTemplate {
  const kebab = style.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  return {
    kind: 'card',
    id: `v${number}`,
    code: `V${number}`,
    name: `V${number} Wedding`,
    style,
    slug: `v${number}-${kebab}`,
    category: 'nikah',
    supportsPhoto: false,
    animated: true,
    isNew: true,
    ...input,
    tags: ['nikah', 'animated', ...(input.scratch ? ['scratch'] : []), ...input.tags],
  };
}

export const NIKAH_CARDS: readonly WeddingTemplate[] = [
  // ----- Lantern Arch ---------------------------------------------------------
  defineNikahCard(37, 'Lantern Night', {
    description: 'Golden lanterns swing over a self-drawing arch on a midnight-blue sky, with warm sparks rising.',
    layout: 'lantern-arch', motif: 'lantern', popular: true,
    theme: { bg: '#0d1a3a', surface: '#13244d', ink: '#e9edf8', primary: '#f3d488', accent: '#d9b25a', soft: '#a9b6d6', fontScript: FONT.greatVibes, fontHeading: FONT.marcellus, fontBody: FONT.cormorant, pattern: 'none' },
    wording: WORDING.nikahArabic, tags: ['lanterns', 'navy', 'gold'],
  }),
  defineNikahCard(38, 'Emerald Lanterns', {
    description: 'Deep emerald with glowing brass lanterns and a softly drawn gold arch.',
    layout: 'lantern-arch', motif: 'lantern',
    theme: { bg: '#0b3b2e', surface: '#0f4a3a', ink: '#eef3e6', primary: '#f1d58e', accent: '#d4ad52', soft: '#b6cfc1', fontScript: FONT.pinyon, fontHeading: FONT.marcellus, fontBody: FONT.cormorant, pattern: 'none' },
    wording: WORDING.nikahPairs, tags: ['lanterns', 'emerald', 'gold'],
  }),
  defineNikahCard(39, 'Rose Lantern', {
    description: 'Dusty rose and champagne lanterns for a soft, romantic Nikah.',
    layout: 'lantern-arch', motif: 'lantern',
    theme: { bg: '#f6e6e4', surface: '#fbf1ef', ink: '#5a3c40', primary: '#9c4a5a', accent: '#c99a6b', soft: '#8c6d70', fontScript: FONT.parisienne, fontHeading: FONT.cormorant, fontBody: FONT.lora, pattern: 'paper' },
    wording: WORDING.nikahLove, tags: ['lanterns', 'blush', 'champagne'],
  }),

  // ----- Girih Medallion --------------------------------------------------------
  defineNikahCard(40, 'Girih Gold', {
    description: 'Ivory paper, turning gold geometric stars and a shining octagon medallion.',
    layout: 'girih-medallion', motif: 'star8', popular: true,
    theme: { bg: '#fbf6ea', surface: '#fffdf6', ink: '#3f3420', primary: '#7a5a1c', accent: '#c9a14a', soft: '#8a7a5a', fontScript: FONT.greatVibes, fontHeading: FONT.cinzel, fontBody: FONT.cormorant, pattern: 'none' },
    wording: WORDING.nikahArabic, tags: ['geometric', 'ivory', 'gold'],
  }),
  defineNikahCard(41, 'Iznik Turquoise', {
    description: 'Inspired by Iznik tiles – turquoise and cobalt stars around a white medallion.',
    layout: 'girih-medallion', motif: 'star8',
    theme: { bg: '#e6f4f4', surface: '#ffffff', ink: '#173b4a', primary: '#1d4e89', accent: '#1aa0a8', soft: '#4f7480', fontScript: FONT.pinyon, fontHeading: FONT.marcellus, fontBody: FONT.lora, pattern: 'none' },
    wording: WORDING.nikahPairs, tags: ['turquoise', 'tiles', 'blue'],
  }),
  defineNikahCard(42, 'Royal Girih', {
    description: 'Maroon velvet and gold star patterns – regal and rich.',
    layout: 'girih-medallion', motif: 'star8',
    theme: { bg: '#5a0f22', surface: '#6e1630', ink: '#f7e6cf', primary: '#f2cf7a', accent: '#d6aa4c', soft: '#e9c7a3', fontScript: FONT.greatVibes, fontHeading: FONT.cinzel, fontBody: FONT.cormorant, pattern: 'none' },
    wording: WORDING.nikahArabic, tags: ['maroon', 'gold', 'royal'],
  }),

  // ----- Mosque Skyline -----------------------------------------------------------
  defineNikahCard(43, 'Moonrise Masjid', {
    description: 'A crescent rises over domes and minarets while stars twinkle and windows glow.',
    layout: 'mosque-skyline', motif: 'dome', popular: true,
    theme: { bg: '#070f2b', surface: '#16255a', ink: '#e6ebf8', primary: '#f4dc9a', accent: '#e0b65c', soft: '#a5b2d6', fontScript: FONT.greatVibes, fontHeading: FONT.marcellus, fontBody: FONT.cormorant, pattern: 'none' },
    wording: WORDING.nikahArabic, tags: ['mosque', 'moon', 'night'],
  }),
  defineNikahCard(44, 'Desert Dusk', {
    description: 'A plum-to-amber desert sunset behind a golden mosque skyline.',
    layout: 'mosque-skyline', motif: 'dome',
    theme: { bg: '#2c1238', surface: '#7a2f4f', ink: '#fbe9dc', primary: '#ffd48a', accent: '#f29e4c', soft: '#e7bfae', fontScript: FONT.pinyon, fontHeading: FONT.cormorant, fontBody: FONT.cormorant, pattern: 'none' },
    wording: WORDING.nikahLove, tags: ['sunset', 'desert', 'mosque'],
  }),
  defineNikahCard(45, 'Silver Crescent', {
    description: 'Charcoal night and silver moonlight – modern and calm.',
    layout: 'mosque-skyline', motif: 'dome',
    theme: { bg: '#15171c', surface: '#2a2e37', ink: '#eceff4', primary: '#e6e9ef', accent: '#b8c0cc', soft: '#9aa3b1', fontScript: FONT.allura, fontHeading: FONT.marcellus, fontBody: FONT.lora, pattern: 'none' },
    wording: WORDING.nikahPairs, tags: ['silver', 'charcoal', 'modern'],
  }),

  // ----- Mashrabiya Doors -----------------------------------------------------------
  defineNikahCard(46, 'Mashrabiya Ivory', {
    description: 'Carved teak lattice doors swing open onto an ivory invitation.',
    layout: 'mashrabiya-doors', motif: 'crescent',
    theme: { bg: '#fbf5ea', surface: '#fffaf1', ink: '#4a3524', primary: '#6b4226', accent: '#b8873e', soft: '#8a7058', fontScript: FONT.greatVibes, fontHeading: FONT.cinzel, fontBody: FONT.cormorant, pattern: 'paper' },
    wording: WORDING.nikahArabic, tags: ['doors', 'teak', 'ivory'],
  }),
  defineNikahCard(47, 'Andalusian Doors', {
    description: 'Terracotta Andalusian doors open to a sun-washed cream invite.',
    layout: 'mashrabiya-doors', motif: 'star8',
    theme: { bg: '#f7ece0', surface: '#fdf6ee', ink: '#5a3424', primary: '#a8482c', accent: '#d08a4a', soft: '#8e6a58', fontScript: FONT.parisienne, fontHeading: FONT.playfair, fontBody: FONT.lora, pattern: 'none' },
    wording: WORDING.nikahLove, tags: ['andalusian', 'terracotta', 'doors'],
  }),
  defineNikahCard(48, 'Jade Lattice', {
    description: 'Jade-green lattice doors with brass knobs reveal a calm, elegant card.',
    layout: 'mashrabiya-doors', motif: 'lantern',
    theme: { bg: '#eef5ef', surface: '#f8fbf8', ink: '#22392e', primary: '#1f5b45', accent: '#c4a04f', soft: '#5f7a6d', fontScript: FONT.pinyon, fontHeading: FONT.marcellus, fontBody: FONT.cormorant, pattern: 'none' },
    wording: WORDING.nikahPairs, tags: ['jade', 'lattice', 'brass'],
  }),

  // ----- Scratch to reveal (coins) ----------------------------------------------------
  defineNikahCard(49, 'Scratch & Reveal Gold', {
    description: 'Guests scratch three golden coins to discover the day, month and year of your Nikah.',
    layout: 'scratch-circles', motif: 'crescent', scratch: true, popular: true,
    theme: { bg: '#fbf4e6', surface: '#fffaf0', ink: '#45351f', primary: '#7a5418', accent: '#c99a3e', soft: '#8a785c', fontScript: FONT.greatVibes, fontHeading: FONT.cinzel, fontBody: FONT.cormorant, pattern: 'none' },
    wording: WORDING.nikahArabic, tags: ['scratch card', 'gold', 'surprise'],
  }),
  defineNikahCard(50, 'Scratch Blush', {
    description: 'Rose-gold coins to scratch on blush pink, with petals drifting down.',
    layout: 'scratch-circles', motif: 'rose', scratch: true,
    theme: { bg: '#fbeef0', surface: '#ffffff', ink: '#5a3a42', primary: '#b05a6e', accent: '#d39a86', soft: '#93727a', fontScript: FONT.parisienne, fontHeading: FONT.cormorant, fontBody: FONT.lora, pattern: 'paper' },
    wording: WORDING.nikahLove, tags: ['scratch card', 'blush', 'rose gold'],
  }),
  defineNikahCard(51, 'Scratch Emerald', {
    description: 'Emerald velvet with gold coins – scratch to reveal the big day.',
    layout: 'scratch-circles', motif: 'star8', scratch: true,
    theme: { bg: '#0f4436', surface: '#14553f', ink: '#eef3e6', primary: '#f0d28a', accent: '#d2aa4e', soft: '#b9d0c3', fontScript: FONT.greatVibes, fontHeading: FONT.marcellus, fontBody: FONT.cormorant, pattern: 'none' },
    wording: WORDING.nikahPairs, tags: ['scratch card', 'emerald', 'gold'],
  }),

  // ----- Scratch to reveal (ticket) -----------------------------------------------------
  defineNikahCard(52, 'Golden Ticket Nikah', {
    description: 'A black-and-gold invitation ticket with a foil strip hiding when and where.',
    layout: 'scratch-ticket', motif: 'star8', scratch: true, popular: true,
    theme: { bg: '#101010', surface: '#1b1a17', ink: '#efe6d2', primary: '#e8c675', accent: '#cfa548', soft: '#a69a80', fontScript: FONT.greatVibes, fontHeading: FONT.cinzel, fontBody: FONT.cormorant, pattern: 'none' },
    wording: WORDING.nikahArabic, tags: ['scratch card', 'ticket', 'black gold'],
  }),
  defineNikahCard(53, 'Lilac Ticket', {
    description: 'Soft lilac ticket with a silver foil strip and twinkling stars.',
    layout: 'scratch-ticket', motif: 'star8', scratch: true,
    theme: { bg: '#e9e1f4', surface: '#faf7fd', ink: '#3f3550', primary: '#6a4c9c', accent: '#a99bc4', soft: '#776b8c', fontScript: FONT.parisienne, fontHeading: FONT.cormorant, fontBody: FONT.lora, pattern: 'none' },
    wording: WORDING.nikahLove, tags: ['scratch card', 'lilac', 'silver'],
  }),
  defineNikahCard(54, 'Mint Ticket', {
    description: 'Fresh mint ticket with a gold scratch strip – light and joyful.',
    layout: 'scratch-ticket', motif: 'star8', scratch: true,
    theme: { bg: '#dff2ea', surface: '#f7fcfa', ink: '#1f3d36', primary: '#1f6b5a', accent: '#c9a24e', soft: '#557a70', fontScript: FONT.allura, fontHeading: FONT.marcellus, fontBody: FONT.lora, pattern: 'none' },
    wording: WORDING.nikahPairs, tags: ['scratch card', 'mint', 'gold'],
  }),
];
