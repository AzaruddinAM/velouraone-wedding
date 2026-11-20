import { Component } from '@angular/core';
import { Motif } from '../../motif/motif';
import { InvitationLayoutBase } from '../invitation-layout.base';

/** Nikah collection – Islamic geometric stars around a shining octagon medallion. */
@Component({
  selector: 'app-girih-medallion-layout',
  imports: [Motif],
  templateUrl: './girih-medallion.html',
  styleUrl: './girih-medallion.scss',
})
export class GirihMedallionLayout extends InvitationLayoutBase {
  protected readonly tiles = Array.from({ length: 36 }, (_, i) => i);
}
