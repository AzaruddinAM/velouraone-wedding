import { Component, computed, input, output, signal } from '@angular/core';
import { WebsiteTemplate } from '../../../core/models/wedding-template.model';
import { Motif } from '../../../invitation/motif/motif';
import { WebsiteViewModel } from '../../website-view-model';
import { InviteBackdrop } from '../backdrop/invite-backdrop';

/** How long each opening animation plays before the invitation appears. */
const OPEN_MS: Record<string, number> = { envelope: 1700, welcome: 900, doors: 1800, curtain: 1700, scroll: 2000, waxseal: 2100, bow: 2000, inkbloom: 1900, crescent: 1900, pocket: 1800 };

/**
 * The first screen of an Invite-series website. Five different openings:
 * a wax-sealed envelope, a verse welcome screen, carved doors, velvet curtains
 * or a parchment scroll. Tapping plays the animation, then emits `opened`.
 */
@Component({
  selector: 'app-invite-gate',
  imports: [Motif, InviteBackdrop],
  templateUrl: './invite-gate.html',
  styleUrl: './invite-gate.scss',
})
export class InviteGate {
  readonly template = input.required<WebsiteTemplate>();
  readonly vm = input.required<WebsiteViewModel>();
  /** False in thumbnails: the gate is just a picture. */
  readonly interactive = input(false);
  readonly opened = output<void>();

  protected readonly opening = signal(false);
  protected readonly intro = computed(() => this.template().invite?.intro ?? 'envelope');
  protected readonly isNikah = computed(() => !!this.template().wording.arabic);

  protected open(): void {
    if (!this.interactive() || this.opening()) return;
    this.opening.set(true);
    setTimeout(() => this.opened.emit(), OPEN_MS[this.intro()] ?? 1200);
  }
}
