<script setup lang="ts">
import { computed, nextTick } from 'vue';
import LANGUAGES from '../consts/languages.js';
import { useReadings } from '../store/readings.js';

const readings = useReadings();

const availableLanguages = computed(() =>
    Object.values(LANGUAGES).filter(l => l.id !== readings.language)
);

async function onInput(id: number | null) {
    readings.secondLanguage = id;
    if (id) {
        await readings.fetchSecondLanguageReadings();
        // Force re-render to fix display issues when switching second language
        if (readings.secondLanguageDisplaySetting === 'side-by-side') {
            readings.secondLanguageDisplaySetting = 'line-by-line';
            nextTick(() => {
                readings.secondLanguageDisplaySetting = 'side-by-side';
            });
        }
    } else {
        readings.secondSections = null;
    }
}

function getDisplayName(item: any) {
    if (!item?.value) return '';
    const lang = Object.values(LANGUAGES).find(l => l.id == item.value);
    return lang?.name || '';
}

</script>


<template>
    <div>
        <div class="font-weight-bold my-2">{{ $t('secondLanguage') }}</div>
        <v-select density="compact" variant="underlined" style="height:46px;" :disabled="readings.loading"
            @update:model-value="onInput" :model-value="readings.secondLanguage" prepend-icon="mdi-translate-variant"
            :items="availableLanguages" item-title="name" item-value="id" clearable :placeholder="$t('none')">
            <template #selection="{ item }">
                {{ getDisplayName(item) }}
            </template>
        </v-select>
        <div v-if="readings.secondBible" class="text-caption mt-1" style="opacity: 0.7;">
            {{ readings.secondBible.name }}
        </div>
    </div>
</template>
