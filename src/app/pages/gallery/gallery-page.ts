import { Component, ElementRef, afterRenderEffect, computed, inject, input, linkedSignal, signal, viewChild } from '@angular/core';
import { LowerCasePipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { PRODUCTS } from '../../core/constants/products.constants';
import { DesignFeature, DesignKind, TemplateCategory } from '../../core/models/wedding-template.model';
import { InvitationDraftService } from '../../core/services/invitation-draft.service';
import { ShortlistService } from '../../core/services/shortlist.service';
import { TemplateCatalogService, TemplateSort } from '../../core/services/template-catalog.service';
import { Icon } from '../../shared/icon/icon';
import { TemplateTile } from '../../shared/template-tile/template-tile';

type CategoryFilter = TemplateCategory | 'all';

/** All designs with search, category chips, sorting and shortlist filter. */
@Component({
  selector: 'app-gallery-page',
  imports: [TemplateTile, Icon, RouterLink, LowerCasePipe],
  templateUrl: './gallery-page.html',
  styleUrl: './gallery-page.scss',
})
export class GalleryPage {
  /** Which product this gallery lists – from the route `data`. */
  readonly kind = input<DesignKind>('card');
  /** `?category=royal` – bound automatically by the router. */
  readonly category = input<string>();
  /** `?feature=animated|scratch` – bound automatically by the router. */
  readonly feature = input<string>();
  /** `?shortlist=true` – bound automatically by the router. */
  readonly shortlist = input<string>();

  private readonly router = inject(Router);
  protected readonly catalog = inject(TemplateCatalogService);
  protected readonly shortlistService = inject(ShortlistService);
  protected readonly draft = inject(InvitationDraftService);

  private readonly chipBar = viewChild.required<ElementRef<HTMLElement>>('chipBar');

  protected readonly products = PRODUCTS;
  protected readonly product = computed(() => PRODUCTS[this.kind()]);
  protected readonly total = computed(() => this.catalog.total(this.kind()));
  /** Shortlisted designs of this product only. */
  protected readonly shortlistCount = computed(
    () => this.catalog.ofKind(this.kind()).filter((d) => this.shortlistService.selected().has(d.id)).length,
  );

  protected readonly search = signal('');
  protected readonly sort = signal<TemplateSort>('featured');

  /** Local state that resets whenever the URL query param changes. */
  protected readonly selectedCategory = linkedSignal<CategoryFilter>(() => {
    const fromUrl = this.category();
    return this.catalog.categories.some((c) => c.id === fromUrl) ? (fromUrl as TemplateCategory) : 'all';
  });
  protected readonly onlyShortlist = linkedSignal(() => this.shortlist() === 'true');
  protected readonly selectedFeature = linkedSignal<DesignFeature | 'all'>(() => {
    const fromUrl = this.feature();
    return fromUrl === 'animated' || fromUrl === 'scratch' || fromUrl === '3d' ? fromUrl : 'all';
  });

  protected readonly featureChips: readonly { id: DesignFeature; label: string }[] = [
    { id: '3d', label: '🧊 3D' },
    { id: 'animated', label: '✨ Animated' },
    { id: 'scratch', label: '🪙 Scratch & reveal' },
  ];

  protected readonly results = computed(() =>
    this.catalog.query({
      kind: this.kind(),
      search: this.search(),
      category: this.selectedCategory(),
      sort: this.sort(),
      feature: this.selectedFeature(),
      onlyIds: this.onlyShortlist() ? this.shortlistService.selected() : undefined,
    }),
  );

  protected readonly sortOptions = computed<{ value: TemplateSort; label: string }[]>(() => [
    { value: 'featured', label: '3D & most attractive first' },
    { value: 'number', label: `${this.product().codePrefix}1 → ${this.product().codePrefix}${this.total()}` },
    { value: 'popular', label: 'Most popular' },
    { value: 'newest', label: 'Newest' },
  ]);

  constructor() {
    // Scroll the selected category chip into view (useful on phones).
    afterRenderEffect(() => {
      this.selectedCategory();
      const active = this.chipBar().nativeElement.querySelector<HTMLElement>('.chip.active');
      active?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
    });
  }

  protected selectCategory(category: CategoryFilter): void {
    this.selectedCategory.set(category);
    this.syncUrl();
  }

  protected toggleFeature(feature: DesignFeature): void {
    this.selectedFeature.update((current) => (current === feature ? 'all' : feature));
    this.syncUrl();
  }

  protected toggleShortlistFilter(): void {
    this.onlyShortlist.update((value) => !value);
    this.syncUrl();
  }

  protected clearFilters(): void {
    this.search.set('');
    this.selectedCategory.set('all');
    this.onlyShortlist.set(false);
    this.selectedFeature.set('all');
    this.syncUrl();
  }

  protected readValue(event: Event): string {
    return (event.target as HTMLInputElement | HTMLSelectElement).value;
  }

  /** Keeps filters in the URL so they survive refresh and can be shared. */
  private syncUrl(): void {
    const category = this.selectedCategory();
    void this.router.navigate([], {
      queryParams: {
        category: category === 'all' ? null : category,
        shortlist: this.onlyShortlist() ? 'true' : null,
        feature: this.selectedFeature() === 'all' ? null : this.selectedFeature(),
      },
      replaceUrl: true,
    });
  }
}
