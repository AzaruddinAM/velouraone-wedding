import { Component, DestroyRef, ElementRef, computed, inject, input, linkedSignal, signal } from '@angular/core';
import { InvitationDetails } from '../../../core/models/invitation-details.model';
import { WebsiteTemplate } from '../../../core/models/wedding-template.model';
import { Motif } from '../../../invitation/motif/motif';
import { Countdown } from '../../../shared/countdown/countdown';
import { FallingParticles } from '../../../shared/falling-particles/falling-particles';
import { ScratchReveal } from '../../../shared/scratch-reveal/scratch-reveal';
import { SafeUrlPipe } from '../../../shared/safe-url.pipe';
import { RevealOnScroll } from '../../reveal-on-scroll.directive';
import { buildWebsiteViewModel } from '../../website-view-model';
import { AmbientMusic } from '../ambient-music';
import { InviteBackdrop } from '../backdrop/invite-backdrop';
import { InviteGate } from '../gate/invite-gate';

interface Wish {
  readonly name: string;
  readonly message: string;
}

type SectionId = 'home' | 'glimpse' | 'event' | 'journey' | 'gallery' | 'family' | 'venue' | 'rsvp' | 'wishes';

/**
 * Invite series: a mobile-first invitation website with an opening screen
 * (envelope, verse, doors, curtain or scroll), original background music, an
 * illustrated hero, scratch-to-see photo, event card with directions & calendar,
 * countdown, journey, gallery, families, map, RSVP and a duas/wishes wall.
 */
@Component({
  selector: 'app-invite-site',
  imports: [InviteGate, InviteBackdrop, Motif, Countdown, FallingParticles, ScratchReveal, RevealOnScroll, SafeUrlPipe],
  templateUrl: './invite-site.html',
  styleUrl: './invite-site.scss',
})
export class InviteSite {
  readonly template = input.required<WebsiteTemplate>();
  readonly details = input.required<InvitationDetails>();
  /** `preview` (thumbnails) shows only the closed opening screen. */
  readonly mode = input<'full' | 'preview'>('full');

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;

  protected readonly vm = computed(() => buildWebsiteViewModel(this.details(), this.template()));
  protected readonly style = computed(() => this.template().invite!);
  protected readonly isNikah = computed(() => !!this.template().wording.arabic);

  /** Closed again whenever another design is shown. */
  protected readonly opened = linkedSignal({ source: this.template, computation: () => false });
  protected readonly menuOpen = signal(false);
  protected readonly music = new AmbientMusic();
  protected readonly rsvpNote = signal('');

  /** The main ceremony (the event without its own time) and the others. */
  protected readonly mainEvent = computed(() => {
    const events = this.vm().events;
    const index = Math.max(0, this.template().events.findIndex((e) => e.dayOffset === 0 && !e.time));
    return { main: events[index], others: events.filter((_, i) => i !== index) };
  });

  protected readonly welcomeMessage = computed(() =>
    this.isNikah()
      ? 'With hearts full of joy and gratitude to Allah, we invite you to share in the beginning of our new journey. Your presence and heartfelt duas will mean the world to us.'
      : 'With hearts full of joy, we invite you to celebrate the beginning of our forever. Your presence and blessings will make our day complete.',
  );

  protected readonly menu: readonly { id: SectionId; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'glimpse', label: 'A glimpse of us' },
    { id: 'event', label: 'The day' },
    { id: 'journey', label: 'Our journey' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'family', label: 'Families' },
    { id: 'venue', label: 'Venue' },
    { id: 'rsvp', label: 'RSVP' },
    { id: 'wishes', label: 'Wishes' },
  ];

  protected readonly galleryTiles = [
    { focus: '50% 25%', filter: 'none', tall: true },
    { focus: '20% 50%', filter: 'grayscale(1)', tall: false },
    { focus: '80% 40%', filter: 'sepia(0.35)', tall: false },
    { focus: '50% 70%', filter: 'saturate(1.2)', tall: false },
  ];

  // ----- Wishes wall (kept in the browser for the demo) -------------------------
  private readonly wishesKey = computed(() => `vo-wishes-${this.template().id}`);
  protected readonly wishes = linkedSignal<Wish[]>(() => this.loadWishes(this.wishesKey()));
  protected readonly wishName = signal('');
  protected readonly wishText = signal('');

  constructor() {
    inject(DestroyRef).onDestroy(() => this.music.stop());
  }

  protected open(): void {
    this.opened.set(true);
    this.music.start();
  }

  protected goTo(id: SectionId): void {
    this.menuOpen.set(false);
    this.host.querySelector(`[data-invite="${id}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  protected rsvp(answer: 'yes' | 'no'): void {
    const url = this.vm().rsvpUrl;
    if (url) {
      window.open(`${url}${encodeURIComponent(answer === 'yes' ? 'Insha’Allah, we will attend.' : 'Sorry, we cannot make it.')}`, '_blank', 'noopener');
      return;
    }
    this.rsvpNote.set('Demo: on your website this opens WhatsApp with your number, so guests reply to you directly.');
  }

  protected sendWish(): void {
    const name = this.wishName().trim();
    const message = this.wishText().trim();
    if (!name || !message) return;
    const next = [{ name, message }, ...this.wishes()].slice(0, 30);
    this.wishes.set(next);
    try {
      localStorage.setItem(this.wishesKey(), JSON.stringify(next));
    } catch {
      // Storage full or blocked – the wish still shows for this visit.
    }
    this.wishName.set('');
    this.wishText.set('');
  }

  protected read(event: Event): string {
    return (event.target as HTMLInputElement | HTMLTextAreaElement).value;
  }

  private loadWishes(key: string): Wish[] {
    try {
      const saved = localStorage.getItem(key);
      if (saved) return JSON.parse(saved) as Wish[];
    } catch {
      // ignore
    }
    return [
      { name: 'Ayesha', message: 'Mabrook! May your home always be filled with love, laughter and barakah.' },
      { name: 'Rahul & family', message: 'Wishing you both a lifetime of happiness together. See you on the big day!' },
    ];
  }
}
