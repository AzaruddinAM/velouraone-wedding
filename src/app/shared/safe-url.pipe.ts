import { Pipe, PipeTransform, inject } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

const ALLOWED = ['https://maps.google.com/', 'https://www.google.com/maps/'];

/**
 * Marks a Google Maps embed URL as safe for an <iframe>.
 * Anything that is not a Google Maps address is rejected (returns null).
 */
@Pipe({ name: 'safeUrl' })
export class SafeUrlPipe implements PipeTransform {
  private readonly sanitizer = inject(DomSanitizer);

  transform(url: string): SafeResourceUrl | null {
    return ALLOWED.some((prefix) => url.startsWith(prefix)) ? this.sanitizer.bypassSecurityTrustResourceUrl(url) : null;
  }
}
