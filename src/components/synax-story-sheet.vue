<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useDisplay } from 'vuetify';
import { useMenu } from '@/store/menu';
import { getCopticMonth } from '@/helpers/copticMonth';
import { copticToGregorian } from '@/helpers/copticDate';
import { findLanguage, languageDir } from '@/helpers/languages';
import { highlightHtml } from '@/helpers/searchText';
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
    /** The current Coptic year, for the Gregorian date of the day */
    copticYear: number | null,
    /** The other stories of the same day */
    sameDay: { slug: string, title: string }[],
    hasPrev: boolean,
    hasNext: boolean,
    /** The languages the story is written in, and the one it is shown in */
    languages: { id: number, name: string }[],
    languageId: number,
    /** Searched words, marked in the text */
    highlight: string[],
}>();

const emit = defineEmits<{
    (e: 'close'): void,
    (e: 'go-to-day'): void,
    (e: 'retry'): void,
    (e: 'prev'): void,
    (e: 'next'): void,
    (e: 'open', slug: string): void,
    (e: 'language', id: number): void,
    (e: 'share'): void,
}>();

const menu = useMenu();
const { locale } = useI18n();
const { xs } = useDisplay();

// "23 Babah · 2 novembre": the day this year in the Gregorian calendar too
const dateLine = computed(() => {
    const day = props.story?.day ?? props.day;
    const month = props.story?.month ?? props.month;
    if (!day || !month)
        return '';
    const gregorian = props.copticYear ? copticToGregorian(month, day, props.copticYear) : null;
    const gregorianText = gregorian
        ? new Intl.DateTimeFormat(String(locale.value), { day: 'numeric', month: 'long' }).format(gregorian)
        : '';
    return [`${day} ${getCopticMonth(month)}`, gregorianText].filter(Boolean).join(' · ');
});
const shownTitle = computed(() => props.story?.title || props.title);
// The story's own language: an Arabic story reads right to left in any page
const storyLang = computed(() => findLanguage(props.languageId)?.code);
const storyDir = computed(() => languageDir(props.languageId));
const languageName = computed(() => findLanguage(props.languageId)?.name ?? '');
const storyHtml = computed(() => props.story ? highlightHtml(props.story.html, props.highlight) : '');
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

// Another story (or language) in the open sheet: measured again, and read
// from its start, or from the first searched word
watch(() => props.story, async (story) => {
    await measure();
    const card = cardRef.value?.$el as HTMLElement | undefined;
    if (!card || !story)
        return;
    const match = card.querySelector('mark.story-match');
    if (!match) {
        card.scrollTop = 0;
        return;
    }
    const grip = card.querySelector('.story-grip')?.getBoundingClientRect().height ?? 0;
    card.scrollTop += match.getBoundingClientRect().top - card.getBoundingClientRect().top - grip - 24;
});

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
                <div class="story-eyebrow-row">
                    <div class="story-eyebrow">{{ dateLine }}</div>
                    <!-- The same story in another language -->
                    <v-menu v-if="languages.length > 1" location="bottom end">
                        <template #activator="{ props: activator }">
                            <v-btn v-bind="activator" variant="text" size="small" class="story-language"
                                prepend-icon="mdi-translate" append-icon="mdi-chevron-down"
                                :aria-label="$t('synaxarium.storyLanguage')">
                                {{ languageName }}
                            </v-btn>
                        </template>
                        <v-list density="compact">
                            <v-list-item v-for="language in languages" :key="language.id" :title="language.name"
                                :active="language.id === languageId" @click="emit('language', language.id)" />
                        </v-list>
                    </v-menu>
                </div>
                <h2 v-if="shownTitle" class="story-title" :lang="storyLang" :dir="storyDir">{{ shownTitle }}</h2>
            </div>

            <!-- inline size: CSS v-bind does not reach the teleported overlay -->
            <div v-if="status === 'ready' && story" class="story-text" :lang="storyLang" :dir="storyDir"
                :style="{ fontSize: textSize }" v-html="storyHtml"></div>
            <div v-else-if="status === 'loading' || status === 'idle'" class="story-loading" aria-busy="true">
                <span v-for="n in 7" :key="n" class="story-loading-line" />
            </div>
            <p v-else-if="status === 'unavailable'" class="story-message">{{ $t('synaxarium.unavailable') }}</p>
            <p v-else-if="status === 'notFound'" class="story-message">{{ $t('synaxarium.notFound') }}</p>
            <div v-else class="story-message">
                <p>{{ $t('synaxarium.loadError') }}</p>
                <v-btn variant="tonal" size="small" @click="emit('retry')">{{ $t('synaxarium.retry') }}</v-btn>
            </div>

            <div v-if="sameDay.length" class="story-same-day">
                <div class="story-same-day-label">{{ $t('synaxarium.sameDay') }}</div>
                <button v-for="other in sameDay" :key="other.slug" type="button" class="story-same-day-item"
                    @click="emit('open', other.slug)">
                    {{ other.title }}
                </button>
            </div>

            <div class="story-actions">
                <!-- Left to right in every language, like the date arrows of the readings -->
                <div class="story-nav" dir="ltr">
                    <v-btn icon="mdi-chevron-left" variant="text" size="small" density="comfortable" :disabled="!hasPrev"
                        :aria-label="$t('synaxarium.previous')" :title="$t('synaxarium.previous')"
                        @click="emit('prev')" />
                    <v-btn icon="mdi-chevron-right" variant="text" size="small" density="comfortable" :disabled="!hasNext"
                        :aria-label="$t('synaxarium.next')" :title="$t('synaxarium.next')" @click="emit('next')" />
                </div>
                <v-btn icon="mdi-share-variant" variant="text" size="small" density="comfortable" :aria-label="$t('synaxarium.share')"
                    :title="$t('synaxarium.share')" @click="emit('share')" />
                <v-spacer />
                <v-btn v-if="canGoToDay" variant="flat" class="story-action" :loading="goingToDay" :size="xs ? 'small' : 'default'"
                    @click="emit('go-to-day')">
                    {{ $t('synaxarium.goToDay') }}
                </v-btn>
                <!-- On a phone the bar has no room for the word (a swipe down closes too) -->
                <v-btn v-if="xs" icon="mdi-close" variant="text" size="small" density="comfortable" :aria-label="$t('close')"
                    :title="$t('close')" @click="emit('close')" />
                <v-btn v-else variant="plain" @click="emit('close')">{{ $t('close') }}</v-btn>
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

.story-eyebrow-row {
    display: flex;
    align-items: center;
    gap: 8px;
    min-height: 28px;
}

.story-eyebrow {
    flex: 1;
    min-width: 0;
    font-size: 0.76em;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: rgba(var(--v-theme-on-surface), 0.6);
}

.story-language.v-btn {
    margin-inline-end: -8px;
    text-transform: none;
    letter-spacing: normal;
    color: rgba(var(--v-theme-on-surface), 0.7);
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

/* The searched words */
.story-text :deep(mark.story-match) {
    color: inherit;
    background-color: rgba(255, 193, 7, 0.35);
    border-radius: 3px;
    padding: 0 1px;
}

.story-same-day {
    margin: 6px 0 4px;
    padding-top: 12px;
    border-top: 1px solid rgba(var(--v-theme-on-surface), 0.08);
}

.story-same-day-label {
    margin-bottom: 4px;
    font-size: 0.76em;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: rgba(var(--v-theme-on-surface), 0.6);
}

.story-same-day-item {
    display: block;
    width: 100%;
    padding: 8px 10px;
    margin: 0 -10px;
    box-sizing: content-box;
    border-radius: 10px;
    text-align: start;
    line-height: 1.35;
    transition: background-color 0.15s;
}

.story-same-day-item:hover,
.story-same-day-item:focus-visible {
    background-color: rgba(var(--v-theme-on-surface), 0.06);
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
    flex-wrap: wrap;
    align-items: center;
    justify-content: flex-end;
    gap: 4px;
    padding: 8px 0 calc(12px + env(safe-area-inset-bottom));
    background: rgb(var(--v-theme-surface));
}

.story-nav {
    display: flex;
}

/* amber wash with a neutral label, like the feast sheet's action */
.story-action.v-btn {
    background-color: rgba(var(--v-theme-primary), 0.28);
    color: rgb(var(--v-theme-on-surface));
}
</style>
