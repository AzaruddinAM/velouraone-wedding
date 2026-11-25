import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { WEBSITE_TIERS, formatPrice, priceOf } from '../../core/constants/pricing.constants';
import { WebsiteTemplate } from '../../core/models/wedding-template.model';
import { AdminApiService, ApiError, GeneratedSiteSummary } from '../../core/services/admin-api.service';
import { InvitationDraftService } from '../../core/services/invitation-draft.service';
import { TemplateCatalogService } from '../../core/services/template-catalog.service';
import { Icon } from '../../shared/icon/icon';
import { PersonaliseForm } from '../../shared/personalise-form/personalise-form';
import { ScaledFrame } from '../../shared/scaled-frame/scaled-frame';
import { WeddingWebsite } from '../../website/wedding-website/wedding-website';

/**
 * Admin only: sign in, then generate a couple's website from any design.
 * Security lives on the server (see public/api); this page only shows the forms.
 */
@Component({
  selector: 'app-admin-page',
  imports: [FormsModule, Icon, PersonaliseForm, ScaledFrame, WeddingWebsite],
  templateUrl: './admin-page.html',
  styleUrl: './admin-page.scss',
})
export class AdminPage {
  private readonly api = inject(AdminApiService);
  private readonly catalog = inject(TemplateCatalogService);
  private readonly draft = inject(InvitationDraftService);

  protected readonly signedIn = this.api.signedIn;
  protected readonly checking = signal(true);
  protected readonly details = this.draft.details;

  // Sign-in form
  protected username = '';
  protected password = '';
  protected readonly showPassword = signal(false);
  protected readonly busy = signal(false);
  protected readonly error = signal('');

  // Generate
  protected readonly websites = this.catalog.ofKind('website') as readonly WebsiteTemplate[];
  /** Designs grouped by price series for the picker. */
  protected readonly groups = WEBSITE_TIERS.map((tier) => ({
    label: `${tier.label} – ${formatPrice(tier.price)}`,
    designs: this.websites.filter((d) => priceOf(d) === tier.price),
  })).filter((g) => g.designs.length);
  protected readonly designSlug = signal(this.websites.at(-1)?.slug ?? '');
  protected readonly design = computed(() => this.websites.find((d) => d.slug === this.designSlug()) ?? null);
  protected readonly price = computed(() => {
    const d = this.design();
    return d ? formatPrice(priceOf(d)) : '';
  });
  protected readonly generating = signal(false);
  protected readonly result = signal<{ url: string; couple: string } | null>(null);
  protected readonly copied = signal(false);

  // Generated sites
  protected readonly sites = signal<GeneratedSiteSummary[]>([]);
  protected readonly listError = signal('');

  constructor() {
    void this.api
      .check()
      .then((ok) => (ok ? this.loadSites() : undefined))
      .catch((e: unknown) => this.error.set(e instanceof ApiError ? e.message : 'Cannot reach the server.'))
      .finally(() => this.checking.set(false));
  }

  protected async signIn(): Promise<void> {
    if (this.busy()) return;
    this.error.set('');
    this.busy.set(true);
    try {
      await this.api.login(this.username.trim(), this.password);
      this.password = '';
      await this.loadSites();
    } catch (e) {
      this.error.set(e instanceof ApiError ? e.message : 'Sign-in failed.');
    } finally {
      this.password = '';
      this.busy.set(false);
    }
  }

  protected async signOut(): Promise<void> {
    await this.api.logout().catch(() => undefined);
    this.sites.set([]);
    this.result.set(null);
  }

  protected startFresh(): void {
    this.draft.reset();
    this.result.set(null);
  }

  protected async generate(): Promise<void> {
    const design = this.design();
    if (!design || this.generating()) return;
    this.generating.set(true);
    this.result.set(null);
    this.listError.set('');
    try {
      const { path } = await this.api.generate(design.slug, this.details());
      const d = this.details();
      this.result.set({ url: new URL(path.replace(/^\//, ''), document.baseURI).href, couple: `${d.bride} & ${d.groom}` });
      this.copied.set(false);
      await this.loadSites();
    } catch (e) {
      this.listError.set(e instanceof ApiError ? e.message : 'Could not generate the website.');
    } finally {
      this.generating.set(false);
    }
  }

  protected async copy(url: string): Promise<void> {
    await navigator.clipboard?.writeText(url).catch(() => undefined);
    this.copied.set(true);
    setTimeout(() => this.copied.set(false), 2000);
  }

  protected shareLink(url: string, couple: string): string {
    return `https://wa.me/?text=${encodeURIComponent(`Here is your wedding website, ${couple}: ${url}`)}`;
  }

  protected siteUrl(slug: string): string {
    return new URL(`i/${slug}`, document.baseURI).href;
  }

  protected designName(slug: string): string {
    const d = this.catalog.bySlug(slug);
    return d ? `${d.code} ${d.style}` : slug;
  }

  protected async remove(site: GeneratedSiteSummary): Promise<void> {
    if (!confirm(`Delete the website for ${site.bride} & ${site.groom}? Guests will no longer be able to open it. This cannot be undone.`)) return;
    try {
      await this.api.remove(site.slug);
      await this.loadSites();
    } catch (e) {
      this.listError.set(e instanceof ApiError ? e.message : 'Could not delete.');
    }
  }

  private async loadSites(): Promise<void> {
    try {
      this.sites.set(await this.api.list());
    } catch (e) {
      this.listError.set(e instanceof ApiError ? e.message : 'Could not load the list.');
    }
  }
}
