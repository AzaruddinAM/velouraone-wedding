import { Component } from '@angular/core';
import { Motif } from '../../motif/motif';
import { InvitationLayoutBase } from '../invitation-layout.base';

/** Rolled parchment scroll finished with a wax seal. */
@Component({
  selector: 'app-ribbon-scroll-layout',
  imports: [Motif],
  templateUrl: './ribbon-scroll.html',
  styleUrl: './ribbon-scroll.scss',
})
export class RibbonScrollLayout extends InvitationLayoutBase {}
