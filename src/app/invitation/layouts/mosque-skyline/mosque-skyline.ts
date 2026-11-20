import { Component } from '@angular/core';
import { FallingParticles } from '../../../shared/falling-particles/falling-particles';
import { Motif } from '../../motif/motif';
import { InvitationLayoutBase } from '../invitation-layout.base';

/** Nikah collection – Night sky with a rising crescent over a mosque silhouette with glowing windows. */
@Component({
  selector: 'app-mosque-skyline-layout',
  imports: [Motif, FallingParticles],
  templateUrl: './mosque-skyline.html',
  styleUrl: './mosque-skyline.scss',
})
export class MosqueSkylineLayout extends InvitationLayoutBase {
  protected readonly windows = [31, 35, 40, 45, 53, 58, 63, 67].map((x, i) => ({ x, delay: -(i * 0.4) }));
}
