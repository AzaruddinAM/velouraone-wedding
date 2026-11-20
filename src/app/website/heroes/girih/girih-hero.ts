import { Component } from '@angular/core';
import { Motif } from '../../../invitation/motif/motif';
import { WebsitePartBase } from '../../website-part.base';

/** Nikah collection – Turning Islamic geometric stars around a shining octagon medallion. */
@Component({
  selector: 'app-girih-hero',
  imports: [Motif],
  templateUrl: './girih-hero.html',
  styleUrl: './girih-hero.scss',
})
export class GirihHero extends WebsitePartBase {
  protected readonly tiles = Array.from({ length: 14 }, (_, i) => ({ delay: -(i * 0.25) }));
}
