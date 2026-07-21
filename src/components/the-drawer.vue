<script setup lang="ts">
import { useMenu } from '../store/menu.js';

import LangPicker from './lang-picker.vue';
import ThemePicker from './theme-picker.vue';
import SpacePicker from './space-picker.vue';
import BiblePicker from './bible-picker.vue';
import ZoomPicker from './zoom-picker.vue';
import SecondLangPicker from './second-lang-picker.vue';
import SecondLangDisplayMode from './second-lang-display-mode.vue';
import { useI18n } from 'vue-i18n';
import { computed } from 'vue';
import { useReadings } from '@/store/readings.js';
import { useCurrentLang } from '@/composables/useCurrentLang';
const menu = useMenu()
const { t } = useI18n()
const readings = useReadings();
const lang = useCurrentLang();

const items = computed(() => {
    const m: { title: string, name: string, icon: string }[] = [
        { title: 'home', name: 'home', icon: 'mdi-book-open-page-variant' },
    ]
    if (readings.languageCode == 'fr' || readings.languageCode == 'en' || readings.languageCode == 'ar' || readings.languageCode == 'it' || readings.languageCode == 'nl')
        m.push({ title: 'synaxarium.title', name: 'synaxarium', icon: 'mdi-book-cross' })

    m.push({ title: 'contact.contact', name: 'contact', icon: 'mdi-chat' })
    return m;
})
</script>


<template>
    <v-navigation-drawer v-model="menu.navOpen" order="2">
        <v-list nav role="navigation">
            <v-list-item v-for="item in items" :key="item.name"
                :to="{ name: item.name, params: { lang } }"
                :title="$t(item.title)" role="link"
                :prepend-icon="item.icon" />
        </v-list>

        <v-divider />

        <v-list role="group" :aria-label="t('aria.settings')">
            <v-list-item role="none">
                <lang-picker />
            </v-list-item>
            <v-divider />
            <v-list-item role="none">
                <bible-picker />
            </v-list-item>
            <v-divider />
            <v-list-item role="none">
                <second-lang-picker />
            </v-list-item>
            <v-list-item v-if="readings.secondLanguage !== null" role="none">
                <second-lang-display-mode />
            </v-list-item>
            <v-divider />
            <v-list-item role="none">
                <zoom-picker />
            </v-list-item>
            <v-list-item role="none">
                <theme-picker />
            </v-list-item>
            <v-divider />
            <v-list-item role="none">
                <space-picker />
            </v-list-item>
        </v-list>

        <v-divider />
    </v-navigation-drawer>
</template>
