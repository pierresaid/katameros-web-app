<script setup lang="ts">
import { useMenu } from '../store/menu.js';
import PickerToggle from './picker-toggle.vue';

const menu = useMenu()

const items = [
    { name: 'light', value: 'light', icon: 'mdi-white-balance-sunny' },
    { name: 'dark', value: 'dark', icon: 'mdi-weather-night' }
]
</script>


<template>
    <PickerToggle v-model="menu.theme" :items="items" :label="$t('theme')" />
</template>