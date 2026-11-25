import { Component, DestroyRef, ElementRef, afterRenderEffect, effect, inject, input, signal, untracked, viewChild } from '@angular/core';
import type { Scene3DKind, TemplateTheme } from '../../core/models/wedding-template.model';
import type { LiveStage, SceneLabels } from './three-runtime';

/**
 * Real-time 3D scene (Three.js).
 *  • `live = true`  – animated scene that follows the mouse / phone tilt.
 *  • `live = false` – a still snapshot (gallery thumbnails, order dialog).
 * Three.js is lazy-loaded the first time a 3D design appears.
 */
@Component({
  selector: 'app-three-scene',
  template: `
    @if (!live()) {
      <canvas #snapshot class="snapshot" aria-hidden="true"></canvas>
    }
    @if (failed()) {
      <div class="fallback" aria-hidden="true"></div>
    }
  `,
  styles: `
    :host { position: relative; display: block; overflow: hidden; }
    .snapshot { position: absolute; inset: 0; width: 100%; height: 100%; display: block; }
    /* Shown if the device has no WebGL. */
    .fallback {
      position: absolute; inset: 0;
      background:
        radial-gradient(circle at 50% 35%, color-mix(in srgb, var(--accent) 55%, transparent), transparent 45%),
        radial-gradient(circle at 50% 35%, color-mix(in srgb, var(--primary) 30%, transparent), transparent 70%);
    }
  `,
  host: { role: 'img', '[attr.aria-label]': "'3D ' + kind() + ' scene'" },
})
export class ThreeScene {
  readonly kind = input.required<Scene3DKind>();
  readonly theme = input.required<TemplateTheme>();
  readonly live = input(false);
  /** Scroll-driven walk-through (journey hero) instead of a framed subject. */
  readonly journey = input(false);
  /** Journey progress 0 → 1 (from the page scroll). */
  readonly progress = input(0);
  /** Couple's details for scenes that show a 3D invitation panel. */
  readonly labels = input<SceneLabels | undefined>(undefined);

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly snapshotCanvas = viewChild<ElementRef<HTMLCanvasElement>>('snapshot');
  protected readonly failed = signal(false);

  private stage: LiveStage | null = null;
  private generation = 0;

  constructor() {
    // Rebuild whenever the design (or mode) changes – e.g. "next design" on the detail page.
    afterRenderEffect(() => {
      const kind = this.kind();
      const theme = this.theme();
      const live = this.live();
      const journey = this.journey();
      const labels = this.labels();
      const canvas = this.snapshotCanvas()?.nativeElement;
      void this.render(kind, theme, live, journey, canvas, labels);
    });
    // Scroll progress only moves the camera – it never rebuilds the scene.
    effect(() => {
      const progress = this.progress();
      this.stage?.setProgress(progress);
    });
    inject(DestroyRef).onDestroy(() => this.teardown());
  }

  private async render(kind: Scene3DKind, theme: TemplateTheme, live: boolean, journey: boolean, canvas?: HTMLCanvasElement, labels?: SceneLabels): Promise<void> {
    const run = ++this.generation;
    this.teardown();
    try {
      const runtime = await import('./three-runtime');
      if (run !== this.generation) return; // a newer request superseded this one
      const palette = { bg: theme.bg, surface: theme.surface, ink: theme.ink, primary: theme.primary, accent: theme.accent, labels };
      if (live) {
        this.stage = runtime.createLiveStage(this.host, kind, palette, { journey });
        this.stage.setProgress(untracked(this.progress));
      } else if (canvas) {
        await runtime.snapshotTo(canvas, kind, palette, { journey });
      }
      this.failed.set(false);
    } catch (error) {
      console.warn('3D scene unavailable, showing fallback.', error);
      this.failed.set(true);
    }
  }

  private teardown(): void {
    this.stage?.dispose();
    this.stage = null;
  }
}
