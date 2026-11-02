<script setup lang="ts">
import { capitalize, computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useHead } from '@unhead/vue';
import { Capacitor } from '@capacitor/core';
import { StatusBar } from '@capacitor/status-bar';
import { useReadings } from '@/store/readings';
import { useSlideshow, type SlideshowSpot } from '@/store/slideshow';
import { buildSlideUnits, type NavGroup, type SlideUnit } from '@/helpers/slideshow';
import { findLanguage, languageDir } from '@/helpers/languages';
import { getCopticMonth } from '@/helpers/copticMonth';
import formatDate from '@/helpers/formatDate';
import { canFullscreen, enterFullscreen, exitFullscreen, isFullscreen, onFullscreenChange } from '@/helpers/fullscreen';
import { useSlidePagination, type LangAttrs, type SlideDeck, type SlideLangs } from '@/composables/useSlidePagination';
import { useWakeLock } from '@/composables/useWakeLock';
import { SITE_URL } from '@/composables/useSeo';
import SlideView from '@/components/slideshow/slide-view.vue';
import SlideshowControls from '@/components/slideshow/slideshow-controls.vue';
import CopticCrossOutlineAnimated from '@/components/coptic-cross-outline-animated.vue';

const readings = useReadings();
const slideshow = useSlideshow();
const route = useRoute();
const router = useRouter();
const { t } = useI18n();

useHead(() => ({
    title: `${t('slideshow.title')} - ${t('seo.brand')}`,
    meta: [{ name: 'robots', content: 'noindex' }],
    link: [{ rel: 'canonical', href: `${SITE_URL}${route.path}` }],
}));

function langAttrs(id: number | null | undefined): LangAttrs | null {
    const lang = findLanguage(id);
    return lang ? { code: lang.code, dir: languageDir(lang.id) } : null;
}

// The languages of the readings on screen (their Bible says which), not of the
// settings: those change before the new readings arrive
const langs = computed<SlideLangs>(() => {
    const primaryId = readings.bible?.languageId ?? readings.language;
    const secondId = readings.secondLanguage ? readings.secondBible?.languageId : null;
    return {
        primary: langAttrs(primaryId) ?? { code: 'fr', dir: 'ltr' },
        secondary: secondId && secondId !== primaryId ? langAttrs(secondId) : null,
    };
});
const units = computed(() => buildSlideUnits(readings.sections, langs.value.secondary ? readings.secondSections : null));

const stage = ref<HTMLElement | null>(null);
const frame = ref<HTMLElement | null>(null);
const measurer = ref<HTMLElement | null>(null);
const zoom = computed(() => slideshow.zoom);
const { deck } = useSlidePagination({ units, langs, zoom, frame, measurer });

const index = ref(0);
const slide = computed(() => deck.value.slides[index.value]);
const unit = computed(() => slide.value ? deck.value.units[slide.value.unit] : undefined);
const unitStart = computed(() => slide.value ? deck.value.starts[slide.value.unit] ?? 0 : 0);
const unitCount = computed(() => {
    if (!slide.value)
        return 0;
    const end = deck.value.starts[slide.value.unit + 1] ?? deck.value.slides.length;
    return end - unitStart.value;
});

// What stays on screen when the slides are cut again (screen or text size,
// languages): it only moves when the reader moves, so cutting again never drifts
const day = computed(() => formatDate(readings.date));
let spot: SlideshowSpot | null = null;
const saved = slideshow.lastSpot;
if (saved && saved.date === day.value)
    spot = saved;
else if (readings.currentSection)
    // Opened from the readings: start on the section being read
    spot = { sectionId: readings.currentSection.id };

function spotAt(d: SlideDeck, i: number): SlideshowSpot | null {
    const s = d.slides[i];
    const u = s && d.units[s.unit];
    if (!s || !u)
        return null;
    return {
        unitKey: u.key,
        row: u.kind === 'verses' ? u.rows[s.from]?.key : s.from,
        group: u.group,
        sectionId: u.sectionId,
    };
}

function findSpot(d: SlideDeck, at: SlideshowSpot | null): number {
    if (!at)
        return 0;
    const matches: ((u: SlideUnit) => boolean)[] = [
        u => !!at.unitKey && u.key === at.unitKey,
        u => !!at.group && u.group === at.group,
        u => at.sectionId !== undefined && u.sectionId === at.sectionId,
    ];
    for (const [step, match] of matches.entries()) {
        const u = d.units.findIndex(match);
        if (u < 0)
            continue;
        const start = d.starts[u] ?? 0;
        const end = d.starts[u + 1] ?? d.slides.length;
        if (step === 0) {
            const reading = d.units[u]!;
            const row = reading.kind === 'verses'
                ? reading.rows.findIndex(r => r.key === at.row)
                : typeof at.row === 'number' ? at.row : -1;
            for (let i = start; i < end; i++) {
                const s = d.slides[i]!;
                if (row >= s.from && row < s.to)
                    return i;
            }
        }
        return Math.min(start, d.slides.length - 1);
    }
    return 0;
}

watch(deck, d => {
    // Readings still loading: keep the spot for when they arrive
    if (d.slides.length)
        index.value = findSpot(d, spot);
});

function go(i: number) {
    const d = deck.value;
    if (!d.slides.length)
        return;
    const target = Math.max(0, Math.min(d.slides.length - 1, i));
    if (target === index.value)
        return;
    index.value = target;
    spot = spotAt(d, target);
    if (spot)
        slideshow.lastSpot = { ...spot, date: day.value };
}

const next = () => go(index.value + 1);
const prev = () => go(index.value - 1);

function goToUnit(u: number) {
    const start = deck.value.starts[u];
    if (start !== undefined)
        go(start);
}

function nextReading() {
    if (slide.value)
        goToUnit(slide.value.unit + 1);
}

// Back to the start of the reading, or to the previous one when already there
function prevReading() {
    if (!slide.value)
        return;
    if (index.value > unitStart.value)
        go(unitStart.value);
    else
        goToUnit(slide.value.unit - 1);
}

const positionLabel = computed(() => {
    if (!unit.value)
        return '';
    const where = [unit.value.sectionTitle, unit.value.navTitle].filter(Boolean).join(' · ');
    return unitCount.value > 1 ? `${where}  ${index.value - unitStart.value + 1}/${unitCount.value}` : where;
});

const dateLabel = computed(() => {
    const date = new Intl.DateTimeFormat(readings.languageCode, { weekday: 'long', day: 'numeric', month: 'long' })
        .format(readings.date);
    const [day, month] = readings.copticDate;
    return `${capitalize(date)} · ${day} ${getCopticMonth(month ?? 1)}`;
});

const groups = computed(() => {
    const list: NavGroup[] = [];
    deck.value.units.forEach((u, i) => {
        let group = list[list.length - 1];
        if (!group || group.sectionIdx !== u.sectionIdx) {
            group = { sectionIdx: u.sectionIdx, title: u.sectionTitle, units: [] };
            list.push(group);
        }
        group.units.push({ index: i, key: u.key, title: u.navTitle, subtitle: u.navSubtitle });
    });
    return list;
});

const progress = computed(() => {
    const total = deck.value.slides.length;
    return total ? `${((index.value + 1) / total) * 100}%` : '0%';
});

function setZoom(value: number) {
    slideshow.zoom = Math.min(2, Math.max(0.5, Math.round(value * 10) / 10));
}

// The controls show on mouse move or a tap in the middle, and fade away
const HIDE_AFTER = 2500;
const controlsVisible = ref(true);
const menusOpen = ref(false);
const bandHovered = ref(false);
let hideTimer: ReturnType<typeof setTimeout> | undefined;

function scheduleHide() {
    clearTimeout(hideTimer);
    hideTimer = setTimeout(() => {
        if (menusOpen.value || bandHovered.value)
            scheduleHide();
        else
            controlsVisible.value = false;
    }, HIDE_AFTER);
}

function showControls() {
    controlsVisible.value = true;
    scheduleHide();
}

function toggleControls() {
    if (!controlsVisible.value)
        return showControls();
    clearTimeout(hideTimer);
    controlsVisible.value = false;
}

watch(menusOpen, open => {
    if (!open)
        scheduleHide();
});

let lastMouse = { x: -1, y: -1 };
function onPointerMove(e: PointerEvent) {
    if (e.pointerType !== 'mouse')
        return;
    // Some browsers send a move when the slide changes under a still mouse
    if (Math.abs(e.clientX - lastMouse.x) + Math.abs(e.clientY - lastMouse.y) < 4)
        return;
    lastMouse = { x: e.clientX, y: e.clientY };
    showControls();
}

// Left third goes back, right third forward, the middle shows or hides the
// controls; a horizontal swipe turns the page. Not mirrored in right-to-left
// languages, like the date arrows of the readings page.
let press: { x: number, y: number, id: number, skip: boolean } | null = null;

function onPointerDown(e: PointerEvent) {
    if (e.pointerType === 'mouse' && e.button !== 0)
        return;
    // The click that closes an open menu doesn't also turn the page
    press = { x: e.clientX, y: e.clientY, id: e.pointerId, skip: menusOpen.value };
}

function cancelPress() {
    press = null;
}

function onPointerUp(e: PointerEvent) {
    const p = press;
    press = null;
    if (!p || p.id !== e.pointerId || p.skip || !frame.value)
        return;
    const dx = e.clientX - p.x;
    const dy = e.clientY - p.y;
    if (Math.abs(dx) > 50 && Math.abs(dx) > 1.5 * Math.abs(dy))
        return dx < 0 ? next() : prev();
    if (Math.hypot(dx, dy) > 12)
        return;
    const rect = frame.value.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    if (x < 1 / 3)
        prev();
    else if (x > 2 / 3)
        next();
    else
        toggleControls();
}

function focusVisible(el: Element): boolean {
    try {
        return el.matches(':focus-visible');
    } catch {
        return false;
    }
}

// Arrows, Page Up/Down (presentation remotes), Space and Enter
function onKeydown(e: KeyboardEvent) {
    if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey || menusOpen.value)
        return;
    const target = e.target as HTMLElement | null;
    if (target?.closest('input, textarea, select, [contenteditable="true"], .v-overlay'))
        return;
    // A control reached with the keyboard keeps Enter and Space for itself
    if ((e.key === 'Enter' || e.key === ' ') && target?.closest('button, a, [role="button"]') && focusVisible(target))
        return;
    switch (e.key) {
        case 'ArrowRight':
            e.shiftKey ? nextReading() : next();
            break;
        case 'ArrowLeft':
            e.shiftKey ? prevReading() : prev();
            break;
        case 'ArrowDown':
        case 'PageDown':
            next();
            break;
        case 'ArrowUp':
        case 'PageUp':
        case 'Backspace':
            prev();
            break;
        case ' ':
        case 'Enter':
            e.shiftKey ? prev() : next();
            break;
        case 'Home':
            go(0);
            break;
        case 'End':
            go(deck.value.slides.length - 1);
            break;
        case 'f':
        case 'F':
            toggleFullscreen();
            break;
        case 'Escape':
            // In fullscreen the browser takes the first Escape to leave it
            if (isFullscreen())
                exitFullscreen();
            else
                exit();
            break;
        default:
            return;
    }
    e.preventDefault();
}

const fullscreen = ref(false);
const fullscreenSupported = ref(false);
let stopFullscreenWatch = () => { };

function toggleFullscreen() {
    if (isFullscreen())
        exitFullscreen();
    else
        enterFullscreen();
}

// Back to where the slideshow was opened from, or to the readings
function exit() {
    const lang = route.params.lang as string;
    const back = router.options.history.state.back;
    if (typeof back === 'string') {
        const previous = router.resolve(back);
        if (previous.params.lang === lang && previous.name !== 'slideshow')
            return router.back();
    }
    router.replace({ name: 'home', params: { lang } });
}

useWakeLock();

let htmlOverflow = '';
onMounted(() => {
    fullscreenSupported.value = canFullscreen();
    fullscreen.value = isFullscreen();
    stopFullscreenWatch = onFullscreenChange(() => { fullscreen.value = isFullscreen(); });
    window.addEventListener('keydown', onKeydown);
    // No page scrollbar beside the slides
    htmlOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    stage.value?.focus({ preventScroll: true });
    scheduleHide();
    // The native app can't go fullscreen: hide the status bar instead
    if (Capacitor.isNativePlatform())
        StatusBar.hide().catch(() => { });
});

onBeforeUnmount(() => {
    window.removeEventListener('keydown', onKeydown);
    stopFullscreenWatch();
    clearTimeout(hideTimer);
    document.documentElement.style.overflow = htmlOverflow;
    exitFullscreen();
    if (Capacitor.isNativePlatform())
        StatusBar.show().catch(() => { });
});
</script>

<template>
    <div ref="stage" class="ss-stage" :class="{ 'ss-idle': !controlsVisible }" :style="{ '--ss-zoom': slideshow.zoom }"
        tabindex="-1" @pointermove="onPointerMove">
        <div ref="frame" class="ss-frame" @pointerdown="onPointerDown" @pointerup="onPointerUp"
            @pointercancel="cancelPress">
            <div ref="measurer" class="ss-measure" aria-hidden="true" />
            <!-- Slides change at once, without a transition -->
            <SlideView v-if="slide && unit" :key="`${unit.key}:${slide.from}:${slide.secondFrom}`" :unit="unit"
                :slide="slide" :first="index === unitStart" :langs="langs" role="group"
                aria-roledescription="slide"
                :aria-label="t('slideshow.slide', { n: index + 1, total: deck.slides.length })" />
            <div v-else class="ss-status">
                <template v-if="readings.error && !readings.sections">
                    <p>{{ t('error.loadingReadings') }}</p>
                    <v-btn variant="tonal" @click="readings.getReadings()">{{ t('reload') }}</v-btn>
                </template>
                <CopticCrossOutlineAnimated v-else class="ss-cross" />
            </div>
        </div>
        <SlideshowControls :visible="controlsVisible" :label="positionLabel" :date-label="dateLabel" :groups="groups"
            :current="slide?.unit ?? -1" :zoom="slideshow.zoom" :fullscreen="fullscreen"
            :fullscreen-supported="fullscreenSupported" @go="goToUnit" @zoom="setZoom" @fullscreen="toggleFullscreen"
            @exit="exit" @menus="menusOpen = $event" @hover="bandHovered = $event" @reveal="showControls" />
        <div class="ss-progress" :style="{ width: progress }" />
    </div>
</template>

<style>
/* Not scoped: the hidden copies the slides are measured on (useSlidePagination.ts)
   are built outside Vue and need the very same rules */
.ss-stage {
    /* Text size follows the screen (projector or phone), times the reader's own size */
    --ss-font: calc(clamp(15px, min(3.3vh, 2.15vw), 80px) * var(--ss-zoom, 1));
    --ss-gap: calc(var(--ss-font) * 1.4);
    position: fixed;
    inset: 0;
    z-index: 1010;
    display: flex;
    flex-direction: column;
    padding:
        max(env(safe-area-inset-top), clamp(10px, 3.5vh, 44px))
        max(env(safe-area-inset-right), clamp(14px, 4vw, 80px))
        env(safe-area-inset-bottom)
        max(env(safe-area-inset-left), clamp(14px, 4vw, 80px));
    background: rgb(var(--v-theme-background));
    color: rgb(var(--v-theme-on-background));
    font-size: var(--ss-font);
    outline: none;
    user-select: none;
    -webkit-user-select: none;
    overscroll-behavior: none;
}

.ss-stage.ss-idle,
.ss-stage.ss-idle * {
    cursor: none;
}

.ss-frame {
    position: relative;
    flex: 1;
    min-height: 0;
    overflow: hidden;
    touch-action: none;
}

.ss-measure {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    visibility: hidden;
    pointer-events: none;
    contain: layout;
}

.ss-measure .ss-slide {
    height: auto;
}

.ss-measure .ss-body {
    overflow: visible;
}

.ss-slide {
    height: 100%;
    display: flex;
    flex-direction: column;
}

.ss-head,
.ss-row,
.ss-story {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    column-gap: var(--ss-gap);
}

.ss-slide--single {
    font-size: 1.1em;
}

.ss-slide--single .ss-head,
.ss-slide--single .ss-row,
.ss-slide--single .ss-story {
    grid-template-columns: minmax(0, 1fr);
}

.ss-slide--single .ss-head,
.ss-slide--single .ss-body {
    width: 100%;
    max-width: 36em;
    margin-inline: auto;
}

.ss-head {
    flex: none;
    align-items: end;
    padding-bottom: 0.6em;
}

.ss-head-cell {
    min-width: 0;
}

.ss-label {
    font-family: "Suez One", "ScheherazadeNew", sans-serif;
    font-size: 0.48em;
    line-height: 1.35;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    opacity: 0.55;
}

.ss-main {
    margin-top: 0.12em;
    font-size: 0.8em;
    font-weight: 700;
    line-height: 1.25;
}

/* The heading stands out on a reading's first slide only */
.ss-slide--cont .ss-head {
    opacity: 0.45;
}

.ss-body {
    flex: 1;
    min-height: 0;
    overflow: hidden;
    font-size: calc(1em * var(--ss-fit, 1));
}

.ss-rows {
    display: flex;
    flex-direction: column;
    row-gap: 0.42em;
}

.ss-row,
.ss-story {
    align-items: start;
}

.ss-cell,
.ss-col {
    min-width: 0;
    line-height: 1.4;
    overflow-wrap: break-word;
}

/* Raised without touching the line height */
.ss-num {
    position: relative;
    top: -0.55em;
    margin-inline-end: 0.15em;
    font-size: 0.55em;
    font-weight: 700;
    opacity: 0.5;
}

.ss-col p {
    margin: 0 0 0.55em;
}

.ss-col p:last-child {
    margin-bottom: 0;
}

/* Arabic: its own face, a little larger, room for the vowel marks */
.ss-head-cell[lang="ar"],
.ss-cell[lang="ar"],
.ss-col[lang="ar"] {
    font-family: "ScheherazadeNew", serif;
}

.ss-cell[lang="ar"],
.ss-col[lang="ar"] {
    font-size: 1.12em;
    line-height: 1.6;
}

.ss-head-cell[lang="ar"] .ss-label {
    font-family: "ScheherazadeNew", serif;
    font-size: 0.55em;
    letter-spacing: 0;
}

.ss-status {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 16px;
    font-size: 16px;
    text-align: center;
}

.ss-cross {
    width: min(28vh, 40vw);
    height: auto;
    opacity: 0.8;
}

.ss-progress {
    position: absolute;
    inset-inline-start: 0;
    bottom: 0;
    height: 2px;
    background-color: rgba(var(--v-theme-on-background), 0.2);
    transition: width 0.25s ease-out;
    pointer-events: none;
}

@media (prefers-reduced-motion: reduce) {
    .ss-progress {
        transition: none;
    }
}
</style>
