<template>
    <div class="subSection mb-10">
        <h2 v-if="subSection.title" class="subSection-title">{{ subSection.title }}</h2>
        <div v-if="subSection.introduction" class="subSection-introduction" v-html="subSection.introduction.replace(/\n/g, '<br>')"></div>

        <!-- Side-by-side mode -->
        <div v-if="readings.secondLanguage && readings.secondLanguageDisplaySetting === 'side-by-side'" class="bilingual-grid">
            <div class="primary-column">
                <Reading v-for="(reading, readingIdx) in subSection.readings" :key="reading.id || readingIdx"
                    :reading="reading" :section-idx="sectionIdx" :sub-section-idx="subSectionIdx" :reading-idx="readingIdx" />
            </div>
            <div class="secondary-column">
                <Reading v-for="(reading, readingIdx) in secondaryReadings" 
                    :reading="reading"
                    :section-idx="sectionIdx" :sub-section-idx="subSectionIdx" :reading-idx="readingIdx" />
            </div>
        </div>

        <!-- Line-by-line mode or no second language -->
        <Reading v-else v-for="(reading, readingIdx) in subSection.readings" :key="reading.id || readingIdx"
            :reading="reading"
            :second-language-reading="readings.secondLanguage && readings.secondLanguageDisplaySetting === 'line-by-line' ? getSecondLanguageReading(readingIdx) : undefined"
            :section-idx="sectionIdx" :sub-section-idx="subSectionIdx" :reading-idx="readingIdx" />
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useMenu } from '../../store/menu';
import { useReadings } from '../../store/readings';
import { type SubSection, type Reading as ReadingType } from '../../types/readings.js';
import Reading from './reading.vue';

const props = defineProps<{
    subSection: SubSection,
    sectionIdx: number,
    subSectionIdx: number
}>();

const menu = useMenu();
const readings = useReadings();

// Get matching second language reading
const getSecondLanguageReading = (readingIdx: number): ReadingType | undefined => {
    if (!readings.secondSections || !readings.secondLanguage || !readings.sections) {
        return undefined;
    }

    const currentSection = readings.sections[props.sectionIdx];
    if (!currentSection) return undefined;

    const secondSection = readings.secondSections.find(s => s.id === currentSection.id);
    if (!secondSection) return undefined;

    const secondSubSection = secondSection.subSections.find(ss => ss.id === props.subSection.id);
    if (!secondSubSection) return undefined;

    const currentReading = props.subSection.readings[readingIdx];
    if (!currentReading) return undefined;

    return secondSubSection.readings.find(r => r.id === currentReading.id);
};

// Computed property for secondary readings to ensure reactivity
const secondaryReadings = computed(() => {
    if (!readings.secondSections || !readings.secondLanguage || !readings.sections) {
        return props.subSection.readings;
    }

    const currentSection = readings.sections[props.sectionIdx];
    if (!currentSection) return props.subSection.readings;

    const secondSection = readings.secondSections.find(s => s.id === currentSection.id);
    if (!secondSection) return props.subSection.readings;

    const secondSubSection = secondSection.subSections.find(ss => ss.id === props.subSection.id);
    if (!secondSubSection) return props.subSection.readings;

    return secondSubSection.readings;
});

const subSectionTitleBaseSize = 1.6;
const subSectionTitleSize  = computed(() => {
    return Number((menu.zoom * subSectionTitleBaseSize).toFixed(2));
});

const verseBaseSize = 1
const verseFontSize = computed(() => {
    return Number((menu.zoom * verseBaseSize).toFixed(2));
});

</script>

<style>
.subSection-introduction {
    color: #d04444;
    margin-top: 10px;
    margin-bottom: 10px;
    font-size: v-bind('verseFontSize + "rem"');
}

.v-theme--dark .subSection-introduction {
    color: #ff5353;
}

.subSection-title {
    font-family: "Suez one";
    text-align: center;
    font-weight: 400;
    font-size: v-bind('subSectionTitleSize + "rem"');
}

.reading {
    margin-top: 10px;
    margin-bottom: 60px;
}

/* Bilingual side-by-side layout */
.bilingual-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
}

.primary-column,
.secondary-column {
    min-width: 0; /* Prevent grid overflow */
}
</style>