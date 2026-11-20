import { Component } from '@angular/core';
import { Motif } from '../../motif/motif';
import { InvitationLayoutBase } from '../invitation-layout.base';

/** Giant stacked names, colour blocks and a sticker – modern and playful. */
@Component({
  selector: 'app-bold-typo-layout',
  imports: [Motif],
  templateUrl: './bold-typo.html',
  styleUrl: './bold-typo.scss',
})
export class BoldTypoLayout extends InvitationLayoutBase {}
