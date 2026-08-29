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
import { SYNAX_LANGS } from '@/consts/supportedLangs';
const menu = useMenu()
const { t } = useI18n()
const readings = useReadings();
const lang = useCurrentLang();

const items = computed(() => {
    const m: { title: string, name: string, icon: string }[] = [
        { title: 'home', name: 'home', icon: 'mdi-book-open-page-variant' },
    ]
    if ((SYNAX_LANGS as readonly string[]).includes(readings.languageCode))
        m.push({ title: 'synaxarium.title', name: 'synaxarium', icon: 'mdi-book-cross' })

    m.push({ title: 'feasts.title', name: 'feasts', icon: 'mdi-calendar-star' })
    m.push({ title: 'contact.contact', name: 'contact', icon: 'mdi-chat' })
    return m;
})
</script>


<template>
    <v-navigation-drawer v-model="menu.navOpen" order="2" width="290">
        <div class="drawer-body">
            <v-list nav role="navigation" class="drawer-nav pa-0">
                <v-list-item v-for="item in items" :key="item.name"
                    :to="{ name: item.name, params: { lang } }"
                    :title="$t(item.title)" role="link"
                    :prepend-icon="item.icon" rounded="lg" />
            </v-list>

            <div role="group" :aria-label="t('aria.settings')">
                <h2 class="drawer-section-label">{{ t('settings') }}</h2>

                <div class="drawer-card">
                    <div class="drawer-card-row">
                        <lang-picker />
                    </div>
                    <div class="drawer-card-row">
                        <bible-picker />
                    </div>
                    <div class="drawer-card-row">
                        <second-lang-picker />
                        <second-lang-display-mode v-if="readings.secondLanguage !== null" class="mt-4" />
                    </div>
                </div>

                <div class="drawer-card">
                    <div class="drawer-card-row">
                        <zoom-picker />
                    </div>
                    <div class="drawer-card-row">
                        <theme-picker />
                    </div>
                    <div class="drawer-card-row">
                        <space-picker />
                    </div>
                </div>
            </div>
        </div>
    </v-navigation-drawer>
</template>

<style scoped>
.drawer-body {
    padding: 12px 14px 28px;
}

.drawer-nav {
    margin-bottom: 18px;
}

.drawer-section-label {
    font-size: 0.72em;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: rgba(var(--v-theme-on-surface), 0.45);
    margin: 0 0 8px;
    padding-inline-start: 6px;
}

/* Settings live in soft grouped cards with hairlines between rows */
.drawer-card {
    border-radius: 10px;
    background-color: rgba(var(--v-theme-on-surface), 0.03);
    border: 1px solid rgba(var(--v-theme-on-surface), 0.06);
    margin-bottom: 12px;
}

.drawer-card-row {
    padding: 12px 14px;
}

.drawer-card-row+.drawer-card-row {
    border-top: 1px solid rgba(var(--v-theme-on-surface), 0.07);
}
</style>
