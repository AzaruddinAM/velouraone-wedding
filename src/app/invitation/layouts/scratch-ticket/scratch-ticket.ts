import { Component, signal } from '@angular/core';
import { FallingParticles } from '../../../shared/falling-particles/falling-particles';
import { ScratchReveal } from '../../../shared/scratch-reveal/scratch-reveal';
import { Motif } from '../../motif/motif';
import { InvitationLayoutBase } from '../invitation-layout.base';

/** Nikah collection – Invitation ticket with a gold foil strip hiding the date & venue. */
@Component({
  selector: 'app-scratch-ticket-layout',
  imports: [Motif, FallingParticles, ScratchReveal],
  templateUrl: './scratch-ticket.html',
  styleUrl: './scratch-ticket.scss',
})
export class ScratchTicketLayout extends InvitationLayoutBase {
  /** How many scratch areas the guest has uncovered. */
  protected readonly revealedCount = signal(0);

  protected onReveal(): void {
    this.revealedCount.update((n) => n + 1);
  }
}
