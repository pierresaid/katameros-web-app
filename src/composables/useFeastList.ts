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
    isPast: boolean;
    isToday: boolean;
    // First feast on or after today (only meaningful for the current year)
    isNext: boolean;
}

export interface FeastMonthGroup {
    month: number;
    label: string;
    feasts: FeastListItem[];
}

// Year-browsable feast list for the displayed year, shared by the
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

    watch([year, () => readings.language], () => { feastsStore.ensureYear(year.value) }, { immediate: true });

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

    function copticDateOf(feast: FeastListItem) {
        const [day, month] = feast.date
            .toLocaleDateString('fr-FR-u-ca-coptic', { day: 'numeric', month: 'numeric' })
            .split('/');
        return `${Number(day)} ${getCopticMonth(Number(month))}`;
    }

    // Open the day's readings for a feast: works from the dialog (closes it)
    // and from the feasts page (navigates back home)
    function openFeast(feast: FeastListItem) {
        readings.date = new Date(feast.date);
        readings.getReadings();
        menu.dateDialog = false;
        if (route.name !== 'home')
            router.push({ name: 'home', params: { lang: route.params.lang } });
    }

    return { year, currentYear, loading, feasts, nextFeast, monthGroups, formatFeastDate, copticDateOf, openFeast };
}
