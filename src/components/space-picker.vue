<script setup lang="ts">
import { useMenu } from '../store/menu.js';
import PickerToggle from './picker-toggle.vue';

const menu = useMenu()

const items = [
    { name: 'line', value: 'line', icon: 'mdi-format-line-spacing' },
    { name: 'paragraph', value: 'paragraph', icon: 'mdi-view-headline' }
]
</script>


<template>
    <PickerToggle v-model="menu.spacing" :items="items" :label="$t('spacing')" />
</template>