import { Component } from '@angular/core';
import { Countdown } from '../../../shared/countdown/countdown';
import { Motif } from '../../../invitation/motif/motif';
import { WebsitePartBase } from '../../website-part.base';

/** Ornate double frame with corner ornaments, crest and countdown. */
@Component({
  selector: 'app-frame-hero',
  imports: [Motif, Countdown],
  templateUrl: './frame-hero.html',
  styleUrl: './frame-hero.scss',
})
export class FrameHero extends WebsitePartBase {
  protected readonly corners = ['top-left', 'top-right', 'bottom-left', 'bottom-right'] as const;
}
