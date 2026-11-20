import { Component } from '@angular/core';
import { Motif } from '../../motif/motif';
import { InvitationLayoutBase } from '../invitation-layout.base';

/** Left-aligned editorial layout with an oversized numeric date. */
@Component({
  selector: 'app-modern-minimal-layout',
  imports: [Motif],
  templateUrl: './modern-minimal.html',
  styleUrl: './modern-minimal.scss',
})
export class ModernMinimalLayout extends InvitationLayoutBase {}
