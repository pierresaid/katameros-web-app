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
- **`src/store/synaxarium.ts`:** Loads synaxarium entries from static JSON files in `assets/`
- **`src/store/menu.ts`:** UI state (drawer, zoom, spacing settings)
- **`src/store/notif.ts`:** Notification state

### Views and Routing

Routes defined in `src/router/index.ts`:
- `/` → `src/views/index.vue` (main readings page)
- `/synaxarium` → `src/views/synaxarium.vue`
- `/about` → `src/views/about.vue`
- `/contact` → `src/views/contact.vue`

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
- **`src/helpers/formatDate.ts`:** Date formatting for API calls (dd-MM-yyyy format)

### Caching Strategy

The app uses a two-tier cache:
1. **LocalForage (IndexedDB):** Stores readings keyed by `{date}-{languageId}`
2. **Cache versioning:** Fetches cache version from Cloudflare Worker, bulk-loads cache data when version changes

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
