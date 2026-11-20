import { Component } from '@angular/core';
import { Motif } from '../../motif/motif';
import { InvitationLayoutBase } from '../invitation-layout.base';

/** Kasavu saree borders with a nilavilakku-style lamp at the centre. */
@Component({
  selector: 'app-kerala-kasavu-layout',
  imports: [Motif],
  templateUrl: './kerala-kasavu.html',
  styleUrl: './kerala-kasavu.scss',
})
export class KeralaKasavuLayout extends InvitationLayoutBase {}
