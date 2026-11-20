import { DesignKind, WeddingDesign } from '../models/wedding-template.model';

export interface ProductInfo {
  readonly kind: DesignKind;
  /** Plural label for menus, e.g. "Invitation Websites". */
  readonly label: string;
  /** Used inside sentences and WhatsApp messages. */
  readonly singular: string;
  readonly shortDescription: string;
  /** Route segment of the gallery & detail pages. */
  readonly basePath: string;
  /** Route segment of the full-screen demo. */
  readonly demoPath: string;
  readonly codePrefix: string;
}

/** The two products sold on the site. Routing and wording are derived from here. */
export const PRODUCTS: Readonly<Record<DesignKind, ProductInfo>> = {
  card: {
    kind: 'card',
    label: 'Invitation Cards',
    singular: 'digital wedding invitation card',
    shortDescription: 'A beautiful e-invite card to share on WhatsApp and Instagram.',
    basePath: '/templates',
    demoPath: '/demo',
    codePrefix: 'V',
  },
  website: {
    kind: 'website',
    label: 'Invitation Websites',
    singular: 'wedding invitation website',
    shortDescription: 'A full wedding website: story, events, gallery, venue map, countdown & RSVP.',
    basePath: '/websites',
    demoPath: '/site',
    codePrefix: 'W',
  },
};

/** Router link to a design's detail page, e.g. `['/websites', 'w7-the-wedding-issue']`. */
export const detailLink = (design: WeddingDesign): string[] => [PRODUCTS[design.kind].basePath, design.slug];

/** Router link to a design's full-screen demo. */
export const demoLink = (design: WeddingDesign): string[] => [PRODUCTS[design.kind].demoPath, design.slug];
