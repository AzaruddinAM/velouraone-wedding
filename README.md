# VelouraOne – Wedding Invitation Cards & Websites

An Angular 22 site that sells two products, which share the same features:

| Product | Designs | Pages |
| --- | --- | --- |
| **Invitation Cards**: a single e-invite image | 54 · `V1 Wedding` … `V54 Wedding` | `/templates`, `/templates/:slug`, demo `/demo/:slug` |
| **Invitation Websites**: a full scrolling wedding website | 105 · `W1 Wedding Website` … `W105 Wedding Website` | `/websites`, `/websites/:slug`, demo `/site/:slug` |

Every invitation website has these sections: hero, invitation, bride & groom, love story, events schedule, photo gallery, venue with map link, countdown with RSVP, and footer with hashtag.
There are 14 hero styles and 4 section looks (classic, cards, editorial, bold). Each website has its own colours, fonts and ornaments, and it adapts to phone and desktop.

### Nikah collection (animated)

36 Nikah designs, all with Arabic calligraphy (Amiri font) and entrance and looping animations:

- **Cards V37–V54** (`src/app/data/nikah-cards.data.ts`): lantern arch, girih medallion, mosque skyline, mashrabiya doors, and two **scratch-to-reveal** layouts (three gold coins, or a ticket with a foil strip).
- **Websites W35–W52** (`src/app/data/nikah-websites.data.ts`): lantern, mosque moonrise, opening doors, girih geometry, **scratch-to-reveal** coins, and falling petals. Their sections fade in as guests scroll.
- Scratching uses `src/app/shared/scratch-reveal`: a canvas foil that works with a finger or mouse and bursts into confetti once about half is scratched off.
- The galleries have quick filters, **✨ Animated** and **🪙 Scratch & reveal**, also available as links such as `/websites?feature=scratch`.

### Venue series (cinematic 3D walk-through to a named invitation)

13 websites (**W93–W105**, in `src/app/data/venue-3d-websites.data.ts`). Each one walks the guest through a dressed 3D venue and ends at an invitation panel **inside the scene** that shows the couple's own names, date, time and venue (drawn live from the personalise form). Scenes open, part or move as the guest scrolls:

| Design | Scene | What moves |
| --- | --- | --- |
| W93 Moonlit Palace Stairs | Candle-lit stairs to a domed pavilion | Velvet curtains part |
| W94 Through the Portal | Flower-lit tunnel into a mountain valley | Fly-through |
| W95 Lilac Garden Door | Flower arch, wooden doors, garden path | Doors swing open |
| W96 Rose Cathedral Corridor | Burgundy pointed arches, candles, roses | Candle flicker |
| W97 Pearl & Satin | Rippling satin, pearl strands, gold rings | Satin waves |
| W98 Storybook Waterfall | Waterfall, river, wooden bridge, clouds | Water flows |
| W99 Champagne Mirror Aisle | Mirror floor, drapes, black signboards | Real reflections |
| W100 Floral Grotto Lake | White flower arches over still water | Real reflections |
| W101 Spotlight Easel Gallery | Carved gateway, spot-lit easels | Spotlights |
| W102 Olive Velvet Arches | Curtained arches, floating monogram | Monogram floats |
| W103 Moonlight Arcade Nikah | Globe lamps, polished arcade | The couple walk ahead |
| W104 Velvet Theatre Envelope | Red stage, black-and-gold envelope | Curtains part, envelope opens, card rises |
| W105 Ivory Ballroom Gate | Floral aisle, chandeliers, ribboned gate | Couple walk, gate opens |

Code: scenes in `src/app/website/three/scenes/venues-a.ts` and `venues-b.ts`, shared pieces (drapes, arches, mirror floors, couple figures, named panels) in `venue-kit.ts`.

Galleries now sort **3D & most attractive first** by default (venue series → 3D journeys → other 3D → invite series → animated → the rest).

### Invite series (opening screen + music)

10 mobile-first invitation websites (**W83–W92**, in `src/app/data/invite-websites.data.ts`). Each design uses a different pair of opening screen and backdrop, so no two look alike:

| Design | Opening | Backdrop | Card style |
| --- | --- | --- | --- |
| W83 Ivory Envelope | Wax-sealed envelope | Palace steps | Framed |
| W84 Emerald Verse | Verse welcome screen | Emerald dome | Glass |
| W85 Blush Garden Doors | Carved doors | Garden arch | Framed |
| W86 Midnight Curtain | Velvet curtains | Lantern night | Glass |
| W87 Photo Story Nikah | Verse welcome screen | Couple photo | Editorial |
| W88 Jaali Scroll | Parchment scroll | Jaali lattice | Framed |
| W89 Jasmine Envelope | Wax-sealed envelope | Garden arch | Editorial |
| W90 Royal Maroon Doors | Carved doors | Emerald dome | Glass |
| W91 Lilac Lantern Scroll | Parchment scroll | Lantern night | Glass |
| W92 Golden Curtain Photo | Velvet curtains | Couple photo | Framed |

Every Invite design includes original background music (generated in the browser, no audio files: `website/invite/ambient-music.ts`), parents' names, a scratch-to-reveal photo, an event card with **Directions** and **Add to calendar**, a countdown, the couple's journey, a gallery, families, an embedded Google Map, **RSVP on WhatsApp** (to the couple's own number, if they give one), a duas & wishes wall, a sticky menu and back-to-top.

Code: `src/app/website/invite/` (opening screens in `gate/`, backdrops in `backdrop/`, the page in `invite-site/`).

### 3D Journey collection (scroll to walk through)

20 websites (**W63–W82**, in `src/app/data/journey-3d-websites.data.ts`) open with a full-screen 3D scene that stays pinned while the guest scrolls. The camera walks through the scene in four chapters (welcome, invitation, date, venue), and guests can **drag to look around**.

- **Realistic environments** (`src/app/website/three/scenes/`): wedding garden aisle, Mughal palace courtyard, beach mandap at sunset, reception hall with chandeliers, and a wedding cake close-up. The mosque, lanterns, rings, girih and crescent scenes also have walk-through routes.
- Soft shadows, a glow on lamps and candles, sky backgrounds, and animated waves, drapes and fountains.
- The hero is in `src/app/website/heroes/journey3d`; each scene defines its camera route in its `journey` field.
- The gallery filter **🧊 3D** lists all 30 3D designs.

### Nikah 3D collection (real-time WebGL)

10 websites (**W53–W62**, in `src/app/data/nikah-3d-websites.data.ts`) open with a live 3D scene built in Three.js: a golden-domed **mosque**, floating brass **lanterns**, interlocked yellow- and rose-gold **rings** with a diamond, Islamic **girih stars**, and a **crescent** moon with orbiting lanterns. The scene follows the mouse or the tilt of a phone.

- Scenes are in `src/app/website/three/scenes/` (engine: `three-runtime.ts`, shared helpers: `scene-kit.ts`), and the hero is in `src/app/website/heroes/scene3d`.
- Three.js loads **only when a 3D design is on screen** (a separate ~125 KB compressed file), so the rest of the site stays fast.
- Gallery thumbnails are still images drawn by one shared renderer, so the gallery never opens dozens of 3D views at once.
- Devices without 3D support (WebGL) see a soft gradient instead.
- Gallery filter: **🧊 3D** (`/websites?feature=3d`).

Visitors can:

- browse, search and filter by style (Royal, Kerala, Traditional, Christian, Nikah, Floral, Modern, Minimal, Destination, Vintage)
- type their names, date and venue and upload a couple photo, then see it live on **every** card and website
- preview websites on a phone or desktop frame, or open the full website demo
- shortlist favourites with the ♡ button
- **order on WhatsApp** (the number is used only inside WhatsApp links and is never shown on the site). The message includes the product, design name, code, preview link and couple details. The photo is sent as a second step (share sheet on phones, or download and attach on desktop).

## Run locally

```bash
npm install
npm start          # http://localhost:4200
```

## Build & host (invitations.velouraone.in)

```bash
npm run build
```

Upload **everything inside `dist/velouraone-wedding/browser/`** to the web root of `invitations.velouraone.in`.
The included `.htaccess` (Apache/cPanel) sends every route to `index.html`, so links like
`/websites/w7-the-wedding-issue` work after a refresh. On Nginx, use `try_files $uri $uri/ /index.html;`.

## Automatic deploy (GitHub Actions → Hostinger)

Every push to `main` builds the site and uploads it to **https://invitations.velouraone.in** over FTP (`.github/workflows/deploy.yml`). You can also run it by hand: **Actions → Deploy to invitations.velouraone.in → Run workflow**.

Add these once in GitHub under **Settings → Secrets and variables → Actions → New repository secret**:

| Secret | Where to find it (hPanel → Files → FTP Accounts) |
| --- | --- |
| `FTP_SERVER` | FTP host or IP |
| `FTP_USERNAME` | FTP username |
| `FTP_PASSWORD` | FTP password |
| `FTP_SERVER_DIR` | Folder of the subdomain, ending in `/`. Use `/` if the FTP account opens straight into it, otherwise e.g. `/domains/velouraone.in/public_html/invitations/` |

Uploads use encrypted FTPS. If Hostinger refuses FTPS, add a repository **variable** `FTP_PROTOCOL` = `ftp`. Only changed files are uploaded after the first deploy.

## Where to change things

| What | File |
| --- | --- |
| Brand name, logo, slogans, WhatsApp number, site URL | `src/app/core/constants/brand.constants.ts` |
| Logo image (transparent PNG) | `public/brand/velouraone-logo.png` |
| Site colours, fonts | Brand name, WhatsApp number, site URL | `src/app/core/constants/brand.constants.ts` | buttons (VelouraOne theme) | `src/styles.scss` |
| Product names, URLs, code prefixes (V / W) | `src/app/core/constants/products.constants.ts` |
| Card designs | `src/app/data/wedding-templates.data.ts` |
| Website designs (and their event schedules) | `src/app/data/wedding-websites.data.ts` |
| Shared fonts, ceremony wording, categories | `src/app/data/design-tokens.ts` |
| Card layouts (14 structures) | `src/app/invitation/layouts/*` |
| Website heroes (14) and sections (8) | `src/app/website/heroes/*`, `src/app/website/sections/*` |
| SVG ornaments (mandala, lotus, peacock…) | `src/app/invitation/motif/` |
| WhatsApp message text | `src/app/core/services/whatsapp-order.service.ts` |

### Adding a new website design (W35)

Add one entry to `WEDDING_WEBSITES` in `wedding-websites.data.ts`:

```ts
defineWebsite(35, 'Coral Reef', {
  description: 'Short description shown on the page.',
  category: 'destination', hero: 'fullbleed', sectionStyle: 'cards', motif: 'wave', isNew: true,
  theme: { bg: '#fff4ee', surface: '#ffe6dc', ink: '#3a2a26', primary: '#d9534f', accent: '#ffb199',
           soft: '#8a6d66', fontScript: FONT.sacramento, fontHeading: FONT.josefin, fontBody: FONT.josefin, pattern: 'none' },
  wording: WORDING.general, events: EVENTS.general, tags: ['coral', 'beach'],
}),
```

New cards work the same way with `defineTemplate(37, …)` in `wedding-templates.data.ts`.
Names (`W35 Wedding Website`), codes, URL slugs and gallery tiles are generated automatically.

## Project structure

```
src/app/
  core/          constants, models, services (catalog, draft, shortlist, WhatsApp), utils
  data/          card + website definitions, shared fonts / wording / categories
  invitation/    card renderer, 14 card layouts, SVG motif library
  website/       website renderer, 14 heroes, 8 sections, view model
  shared/        icon, design preview, scaled device frame, tile, personalise form, order dialog, countdown
  shell/         site header & footer
  pages/         home, gallery, detail, card demo, website demo (lazy loaded)
```

Built with standalone components, signals (`signal`, `computed`, `linkedSignal`, `effect`, `afterRenderEffect`),
signal inputs, container queries, the new control flow (`@if`, `@for`, `@switch`, `@defer`, `@let`) and zoneless change detection.
