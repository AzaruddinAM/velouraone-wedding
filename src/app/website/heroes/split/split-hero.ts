import { Component } from '@angular/core';
import { Motif } from '../../../invitation/motif/motif';
import { WebsitePartBase } from '../../website-part.base';

/** Photo on one side, names on the other (stacks on phones). */
@Component({
  selector: 'app-split-hero',
  imports: [Motif],
  templateUrl: './split-hero.html',
  styleUrl: './split-hero.scss',
})
export class SplitHero extends WebsitePartBase {}
