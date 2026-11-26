import { Component, computed, inject } from '@angular/core';
import { LowerCasePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BRAND } from '../../core/constants/brand.constants';
import { PRODUCTS, detailLink } from '../../core/constants/products.constants';
import { WeddingDesign } from '../../core/models/wedding-template.model';
import { InvitationDraftService } from '../../core/services/invitation-draft.service';
import { TemplateCatalogService } from '../../core/services/template-catalog.service';
import { WhatsappOrderService } from '../../core/services/whatsapp-order.service';
import { DesignPreview } from '../../shared/design-preview/design-preview';
import { Icon } from '../../shared/icon/icon';
import { PersonaliseForm } from '../../shared/personalise-form/personalise-form';
import { TemplateTile } from '../../shared/template-tile/template-tile';

@Component({
  selector: 'app-home-page',
  imports: [RouterLink, LowerCasePipe, DesignPreview, TemplateTile, PersonaliseForm, Icon],
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
})
export class HomePage {
  protected readonly brand = BRAND;
  protected readonly products = PRODUCTS;
  protected readonly catalog = inject(TemplateCatalogService);
  protected readonly details = inject(InvitationDraftService).details;
  protected readonly enquiryLink = inject(WhatsappOrderService).enquiryLink();
  protected readonly detailLink = detailLink;
  protected readonly productKinds = ['website', 'card'] as const;

  protected readonly cardTotal = this.catalog.total('card');
  protected readonly websiteTotal = this.catalog.total('website');

  /** Three wedding websites fanned out in the hero (websites come first on this site). */
  protected readonly heroDesigns = this.pick(['w63', 'w1', 'w7']);
  /** One sample of each product for the product chooser. */
  protected readonly productSamples = { card: this.pick(['v3'])[0], website: this.pick(['w7'])[0] };

  /** Highlights of the animated Nikah collection (scratch site, moonrise card, lantern site, scratch card). */
  protected readonly nikahShowcase = this.pick(['w47', 'w35', 'w43', 'v43']);
  protected readonly nikahCount =
    this.catalog.ofKind('card').filter((d) => d.category === 'nikah').length +
    this.catalog.ofKind('website').filter((d) => d.category === 'nikah').length;

  /** Real-time 3D Nikah websites (mosque, rings, crescent, lanterns). */
  protected readonly threeDShowcase = this.pick(['w63', 'w65', 'w67', 'w69']);
  protected readonly threeDCount = this.catalog.countWithFeature('website', '3d');

  protected readonly popularWebsites = this.catalog.popular('website', 8);
  protected readonly popularCards = this.catalog.popular('card', 4);

  /** Each category tile is coloured with its first design's palette. */
  protected readonly categoryTiles = computed(() =>
    this.catalog.categories.map((category) => {
      const sample = this.catalog.all.find((d) => d.category === category.id)!;
      return {
        ...category,
        count: this.catalog.countIn('card', category.id) + this.catalog.countIn('website', category.id),
        theme: sample.theme,
      };
    }),
  );

  protected readonly steps = [
    { title: 'Choose a design', text: `${this.cardTotal} invitation cards (V1–V${this.cardTotal}) and ${this.websiteTotal} websites (W1–W${this.websiteTotal}).` },
    { title: 'Personalise it', text: 'Type your names, date, venue and add your photo. See it live instantly.' },
    { title: 'Order on WhatsApp', text: 'One tap sends the design name and your details to us on WhatsApp.' },
    { title: 'Share with guests', text: 'Get your card to forward, or your own website link with RSVP and maps.' },
  ];

  protected readonly faqs = [
    {
      q: 'What is the difference between a card and a website?',
      a: 'A card is a single beautiful invitation image you forward on WhatsApp or Instagram. A website is your own wedding page with your story, all events, a photo gallery, venue map, live countdown and RSVP buttons – shared as one link.',
    },
    {
      q: 'How do I order?',
      a: 'Open any design, fill in your details and press "Order on WhatsApp". The design name and your details are sent to us automatically; then send your photo in the same chat.',
    },
    {
      q: 'Can I change colours, wording or events?',
      a: 'Yes. Mention it in the order notes or in the WhatsApp chat and we will adjust the design for you.',
    },
    {
      q: 'How long does it take?',
      a: 'Cards are usually ready within 24 hours; websites within 1–2 days of receiving your details and photos.',
    },
  ];

  private pick(ids: string[]): WeddingDesign[] {
    return ids.map((id) => this.catalog.bySlug(id)).filter((d) => d !== undefined);
  }
}
