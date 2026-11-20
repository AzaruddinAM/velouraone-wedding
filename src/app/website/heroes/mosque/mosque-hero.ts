import { Component } from '@angular/core';
import { FallingParticles } from '../../../shared/falling-particles/falling-particles';
import { Motif } from '../../../invitation/motif/motif';
import { WebsitePartBase } from '../../website-part.base';

/** Nikah collection – Starry night, rising crescent and a mosque skyline with glowing windows. */
@Component({
  selector: 'app-mosque-hero',
  imports: [Motif, FallingParticles],
  templateUrl: './mosque-hero.html',
  styleUrl: './mosque-hero.scss',
})
export class MosqueHero extends WebsitePartBase {
  protected readonly windows = [148, 164, 180, 213, 229, 245].map((x, i) => ({ x, delay: -(i * 0.5) }));
}
