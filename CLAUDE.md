# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Katameros Web App is a Vue 3 SPA that displays daily religious readings from the Coptic Orthodox Church lectionary. It supports 8 languages (French, English, Arabic, Italian, German, Polish, Spanish, Dutch), multiple Bible versions, and both Gregorian and Coptic calendars. Deployed as a PWA with mobile support via Capacitor.

Website: https://katameros.app/

## Build and Development Commands

```bash
npm install           # Install dependencies
npm run dev          # Start Vite dev server with hot reload
npm run build        # Type-check + production build
npm run preview      # Preview production build
npm run type-check   # Run vue-tsc type checking only
```

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
- `/feasts` → `src/views/feasts.vue`
- `/about` → `src/views/about.vue`
- `/contact` → `src/views/contact.vue`
- `/slideshow` → `src/views/slideshow.vue` (full screen: `meta.immersive` makes App.vue drop the header and drawer; prerendered, noindex, not in the sitemap)

### Synaxarium page

`src/views/synaxarium.vue`: the title, description, search, date picker button and a row with "today" and the months stay in place; below, the stories grouped by day under month headings scroll in their own area, opening on today (the month row follows the scroll). The date picker is `date-picker-dialog.vue` in `pick` mode: it sends back the chosen Coptic day instead of changing the readings' date. The list renders on the device only (the prerendered page stays small). The search and the open story live in the address (`?q=`, `?story=`; the service worker ignores both).
- **Search (`src/composables/useSynaxSearch.ts`):** words in any order, in the titles first, then in the stories' text with an excerpt (dates are not searched: they are in the date picker). The text comes from the stories downloaded for offline reading (`src/services/synaxTexts.ts`, saved as one bundle per synaxarium version and language); until they are downloaded only the titles are searched
- **Story sheet (`src/components/synax-story-sheet.vue`):** the Gregorian date this year, the other stories of the same day, previous/next following the list on screen (arrow keys too), the story in another language, share, the searched words marked

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
