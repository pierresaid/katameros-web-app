<script setup lang="ts">
import { useDisplay } from 'vuetify';
import { scrollProgressive, scrollToId, scrollToSection } from '../../helpers/scrollTo.js';
import { useReadings } from '../../store/readings.js';
import { type Section } from '../../types/readings.js';
import ReadingSubsection from './reading-subsection.vue';

const props = defineProps<{
    section: Section,
    idx: number,
}>();

function menuItemClick(index: number) {
    scrollToId(`sub-section-${props.idx}-${index}`);
}

function sectionTitleClick(idx: number) {
    if (readings.panel.includes(idx))
        scrollProgressive(idx);

}

const readings = useReadings();
function onIntersect(visible: Boolean) {
    if (visible) {
        if (readings.panel.find(x => x === props.idx) !== undefined) {
            if (readings.visibleSections.find(x => x === props.idx) === undefined) {
                readings.visibleSections.push(props.idx);
            }
        }
    }
    else {
        if (readings.visibleSections.find(x => x === props.idx) !== undefined) {
            readings.visibleSections.splice(readings.visibleSections.findIndex(x => x === props.idx), 1);
        }
    }

}

const { xs } = useDisplay();

</script>

<template>
    <v-expansion-panel-title color="primary" :id="`section-${idx}`" @click="sectionTitleClick(idx)"Subsection menu>
        <h2 class="section-title" style="word-wrap: break-word;" :class="{ 'condensed': section.title?.length > 20 && xs }">
                {{ section.title }}
        </h2>
    </v-expansion-panel-title>
    <v-expansion-panel-text v-intersect="onIntersect">
        <div v-if="section.subSections.length > 1" class="d-flex justify-center my-4 mt-4 mx-4 flex-column">
            <v-btn v-for="(subSection, index) in section.subSections" :key="index" variant="tonal" size="large"
                @click="menuItemClick(index)" class="sub-section-link">
                {{ subSection.title || subSection.readings[0]?.passages?.[0]?.bookTranslation }}
            </v-btn>
        </div>
        <div v-else class="my-4" />

        <ReadingSubsection v-for="(item, index) in section.subSections" :id="`sub-section-${idx}-${index}`"
            :sub-section="item" />
    </v-expansion-panel-text>
</template>


<style>
.section-title.condensed {
    font-size: 1.3em !important;
}

.v-expansion-panel-title:hover {
    background-color: #e0e0e0;
}
.v-expansion-panel-title .section-title {
    font-family: "Suez One";
    width: 100%;
    margin-left: auto;
    margin-right: auto;
    text-transform: uppercase;
    font-weight: 300;
    font-size: 2em;
    color: black;
    text-align: center
}

.sub-section-link {
    border-radius: 0px;
    border-bottom-width: 0;
}

.sub-section-link:first-child {
    border-radius: 4px 4px 0 0;
}

.sub-section-link:last-child {
    border-radius: 0 0 4px 4px;
    border-bottom-width: 1px;
}

.v-expansion-panels .v-expansion-panel-header .v-expansion-panel-header__icon .v-icon {
    color: black !important;
}

.v-expansion-panel-content__wrap {
    padding: 12px !important;
}

.v-expansion-panel-title {
    height: 64px;
}


.sub-section-link:not(:last-child, :first-child) {
    border-radius: 0px !important;
}

.v-theme--dark .v-btn.sub-section-link {
    border: 1px solid #9c9c9c;
    border-top: none;
}

.v-theme--dark .v-btn.sub-section-link:first-child {
    border-top: 1px solid #9c9c9c;
}
</style>