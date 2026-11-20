/**
 * Brand & business settings.
 * Change values here only – every page, link and WhatsApp message reads from this file.
 */
export const BRAND = {
  /** Shown in page titles and WhatsApp messages (the header/footer use the logo image). */
  name: 'VelouraOne',
  /** Logo with transparent background (public/brand). */
  logo: 'brand/velouraone-logo.png',
  /** Small line next to the logo. */
  tagline: 'Wedding Invitations',
  /** Brand slogans from the VelouraOne poster. */
  slogan: 'Design • Develop • Inspire',
  motto: 'Your Vision • Our Creativity',
  closingLine: "Let's Create Something Amazing Together!",
  /** Public address where the site is hosted (used to build preview links). */
  siteUrl: 'https://invitations.velouraone.in',
  /**
   * WhatsApp number in international format, digits only (91 = India).
   * Used only inside WhatsApp links – it is never printed on the site.
   */
  whatsappNumber: '917356035113',
} as const;

/** Host name without protocol, e.g. `invitations.velouraone.in`. */
export const SITE_HOST = BRAND.siteUrl.replace(/^https?:\/\//, '');
