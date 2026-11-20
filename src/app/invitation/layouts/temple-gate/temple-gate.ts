import { Component } from '@angular/core';
import { Motif } from '../../motif/motif';
import { InvitationLayoutBase } from '../invitation-layout.base';

/** Marigold toran, temple pillars and bells around a festive centre. */
@Component({
  selector: 'app-temple-gate-layout',
  imports: [Motif],
  templateUrl: './temple-gate.html',
  styleUrl: './temple-gate.scss',
})
export class TempleGateLayout extends InvitationLayoutBase {
  /** Bead counts for each hanging marigold string (drawn left → right). */
  protected readonly drops = [3, 5, 4, 6, 4, 5, 3].map((count) => Array.from({ length: count }, (_, i) => i));
}
