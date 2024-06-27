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
import { useRoute } from 'vue-router';

function getUserLanguage() {
  return navigator.language.slice(0, 2);}

onMounted(async () => {
  const readings = useReadings()
  const route = useRoute();

  const menu = useMenu()
  const theme = useTheme();

  const langQuery = route.query['lang']
  const lang = langQuery ?? getUserLanguage()
  const langId = Object.values(LANGUAGES).find(l => l.code == lang)?.id

  if (langId && (langQuery || !readings.langIsDefined)) {
    readings.language = langId
  }

  const { current } = useLocale()
  setLocale(readings.languageCode);
  current.value = readings.languageCode
  watch(() => readings.languageCode, () => {
    setLocale(readings.languageCode);
    current.value = readings.languageCode
  });
  readings.getReadings();
  theme.global.name.value = menu.theme;
  watch(menu, () => theme.global.name.value = menu.theme)
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
</style>