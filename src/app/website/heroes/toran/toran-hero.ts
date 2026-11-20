import { Component } from '@angular/core';
import { Motif } from '../../../invitation/motif/motif';
import { WebsitePartBase } from '../../website-part.base';

/** Marigold toran, temple pillars and a muhurtham box. */
@Component({
  selector: 'app-toran-hero',
  imports: [Motif],
  templateUrl: './toran-hero.html',
  styleUrl: './toran-hero.scss',
})
export class ToranHero extends WebsitePartBase {
  protected readonly drops = [3, 5, 4, 6, 5, 6, 4, 5, 3].map((count) => Array.from({ length: count }, (_, i) => i));
}
