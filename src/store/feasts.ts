import { defineStore } from 'pinia';
import { ref } from 'vue';
import localforage from 'localforage';
import { http } from '../services/http';
import { useReadings } from './readings';
import type { FastPeriod, FeastDate } from '@/types/feasts';

// Separate localforage instance so the readings cache reload
// (localforage.clear() on version bump) does not wipe the feasts.
const feastsCache = localforage.createInstance({ name: 'katameros-feasts' });

export const useFeasts = defineStore('feasts', () => {
    const readings = useReadings();

    // Feast/fast lists keyed by `${year}-${languageId}`
    const loaded = ref<Record<string, FeastDate[]>>({});
    const loadedFasts = ref<Record<string, FastPeriod[]>>({});
    const inflight = new Map<string, Promise<void>>();
    const loadingKeys = ref<Record<string, boolean>>({});

    function feastsForYear(year: number): FeastDate[] {
        return loaded.value[`${year}-${readings.language}`] ?? [];
    }

    function fastsForYear(year: number): FastPeriod[] {
        return loadedFasts.value[`${year}-${readings.language}`] ?? [];
    }

    function isYearLoading(year: number): boolean {
        return !!loadingKeys.value[`${year}-${readings.language}`];
    }

    // Load a year's feasts and fasts for the current language: cached copies
    // first for offline use, then revalidate from the API in the same call.
    function ensureYear(year: number): Promise<void> {
        if (import.meta.env.SSR)
            return Promise.resolve();
        const languageId = readings.language;
        const key = `${year}-${languageId}`;
        if (loaded.value[key] && loadedFasts.value[key])
            return Promise.resolve();
        const pending = inflight.get(key);
        if (pending)
            return pending;

        loadingKeys.value[key] = true;
        const load = (async () => {
            try {
                const [cachedFeasts, cachedFasts] = await Promise.all([
                    feastsCache.getItem<FeastDate[]>(key),
                    feastsCache.getItem<FastPeriod[]>(`fasts-${key}`),
                ]);
                if (cachedFeasts?.length && !loaded.value[key])
                    loaded.value[key] = cachedFeasts;
                if (cachedFasts?.length && !loadedFasts.value[key])
                    loadedFasts.value[key] = cachedFasts;
            } catch { }
            await Promise.all([
                (async () => {
                    try {
                        const fresh = await http.get<FeastDate[]>(`/feasts/${year}/${languageId}`);
                        if (fresh?.length) {
                            loaded.value[key] = fresh;
                            await feastsCache.setItem(key, fresh);
                        }
                    } catch {
                        // Offline or API error - keep whatever the cache had
                    }
                })(),
                (async () => {
                    try {
                        const fresh = await http.get<FastPeriod[]>(`/fasts/${year}/${languageId}`);
                        if (fresh?.length) {
                            loadedFasts.value[key] = fresh;
                            await feastsCache.setItem(`fasts-${key}`, fresh);
                        }
                    } catch {
                        // Older API without /fasts, offline - keep cache if any
                    }
                })(),
            ]);
            inflight.delete(key);
            delete loadingKeys.value[key];
        })();
        inflight.set(key, load);
        return load;
    }

    // The calendar grid shows trailing days of adjacent months, and users
    // navigate across year boundaries - keep the surrounding years ready.
    function ensureYearsAround(year: number) {
        ensureYear(year - 1);
        ensureYear(year);
        ensureYear(year + 1);
    }

    return { feastsForYear, fastsForYear, isYearLoading, ensureYear, ensureYearsAround };
});
