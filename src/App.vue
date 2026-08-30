<script setup lang="ts">
import { useTheme } from 'vuetify';
import Notif from './components/notif.vue';
import TheDrawer from './components/the-drawer.vue';
import TheHeader from './components/the-header.vue';
import { useMenu } from './store/menu';
import { computed, onMounted, watch } from 'vue';
import { useReadings } from './store/readings';
import { useRoute } from 'vue-router';
import { track } from './helpers/track';
import LANGUAGES from './consts/languages';
import { useHead } from '@unhead/vue';
import { useCurrentLang } from './composables/useCurrentLang';
import { RTL_LANGS } from './consts/supportedLangs';
import { enableKeepAwake } from './helpers/keepAwake';

const route = useRoute()
const currentLang = useCurrentLang()
const currentDir = computed(() => RTL_LANGS.has(currentLang.value) ? 'rtl' : 'ltr')

useHead({
  htmlAttrs: {
    lang: currentLang,
    dir: currentDir,
  },
})

onMounted(() => {
  const readings = useReadings()
  const menu = useMenu()
  const theme = useTheme()

  // Keep the screen awake while the native app is open (no-op on web).
  enableKeepAwake()

  function syncLanguage() {
    const code = route.params.lang as string | undefined
    if (!code) return
    const langId = Object.values(LANGUAGES).find(l => l.code === code)?.id
    if (langId && readings.language !== langId) {
      readings.language = langId
    }
  }

  const dateParam = route.query.date
  if (typeof dateParam === 'string') {
    const match = /^(\d{1,2})-(\d{1,2})-(\d{4})$/.exec(dateParam)
    if (match) {
      const day = Number(match[1])
      const month = Number(match[2])
      const year = Number(match[3])
      const parsed = new Date(year, month - 1, day)
      if (parsed.getDate() === day && parsed.getMonth() === month - 1) {
        readings.date = parsed
      }
    }
  }

  syncLanguage()
  if (route.params.lang) {
    readings.getReadings()
    track(route.params.lang as string)
  }

  watch(() => route.params.lang, (newLang, oldLang) => {
    if (!newLang || newLang === oldLang) return
    syncLanguage()
    readings.getReadings()
    track('language-change', { lang: newLang as string })
  })

  theme.change(menu.theme)
  watch(menu, () => theme.change(menu.theme))
})
</script>

<template>
  <v-app>
    <the-header />
    <the-drawer />
    <v-main>
      <router-view></router-view>
    </v-main>
    <notif />
  </v-app>
</template>

<style>
/* Body font shortlist:
   - "Atkinson Hyperlegible Next" (active). Sized up via size-adjust: 108% on
     its @font-face blocks: the glyphs render larger everywhere (verses, titles,
     UI) while every CSS font-size and the other faces stay untouched.
   - "Source Sans 3" (saved option: liked)
   - Serifs tried and not picked: Literata, Source Serif 4, Gentium Book Plus */
:root {
  --primary-color: #FFC107;
  /* Warm neutral (taupe) for the feast markers, lists and page,
     so the amber primary stays the only real accent */
  --feast-accent: #79695c;
  --feast-accent-soft: rgba(121, 105, 92, 0.09);
  /* Fasting periods get their own muted liturgical violet so a fast wash
     is distinguishable from the taupe feast marks at a glance */
  --fast-accent: #6d5a80;
  --fast-accent-soft: rgba(109, 90, 128, 0.10);
  --fast-accent-hover: rgba(109, 90, 128, 0.16);
  --fast-accent-border: rgba(109, 90, 128, 0.35);
}

.v-theme--dark {
  --feast-accent: #b3a08f;
  --feast-accent-soft: rgba(179, 160, 143, 0.13);
  --fast-accent: #a795bd;
  --fast-accent-soft: rgba(167, 149, 189, 0.14);
  --fast-accent-hover: rgba(167, 149, 189, 0.22);
  --fast-accent-border: rgba(167, 149, 189, 0.42);
}

@font-face {
  font-family: "Avva Shenouda";
  src: url("/fonts/Avva_Shenouda.ttf");
}

@font-face {
  font-family: "Suez One";
  src: url("/fonts/SuezOne-Regular.ttf");
}

@font-face {
  font-family: "ScheherazadeNew";
  src: url("/fonts/ScheherazadeNew-Regular.ttf");
}

@font-face {
  font-family: "Source Sans 3";
  src: url("/fonts/SourceSans3-Latin.woff2") format("woff2");
  font-weight: 200 900;
  font-style: normal;
  font-display: swap;
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: "Source Sans 3";
  src: url("/fonts/SourceSans3-LatinExt.woff2") format("woff2");
  font-weight: 200 900;
  font-style: normal;
  font-display: swap;
  unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF;
}

@font-face {
  font-family: "Source Sans 3";
  src: url("/fonts/SourceSans3-Italic-Latin.woff2") format("woff2");
  font-weight: 200 900;
  font-style: italic;
  font-display: swap;
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: "Source Sans 3";
  src: url("/fonts/SourceSans3-Italic-LatinExt.woff2") format("woff2");
  font-weight: 200 900;
  font-style: italic;
  font-display: swap;
  unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF;
}

@font-face {
  font-family: "Atkinson Hyperlegible Next";
  src: url("/fonts/AtkinsonNext-Latin.woff2") format("woff2");
  font-weight: 200 800;
  font-style: normal;
  font-display: swap;
  size-adjust: 108%;
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: "Atkinson Hyperlegible Next";
  src: url("/fonts/AtkinsonNext-LatinExt.woff2") format("woff2");
  font-weight: 200 800;
  font-style: normal;
  font-display: swap;
  size-adjust: 108%;
  unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF;
}

@font-face {
  font-family: "Atkinson Hyperlegible Next";
  src: url("/fonts/AtkinsonNext-Italic-Latin.woff2") format("woff2");
  font-weight: 200 800;
  font-style: italic;
  font-display: swap;
  size-adjust: 108%;
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: "Atkinson Hyperlegible Next";
  src: url("/fonts/AtkinsonNext-Italic-LatinExt.woff2") format("woff2");
  font-weight: 200 800;
  font-style: italic;
  font-display: swap;
  size-adjust: 108%;
  unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF;
}


.coptic {
  font-family: "Avva Shenouda";
}

.kt {
  display: inline-block;
  font-size: 1.4em;
  font-weight: bold;
  height: 44px;
  margin-top: 15px;
}

a { text-decoration: none;
color: inherit;
}

/* iOS reads two fast taps on the same control (e.g. the zoom stepper) as
   the double-tap page-zoom gesture, even with user-scalable=no. This
   disables only that gesture on controls; pinch zoom and double-tap zoom
   on reading content stay available. */
button, a, input, textarea, select, [role="button"] {
  touch-action: manipulation;
}

/* The app-wide body face, on every page. Vuetify says Roboto on html, and
   the overlay container (dialogs, menus, snackbars) mounts OUTSIDE
   .v-application, so all three roots must carry the family. Arabic glyphs
   fall through to ScheherazadeNew; the RTL overrides below still win
   through their !important. Display faces (Suez One, Avva Shenouda) and
   the mdi icon font set their own family on more specific selectors. */
html,
.v-application,
.v-overlay-container {
  font-family: "Atkinson Hyperlegible Next", "ScheherazadeNew", sans-serif !important;
}

/* Vuetify's typography utility classes (e.g. the synaxarium
   title/description) hardcode Roboto directly on the element, which beats
   the inherited app font */
:is(.v-application, .v-overlay-container) :is(.text-h1, .text-h2, .text-h3,
.text-h4, .text-h5, .text-h6, .text-subtitle-1, .text-subtitle-2,
.text-body-1, .text-body-2, .text-button, .text-caption, .text-overline) {
  font-family: "Atkinson Hyperlegible Next", "ScheherazadeNew", sans-serif !important;
}

.v-locale--is-rtl .subSection-introduction,
.v-locale--is-rtl .ref,
.v-locale--is-rtl .verse-text,
.v-locale--is-rtl .section-title,
.v-locale--is-rtl .introduction,
.v-locale--is-rtl .subSection-title,
.v-locale--is-rtl .sub-section-link,
.v-locale--is-rtl .reading-conclusion {
  font-family: "ScheherazadeNew", "Raleway" !important;
}

/* Override Arabic font for LTR secondary language text */
.v-locale--is-rtl [dir="ltr"] .subSection-introduction,
.v-locale--is-rtl [dir="ltr"] .ref,
.v-locale--is-rtl [dir="ltr"] .verse-text,
.v-locale--is-rtl [dir="ltr"] .section-title,
.v-locale--is-rtl [dir="ltr"] .introduction,
.v-locale--is-rtl [dir="ltr"] .subSection-title,
.v-locale--is-rtl [dir="ltr"] .reading-conclusion,
.v-locale--is-rtl .verse-text[dir="ltr"],
.v-locale--is-rtl .introduction[dir="ltr"],
.v-locale--is-rtl .reading-introduction[dir="ltr"],
.v-locale--is-rtl .reading-conclusion[dir="ltr"] {
  font-family: inherit !important;
  font-style: italic;
}

/* Safe area insets for landscape mode (notch on left/right) */
.v-main {
  padding-left: env(safe-area-inset-left) !important;
  padding-right: env(safe-area-inset-right) !important;
  /* Bake the v-app-bar offset so SSR HTML doesn't render content under the fixed header
     before Vuetify's layout composable runs on the client. */
  padding-top: 64px !important;
}

.v-expansion-panel-text__wrapper {
  padding: 8px 18px 16px !important;
}


@media (max-width: 768px) {
  .v-container {
    /* Your mobile styles */
    padding: 8px;
  }

}
</style>
