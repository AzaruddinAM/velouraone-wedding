import { Component, computed } from '@angular/core';
import { Motif } from '../../../invitation/motif/motif';
import { WebsitePartBase } from '../../website-part.base';

/** Bride & groom profile cards. */
@Component({
  selector: 'app-couple-section',
  imports: [Motif],
  templateUrl: './couple-section.html',
  styleUrl: './couple-section.scss',
})
export class CoupleSection extends WebsitePartBase {
  /** Both portraits use the couple photo, cropped left / right. */
  protected readonly people = computed(() => {
    const v = this.vm();
    return [
      { role: 'The Bride', name: v.bride, initial: v.brideInitial, focus: '30% 30%', line: 'Kind heart, bright smile and the best laugh in the room.' },
      { role: 'The Groom', name: v.groom, initial: v.groomInitial, focus: '70% 30%', line: 'Calm, caring and forever making everyone feel at home.' },
    ];
  });
}
