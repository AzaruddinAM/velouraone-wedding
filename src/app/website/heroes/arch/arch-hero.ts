import { Component } from '@angular/core';
import { Motif } from '../../../invitation/motif/motif';
import { WebsitePartBase } from '../../website-part.base';

/** Jharokha / chapel arch holding the couple photo. */
@Component({
  selector: 'app-arch-hero',
  imports: [Motif],
  templateUrl: './arch-hero.html',
  styleUrl: './arch-hero.scss',
})
export class ArchHero extends WebsitePartBase {}
