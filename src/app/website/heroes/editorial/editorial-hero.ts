import { Component } from '@angular/core';
import { Motif } from '../../../invitation/motif/motif';
import { WebsitePartBase } from '../../website-part.base';

/** Fashion-magazine cover: masthead, giant names, cover photo. */
@Component({
  selector: 'app-editorial-hero',
  imports: [Motif],
  templateUrl: './editorial-hero.html',
  styleUrl: './editorial-hero.scss',
})
export class EditorialHero extends WebsitePartBase {}
