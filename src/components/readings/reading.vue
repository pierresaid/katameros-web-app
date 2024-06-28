<template>
    <div class="reading">
        <h3 v-if="reading.title">{{ reading.title }}</h3>
        <div v-if="reading.introduction" class="reading-introduction mb-5">
            <div v-for="(introduction, index) in reading.introduction.split('\n')" :key="index" class="introduction">
                {{ introduction }}
            </div>
        </div>
        <h3 class="mb-2 ref">{{ Ref }}</h3>
        <div v-for="(passage, passageIdx) in reading.passages" :key="passageIdx">
            <component v-for="(verse, verseIdx) in passage.verses" :key="verseIdx" class="verse-text"
                :is="menu.spacing === 'line' ? 'div' : 'span'">
                <span style="font-size: 0.8rem">{{ verse.number }}</span> {{ verse.text }}
            </component>
        </div>
        <div v-if="reading.html" class="custom-html">
            <div v-html="reading.html"></div>
        </div>
        <div v-if="reading.conclusion" class="reading-conclusion">
            {{ reading.conclusion }}
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from '@vue/reactivity';
import { useMenu } from '../../store/menu';
import { type Reading } from '../../types/readings.js';

const { reading } = defineProps<{
    reading: Reading
}>();

const menu = useMenu()

const Ref = computed(() => {
    let ref = "";
    if (reading.passages)
        for (let i = 0; i < reading.passages.length; i++) {
            const passage = reading.passages[i];
            ref += `${i === 0 || reading.passages[i - 1].bookId !== passage.bookId ? passage.bookTranslation : ""} ${passage.ref
                } ${i === reading.passages.length - 1 ? "" : " & "}`;
        }
    return ref;
})

</script>

<style>
.reading-introduction {
    color: #d04444;
}

.v-theme--dark .reading-introduction {
    color: #ff5353;
}

.introduction~.introduction {
    margin-top: 8px;
}

.reading-conclusion {
    text-align: right;
    color: #d04444;
}

.v-theme--dark .reading-conclusion {
    color: #ff5353;
}

.verse-text {
    line-height: 1.3;
    margin-bottom: 10px;
}

.ref {
    font-weight: 500;
    font-size: 1.2em;
    text-transform: uppercase;
}

.custom-html p {
    margin-bottom: 10px;
}
</style>
