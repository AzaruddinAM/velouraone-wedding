import { Component } from '@angular/core';
import { Motif } from '../../motif/motif';
import { InvitationLayoutBase } from '../invitation-layout.base';

/** Double gold frame, ornament in every corner, crest on top. */
@Component({
  selector: 'app-royal-frame-layout',
  imports: [Motif],
  templateUrl: './royal-frame.html',
  styleUrl: './royal-frame.scss',
})
export class RoyalFrameLayout extends InvitationLayoutBase {
  protected readonly corners = ['top-left', 'top-right', 'bottom-left', 'bottom-right'] as const;
}
