import { Component } from '@angular/core';
import { Countdown } from '../../../shared/countdown/countdown';
import { Motif } from '../../../invitation/motif/motif';
import { WebsitePartBase } from '../../website-part.base';

/** Night sky with twinkling and shooting stars, moon and countdown. */
@Component({
  selector: 'app-starry-hero',
  imports: [Motif, Countdown],
  templateUrl: './starry-hero.html',
  styleUrl: './starry-hero.scss',
})
export class StarryHero extends WebsitePartBase {
  /** Fixed (deterministic) star positions so every render looks the same. */
  protected readonly stars = Array.from({ length: 40 }, (_, i) => ({
    x: (i * 37 + 11) % 98,
    y: (i * 53 + 7) % 97,
    size: 4 + ((i * 7) % 4) * 3,
    delay: (i % 6) * 0.45,
  }));
}
