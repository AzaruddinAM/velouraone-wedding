import { Component } from '@angular/core';
import { FallingParticles } from '../../../shared/falling-particles/falling-particles';
import { Countdown } from '../../../shared/countdown/countdown';
import { Motif } from '../../../invitation/motif/motif';
import { WebsitePartBase } from '../../website-part.base';

/** Nikah collection – Pointed arch drawn on arrival, swinging lanterns, rising sparks and a countdown. */
@Component({
  selector: 'app-lantern-hero',
  imports: [Motif, FallingParticles, Countdown],
  templateUrl: './lantern-hero.html',
  styleUrl: './lantern-hero.scss',
})
export class LanternHero extends WebsitePartBase {
  protected readonly lanterns = [
    { x: 8, length: 120, size: 46, delay: 0 },
    { x: 22, length: 70, size: 34, delay: -1.1 },
    { x: 36, length: 150, size: 54, delay: -0.5 },
    { x: 60, length: 90, size: 40, delay: -2 },
    { x: 76, length: 140, size: 50, delay: -1.5 },
    { x: 90, length: 60, size: 32, delay: -0.8 },
  ];
}
