import { DOCUMENT, Injectable, inject } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { BRAND } from '../constants/brand.constants';
import { priceOf } from '../constants/pricing.constants';
import { WeddingDesign } from '../models/wedding-template.model';
import { TemplateCatalogService } from './template-catalog.service';

/** Search-engine and social-share description of one page. */
interface PageSeo {
  readonly description: string;
  /** Path of the preferred URL for this content (duplicates point here). */
  readonly canonicalPath: string;
  readonly image?: string;
  readonly noindex?: boolean;
  readonly jsonLd: readonly object[];
}

const ORIGIN = BRAND.siteUrl;
const LOGO = `${ORIGIN}/${BRAND.logo}`;

/**
 * Keeps meta description, canonical link, Open Graph / Twitter tags, robots and
 * JSON-LD structured data in step with the current page.
 * (The WhatsApp number is deliberately never included anywhere.)
 */
@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly meta = inject(Meta);
  private readonly document = inject(DOCUMENT);
  private readonly router = inject(Router);
  private readonly catalog = inject(TemplateCatalogService);

  /** Call once from the app shell. */
  start(): void {
    this.router.events.pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd)).subscribe(() => {
      // Titles are set by the router title strategy just before NavigationEnd.
      queueMicrotask(() => this.apply(this.describe(this.deepest(this.router.routerState.snapshot.root))));
    });
  }

  private deepest(route: ActivatedRouteSnapshot): ActivatedRouteSnapshot {
    while (route.firstChild) route = route.firstChild;
    return route;
  }

  private describe(route: ActivatedRouteSnapshot): PageSeo {
    const path = '/' + route.pathFromRoot.flatMap((r) => r.url.map((u) => u.path)).join('/');
    const slug = route.paramMap.get('slug');
    const design = slug ? this.catalog.bySlug(slug) : undefined;
    const cards = this.catalog.total('card');
    const websites = this.catalog.total('website');

    // Admin area and couples' private websites are never indexed.
    if (path === '/admin' || path.startsWith('/i/')) {
      return { description: `Wedding invitation by ${BRAND.name}.`, canonicalPath: path, noindex: true, jsonLd: [] };
    }
    if (design) return this.designPage(design, path);

    if (path === '/prices') {
      return {
        description: `Wedding invitation prices: cards from ₹99 and wedding websites from ₹499 – realistic 3D websites ₹1,299. Personalised with your names and photo; order on WhatsApp.`,
        canonicalPath: '/prices',
        jsonLd: [this.breadcrumbs([['Prices', '/prices']])],
      };
    }
    if (path === '/templates') {
      return {
        description: `${cards} wedding invitation card designs – Royal, Kerala, Traditional, Christian, Nikah, Floral and Modern. Add your names and photo, preview instantly and order on WhatsApp.`,
        canonicalPath: '/templates',
        jsonLd: [this.collection('Wedding Invitation Cards', '/templates', 'card'), this.breadcrumbs([['Invitation Cards', '/templates']])],
      };
    }
    if (path === '/websites') {
      return {
        description: `${websites} wedding invitation websites – realistic 3D venues, walk-through journeys, animated Nikah designs and scratch-to-reveal invites with RSVP, countdown, map and music. Order on WhatsApp.`,
        canonicalPath: '/websites',
        jsonLd: [this.collection('Wedding Invitation Websites', '/websites', 'website'), this.breadcrumbs([['Invitation Websites', '/websites']])],
      };
    }
    return {
      description: `Wedding invitation cards and wedding websites by ${BRAND.name}: ${cards} cards and ${websites} websites, including realistic 3D and animated Nikah designs. Personalise with your names and photo and order on WhatsApp.`,
      canonicalPath: '/',
      jsonLd: [
        {
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: BRAND.name,
          url: ORIGIN,
          logo: LOGO,
          slogan: BRAND.motto,
        },
        {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: `${BRAND.name} Wedding Invitations`,
          url: ORIGIN,
          inLanguage: 'en-IN',
        },
      ],
    };
  }

  private designPage(design: WeddingDesign, path: string): PageSeo {
    const isWebsite = design.kind === 'website';
    const listPath = isWebsite ? '/websites' : '/templates';
    const detailPath = `${listPath}/${design.slug}`;
    const features = [design.threeD && '3D', design.animated && 'animated', design.scratch && 'scratch-to-reveal'].filter(Boolean).join(', ');
    const description =
      `${design.name} (${design.style}): ${design.description}` +
      (features ? ` ${features[0].toUpperCase()}${features.slice(1)} design.` : '') +
      ` Personalise it and order on WhatsApp – ${BRAND.name}.`;
    return {
      description: description.length > 300 ? description.slice(0, 297) + '…' : description,
      // Live demos (/demo, /site) show the same design: the detail page is the one to index.
      canonicalPath: detailPath,
      noindex: path !== detailPath,
      jsonLd: [
        {
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: `${design.name} – ${design.style}`,
          description: design.description,
          url: `${ORIGIN}${detailPath}`,
          category: isWebsite ? 'Wedding invitation website' : 'Wedding invitation card',
          brand: { '@type': 'Brand', name: BRAND.name },
          image: LOGO,
          offers: {
            '@type': 'Offer',
            price: priceOf(design),
            priceCurrency: 'INR',
            availability: 'https://schema.org/InStock',
            url: `${ORIGIN}${detailPath}`,
          },
          keywords: design.tags.join(', '),
          inLanguage: 'en-IN',
        },
        this.breadcrumbs([
          [isWebsite ? 'Invitation Websites' : 'Invitation Cards', listPath],
          [design.name, detailPath],
        ]),
      ],
    };
  }

  private collection(name: string, path: string, kind: 'card' | 'website'): object {
    return {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: `${name} | ${BRAND.name}`,
      url: `${ORIGIN}${path}`,
      mainEntity: {
        '@type': 'ItemList',
        numberOfItems: this.catalog.total(kind),
        itemListElement: this.catalog
          .query({ kind, search: '', category: 'all', sort: 'featured' })
          .slice(0, 20)
          .map((d, i) => ({ '@type': 'ListItem', position: i + 1, url: `${ORIGIN}${path}/${d.slug}`, name: `${d.name} – ${d.style}` })),
      },
    };
  }

  private breadcrumbs(items: readonly (readonly [string, string])[]): object {
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [['Home', '/'] as const, ...items].map(([name, path], i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name,
        item: `${ORIGIN}${path}`,
      })),
    };
  }

  private apply(page: PageSeo): void {
    const title = this.document.title;
    const url = `${ORIGIN}${page.canonicalPath === '/' ? '/' : page.canonicalPath}`;
    const image = page.image ?? LOGO;
    const tags: [string, string, 'name' | 'property'][] = [
      ['description', page.description, 'name'],
      ['robots', page.noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large', 'name'],
      ['og:title', title, 'property'],
      ['og:description', page.description, 'property'],
      ['og:url', url, 'property'],
      ['og:image', image, 'property'],
      ['twitter:card', 'summary_large_image', 'name'],
      ['twitter:title', title, 'name'],
      ['twitter:description', page.description, 'name'],
      ['twitter:image', image, 'name'],
    ];
    for (const [key, content, attr] of tags) this.meta.updateTag({ [attr]: key, content }, `${attr}="${key}"`);

    let canonical = this.document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = this.document.createElement('link');
      canonical.rel = 'canonical';
      this.document.head.appendChild(canonical);
    }
    canonical.href = url;

    this.document.head.querySelectorAll('script[data-seo]').forEach((s) => s.remove());
    for (const data of page.jsonLd) {
      const script = this.document.createElement('script');
      script.type = 'application/ld+json';
      script.dataset['seo'] = '';
      script.textContent = JSON.stringify(data);
      this.document.head.appendChild(script);
    }
  }
}
