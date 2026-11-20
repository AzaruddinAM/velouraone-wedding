import { Component } from '@angular/core';
import { Motif } from '../../../invitation/motif/motif';
import { WebsitePartBase } from '../../website-part.base';

/** Royal drapes that sweep open to reveal the names. */
@Component({
  selector: 'app-curtain-hero',
  imports: [Motif],
  templateUrl: './curtain-hero.html',
  styleUrl: './curtain-hero.scss',
})
export class CurtainHero extends WebsitePartBase {}
