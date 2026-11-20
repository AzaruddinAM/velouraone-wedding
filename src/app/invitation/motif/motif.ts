import { Component, input } from '@angular/core';
import { MotifName } from '../../core/models/wedding-template.model';

/** Builds `[0, step, 2*step, …]` up to (not including) 360°. */
const angles = (count: number, offset = 0): number[] =>
  Array.from({ length: count }, (_, i) => offset + (360 / count) * i);

/**
 * Decorative SVG ornament drawn in `currentColor`.
 * Size it with width/height on the host; it always keeps a square aspect ratio.
 */
@Component({
  selector: 'app-motif',
  templateUrl: './motif.html',
  styleUrl: './motif.scss',
  host: { 'aria-hidden': 'true' },
})
export class Motif {
  readonly name = input.required<MotifName>();

  protected readonly twelve = angles(12);
  protected readonly twelveOffset = angles(12, 15);
  protected readonly twentyFour = angles(24);
  protected readonly eight = angles(8);
  protected readonly six = angles(6);
  protected readonly fan = [-60, -30, 0, 30, 60];
  protected readonly rays = [-75, -60, -45, -30, -15, 0, 15, 30, 45, 60, 75];
  protected readonly leafSteps = [0, 1, 2, 3, 4, 5];
  protected readonly kolamDots = [30, 50, 70];
  protected readonly barbs = [0, 1, 2, 3, 4, 5, 6];
}
