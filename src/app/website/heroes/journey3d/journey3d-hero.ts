import { Component, DestroyRef, ElementRef, afterNextRender, computed, inject, signal } from '@angular/core';
import { Countdown } from '../../../shared/countdown/countdown';
import { ThreeScene } from '../../three/three-scene';
import { WebsitePartBase } from '../../website-part.base';

/** Scroll ranges (0 → 1) of the four story chapters shown over the 3D walk-through. */
const CHAPTERS: readonly { label: string; from: number; to: number }[] = [
  { label: 'Welcome', from: -1, to: 0.23 },
  { label: 'Invitation', from: 0.27, to: 0.48 },
  { label: 'The date', from: 0.52, to: 0.73 },
  { label: 'The venue', from: 0.77, to: 2 },
];
const FADE = 0.05;

/**
 * 3D journey hero: the scene stays pinned on screen while the page scrolls,
 * and the camera walks through it (garden aisle, palace courtyard, beach, hall…).
 * Guests can also drag to look around. In thumbnails it is a still first frame.
 */
@Component({
  selector: 'app-journey3d-hero',
  imports: [ThreeScene, Countdown],
  templateUrl: './journey3d-hero.html',
  styleUrl: './journey3d-hero.scss',
  host: { '[class.live]': 'interactive()' },
})
export class Journey3dHero extends WebsitePartBase {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;

  protected readonly chapters = CHAPTERS;
  protected readonly progress = signal(0);
  protected readonly sceneKind = computed(() => this.template().scene3d ?? 'garden');
  /** Only Nikah designs carry an Arabic line. */
  protected readonly arabicLine = computed(() => this.template().wording.arabic ?? '');

  /** Opacity of each chapter panel for the current scroll position. */
  protected readonly opacities = computed(() => {
    const p = this.progress();
    return CHAPTERS.map(({ from, to }) => Math.max(0, Math.min(1, (p - from) / FADE, (to - p) / FADE)));
  });
  protected readonly activeChapter = computed(() => {
    const o = this.opacities();
    return o.indexOf(Math.max(...o));
  });

  constructor() {
    super();
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      if (!this.interactive()) return;
      const scroller = this.findScroller();
      const update = () => this.progress.set(this.measure(scroller));
      const target: EventTarget = scroller ?? window;
      target.addEventListener('scroll', update, { passive: true });
      window.addEventListener('resize', update);
      update();
      destroyRef.onDestroy(() => {
        target.removeEventListener('scroll', update);
        window.removeEventListener('resize', update);
      });
    });
  }

  /** Scrolls so the given chapter is in view (progress rail buttons). */
  protected goTo(index: number): void {
    const scroller = this.findScroller();
    const rect = this.host.getBoundingClientRect();
    const view = scroller ? scroller.getBoundingClientRect() : { top: 0, height: window.innerHeight };
    const travel = rect.height - view.height;
    const wanted = [0, 0.375, 0.625, 0.9][index] * travel;
    const delta = wanted - (view.top - rect.top);
    // Rects are in on-screen pixels; the frame may be zoomed, so convert back to scroll pixels.
    const scale = scroller ? scroller.getBoundingClientRect().height / scroller.clientHeight || 1 : 1;
    (scroller ?? window).scrollBy({ top: delta / scale, behavior: 'smooth' });
  }

  /** 0 when the hero top reaches the top of the view, 1 when its bottom reaches the bottom. */
  private measure(scroller: HTMLElement | null): number {
    const rect = this.host.getBoundingClientRect();
    const view = scroller ? scroller.getBoundingClientRect() : { top: 0, height: window.innerHeight };
    const travel = rect.height - view.height;
    if (travel <= 0) return 0;
    return Math.max(0, Math.min(1, (view.top - rect.top) / travel));
  }

  /** Nearest scrolling ancestor (the preview frame) or null for the window. */
  private findScroller(): HTMLElement | null {
    for (let el = this.host.parentElement; el; el = el.parentElement) {
      const overflow = getComputedStyle(el).overflowY;
      if ((overflow === 'auto' || overflow === 'scroll') && el.scrollHeight > el.clientHeight) return el;
    }
    return null;
  }
}
