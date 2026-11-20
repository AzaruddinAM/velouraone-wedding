import { Component } from '@angular/core';
import { Motif } from '../../motif/motif';
import { InvitationLayoutBase } from '../invitation-layout.base';

/** Large ornaments blooming from opposite corners, stacked script names. */
@Component({
  selector: 'app-floral-corners-layout',
  imports: [Motif],
  templateUrl: './floral-corners.html',
  styleUrl: './floral-corners.scss',
})
export class FloralCornersLayout extends InvitationLayoutBase {}
