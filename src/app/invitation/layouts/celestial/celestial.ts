import { Component } from '@angular/core';
import { Motif } from '../../motif/motif';
import { InvitationLayoutBase } from '../invitation-layout.base';

/** Night sky with twinkling stars and a moon orbit around the names. */
@Component({
  selector: 'app-celestial-layout',
  imports: [Motif],
  templateUrl: './celestial.html',
  styleUrl: './celestial.scss',
})
export class CelestialLayout extends InvitationLayoutBase {
  /** Fixed (deterministic) star positions so every render looks the same. */
  protected readonly stars = Array.from({ length: 28 }, (_, i) => ({
    x: (i * 37 + 11) % 96,
    y: (i * 53 + 7) % 97,
    size: 1 + ((i * 7) % 4) * 0.6,
    delay: (i % 6) * 0.45,
  }));
}
