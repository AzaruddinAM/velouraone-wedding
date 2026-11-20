import { Component } from '@angular/core';
import { Motif } from '../../../invitation/motif/motif';
import { WebsitePartBase } from '../../website-part.base';

/** Venue card with illustrated map and directions link. */
@Component({
  selector: 'app-venue-section',
  imports: [Motif],
  templateUrl: './venue-section.html',
  styleUrl: './venue-section.scss',
})
export class VenueSection extends WebsitePartBase {}
