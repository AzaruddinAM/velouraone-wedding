import { Component } from '@angular/core';
import { Motif } from '../../motif/motif';
import { InvitationLayoutBase } from '../invitation-layout.base';

/** Large interlaced initials inside a crest with a halo ornament. */
@Component({
  selector: 'app-monogram-layout',
  imports: [Motif],
  templateUrl: './monogram.html',
  styleUrl: './monogram.scss',
})
export class MonogramLayout extends InvitationLayoutBase {}
