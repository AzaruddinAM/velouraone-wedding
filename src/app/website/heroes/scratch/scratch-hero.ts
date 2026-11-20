import { Component, computed, signal } from '@angular/core';
import { FallingParticles } from '../../../shared/falling-particles/falling-particles';
import { ScratchReveal } from '../../../shared/scratch-reveal/scratch-reveal';
import { WebsitePartBase } from '../../website-part.base';

/** Nikah collection – Guests scratch three golden coins to reveal the Nikah date. */
@Component({
  selector: 'app-scratch-hero',
  imports: [FallingParticles, ScratchReveal],
  templateUrl: './scratch-hero.html',
  styleUrl: './scratch-hero.scss',
})
export class ScratchHero extends WebsitePartBase {
  /** How many coins the guest has uncovered. */
  protected readonly revealedCount = signal(0);

  protected readonly dateParts = computed(() => {
    const v = this.vm();
    return [
      { label: 'Day', value: v.day },
      { label: 'Month', value: v.monthShort },
      { label: 'Year', value: v.year },
    ];
  });

  protected onReveal(): void {
    this.revealedCount.update((n) => n + 1);
  }
}
