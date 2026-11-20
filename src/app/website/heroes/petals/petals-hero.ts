import { Component } from '@angular/core';
import { FallingParticles } from '../../../shared/falling-particles/falling-particles';
import { Countdown } from '../../../shared/countdown/countdown';
import { Motif } from '../../../invitation/motif/motif';
import { WebsitePartBase } from '../../website-part.base';

/** Nikah collection – Rose petals drifting over a pointed arch while the names ink in. */
@Component({
  selector: 'app-petals-hero',
  imports: [Motif, FallingParticles, Countdown],
  templateUrl: './petals-hero.html',
  styleUrl: './petals-hero.scss',
})
export class PetalsHero extends WebsitePartBase {}
