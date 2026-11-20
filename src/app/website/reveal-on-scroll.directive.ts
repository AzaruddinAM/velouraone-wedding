import { DestroyRef, Directive, ElementRef, afterNextRender, inject, input, signal } from '@angular/core';

/**
 * Fades a website section up the first time it scrolls into view.
 * Enabled only for animated designs: `<div [appRevealOnScroll]="template.animated">`.
 * Without IntersectionObserver the content is simply shown.
 */
@Directive({
  selector: '[appRevealOnScroll]',
  host: {
    '[class.reveal]': 'appRevealOnScroll()',
    '[class.in-view]': 'visible()',
  },
})
export class RevealOnScroll {
  readonly appRevealOnScroll = input(false);
  protected readonly visible = signal(false);

  constructor() {
    const element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      if (!this.appRevealOnScroll() || typeof IntersectionObserver === 'undefined') {
        this.visible.set(true);
        return;
      }
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            this.visible.set(true);
            observer.disconnect();
          }
        },
        { threshold: 0.15 },
      );
      observer.observe(element);
      destroyRef.onDestroy(() => observer.disconnect());
    });
  }
}
