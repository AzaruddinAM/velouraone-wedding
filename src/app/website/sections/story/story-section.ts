import { Component } from '@angular/core';
import { Motif } from '../../../invitation/motif/motif';
import { WebsitePartBase } from '../../website-part.base';

/** Love story timeline. */
@Component({
  selector: 'app-story-section',
  imports: [Motif],
  templateUrl: './story-section.html',
  styleUrl: './story-section.scss',
})
export class StorySection extends WebsitePartBase {}
