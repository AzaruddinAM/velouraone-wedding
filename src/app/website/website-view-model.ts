import { InvitationDetails, InvitationViewModel, WebsiteSectionKey } from '../core/models/invitation-details.model';
import { WebsiteTemplate } from '../core/models/wedding-template.model';
import { buildInvitationViewModel, formatTime, parseLocalDate } from '../invitation/invitation-view-model';

export interface WebsiteEventView {
  readonly name: string;
  readonly date: string;
  readonly time: string;
  /** Set when this function is somewhere other than the main venue. */
  readonly place?: string;
}

export interface StoryMoment {
  readonly year: string;
  readonly title: string;
  readonly text: string;
}

/** Everything a website section needs, already formatted. */
export interface WebsiteViewModel extends InvitationViewModel {
  readonly hashtag: string;
  readonly isoDate: string;
  readonly rawTime: string;
  readonly events: readonly WebsiteEventView[];
  readonly story: readonly StoryMoment[];
  readonly mapUrl: string;
  /** Google Maps embed for an <iframe> (no API key needed). */
  readonly mapEmbedUrl: string;
  /** Google Calendar "add event" link. */
  readonly calendarUrl: string;
  readonly groomParents: string;
  readonly brideParents: string;
  /** wa.me link for RSVPs, or empty when the couple has not given a number. */
  readonly rsvpUrl: string;
  /** All couple photos for galleries (may be empty). */
  readonly photos: readonly string[];
  /** Admin's own welcome message, or empty for the design's default. */
  readonly welcome: string;
  /** True when the admin wrote their own list of events. */
  readonly customEvents: boolean;
  /** Sections switched off by the admin. */
  readonly hidden: readonly WebsiteSectionKey[];
}

/** `yyyymmddThhmmss` in local time for Google Calendar. */
function calendarStamp(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}T${pad(date.getHours())}${pad(date.getMinutes())}00`;
}

export function buildWebsiteViewModel(details: InvitationDetails, template: WebsiteTemplate): WebsiteViewModel {
  const base = buildInvitationViewModel(details, template);
  const weddingDay = parseLocalDate(details.date) ?? new Date();
  const year = weddingDay.getFullYear();

  const formatDay = (day: Date) => day.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
  const ownEvents = (details.events ?? []).filter((e) => e.name.trim());
  const events: WebsiteEventView[] = ownEvents.length
    ? ownEvents.map((e) => ({
        name: e.name.trim(),
        date: formatDay(parseLocalDate(e.date) ?? weddingDay),
        time: formatTime(e.time || details.time),
        place: e.place?.trim() || undefined,
      }))
    : template.events.map((event) => {
    const day = new Date(weddingDay);
    day.setDate(day.getDate() + event.dayOffset);
    return {
      name: event.name,
      date: formatDay(day),
      time: formatTime(event.time || details.time),
    };
  });

  const start = new Date(weddingDay);
  const [hours, minutes] = details.time.split(':').map(Number);
  start.setHours(hours || 0, minutes || 0);
  const end = new Date(start.getTime() + 3 * 60 * 60 * 1000);
  const place = `${base.venue}, ${base.address}`;
  const calendar = new URLSearchParams({
    action: 'TEMPLATE',
    text: `Wedding of ${base.bride} & ${base.groom}`,
    dates: `${calendarStamp(start)}/${calendarStamp(end)}`,
    location: place,
  });
  const rsvpDigits = (details.rsvpPhone ?? '').replace(/D/g, '');
  const ownStory = (details.story ?? []).filter((m) => m.title.trim() || m.text.trim());
  const photos = [...new Set([details.photoUrl, ...(details.photos ?? [])].filter((p): p is string => !!p))];

  const clean = (name: string) => name.replace(/[^\p{L}\p{N}]/gu, '');

  return {
    ...base,
    hashtag: details.hashtag?.trim() || `#${clean(base.bride)}Weds${clean(base.groom)}`,
    isoDate: details.date,
    rawTime: details.time,
    events,
    // Sample story – the couple sends their own text when they order.
    story: ownStory.length ? ownStory.map((m) => ({ year: m.year.trim(), title: m.title.trim(), text: m.text.trim() })) : [
      { year: String(year - 3), title: 'The first hello', text: `It started with one conversation – and ${base.groom} and ${base.bride} haven't stopped talking since.` },
      { year: String(year - 1), title: 'The big question', text: `With family cheering, ${base.bride} said a happy, tearful “yes”.` },
      { year: String(year), title: 'Forever begins', text: `On ${base.dateLong} we begin our forever – and it won't be complete without you.` },
    ],
    mapUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place)}`,
    mapEmbedUrl: `https://maps.google.com/maps?q=${encodeURIComponent(place)}&z=15&output=embed`,
    calendarUrl: `https://calendar.google.com/calendar/render?${calendar}`,
    groomParents: (details.groomParents ?? '').trim(),
    brideParents: (details.brideParents ?? '').trim(),
    photos,
    welcome: details.welcome?.trim() ?? '',
    customEvents: ownEvents.length > 0,
    hidden: details.hidden ?? [],
    rsvpUrl: rsvpDigits.length >= 8 ? `https://wa.me/${rsvpDigits}?text=${encodeURIComponent(`Assalamu alaikum! RSVP for the wedding of ${base.bride} & ${base.groom}: `)}` : '',
  };
}
