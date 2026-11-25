import { Component, computed, inject, input, signal } from '@angular/core';
import { formatPrice, priceOf } from '../../core/constants/pricing.constants';
import { RouterLink } from '@angular/router';
import { SITE_HOST } from '../../core/constants/brand.constants';
import { PRODUCTS, demoLink, detailLink } from '../../core/constants/products.constants';
import { InvitationDraftService } from '../../core/services/invitation-draft.service';
import { ShortlistService } from '../../core/services/shortlist.service';
import { TemplateCatalogService } from '../../core/services/template-catalog.service';
import { WhatsappOrderService } from '../../core/services/whatsapp-order.service';
import { InvitationCard } from '../../invitation/invitation-card/invitation-card';
import { Icon } from '../../shared/icon/icon';
import { PersonaliseForm } from '../../shared/personalise-form/personalise-form';
import { ScaledFrame } from '../../shared/scaled-frame/scaled-frame';
import { TemplateTile } from '../../shared/template-tile/template-tile';
import { WeddingWebsite } from '../../website/wedding-website/wedding-website';

type Device = 'phone' | 'desktop';

const PERKS = {
  card: [
    'High-resolution invitation card (image + PDF)',
    'Perfect for WhatsApp, Instagram & print',
    'Free wording & colour tweaks',
    'Matching website available',
  ],
  website: [
    `Your own link – e.g. ${SITE_HOST}/ananya-arjun`,
    'Story, events, gallery, venue map & countdown',
    'RSVP buttons that reach you on WhatsApp',
    'Looks perfect on phones and computers',
  ],
} as const;

/** One design: live preview, personalise form, order button and related designs. */
@Component({
  selector: 'app-template-detail-page',
  imports: [RouterLink, InvitationCard, WeddingWebsite, ScaledFrame, PersonaliseForm, TemplateTile, Icon],
  templateUrl: './template-detail-page.html',
  styleUrl: './template-detail-page.scss',
})
export class TemplateDetailPage {
  /** Route param `:slug` – bound automatically by the router. */
  readonly slug = input.required<string>();

  protected readonly catalog = inject(TemplateCatalogService);
  private readonly shortlist = inject(ShortlistService);
  private readonly orders = inject(WhatsappOrderService);
  protected readonly details = inject(InvitationDraftService).details;

  protected readonly products = PRODUCTS;
  protected readonly device = signal<Device>('phone');

  protected readonly template = computed(() => this.catalog.bySlug(this.slug()));
  protected readonly links = computed(() => {
    const t = this.template();
    return t ? { demo: demoLink(t), gallery: PRODUCTS[t.kind].basePath } : null;
  });
  protected readonly perks = computed(() => PERKS[this.template()?.kind ?? 'card']);
  protected readonly neighbours = computed(() => {
    const t = this.template();
    if (!t) return null;
    const { previous, next } = this.catalog.neighbours(t);
    return { previous: { code: previous.code, link: detailLink(previous) }, next: { code: next.code, link: detailLink(next) } };
  });
  protected readonly related = computed(() => {
    const t = this.template();
    return t ? this.catalog.related(t) : [];
  });
  /** e.g. ₹1,399 */
  protected readonly price = computed(() => {
    const t = this.template();
    return t ? formatPrice(priceOf(t)) : '';
  });
  protected readonly isShortlisted = computed(() => {
    const t = this.template();
    return !!t && this.shortlist.selected().has(t.id);
  });

  protected toggleShortlist(): void {
    const t = this.template();
    if (t) this.shortlist.toggle(t.id);
  }

  protected order(): void {
    const t = this.template();
    if (t) this.orders.openOrder(t);
  }
}
