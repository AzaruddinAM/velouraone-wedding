import { Component } from '@angular/core';
import { BRAND } from '../../../core/constants/brand.constants';
import { Motif } from '../../../invitation/motif/motif';
import { WebsitePartBase } from '../../website-part.base';

/** Closing monogram, hashtag and credit. */
@Component({
  selector: 'app-footer-section',
  imports: [Motif],
  templateUrl: './footer-section.html',
  styleUrl: './footer-section.scss',
})
export class FooterSection extends WebsitePartBase {
  protected readonly brand = BRAND.name;
}
