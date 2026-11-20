import { Injectable, computed, effect, signal } from '@angular/core';
import { InvitationDetails, SAMPLE_DETAILS } from '../models/invitation-details.model';
import { browserStorage } from './browser-storage';

const STORAGE_KEY = 'vo-invitation-draft';

/**
 * The couple's personal details, shared by every template on the site.
 * Type your names once and every design shows them. Saved in the browser.
 */
@Injectable({ providedIn: 'root' })
export class InvitationDraftService {
  private readonly state = signal<InvitationDetails>({
    ...SAMPLE_DETAILS,
    ...browserStorage.read<Partial<InvitationDetails>>(STORAGE_KEY, {}),
  });

  readonly details = this.state.asReadonly();

  /** True when the visitor has changed anything from the sample data. */
  readonly isPersonalised = computed(() => {
    const d = this.state();
    return (Object.keys(SAMPLE_DETAILS) as (keyof InvitationDetails)[]).some((k) => d[k] !== SAMPLE_DETAILS[k]);
  });

  /** Set when the browser refused to store the (large) photo. */
  readonly photoNotSaved = signal(false);

  constructor() {
    effect(() => {
      const details = this.state();
      if (browserStorage.write(STORAGE_KEY, details)) {
        this.photoNotSaved.set(false);
      } else {
        // Most likely the photo is too big for storage – keep everything else.
        browserStorage.write(STORAGE_KEY, { ...details, photoUrl: null });
        this.photoNotSaved.set(details.photoUrl !== null);
      }
    });
  }

  update(patch: Partial<InvitationDetails>): void {
    this.state.update((current) => ({ ...current, ...patch }));
  }

  reset(): void {
    this.state.set({ ...SAMPLE_DETAILS });
  }
}
