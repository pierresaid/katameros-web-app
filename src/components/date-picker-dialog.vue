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

const readings = useReadings();

const menu = useMenu()
const tab = ref('date')

const feasts = useFeasts();
const viewedYear = ref(readings.date.getFullYear());

watch([() => menu.dateDialog, () => readings.language], ([open]) => {
    if (open)
        feasts.ensureYearsAround(viewedYear.value);
})

function onMonthYearUpdate({ year }: { instance: number, month: number, year: number }) {
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
            const existing = byDay.get(day);
            if (existing)
                existing.tooltip?.push({ text: feast.name });
            else
                byDay.set(day, { date: new Date(feast.date), type: 'dot', tooltip: [{ text: feast.name }] });
        }
    }
    return [...byDay.values()];
})

// Soft background wash on every day inside a fasting period
const highlighted = computed(() => {
    const dates: Date[] = [];
    for (const year of [viewedYear.value - 1, viewedYear.value, viewedYear.value + 1]) {
        for (const fast of feasts.fastsForYear(year)) {
            const end = new Date(fast.end);
            for (let day = new Date(fast.start); day <= end; day.setDate(day.getDate() + 1))
                dates.push(new Date(day));
        }
    }
    return { dates };
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
    const next = feastListEl.value?.querySelector('.feast-row--next');
    if (next)
        next.scrollIntoView({ block: 'center' });
})

const copticDate = ref<[number, number, number]>([0, 0, 0])
function onUpdate(date: [number, number, number]) {
    copticDate.value = date
}

function onSave() {
    // The coptic picker emits its value on mount, so only apply it when the
    // user actually confirmed from that tab
    if (tab.value !== 'coptic-date')
        return;
    const ds = convertCopticToGregorian(`${copticDate.value[1]}/${copticDate.value[0]}/${copticDate.value[2]}`)
    readings.date = new Date(ds as any)
    readings.getReadings();
}

</script>


<template>
    <v-dialog v-model="menu.dateDialog" :persistent="false" width="auto">
        <v-card>
            <v-tabs v-model="tab" color="primary">
                <v-tab value="date">{{ $t("date") }}</v-tab>
                <v-tab value="coptic-date">{{ $t("coptic-date") }}</v-tab>
                <v-tab value="feasts">{{ $t("feasts.tab") }}</v-tab>
            </v-tabs>
            <v-divider />
            <v-card-text>
                <v-window v-model="tab" :touch="false">
                    <v-window-item value="date">
                        <Datepicker v-model="readings.date" @update:modelValue="readings.getReadings(); $emit('update:model-value', false)"
                            inline :locale="readings.languageCode == 'ar' ? 'en' : readings.languageCode" auto-apply
                            :enable-time-picker="false" :dark="menu.theme === 'dark'"
                            :markers="markers" :highlight="highlighted" @update-month-year="onMonthYearUpdate">
                        </Datepicker>
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
                <v-btn color="primary" variant="tonal" @click="() => { onSave(); $emit('update:model-value', false) }">
                    Ok
                </v-btn>
                <v-btn variant="plain" @click="$emit('update:model-value', false)">
                    {{ $t('cancel') }}
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<style>
.dp__theme_light {
    --dp-primary-color: var(--primary-color);
    --dp-marker-color: var(--feast-accent);
    --dp-highlight-color: var(--fast-accent-soft);
}

.dp__theme_dark {
    --dp-primary-color: var(--primary-color);
    --dp-marker-color: var(--feast-accent);
    --dp-highlight-color: var(--fast-accent-soft);
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
    max-height: 330px;
    overflow-y: auto;
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
    width: 4.2em;
    font-size: 0.78em;
    text-transform: uppercase;
    letter-spacing: 0.03em;
    color: rgba(var(--v-theme-on-surface), 0.6);
    font-variant-numeric: tabular-nums;
}

.feast-row-name {
    line-height: 1.3;
}

.feast-row--past {
    opacity: 0.55;
}

.feast-row--next {
    background-color: var(--feast-accent-soft);
}

.feast-row--next .feast-row-name::before {
    content: '';
    display: inline-block;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: var(--feast-accent);
    margin-inline-end: 6px;
    vertical-align: 2px;
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
