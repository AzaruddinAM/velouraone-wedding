import { InvitationDetails, InvitationViewModel } from '../core/models/invitation-details.model';
import { WebsiteTemplate } from '../core/models/wedding-template.model';
import { buildInvitationViewModel, formatTime, parseLocalDate } from '../invitation/invitation-view-model';

export interface WebsiteEventView {
  readonly name: string;
  readonly date: string;
  readonly time: string;
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
}

export function buildWebsiteViewModel(details: InvitationDetails, template: WebsiteTemplate): WebsiteViewModel {
  const base = buildInvitationViewModel(details, template);
  const weddingDay = parseLocalDate(details.date) ?? new Date();
  const year = weddingDay.getFullYear();

  const events = template.events.map((event) => {
    const day = new Date(weddingDay);
    day.setDate(day.getDate() + event.dayOffset);
    return {
      name: event.name,
      date: day.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }),
      time: formatTime(event.time || details.time),
    };
  });

  const clean = (name: string) => name.replace(/[^\p{L}\p{N}]/gu, '');

  return {
    ...base,
    hashtag: `#${clean(base.bride)}Weds${clean(base.groom)}`,
    isoDate: details.date,
    rawTime: details.time,
    events,
    // Sample story – the couple sends their own text when they order.
    story: [
      { year: String(year - 3), title: 'The first hello', text: `It started with one conversation – and ${base.groom} and ${base.bride} haven't stopped talking since.` },
      { year: String(year - 1), title: 'The big question', text: `With family cheering, ${base.bride} said a happy, tearful “yes”.` },
      { year: String(year), title: 'Forever begins', text: `On ${base.dateLong} we begin our forever – and it won't be complete without you.` },
    ],
    mapUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${base.venue}, ${base.address}`)}`,
  };
}
