<template>
    <div class="subSection mb-10">
        <h2 v-if="subSection.title" class="subSection-title">{{ subSection.title }}</h2>
        <div v-if="subSection.introduction" class="subSection-introduction" v-html="subSection.introduction.replace(/\n/g, '<br>')"></div>
        <Reading v-for="(reading, readingIdx) in subSection.readings"
            :reading="reading" :section-idx="sectionIdx" :sub-section-idx="subSectionIdx" :reading-idx="readingIdx" />
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useMenu } from '../../store/menu';
import { type SubSection } from '../../types/readings.js';
import Reading from './reading.vue';

defineProps<{
    subSection: SubSection,
    sectionIdx: number,
    subSectionIdx: number
}>();

const menu = useMenu()

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
</style>