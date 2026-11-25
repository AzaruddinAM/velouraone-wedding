import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, Routes } from '@angular/router';
import { BRAND } from './core/constants/brand.constants';
import { TemplateCatalogService } from './core/services/template-catalog.service';

/** Browser-tab title for design pages, e.g. "W7 Wedding Website – The Wedding Issue | VelouraOne". */
const templateTitle: ResolveFn<string> = (route: ActivatedRouteSnapshot) => {
  const design = inject(TemplateCatalogService).bySlug(route.paramMap.get('slug') ?? '');
  return design ? `${design.name} – ${design.style} | ${BRAND.name}` : `Design not found | ${BRAND.name}`;
};

const galleryPage = () => import('./pages/gallery/gallery-page').then((m) => m.GalleryPage);
const detailPage = () => import('./pages/template-detail/template-detail-page').then((m) => m.TemplateDetailPage);

export const routes: Routes = [
  {
    path: '',
    title: `${BRAND.name} | Wedding Invitation Cards & Websites`,
    loadComponent: () => import('./pages/home/home-page').then((m) => m.HomePage),
  },

  // Invitation cards (V1 … )
  { path: 'templates', title: `Invitation Cards | ${BRAND.name}`, data: { kind: 'card' }, loadComponent: galleryPage },
  { path: 'templates/:slug', title: templateTitle, loadComponent: detailPage },
  {
    path: 'demo/:slug',
    title: templateTitle,
    loadComponent: () => import('./pages/live-demo/live-demo-page').then((m) => m.LiveDemoPage),
  },

  // Invitation websites (W1 … )
  { path: 'websites', title: `Invitation Websites | ${BRAND.name}`, data: { kind: 'website' }, loadComponent: galleryPage },
  { path: 'websites/:slug', title: templateTitle, loadComponent: detailPage },
  {
    path: 'site/:slug',
    title: templateTitle,
    loadComponent: () => import('./pages/website-demo/website-demo-page').then((m) => m.WebsiteDemoPage),
  },

  {
    path: 'prices',
    title: `Prices – Wedding Invitation Cards & Websites | ${BRAND.name}`,
    loadComponent: () => import('./pages/prices/prices-page').then((m) => m.PricesPage),
  },

  // Admin only (sign-in required – checked on the server).
  {
    path: 'admin',
    title: `Admin | ${BRAND.name}`,
    loadComponent: () => import('./pages/admin/admin-page').then((m) => m.AdminPage),
  },
  // A couple's own generated website.
  {
    path: 'i/:slug',
    title: 'Wedding Invitation',
    loadComponent: () => import('./pages/generated-site/generated-site-page').then((m) => m.GeneratedSitePage),
  },

  { path: '**', redirectTo: '' },
];
