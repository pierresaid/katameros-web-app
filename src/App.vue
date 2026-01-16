<script setup lang="ts">
import { useLocale, useTheme } from 'vuetify';
import Notif from './components/notif.vue';
import TheDrawer from './components/the-drawer.vue';
import TheHeader from './components/the-header.vue';
import { useMenu } from './store/menu';
import { onMounted } from 'vue';
import { watch } from 'vue';
import { useReadings } from './store/readings';
import { setLocale } from '@vee-validate/i18n';
import LANGUAGES from './consts/languages';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { track } from './helpers/track';

function getUserLanguage() {
  return navigator.language.slice(0, 2);}

const router = useRouter()
const { current } = useLocale()
const i18n = useI18n()

onMounted(async () => {
  const readings = useReadings()
  const route = useRoute();

  const menu = useMenu()
  const theme = useTheme();

  await router.isReady()

  const langQuery = route.query['lang']
  const lang = langQuery ?? getUserLanguage()
  
  const langId = Object.values(LANGUAGES).find(l => l.code == lang)?.id

  if (langId && (langQuery || !readings.langIsDefined)) {
    readings.language = langId
  }
  
  setLocale(readings.languageCode);
  current.value = readings.languageCode
  i18n.locale.value = readings.languageCode
  watch(() => readings.languageCode, () => {
    setLocale(readings.languageCode);
    current.value = readings.languageCode
    i18n.locale.value = readings.languageCode
    track('language-change', { lang: readings.languageCode })
  });
  readings.getReadings();
  theme.change(menu.theme);
  watch(menu, () => theme.change(menu.theme))
  track(readings.languageCode)
});
</script>

<template>
  <v-app>
    <the-header />
    <the-drawer />
    <!-- <config-drawer /> -->
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

/* Safe area insets for landscape mode (notch on left/right) */
.v-main {
  padding-left: env(safe-area-inset-left) !important;
  padding-right: env(safe-area-inset-right) !important;
}
</style>