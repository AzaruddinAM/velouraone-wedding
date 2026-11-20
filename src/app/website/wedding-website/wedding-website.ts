import { Component, ElementRef, computed, inject, input } from '@angular/core';
import { InvitationDetails } from '../../core/models/invitation-details.model';
import { WebsiteTemplate } from '../../core/models/wedding-template.model';
import { ArchHero } from '../heroes/arch/arch-hero';
import { CurtainHero } from '../heroes/curtain/curtain-hero';
import { EditorialHero } from '../heroes/editorial/editorial-hero';
import { FloralHero } from '../heroes/floral/floral-hero';
import { FrameHero } from '../heroes/frame/frame-hero';
import { FullbleedHero } from '../heroes/fullbleed/fullbleed-hero';
import { KasavuHero } from '../heroes/kasavu/kasavu-hero';
import { MarqueeHero } from '../heroes/marquee/marquee-hero';
import { PolaroidHero } from '../heroes/polaroid/polaroid-hero';
import { SealHero } from '../heroes/seal/seal-hero';
import { SplitHero } from '../heroes/split/split-hero';
import { StarryHero } from '../heroes/starry/starry-hero';
import { ToranHero } from '../heroes/toran/toran-hero';
import { WreathHero } from '../heroes/wreath/wreath-hero';
import { DoorsHero } from '../heroes/doors/doors-hero';
import { GirihHero } from '../heroes/girih/girih-hero';
import { LanternHero } from '../heroes/lantern/lantern-hero';
import { MosqueHero } from '../heroes/mosque/mosque-hero';
import { PetalsHero } from '../heroes/petals/petals-hero';
import { ScratchHero } from '../heroes/scratch/scratch-hero';
import { Scene3dHero } from '../heroes/scene3d/scene3d-hero';
import { RevealOnScroll } from '../reveal-on-scroll.directive';
import { CoupleSection } from '../sections/couple/couple-section';
import { EventsSection } from '../sections/events/events-section';
import { FooterSection } from '../sections/footer/footer-section';
import { GallerySection } from '../sections/gallery/gallery-section';
import { RsvpSection } from '../sections/rsvp/rsvp-section';
import { StorySection } from '../sections/story/story-section';
import { VenueSection } from '../sections/venue/venue-section';
import { WelcomeSection } from '../sections/welcome/welcome-section';
import { buildWebsiteViewModel } from '../website-view-model';

type SectionId = 'welcome' | 'couple' | 'story' | 'events' | 'gallery' | 'venue' | 'rsvp' | 'footer';

/**
 * Renders a complete wedding invitation website for any website template.
 *  • `mode="full"`    – every section (detail preview & live demo)
 *  • `mode="preview"` – navigation + hero only (gallery thumbnails)
 * Layout adapts to its own width (container queries), so the same component
 * works inside a 390px phone frame and on a full desktop screen.
 */
@Component({
  selector: 'app-wedding-website',
  imports: [
    ArchHero, CurtainHero, EditorialHero, FloralHero, FrameHero, FullbleedHero, KasavuHero,
    MarqueeHero, PolaroidHero, SealHero, SplitHero, StarryHero, ToranHero, WreathHero,
    LanternHero, MosqueHero, DoorsHero, GirihHero, ScratchHero, PetalsHero, Scene3dHero, RevealOnScroll,
    WelcomeSection, CoupleSection, StorySection, EventsSection, GallerySection, VenueSection, RsvpSection, FooterSection,
  ],
  templateUrl: './wedding-website.html',
  styleUrl: './wedding-website.scss',
})
export class WeddingWebsite {
  readonly template = input.required<WebsiteTemplate>();
  readonly details = input.required<InvitationDetails>();
  readonly mode = input<'full' | 'preview'>('full');
  /** Height of the first screen, e.g. `100svh` on the live site or `720px` in a frame. */
  readonly heroHeight = input('100svh');

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;

  protected readonly vm = computed(() => buildWebsiteViewModel(this.details(), this.template()));

  protected readonly sections: readonly SectionId[] = ['welcome', 'couple', 'story', 'events', 'gallery', 'venue', 'rsvp', 'footer'];

  protected readonly navLinks: readonly { id: SectionId; label: string }[] = [
    { id: 'story', label: 'Our Story' },
    { id: 'events', label: 'Events' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'venue', label: 'Venue' },
  ];

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
      '--hero-h': this.heroHeight(),
    };
  });

  /** Smooth-scrolls to a section inside this website (works inside preview frames too). */
  protected scrollTo(id: SectionId): void {
    this.host.querySelector(`[data-section="${id}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
