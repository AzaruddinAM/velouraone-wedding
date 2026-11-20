import { Component, computed, signal } from '@angular/core';
import { FallingParticles } from '../../../shared/falling-particles/falling-particles';
import { ScratchReveal } from '../../../shared/scratch-reveal/scratch-reveal';
import { Motif } from '../../motif/motif';
import { InvitationLayoutBase } from '../invitation-layout.base';

/** Nikah collection – Scratch three golden coins to reveal the day, month and year. */
@Component({
  selector: 'app-scratch-circles-layout',
  imports: [Motif, FallingParticles, ScratchReveal],
  templateUrl: './scratch-circles.html',
  styleUrl: './scratch-circles.scss',
})
export class ScratchCirclesLayout extends InvitationLayoutBase {
  /** How many scratch areas the guest has uncovered. */
  protected readonly revealedCount = signal(0);

  protected onReveal(): void {
    this.revealedCount.update((n) => n + 1);
  }

  protected readonly dateParts = computed(() => {
    const v = this.vm();
    return [
      { label: 'Day', value: v.day },
      { label: 'Month', value: v.monthShort },
      { label: 'Year', value: v.year },
    ];
  });
}
