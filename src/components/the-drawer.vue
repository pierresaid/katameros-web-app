<script setup lang="ts">
import { useMenu } from '../store/menu.js';

import LangPicker from './lang-picker.vue';
import ThemePicker from './theme-picker.vue';
import SpacePicker from './space-picker.vue';
import BiblePicker from './bible-picker.vue';
import { useI18n } from 'vue-i18n';
const menu = useMenu()
const { t } = useI18n()

const items = [
    { title: 'home', to: '/', icon: 'mdi-book-open-page-variant' },
    // { title: 'About', to: 'about', icon: 'mdi-book-cross' },
    { title: 'contact', to: 'contact', icon: 'mdi-chat' }
]
</script>


<template>
    <v-navigation-drawer v-model="menu.navOpen" order="2">
        <v-list nav>
            <v-list-item v-for="item in items" :key="item.to" :to="item.to" :title="$t(item.title)"
                :prepend-icon="item.icon" />
        </v-list>

        <v-divider />
        <v-list style="">

            <v-list-item style="">
                <lang-picker />
            </v-list-item>
            <v-divider />
            <v-list-item>
                <bible-picker />
            </v-list-item>
            <v-divider />
            <v-list-item>
                <theme-picker />
            </v-list-item>
            <v-divider />
            <v-list-item>
                <space-picker />
            </v-list-item>
        </v-list>


        <v-divider />
        <template #append>
            <!-- <v-btn variant="tonal" block append-icon="mdi-wrench-outline" @click="menu.configOpen = !menu.configOpen">
                Settings
            </v-btn> -->
            <v-btn block append-icon="mdi-github" variant="text" href="https://github.com/pierresaid/katameros-web-app"
                style="text-transform: capitalize; font-weight: 700;" target="_blank">
                Github
            </v-btn>
        </template>
    </v-navigation-drawer>
</template>
