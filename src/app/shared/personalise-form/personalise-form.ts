import { Component, inject, input, signal } from '@angular/core';
import { InvitationDetails } from '../../core/models/invitation-details.model';
import { InvitationDraftService } from '../../core/services/invitation-draft.service';
import { resizeImageFile } from '../../core/utils/image.utils';
import { Icon } from '../icon/icon';

type TextField = Exclude<keyof InvitationDetails, 'photoUrl'>;

/**
 * Edits the shared invitation details. Every change is applied instantly
 * to all previews on the site (signals) and saved in the browser.
 */
@Component({
  selector: 'app-personalise-form',
  imports: [Icon],
  templateUrl: './personalise-form.html',
  styleUrl: './personalise-form.scss',
})
export class PersonaliseForm {
  /** `names` = just bride & groom (used on the home page). */
  readonly mode = input<'full' | 'names'>('full');
  /** Whether the current template has a photo frame. */
  readonly showsPhoto = input(true);

  protected readonly draft = inject(InvitationDraftService);
  protected readonly details = this.draft.details;
  protected readonly photoBusy = signal(false);
  protected readonly photoError = signal('');

  protected setText(field: TextField, event: Event): void {
    this.draft.update({ [field]: (event.target as HTMLInputElement).value });
  }

  protected async onPhotoSelected(event: Event): Promise<void> {
    const inputEl = event.target as HTMLInputElement;
    const file = inputEl.files?.[0];
    inputEl.value = '';
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      this.photoError.set('Please choose an image file (JPG, PNG, WEBP…).');
      return;
    }

    this.photoBusy.set(true);
    this.photoError.set('');
    try {
      this.draft.update({ photoUrl: await resizeImageFile(file) });
    } catch {
      this.photoError.set('Sorry, this photo could not be read. Please try another one.');
    } finally {
      this.photoBusy.set(false);
    }
  }

  protected removePhoto(): void {
    this.draft.update({ photoUrl: null });
  }
}
