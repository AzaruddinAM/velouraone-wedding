import { Component } from '@angular/core';
import { Motif } from '../../../invitation/motif/motif';
import { WebsitePartBase } from '../../website-part.base';

/** Kerala kasavu borders with a glowing nilavilakku. */
@Component({
  selector: 'app-kasavu-hero',
  imports: [Motif],
  templateUrl: './kasavu-hero.html',
  styleUrl: './kasavu-hero.scss',
})
export class KasavuHero extends WebsitePartBase {}
