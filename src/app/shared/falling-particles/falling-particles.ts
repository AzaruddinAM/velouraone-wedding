import { Component, computed, input } from '@angular/core';

export type ParticleKind = 'petal' | 'spark' | 'star';

/**
 * Decorative looping particles that fill their parent (position the parent relatively):
 *  • `petal` – rose petals drifting down
 *  • `spark` – warm lantern sparks floating up
 *  • `star`  – twinkling stars
 * Sizes use `cqw`, so they scale with the card or website container.
 * Colours: `--particle` (defaults to the design's accent).
 */
@Component({
  selector: 'app-falling-particles',
  template: `
    @for (p of particles(); track $index) {
      <i
        [class]="kind()"
        [style.left.%]="p.x"
        [style.top.%]="p.y"
        [style.width.cqw]="p.size"
        [style.animation-duration.s]="p.duration"
        [style.animation-delay.s]="p.delay"
      ></i>
    }
  `,
  styles: `
    :host { position: absolute; inset: 0; z-index: 3; overflow: hidden; pointer-events: none; }
    i { position: absolute; display: block; aspect-ratio: 1; background: var(--particle, var(--accent)); }

    .petal {
      top: -8% !important;
      border-radius: 80% 0 80% 0;
      opacity: 0.85;
      animation: fall linear infinite;
    }
    @keyframes fall {
      0% { transform: translate(0, 0) rotate(0deg); }
      50% { transform: translate(6cqw, 60cqh) rotate(200deg); }
      100% { transform: translate(-4cqw, 130cqh) rotate(400deg); }
    }

    .spark {
      top: auto !important;
      bottom: -4%;
      border-radius: 50%;
      background: radial-gradient(circle, #fff7d6, var(--particle, var(--accent)) 60%, transparent 70%);
      box-shadow: 0 0 1.4cqw var(--particle, var(--accent));
      animation: rise ease-in infinite;
    }
    @keyframes rise {
      0% { transform: translateY(0) scale(0.6); opacity: 0; }
      15% { opacity: 1; }
      100% { transform: translateY(-120cqh) scale(1.1); opacity: 0; }
    }

    .star {
      clip-path: polygon(50% 0, 61% 39%, 100% 50%, 61% 61%, 50% 100%, 39% 61%, 0 50%, 39% 39%);
      animation: twinkle ease-in-out infinite;
    }
    @keyframes twinkle {
      0%, 100% { opacity: 0.25; transform: scale(0.6); }
      50% { opacity: 1; transform: scale(1); }
    }
  `,
  host: { 'aria-hidden': 'true', style: 'container-type: size' },
})
export class FallingParticles {
  readonly kind = input<ParticleKind>('petal');
  readonly count = input(14);

  /** Deterministic positions so every render looks the same. */
  protected readonly particles = computed(() =>
    Array.from({ length: this.count() }, (_, i) => ({
      x: (i * 41 + 7) % 97,
      y: (i * 29 + 13) % 92,
      size: 1.2 + ((i * 7) % 5) * 0.45,
      duration: 6 + ((i * 13) % 7),
      delay: -((i * 17) % 11),
    })),
  );
}
