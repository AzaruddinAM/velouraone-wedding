import { SectionStyle, TemplateCategory, WebsiteTemplate } from '../core/models/wedding-template.model';

/**
 * Gives every website its own look for the sections below the first screen
 * (welcome, couple, story, events, gallery, venue, RSVP), so no two neighbouring
 * designs look alike after the hero.
 *
 * Looks are chosen from those that suit the design's category; dark designs get the
 * gold "luxe" look first, light designs never get it. Each pick avoids the looks of
 * the two previous designs and spreads the looks evenly.
 */
const LOOKS_BY_CATEGORY: Record<TemplateCategory, readonly SectionStyle[]> = {
  royal: ['arch', 'framed', 'magazine', 'timeline', 'classic', 'glass'],
  traditional: ['framed', 'arch', 'timeline', 'garden', 'classic', 'cards'],
  kerala: ['framed', 'timeline', 'garden', 'arch', 'cards'],
  floral: ['garden', 'glass', 'postcard', 'cards', 'timeline'],
  modern: ['glass', 'minimal', 'magazine', 'bold', 'postcard', 'cards'],
  minimal: ['minimal', 'magazine', 'editorial', 'timeline'],
  christian: ['framed', 'minimal', 'timeline', 'garden', 'classic'],
  nikah: ['arch', 'framed', 'glass', 'timeline', 'garden', 'magazine', 'cards'],
  destination: ['postcard', 'glass', 'timeline', 'magazine', 'garden'],
  vintage: ['postcard', 'editorial', 'framed', 'magazine'],
};

function isDark(hex: string): boolean {
  const n = parseInt(hex.replace('#', '').slice(0, 6), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((c) => {
    const v = c / 255;
    return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b < 0.12;
}

export function assignSectionLooks(websites: readonly WebsiteTemplate[]): WebsiteTemplate[] {
  const used = new Map<SectionStyle, number>();
  const recent: SectionStyle[] = [];

  return websites.map((site) => {
    // The Invite series has its own page layout.
    if (site.invite) return site;

    const dark = isDark(site.theme.bg);
    const pool: SectionStyle[] = dark
      ? ['luxe', ...LOOKS_BY_CATEGORY[site.category], 'luxe']
      : [...LOOKS_BY_CATEGORY[site.category]];

    // Fewest uses first; never the same as either of the two previous designs.
    let best: SectionStyle = pool[0];
    let bestScore = Infinity;
    pool.forEach((look, order) => {
      if (recent.includes(look)) return;
      const score = (used.get(look) ?? 0) * 10 + order + (dark && look === 'luxe' ? -15 : 0);
      if (score < bestScore) {
        bestScore = score;
        best = look;
      }
    });

    used.set(best, (used.get(best) ?? 0) + 1);
    recent.push(best);
    if (recent.length > 2) recent.shift();
    return { ...site, sectionStyle: best };
  });
}
