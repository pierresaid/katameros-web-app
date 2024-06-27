<script setup lang="ts">
import { useMenu } from '../store/menu.js';
import PickerToggle from './picker-toggle.vue';

const menu = useMenu()

const items = [
    { name: 'Line', value: 'line', icon: 'mdi-format-line-spacing' },
    { name: 'Paragraph', value: 'paragraph', icon: 'mdi-view-headline' }
]
</script>


<template>
    <PickerToggle v-model="menu.spacing" :items="items" label="Spacing" />
</template>