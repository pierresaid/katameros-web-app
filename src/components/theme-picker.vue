<script setup lang="ts">
import { watch } from 'vue';
import { useMenu } from '../store/menu.js';
import PickerToggle from './picker-toggle.vue';
import { track } from '@/helpers/track.js';

const menu = useMenu()

const items = [
    { name: 'light', value: 'light', icon: 'mdi-white-balance-sunny' },
    { name: 'dark', value: 'dark', icon: 'mdi-weather-night' }
]

function onInput(theme: string) {
    track('theme-change', { theme })
}

</script>


<template>
    <PickerToggle v-model="menu.theme" :items="items" :label="$t('theme')" @update:model-value="onInput" />
</template>