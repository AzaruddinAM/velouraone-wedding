/** Everything the customer can personalise on an invitation. */
export interface InvitationDetails {
  bride: string;
  groom: string;
  /** ISO date `yyyy-mm-dd`. */
  date: string;
  /** 24h time `hh:mm`. */
  time: string;
  venue: string;
  address: string;
  familyLine: string;
  /** e.g. "Mr. Abdul Rahman & Mrs. Fathima" (shown as "Son of …"). */
  groomParents: string;
  /** e.g. "Mr. Ibrahim Kutty & Mrs. Safiya" (shown as "Daughter of …"). */
  brideParents: string;
  /** Couple's WhatsApp number for guest RSVPs (digits, with country code). Optional. */
  rsvpPhone: string;
  /** Resized couple photo as a data URL, or null. */
  photoUrl: string | null;

  // ----- Extras the admin can customise (all optional; empty = the design's default) -----
  /** Gallery photos (data URLs while editing, server paths on a generated site). */
  photos?: readonly string[];
  /** e.g. "#AnanyaWedsArjun". */
  hashtag?: string;
  /** Replaces the design's opening line (e.g. "Bismillah…" / "Save the date"). */
  opening?: string;
  /** Replaces the design's invitation sentence. */
  invitation?: string;
  /** Welcome message on the website. */
  welcome?: string;
  /** Own love story; empty = the sample story. */
  story?: readonly CustomStoryMoment[];
  /** Own list of functions; empty = the design's events. */
  events?: readonly CustomEvent[];
  /** Sections to leave out of the website. */
  hidden?: readonly WebsiteSectionKey[];
}

export interface CustomStoryMoment {
  year: string;
  title: string;
  text: string;
}

export interface CustomEvent {
  name: string;
  /** `yyyy-mm-dd`; empty = the wedding day. */
  date: string;
  /** `hh:mm`; empty = the wedding time. */
  time: string;
  /** Optional different place for this function. */
  place: string;
}

/** Sections the admin can switch off. */
export type WebsiteSectionKey = 'story' | 'events' | 'gallery' | 'family' | 'venue' | 'rsvp' | 'wishes' | 'countdown';

export const WEBSITE_SECTION_OPTIONS: readonly { key: WebsiteSectionKey; label: string }[] = [
  { key: 'story', label: 'Love story' },
  { key: 'events', label: 'Events' },
  { key: 'gallery', label: 'Photo gallery' },
  { key: 'family', label: 'Couple & families' },
  { key: 'venue', label: 'Venue & map' },
  { key: 'rsvp', label: 'RSVP' },
  { key: 'countdown', label: 'Countdown' },
  { key: 'wishes', label: 'Wishes wall' },
];

export const SAMPLE_DETAILS: Readonly<InvitationDetails> = {
  bride: 'Ananya',
  groom: 'Arjun',
  date: '2027-02-14',
  time: '10:30',
  venue: 'The Grand Palace Convention Centre',
  address: 'MG Road, Kochi, Kerala',
  familyLine: 'Together with their families',
  groomParents: 'Mr. Rajesh Menon & Mrs. Lakshmi Menon',
  brideParents: 'Mr. Suresh Nair & Mrs. Deepa Nair',
  rsvpPhone: '',
  photoUrl: null,
};

/** Ready-to-render values derived from details + template wording. */
export interface InvitationViewModel {
  readonly bride: string;
  readonly groom: string;
  readonly brideInitial: string;
  readonly groomInitial: string;
  readonly opening: string;
  readonly invitation: string;
  readonly familyLine: string;
  readonly weekday: string;
  readonly day: string;
  readonly month: string;
  readonly monthShort: string;
  readonly monthNumber: string;
  readonly year: string;
  readonly yearShort: string;
  readonly dateLong: string;
  readonly time: string;
  readonly venue: string;
  readonly address: string;
  readonly photoUrl: string | null;
}
