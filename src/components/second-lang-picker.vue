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
        readings.secondBible = null;
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
        <v-select density="compact" variant="underlined" :label="$t('secondLanguage')" hide-details
            :disabled="readings.loading" persistent-clear
            @update:model-value="onInput" :model-value="readings.secondLanguage"
            :items="availableLanguages" item-title="name" item-value="id" clearable :placeholder="$t('none')"
            autocomplete="off">
            <template #selection="{ item }">
                {{ getDisplayName(item) }}
            </template>
        </v-select>
        <div v-if="readings.secondBible" class="second-bible-name">
            {{ readings.secondBible.name }}
        </div>
    </div>
</template>

<style scoped>
.second-bible-name {
    font-size: 0.75em;
    color: rgba(var(--v-theme-on-surface), 0.6);
    margin-top: 6px;
}
</style>
