import { Component } from '@angular/core';
import { Motif } from '../../../invitation/motif/motif';
import { WebsitePartBase } from '../../website-part.base';

/** A pile of taped polaroids with handwritten captions. */
@Component({
  selector: 'app-polaroid-hero',
  imports: [Motif],
  templateUrl: './polaroid-hero.html',
  styleUrl: './polaroid-hero.scss',
})
export class PolaroidHero extends WebsitePartBase {
  protected readonly shots = [
    { id: 1, rotate: -12, offset: '-110px 10px', focus: '20% 40%', filter: 'sepia(0.35)', caption: 'first date' },
    { id: 2, rotate: 9, offset: '110px 18px', focus: '80% 40%', filter: 'grayscale(0.6)', caption: 'she said yes!' },
    { id: 3, rotate: -2, offset: '0 -6px', focus: '50% 35%', filter: 'none', caption: 'us ♥' },
  ];
}
