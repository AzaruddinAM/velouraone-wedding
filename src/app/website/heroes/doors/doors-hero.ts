import { Component } from '@angular/core';
import { Motif } from '../../../invitation/motif/motif';
import { WebsitePartBase } from '../../website-part.base';

/** Nikah collection – Carved mashrabiya doors swing open to reveal the couple. */
@Component({
  selector: 'app-doors-hero',
  imports: [Motif],
  templateUrl: './doors-hero.html',
  styleUrl: './doors-hero.scss',
})
export class DoorsHero extends WebsitePartBase {}
