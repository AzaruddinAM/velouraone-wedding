import { Injectable, signal } from '@angular/core';
import { InvitationDetails } from '../models/invitation-details.model';

export interface GeneratedSiteSummary {
  readonly slug: string;
  readonly design: string;
  readonly bride: string;
  readonly groom: string;
  readonly date: string;
  readonly created: string;
}

export interface GeneratedSite {
  readonly design: string;
  readonly details: InvitationDetails;
}

/** Thrown with the server's message (e.g. "Wrong username or password."). */
export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
  }
}

/**
 * Talks to the PHP admin API on the same host (/api/…).
 * The session lives in an HttpOnly cookie the page can't read; every change sends the CSRF token.
 */
@Injectable({ providedIn: 'root' })
export class AdminApiService {
  readonly signedIn = signal(false);
  private csrf: string | null = null;

  private url(path: string): string {
    return new URL(`api/${path}`, document.baseURI).href;
  }

  private async call<T>(path: string, init: RequestInit = {}, changing = false): Promise<T> {
    const headers = new Headers(init.headers);
    if (init.body) headers.set('Content-Type', 'application/json');
    if (changing && this.csrf) headers.set('X-CSRF-Token', this.csrf);
    let response: Response;
    try {
      response = await fetch(this.url(path), { ...init, headers, credentials: 'same-origin', cache: 'no-store' });
    } catch {
      throw new ApiError('Cannot reach the server. Check your connection.', 0);
    }
    const data = (await response.json().catch(() => ({}))) as { ok?: boolean; error?: string } & T;
    if (!response.ok || data.ok === false) {
      if (response.status === 401) this.signedIn.set(false);
      throw new ApiError(data.error ?? 'Something went wrong.', response.status);
    }
    return data;
  }

  /** Restores the session after a page reload. */
  async check(): Promise<boolean> {
    const data = await this.call<{ authenticated: boolean; csrf: string | null }>('auth.php');
    this.csrf = data.csrf;
    this.signedIn.set(data.authenticated);
    return data.authenticated;
  }

  async login(username: string, password: string): Promise<void> {
    const data = await this.call<{ csrf: string }>('auth.php', { method: 'POST', body: JSON.stringify({ action: 'login', username, password }) });
    this.csrf = data.csrf;
    this.signedIn.set(true);
  }

  async logout(): Promise<void> {
    try {
      await this.call('auth.php', { method: 'POST', body: JSON.stringify({ action: 'logout' }) }, true);
    } finally {
      this.csrf = null;
      this.signedIn.set(false);
    }
  }

  async list(): Promise<GeneratedSiteSummary[]> {
    return (await this.call<{ sites: GeneratedSiteSummary[] }>('sites.php')).sites;
  }

  /** Creates the couple's website; returns its address path (/i/…). */
  async generate(design: string, details: InvitationDetails): Promise<{ slug: string; path: string }> {
    const { photoUrl, photos: gallery = [], ...fields } = details;
    const photo = photoUrl?.startsWith('data:image/') ? photoUrl : null;
    const photos = gallery.filter((p) => p.startsWith('data:image/'));
    return this.call('sites.php', { method: 'POST', body: JSON.stringify({ design, details: fields, photo, photos }) }, true);
  }

  async remove(slug: string): Promise<void> {
    await this.call(`sites.php?slug=${encodeURIComponent(slug)}`, { method: 'DELETE' }, true);
  }

  /** Public: one generated website (no sign-in needed). */
  async site(slug: string): Promise<GeneratedSite> {
    return this.call<GeneratedSite>(`site.php?slug=${encodeURIComponent(slug)}`);
  }
}
