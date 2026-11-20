import { Component, signal } from '@angular/core';
import { Countdown } from '../../../shared/countdown/countdown';
import { Motif } from '../../../invitation/motif/motif';
import { WebsitePartBase } from '../../website-part.base';

/** Countdown + RSVP buttons. (Demo: on a real site RSVPs go to the couple.) */
@Component({
  selector: 'app-rsvp-section',
  imports: [Motif, Countdown],
  templateUrl: './rsvp-section.html',
  styleUrl: './rsvp-section.scss',
})
export class RsvpSection extends WebsitePartBase {
  protected readonly reply = signal('');

  protected answer(choice: 'yes' | 'no'): void {
    this.reply.set(
      choice === 'yes'
        ? 'Demo: on your website, this RSVP is sent straight to your WhatsApp.'
        : "Demo: guests who can't come can still send you their wishes.",
    );
  }
}
