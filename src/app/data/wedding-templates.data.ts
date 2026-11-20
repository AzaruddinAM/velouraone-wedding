import { TemplateLayout, WeddingTemplate } from '../core/models/wedding-template.model';
import { FONT, WORDING } from './design-tokens';
import { NIKAH_CARDS } from './nikah-cards.data';

/** Layouts that have a dedicated frame for the couple photo. */
const PHOTO_LAYOUTS: readonly TemplateLayout[] = ['arch-window', 'photo-split', 'polaroid'];

type TemplateInput = Omit<WeddingTemplate, 'kind' | 'id' | 'code' | 'name' | 'style' | 'slug' | 'supportsPhoto'>;

/** Builds the V-numbered card identity (`V7 Wedding`, `v7-gatsby-noir`, …) for a template. */
function defineTemplate(number: number, style: string, input: TemplateInput): WeddingTemplate {
  const kebab = style.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  return {
    kind: 'card',
    id: `v${number}`,
    code: `V${number}`,
    name: `V${number} Wedding`,
    style,
    slug: `v${number}-${kebab}`,
    supportsPhoto: PHOTO_LAYOUTS.includes(input.layout),
    ...input,
  };
}

/* ------------------------------------------------------------------ */
/*  Templates                                                          */
/* ------------------------------------------------------------------ */
export const WEDDING_TEMPLATES: readonly WeddingTemplate[] = [
  defineTemplate(1, 'Royal Maroon', {
    description: 'A palace-worthy maroon card with a double gold frame and a glowing mandala crest.',
    category: 'royal', layout: 'royal-frame', motif: 'mandala', popular: true,
    theme: { bg: '#5a0f1f', surface: '#6d1527', ink: '#f6e7cf', primary: '#f3cf7a', accent: '#d4a64a', soft: '#e7c9a3', fontScript: FONT.greatVibes, fontHeading: FONT.cinzel, fontBody: FONT.cormorant, pattern: 'damask' },
    wording: WORDING.hindu, tags: ['gold', 'maroon', 'mandala'],
  }),
  defineTemplate(2, 'Ivory Blush', {
    description: 'Soft ivory paper with blush roses blooming from the corners.',
    category: 'floral', layout: 'floral-corners', motif: 'rose', popular: true,
    theme: { bg: '#fbf6f0', surface: '#ffffff', ink: '#5b4a46', primary: '#b9636b', accent: '#e3a3a6', soft: '#8f7d78', fontScript: FONT.parisienne, fontHeading: FONT.cormorant, fontBody: FONT.cormorant, pattern: 'paper' },
    wording: WORDING.general, tags: ['pastel', 'roses', 'romantic'],
  }),
  defineTemplate(3, 'Gatsby Noir', {
    description: 'Roaring-twenties art deco in black and gold with a sunburst fan.',
    category: 'vintage', layout: 'art-deco', motif: 'deco', popular: true,
    theme: { bg: '#0e0e0e', surface: '#161616', ink: '#efe6d2', primary: '#e2bf6b', accent: '#c9a14a', soft: '#a8997b', fontScript: FONT.greatVibes, fontHeading: FONT.limelight, fontBody: FONT.poiret, pattern: 'sunburst' },
    wording: WORDING.general, tags: ['art deco', 'black', 'gold'],
  }),
  defineTemplate(4, 'Kasavu Gold', {
    description: 'Inspired by the Kerala kasavu saree – cream, gold borders and a glowing nilavilakku.',
    category: 'kerala', layout: 'kerala-kasavu', motif: 'diya', popular: true,
    theme: { bg: '#f8f1de', surface: '#fffaf0', ink: '#4a3b1f', primary: '#7a1f1f', accent: '#c9a13b', soft: '#7d6a45', fontScript: FONT.allura, fontHeading: FONT.marcellus, fontBody: FONT.lora, pattern: 'none' },
    wording: WORDING.kerala, tags: ['kerala', 'kasavu', 'gold'],
  }),
  defineTemplate(5, 'Midnight Stars', {
    description: 'A starry night sky with a golden moon orbit framing your names.',
    category: 'modern', layout: 'celestial', motif: 'crescent',
    theme: { bg: '#0b1736', surface: '#13224a', ink: '#e7ecf7', primary: '#f1d9a0', accent: '#c8b27a', soft: '#a3b0cf', fontScript: FONT.pinyon, fontHeading: FONT.cormorant, fontBody: FONT.cormorant, pattern: 'none' },
    wording: WORDING.general, tags: ['night', 'stars', 'navy'],
  }),
  defineTemplate(6, 'Sage Garden', {
    description: 'A hand-drawn leaf wreath circling your initials on calm sage green.',
    category: 'floral', layout: 'botanical-wreath', motif: 'leaf',
    theme: { bg: '#eef2ea', surface: '#f8faf5', ink: '#3b4a3e', primary: '#3f5d47', accent: '#7f9b84', soft: '#6c7b6f', fontScript: FONT.allura, fontHeading: FONT.cormorant, fontBody: FONT.cormorant, pattern: 'paper' },
    wording: WORDING.general, tags: ['greenery', 'sage', 'wreath'],
  }),
  defineTemplate(7, 'Pure Minimal', {
    description: 'Editorial and modern – oversized date, crisp sans-serif and a terracotta accent.',
    category: 'minimal', layout: 'modern-minimal', motif: 'rings',
    theme: { bg: '#fafaf8', surface: '#ffffff', ink: '#1f1f1f', primary: '#1f1f1f', accent: '#c4673f', soft: '#7a7a7a', fontScript: FONT.italiana, fontHeading: FONT.montserrat, fontBody: FONT.montserrat, pattern: 'none' },
    wording: WORDING.general, tags: ['clean', 'editorial', 'white'],
  }),
  defineTemplate(8, 'Temple Bells', {
    description: 'Marigold toran, temple bells and a mandala on festive saffron.',
    category: 'traditional', layout: 'temple-gate', motif: 'mandala', popular: true,
    theme: { bg: '#fff1d9', surface: '#ffe6bd', ink: '#5c2b0c', primary: '#b3261e', accent: '#e8930c', soft: '#8a5a2b', fontScript: FONT.greatVibes, fontHeading: FONT.cinzel, fontBody: FONT.lora, pattern: 'dots' },
    wording: WORDING.hindu, tags: ['marigold', 'toran', 'festive'],
  }),
  defineTemplate(9, 'Polaroid Love', {
    description: 'A playful kraft-paper scrapbook with a taped polaroid of the two of you.',
    category: 'modern', layout: 'polaroid', motif: 'heart', isNew: true,
    theme: { bg: '#e7d6bb', surface: '#f4e9d6', ink: '#3b2f2f', primary: '#c0392b', accent: '#d98b74', soft: '#6e5a4d', fontScript: FONT.caveat, fontHeading: FONT.caveat, fontBody: FONT.josefin, pattern: 'paper' },
    wording: WORDING.general, tags: ['photo', 'fun', 'kraft'],
  }),
  defineTemplate(10, 'Ancient Scroll', {
    description: 'A rolled parchment scroll sealed with your initials in wax.',
    category: 'vintage', layout: 'ribbon-scroll', motif: 'rose',
    theme: { bg: '#3a2a1c', surface: '#efe0c0', ink: '#4a3420', primary: '#6b2f1a', accent: '#a0522d', soft: '#7a6045', fontScript: FONT.pinyon, fontHeading: FONT.cinzelDeco, fontBody: FONT.cormorant, pattern: 'diagonal' },
    wording: WORDING.general, tags: ['parchment', 'wax seal', 'classic'],
  }),
  defineTemplate(11, 'Nikah Emerald', {
    description: 'A jharokha arch in emerald and gold, crowned with a crescent moon.',
    category: 'nikah', layout: 'arch-window', motif: 'crescent', popular: true,
    theme: { bg: '#0d4436', surface: '#115443', ink: '#f2ead3', primary: '#f0cf82', accent: '#cfa94d', soft: '#bfd3c6', fontScript: FONT.greatVibes, fontHeading: FONT.marcellus, fontBody: FONT.cormorant, pattern: 'damask' },
    wording: WORDING.nikah, tags: ['emerald', 'arch', 'crescent'],
  }),
  defineTemplate(12, 'Pop Colour', {
    description: 'Loud, happy and modern – giant names on hot pink and sunny yellow blocks.',
    category: 'modern', layout: 'bold-typo', motif: 'heart', isNew: true,
    theme: { bg: '#ff4f7b', surface: '#ffd23f', ink: '#1d1d1d', primary: '#ffffff', accent: '#1d1d1d', soft: '#3d3d3d', fontScript: FONT.dancing, fontHeading: FONT.abril, fontBody: FONT.poppins, pattern: 'none' },
    wording: WORDING.general, tags: ['colourful', 'bold', 'fun'],
  }),
  defineTemplate(13, 'Grace Chapel', {
    description: 'A white chapel arch with dusty-blue details and a delicate cross.',
    category: 'christian', layout: 'arch-window', motif: 'cross',
    theme: { bg: '#eef2f7', surface: '#ffffff', ink: '#33435a', primary: '#4b6a8f', accent: '#8ea6c4', soft: '#6b7a8f', fontScript: FONT.pinyon, fontHeading: FONT.cormorant, fontBody: FONT.cormorant, pattern: 'none' },
    wording: WORDING.christian, tags: ['church', 'dusty blue', 'arch'],
  }),
  defineTemplate(14, 'Peacock Royale', {
    description: 'Deep peacock teal with gold frames and feather crests.',
    category: 'royal', layout: 'royal-frame', motif: 'peacock',
    theme: { bg: '#0b3d48', surface: '#0f4c59', ink: '#e7f1ef', primary: '#f2cf72', accent: '#d2a944', soft: '#9cc4c0', fontScript: FONT.greatVibes, fontHeading: FONT.cinzel, fontBody: FONT.cormorant, pattern: 'damask' },
    wording: WORDING.hindu, tags: ['peacock', 'teal', 'gold'],
  }),
  defineTemplate(15, 'Lotus Pond', {
    description: 'Pink lotuses floating in the corners of a fresh, sacred design.',
    category: 'traditional', layout: 'floral-corners', motif: 'lotus',
    theme: { bg: '#fdf3f5', surface: '#ffffff', ink: '#4c3540', primary: '#c2416b', accent: '#e58aa7', soft: '#7f6470', fontScript: FONT.greatVibes, fontHeading: FONT.marcellus, fontBody: FONT.lora, pattern: 'none' },
    wording: WORDING.hindu, tags: ['lotus', 'pink', 'sacred'],
  }),
  defineTemplate(16, 'Beach Vows', {
    description: 'Sun, sand and sea – a breezy split design for destination weddings.',
    category: 'destination', layout: 'photo-split', motif: 'wave', popular: true,
    theme: { bg: '#f6efe3', surface: '#2a8fa8', ink: '#2f4a52', primary: '#1f6f84', accent: '#e9b26d', soft: '#6f8a8f', fontScript: FONT.sacramento, fontHeading: FONT.josefin, fontBody: FONT.josefin, pattern: 'none' },
    wording: WORDING.general, tags: ['beach', 'photo', 'ocean'],
  }),
  defineTemplate(17, 'Rose Gold Glam', {
    description: 'Art deco geometry reimagined in blush pink and shimmering rose gold.',
    category: 'royal', layout: 'art-deco', motif: 'deco', isNew: true,
    theme: { bg: '#f7e4df', surface: '#fbefec', ink: '#5a3b3b', primary: '#b76e79', accent: '#c9917f', soft: '#8f6d6a', fontScript: FONT.greatVibes, fontHeading: FONT.poiret, fontBody: FONT.poiret, pattern: 'sunburst' },
    wording: WORDING.general, tags: ['rose gold', 'blush', 'glam'],
  }),
  defineTemplate(18, 'Kolam Classic', {
    description: 'South Indian kolam patterns, mustard and maroon pillars under a mango-leaf toran.',
    category: 'traditional', layout: 'temple-gate', motif: 'kolam',
    theme: { bg: '#fbf0d0', surface: '#f6e2a8', ink: '#4a1f12', primary: '#7d1e1e', accent: '#c58a12', soft: '#7a5a35', fontScript: FONT.allura, fontHeading: FONT.marcellus, fontBody: FONT.lora, pattern: 'dots' },
    wording: WORDING.hindu, tags: ['kolam', 'south indian', 'mustard'],
  }),
  defineTemplate(19, 'Lavender Dream', {
    description: 'A dreamy lavender wreath with soft blooms and airy script.',
    category: 'floral', layout: 'botanical-wreath', motif: 'rose',
    theme: { bg: '#f3eff9', surface: '#ffffff', ink: '#4a4160', primary: '#6f5a9e', accent: '#a996cf', soft: '#7c7392', fontScript: FONT.parisienne, fontHeading: FONT.cormorant, fontBody: FONT.cormorant, pattern: 'paper' },
    wording: WORDING.general, tags: ['lavender', 'pastel', 'wreath'],
  }),
  defineTemplate(20, 'Mughal Arch', {
    description: 'An ivory Mughal arch with deep ruby accents and a mandala crown.',
    category: 'royal', layout: 'arch-window', motif: 'mandala',
    theme: { bg: '#f7efe2', surface: '#fffaf2', ink: '#4a2424', primary: '#9b1c31', accent: '#c19a4b', soft: '#7d5c55', fontScript: FONT.greatVibes, fontHeading: FONT.cinzel, fontBody: FONT.cormorant, pattern: 'damask' },
    wording: WORDING.hindu, tags: ['mughal', 'ivory', 'ruby'],
  }),
  defineTemplate(21, 'Monogram Luxe', {
    description: 'Navy and white luxury with a large interlaced monogram.',
    category: 'minimal', layout: 'monogram', motif: 'rings',
    theme: { bg: '#f9f8f4', surface: '#ffffff', ink: '#1d2b44', primary: '#1d2b44', accent: '#b49a5e', soft: '#6a7385', fontScript: FONT.pinyon, fontHeading: FONT.cinzel, fontBody: FONT.cormorant, pattern: 'none' },
    wording: WORDING.general, tags: ['monogram', 'navy', 'luxury'],
  }),
  defineTemplate(22, 'Sunset Boho', {
    description: 'Terracotta arch, pampas leaves and warm desert-sunset tones.',
    category: 'destination', layout: 'arch-window', motif: 'leaf', isNew: true,
    theme: { bg: '#f4e6d8', surface: '#fbf3ea', ink: '#5a3a2a', primary: '#c0603f', accent: '#d9a27c', soft: '#8a6b5a', fontScript: FONT.sacramento, fontHeading: FONT.playfair, fontBody: FONT.josefin, pattern: 'none' },
    wording: WORDING.general, tags: ['boho', 'terracotta', 'sunset'],
  }),
  defineTemplate(23, 'Kerala Mural', {
    description: 'Deep mural green with kasavu gold borders and a peacock blessing.',
    category: 'kerala', layout: 'kerala-kasavu', motif: 'peacock',
    theme: { bg: '#123d2b', surface: '#184a35', ink: '#f2e8cc', primary: '#f0cd73', accent: '#d4a83f', soft: '#bcd1bf', fontScript: FONT.allura, fontHeading: FONT.marcellus, fontBody: FONT.lora, pattern: 'none' },
    wording: WORDING.kerala, tags: ['kerala', 'mural', 'green'],
  }),
  defineTemplate(24, 'Starry Nikah', {
    description: 'A royal-purple night sky, golden crescent and twinkling stars.',
    category: 'nikah', layout: 'celestial', motif: 'crescent',
    theme: { bg: '#2a1440', surface: '#3a1d58', ink: '#efe6f7', primary: '#f2d27f', accent: '#cfae5a', soft: '#c7b5dc', fontScript: FONT.greatVibes, fontHeading: FONT.marcellus, fontBody: FONT.cormorant, pattern: 'none' },
    wording: WORDING.nikah, tags: ['purple', 'stars', 'crescent'],
  }),
  defineTemplate(25, 'Vintage Letter', {
    description: 'A sepia love letter on aged paper, finished with a crimson seal.',
    category: 'vintage', layout: 'ribbon-scroll', motif: 'heart',
    theme: { bg: '#6b4f3a', surface: '#f3e6cf', ink: '#4b3a2c', primary: '#8c1c13', accent: '#b0412e', soft: '#7b6652', fontScript: FONT.dancing, fontHeading: FONT.playfair, fontBody: FONT.lora, pattern: 'paper' },
    wording: WORDING.general, tags: ['sepia', 'letter', 'seal'],
  }),
  defineTemplate(26, 'Emerald Church', {
    description: 'White roses and emerald leaves framing a classic church invitation.',
    category: 'christian', layout: 'floral-corners', motif: 'leaf',
    theme: { bg: '#fbfbf7', surface: '#ffffff', ink: '#2e3b32', primary: '#1f5a3f', accent: '#5d9474', soft: '#6c7a70', fontScript: FONT.pinyon, fontHeading: FONT.cormorant, fontBody: FONT.cormorant, pattern: 'none' },
    wording: WORDING.christian, tags: ['church', 'greenery', 'white'],
  }),
  defineTemplate(27, 'Ruby Mandala', {
    description: 'A huge glowing mandala behind your initials in ruby red and gold.',
    category: 'traditional', layout: 'monogram', motif: 'mandala', popular: true,
    theme: { bg: '#8e1027', surface: '#a3152f', ink: '#fbe9d6', primary: '#f6d27d', accent: '#e0b453', soft: '#f1c6b0', fontScript: FONT.greatVibes, fontHeading: FONT.cinzel, fontBody: FONT.cormorant, pattern: 'none' },
    wording: WORDING.hindu, tags: ['red', 'mandala', 'gold'],
  }),
  defineTemplate(28, 'Mint Fresh', {
    description: 'Cool mint and deep teal – a fresh, airy, modern-minimal invite.',
    category: 'minimal', layout: 'modern-minimal', motif: 'leaf',
    theme: { bg: '#e3f4ec', surface: '#f3fbf7', ink: '#17423d', primary: '#17423d', accent: '#2f9c86', soft: '#5d7f78', fontScript: FONT.italiana, fontHeading: FONT.josefin, fontBody: FONT.josefin, pattern: 'grid' },
    wording: WORDING.general, tags: ['mint', 'fresh', 'clean'],
  }),
  defineTemplate(29, 'Neon Night', {
    description: 'Electric neon pink and cyan on midnight purple – a party-ready invite.',
    category: 'modern', layout: 'bold-typo', motif: 'sparkle',
    theme: { bg: '#1c0f33', surface: '#ff3ea5', ink: '#f4f0ff', primary: '#2ff3e0', accent: '#ff3ea5', soft: '#b7a8d8', fontScript: FONT.dancing, fontHeading: FONT.abril, fontBody: FONT.poppins, pattern: 'grid' },
    wording: WORDING.general, tags: ['neon', 'party', 'dark'],
  }),
  defineTemplate(30, 'Golden Wreath', {
    description: 'A gilded laurel wreath on jet black – timeless and dramatic.',
    category: 'royal', layout: 'botanical-wreath', motif: 'leaf',
    theme: { bg: '#121212', surface: '#1b1b1b', ink: '#efe7d4', primary: '#e3c06e', accent: '#c9a14a', soft: '#a39880', fontScript: FONT.greatVibes, fontHeading: FONT.cinzel, fontBody: FONT.cormorant, pattern: 'none' },
    wording: WORDING.general, tags: ['black', 'gold', 'laurel'],
  }),
  defineTemplate(31, 'Palm Paradise', {
    description: 'Tropical palms and lush greens for an island or resort wedding.',
    category: 'destination', layout: 'photo-split', motif: 'leaf',
    theme: { bg: '#f2f6ec', surface: '#2f6b4f', ink: '#24402f', primary: '#2f6b4f', accent: '#e39b4a', soft: '#5f7a69', fontScript: FONT.sacramento, fontHeading: FONT.playfair, fontBody: FONT.josefin, pattern: 'none' },
    wording: WORDING.general, tags: ['tropical', 'resort', 'green'],
  }),
  defineTemplate(32, 'Ivory Cathedral', {
    description: 'Classic ivory and navy with ornate gold frames and a cross crest.',
    category: 'christian', layout: 'royal-frame', motif: 'cross',
    theme: { bg: '#fbf7ee', surface: '#ffffff', ink: '#26324a', primary: '#1f2d4d', accent: '#b8954d', soft: '#6b7386', fontScript: FONT.pinyon, fontHeading: FONT.cinzel, fontBody: FONT.cormorant, pattern: 'none' },
    wording: WORDING.christian, tags: ['ivory', 'navy', 'classic'],
  }),
  defineTemplate(33, 'Haldi Sunshine', {
    description: 'Bright turmeric yellow and marigold orange for a joyful celebration.',
    category: 'traditional', layout: 'temple-gate', motif: 'lotus', isNew: true,
    theme: { bg: '#fff6c9', surface: '#ffe680', ink: '#5a3a00', primary: '#d35400', accent: '#f39c12', soft: '#8a6a2a', fontScript: FONT.dancing, fontHeading: FONT.marcellus, fontBody: FONT.poppins, pattern: 'dots' },
    wording: WORDING.hindu, tags: ['haldi', 'yellow', 'marigold'],
  }),
  defineTemplate(34, 'Ocean Polaroid', {
    description: 'A seaside scrapbook – polaroid, washi tape and ocean-blue ink.',
    category: 'destination', layout: 'polaroid', motif: 'wave',
    theme: { bg: '#dbeaf2', surface: '#eef6fa', ink: '#1f3a4d', primary: '#1f6fa1', accent: '#6fb3d2', soft: '#4f6b7d', fontScript: FONT.caveat, fontHeading: FONT.caveat, fontBody: FONT.josefin, pattern: 'grid' },
    wording: WORDING.general, tags: ['ocean', 'photo', 'scrapbook'],
  }),
  defineTemplate(35, 'Royal Amethyst', {
    description: 'Regal amethyst purple and gold in a symmetrical art deco frame.',
    category: 'royal', layout: 'art-deco', motif: 'sparkle',
    theme: { bg: '#2b1240', surface: '#371a52', ink: '#efe3f6', primary: '#e8c76f', accent: '#c9a14a', soft: '#c3aed6', fontScript: FONT.greatVibes, fontHeading: FONT.cinzelDeco, fontBody: FONT.cormorant, pattern: 'sunburst' },
    wording: WORDING.general, tags: ['purple', 'gold', 'deco'],
  }),
  defineTemplate(36, 'Henna Night', {
    description: 'Mehendi-green paisleys and henna-brown script for a Mehendi or Nikah.',
    category: 'nikah', layout: 'floral-corners', motif: 'paisley',
    theme: { bg: '#f3efdc', surface: '#fffbea', ink: '#4a3a22', primary: '#7a4a1f', accent: '#6b8e23', soft: '#7a6a4a', fontScript: FONT.greatVibes, fontHeading: FONT.marcellus, fontBody: FONT.lora, pattern: 'paper' },
    wording: WORDING.nikah, tags: ['mehendi', 'paisley', 'henna'],
  }),
  // Nikah collection (animated) – see nikah-cards.data.ts
  ...NIKAH_CARDS,
];
