import { Component } from '@angular/core';
import { Motif } from '../../../invitation/motif/motif';
import { WebsitePartBase } from '../../website-part.base';

let sealCount = 0;

/** Wax-seal monogram with slowly rotating lettering. */
@Component({
  selector: 'app-seal-hero',
  imports: [Motif],
  templateUrl: './seal-hero.html',
  styleUrl: './seal-hero.scss',
})
export class SealHero extends WebsitePartBase {
  /** Unique id for the SVG text path (several seals can be on one page). */
  protected readonly pathId = `seal-path-${++sealCount}`;
}
