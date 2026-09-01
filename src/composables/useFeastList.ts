import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useFeasts } from '@/store/feasts';
import { useReadings } from '@/store/readings';
import { useMenu } from '@/store/menu';
import { getCopticMonth } from '@/helpers/copticMonth';

export interface FeastListItem {
    id: number;
    date: Date;
    name: string;
    description: string | null;
    isPast: boolean;
    isToday: boolean;
    // First feast on or after today (only meaningful for the current year)
    isNext: boolean;
}

export interface FastListItem {
    id: number;
    start: Date;
    end: Date;
    name: string;
    description: string | null;
    days: number;
    isPast: boolean;
    isCurrent: boolean;
}

export interface FeastMonthGroup {
    month: number;
    label: string;
    feasts: FeastListItem[];
}

const DAY_MS = 86400000;

export function formatCopticDate(date: Date) {
    const [day, month] = date
        .toLocaleDateString('fr-FR-u-ca-coptic', { day: 'numeric', month: 'numeric' })
        .split('/');
    return `${Number(day)} ${getCopticMonth(Number(month))}`;
}

export function formatDateRange(languageCode: string, start: Date, end: Date) {
    // formatRange is missing from the project's TS lib version but is
    // available in every runtime the app targets
    const format = new Intl.DateTimeFormat(languageCode, { day: 'numeric', month: 'short' }) as
        Intl.DateTimeFormat & { formatRange(start: Date, end: Date): string };
    return format.formatRange(start, end);
}

export function formatDayCount(languageCode: string, days: number) {
    return new Intl.NumberFormat(languageCode, { style: 'unit', unit: 'day', unitDisplay: 'long' }).format(days);
}

// Year-browsable feast and fast lists for the displayed year, shared by the
// calendar dialog tab and the feasts page.
export function useFeastList() {
    const feastsStore = useFeasts();
    const readings = useReadings();
    const menu = useMenu();
    const router = useRouter();
    const route = useRoute();

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const currentYear = today.getFullYear();
    const year = ref(currentYear);

    watch([year, () => readings.language], () => {
        feastsStore.ensureYear(year.value);
        // The fast running today may have started the previous year (Nativity)
        if (year.value === currentYear)
            feastsStore.ensureYear(currentYear - 1);
    }, { immediate: true });

    const loading = computed(() => feastsStore.isYearLoading(year.value));

    const feasts = computed<FeastListItem[]>(() => {
        const list = feastsStore.feastsForYear(year.value)
            .filter(f => !!f.name)
            .map(f => {
                const date = new Date(f.date);
                return {
                    id: f.id,
                    date,
                    name: f.name as string,
                    description: f.description ?? null,
                    isPast: date < today,
                    isToday: +date === +today,
                    isNext: false,
                };
            })
            .sort((a, b) => +a.date - +b.date);
        const next = list.find(f => !f.isPast);
        if (next)
            next.isNext = true;
        return list;
    });

    const nextFeast = computed(() => feasts.value.find(f => f.isNext) ?? null);

    function toFastItem(f: { id: number, start: string, end: string, name: string | null, description?: string | null }): FastListItem {
        const start = new Date(f.start);
        const end = new Date(f.end);
        return {
            id: f.id,
            start,
            end,
            name: f.name as string,
            description: f.description ?? null,
            days: Math.round((+end - +start) / DAY_MS) + 1,
            isPast: end < today,
            isCurrent: +start <= +today && +today <= +end,
        };
    }

    const fasts = computed<FastListItem[]>(() =>
        feastsStore.fastsForYear(year.value)
            .filter(f => !!f.name)
            .map(toFastItem)
            .sort((a, b) => +a.start - +b.start));

    // The fast running today, wherever it started (the Nativity fast crosses
    // the year boundary, so January falls under the previous year's entry)
    const currentFast = computed<FastListItem | null>(() => {
        for (const y of [currentYear, currentYear - 1]) {
            const found = feastsStore.fastsForYear(y).filter(f => !!f.name).map(toFastItem).find(f => f.isCurrent);
            if (found)
                return found;
        }
        return null;
    });

    const currentFastProgress = computed(() => {
        const fast = currentFast.value;
        if (!fast)
            return 0;
        const done = Math.round((+today - +fast.start) / DAY_MS) + 1;
        return Math.min(1, Math.max(0, done / fast.days));
    });

    const monthGroups = computed<FeastMonthGroup[]>(() => {
        const format = new Intl.DateTimeFormat(readings.languageCode, { month: 'long' });
        const groups: FeastMonthGroup[] = [];
        for (const feast of feasts.value) {
            const month = feast.date.getMonth();
            if (groups[groups.length - 1]?.month !== month)
                groups.push({ month, label: format.format(feast.date), feasts: [] });
            groups[groups.length - 1]!.feasts.push(feast);
        }
        return groups;
    });

    function formatFeastDate(feast: FeastListItem, options: Intl.DateTimeFormatOptions) {
        return new Intl.DateTimeFormat(readings.languageCode, options).format(feast.date);
    }

    // "in 14 days" / "tomorrow" / "today", pluralized per locale
    function formatDaysUntil(feast: FeastListItem) {
        const days = Math.round((+feast.date - +today) / DAY_MS);
        return new Intl.RelativeTimeFormat(readings.languageCode, { numeric: 'auto' }).format(days, 'day');
    }

    function formatFastRange(fast: FastListItem) {
        return formatDateRange(readings.languageCode, fast.start, fast.end);
    }

    function formatFastDuration(fast: FastListItem) {
        return formatDayCount(readings.languageCode, fast.days);
    }

    function copticDateOf(feast: FeastListItem) {
        return formatCopticDate(feast.date);
    }

    function goToDate(date: Date) {
        readings.date = new Date(date);
        readings.getReadings();
        menu.dateDialog = false;
        if (route.name !== 'home')
            router.push({ name: 'home', params: { lang: route.params.lang } });
    }

    // Open the day's readings for a feast: works from the dialog (closes it)
    // and from the feasts page (navigates back home)
    function openFeast(feast: FeastListItem) {
        goToDate(feast.date);
    }

    return {
        year, currentYear, loading, feasts, nextFeast, fasts, currentFast, currentFastProgress,
        monthGroups, formatFeastDate, formatDaysUntil, formatFastRange, formatFastDuration, copticDateOf, openFeast,
    };
}
