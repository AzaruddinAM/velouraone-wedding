import { Component } from '@angular/core';
import { Motif } from '../../../invitation/motif/motif';
import { WebsitePartBase } from '../../website-part.base';

/** Invitation message with names, date and venue. */
@Component({
  selector: 'app-welcome-section',
  imports: [Motif],
  templateUrl: './welcome-section.html',
  styleUrl: './welcome-section.scss',
})
export class WelcomeSection extends WebsitePartBase {}
