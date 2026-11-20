import { Component } from '@angular/core';
import { Motif } from '../../motif/motif';
import { InvitationLayoutBase } from '../invitation-layout.base';

/** Scrapbook polaroid with washi tape, doodles and a postmark date stamp. */
@Component({
  selector: 'app-polaroid-layout',
  imports: [Motif],
  templateUrl: './polaroid.html',
  styleUrl: './polaroid.scss',
})
export class PolaroidLayout extends InvitationLayoutBase {
  protected readonly doodles = [
    { x: 6, y: 8, r: -15 },
    { x: 84, y: 6, r: 20 },
    { x: 4, y: 58, r: 10 },
    { x: 88, y: 52, r: -10 },
  ];
}
