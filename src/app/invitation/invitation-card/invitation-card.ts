import { Component, computed, input } from '@angular/core';
import { InvitationDetails } from '../../core/models/invitation-details.model';
import { WeddingTemplate } from '../../core/models/wedding-template.model';
import { buildInvitationViewModel } from '../invitation-view-model';
import { ArchWindowLayout } from '../layouts/arch-window/arch-window';
import { ArtDecoLayout } from '../layouts/art-deco/art-deco';
import { BoldTypoLayout } from '../layouts/bold-typo/bold-typo';
import { BotanicalWreathLayout } from '../layouts/botanical-wreath/botanical-wreath';
import { CelestialLayout } from '../layouts/celestial/celestial';
import { FloralCornersLayout } from '../layouts/floral-corners/floral-corners';
import { KeralaKasavuLayout } from '../layouts/kerala-kasavu/kerala-kasavu';
import { ModernMinimalLayout } from '../layouts/modern-minimal/modern-minimal';
import { MonogramLayout } from '../layouts/monogram/monogram';
import { PhotoSplitLayout } from '../layouts/photo-split/photo-split';
import { PolaroidLayout } from '../layouts/polaroid/polaroid';
import { RibbonScrollLayout } from '../layouts/ribbon-scroll/ribbon-scroll';
import { RoyalFrameLayout } from '../layouts/royal-frame/royal-frame';
import { TempleGateLayout } from '../layouts/temple-gate/temple-gate';
import { GirihMedallionLayout } from '../layouts/girih-medallion/girih-medallion';
import { LanternArchLayout } from '../layouts/lantern-arch/lantern-arch';
import { MashrabiyaDoorsLayout } from '../layouts/mashrabiya-doors/mashrabiya-doors';
import { MosqueSkylineLayout } from '../layouts/mosque-skyline/mosque-skyline';
import { ScratchCirclesLayout } from '../layouts/scratch-circles/scratch-circles';
import { ScratchTicketLayout } from '../layouts/scratch-ticket/scratch-ticket';

/**
 * Renders any wedding template with the given details.
 * It applies the theme as CSS variables and picks the matching layout component.
 * The card always keeps a 5:7 ratio and scales with its width.
 */
@Component({
  selector: 'app-invitation-card',
  imports: [
    ArchWindowLayout,
    ArtDecoLayout,
    BoldTypoLayout,
    BotanicalWreathLayout,
    CelestialLayout,
    FloralCornersLayout,
    KeralaKasavuLayout,
    ModernMinimalLayout,
    MonogramLayout,
    PhotoSplitLayout,
    PolaroidLayout,
    RibbonScrollLayout,
    RoyalFrameLayout,
    TempleGateLayout,
    // Nikah collection
    LanternArchLayout,
    GirihMedallionLayout,
    MosqueSkylineLayout,
    MashrabiyaDoorsLayout,
    ScratchCirclesLayout,
    ScratchTicketLayout,
  ],
  templateUrl: './invitation-card.html',
  styleUrl: './invitation-card.scss',
})
export class InvitationCard {
  readonly template = input.required<WeddingTemplate>();
  readonly details = input.required<InvitationDetails>();
  /** Enables scratch-to-reveal areas (off in thumbnails, where the card is a link). */
  readonly interactive = input(false);

  protected readonly vm = computed(() => buildInvitationViewModel(this.details(), this.template()));

  /** Theme → CSS custom properties consumed by every layout stylesheet. */
  protected readonly themeVars = computed(() => {
    const t = this.template().theme;
    return {
      '--bg': t.bg,
      '--surface': t.surface,
      '--ink': t.ink,
      '--primary': t.primary,
      '--accent': t.accent,
      '--soft': t.soft,
      '--f-script': t.fontScript,
      '--f-heading': t.fontHeading,
      '--f-body': t.fontBody,
    };
  });
}
