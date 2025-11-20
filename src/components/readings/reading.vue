<template>
    <div class="reading" :id="readingId">
        <h3 class="reading-title" v-if="reading.title">{{ reading.title }}</h3>
        <div v-if="reading.introduction" class="reading-introduction mb-5">
            <div v-for="(introduction, index) in reading.introduction.split('\n')" :key="index" class="introduction">
                {{ introduction }}
            </div>
        </div>
        <h3 class="mb-2 ref">{{ Ref }}</h3>
        <div v-for="(passage, passageIdx) in reading.passages" :key="passageIdx">
            <component v-for="(verse, verseIdx) in passage.verses" :key="verseIdx" class="verse-text"
                :is="menu.spacing === 'line' ? 'div' : 'span'">
                <span class="verse-number">{{ verse.number }}</span> {{ verse.text }}
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

const props = defineProps<{
    reading: Reading,
    sectionIdx?: number,
    subSectionIdx?: number,
    readingIdx?: number
}>();

const { reading } = props;

const readingId = computed(() => {
    if (props.sectionIdx !== undefined && props.subSectionIdx !== undefined && props.readingIdx !== undefined) {
        return `reading-${props.sectionIdx}-${props.subSectionIdx}-${props.readingIdx}`;
    }
    return undefined;
});

const menu = useMenu()
const zoom = computed(() => menu.zoom)

const verseBaseSize = 1
const verseFontSize = computed(() => {
    return Number((zoom.value * verseBaseSize).toFixed(2));
});

const verseNbrBaseSize = 0.8;
const verseNbrFontSize = computed(() => {
    return Number((zoom.value * verseNbrBaseSize).toFixed(2));
});

const refBaseSize = 1.2;
const refFontSize = computed(() => {
    return Number((zoom.value * refBaseSize).toFixed(2));
});

const Ref = computed(() => {
    let ref = "";
    if (reading.passages)
        for (let i = 0; i < reading.passages.length; i++) {
            const passage = reading.passages[i];
            if (passage) {
                ref += `${i === 0 || reading.passages[i - 1]?.bookId !== passage.bookId ? passage.bookTranslation : ""} ${passage.ref ?? ""} ${i === reading.passages.length - 1 ? "" : " & "}`;
            }
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
    font-size: v-bind('refFontSize + "rem"');
    text-transform: uppercase;
}

.custom-html {
    font-size: v-bind('verseFontSize + "em"');
}



.custom-html p {
    margin-bottom: 10px;
}

.verse-text,
.reading-conclusion,
.introduction {
    font-size: v-bind('verseFontSize + "rem"');
}

.verse-number {
    font-size: v-bind('verseNbrFontSize + "rem"');
}

.reading-title {
    font-size: v-bind('refFontSize + "rem"');
}

</style>
