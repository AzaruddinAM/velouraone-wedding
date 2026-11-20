import { Component, ElementRef, computed, effect, inject, signal, viewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BRAND } from '../../core/constants/brand.constants';
import { InvitationDraftService } from '../../core/services/invitation-draft.service';
import { WhatsappOrderService } from '../../core/services/whatsapp-order.service';
import { dataUrlToFile } from '../../core/utils/image.utils';
import { formatTime, parseLocalDate } from '../../invitation/invitation-view-model';
import { DesignPreview } from '../design-preview/design-preview';
import { PRODUCTS, detailLink } from '../../core/constants/products.constants';
import { Icon } from '../icon/icon';

type OrderStep = 'details' | 'photo';

/**
 * Two-step order flow:
 *  1. Confirm details → opens WhatsApp chat with the full order message.
 *  2. Send the couple photo (share sheet on phones / download on desktop).
 */
@Component({
  selector: 'app-order-dialog',
  imports: [DesignPreview, Icon],
  templateUrl: './order-dialog.html',
  styleUrl: './order-dialog.scss',
})
export class OrderDialog {
  private readonly orders = inject(WhatsappOrderService);
  private readonly router = inject(Router);
  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');

  protected readonly brand = BRAND;
  protected readonly products = PRODUCTS;
  protected readonly template = this.orders.activeTemplate;
  protected readonly details = inject(InvitationDraftService).details;

  protected readonly step = signal<OrderStep>('details');
  protected readonly customerName = signal('');
  protected readonly notes = signal('');
  protected readonly shareMessage = signal('');

  protected readonly prettyDate = computed(() => {
    const d = this.details();
    const date = parseLocalDate(d.date);
    const day = date?.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) ?? d.date;
    return `${day} · ${formatTime(d.time)}`;
  });

  protected readonly canSharePhoto = computed(() => {
    const photo = this.details().photoUrl;
    return !!photo && typeof navigator !== 'undefined' && 'canShare' in navigator;
  });

  constructor() {
    // Keep the native <dialog> in sync with the service state.
    effect(() => {
      const element = this.dialog().nativeElement;
      if (this.template()) {
        this.step.set('details');
        this.shareMessage.set('');
        if (!element.open) element.showModal();
      } else if (element.open) {
        element.close();
      }
    });
  }

  protected close(): void {
    this.orders.closeOrder();
  }

  /** Clicking the dimmed backdrop closes the dialog. */
  protected onBackdropClick(event: MouseEvent): void {
    if (event.target === this.dialog().nativeElement) this.close();
  }

  protected sendOrder(): void {
    const template = this.template();
    if (!template) return;
    const link = this.orders.orderLink({
      template,
      details: this.details(),
      customerName: this.customerName(),
      notes: this.notes(),
    });
    window.open(link, '_blank', 'noopener');
    this.step.set('photo');
  }

  protected editDetails(): void {
    const template = this.template();
    this.close();
    if (template) void this.router.navigate(detailLink(template), { fragment: 'personalise' });
  }

  protected async sharePhoto(): Promise<void> {
    const photo = this.details().photoUrl;
    const template = this.template();
    if (!photo || !template) return;

    try {
      const file = await dataUrlToFile(photo, `${template.code}-couple-photo.jpg`);
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], text: `${template.name} – ${template.style} order photo` });
        this.shareMessage.set('Photo shared. Choose our WhatsApp chat if you haven’t already.');
      } else {
        this.downloadPhoto();
      }
    } catch {
      // User cancelled the share sheet – nothing to do.
    }
  }

  protected downloadPhoto(): void {
    const photo = this.details().photoUrl;
    const template = this.template();
    if (!photo || !template) return;
    const link = document.createElement('a');
    link.href = photo;
    link.download = `${template.code}-couple-photo.jpg`;
    link.click();
    this.shareMessage.set('Photo downloaded. Attach it in the WhatsApp chat using the 📎 button.');
  }

  protected readInput(event: Event): string {
    return (event.target as HTMLInputElement | HTMLTextAreaElement).value;
  }
}
