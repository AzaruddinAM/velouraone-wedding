import { Component, input } from '@angular/core';

export type IconName =
  | 'whatsapp'
  | 'heart'
  | 'heart-filled'
  | 'eye'
  | 'close'
  | 'arrow-left'
  | 'arrow-right'
  | 'search'
  | 'upload'
  | 'download'
  | 'share'
  | 'calendar'
  | 'map'
  | 'menu'
  | 'sparkle'
  | 'check'
  | 'expand'
  | 'rocket'
  | 'bolt'
  | 'mobile'
  | 'headset';

/** Lightweight inline SVG icons (no icon font needed). */
@Component({
  selector: 'app-icon',
  template: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      @switch (name()) {
        @case ('whatsapp') {
          <path class="solid" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.4a.5.5 0 0 0 0-.5l-.8-1.9c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.2 2.2 2.2 0 0 0 .1-1.3c0-.1-.2-.2-.5-.3Z" />
        }
        @case ('heart') { <path d="M12 20s-7-4.4-9.2-9A5 5 0 0 1 12 6a5 5 0 0 1 9.2 5c-2.2 4.6-9.2 9-9.2 9Z" /> }
        @case ('heart-filled') { <path class="solid" d="M12 20s-7-4.4-9.2-9A5 5 0 0 1 12 6a5 5 0 0 1 9.2 5c-2.2 4.6-9.2 9-9.2 9Z" /> }
        @case ('eye') { <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" /><circle cx="12" cy="12" r="3" /> }
        @case ('close') { <path d="M6 6l12 12M18 6 6 18" /> }
        @case ('arrow-left') { <path d="M15 5l-7 7 7 7" /> }
        @case ('arrow-right') { <path d="M9 5l7 7-7 7" /> }
        @case ('search') { <circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /> }
        @case ('upload') { <path d="M12 16V4m-5 5 5-5 5 5M4 20h16" /> }
        @case ('download') { <path d="M12 4v12m-5-5 5 5 5-5M4 20h16" /> }
        @case ('share') { <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4" /> }
        @case ('calendar') { <rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /> }
        @case ('map') { <path d="M12 22s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12Z" /><circle cx="12" cy="10" r="2.5" /> }
        @case ('menu') { <path d="M4 7h16M4 12h16M4 17h16" /> }
        @case ('sparkle') { <path class="solid" d="M12 2l2 7.5L21.5 12 14 14.5 12 22l-2-7.5L2.5 12 10 9.5Z" /> }
        @case ('check') { <path d="m5 12 5 5 9-10" /> }
        @case ('expand') { <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" /> }
        @case ('rocket') { <path d="M14 4c3-1 5-1 6 0 1 1 1 3 0 6l-6 6-4-4 4-8Z" /><circle cx="15.5" cy="8.5" r="1.5" /><path d="M10 12l-4 1-2 3 4 1M12 14l-1 4-3 2-1-4M6 18l-2 2" /> }
        @case ('bolt') { <path class="solid" d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" /> }
        @case ('mobile') { <rect x="7" y="2" width="10" height="20" rx="2" /><path d="M11 18h2" /> }
        @case ('headset') { <path d="M4 14v-2a8 8 0 0 1 16 0v2" /><rect x="3" y="13" width="4" height="6" rx="1.5" /><rect x="17" y="13" width="4" height="6" rx="1.5" /><path d="M19 19a3 3 0 0 1-3 3h-3" /> }
      }
    </svg>
  `,
  styles: `
    :host { display: inline-flex; width: 1.15em; height: 1.15em; flex-shrink: 0; }
    svg { width: 100%; height: 100%; fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
    .solid { fill: currentColor; stroke: none; }
  `,
})
export class Icon {
  readonly name = input.required<IconName>();
}
