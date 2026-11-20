import { Component } from '@angular/core';
import { Motif } from '../../../invitation/motif/motif';
import { WebsitePartBase } from '../../website-part.base';

/** Ornaments blooming from the corners around stacked script names. */
@Component({
  selector: 'app-floral-hero',
  imports: [Motif],
  templateUrl: './floral-hero.html',
  styleUrl: './floral-hero.scss',
})
export class FloralHero extends WebsitePartBase {}
