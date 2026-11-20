import { Component } from '@angular/core';
import { Motif } from '../../motif/motif';
import { InvitationLayoutBase } from '../invitation-layout.base';

/** Arched jharokha window holding the couple photo (or monogram). */
@Component({
  selector: 'app-arch-window-layout',
  imports: [Motif],
  templateUrl: './arch-window.html',
  styleUrl: './arch-window.scss',
})
export class ArchWindowLayout extends InvitationLayoutBase {}
