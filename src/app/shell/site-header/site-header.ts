import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { BRAND } from '../../core/constants/brand.constants';
import { PRODUCTS } from '../../core/constants/products.constants';
import { ShortlistService } from '../../core/services/shortlist.service';
import { WhatsappOrderService } from '../../core/services/whatsapp-order.service';
import { Icon } from '../../shared/icon/icon';

@Component({
  selector: 'app-site-header',
  imports: [RouterLink, RouterLinkActive, Icon],
  templateUrl: './site-header.html',
  styleUrl: './site-header.scss',
})
export class SiteHeader {
  protected readonly brand = BRAND;
  protected readonly products = PRODUCTS;
  protected readonly shortlist = inject(ShortlistService);
  protected readonly enquiryLink = inject(WhatsappOrderService).enquiryLink();
  protected readonly menuOpen = signal(false);

  /** Opens the shortlist where the visitor has hearted designs (websites if only websites). */
  protected readonly shortlistPath = computed(() => {
    const ids = [...this.shortlist.selected()];
    const onlyWebsites = ids.length > 0 && ids.every((id) => id.startsWith('w'));
    return onlyWebsites ? PRODUCTS.website.basePath : PRODUCTS.card.basePath;
  });
}
