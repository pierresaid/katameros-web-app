<script setup lang="ts">
import LANGUAGES from '../consts/languages.js';
import { useReadings } from '../store/readings.js';

const readings = useReadings()

function onInput(id: number) {
    readings.changeLanguage(id)
}
</script>


<template>
    <v-menu>
        <template #activator="{ props }">

            <v-btn color="black" v-bind="props" append-icon="mdi-chevron-down" class="lang-icon-btn">
                <v-icon>mdi-translate</v-icon>
            </v-btn>
        </template>
        <v-list>
            <v-list-item v-for="language in LANGUAGES" :key="language.id" :value="language.id"
                :active="readings.language === language.id" @click="onInput(language.id)">
                <v-list-item-title>{{ language.name }}</v-list-item-title>
            </v-list-item>
        </v-list>
    </v-menu>
</template>

<style>
.lang-icon-btn {
    width: 10%;
    padding-left: 0px;
    padding-right: 0px;
}

.lang-icon-btn .v-btn__append {
    margin-left: -4px;
}
</style>