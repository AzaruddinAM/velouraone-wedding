import { Component, DestroyRef, ElementRef, computed, inject, input, signal } from '@angular/core';

/**
 * Renders its content at a fixed "device" size (e.g. 390 × 780 phone)
 * and scales it down to fit the available width – like a screenshot that stays live.
 * Set `scrollable` to let visitors scroll inside the frame.
 */
@Component({
  selector: 'app-scaled-frame',
  template: `
    <div class="viewport" [class.scrollable]="scrollable()" [style.height.px]="designHeight() * scale()">
      <div class="stage" [style.width.px]="designWidth()" [style.zoom]="scale()">
        <ng-content />
      </div>
    </div>
  `,
  styles: `
    :host { display: block; width: 100%; }
    .viewport { overflow: hidden; }
    /* Scrollbar hidden so it never steals width from the scaled page. */
    .viewport.scrollable { overflow-y: auto; overscroll-behavior: contain; scrollbar-width: none; }
    .viewport.scrollable::-webkit-scrollbar { display: none; }
    .stage { min-height: 100%; }
  `,
})
export class ScaledFrame {
  readonly designWidth = input(390);
  readonly designHeight = input(780);
  readonly scrollable = input(false);

  private readonly hostWidth = signal(0);
  protected readonly scale = computed(() => (this.hostWidth() || this.designWidth()) / this.designWidth());

  constructor() {
    const host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const observer = new ResizeObserver(([entry]) => this.hostWidth.set(entry.contentRect.width));
    observer.observe(host);
    inject(DestroyRef).onDestroy(() => observer.disconnect());
  }
}
