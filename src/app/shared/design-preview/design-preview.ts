import { Component, input } from '@angular/core';
import { SITE_HOST } from '../../core/constants/brand.constants';
import { InvitationDetails } from '../../core/models/invitation-details.model';
import { WeddingDesign } from '../../core/models/wedding-template.model';
import { InvitationCard } from '../../invitation/invitation-card/invitation-card';
import { WeddingWebsite } from '../../website/wedding-website/wedding-website';
import { ScaledFrame } from '../scaled-frame/scaled-frame';

/**
 * Thumbnail of any design at a 5:7 ratio.
 * Cards render directly; websites render their first screen inside a mini browser window.
 */
@Component({
  selector: 'app-design-preview',
  imports: [InvitationCard, WeddingWebsite, ScaledFrame],
  template: `
    @let d = design();
    @if (d.kind === 'card') {
      <app-invitation-card [template]="d" [details]="details()" />
    } @else {
      <div class="browser">
        <div class="chrome" aria-hidden="true">
          <i></i><i></i><i></i>
          <span>{{ host }}/{{ details().bride.toLowerCase() }}-{{ details().groom.toLowerCase() }}</span>
        </div>
        <app-scaled-frame [designWidth]="560" [designHeight]="756">
          <app-wedding-website [template]="d" [details]="details()" mode="preview" heroHeight="700px" />
        </app-scaled-frame>
      </div>
    }
  `,
  styles: `
    :host { display: block; }
    .browser { aspect-ratio: 5 / 7; display: flex; flex-direction: column; overflow: hidden; background: #fff; }
    .chrome {
      display: flex; align-items: center; gap: 4px; flex-shrink: 0; height: 22px; padding: 0 8px;
      background: #ece8ec; border-bottom: 1px solid #dcd6db;
    }
    .chrome i { width: 7px; height: 7px; border-radius: 50%; background: #c9c1c7; }
    .chrome i:first-child { background: #f17d71; }
    .chrome span {
      flex: 1; margin-left: 6px; padding: 1px 8px; overflow: hidden; border-radius: 6px; background: #fff;
      color: #8a7f87; font: 9px/1.5 system-ui, sans-serif; white-space: nowrap; text-overflow: ellipsis;
    }
    app-scaled-frame { flex: 1; overflow: hidden; }
  `,
})
export class DesignPreview {
  readonly design = input.required<WeddingDesign>();
  readonly details = input.required<InvitationDetails>();

  protected readonly host = SITE_HOST;
}
