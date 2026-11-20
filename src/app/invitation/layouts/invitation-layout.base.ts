import { Directive, computed, input } from '@angular/core';
import { InvitationViewModel } from '../../core/models/invitation-details.model';
import { WeddingTemplate } from '../../core/models/wedding-template.model';

const BISMILLAH = 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ';

/**
 * Shared inputs for every invitation layout.
 * A layout only decides *structure*; colours & fonts come from CSS variables
 * set by the parent `InvitationCard` (see `--bg`, `--primary`, `--f-script` …).
 */
@Directive()
export abstract class InvitationLayoutBase {
  readonly vm = input.required<InvitationViewModel>();
  readonly template = input.required<WeddingTemplate>();
  /** False in gallery thumbnails – scratch areas then become static. */
  readonly interactive = input(false);

  /** Arabic line for the Nikah layouts (defaults to Bismillah). */
  protected readonly arabic = computed(() => this.template().wording.arabic ?? BISMILLAH);
  protected readonly arabicMeaning = computed(() => this.template().wording.arabicMeaning ?? '');
}
