import { Component } from '@angular/core';
import { Motif } from '../../../invitation/motif/motif';
import { WebsitePartBase } from '../../website-part.base';

/** Schedule of wedding functions. */
@Component({
  selector: 'app-events-section',
  imports: [Motif],
  templateUrl: './events-section.html',
  styleUrl: './events-section.scss',
})
export class EventsSection extends WebsitePartBase {}
