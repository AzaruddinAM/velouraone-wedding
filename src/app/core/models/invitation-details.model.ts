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
  /** Resized couple photo as a data URL, or null. */
  photoUrl: string | null;
}

export const SAMPLE_DETAILS: Readonly<InvitationDetails> = {
  bride: 'Ananya',
  groom: 'Arjun',
  date: '2027-02-14',
  time: '10:30',
  venue: 'The Grand Palace Convention Centre',
  address: 'MG Road, Kochi, Kerala',
  familyLine: 'Together with their families',
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
