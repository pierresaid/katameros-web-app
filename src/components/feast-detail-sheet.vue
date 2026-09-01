<script setup lang="ts">
import { computed } from 'vue';
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
        <v-card v-if="detail" class="detail-sheet">
            <span class="detail-handle" role="presentation" />
            <div class="detail-eyebrow">
                <span class="detail-dot" role="presentation" :style="{ backgroundColor: dotColor }" />
                <span>{{ dateLine }}</span>
            </div>
            <h2 class="detail-title">{{ detail.item.name }}</h2>
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
    padding: 8px 20px calc(12px + env(safe-area-inset-bottom));
    border-radius: 20px 20px 0 0 !important;
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
