import { InvitationDetails, InvitationViewModel } from '../core/models/invitation-details.model';
import { DesignBase } from '../core/models/wedding-template.model';

const FALLBACK_BRIDE = 'Bride';
const FALLBACK_GROOM = 'Groom';

/** Parses `yyyy-mm-dd` as a local date (avoids timezone shifts). */
export function parseLocalDate(isoDate: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate);
  if (!match) return null;
  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  return Number.isNaN(date.getTime()) ? null : date;
}

/** `14:30` → `2:30 PM`. */
export function formatTime(time: string): string {
  const match = /^(\d{1,2}):(\d{2})$/.exec(time);
  if (!match) return time;
  const hours = Number(match[1]);
  const suffix = hours >= 12 ? 'PM' : 'AM';
  return `${hours % 12 || 12}:${match[2]} ${suffix}`;
}

/** Turns raw form data into display-ready strings shared by every layout. */
export function buildInvitationViewModel(
  details: InvitationDetails,
  template: Pick<DesignBase, 'wording'>,
): InvitationViewModel {
  const bride = details.bride.trim() || FALLBACK_BRIDE;
  const groom = details.groom.trim() || FALLBACK_GROOM;
  const date = parseLocalDate(details.date) ?? new Date();
  const locale = 'en-IN';

  return {
    bride,
    groom,
    brideInitial: bride.charAt(0).toUpperCase(),
    groomInitial: groom.charAt(0).toUpperCase(),
    opening: template.wording.opening,
    invitation: template.wording.invitation,
    familyLine: details.familyLine.trim(),
    weekday: date.toLocaleDateString(locale, { weekday: 'long' }),
    day: String(date.getDate()).padStart(2, '0'),
    month: date.toLocaleDateString(locale, { month: 'long' }),
    monthShort: date.toLocaleDateString(locale, { month: 'short' }),
    monthNumber: String(date.getMonth() + 1).padStart(2, '0'),
    year: String(date.getFullYear()),
    yearShort: String(date.getFullYear()).slice(-2),
    dateLong: date.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' }),
    time: formatTime(details.time),
    venue: details.venue.trim() || 'Venue',
    address: details.address.trim(),
    photoUrl: details.photoUrl,
  };
}
