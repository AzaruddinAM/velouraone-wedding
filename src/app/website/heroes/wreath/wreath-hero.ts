import { Component } from '@angular/core';
import { Motif } from '../../../invitation/motif/motif';
import { WebsitePartBase } from '../../website-part.base';

/** Circular leaf wreath around the initials. */
@Component({
  selector: 'app-wreath-hero',
  imports: [Motif],
  templateUrl: './wreath-hero.html',
  styleUrl: './wreath-hero.scss',
})
export class WreathHero extends WebsitePartBase {
  protected readonly leaves = Array.from({ length: 36 }, (_, i) => ({
    transform: `rotate(${i * 10}deg) translateY(-120px) rotate(${i % 2 === 0 ? 35 : -35}deg)`,
  }));
}
