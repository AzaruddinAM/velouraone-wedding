import { Component } from '@angular/core';
import { WebsitePartBase } from '../../website-part.base';

/** Giant stacked names, colour blobs and a scrolling ticker. */
@Component({
  selector: 'app-marquee-hero',
  templateUrl: './marquee-hero.html',
  styleUrl: './marquee-hero.scss',
})
export class MarqueeHero extends WebsitePartBase {
  protected readonly loop = [0, 1, 2, 3];
}
