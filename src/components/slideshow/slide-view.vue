<script setup lang="ts">
import { computed } from 'vue';
import { headHtml, storyHtml, type SlideUnit } from '@/helpers/slideshow';
import { twoColumns, type Slide, type SlideLangs } from '@/composables/useSlidePagination';

// The slides are cut by measuring copies of them: keep these elements and
// classes in step with skeleton() and cutVerses()/cutStory() in useSlidePagination.ts
const props = defineProps<{
    unit: SlideUnit,
    slide: Slide,
    /** The first slide of its reading: the heading stands out */
    first: boolean,
    langs: SlideLangs,
}>();

const second = computed(() => twoColumns(props.unit, props.langs) ? props.langs.secondary : null);
const rows = computed(() => props.unit.kind === 'verses' ? props.unit.rows.slice(props.slide.from, props.slide.to) : []);
const story = computed(() => props.unit.kind !== 'story' ? null : {
    primary: storyHtml(props.unit.pieces, props.slide.from, props.slide.to),
    secondary: props.unit.secondPieces ? storyHtml(props.unit.secondPieces, props.slide.secondFrom, props.slide.secondTo) : '',
});
const bodyStyle = computed(() => props.slide.scale < 1 ? { '--ss-fit': String(props.slide.scale) } : undefined);
</script>

<template>
    <div class="ss-slide" :class="{ 'ss-slide--single': !second, 'ss-slide--cont': !first }">
        <div class="ss-head">
            <div class="ss-head-cell" :lang="langs.primary.code" :dir="langs.primary.dir" v-html="headHtml(unit.head)" />
            <div v-if="second && unit.secondHead" class="ss-head-cell" :lang="second.code" :dir="second.dir"
                v-html="headHtml(unit.secondHead)" />
        </div>
        <div class="ss-body" :style="bodyStyle">
            <div v-if="unit.kind === 'verses'" class="ss-rows">
                <div v-for="row in rows" :key="row.key" class="ss-row">
                    <div class="ss-cell" :lang="langs.primary.code" :dir="langs.primary.dir" v-html="row.primary" />
                    <div v-if="second" class="ss-cell" :lang="second.code" :dir="second.dir" v-html="row.secondary" />
                </div>
            </div>
            <div v-else-if="story" class="ss-story">
                <div class="ss-col" :lang="langs.primary.code" :dir="langs.primary.dir" v-html="story.primary" />
                <div v-if="second" class="ss-col" :lang="second.code" :dir="second.dir" v-html="story.secondary" />
            </div>
        </div>
    </div>
</template>
