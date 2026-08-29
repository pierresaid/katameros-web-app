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
    <v-select density="compact" variant="underlined" :label="$t('language')" hide-details
        @update:model-value="onInput" :model-value="readings.language"
        :items="Object.values(LANGUAGES)" item-title="name" item-value="id" autocomplete="off" />
</template>
