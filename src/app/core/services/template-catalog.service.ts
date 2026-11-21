import { Injectable } from '@angular/core';
import { CategoryInfo, DesignFeature, DesignKind, TemplateCategory, WeddingDesign } from '../models/wedding-template.model';
import { TEMPLATE_CATEGORIES } from '../../data/design-tokens';
import { WEDDING_TEMPLATES } from '../../data/wedding-templates.data';
import { WEDDING_WEBSITES } from '../../data/wedding-websites.data';

export type TemplateSort = 'featured' | 'number' | 'popular' | 'newest';

/**
 * How eye-catching a design is, for the default 'featured' order:
 * 3D venue walk-throughs, then 3D journeys, other 3D, invite series, animated, the rest.
 */
export function appeal(d: WeddingDesign): number {
  if (d.kind === 'website') {
    if (d.venue3d) return 6;
    if (d.hero === 'journey3d') return 5;
    if (d.threeD) return 4;
    if (d.invite) return 3;
  } else if (d.threeD) return 4;
  if (d.animated) return 2;
  return d.scratch ? 1 : 0;
}

export interface TemplateQuery {
  kind: DesignKind;
  search: string;
  category: TemplateCategory | 'all';
  sort: TemplateSort;
  feature?: DesignFeature | 'all';
  onlyIds?: ReadonlySet<string>;
}

/** Read-only access to both catalogues (cards & websites): search, filter, related… */
@Injectable({ providedIn: 'root' })
export class TemplateCatalogService {
  readonly all: readonly WeddingDesign[] = [...WEDDING_TEMPLATES, ...WEDDING_WEBSITES];
  readonly categories: readonly CategoryInfo[] = TEMPLATE_CATEGORIES;

  ofKind(kind: DesignKind): readonly WeddingDesign[] {
    return kind === 'card' ? WEDDING_TEMPLATES : WEDDING_WEBSITES;
  }

  total(kind: DesignKind): number {
    return this.ofKind(kind).length;
  }

  /** Slugs are unique across products (`v…` cards, `w…` websites). */
  bySlug(slug: string): WeddingDesign | undefined {
    const key = slug.toLowerCase();
    return this.all.find((d) => d.slug === key || d.id === key);
  }

  categoryLabel(id: TemplateCategory): string {
    return this.categories.find((c) => c.id === id)?.label ?? id;
  }

  countIn(kind: DesignKind, category: TemplateCategory): number {
    return this.ofKind(kind).filter((d) => d.category === category).length;
  }

  popular(kind: DesignKind, limit = 8): WeddingDesign[] {
    // Most attractive (3D) favourites first.
    const num = (d: WeddingDesign) => Number(d.id.slice(1));
    return this.ofKind(kind)
      .filter((d) => d.popular)
      .sort((a, b) => appeal(b) - appeal(a) || num(b) - num(a))
      .slice(0, limit);
  }

  /** Does the design have the given feature (animated / scratch)? */
  hasFeature(design: WeddingDesign, feature: DesignFeature): boolean {
    if (feature === 'scratch') return !!design.scratch;
    if (feature === '3d') return !!design.threeD;
    return !!design.animated;
  }

  countWithFeature(kind: DesignKind, feature: DesignFeature): number {
    return this.ofKind(kind).filter((d) => this.hasFeature(d, feature)).length;
  }

  query({ kind, search, category, sort, feature = 'all', onlyIds }: TemplateQuery): WeddingDesign[] {
    const term = search.trim().toLowerCase();

    const result = this.ofKind(kind).filter((d) => {
      if (category !== 'all' && d.category !== category) return false;
      if (feature !== 'all' && !this.hasFeature(d, feature)) return false;
      if (onlyIds && !onlyIds.has(d.id)) return false;
      if (!term) return true;
      const haystack = [d.name, d.code, d.style, d.description, d.category, ...d.tags].join(' ').toLowerCase();
      return haystack.includes(term);
    });

    const num = (d: WeddingDesign) => Number(d.id.slice(1));
    switch (sort) {
      case 'popular':
        return result.sort((a, b) => Number(!!b.popular) - Number(!!a.popular) || num(a) - num(b));
      case 'featured':
        // 3D & most attractive first; popular ones lead each group, then the newest.
        return result.sort((a, b) => appeal(b) - appeal(a) || Number(!!b.popular) - Number(!!a.popular) || num(b) - num(a));
      case 'newest':
        return result.sort((a, b) => Number(!!b.isNew) - Number(!!a.isNew) || num(b) - num(a));
      default:
        return result.sort((a, b) => num(a) - num(b));
    }
  }

  /** Same product; same category first, then same structure. */
  related(design: WeddingDesign, limit = 4): WeddingDesign[] {
    const structure = (d: WeddingDesign) => (d.kind === 'card' ? d.layout : d.hero);
    const score = (d: WeddingDesign) =>
      (d.category === design.category ? 2 : 0) + (structure(d) === structure(design) ? 1 : 0);
    return this.ofKind(design.kind)
      .filter((d) => d.id !== design.id)
      .map((d) => ({ d, s: score(d) }))
      .sort((a, b) => b.s - a.s)
      .slice(0, limit)
      .map(({ d }) => d);
  }

  /** Previous / next design of the same product (wraps around). */
  neighbours(design: WeddingDesign): { previous: WeddingDesign; next: WeddingDesign } {
    const list = this.ofKind(design.kind);
    const index = list.indexOf(design);
    return {
      previous: list[(index - 1 + list.length) % list.length],
      next: list[(index + 1) % list.length],
    };
  }
}
