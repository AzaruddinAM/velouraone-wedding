import { Component, computed, input } from '@angular/core';
import { InviteBackdrop as BackdropKind } from '../../../core/models/wedding-template.model';
import { Motif } from '../../../invitation/motif/motif';
import { WebsiteViewModel } from '../../website-view-model';

/** Deterministic pseudo-random numbers (same art on every render). */
function seeded(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/**
 * Original illustrated backdrops for the Invite series, drawn in SVG/CSS with the
 * design's own colours: palace steps, garden arch, lantern night, emerald dome,
 * couple photo and jaali lattice.
 */
@Component({
  selector: 'app-invite-backdrop',
  imports: [Motif],
  templateUrl: './invite-backdrop.html',
  styleUrl: './invite-backdrop.scss',
  host: { 'aria-hidden': 'true' },
})
export class InviteBackdrop {
  readonly kind = input.required<BackdropKind>();
  readonly vm = input.required<WebsiteViewModel>();

  /** Unique id prefix so several backdrops can share a page (SVG gradient ids). */
  protected readonly uid = `bd${Math.random().toString(36).slice(2, 8)}`;

  /** Flower clusters for garlands (palace corners, garden arch). */
  protected readonly garland = computed(() => {
    const random = seeded(7);
    return Array.from({ length: 46 }, (_, i) => ({
      x: random(),
      y: random(),
      r: 4 + random() * 6,
      tone: i % 4,
    }));
  });

  /** Blossoms placed along the garden arch. */
  protected readonly archBlooms = computed(() => {
    const random = seeded(3);
    return Array.from({ length: 70 }, (_, i) => {
      const a = Math.PI * (i / 69);
      const radius = 150 + (random() - 0.5) * 26;
      return { x: 200 - Math.cos(a) * radius, y: 470 - Math.sin(a) * radius * 1.35, r: 7 + random() * 8, tone: i % 4 };
    });
  });

  protected readonly steps = Array.from({ length: 8 }, (_, i) => i);
  protected readonly balusters = Array.from({ length: 15 }, (_, i) => i);
  protected readonly lanterns = [
    { x: 14, len: 80, size: 46, delay: 0 },
    { x: 34, len: 40, size: 34, delay: -1.2 },
    { x: 66, len: 60, size: 40, delay: -0.6 },
    { x: 86, len: 100, size: 50, delay: -1.8 },
  ];
  protected readonly bokeh = Array.from({ length: 12 }, (_, i) => ({ x: (i * 37) % 100, y: (i * 53) % 100, s: 30 + ((i * 17) % 60) }));
  protected readonly stars = Array.from({ length: 24 }, (_, i) => i);
  /** Fairy-light bulbs hanging along the garden wire. */
  /** Flame lilies at the foot of the gold arch (cotton backdrop). */
  protected readonly lilies = [
    { x: 70, y: 700, r: -20, s: 1.2 }, { x: 110, y: 728, r: 10, s: 0.9 }, { x: 52, y: 650, r: 30, s: 0.8 },
    { x: 330, y: 700, r: 20, s: 1.2 }, { x: 290, y: 728, r: -10, s: 0.9 }, { x: 348, y: 650, r: -30, s: 0.8 },
  ];
  /** Embroidered poppies in the corners (linen backdrop). */
  protected readonly poppies = [
    { x: 46, y: 640, s: 1.1 }, { x: 96, y: 700, s: 0.8 }, { x: 354, y: 640, s: 1.1 }, { x: 304, y: 700, s: 0.8 },
    { x: 40, y: 260, s: 0.7 }, { x: 360, y: 260, s: 0.7 },
  ];
  /** Ink cosmos flowers in the marble corners. */
  protected readonly cosmos = [
    { x: 30, y: 40, r: 10, s: 1.3 }, { x: 96, y: 18, r: -20, s: 0.8 }, { x: 370, y: 60, r: 30, s: 1.1 },
    { x: 36, y: 760, r: -15, s: 1.1 }, { x: 360, y: 770, r: 25, s: 1.4 }, { x: 300, y: 790, r: 0, s: 0.8 },
  ];
  protected readonly bulbs = this.stars.map((s) => ({ x: s * 17, y: 132 + Math.sin(s / 2.4) * 22, delay: -s * 0.2 }));
}
