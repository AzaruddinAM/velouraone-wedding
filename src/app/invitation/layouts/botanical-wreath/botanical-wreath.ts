import { Component } from '@angular/core';
import { Motif } from '../../motif/motif';
import { InvitationLayoutBase } from '../invitation-layout.base';

/** A circular wreath of leaves framing the couple initials. */
@Component({
  selector: 'app-botanical-wreath-layout',
  imports: [Motif],
  templateUrl: './botanical-wreath.html',
  styleUrl: './botanical-wreath.scss',
})
export class BotanicalWreathLayout extends InvitationLayoutBase {
  /** 30 leaves spaced around a circle, each slightly tilted. */
  protected readonly leaves = Array.from({ length: 30 }, (_, i) => {
    const angle = i * 12;
    const tilt = i % 2 === 0 ? 35 : -35;
    return { angle, transform: `rotate(${angle}deg) translateY(-24cqw) rotate(${tilt}deg)` };
  });
}
