import { Injectable, signal } from '@angular/core';
import { BRAND } from '../constants/brand.constants';
import { InvitationDetails } from '../models/invitation-details.model';
import { WeddingDesign } from '../models/wedding-template.model';
import { PRODUCTS } from '../constants/products.constants';
import { formatTime, parseLocalDate } from '../../invitation/invitation-view-model';

export interface OrderRequest {
  template: WeddingDesign;
  details: InvitationDetails;
  customerName: string;
  notes: string;
}

/**
 * Builds WhatsApp click-to-chat links and controls the order dialog.
 *
 * Note: WhatsApp links can only carry text. The couple photo is therefore shared
 * as a second step (Web Share on phones, or download-and-attach on desktop).
 */
@Injectable({ providedIn: 'root' })
export class WhatsappOrderService {
  /** Template currently shown in the order dialog (null = closed). */
  readonly activeTemplate = signal<WeddingDesign | null>(null);

  openOrder(template: WeddingDesign): void {
    this.activeTemplate.set(template);
  }

  closeOrder(): void {
    this.activeTemplate.set(null);
  }

  /** Public link to the template preview page. */
  previewUrl(template: WeddingDesign): string {
    return `${BRAND.siteUrl}${PRODUCTS[template.kind].basePath}/${template.slug}`;
  }

  /** Link for a general enquiry (floating button, header, footer). */
  enquiryLink(): string {
    return this.buildLink(`Hello ${BRAND.name}! I'd like to know more about your wedding invitation cards and websites.`);
  }

  /** Full order message with template name, couple details and photo note. */
  orderLink(order: OrderRequest): string {
    return this.buildLink(this.orderMessage(order));
  }

  orderMessage({ template, details, customerName, notes }: OrderRequest): string {
    const date = parseLocalDate(details.date);
    const prettyDate = date
      ? date.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })
      : details.date;

    const lines = [
      `Hello ${BRAND.name}!`,
      `I would like to order a ${PRODUCTS[template.kind].singular}.`,
      ``,
      `*Template:* ${template.name} – ${template.style} (${template.code})`,
      `*Preview:* ${this.previewUrl(template)}`,
      ``,
      `*Couple:* ${details.bride} & ${details.groom}`,
      `*Date:* ${prettyDate}, ${formatTime(details.time)}`,
      `*Venue:* ${details.venue}${details.address ? ', ' + details.address : ''}`,
    ];

    if (customerName.trim()) lines.push(`*My name:* ${customerName.trim()}`);
    if (notes.trim()) lines.push(`*Notes:* ${notes.trim()}`);

    lines.push(
      ``,
      details.photoUrl
        ? `*Photo:* I'm sending our couple photo in this chat.`
        : `*Photo:* I'll share our couple photo here.`,
    );

    return lines.join('\n');
  }

  private buildLink(text: string): string {
    return `https://wa.me/${BRAND.whatsappNumber}?text=${encodeURIComponent(text)}`;
  }
}
