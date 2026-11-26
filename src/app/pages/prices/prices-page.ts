import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ADD_ONS, BUNDLES, CARD_TIERS, WEBSITE_TIERS, formatPrice } from '../../core/constants/pricing.constants';
import { PRODUCTS } from '../../core/constants/products.constants';
import { WhatsappOrderService } from '../../core/services/whatsapp-order.service';
import { Icon } from '../../shared/icon/icon';

/** All prices on one page: cards, websites by series, add-ons and bundles. */
@Component({
  selector: 'app-prices-page',
  imports: [RouterLink, Icon],
  template: `
    <section class="intro">
      <div class="container">
        <span class="eyebrow"><app-icon name="sparkle" /> Simple, one-time prices</span>
        <h1>Prices</h1>
        <p class="lead">
          Every design is personalised with your names, date, venue and photo. Nothing costs more than
          <strong>₹1,299</strong> – order in one tap on WhatsApp.
        </p>
      </div>
    </section>

    <section class="container block" aria-labelledby="websites-title">
      <div class="head">
        <h2 id="websites-title">Invitation websites</h2>
        <a class="btn btn-ghost btn-sm" [routerLink]="products.website.basePath">Browse websites <app-icon name="arrow-right" /></a>
      </div>
      <ul class="tiers">
        @for (tier of websiteTiers; track tier.label) {
          <li class="tier" [class.highlight]="tier.highlight">
            @if (tier.highlight) {
              <span class="ribbon">Most popular</span>
            }
            <h3>{{ tier.label }}</h3>
            <p class="designs">{{ tier.designs }}</p>
            @if (tier.note) {
              <p class="note">{{ tier.note }}</p>
            }
            <p class="amount">{{ format(tier.price) }}</p>
          </li>
        }
      </ul>
      <p class="included">
        <app-icon name="check" /> Included with every website: your story, events, gallery, venue map, countdown, RSVP and
        6 months of hosting.
      </p>
    </section>

    <section class="container block" aria-labelledby="cards-title">
      <div class="head">
        <h2 id="cards-title">Invitation cards</h2>
        <a class="btn btn-ghost btn-sm" [routerLink]="products.card.basePath">Browse cards <app-icon name="arrow-right" /></a>
      </div>
      <ul class="tiers small">
        @for (tier of cardTiers; track tier.label) {
          <li class="tier">
            <h3>{{ tier.label }}</h3>
            <p class="designs">{{ tier.designs }}</p>
            <p class="amount">{{ format(tier.price) }}</p>
          </li>
        }
      </ul>
    </section>

    <section class="container block two-col">
      <div class="panel" aria-labelledby="bundles-title">
        <h2 id="bundles-title">Bundles</h2>
        <ul class="rows">
          @for (b of bundles; track b.label) {
            <li>
              <span><strong>{{ b.label }}</strong><small>{{ b.detail }}</small></span>
              <b>{{ b.price }}</b>
            </li>
          }
        </ul>
      </div>
      <div class="panel" aria-labelledby="addons-title">
        <h2 id="addons-title">Add-ons</h2>
        <ul class="rows">
          @for (a of addOns; track a.label) {
            <li>
              <span>{{ a.label }}</span>
              <b>{{ a.price }}</b>
            </li>
          }
        </ul>
      </div>
    </section>

    <section class="container block cta">
      <h2>Not sure which one?</h2>
      <p>Send us a message – we'll help you choose and show you a preview with your names.</p>
      <a class="btn btn-whatsapp btn-lg" [href]="enquiryLink" target="_blank" rel="noopener">
        <app-icon name="whatsapp" /> Chat on WhatsApp
      </a>
    </section>
  `,
  styles: `
    :host { display: block; padding-bottom: 4rem; }
    .intro { padding: 3rem 0 1.5rem; text-align: center; }
    .intro h1 { margin: 0.6rem 0 0.4rem; font-family: var(--font-display); font-size: clamp(2.4rem, 6vw, 3.6rem); }
    .lead { max-width: 40rem; margin: 0 auto; color: var(--muted); font-size: 1.05rem; }
    .lead strong { color: var(--plum); }
    .block { margin-top: 2.5rem; }
    .head { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 0.75rem; margin-bottom: 1rem; }
    h2 { margin: 0; font-family: var(--font-display); font-size: clamp(1.5rem, 3vw, 2rem); }
    .tiers { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 15rem), 1fr)); gap: 1rem; margin: 0; padding: 0; list-style: none; }
    .tier {
      position: relative; display: flex; flex-direction: column; gap: 0.35rem; padding: 1.25rem 1.25rem 1.1rem;
      border: 1px solid var(--line); border-radius: var(--radius-lg); background: var(--surface); box-shadow: var(--shadow-sm);
    }
    .tier.highlight { border: 2px solid var(--plum); box-shadow: var(--shadow-md); }
    .ribbon {
      position: absolute; top: -0.75rem; left: 1rem; padding: 0.15rem 0.7rem; border-radius: 999px;
      background: var(--brand-gradient); color: #fff; font-size: 0.72rem; font-weight: 700; letter-spacing: 0.04em;
    }
    .tier h3 { margin: 0; font-family: var(--font-display); font-size: 1.15rem; }
    .designs { margin: 0; color: var(--muted); font-size: 0.88rem; }
    .note { margin: 0; color: var(--rose); font-size: 0.82rem; }
    .amount { margin: auto 0 0; padding-top: 0.6rem; font-family: var(--font-display); font-size: 1.9rem; font-weight: 700; color: var(--plum); }
    .included { display: flex; align-items: center; gap: 0.5rem; margin: 1rem 0 0; color: var(--muted); font-size: 0.92rem; }
    .two-col { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 22rem), 1fr)); gap: 1.25rem; }
    .panel { padding: 1.4rem; border: 1px solid var(--line); border-radius: var(--radius-lg); background: var(--surface); box-shadow: var(--shadow-sm); }
    .rows { display: grid; gap: 0.2rem; margin: 0.9rem 0 0; padding: 0; list-style: none; }
    .rows li { display: flex; align-items: center; justify-content: space-between; gap: 1rem; padding: 0.7rem 0; border-top: 1px solid var(--line); }
    .rows li:first-child { border-top: 0; }
    .rows span { display: grid; gap: 0.1rem; }
    .rows small { color: var(--muted); font-size: 0.82rem; }
    .rows b { flex-shrink: 0; font-family: var(--font-display); color: var(--plum); white-space: nowrap; }
    .cta { padding: 2rem 1.5rem; border-radius: var(--radius-lg); background: var(--cream); text-align: center; }
    .cta p { margin: 0.5rem auto 1.2rem; max-width: 32rem; color: var(--muted); }
  `,
})
export class PricesPage {
  protected readonly products = PRODUCTS;
  protected readonly websiteTiers = WEBSITE_TIERS;
  protected readonly cardTiers = CARD_TIERS;
  protected readonly addOns = ADD_ONS;
  protected readonly bundles = BUNDLES;
  protected readonly enquiryLink = inject(WhatsappOrderService).enquiryLink();
  protected readonly format = formatPrice;
}
