import { Component, inject } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, map } from 'rxjs';
import { WhatsappOrderService } from './core/services/whatsapp-order.service';
import { Icon } from './shared/icon/icon';
import { OrderDialog } from './shared/order-dialog/order-dialog';
import { SiteFooter } from './shell/site-footer/site-footer';
import { SiteHeader } from './shell/site-header/site-header';

/** App shell: header, routed page, footer, order dialog and WhatsApp button. */
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SiteHeader, SiteFooter, OrderDialog, Icon],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly router = inject(Router);
  protected readonly enquiryLink = inject(WhatsappOrderService).enquiryLink();

  private readonly navigationEnd$ = this.router.events.pipe(
    filter((event): event is NavigationEnd => event instanceof NavigationEnd),
  );

  /** Full-screen demo pages (`/demo/…` cards, `/site/…` websites) hide the site chrome. */
  protected readonly isFullscreen = toSignal(
    this.navigationEnd$.pipe(map((event) => /^\/(demo|site)\//.test(event.urlAfterRedirects))),
    { initialValue: false },
  );

  constructor() {
    this.handleScrolling();
  }

  /**
   * Scroll to top only when the page (path) changes – not when filters in the
   * query string change – and scroll to `#fragment` targets when present.
   */
  private handleScrolling(): void {
    let previousPath = '';
    this.navigationEnd$.pipe(takeUntilDestroyed()).subscribe((event) => {
      const tree = this.router.parseUrl(event.urlAfterRedirects);
      const path = event.urlAfterRedirects.split(/[?#]/)[0];

      if (tree.fragment) {
        setTimeout(() => document.getElementById(tree.fragment!)?.scrollIntoView({ behavior: 'smooth' }), 50);
      } else if (path !== previousPath) {
        window.scrollTo({ top: 0, behavior: 'instant' });
      }
      previousPath = path;
    });
  }
}
