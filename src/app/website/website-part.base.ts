import { Directive, computed, input } from '@angular/core';
import { WebsiteTemplate } from '../core/models/wedding-template.model';
import { WebsiteViewModel } from './website-view-model';

const BISMILLAH = 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ';

/**
 * Shared inputs for every website hero and section.
 * The host gets a `s-classic | s-cards | s-editorial | s-bold` class
 * so each section stylesheet can style the four section looks.
 * Colours & fonts come from CSS variables set by `WeddingWebsite`.
 */
@Directive({
  host: { '[class]': "'s-' + template().sectionStyle" },
})
export abstract class WebsitePartBase {
  readonly vm = input.required<WebsiteViewModel>();
  readonly template = input.required<WebsiteTemplate>();
  /** False in gallery thumbnails – scratch areas then become static. */
  readonly interactive = input(false);

  /** Arabic line for Nikah designs (Bismillah unless the template sets another). */
  protected readonly arabic = computed(() => this.template().wording.arabic ?? BISMILLAH);
  protected readonly arabicMeaning = computed(() => this.template().wording.arabicMeaning ?? '');
}
