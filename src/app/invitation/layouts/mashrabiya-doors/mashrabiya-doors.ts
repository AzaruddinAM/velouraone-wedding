import { Component } from '@angular/core';
import { Motif } from '../../motif/motif';
import { InvitationLayoutBase } from '../invitation-layout.base';

/** Nikah collection – Carved lattice doors swing open to reveal the invitation. */
@Component({
  selector: 'app-mashrabiya-doors-layout',
  imports: [Motif],
  templateUrl: './mashrabiya-doors.html',
  styleUrl: './mashrabiya-doors.scss',
})
export class MashrabiyaDoorsLayout extends InvitationLayoutBase {}
