import { WeddingDesign } from '../models/wedding-template.model';

/**
 * Prices (Indian rupees). Change the numbers here only – tiles, design pages,
 * the Prices page, sorting and WhatsApp order messages all read from this file.
 * Nothing costs more than ₹1,299.
 */
export const PRICES = {
  card: {
    classic: 99,
    animated: 149,
    scratch: 199,
  },
  website: {
    classic: 499,
    animatedNikah: 599,
    invite: 699,
    threeD: 799,
    journey: 999,
    venue: 1099,
    realistic: 1299,
  },
} as const;

export interface PriceTier {
  readonly label: string;
  readonly designs: string;
  readonly price: number;
  readonly note?: string;
  readonly highlight?: boolean;
}

/** Shown on the Prices page (same order as the gallery: simplest first). */
export const CARD_TIERS: readonly PriceTier[] = [
  { label: 'Classic card', designs: 'Elegant still designs', price: PRICES.card.classic },
  { label: 'Animated card', designs: 'Moving details, incl. Nikah', price: PRICES.card.animated },
  { label: 'Scratch-to-reveal card', designs: 'Guests scratch to see the date', price: PRICES.card.scratch },
];

export const WEBSITE_TIERS: readonly PriceTier[] = [
  { label: 'Classic website', designs: 'W1 – W34', price: PRICES.website.classic },
  { label: 'Animated Nikah website', designs: 'W35 – W52', price: PRICES.website.animatedNikah },
  { label: 'Invite & Stationery series', designs: 'W83 – W92 · W114 – W123', price: PRICES.website.invite, note: 'Opening animation, music, wishes wall' },
  { label: '3D website', designs: 'W53 – W62', price: PRICES.website.threeD },
  { label: '3D walk-through journey', designs: 'W63 – W82', price: PRICES.website.journey, highlight: true },
  { label: '3D venue series', designs: 'W93 – W105', price: PRICES.website.venue },
  { label: 'Realistic 3D', designs: 'W106 – W113', price: PRICES.website.realistic, note: 'Real 3D furniture, chandeliers & lighting' },
];

export const ADD_ONS: readonly { label: string; price: string }[] = [
  { label: 'Express delivery within 24 hours', price: '+₹149' },
  { label: 'Extra event page (Haldi, Mehendi, Reception…)', price: '+₹99 each' },
  { label: 'Your own web address (e.g. ananyaweds.in)', price: '+₹699 / year' },
  { label: 'Changes after 2 free rounds', price: '₹99 each' },
  { label: 'Hosting after the first 6 months (included)', price: '₹299 / year' },
];

export const BUNDLES: readonly { label: string; detail: string; price: string }[] = [
  { label: 'Card + website', detail: 'Any card with any website', price: '₹100 off' },
  { label: 'Wedding package – Classic', detail: 'Website, invitation card and save-the-date', price: '₹799' },
  { label: 'Wedding package – Realistic 3D', detail: 'Realistic 3D website, card and save-the-date', price: '₹1,299' },
];

/** Price of a design, from its series (new designs are priced automatically). */
export function priceOf(design: WeddingDesign): number {
  if (design.kind === 'card') {
    if (design.scratch) return PRICES.card.scratch;
    if (design.animated) return PRICES.card.animated;
    return PRICES.card.classic;
  }
  if (design.realistic) return PRICES.website.realistic;
  if (design.venue3d) return PRICES.website.venue;
  if (design.hero === 'journey3d') return PRICES.website.journey;
  if (design.threeD) return PRICES.website.threeD;
  if (design.invite) return PRICES.website.invite;
  if (design.animated || design.scratch) return PRICES.website.animatedNikah;
  return PRICES.website.classic;
}

/** e.g. `₹1,299` */
export function formatPrice(price: number): string {
  return `₹${price.toLocaleString('en-IN')}`;
}
