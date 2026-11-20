import { Component } from '@angular/core';
import { Motif } from '../../motif/motif';
import { InvitationLayoutBase } from '../invitation-layout.base';

/** Gatsby-style geometric frame with stepped corners and a sunburst fan. */
@Component({
  selector: 'app-art-deco-layout',
  imports: [Motif],
  templateUrl: './art-deco.html',
  styleUrl: './art-deco.scss',
})
export class ArtDecoLayout extends InvitationLayoutBase {}
