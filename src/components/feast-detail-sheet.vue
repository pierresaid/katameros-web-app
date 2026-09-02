<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useFeastDetail } from '@/composables/useFeastDetail';
import { formatCopticDate, formatDateRange, formatDayCount } from '@/composables/useFeastList';
import { useReadings } from '@/store/readings';
import { useMenu } from '@/store/menu';
import { feastColor } from '@/consts/feastCategories';

const { detail, open, close } = useFeastDetail();
const readings = useReadings();
const menu = useMenu();
const router = useRouter();
const route = useRoute();

const dotColor = computed(() =>
    detail.value?.kind === 'feast' ? feastColor(detail.value.item.id) : 'var(--fast-accent)');

const dateLine = computed(() => {
    const d = detail.value;
    if (!d)
        return '';
    if (d.kind === 'feast') {
        const gregorian = new Intl.DateTimeFormat(readings.languageCode, { weekday: 'long', day: 'numeric', month: 'long' })
            .format(d.item.date);
        return `${gregorian} · ${formatCopticDate(d.item.date)}`;
    }
    return `${formatDateRange(readings.languageCode, d.item.start, d.item.end)} · ${formatDayCount(readings.languageCode, d.item.days)}`;
});

// Swipe-to-dismiss: the bottom sheet has no gesture of its own, so pointer
// events drive the card. The whole sheet is the drag zone while its content
// fits; when the text overflows, only the grip (handle, date line, title)
// drags and the text scrolls natively. Mouse users always drag by the grip
// so the text stays selectable. Past the threshold, or on a quick downward
// flick, the sheet closes; otherwise it springs back.
const DISMISS_DISTANCE = 90;
const cardRef = ref<{ $el: HTMLElement } | null>(null);
const scrollable = ref(false);
const DISMISS_VELOCITY = 0.6;
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
    if (target.closest('button'))
        return;
    const inGrip = !!target.closest('.detail-grip');
    if (!inGrip && (scrollable.value || e.pointerType === 'mouse'))
        return;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    dragging.value = true;
    startY = lastY = e.clientY;
    lastTime = e.timeStamp;
    velocity = 0;
    dragOffset.value = 0;
}

function onGripMove(e: PointerEvent) {
    if (!dragging.value)
        return;
    const dt = e.timeStamp - lastTime;
    if (dt > 0)
        velocity = (e.clientY - lastY) / dt;
    lastY = e.clientY;
    lastTime = e.timeStamp;
    dragOffset.value = Math.max(0, e.clientY - startY);
}

function onGripUp() {
    if (!dragging.value)
        return;
    dragging.value = false;
    if (dragOffset.value > DISMISS_DISTANCE || velocity > DISMISS_VELOCITY)
        close();
    else
        dragOffset.value = 0;
}

// The card keeps its dragged offset through the closing animation; reset
// it when the sheet opens again so it never appears shifted, and measure
// whether the content overflows to decide how wide the drag zone is
watch(open, async (value) => {
    if (!value)
        return;
    dragging.value = false;
    dragOffset.value = 0;
    await nextTick();
    const el = cardRef.value?.$el;
    scrollable.value = !!el && el.scrollHeight > el.clientHeight + 1;
});

const cardStyle = computed(() => ({
    transform: dragOffset.value ? `translateY(${dragOffset.value}px)` : undefined,
    transition: dragging.value ? 'none' : 'transform 0.2s ease-out',
}));

// Open the feast day's readings: closes the sheet and, when opened from
// the calendar dialog, the dialog too
function openReadings() {
    const d = detail.value;
    if (!d || d.kind !== 'feast')
        return;
    readings.date = new Date(d.item.date);
    readings.getReadings();
    close();
    menu.dateDialog = false;
    if (route.name !== 'home')
        router.push({ name: 'home', params: { lang: route.params.lang } });
}
</script>

<template>
    <v-bottom-sheet v-model="open" inset>
        <v-card v-if="detail" ref="cardRef" class="detail-sheet" :class="{ 'detail-sheet--swipe': !scrollable }"
            :style="cardStyle" @pointerdown="onSheetDown" @pointermove="onGripMove"
            @pointerup="onGripUp" @pointercancel="onGripUp">
            <div class="detail-grip">
                <span class="detail-handle" role="presentation" />
                <div class="detail-eyebrow">
                    <span class="detail-dot" role="presentation" :style="{ backgroundColor: dotColor }" />
                    <span>{{ dateLine }}</span>
                </div>
                <h2 class="detail-title">{{ detail.item.name }}</h2>
            </div>
            <p v-if="detail.item.description" class="detail-text">{{ detail.item.description }}</p>
            <div class="detail-actions">
                <v-btn v-if="detail.kind === 'feast'" variant="flat" class="detail-action" @click="openReadings">
                    {{ $t('feasts.readings') }}
                </v-btn>
                <v-btn variant="plain" @click="close">{{ $t('close') }}</v-btn>
            </div>
        </v-card>
    </v-bottom-sheet>
</template>

<style scoped>
.detail-sheet {
    padding: 0 20px calc(12px + env(safe-area-inset-bottom));
    border-radius: 20px 20px 0 0 !important;
    max-height: 85dvh;
    overflow-y: auto;
}

/* While the content fits, a touch anywhere on the sheet drags it */
.detail-sheet--swipe {
    touch-action: none;
}

/* The grip always drags: vertical touches here move the sheet, never scroll */
.detail-grip {
    touch-action: none;
    cursor: grab;
    user-select: none;
    padding-top: 8px;
    margin: 0 -20px;
    padding-inline: 20px;
}

.detail-grip:active {
    cursor: grabbing;
}

.detail-handle {
    display: block;
    width: 36px;
    height: 4px;
    border-radius: 2px;
    margin: 0 auto 14px;
    background-color: rgba(var(--v-theme-on-surface), 0.2);
}

.detail-eyebrow {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.76em;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: rgba(var(--v-theme-on-surface), 0.6);
}

.detail-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex: none;
}

.detail-title {
    font-family: 'Suez one';
    font-weight: 400;
    font-size: 1.4em;
    line-height: 1.25;
    margin: 6px 0 10px;
    text-wrap: balance;
}

.detail-text {
    font-size: 0.95em;
    line-height: 1.55;
    color: rgba(var(--v-theme-on-surface), 0.85);
    margin: 0 0 14px;
}

.detail-actions {
    display: flex;
    justify-content: flex-end;
    gap: 4px;
}

/* amber wash with a neutral label, like the segmented controls' active state */
.detail-action.v-btn {
    background-color: rgba(var(--v-theme-primary), 0.28);
    color: rgb(var(--v-theme-on-surface));
}
</style>
