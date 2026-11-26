/* ==========================================================================
   Design models.
   The site sells two products that share the same catalogue features:
     • `card`    – digital invitation card   (V1 Wedding … )
     • `website` – invitation website         (W1 Wedding Website … )
   ========================================================================== */

export type DesignKind = 'card' | 'website';

/** Structural design of an invitation card. Every layout is its own component. */
export type TemplateLayout =
  | 'royal-frame'
  | 'arch-window'
  | 'floral-corners'
  | 'modern-minimal'
  | 'photo-split'
  | 'temple-gate'
  | 'art-deco'
  | 'celestial'
  | 'polaroid'
  | 'botanical-wreath'
  | 'ribbon-scroll'
  | 'bold-typo'
  | 'kerala-kasavu'
  | 'monogram'
  // Nikah collection (animated)
  | 'lantern-arch'
  | 'girih-medallion'
  | 'mosque-skyline'
  | 'mashrabiya-doors'
  | 'scratch-circles'
  | 'scratch-ticket';

/** Opening (hero) screen of an invitation website. Every hero is its own component. */
export type WebsiteHero =
  | 'frame'
  | 'split'
  | 'fullbleed'
  | 'arch'
  | 'seal'
  | 'editorial'
  | 'curtain'
  | 'wreath'
  | 'starry'
  | 'toran'
  | 'polaroid'
  | 'kasavu'
  | 'marquee'
  | 'floral'
  // Nikah collection (animated)
  | 'lantern'
  | 'mosque'
  | 'doors'
  | 'girih'
  | 'scratch'
  | 'petals'
  // Real-time 3D (WebGL) – the scene is chosen by `scene3d`
  | 'scene3d'
  // Scroll-driven 3D walk-through of a realistic scene
  | 'journey3d'
  // Mobile-first invitation site with an opening screen and music (see `invite`)
  | 'invite';

/** How an Invite-series website opens. */
export type InviteIntro = 'envelope' | 'welcome' | 'doors' | 'curtain' | 'scroll' | 'waxseal' | 'bow' | 'inkbloom' | 'crescent' | 'pocket';
/** Illustrated backdrop behind the Invite-series hero. */
export type InviteBackdrop = 'palace' | 'garden' | 'lanterns' | 'dome' | 'photo' | 'jaali' | 'cotton' | 'linen' | 'marble' | 'celestial' | 'watercolor';
/** Card look of the Invite-series sections. */
export type InviteCards = 'glass' | 'framed' | 'editorial';

export interface InviteStyle {
  readonly intro: InviteIntro;
  readonly backdrop: InviteBackdrop;
  readonly cards: InviteCards;
  /** Gentle looping particles over the hero. */
  readonly particles: 'petal' | 'spark' | 'star' | 'none';
}

/** 3D scenes available to the `scene3d` hero. */
export type Scene3DKind =
  | 'mosque'
  | 'lanterns'
  | 'rings'
  | 'girih'
  | 'crescent'
  // Realistic environments (used by the 3D journey hero)
  | 'garden'
  | 'palace'
  | 'beach'
  | 'hall'
  | 'cake'
  // Venue series (walk-throughs that end at an invitation panel with the names)
  | 'moonstairs'
  | 'portal'
  | 'floraldoor'
  | 'gothic'
  | 'pearl'
  | 'storybook'
  | 'mirrorhall'
  | 'grotto'
  | 'gallery'
  | 'velvet'
  | 'arcade'
  | 'theatre'
  | 'ballroom'
  // Realistic series (real HDR light, PBR surfaces, GLB furniture & chandeliers)
  | 'realballroom'
  | 'realterrace'
  | 'reallantern'
  | 'realesplanade'
  | 'realbay'
  | 'reallounge'
  | 'realcake'
  | 'realgallery';

/** How the website's content sections look. */
export type SectionStyle =
  | 'classic'
  | 'cards'
  | 'editorial'
  | 'bold'
  // Structural looks (layouts change, not just colours)
  | 'timeline'
  | 'arch'
  | 'glass'
  | 'framed'
  | 'magazine'
  | 'postcard'
  | 'luxe'
  | 'minimal'
  | 'garden';

/** Hand-drawn SVG ornaments available to every design. */
export type MotifName =
  | 'mandala'
  | 'lotus'
  | 'rose'
  | 'leaf'
  | 'sparkle'
  | 'deco'
  | 'kolam'
  | 'peacock'
  | 'heart'
  | 'diya'
  | 'crescent'
  | 'cross'
  | 'wave'
  | 'paisley'
  | 'rings'
  | 'lantern'
  | 'star8'
  | 'dome';

/** Subtle background texture. */
export type BackgroundPattern = 'none' | 'dots' | 'grid' | 'diagonal' | 'damask' | 'paper' | 'sunburst';

export type TemplateCategory =
  | 'royal'
  | 'traditional'
  | 'kerala'
  | 'floral'
  | 'modern'
  | 'minimal'
  | 'christian'
  | 'nikah'
  | 'destination'
  | 'vintage';

export interface CategoryInfo {
  readonly id: TemplateCategory;
  readonly label: string;
  readonly description: string;
}

/** Colours and fonts – applied as CSS custom properties. */
export interface TemplateTheme {
  readonly bg: string;
  readonly surface: string;
  readonly ink: string;
  readonly primary: string;
  readonly accent: string;
  readonly soft: string;
  readonly fontScript: string;
  readonly fontHeading: string;
  readonly fontBody: string;
  readonly pattern: BackgroundPattern;
}

/** Default wording that suits the ceremony style. */
export interface TemplateWording {
  readonly opening: string;
  readonly invitation: string;
  /** Optional Arabic line (e.g. Bismillah) shown by the Nikah designs. */
  readonly arabic?: string;
  /** English meaning shown under the Arabic line. */
  readonly arabicMeaning?: string;
}

/** Fields shared by every design, whatever the product. */
export interface DesignBase {
  readonly kind: DesignKind;
  /** Stable id, e.g. `v7` or `w7`. */
  readonly id: string;
  /** Short code shown on badges and in orders, e.g. `V7` / `W7`. */
  readonly code: string;
  /** Display name, e.g. `V7 Wedding` / `W7 Wedding Website`. */
  readonly name: string;
  /** Style name, e.g. `Gatsby Noir`. */
  readonly style: string;
  /** URL segment, e.g. `v7-gatsby-noir`. */
  readonly slug: string;
  readonly description: string;
  readonly category: TemplateCategory;
  readonly motif: MotifName;
  readonly theme: TemplateTheme;
  readonly wording: TemplateWording;
  readonly tags: readonly string[];
  /** Whether the design shows the couple photo. */
  readonly supportsPhoto: boolean;
  readonly popular?: boolean;
  readonly isNew?: boolean;
  /** Has entrance / looping animations. */
  readonly animated?: boolean;
  /** Guests scratch gold foil to reveal the date. */
  readonly scratch?: boolean;
  /** Has a real-time 3D (WebGL) scene. */
  readonly threeD?: boolean;
}

/** Quick filters shown in the galleries. */
export type DesignFeature = 'animated' | 'scratch' | '3d';

/** Digital invitation card. */
export interface WeddingTemplate extends DesignBase {
  readonly kind: 'card';
  readonly layout: TemplateLayout;
}

/** One function on the wedding website's schedule. */
export interface WebsiteEvent {
  readonly name: string;
  /** Days relative to the wedding date (-1 = day before). */
  readonly dayOffset: number;
  /** `hh:mm`; empty = use the couple's wedding time. */
  readonly time: string;
}

/** Wedding invitation website. */
export interface WebsiteTemplate extends DesignBase {
  readonly kind: 'website';
  readonly hero: WebsiteHero;
  readonly sectionStyle: SectionStyle;
  readonly events: readonly WebsiteEvent[];
  /** Which 3D scene to show when `hero` is `scene3d` or `journey3d`. */
  readonly scene3d?: Scene3DKind;
  /** Invite-series settings (when `hero` is `invite`). */
  readonly invite?: InviteStyle;
  /** Venue series: the 3D scene itself carries the invitation (names on a panel). */
  readonly venue3d?: boolean;
  /** Realistic series: real-world HDR lighting and 3D models. */
  readonly realistic?: boolean;
}

export type WeddingDesign = WeddingTemplate | WebsiteTemplate;
