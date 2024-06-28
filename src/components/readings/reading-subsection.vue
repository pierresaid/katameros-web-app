<template>
    <div class="subSection mb-10">
        <h2 v-if="subSection.title" class="subSection-title">{{ subSection.title }}</h2>
        <div v-if="subSection.introduction" class="subSection-introduction" v-html="subSection.introduction.replace(/\n/g, '<br>')"></div>
        <Reading v-for="reading in subSection.readings" :reading="reading" />
    </div>
</template>

<script setup lang="ts">
import { type SubSection } from '../../types/readings.js';
import Reading from './reading.vue';

const props = defineProps<{
    subSection: SubSection
}>();
</script>

<style>
.subSection-introduction {
    color: #d04444;
    margin-top: 10px;
    margin-bottom: 10px;
}

.v-theme--dark .subSection-introduction {
    color: #ff5353;
}

.subSection-title {
    font-family: "Suez one";
    text-align: center;
    font-weight: 400;
    font-size: 1.6em;
}

.reading {
    margin-top: 10px;
    margin-bottom: 60px;
}
</style>