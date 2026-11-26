import { Component, computed, input, model, signal } from '@angular/core';
import {
  CustomEvent,
  CustomStoryMoment,
  InvitationDetails,
  WEBSITE_SECTION_OPTIONS,
  WebsiteSectionKey,
} from '../../core/models/invitation-details.model';
import { WebsiteTemplate } from '../../core/models/wedding-template.model';
import { resizeImageFile } from '../../core/utils/image.utils';
import { buildWebsiteViewModel } from '../../website/website-view-model';

/** Everything the admin can set on top of the couple's basic details. */
export interface AdminExtras {
  photos: string[];
  hashtag: string;
  opening: string;
  invitation: string;
  welcome: string;
  story: CustomStoryMoment[];
  events: CustomEvent[];
  hidden: WebsiteSectionKey[];
}

export const EMPTY_EXTRAS: AdminExtras = {
  photos: [],
  hashtag: '',
  opening: '',
  invitation: '',
  welcome: '',
  story: [],
  events: [],
  hidden: [],
};

export const MAX_PHOTOS = 12;
/** Keeps one generate request well under the server's 8 MB limit. */
const MAX_PAYLOAD_CHARS = 7 * 1024 * 1024;

type TextKey = 'hashtag' | 'opening' | 'invitation' | 'welcome';

/** Admin only: gallery photos, wording, own story & events and which sections to show. */
@Component({
  selector: 'app-admin-customise',
  templateUrl: './admin-customise.html',
  styleUrl: './admin-customise.scss',
})
export class AdminCustomise {
  readonly extras = model.required<AdminExtras>();
  readonly design = input<WebsiteTemplate | null>(null);
  readonly details = input.required<InvitationDetails>();

  protected readonly sectionOptions = WEBSITE_SECTION_OPTIONS;
  protected readonly maxPhotos = MAX_PHOTOS;
  protected readonly busy = signal(false);
  protected readonly photoError = signal('');

  /** What the website shows without changes – used as placeholders and to start editing. */
  protected readonly defaults = computed(() => {
    const design = this.design();
    if (!design) return null;
    const vm = buildWebsiteViewModel({ ...this.details(), story: [], events: [], hashtag: '', opening: '', invitation: '' }, design);
    return { vm, design };
  });

  protected readonly photoSize = computed(() => {
    const chars = this.extras().photos.reduce((sum, p) => sum + p.length, 0);
    return `${(chars / 1024 / 1024).toFixed(1)} MB`;
  });

  private patch(change: Partial<AdminExtras>): void {
    this.extras.update((e) => ({ ...e, ...change }));
  }

  protected value(event: Event): string {
    return (event.target as HTMLInputElement | HTMLTextAreaElement).value;
  }

  protected setText(key: TextKey, event: Event): void {
    this.patch({ [key]: this.value(event) });
  }

  // ----- Photos -----------------------------------------------------------------------
  protected async addPhotos(event: Event): Promise<void> {
    const inputEl = event.target as HTMLInputElement;
    const files = [...(inputEl.files ?? [])].filter((f) => f.type.startsWith('image/'));
    inputEl.value = '';
    if (!files.length) return;

    const room = MAX_PHOTOS - this.extras().photos.length;
    this.photoError.set(files.length > room ? `Up to ${MAX_PHOTOS} photos fit, so only ${Math.max(room, 0)} more could be added.` : '');
    this.busy.set(true);
    try {
      for (const file of files.slice(0, Math.max(room, 0))) {
        const data = await resizeImageFile(file, 1400, 0.8);
        const total = this.extras().photos.reduce((sum, p) => sum + p.length, 0) + (this.details().photoUrl?.length ?? 0);
        if (total + data.length > MAX_PAYLOAD_CHARS) {
          this.photoError.set('That is the limit for one website – remove a photo to add another.');
          break;
        }
        this.patch({ photos: [...this.extras().photos, data] });
      }
    } catch {
      this.photoError.set('One photo could not be read – please try another file.');
    } finally {
      this.busy.set(false);
    }
  }

  protected removePhoto(index: number): void {
    this.patch({ photos: this.extras().photos.filter((_, i) => i !== index) });
  }

  protected movePhoto(index: number, by: -1 | 1): void {
    const photos = [...this.extras().photos];
    const to = index + by;
    if (to < 0 || to >= photos.length) return;
    [photos[index], photos[to]] = [photos[to], photos[index]];
    this.patch({ photos });
  }

  // ----- Story ------------------------------------------------------------------------
  protected startStory(): void {
    const story = this.defaults()?.vm.story ?? [];
    this.patch({ story: story.map((m) => ({ ...m })) });
  }

  protected addMoment(): void {
    this.patch({ story: [...this.extras().story, { year: '', title: '', text: '' }] });
  }

  protected setMoment(index: number, key: keyof CustomStoryMoment, event: Event): void {
    this.patch({ story: this.extras().story.map((m, i) => (i === index ? { ...m, [key]: this.value(event) } : m)) });
  }

  protected removeMoment(index: number): void {
    this.patch({ story: this.extras().story.filter((_, i) => i !== index) });
  }

  // ----- Events -----------------------------------------------------------------------
  protected startEvents(): void {
    const design = this.design();
    if (!design) return;
    const [y, m, d] = this.details().date.split('-').map(Number);
    const events = design.events.map((e) => {
      const day = new Date(y || 2000, (m || 1) - 1, (d || 1) + e.dayOffset);
      const iso = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, '0')}-${String(day.getDate()).padStart(2, '0')}`;
      return { name: e.name, date: iso, time: e.time || this.details().time, place: '' };
    });
    this.patch({ events });
  }

  protected addEvent(): void {
    this.patch({ events: [...this.extras().events, { name: '', date: this.details().date, time: this.details().time, place: '' }] });
  }

  protected setEvent(index: number, key: keyof CustomEvent, event: Event): void {
    this.patch({ events: this.extras().events.map((e, i) => (i === index ? { ...e, [key]: this.value(event) } : e)) });
  }

  protected removeEvent(index: number): void {
    this.patch({ events: this.extras().events.filter((_, i) => i !== index) });
  }

  // ----- Sections ---------------------------------------------------------------------
  protected isShown(key: WebsiteSectionKey): boolean {
    return !this.extras().hidden.includes(key);
  }

  protected toggleSection(key: WebsiteSectionKey, event: Event): void {
    const shown = (event.target as HTMLInputElement).checked;
    const hidden = this.extras().hidden.filter((k) => k !== key);
    this.patch({ hidden: shown ? hidden : [...hidden, key] });
  }

  protected reset(): void {
    this.extras.set({ ...EMPTY_EXTRAS });
    this.photoError.set('');
  }
}
