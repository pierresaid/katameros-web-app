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
    <div>
        <div class="font-weight-bold my-2">{{ $t('language') }}</div>
        <v-select density="compact" variant="underlined" style="height:46px;" @update:model-value="onInput"
            v-bind:model-value="readings.language" prepend-icon=" mdi-translate" :items="Object.values(LANGUAGES)"
            item-title="name" item-value="id" autocomplete="off">
        </v-select>
    </div>
</template>
