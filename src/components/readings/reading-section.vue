<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
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

// A word wider than a phone's line (German "Morgenweihrauchopfer", Dutch
// "Eucharistieviering") would break mid-word. The widest word is measured
// here, in em of the title's font; the CSS turns it into the size that fits
// the screen, so the title only shrinks as much as that word needs.
const titleEl = ref<HTMLElement | null>(null);
const widestWordEm = ref(0);

function titleFont(el: HTMLElement) {
    const style = getComputedStyle(el);
    return `${style.fontWeight} 100px ${style.fontFamily}`;
}

function measureTitle() {
    const el = titleEl.value;
    const ctx = el && document.createElement('canvas').getContext('2d');
    if (!el || !ctx) return;
    ctx.font = titleFont(el);
    const words = (props.section.title ?? '').toLocaleUpperCase().split(/\s+/);
    widestWordEm.value = Math.max(0, ...words.map(word => ctx.measureText(word).width / 100));
}

onMounted(() => {
    measureTitle();
    // Again once the title's font is loaded: on a first visit the measure
    // above used a fallback font
    if (titleEl.value)
        document.fonts?.load(titleFont(titleEl.value)).then(measureTitle).catch(() => { });
});
watch(() => props.section.title, measureTitle, { flush: 'post' });

</script>

<template>
    <v-expansion-panel-title color="primary" :id="`section-${idx}`" @click="sectionTitleClick(idx)"Subsection menu>
        <h2 ref="titleEl" class="section-title" style="word-wrap: break-word;"
            :class="{ 'condensed': section.title?.length > 20 && xs }"
            :style="widestWordEm ? { '--widest-word': widestWordEm } : undefined">
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
            :sub-section="item" :section-idx="idx" :sub-section-idx="index" />
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

/* Phones: the title shrinks only when its widest word (--widest-word, set
   in the script) can't fit the line. 100px: the page's and the panel's
   padding, the arrow, and a little room to spare. */
@media (max-width: 599px) {
    .v-expansion-panel-title .section-title {
        font-size: min(2em, calc((100vw - 100px) / var(--widest-word, 0.01)));
    }

    .section-title.condensed {
        font-size: min(1.3em, calc((100vw - 100px) / var(--widest-word, 0.01))) !important;
    }
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