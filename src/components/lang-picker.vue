<script setup lang="ts">
import LANGUAGES from '../consts/languages.js';
import { useReadings } from '../store/readings.js';

const readings = useReadings()

function onInput(id: number) {
    readings.changeLanguage(id)
}

</script>


<template>
    <div>
        <div class="font-weight-bold my-2">Language</div>
        <v-select density="compact" variant="underlined" style="height:46px;" hide @update:model-value="onInput"
            v-bind:model-value="readings.language" prepend-icon=" mdi-translate" :items="Object.values(LANGUAGES)"
            item-title="name" item-value="id">
        </v-select>
    </div>
</template>
