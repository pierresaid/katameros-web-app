<script setup lang="ts">
import LANGUAGES from '../consts/languages.js';
import { useReadings } from '../store/readings.js';
import { useRoute, useRouter } from 'vue-router';

const readings = useReadings()
const route = useRoute()
const router = useRouter()

function onInput(id: number) {
    const lang = Object.values(LANGUAGES).find(l => l.id === id)
    if (!lang) return
    router.push({
        name: (route.name as string) || 'home',
        params: { ...route.params, lang: lang.code },
    })
}
</script>


<template>
    <v-menu>
        <template #activator="{ props }">
            <v-btn color="black" v-bind="props" append-icon="mdi-chevron-down" class="lang-icon-btn" :aria-label="$t('aria.langPicker')">
                <v-icon>mdi-translate</v-icon>
            </v-btn>
        </template>
        <v-list role="menu">
            <v-list-item v-for="language in LANGUAGES" :key="language.id" :value="language.id"
                :active="readings.language === language.id" @click="onInput(language.id)" role="menuitem">
                <v-list-item-title>{{ language.name }}</v-list-item-title>
            </v-list-item>
        </v-list>
    </v-menu>
</template>

<style>
.lang-icon-btn {
    width: 10%;
    padding-left: 0px;
    padding-right: 0px;
}

.lang-icon-btn .v-btn__append {
    margin-left: -4px;
}
</style>
