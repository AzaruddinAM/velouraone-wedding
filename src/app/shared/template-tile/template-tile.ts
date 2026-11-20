import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { detailLink } from '../../core/constants/products.constants';
import { WeddingDesign } from '../../core/models/wedding-template.model';
import { InvitationDraftService } from '../../core/services/invitation-draft.service';
import { ShortlistService } from '../../core/services/shortlist.service';
import { TemplateCatalogService } from '../../core/services/template-catalog.service';
import { WhatsappOrderService } from '../../core/services/whatsapp-order.service';
import { DesignPreview } from '../design-preview/design-preview';
import { Icon } from '../icon/icon';

/** Gallery tile: live mini preview + name + quick actions. */
@Component({
  selector: 'app-template-tile',
  imports: [RouterLink, DesignPreview, Icon],
  templateUrl: './template-tile.html',
  styleUrl: './template-tile.scss',
})
export class TemplateTile {
  readonly template = input.required<WeddingDesign>();

  private readonly shortlist = inject(ShortlistService);
  private readonly orders = inject(WhatsappOrderService);
  protected readonly catalog = inject(TemplateCatalogService);
  protected readonly details = inject(InvitationDraftService).details;

  protected readonly link = computed(() => detailLink(this.template()));
  protected readonly isShortlisted = computed(() => this.shortlist.selected().has(this.template().id));

  protected toggleShortlist(): void {
    this.shortlist.toggle(this.template().id);
  }

  protected order(): void {
    this.orders.openOrder(this.template());
  }
}
