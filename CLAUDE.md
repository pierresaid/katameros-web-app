# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Katameros Web App is a Vue 3 SPA that displays daily religious readings from the Coptic Orthodox Church lectionary. It supports 8 languages (French, English, Arabic, Italian, German, Polish, Spanish, Dutch), multiple Bible versions, and both Gregorian and Coptic calendars. Deployed as a PWA with mobile support via Capacitor.

Website: https://katameros.app/

## Build and Development Commands

```bash
npm install           # Install dependencies
npm run dev          # Start Vite dev server with hot reload
npm run build        # Type-check + production build (the website, with every story page)
npm run build-app    # Type-check + build for the phone app, without the story pages
npm run preview      # Preview production build
npm run type-check   # Run vue-tsc type checking only
```

The website build prerenders every page with vite-ssg, including one page per synaxarium story and language (about 4,500, some 4 minutes). Their text comes from the published synaxarium file (`src/services/synaxPrerender.ts`, fetched once through the cache worker): without it the build stops. Appflow runs `appflow:build` (`build-app`, `--mode app`), which leaves the story pages out: the app opens on its home page and never loads them. Every page renders a new app against one fake window (`mock: true`), so `main.ts` turns its `addEventListener` into a no-op during the build: listeners kept every rendered app in memory.

### Prerendered pages are adopted, not drawn again (hydration)

When the browser starts on the page that was built, the app adopts that page as it is instead of emptying it and drawing it again: what the visitor sees stays in place, and the main paint is the first one (Lighthouse's LCP went from about 7 s to 1.4 s on a story page). `src/helpers/hydrating.ts` decides: the build stamps each page with its address (`data-page` on `#app`, `onPageRendered` in `vite.config.ts`), and the app hydrates (`hydration` option of ViteSSG in `main.ts`) only when the browser is on that address. Every other start draws from nothing, as before: the phone app, a "not found" page, an old `?story=` link, a story link the service worker answers offline with the synaxarium page.

While a page is adopted, the app's first draw must equal what the build drew: Vue then fixes a different text or structure, but keeps the build's classes, styles and attributes.
- **Saved settings** are read once the page is in place: every `useStorage` shown on a page passes `initOnMounted: hydrating`, and `App.vue` creates the menu and readings stores in its setup so that this happens when it mounts. Until then the theme's value is "light" (the build knows no system theme).
- **Vuetify** gets `ssr: true` in the browser too while hydrating: it starts from the build's screen size (none, so `xs`) and measures the real one after mounting.
- Anything that depends on the visitor (today's date, the device) is set in `onMounted`.
- **To check a change:** build with Vue's flag `__VUE_PROD_HYDRATION_MISMATCH_DETAILS__` set to `true` (a `define` in `vite.config.ts`, for the test only), serve `dist/` (`npx wrangler dev`) and open the pages: Vue then reports every mismatch in the console, classes and styles included.

## Tech Stack

Vue 3, TypeScript, Vite, Vuetify 3, Pinia, Vue Router, Vue i18n, Axios, Capacitor (mobile), LocalForage (offline caching), VitePWA

## Architecture

### Entry Point and Plugins

- **Entry:** `src/main.ts` bootstraps Vue with Pinia, Router, i18n, Vuetify
- **Path alias:** `@/` maps to `src/`
- **Plugins (`src/plugins/`):** Vuetify theme config, i18n setup, vee-validate

### State Management (Pinia Stores)

- **`src/store/readings.ts`:** Main store - manages date, language, Bible version, sections, caching via LocalForage. Fetches from `/readings/gregorian/{date}` API endpoint. Supports dual-language display (side-by-side or line-by-line).
- **`src/store/synaxarium.ts`:** Loads synaxarium entries from static JSON files in `assets/`, in calendar order, and knows which languages each story exists in
- **`src/store/feasts.ts`:** Fetches feast dates from `/feasts/{year}/{languageId}`, cached per year+language in a dedicated LocalForage instance. Consumed by the date-picker markers/Feasts tab and the feasts view via `src/composables/useFeastList.ts`
- **`src/store/menu.ts`:** UI state (drawer, zoom, spacing settings)
- **`src/store/notif.ts`:** Notification state
- **`src/store/slideshow.ts`:** Slideshow text size (`SLIDESHOW_ZOOM`, separate from the reading page zoom) and where it was left (memory only, same day)

### Views and Routing

Routes defined in `src/router/index.ts`:
- `/` → `src/views/index.vue` (main readings page)
- `/synaxarium` → `src/views/synaxarium.vue`
- `/synaxarium/:slug` → `src/views/synaxarium-story.vue` (one story, by its permanent slug)
- `/feasts` → `src/views/feasts.vue`
- `/about` → `src/views/about.vue`
- `/contact` → `src/views/contact.vue`
- `/slideshow` → `src/views/slideshow.vue` (full screen: `meta.immersive` makes App.vue drop the header and drawer; prerendered, noindex, not in the sitemap)

### Synaxarium page

`src/views/synaxarium.vue`: the title, description, search, date picker button and a row with "today" and the months stay in place; below, the stories grouped by day under month headings scroll in their own area, opening on today (the month row follows the scroll). The date picker is `date-picker-dialog.vue` in `pick` mode: it sends back the chosen Coptic day instead of changing the readings' date. The list renders on the device only (the prerendered page stays small). The search lives in the address (`?q=`); each row links to its story's page. Old story links (`?story=<slug>`) are sent on to the page by the route's `beforeEnter`. Coming back from a story (back, its link to the list or the menu), the list returns to that story's row, where the opened row was (`opened` / `returnTo` in the synaxarium store).
- **Search (`src/composables/useSynaxSearch.ts`):** words in any order, in the titles first, then in the stories' text with an excerpt (dates are not searched: they are in the date picker). The text comes from the stories downloaded for offline reading (`src/services/synaxTexts.ts`, saved as one bundle per synaxarium version and language); until they are downloaded only the titles are searched
- **Story page (`src/views/synaxarium-story.vue`):** prerendered for every story and language, so search engines index each saint: its own title, description (the story's start), canonical, hreflang to the story's other languages, Article and breadcrumb data, and the text, which reaches the browser through the pinia state (`synaxStore.prerendered`) before the usual cache/API check. The Gregorian date this year, the other stories of the same day, previous/next (arrow keys too; replacing the page, so back returns to the list), the story in another language, share, "Go to this day" (`src/composables/useGoToStoryDay.ts`). Opened from search results, previous/next follow them and the searched words are marked. Pages in a language without the story (Polish, or German without it) are noindex. They are not precached (`globIgnores` in `vite.config.ts`): offline, `src/sw.ts` answers a story link with the synaxarium page. `scripts/generate-sitemap.mjs` lists the built story pages, one sitemap per language under the `sitemap.xml` index

### Slideshow

Opened from a button in the drawer's display settings (before the spacing picker), which requests fullscreen during the click (browsers refuse it later; the native app hides the status bar instead). Shows only the readings' text, without introductions and conclusions, in two columns when a second language is set (shared with the reading page settings; the main language follows the route).
- **`src/helpers/slideshow.ts`:** `buildSlideUnits()` turns the day's sections into units, one per reading: verse rows matched on passage + verse number with the second language, or synaxarium stories split into sentences (`splitStory`)
- **`src/composables/useSlidePagination.ts`:** cuts the units into slides by measuring hidden copies built with the same elements and classes as `components/slideshow/slide-view.vue` (keep the two in step). Whole verses per slide, evened out; a two-column story stops each column at the same share of its text. Cuts again on resize, text size, languages and font loading, keeping the same verse on screen
- **`src/components/slideshow/slideshow-controls.vue`:** the strip that fades in on mouse move or a tap in the middle: readings menu, languages / text size / theme, fullscreen, close
- Keys: arrows, Page Up/Down (presentation remotes), Space; Shift+arrows jump a reading; F fullscreen; Escape leaves

### Reading Component Hierarchy

```
views/index.vue
└── components/readings/reading-sections.vue
    └── components/readings/reading-section.vue (per Section)
        └── components/readings/reading-subsection.vue (per SubSection)
            └── components/readings/reading.vue (per Reading, renders verses)
```

### Data Types (`src/types/readings.ts`)

```
DayReading → Sections[] → SubSections[] → Readings[] → Passages[] → Verses[]
```

### Services

- **`src/services/http.ts`:** Axios wrapper with error handling. Base URL from `VITE_API_BASE_URL` env var.

### Localization

- **UI translations:** `locales/*.json` (en, fr, de, it, ar, pl, es, nl)
- **Language IDs:** Defined in `src/consts/languages.ts` (French=1, English=2, Arabic=3, etc.)
- **RTL support:** Arabic has `rtl: true` flag

### Helpers

- **`src/helpers/copticMonth.ts`:** Coptic month name translations
- **`src/helpers/convertCopticToGregorian.ts`:** Date conversion
- **`src/helpers/copticDate.ts`:** Coptic date of a day and Gregorian day of a Coptic date, from the browser's Coptic calendar
- **`src/helpers/formatDate.ts`:** Date formatting for API calls (dd-MM-yyyy format)

### Caching Strategy

The app uses a two-tier cache for the readings, and the same pattern for the synaxarium stories:
1. **LocalForage (IndexedDB):** Stores readings keyed by `{date}-{languageId}`
2. **Cache versioning:** Fetches cache version from Cloudflare Worker (once per visit, `fetchCacheVersionInfo` in `src/store/readings.ts`), bulk-loads cache data when version changes
3. **Synaxarium stories:** own LocalForage instance (`katameros-synaxarium`), keyed `{slug}-{languageId}`. The worker's answer also carries `SynaxVersion`/`SynaxDataUrl` (a version only, no dates). When the version changes, `src/services/synaxCache.ts` downloads every story, after the readings are loaded. While the saved stories are the current version they are read first; otherwise the API comes first. The file is generated by `update-synax-cache.js` in katameros-cache-sqlite.

4. **When the downloads start:** `readings.startOfflineDownloads()` (store) allows the two bulk downloads (readings, about 38 MB, then stories, about 9 MB). `App.vue` calls it where the readings are read: on every screen of the phone app (`Capacitor.isNativePlatform()`), and on the website's readings page and slideshow. On the website's other pages (a story, About, feasts) `getReadings()` only asks the API for the day shown, and nothing is downloaded; the synaxarium list starts the stories download alone (`readings.downloadStories()`). The user's choices of 2026-11-10: all 8 languages stay in one file, and data saver is ignored.

## Environment Configuration

```
VITE_API_BASE_URL=https://localhost:7045/
```

The API uses date format `dd-MM-yyyy` (e.g., `24-12-2025`).

## Mobile (Capacitor)

- **Config:** `capacitor.config.ts`
- **App ID:** `com.dcoanbamarc.katamerosmobile`
- **Web directory:** `dist/`
- **Platforms:** iOS (`ios/`), Android (`android/`)

## Hosting (Cloudflare Workers static assets)

The website is served by Cloudflare Workers as static files only (`wrangler.jsonc`, no Worker code): `npm run build`, then `npx wrangler deploy` uploads `dist/`. The Worker belongs to the account that holds the katameros.app zone. The site was on Render until 2026-11-10.

- **Domain:** katameros.app is a custom domain of the Worker (`routes` in `wrangler.jsonc`, `custom_domain: true`), so Cloudflare keeps its DNS record itself: a read-only record in the zone, with nothing pointing to another host. `www.katameros.app` is not a custom domain: a redirect rule of the zone sends it to katameros.app (301, path and query kept), on a proxied placeholder record (`AAAA 100::`). The zone also has Always Use HTTPS on. That rule, that placeholder and that setting are not in this repo: they were set once through the Cloudflare API on 2026-11-11. Cloudflare does not replace an existing DNS record when a custom domain is added (error 100117, even with wrangler's override): the old record has to be deleted first, and a name that another Cloudflare-hosted provider also knows (Render here) is answered by that provider on some connections for a minute or two afterwards. `dev.katameros.app` and `embedded.katameros.app` are separate sites on Render, not part of this Worker. The workers.dev address is turned off (`workers_dev: false`).
- **Build chain:** `build-only` = `vite-ssg build`, then `scripts/hosting-files.mjs`, then `scripts/generate-sitemap.mjs`. `.env.production` gives the build the production API address; `.nvmrc` pins Node 22.
- **Pipeline:** `.github/workflows/deploy.yml` builds and deploys on every push to master, or by hand from the Actions tab. Its deploy step needs the repository secret `CLOUDFLARE_API_TOKEN` (a token with "Edit Cloudflare Workers" rights on the DCO account); without it the workflow only builds.
- **Addresses without the final slash:** the pages are `<path>/index.html`. `html_handling: auto-trailing-slash` redirects `/fr/about` to `/fr/about/`, and `dist/_redirects` (written by `hosting-files.mjs`) makes it a permanent 301 for the home, feasts, about, contact, slideshow and synaxarium pages of each language. No placeholder rule for the stories: `/fr/synaxarium/:slug` would also catch `/fr/synaxarium/index.html`, which the service worker fetches, and break its install; the stories get the host's own (307) redirect.
- **Not found:** `not_found_handling: 404-page` answers an unknown address with the nearest `404.html` and a real 404. The build prerenders `/<lang>/404/` (the not-found view) and `hosting-files.mjs` moves it to `/<lang>/404.html`; the root `404.html` is a copy of the root page, which sends addresses without a language (`/about`) on to their language. A story address in a language without its text (`/pl/synaxarium/<slug>/`) therefore answers 404, and the page says the story is not available in this language (noindex): no other language is shown in its place, the reader can pick one. The synaxarium list has no route in the languages without a synaxarium (`SYNAX_LANG_PATTERN`): from the list, the language pickers send those languages to the readings (`helpers/langRoute.ts`).
- **Cache headers:** `public/_headers`: a year for the hashed `/assets/*`, a month for `/fonts/*`, the host's default (checked on each visit) for the rest, and `noindex` on the workers.dev address.
- **Local run:** `npx wrangler dev` serves `dist/` with the same rules (the `cloudflare-local` launch entry). The local runtime only accepts a `compatibility_date` it knows: raise the date with the wrangler version.
- **Offline:** the service worker precaches the app's pages, scripts, images and fonts (woff2 and the three ttf), not the story pages nor the 404 pages; it finds precached files without `?v=` (icon font), `?date=`, `?q=`, `?story=`.
