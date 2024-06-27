<script setup lang="ts">
import { ref, watch, watchEffect } from 'vue';
import { useReadings } from '../store/readings.js';

const readings = useReadings()

const value = ref(0);

watchEffect(() =>  {
    value.value = readings.bible?.id ?? 0;
})

function onInput(id: number) {
    readings.changeBible(id)
}

</script>


<template>
    <div :title="readings.bibleOriginalName">
        <div class="font-weight-bold my-2">Bible</div>
        <v-select v-if="readings.bibles && readings.bibles.length > 1" density="compact" variant="underlined"
        :disabled="readings.loading"
            style="height:46px;" @update:model-value="onInput" v-model="value"
            @input="(onInput as any)"
            :items="readings.bibles?.map(x => ({ ...x, name: x.name.length > 15 ? x.name.slice(0, 12) + '...' : x.name }))"
            item-title="name" item-value="id">
        </v-select>
        <div v-else-if="readings.bible" class="solo-bible">
            {{ readings.bible.name }}
        </div>
    </div>
</template>

<style>
.solo-bible {
    font-size: 0.8rem;
}
</style>