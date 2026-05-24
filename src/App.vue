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

  function syncLanguage() {
    const code = route.params.lang as string | undefined
    if (!code) return
    const langId = Object.values(LANGUAGES).find(l => l.code === code)?.id
    if (langId && readings.language !== langId) {
      readings.language = langId
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
:root {
  --primary-color: #FFC107;
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

.coptic {
  font-family: "Avva Shenouda";
}

.kt {
  font-size: 1.4em;
  font-weight: bold;
  height: 44px;
  margin-top: 15px;
}

a { text-decoration: none;
color: inherit;
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
</style>
