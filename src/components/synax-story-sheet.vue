<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue';
import { useMenu } from '@/store/menu';
import { getCopticMonth } from '@/helpers/copticMonth';
import type { StoryStatus } from '@/composables/useSynaxStory';
import type { SynaxStory } from '@/types/synaxarium';

const props = defineProps<{
    open: boolean,
    // What the list already knows, shown at once while the text loads
    day: number | null,
    month: number | null,
    title: string,
    story: SynaxStory | null,
    status: StoryStatus,
    goingToDay: boolean,
}>();

const emit = defineEmits<{
    (e: 'close'): void,
    (e: 'go-to-day'): void,
    (e: 'retry'): void,
}>();

const menu = useMenu();

const dateLine = computed(() => {
    const day = props.story?.day ?? props.day;
    const month = props.story?.month ?? props.month;
    return day && month ? `${day} ${getCopticMonth(month)}` : '';
});
const shownTitle = computed(() => props.story?.title || props.title);
const canGoToDay = computed(() => !!(props.story?.day ?? props.day));
const textSize = computed(() => `${Number((menu.zoom * 1).toFixed(2))}rem`);

// Swipe-to-dismiss, same behaviour as the feast sheet: the whole sheet drags
// while its content fits; when the text overflows, only the grip drags and the
// text scrolls natively. Mouse users always drag by the grip.
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
    const inGrip = !!target.closest('.story-grip');
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

// While open, measure again whenever the card resizes (rotation, window
// resize, late font loading), so a story that starts to overflow can scroll.
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
// The text arrives after the sheet opens, so measure again once it is there
watch(() => props.status, measure);

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
    <!-- close-on-back off: the ?story query drives the sheet, and Vuetify's own
         back guard would cancel the history step that closes it -->
    <v-bottom-sheet :model-value="open" :close-on-back="false" inset max-width="760"
        @update:model-value="onModelUpdate">
        <v-card ref="cardRef" class="story-sheet" :class="{ 'story-sheet--swipe': !scrollable }" :style="cardStyle"
            @pointerdown="onSheetDown" @pointermove="onSheetMove" @pointerup="onSheetUp" @pointercancel="onSheetUp">
            <div class="story-grip">
                <span class="story-handle" role="presentation" />
                <div v-if="dateLine" class="story-eyebrow">{{ dateLine }}</div>
                <h2 v-if="shownTitle" class="story-title">{{ shownTitle }}</h2>
            </div>

            <!-- inline size: CSS v-bind does not reach the teleported overlay -->
            <div v-if="status === 'ready' && story" class="story-text" :style="{ fontSize: textSize }"
                v-html="story.html"></div>
            <div v-else-if="status === 'loading' || status === 'idle'" class="story-loading" aria-busy="true">
                <span v-for="n in 7" :key="n" class="story-loading-line" />
            </div>
            <p v-else-if="status === 'unavailable'" class="story-message">{{ $t('synaxarium.unavailable') }}</p>
            <p v-else-if="status === 'notFound'" class="story-message">{{ $t('synaxarium.notFound') }}</p>
            <div v-else class="story-message">
                <p>{{ $t('synaxarium.loadError') }}</p>
                <v-btn variant="tonal" size="small" @click="emit('retry')">{{ $t('synaxarium.retry') }}</v-btn>
            </div>

            <div class="story-actions">
                <v-btn v-if="canGoToDay" variant="flat" class="story-action" :loading="goingToDay"
                    @click="emit('go-to-day')">
                    {{ $t('synaxarium.goToDay') }}
                </v-btn>
                <v-btn variant="plain" @click="emit('close')">{{ $t('close') }}</v-btn>
            </div>
        </v-card>
    </v-bottom-sheet>
</template>

<style scoped>
.story-sheet {
    /* No bottom padding: the sticky action bar carries it, so the bar sits at
       the very end of the content and does not shift when the story ends */
    padding: 0 20px;
    border-radius: 20px 20px 0 0 !important;
    max-height: 85dvh;
    overflow-y: auto;
}

/* While the content fits, a touch anywhere on the sheet drags it */
.story-sheet--swipe {
    touch-action: none;
}

/* The grip always drags: vertical touches here move the sheet, never scroll.
   It stays pinned at the top while the story scrolls under it. */
.story-grip {
    position: sticky;
    top: 0;
    z-index: 1;
    background: rgb(var(--v-theme-surface));
    touch-action: none;
    cursor: grab;
    user-select: none;
    padding: 8px 20px 4px;
    margin: 0 -20px;
}

.story-grip:active {
    cursor: grabbing;
}

.story-handle {
    display: block;
    width: 36px;
    height: 4px;
    border-radius: 2px;
    margin: 0 auto 14px;
    background-color: rgba(var(--v-theme-on-surface), 0.2);
}

.story-eyebrow {
    font-size: 0.76em;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: rgba(var(--v-theme-on-surface), 0.6);
}

.story-title {
    font-family: 'Suez one';
    font-weight: 400;
    font-size: 1.4em;
    line-height: 1.25;
    margin: 6px 0 10px;
    text-wrap: balance;
}

.story-text {
    line-height: 1.6;
    color: rgba(var(--v-theme-on-surface), 0.9);
}

.story-text :deep(p) {
    margin-bottom: 10px;
}

.story-loading {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin: 6px 0 18px;
}

.story-loading-line {
    height: 0.9em;
    border-radius: 4px;
    background-color: rgba(var(--v-theme-on-surface), 0.08);
    animation: story-pulse 1.4s ease-in-out infinite;
}

.story-loading-line:nth-child(3n) {
    width: 72%;
}

@keyframes story-pulse {
    50% {
        opacity: 0.45;
    }
}

.story-message {
    color: rgba(var(--v-theme-on-surface), 0.75);
    margin: 4px 0 16px;
}

.story-message p {
    margin-bottom: 10px;
}

/* The buttons stay reachable at the bottom while a long story scrolls */
.story-actions {
    position: sticky;
    bottom: 0;
    display: flex;
    justify-content: flex-end;
    gap: 4px;
    padding: 8px 0 calc(12px + env(safe-area-inset-bottom));
    background: rgb(var(--v-theme-surface));
}

/* amber wash with a neutral label, like the feast sheet's action */
.story-action.v-btn {
    background-color: rgba(var(--v-theme-primary), 0.28);
    color: rgb(var(--v-theme-on-surface));
}
</style>
