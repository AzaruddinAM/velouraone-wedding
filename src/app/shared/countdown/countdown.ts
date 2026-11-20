import { Component, DestroyRef, computed, inject, input, signal } from '@angular/core';
import { parseLocalDate } from '../../invitation/invitation-view-model';

interface CountdownPart {
  label: string;
  value: string;
}

/** Live "days / hours / minutes / seconds" countdown to the wedding. */
@Component({
  selector: 'app-countdown',
  template: `
    @if (parts(); as items) {
      <div class="countdown" role="timer" aria-live="off">
        @for (part of items; track part.label) {
          <div class="unit">
            <strong>{{ part.value }}</strong>
            <span>{{ part.label }}</span>
          </div>
        }
      </div>
    } @else {
      <p class="married">Just married! 💍</p>
    }
  `,
  styles: `
    .countdown { display: flex; justify-content: center; gap: 0.6rem; }
    /* Parents can theme it with --cd-bg / --cd-border / --cd-ink. */
    .unit {
      display: grid; min-width: 4.2rem; padding: 0.6rem 0.4rem; text-align: center;
      border-radius: 0.8rem; background: var(--cd-bg, rgb(255 255 255 / 0.14)); backdrop-filter: blur(6px);
      border: 1px solid var(--cd-border, rgb(255 255 255 / 0.25)); color: var(--cd-ink, inherit);
    }
    strong { font-size: 1.6rem; line-height: 1.1; font-variant-numeric: tabular-nums; }
    span { font-size: 0.7rem; letter-spacing: 0.12em; text-transform: uppercase; opacity: 0.85; }
    .married { text-align: center; font-size: 1.2rem; }
  `,
})
export class Countdown {
  /** ISO date `yyyy-mm-dd`. */
  readonly date = input.required<string>();
  /** `hh:mm`. */
  readonly time = input('00:00');

  private readonly now = signal(Date.now());

  protected readonly parts = computed<CountdownPart[] | null>(() => {
    const day = parseLocalDate(this.date());
    if (!day) return null;
    const [hours, minutes] = this.time().split(':').map(Number);
    day.setHours(hours || 0, minutes || 0);

    const diff = day.getTime() - this.now();
    if (diff <= 0) return null;

    const pad = (n: number) => String(n).padStart(2, '0');
    const seconds = Math.floor(diff / 1000);
    return [
      { label: 'Days', value: String(Math.floor(seconds / 86400)) },
      { label: 'Hours', value: pad(Math.floor((seconds % 86400) / 3600)) },
      { label: 'Mins', value: pad(Math.floor((seconds % 3600) / 60)) },
      { label: 'Secs', value: pad(seconds % 60) },
    ];
  });

  constructor() {
    const timer = setInterval(() => this.now.set(Date.now()), 1000);
    inject(DestroyRef).onDestroy(() => clearInterval(timer));
  }
}
