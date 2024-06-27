<script setup lang="ts">
import { useMenu } from '../store/menu.js';
import PickerToggle from './picker-toggle.vue';

const menu = useMenu()

const items = [
    { name: 'Light', value: 'light', icon: 'mdi-white-balance-sunny' },
    { name: 'Dark', value: 'dark', icon: 'mdi-weather-night' }
]
</script>


<template>
    <PickerToggle v-model="menu.theme" :items="items" label="Theme" />
</template>