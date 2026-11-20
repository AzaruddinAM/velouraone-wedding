import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { InvitationDraftService } from '../../core/services/invitation-draft.service';
import { TemplateCatalogService } from '../../core/services/template-catalog.service';
import { WhatsappOrderService } from '../../core/services/whatsapp-order.service';
import { InvitationCard } from '../../invitation/invitation-card/invitation-card';
import { parseLocalDate } from '../../invitation/invitation-view-model';
import { Countdown } from '../../shared/countdown/countdown';
import { Icon } from '../../shared/icon/icon';

/**
 * Full-screen demo of what guests will see when they open the couple's link:
 * the invitation, a live countdown, and calendar / map buttons.
 */
@Component({
  selector: 'app-live-demo-page',
  imports: [RouterLink, InvitationCard, Countdown, Icon],
  templateUrl: './live-demo-page.html',
  styleUrl: './live-demo-page.scss',
})
export class LiveDemoPage {
  readonly slug = input.required<string>();

  private readonly catalog = inject(TemplateCatalogService);
  private readonly orders = inject(WhatsappOrderService);
  protected readonly details = inject(InvitationDraftService).details;

  /** This page shows cards only (websites have their own full-page demo). */
  protected readonly template = computed(() => {
    const design = this.catalog.bySlug(this.slug());
    return design?.kind === 'card' ? design : undefined;
  });

  protected readonly mapLink = computed(() => {
    const d = this.details();
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${d.venue}, ${d.address}`)}`;
  });

  /** Google Calendar "add event" link (3-hour event in local time). */
  protected readonly calendarLink = computed(() => {
    const d = this.details();
    const start = parseLocalDate(d.date);
    if (!start) return null;
    const [h, m] = d.time.split(':').map(Number);
    start.setHours(h || 0, m || 0);
    const end = new Date(start.getTime() + 3 * 60 * 60 * 1000);
    const stamp = (date: Date) =>
      `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}` +
      `T${String(date.getHours()).padStart(2, '0')}${String(date.getMinutes()).padStart(2, '0')}00`;
    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: `Wedding of ${d.bride} & ${d.groom}`,
      dates: `${stamp(start)}/${stamp(end)}`,
      location: `${d.venue}, ${d.address}`,
    });
    return `https://calendar.google.com/calendar/render?${params}`;
  });

  protected order(): void {
    const t = this.template();
    if (t) this.orders.openOrder(t);
  }
}
