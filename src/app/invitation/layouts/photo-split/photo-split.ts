import { Component } from '@angular/core';
import { Motif } from '../../motif/motif';
import { InvitationLayoutBase } from '../invitation-layout.base';

/** Photo on top with a diagonal cut, details below. */
@Component({
  selector: 'app-photo-split-layout',
  imports: [Motif],
  templateUrl: './photo-split.html',
  styleUrl: './photo-split.scss',
})
export class PhotoSplitLayout extends InvitationLayoutBase {
  /** Tiles for the patterned placeholder shown when no photo is uploaded. */
  protected readonly pattern = Array.from({ length: 12 }, (_, i) => i);
}
