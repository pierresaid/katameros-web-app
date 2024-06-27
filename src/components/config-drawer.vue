<script setup lang="ts">
import { useMenu } from '../store/menu.js';
import LangPicker from './lang-picker.vue';
import ThemePicker from './theme-picker.vue';
import SpacePicker from './space-picker.vue';
import BiblePicker from './bible-picker.vue';
const menu = useMenu()

</script>


<template>
    <v-navigation-drawer location="right" v-model="menu.configOpen" order="1">
        <template #prepend>
            <v-btn icon="mdi-close" variant="plain" style="margin: 4px; margin-left: auto;"
                @click="menu.configOpen = false" />
        </template>
        <v-list style="margin-top: -25px;">
            <v-list-item style="">
                <lang-picker />
            </v-list-item>
            <v-divider />
            <v-list-item>
                <bible-picker />
            </v-list-item>
            <v-divider />
            <v-list-item>
                <theme-picker />
            </v-list-item>
            <v-divider />
            <v-list-item>
                <space-picker />
            </v-list-item>
        </v-list>

    </v-navigation-drawer>
</template>
