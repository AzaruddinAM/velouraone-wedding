import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { InvitationDraftService } from '../../core/services/invitation-draft.service';
import { TemplateCatalogService } from '../../core/services/template-catalog.service';
import { WhatsappOrderService } from '../../core/services/whatsapp-order.service';
import { Icon } from '../../shared/icon/icon';
import { WeddingWebsite } from '../../website/wedding-website/wedding-website';

/** The website exactly as guests will see it – full screen, with a small floating order bar. */
@Component({
  selector: 'app-website-demo-page',
  imports: [RouterLink, WeddingWebsite, Icon],
  template: `
    @if (template(); as t) {
      <app-wedding-website [template]="t" [details]="details()" />

      <div class="demo-bar" role="region" aria-label="Demo controls">
        <a class="back" [routerLink]="['/websites', t.slug]"><app-icon name="arrow-left" /> Back</a>
        <span class="label">Demo · <strong>{{ t.code }}</strong> {{ t.style }}</span>
        <button type="button" class="btn btn-whatsapp btn-sm" (click)="order()">
          <app-icon name="whatsapp" /> Order this
        </button>
      </div>
    } @else {
      <div class="missing">
        <h1>Website design not found</h1>
        <a class="btn btn-primary" routerLink="/websites">See all websites</a>
      </div>
    }
  `,
  styles: `
    :host { display: block; }
    .demo-bar {
      position: fixed; left: 50%; bottom: 16px; z-index: 60; translate: -50% 0;
      display: flex; align-items: center; gap: 14px; max-width: calc(100vw - 24px);
      padding: 8px 8px 8px 16px; border-radius: 999px;
      background: rgb(20 12 20 / 0.82); backdrop-filter: blur(10px); color: #fff;
      box-shadow: 0 10px 30px rgb(0 0 0 / 0.3);
    }
    .back { display: inline-flex; align-items: center; gap: 4px; color: #fff; text-decoration: none; font-weight: 500; }
    .label { overflow: hidden; font-size: 0.85rem; white-space: nowrap; text-overflow: ellipsis; opacity: 0.9; }
    .missing { display: grid; justify-items: center; gap: 1rem; padding: 6rem 1rem; }
  `,
})
export class WebsiteDemoPage {
  readonly slug = input.required<string>();

  private readonly catalog = inject(TemplateCatalogService);
  private readonly orders = inject(WhatsappOrderService);
  protected readonly details = inject(InvitationDraftService).details;

  protected readonly template = computed(() => {
    const design = this.catalog.bySlug(this.slug());
    return design?.kind === 'website' ? design : undefined;
  });

  protected order(): void {
    const t = this.template();
    if (t) this.orders.openOrder(t);
  }
}
