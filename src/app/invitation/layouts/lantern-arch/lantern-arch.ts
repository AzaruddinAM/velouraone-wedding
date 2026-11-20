import { Component } from '@angular/core';
import { FallingParticles } from '../../../shared/falling-particles/falling-particles';
import { Motif } from '../../motif/motif';
import { InvitationLayoutBase } from '../invitation-layout.base';

/** Nikah collection – Pointed arch that draws itself, swinging lanterns and rising sparks. */
@Component({
  selector: 'app-lantern-arch-layout',
  imports: [Motif, FallingParticles],
  templateUrl: './lantern-arch.html',
  styleUrl: './lantern-arch.scss',
})
export class LanternArchLayout extends InvitationLayoutBase {
  protected readonly lanterns = [
    { x: 14, length: 20, size: 9, delay: 0 },
    { x: 30, length: 12, size: 7, delay: -1.2 },
    { x: 46, length: 24, size: 10, delay: -0.6 },
    { x: 62, length: 13, size: 7, delay: -2 },
    { x: 78, length: 19, size: 9, delay: -1.6 },
  ];
}
