<script setup lang="ts">
import { useReadings } from '../store/readings.js';
import PickerToggle from './picker-toggle.vue';

const readings = useReadings();

const items = [
    { name: 'lineByLine', value: 'line-by-line', icon: 'mdi-format-line-spacing' },
    { name: 'sideBySide', value: 'side-by-side', icon: 'mdi-table-column' }
];

</script>


<template>
    <PickerToggle v-model="readings.secondLanguageDisplaySetting" :items="items" :label="$t('displayMode')" />
</template>
