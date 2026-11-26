import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BRAND, SITE_HOST } from '../../core/constants/brand.constants';
import { TemplateCatalogService } from '../../core/services/template-catalog.service';
import { WhatsappOrderService } from '../../core/services/whatsapp-order.service';
import { Icon, IconName } from '../../shared/icon/icon';

/** Site footer in the VelouraOne poster style. The phone number is intentionally never shown. */
@Component({
  selector: 'app-site-footer',
  imports: [RouterLink, Icon],
  template: `
    <footer class="footer">
      <!-- Poster feature strip -->
      <div class="container features">
        @for (f of features; track f.label) {
          <div class="feature">
            <app-icon [name]="f.icon" />
            <span>{{ f.label }}</span>
          </div>
        }
      </div>

      <div class="container grid">
        <div class="about">
          <img class="logo" [src]="brand.logo" [alt]="brand.name" width="900" height="227" />
          <p class="slogan">{{ brand.slogan }}</p>
          <p class="motto">{{ brand.motto }}</p>
          <p>
            {{ catalog.total('card') }} invitation card designs and {{ catalog.total('website') }} wedding website
            designs. Pick one, personalise it, and order on WhatsApp – we do the rest.
          </p>
        </div>

        <div>
          <h4>Shop</h4>
          <ul>
            <li><a routerLink="/templates">Invitation Cards (V1–V{{ catalog.total('card') }})</a></li>
            <li><a routerLink="/websites">Invitation Websites (W1–W{{ catalog.total('website') }})</a></li>
            <li><a routerLink="/prices">Prices</a></li>
            <li><a routerLink="/admin" rel="nofollow">Admin</a></li>
            @for (category of catalog.categories.slice(0, 4); track category.id) {
              <li><a routerLink="/websites" [queryParams]="{ category: category.id }">{{ category.label }} websites</a></li>
            }
          </ul>
        </div>

        <div>
          <h4>Contact</h4>
          <ul>
            <li>
              <a class="btn btn-whatsapp btn-sm" [href]="enquiryLink" target="_blank" rel="noopener">
                <app-icon name="whatsapp" /> Chat on WhatsApp
              </a>
            </li>
            <li>{{ siteHost }}</li>
          </ul>
        </div>
      </div>

      <p class="closing">{{ brand.closingLine }}</p>
      <p class="copy">© {{ year }} {{ brand.name }} · Made with love for your big day</p>
    </footer>
  `,
  styles: `
    .footer {
      position: relative; margin-top: 5rem; padding: 0 0 1.5rem; overflow: hidden;
      background: linear-gradient(180deg, var(--surface), var(--cream));
      border-top: 1px solid var(--line);
    }
    /* Purple swoosh in the corner, like the poster */
    .footer::after {
      content: ''; position: absolute; right: -120px; bottom: -160px; width: 360px; height: 360px;
      border-radius: 50%; background: var(--brand-gradient); opacity: 0.9;
      box-shadow: 0 0 0 10px var(--surface), 0 0 0 12px var(--gold);
    }
    .features {
      display: grid; grid-template-columns: repeat(4, 1fr); margin-top: -1px; padding: 1.4rem 0;
      border-bottom: 1px solid var(--line);
    }
    @media (max-width: 720px) { .features { grid-template-columns: repeat(2, 1fr); row-gap: 1rem; } }
    .feature {
      display: flex; align-items: center; justify-content: center; gap: 0.7rem;
      color: var(--plum); font-weight: 600; font-size: 0.95rem;
    }
    .feature app-icon { font-size: 1.7rem; color: var(--plum-dark); }
    .feature + .feature { border-left: 1px solid var(--line); }
    @media (max-width: 720px) { .feature:nth-child(3) { border-left: 0; } }

    .grid { position: relative; z-index: 1; display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 2.5rem; padding-top: 3rem; }
    @media (max-width: 720px) { .grid { grid-template-columns: minmax(0, 1fr); gap: 1.75rem; } }
    .logo { width: auto; height: 3.4rem; }
    .slogan { margin: 0.8rem 0 0; font-size: 0.78rem; font-weight: 600; letter-spacing: 0.3em; text-transform: uppercase; color: var(--plum-dark); }
    .motto { margin: 0.2rem 0 0.8rem; font-family: var(--font-script); font-size: 1.5rem; color: var(--plum); }
    .about p:last-child { max-width: 26rem; color: var(--muted); }
    h4 { margin: 0 0 0.75rem; font-size: 0.8rem; letter-spacing: 0.14em; text-transform: uppercase; color: var(--rose); }
    ul { display: grid; gap: 0.45rem; margin: 0; padding: 0; list-style: none; color: var(--muted); }
    a:not(.btn) { color: var(--text); text-decoration: none; }
    a:not(.btn):hover { color: var(--rose); text-decoration: underline; }
    .closing {
      position: relative; z-index: 1; margin: 2.5rem 0 0; text-align: center;
      font-family: var(--font-script); font-size: clamp(1.6rem, 4vw, 2.3rem); color: var(--plum-dark);
    }
    .copy { position: relative; z-index: 1; margin: 0.6rem 0 0; text-align: center; font-size: 0.8rem; color: var(--muted); }
  `,
})
export class SiteFooter {
  protected readonly brand = BRAND;
  protected readonly catalog = inject(TemplateCatalogService);
  protected readonly enquiryLink = inject(WhatsappOrderService).enquiryLink();
  protected readonly siteHost = SITE_HOST;
  protected readonly year = new Date().getFullYear();

  /** The four promises from the VelouraOne poster. */
  protected readonly features: readonly { icon: IconName; label: string }[] = [
    { icon: 'rocket', label: 'Modern Designs' },
    { icon: 'bolt', label: 'Fast Performance' },
    { icon: 'mobile', label: 'Mobile Responsive' },
    { icon: 'headset', label: 'Dedicated Support' },
  ];
}
