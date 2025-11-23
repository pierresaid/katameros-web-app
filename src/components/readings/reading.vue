<template>
    <div class="reading" :id="readingId">
        <h3 class="reading-title" v-if="reading.title">{{ reading.title }}</h3>

        <!-- Introduction - show both languages in line-by-line mode -->
        <div v-if="reading.introduction" class="reading-introduction mb-5">
            <div v-for="(introduction, index) in reading.introduction.split('\n')" :key="index" class="introduction">
                {{ introduction }}
            </div>
        </div>
        <div v-if="secondLanguageReading?.introduction && isLineByLine" class="reading-introduction mb-5 secondary-text">
            <div v-for="(introduction, index) in secondLanguageReading.introduction.split('\n')" :key="'second-' + index" class="introduction">
                {{ introduction }}
            </div>
        </div>

        <h3 class="mb-2 ref">{{ Ref }}</h3>

        <!-- Passages with verses -->
        <div v-for="(passage, passageIdx) in reading.passages" :key="passageIdx">
            <!-- Line-by-line mode: alternate verses -->
            <template v-if="isLineByLine && secondLanguageReading">
                <template v-for="(verse, verseIdx) in passage.verses" :key="verseIdx">
                    <!-- Primary language verse -->
                    <component class="verse-text" :is="menu.spacing === 'line' ? 'div' : 'span'">
                        <span class="verse-number">{{ verse.number }}</span> {{ verse.text }}
                    </component>
                    <!-- Secondary language verse -->
                    <component class="verse-text secondary-text" :is="menu.spacing === 'line' ? 'div' : 'span'"
                        v-if="getSecondLanguageVerse(passageIdx, verse.number)">
                        <span class="verse-number">{{ verse.number }}</span> {{ getSecondLanguageVerse(passageIdx, verse.number)?.text }}
                    </component>
                </template>
            </template>

            <!-- Side-by-side mode or no second language: normal rendering -->
            <template v-else>
                <component v-for="(verse, verseIdx) in passage.verses" :key="verseIdx" class="verse-text"
                    :is="menu.spacing === 'line' ? 'div' : 'span'">
                    <span class="verse-number">{{ verse.number }}</span> {{ verse.text }}
                </component>
            </template>
        </div>

        <!-- HTML content (synaxarium) - only show primary language -->
        <div v-if="reading.html" class="custom-html">
            <div v-html="reading.html"></div>
        </div>

        <!-- Conclusion - show both languages in line-by-line mode -->
        <div v-if="reading.conclusion" class="reading-conclusion">
            {{ reading.conclusion }}
        </div>
        <div v-if="secondLanguageReading?.conclusion && isLineByLine" class="reading-conclusion secondary-text">
            {{ secondLanguageReading.conclusion }}
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from '@vue/reactivity';
import { useMenu } from '../../store/menu';
import { useReadings } from '../../store/readings';
import { type Reading, type Verse } from '../../types/readings.js';

const props = defineProps<{
    reading: Reading,
    secondLanguageReading?: Reading,
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

const menu = useMenu();
const readings = useReadings();
const zoom = computed(() => menu.zoom);

// Check if we're in line-by-line mode
const isLineByLine = computed(() => {
    return readings.secondLanguage && readings.secondLanguageDisplaySetting === 'line-by-line' && props.secondLanguageReading;
});

// Get matching verse from second language reading
const getSecondLanguageVerse = (passageIdx: number, verseNumber: number): Verse | undefined => {
    if (!props.secondLanguageReading?.passages) return undefined;

    const secondPassage = props.secondLanguageReading.passages[passageIdx];
    if (!secondPassage) return undefined;

    return secondPassage.verses.find(v => v.number === verseNumber);
};

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

/* Secondary language styling */
.secondary-text {
    opacity: 0.75;
    font-style: italic;
}

.v-theme--dark .secondary-text {
    opacity: 0.7;
}

</style>
