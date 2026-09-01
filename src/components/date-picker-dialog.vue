<script setup lang="ts">
import Datepicker, { type DatePickerMarker } from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import { useReadings } from '../store/readings';
import { useMenu } from '../store/menu';
import { computed, nextTick, ref, watch } from 'vue';
import CopticDatePicker from './coptic-date-picker.vue';
import { convertCopticToGregorian } from '@/helpers/convertCopticToGregorian';
import { useFeasts } from '../store/feasts';
import { useFeastList } from '@/composables/useFeastList';
import { feastColor } from '@/consts/feastCategories';

const readings = useReadings();

const menu = useMenu()
const tab = ref('date')

// The feasts page opens the dialog for the calendar alone: no tab bar,
// no coptic-date or feasts tab
defineProps<{ dateOnly?: boolean }>()

const feasts = useFeasts();
const viewedYear = ref(readings.date.getFullYear());
const viewedMonth = ref(readings.date.getMonth());

watch([() => menu.dateDialog, () => readings.language], ([open]) => {
    if (open) {
        viewedYear.value = readings.date.getFullYear();
        viewedMonth.value = readings.date.getMonth();
        feasts.ensureYearsAround(viewedYear.value);
    }
})

function onMonthYearUpdate({ month, year }: { instance: number, month: number, year: number }) {
    viewedMonth.value = month;
    viewedYear.value = year;
    feasts.ensureYearsAround(year);
}

// One marker per day carrying the localized feast names as tooltip
const markers = computed<DatePickerMarker[]>(() => {
    const byDay = new Map<string, DatePickerMarker>();
    for (const year of [viewedYear.value - 1, viewedYear.value, viewedYear.value + 1]) {
        for (const feast of feasts.feastsForYear(year)) {
            if (!feast.name)
                continue;
            const day = feast.date.slice(0, 10);
            const color = feastColor(feast.id);
            const existing = byDay.get(day);
            if (existing)
                existing.tooltip?.push({ text: feast.name, color });
            else
                byDay.set(day, { date: new Date(feast.date), type: 'dot', color, tooltip: [{ text: feast.name, color }] });
        }
    }
    return [...byDay.values()];
})

// Soft wash on every day inside a fasting period, drawn as one continuous
// band: each day knows whether it sits at a run edge (fast start/end) or a
// week edge (Monday-first rows), and only those sides get rounded corners
function fastDayKey(day: Date) {
    return `${day.getFullYear()}-${day.getMonth()}-${day.getDate()}`;
}

const fastDays = computed(() => {
    const map = new Map<string, { left: boolean, right: boolean }>();
    for (const year of [viewedYear.value - 1, viewedYear.value, viewedYear.value + 1]) {
        for (const fast of feasts.fastsForYear(year)) {
            const start = +new Date(fast.start);
            const end = +new Date(fast.end);
            for (let day = new Date(fast.start); +day <= end; day.setDate(day.getDate() + 1)) {
                map.set(fastDayKey(day), {
                    left: +day === start || day.getDay() === 1,
                    right: +day === end || day.getDay() === 0,
                });
            }
        }
    }
    return map;
})

function fastDayClass(date: Date) {
    const info = fastDays.value.get(fastDayKey(date));
    if (!info)
        return '';
    return `fast-band${info.left ? ' fast-band--left' : ''}${info.right ? ' fast-band--right' : ''}`;
}

// Names behind the displayed month's dots and washes: the marker tooltips
// need hover, so touch users otherwise cannot tell what a mark means
const monthFeasts = computed(() => feasts.feastsForYear(viewedYear.value)
    .filter(f => !!f.name && new Date(f.date).getMonth() === viewedMonth.value)
    .map(f => ({ id: f.id, day: new Date(f.date).getDate(), name: f.name as string, color: feastColor(f.id) }))
    .sort((a, b) => a.day - b.day))

// A fast can start the previous year (Nativity), so look in both lists
const monthFasts = computed(() => {
    const monthStart = new Date(viewedYear.value, viewedMonth.value, 1);
    const monthEnd = new Date(viewedYear.value, viewedMonth.value + 1, 0);
    const out: { id: string, name: string }[] = [];
    for (const year of [viewedYear.value - 1, viewedYear.value]) {
        for (const fast of feasts.fastsForYear(year)) {
            if (fast.name && new Date(fast.start) <= monthEnd && new Date(fast.end) >= monthStart
                && !out.some(o => o.name === fast.name))
                out.push({ id: `${year}-${fast.id}`, name: fast.name });
        }
    }
    return out;
})

const {
    year: feastYear,
    currentYear,
    loading: feastsLoading,
    feasts: feastList,
    formatFeastDate,
    openFeast,
} = useFeastList();

const feastListEl = ref<HTMLElement | null>(null);

// Bring the next upcoming feast into view when the tab opens
watch(tab, async (value) => {
    if (value !== 'feasts')
        return;
    await nextTick();
    const list = feastListEl.value;
    const next = list?.querySelector<HTMLElement>('.feast-row--next');
    // Scroll only the list, vertically: scrollIntoView also scrolled ancestor
    // containers (horizontally too), clipping the date column and jolting the
    // dialog while the tab transition ran.
    if (list && next)
        list.scrollTop = next.offsetTop - (list.clientHeight - next.offsetHeight) / 2;
})

const copticDate = ref<[number, number, number]>([0, 0, 0])
function onUpdate(date: [number, number, number]) {
    copticDate.value = date
}

function onSave() {
    const ds = convertCopticToGregorian(`${copticDate.value[1]}/${copticDate.value[0]}/${copticDate.value[2]}`)
    readings.date = new Date(ds as any)
    readings.getReadings();
}

</script>


<template>
    <v-dialog v-model="menu.dateDialog" :persistent="false" width="auto">
        <v-card class="date-dialog-card">
            <template v-if="!dateOnly">
                <v-tabs v-model="tab" grow density="compact" :show-arrows="false" class="date-dialog-tabs">
                    <v-tab value="date">{{ $t("date") }}</v-tab>
                    <v-tab value="coptic-date">{{ $t("coptic-date") }}</v-tab>
                    <v-tab value="feasts">{{ $t("feasts.tab") }}</v-tab>
                </v-tabs>
            </template>
            <v-card-text>
                <v-window v-model="tab" :touch="false">
                    <v-window-item value="date">
                        <Datepicker v-model="readings.date" @update:modelValue="readings.getReadings(); $emit('update:model-value', false)"
                            inline :locale="readings.languageCode == 'ar' ? 'en' : readings.languageCode" auto-apply
                            :enable-time-picker="false" :dark="menu.theme === 'dark'"
                            :markers="markers" :day-class="fastDayClass" @update-month-year="onMonthYearUpdate">
                        </Datepicker>
                        <div v-if="monthFeasts.length || monthFasts.length" class="dp-legend">
                            <span v-for="feast in monthFeasts" :key="`feast-${feast.id}-${feast.day}`" class="dp-legend-item">
                                <span class="dp-legend-dot" role="presentation" :style="{ backgroundColor: feast.color }" />
                                <span><span class="dp-legend-day">{{ feast.day }}</span> {{ feast.name }}</span>
                            </span>
                            <span v-for="fast in monthFasts" :key="`fast-${fast.id}`" class="dp-legend-item">
                                <span class="dp-legend-swatch" role="presentation" />
                                <span>{{ fast.name }}</span>
                            </span>
                        </div>
                    </v-window-item>
                    <v-window-item value="coptic-date">
                        <CopticDatePicker @update="onUpdate" />
                    </v-window-item>
                    <v-window-item value="feasts">
                        <div class="feasts-tab">
                            <v-locale-provider :rtl="false">
                                <div class="feasts-tab-year">
                                    <v-btn icon="mdi-chevron-left" size="small" variant="text"
                                        :aria-label="$t('aria.prevYear')" @click="feastYear--" />
                                    <span class="feasts-tab-year-label">{{ feastYear }}</span>
                                    <v-btn icon="mdi-chevron-right" size="small" variant="text"
                                        :aria-label="$t('aria.nextYear')" @click="feastYear++" />
                                </div>
                            </v-locale-provider>
                            <div ref="feastListEl" class="feasts-tab-list">
                                <template v-if="feastList.length">
                                    <button v-for="feast in feastList" :key="`${feast.id}-${+feast.date}`" type="button"
                                        class="feast-row"
                                        :class="{
                                            'feast-row--past': feast.isPast && feastYear === currentYear,
                                            'feast-row--next': feast.isNext && feastYear === currentYear,
                                            'feast-row--today': feast.isToday,
                                        }"
                                        @click="openFeast(feast)">
                                        <span class="feast-row-date">{{ formatFeastDate(feast, { day: 'numeric', month: 'short' }) }}</span>
                                        <span class="feast-row-name">{{ feast.name }}</span>
                                    </button>
                                </template>
                                <v-skeleton-loader v-else-if="feastsLoading" type="list-item@6" class="bg-transparent" />
                                <div v-else class="feasts-tab-empty">
                                    {{ $t('feasts.empty') }}
                                    <v-btn size="small" variant="tonal" color="primary" class="mt-2" @click="feasts.ensureYear(feastYear)">
                                        {{ $t('reload') }}
                                    </v-btn>
                                </div>
                            </div>
                        </div>
                    </v-window-item>
                </v-window>
            </v-card-text>
            <v-divider />
            <v-card-actions>
                <v-spacer />
                <v-btn v-if="tab === 'coptic-date'" color="primary" variant="tonal"
                    @click="onSave(); $emit('update:model-value', false)">
                    Ok
                </v-btn>
                <v-btn variant="plain" @click="$emit('update:model-value', false)">
                    {{ $t('close') }}
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<style>
.v-card.date-dialog-card {
    border-radius: 16px;
}

/* The tab bar restyled as the app's segmented pill control (see
   picker-toggle.vue): soft track, pill segments, amber wash on the
   active one instead of the stock underline */
.date-dialog-tabs.v-tabs {
    margin: 14px 16px 2px;
    padding: 3px;
    border-radius: 999px;
    background-color: rgba(var(--v-theme-on-surface), 0.04);
    border: 1px solid rgba(var(--v-theme-on-surface), 0.06);
    height: auto;
}

.date-dialog-tabs .v-tab.v-btn {
    min-width: 0;
    height: 34px;
    border-radius: 999px;
    text-transform: none;
    letter-spacing: normal;
    font-weight: 500;
    color: rgba(var(--v-theme-on-surface), 0.65);
}

.date-dialog-tabs .v-tab--selected {
    background-color: rgba(var(--v-theme-primary), 0.28);
    color: rgb(var(--v-theme-on-surface));
}

.date-dialog-tabs .v-tab__slider,
.date-dialog-tabs .v-tab--selected .v-btn__overlay {
    display: none;
}

.dp__theme_light {
    --dp-primary-color: var(--primary-color);
    --dp-marker-color: var(--feast-accent);
}

.dp__theme_dark {
    --dp-primary-color: var(--primary-color);
    --dp-marker-color: var(--feast-accent);
}

.dp__marker_dot {
    width: 6px;
    height: 6px;
}

/* Fast periods as one continuous band per week row: the wash is painted on
   the calendar items (which tile edge-to-edge) instead of the day cells, so
   consecutive days merge with no seams. Corners round only at run and week
   edges; the selected day's amber pill rides on top of the band. */
.dp__calendar_item:has(.fast-band) {
    background-color: var(--fast-accent-soft);
}

.dp__calendar_item:has(.fast-band--left) {
    border-top-left-radius: var(--dp-border-radius, 4px);
    border-bottom-left-radius: var(--dp-border-radius, 4px);
}

.dp__calendar_item:has(.fast-band--right) {
    border-top-right-radius: var(--dp-border-radius, 4px);
    border-bottom-right-radius: var(--dp-border-radius, 4px);
}

.dp__calendar_item:has(.fast-band:not(.dp__active_date):hover) {
    background-color: var(--fast-accent-hover);
}

/* the cell's own grey hover pill would sit as a square patch on the band */
.fast-band:not(.dp__active_date):hover {
    background-color: transparent;
}

/* Browsers without :has() fall back to per-day rounded washes */
@supports not selector(:has(*)) {
    .fast-band:not(.dp__active_date) {
        background-color: var(--fast-accent-soft);
    }

    .fast-band:not(.dp__active_date):hover {
        background-color: var(--fast-accent-hover);
    }
}

/* width:0 + min-width:100% tracks the datepicker's width without letting
   long names widen the auto-sized dialog */
.dp-legend {
    width: 0;
    min-width: 100%;
    margin-top: 8px;
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
    column-gap: 14px;
    row-gap: 3px;
    font-size: 0.75em;
    line-height: 1.35;
    color: rgba(var(--v-theme-on-surface), 0.75);
}

.dp-legend-item {
    display: flex;
    gap: 6px;
    max-width: 100%;
}

.dp-legend-dot {
    flex: none;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: var(--feast-accent);
    margin-top: 0.38em;
}

.dp-legend-swatch {
    flex: none;
    width: 9px;
    height: 9px;
    border-radius: 3px;
    background-color: var(--fast-accent-soft);
    border: 1px solid var(--fast-accent-border);
    margin-top: 0.28em;
}

.dp-legend-day {
    font-weight: 600;
    font-variant-numeric: tabular-nums;
}

.feasts-tab {
    width: min(320px, 80vw);
}

.feasts-tab-year {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    margin-bottom: 8px;
}

.feasts-tab-year-label {
    font-family: 'Suez one';
    font-size: 1.15em;
    min-width: 4em;
    text-align: center;
}

.feasts-tab-list {
    position: relative;
    max-height: 330px;
    overflow-y: auto;
    overflow-x: hidden;
    display: flex;
    flex-direction: column;
    gap: 2px;
    scrollbar-width: thin;
}

.feast-row {
    display: flex;
    align-items: baseline;
    gap: 10px;
    padding: 7px 10px;
    border-radius: 8px;
    text-align: start;
    color: rgba(var(--v-theme-on-surface), 0.87);
    transition: background-color 0.15s;
}

.feast-row:hover,
.feast-row:focus-visible {
    background-color: rgba(var(--v-theme-on-surface), 0.07);
}

.feast-row-date {
    flex: none;
    width: 4.9em;
    white-space: nowrap;
    font-size: 0.78em;
    text-transform: uppercase;
    letter-spacing: 0.03em;
    color: rgba(var(--v-theme-on-surface), 0.6);
    font-variant-numeric: tabular-nums;
}

.feast-row-name {
    line-height: 1.3;
    padding-inline-end: 2px;
}

.feast-row--past {
    opacity: 0.55;
}

.feast-row--today {
    background-color: rgba(var(--v-theme-primary), 0.15);
}

.feasts-tab-empty {
    padding: 24px 8px;
    text-align: center;
    color: rgba(var(--v-theme-on-surface), 0.7);
}
</style>
