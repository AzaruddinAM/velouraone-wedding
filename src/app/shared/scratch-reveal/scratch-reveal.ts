import {
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';

const CLEARED_TO_REVEAL = 0.45;

/**
 * Scratch card: projected content sits under a shiny foil that guests scratch
 * away with a finger or mouse. When about half is cleared the foil fades out
 * with a small confetti burst.
 *
 * Foil colours come from CSS variables on the host or a parent:
 *   --foil-a (main), --foil-b (highlight), --foil-ink (label colour).
 * With `interactive = false` (gallery thumbnails) it is a static foil that clicks pass through.
 */
@Component({
  selector: 'app-scratch-reveal',
  template: `
    <div class="under"><ng-content /></div>
    @if (!revealed()) {
      <canvas
        #foil
        [class.static]="!interactive()"
        [class.fading]="fading()"
        [attr.aria-label]="interactive() ? 'Scratch to reveal' : null"
        role="img"
        (pointerdown)="start($event)"
        (pointermove)="move($event)"
        (pointerup)="stop()"
        (pointercancel)="stop()"
        (pointerleave)="stop()"
      ></canvas>
    }
    @if (fading()) {
      <span class="burst" aria-hidden="true">
        @for (p of confetti; track $index) {
          <i [style.--x]="p.x" [style.--y]="p.y" [style.background]="p.color" [style.animation-delay.ms]="p.delay"></i>
        }
      </span>
    }
  `,
  styles: `
    :host { position: relative; display: block; overflow: visible; }
    .under { width: 100%; height: 100%; }
    canvas {
      position: absolute; inset: 0; width: 100%; height: 100%;
      border-radius: inherit; cursor: grab; touch-action: none;
      transition: opacity 0.6s ease, transform 0.6s ease;
    }
    canvas:active { cursor: grabbing; }
    canvas.static { pointer-events: none; }
    canvas.fading { opacity: 0; transform: scale(1.08); }
    .burst { position: absolute; left: 50%; top: 50%; pointer-events: none; }
    .burst i {
      position: absolute; width: 7px; height: 7px; border-radius: 2px;
      animation: fly 0.9s cubic-bezier(0.2, 0.7, 0.3, 1) forwards;
    }
    @keyframes fly {
      from { transform: translate(0, 0) rotate(0); opacity: 1; }
      to { transform: translate(var(--x), var(--y)) rotate(320deg); opacity: 0; }
    }
  `,
})
export class ScratchReveal {
  readonly interactive = input(true);
  /** Text printed on the foil. */
  readonly label = input('Scratch');
  /** Emits once when the content has been revealed. */
  readonly revealedChange = output<void>();

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly canvasRef = viewChild<ElementRef<HTMLCanvasElement>>('foil');

  protected readonly revealed = signal(false);
  protected readonly fading = signal(false);

  private drawing = false;
  private scratched = false;
  private last: { x: number; y: number } | null = null;
  private moves = 0;

  protected readonly confetti = Array.from({ length: 18 }, (_, i) => {
    const angle = (i / 18) * Math.PI * 2;
    const distance = 40 + (i % 3) * 18;
    return {
      x: `${Math.round(Math.cos(angle) * distance)}px`,
      y: `${Math.round(Math.sin(angle) * distance)}px`,
      color: ['#e2b25c', '#f4dca8', '#ffffff', '#c084fc'][i % 4],
      delay: (i % 4) * 30,
    };
  });

  constructor() {
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      this.paint();
      // Repaint when the size changes (fonts loading, frame scaling) – until the guest starts scratching.
      const observer = new ResizeObserver(() => {
        if (!this.scratched) this.paint();
      });
      observer.observe(this.host);
      destroyRef.onDestroy(() => observer.disconnect());
    });
  }

  protected start(event: PointerEvent): void {
    if (!this.interactive() || this.fading()) return;
    this.drawing = true;
    this.last = null;
    try {
      (event.target as HTMLElement).setPointerCapture(event.pointerId);
    } catch {
      // Synthetic or already-released pointers cannot be captured – scratching still works.
    }
    this.move(event);
  }

  protected move(event: PointerEvent): void {
    if (!this.drawing) return;
    const canvas = this.canvasRef()?.nativeElement;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    // Works under CSS zoom / scaling: map viewport pixels to canvas pixels.
    const rect = canvas.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * canvas.width;
    const y = ((event.clientY - rect.top) / rect.height) * canvas.height;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = Math.max(canvas.width, canvas.height) * 0.3;
    ctx.beginPath();
    ctx.moveTo(this.last?.x ?? x, this.last?.y ?? y);
    ctx.lineTo(x, y);
    ctx.stroke();
    this.last = { x, y };
    this.scratched = true;

    if (++this.moves % 4 === 0 && this.clearedRatio(canvas, ctx) >= CLEARED_TO_REVEAL) this.reveal();
  }

  protected stop(): void {
    if (this.drawing) {
      // Final check when the finger lifts, so the last strokes always count.
      const canvas = this.canvasRef()?.nativeElement;
      const ctx = canvas?.getContext('2d');
      if (canvas && ctx && this.clearedRatio(canvas, ctx) >= CLEARED_TO_REVEAL) this.reveal();
    }
    this.drawing = false;
    this.last = null;
  }

  private reveal(): void {
    if (this.fading()) return;
    this.drawing = false;
    this.fading.set(true);
    this.revealedChange.emit();
    setTimeout(() => this.revealed.set(true), 900);
  }

  /**
   * Share of scratched-off foil, sampled on a 24×24 grid.
   * For round coins only the visible circle counts (the hidden corners can't be scratched).
   */
  private clearedRatio(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D): number {
    const { width: w, height: h } = canvas;
    const { data } = ctx.getImageData(0, 0, w, h);
    const round = getComputedStyle(this.host).borderTopLeftRadius.trim() === '50%';
    const steps = 24;
    let clear = 0;
    let total = 0;

    for (let gy = 0; gy < steps; gy++) {
      for (let gx = 0; gx < steps; gx++) {
        const nx = (gx + 0.5) / steps;
        const ny = (gy + 0.5) / steps;
        if (round && (nx - 0.5) ** 2 + (ny - 0.5) ** 2 > 0.25) continue;
        const px = Math.floor(nx * w);
        const py = Math.floor(ny * h);
        total++;
        if (data[(py * w + px) * 4 + 3] < 128) clear++;
      }
    }
    return total ? clear / total : 0;
  }

  /** Draws the metallic foil with sparkles and the label. */
  private paint(): void {
    const canvas = this.canvasRef()?.nativeElement;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const rect = this.host.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);

    const css = getComputedStyle(this.host);
    const foilA = css.getPropertyValue('--foil-a').trim() || '#c9a14a';
    const foilB = css.getPropertyValue('--foil-b').trim() || '#f6e3a1';
    const ink = css.getPropertyValue('--foil-ink').trim() || '#5a3d0a';
    const { width: w, height: h } = canvas;

    ctx.globalCompositeOperation = 'source-over';
    const metal = ctx.createLinearGradient(0, 0, w, h);
    metal.addColorStop(0, foilA);
    metal.addColorStop(0.45, foilB);
    metal.addColorStop(0.55, foilA);
    metal.addColorStop(1, foilB);
    ctx.fillStyle = metal;
    ctx.fillRect(0, 0, w, h);

    // Fine diagonal brushing + deterministic glitter.
    ctx.strokeStyle = 'rgba(255,255,255,0.18)';
    ctx.lineWidth = Math.max(1, w / 160);
    for (let i = -h; i < w; i += w / 14) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i + h, h);
      ctx.stroke();
    }
    ctx.fillStyle = 'rgba(255,255,255,0.75)';
    for (let i = 0; i < 40; i++) {
      const gx = ((i * 73) % 100) / 100 * w;
      const gy = ((i * 37) % 100) / 100 * h;
      ctx.fillRect(gx, gy, Math.max(1, w / 120), Math.max(1, w / 120));
    }

    ctx.fillStyle = ink;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const size = Math.max(9 * dpr, Math.min(w, h) * 0.2);
    ctx.font = `700 ${size}px Poppins, system-ui, sans-serif`;
    ctx.fillText(this.label(), w / 2, h / 2, w * 0.86);
  }
}
