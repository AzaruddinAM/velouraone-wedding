import { Injectable, computed, effect, signal } from '@angular/core';
import { browserStorage } from './browser-storage';

const STORAGE_KEY = 'vo-shortlist';

/** Templates the visitor has hearted, so they can compare and pick one. */
@Injectable({ providedIn: 'root' })
export class ShortlistService {
  private readonly ids = signal<ReadonlySet<string>>(new Set(browserStorage.read<string[]>(STORAGE_KEY, [])));

  readonly selected = this.ids.asReadonly();
  readonly count = computed(() => this.ids().size);

  constructor() {
    effect(() => browserStorage.write(STORAGE_KEY, [...this.ids()]));
  }

  has(id: string): boolean {
    return this.ids().has(id);
  }

  toggle(id: string): void {
    this.ids.update((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }
}
