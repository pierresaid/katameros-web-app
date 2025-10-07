<script setup lang="ts">
import { useMenu } from '../store/menu.js';

import LangPicker from './lang-picker.vue';
import ThemePicker from './theme-picker.vue';
import SpacePicker from './space-picker.vue';
import BiblePicker from './bible-picker.vue';
import ZoomPicker from './zoom-picker.vue';
import { useI18n } from 'vue-i18n';
const menu = useMenu()
const { t } = useI18n()

const items = [
    { title: 'home', to: '/', icon: 'mdi-book-open-page-variant' },
    // { title: 'About', to: 'about', icon: 'mdi-book-cross' },
    { title: 'contact.contact', to: 'contact', icon: 'mdi-chat' }
]
</script>


<template>
    <v-navigation-drawer v-model="menu.navOpen" order="2">
        <v-list nav role="navigation">
            <v-list-item v-for="item in items" :key="item.to" :to="item.to" :title="$t(item.title)" role="link"
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
        <!-- <template #append> -->
        <!-- <v-btn variant="tonal" block append-icon="mdi-wrench-outline" @click="menu.configOpen = !menu.configOpen">
                Settings
            </v-btn> -->
        <!-- </template> -->
    </v-navigation-drawer>
</template>


<style>
.v-navigation-drawer--left {
    /* padding-left:  env(safe-area-inset-left) !important; */
}

.v-navigation-drawer--right {
    /* padding-right:  env(safe-area-inset-right) !important; */
}

.v-navigation-drawer {
    padding-bottom: env(safe-area-inset-bottom) !important;
}
</style>