import { Component } from '@angular/core';
import { Motif } from '../../../invitation/motif/motif';
import { WebsitePartBase } from '../../website-part.base';

/** Full-screen couple photo with tinted overlay and scroll cue. */
@Component({
  selector: 'app-fullbleed-hero',
  imports: [Motif],
  templateUrl: './fullbleed-hero.html',
  styleUrl: './fullbleed-hero.scss',
})
export class FullbleedHero extends WebsitePartBase {
  protected readonly tiles = Array.from({ length: 20 }, (_, i) => i);
}
