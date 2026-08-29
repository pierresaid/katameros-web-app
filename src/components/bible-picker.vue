<script setup lang="ts">
import { ref, watch, watchEffect } from 'vue';
import { useReadings } from '../store/readings.js';

const readings = useReadings()

const value = ref(0);

watchEffect(() => {
    value.value = readings.bible?.id ?? 0;
})

function onInput(id: number) {
    readings.changeBible(id)
}

</script>


<template>
    <div :title="readings.bibleOriginalName">
        <v-select v-if="readings.bibles && readings.bibles.length > 1" density="compact" variant="underlined"
            :label="$t('bible')" hide-details :disabled="readings.loading"
            @update:model-value="onInput" v-model="value"
            :items="readings.bibles"
            item-title="name" item-value="id" autocomplete="off" />
        <div v-else-if="readings.bible" class="solo-bible">
            <div class="solo-bible-label">{{ $t('bible') }}</div>
            {{ readings.bible.name }}
        </div>
    </div>
</template>

<style scoped>
.solo-bible {
    font-size: 0.85rem;
}

.solo-bible-label {
    font-size: 0.8em;
    color: rgba(var(--v-theme-on-surface), 0.6);
    margin-bottom: 2px;
}
</style>