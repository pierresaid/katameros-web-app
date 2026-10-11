<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue';
import { useMenu } from '@/store/menu';
import { useBackClose } from '@/composables/useBackClose';
import type { AboutPassage } from '@/content/about/types';

// A Gospel passage opened from the About page, in the sheet style of the
// synaxarium stories. The text loads on the first opening, so it can be null.
const props = defineProps<{
    open: boolean,
    // Who the passage is read for ("Pour un prophète")
    eyebrow: string,
    passage: AboutPassage | null,
    bible: string,
}>();

const emit = defineEmits<{ (e: 'close'): void }>();

const menu = useMenu();
useBackClose(() => props.open, () => emit('close'));

// The reader's own reading settings: text size and one verse per line or a paragraph
const textSize = computed(() => `${Number((menu.zoom * 1).toFixed(2))}rem`);
const numberSize = computed(() => `${Number((menu.zoom * 0.8).toFixed(2))}rem`);
const verseTag = computed(() => (menu.spacing === 'line' ? 'div' : 'span'));

// "Jean 10:1–16": the numbers are isolated left to right, or after Arabic letters
// "10:1-16" would show as "16-10:1" (digits after Arabic text break at the hyphen)
const title = computed(() => {
    const ref = props.passage?.ref ?? '';
    const m = ref.match(/^(.*?)\s*(\d[\d:\-–]*)$/);
    return m ? { book: m[1], numbers: m[2] } : { book: ref, numbers: '' };
});

// Swipe-to-dismiss, as on the synaxarium story sheet: the whole sheet drags while
// its content fits; when the text overflows, only the grip drags and the text scrolls
const DISMISS_DISTANCE = 90;
const DISMISS_VELOCITY = 0.6;
const cardRef = ref<{ $el: HTMLElement } | null>(null);
const scrollable = ref(false);
const dragOffset = ref(0);
const dragging = ref(false);
let startY = 0;
let lastY = 0;
let lastTime = 0;
let velocity = 0;

function onSheetDown(e: PointerEvent) {
    if (e.pointerType === 'mouse' && e.button !== 0)
        return;
    const target = e.target as HTMLElement;
    if (target.closest('button, a'))
        return;
    const inGrip = !!target.closest('.passage-grip');
    if (!inGrip && (scrollable.value || e.pointerType === 'mouse'))
        return;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    dragging.value = true;
    startY = lastY = e.clientY;
    lastTime = e.timeStamp;
    velocity = 0;
    dragOffset.value = 0;
}

function onSheetMove(e: PointerEvent) {
    if (!dragging.value)
        return;
    const dt = e.timeStamp - lastTime;
    if (dt > 0)
        velocity = (e.clientY - lastY) / dt;
    lastY = e.clientY;
    lastTime = e.timeStamp;
    dragOffset.value = Math.max(0, e.clientY - startY);
}

function onSheetUp() {
    if (!dragging.value)
        return;
    dragging.value = false;
    if (dragOffset.value > DISMISS_DISTANCE || velocity > DISMISS_VELOCITY)
        emit('close');
    else
        dragOffset.value = 0;
}

async function measure() {
    await nextTick();
    const el = cardRef.value?.$el;
    scrollable.value = !!el && el.scrollHeight > el.clientHeight + 1;
}

let resizeObserver: ResizeObserver | null = null;
function stopObserving() {
    resizeObserver?.disconnect();
    resizeObserver = null;
}

watch(() => props.open, async value => {
    stopObserving();
    if (!value)
        return;
    dragging.value = false;
    dragOffset.value = 0;
    await measure();
    const el = cardRef.value?.$el;
    if (el && typeof ResizeObserver !== 'undefined') {
        resizeObserver = new ResizeObserver(() => measure());
        resizeObserver.observe(el);
        for (const child of Array.from(el.children) as Element[])
            resizeObserver.observe(child);
    }
});
onBeforeUnmount(stopObserving);
watch(() => props.passage, measure);

const cardStyle = computed(() => ({
    transform: dragOffset.value ? `translateY(${dragOffset.value}px)` : undefined,
    transition: dragging.value ? 'none' : 'transform 0.2s ease-out',
}));

function onModelUpdate(value: boolean) {
    if (!value)
        emit('close');
}
</script>

<template>
    <!-- close-on-back off: useBackClose closes it, as for the other sheets -->
    <v-bottom-sheet :model-value="open" :close-on-back="false" inset max-width="760"
        @update:model-value="onModelUpdate">
        <v-card ref="cardRef" class="passage-sheet" :class="{ 'passage-sheet--swipe': !scrollable }"
            :style="cardStyle" @pointerdown="onSheetDown" @pointermove="onSheetMove" @pointerup="onSheetUp"
            @pointercancel="onSheetUp">
            <div class="passage-grip">
                <span class="passage-handle" role="presentation" />
                <div class="passage-eyebrow">{{ eyebrow }}</div>
                <h2 class="passage-title">{{ title.book }} <span dir="ltr">{{ title.numbers }}</span></h2>
                <div class="passage-bible">{{ bible }}</div>
            </div>

            <!-- inline sizes: CSS v-bind does not reach the teleported overlay -->
            <div v-if="passage" class="passage-text" :style="{ fontSize: textSize }">
                <component :is="verseTag" v-for="[n, text] in passage.verses" :key="n" class="passage-verse">
                    <span class="passage-number" :style="{ fontSize: numberSize }">{{ n }}</span> {{ text }}
                </component>
            </div>
            <div v-else class="passage-loading" aria-busy="true">
                <span v-for="n in 7" :key="n" class="passage-loading-line" />
            </div>

            <div class="passage-actions">
                <v-btn variant="plain" @click="emit('close')">{{ $t('close') }}</v-btn>
            </div>
        </v-card>
    </v-bottom-sheet>
</template>

<style scoped>
.passage-sheet {
    padding: 0 20px;
    border-radius: 20px 20px 0 0 !important;
    max-height: 85dvh;
    overflow-y: auto;
}

.passage-sheet--swipe {
    touch-action: none;
}

/* The grip always drags, and stays pinned at the top while the text scrolls */
.passage-grip {
    position: sticky;
    top: 0;
    z-index: 1;
    background: rgb(var(--v-theme-surface));
    touch-action: none;
    cursor: grab;
    user-select: none;
    padding: 8px 20px 10px;
    margin: 0 -20px 6px;
}

.passage-grip:active {
    cursor: grabbing;
}

.passage-handle {
    display: block;
    width: 36px;
    height: 4px;
    border-radius: 2px;
    margin: 0 auto 14px;
    background-color: rgba(var(--v-theme-on-surface), 0.2);
}

.passage-eyebrow {
    font-size: 0.76em;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: rgba(var(--v-theme-on-surface), 0.6);
}

.passage-title {
    font-family: 'Suez one', 'ScheherazadeNew', sans-serif;
    font-weight: 400;
    font-size: 1.4em;
    line-height: 1.25;
    margin: 6px 0 2px;
}

.passage-bible {
    font-size: 0.82em;
    color: rgba(var(--v-theme-on-surface), 0.6);
}

.passage-text {
    color: rgba(var(--v-theme-on-surface), 0.9);
}

/* As on the readings page: one verse per line, or the verses run on as a paragraph */
div.passage-verse {
    line-height: 1.3;
    margin-bottom: 10px;
}

span.passage-verse {
    line-height: 1.6;
}

.passage-loading {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin: 6px 0 18px;
}

.passage-loading-line {
    height: 0.9em;
    border-radius: 4px;
    background-color: rgba(var(--v-theme-on-surface), 0.08);
    animation: passage-pulse 1.4s ease-in-out infinite;
}

.passage-loading-line:nth-child(3n) {
    width: 72%;
}

@keyframes passage-pulse {
    50% {
        opacity: 0.45;
    }
}

@media (prefers-reduced-motion: reduce) {
    .passage-loading-line {
        animation: none;
    }
}

.passage-actions {
    position: sticky;
    bottom: 0;
    display: flex;
    justify-content: flex-end;
    padding: 8px 0 calc(12px + env(safe-area-inset-bottom));
    background: rgb(var(--v-theme-surface));
}
</style>
