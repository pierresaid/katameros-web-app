import { computed } from '@vue/reactivity';
import { defineStore, skipHydrate } from 'pinia'
import { ref, watch, watchEffect } from 'vue';
import LANGUAGES from '../consts/languages';
import formatDate from '../helpers/formatDate';
import { http, HttpStatusError } from '../services/http';
import { type Bible, type DayReading, type Section } from '../types/readings';
import { useStorage } from '@vueuse/core';
import localforage from 'localforage';
import { loadSynaxCache } from '../services/synaxCache';
import { hydrating } from '../helpers/hydrating';

export interface CacheVersionInfo {
    CacheVersion: number;
    CacheDataUrl: string;
    CacheBegin: string;
    CacheEnd: string;
    // The synaxarium stories: a version only, they do not depend on dates.
    // Absent until the first synaxarium cache is published.
    SynaxVersion?: number;
    SynaxDataUrl?: string;
}

// The Cloudflare worker that publishes the cache versions ("katemeros" is its real name)
export const CACHE_VERSION_URL = 'https://katemeros-cache-version.psaid.workers.dev/';

// A saved reading's key: its day and its language ("15-11-2026-1")
const READING_KEY = /^\d{2}-\d{2}-\d{4}-\d+$/;
const HOUR = 60 * 60 * 1000;
// After a failed download of the readings file, how long before it is tried
// again by itself in the same visit (a new start, or the connection coming
// back, tries at once)
const RETRY_DOWNLOAD_AFTER = 10 * 60 * 1000;
// From the second failure in a row, the wait holds across starts and grows:
// a device that cannot take the file must not download it again and again
const RETRY_WAITS = [0, HOUR, 6 * HOUR, 24 * HOUR, 72 * HOUR];
// When the device had no room for the file, trying again soon would only download it again
const RETRY_STORAGE_AFTER = 24 * HOUR;
// A phone app stays open for days: when it comes back to the front after this
// long, it asks again whether a new file was published
const ASK_VERSION_AGAIN_AFTER = HOUR;

function isCacheVersionInfo(info: unknown): info is CacheVersionInfo {
    const value = info as CacheVersionInfo | null;
    return !!value && Number.isFinite(value.CacheVersion) && value.CacheVersion > 0
        && typeof value.CacheDataUrl === 'string' && value.CacheDataUrl !== '';
}

// What bringing the saved readings up to date ended with
type SavedReadings = 'current' | 'updated' | 'failed';

const today = new Date()

const LANGUAGE_LOCAL_STORAGE = "LANGUAGE_LOCAL_STORAGE";
const SECOND_LANGUAGE_LOCAL_STORAGE = "SECOND_LANGUAGE_LOCAL_STORAGE";

export const useReadings = defineStore('readings', () => {
    const date = skipHydrate(ref(new Date(today.getFullYear(), today.getMonth(), today.getDate())));
    const sections = ref<Section[] | null>(null);
    const title = ref<string | null>(null);
    const preloading = ref(false);
    const bible = ref<Bible>()
    const error = ref(false);
    // The day could not be shown because the device has no connection (said
    // apart from a failure of the service: the reader can do something about it)
    const noConnection = ref(false);
    const bibleOriginalName = ref("")
    const bibles = ref<Bible[]>()
    // The saved choices shown on a page are read once a prerendered page is in
    // place (initOnMounted, see helpers/hydrating.ts): until then they are the build's
    const pickedBibles = skipHydrate(useStorage<{ langId: number, bibleId: number }[]>("BIBLES_LOCAL_STORAGE", [], undefined, { initOnMounted: hydrating }))
    const periodInfo = ref<string | null>(null);
    const loading = ref(true);
    // True only while the primary reading is being fetched from the API.
    // Drives the skeleton so it never shows for instant cache reads.
    const apiLoading = ref(false);
    const language = skipHydrate(useStorage<number>(LANGUAGE_LOCAL_STORAGE, 1, undefined, { writeDefaults: false, initOnMounted: hydrating }));
    const languageCode = computed(() => Object.values(LANGUAGES).find(l => l.id === language.value)?.code as string);
    const panel = ref<number[]>([])
    const visibleSections = ref<number[]>([])
    const currentSectionIdx = computed(() => visibleSections.value[visibleSections.value.length - 1])
    const currentSectionAnimation = ref<"slide" | "slide-rev">("slide");


    const currentSection = computed(() => sections.value && currentSectionIdx.value !== undefined ? sections.value[currentSectionIdx.value] : null)
    const copticDate = computed(() => {
        const [day, month, year] = date.value
            .toLocaleDateString("fr-FR-u-ca-coptic", {
                month: "numeric",
                day: "numeric",
                year: "numeric",
            })
            .split("/");
        const copticDay = parseInt(day ?? "0");
        const copticMonth = parseInt(month ?? "0");
        const copticYear = parseInt(year?.slice(0, 4) ?? "0");
        return [copticDay, copticMonth, copticYear];
    })

    watch(currentSection, (old: Section | null | undefined, newvalue: Section | null | undefined) => {
        if (old && newvalue && old.id > newvalue.id)
            currentSectionAnimation.value = 'slide-rev'
        else
            currentSectionAnimation.value = 'slide'
    })


    function openSection(id: number) {
        if (panel.value.includes(id)) {
            return;
        }
        panel.value.push(id);
    }

    const disableCache = import.meta.env.DEV;
    // The version of the published readings file that is saved whole on this device
    const currentCacheVersion = skipHydrate(useStorage<number>("CURRENT_CACHE_VERSION", 0));
    const cacheVersionInfo = skipHydrate(useStorage<CacheVersionInfo | null>("CACHE_VERSION_INFO", { CacheVersion: 0, CacheDataUrl: "", CacheBegin: "", CacheEnd: "" }));
    // Earlier versions of the app (before 5.0) recorded a version even when its
    // download had failed, which left nothing saved: what this device holds is
    // checked once. This check can go when those versions are no longer in use.
    const savedReadingsChecked = useStorage<boolean>("SAVED_READINGS_CHECKED", false);
    // The failed downloads of a file in a row, and when the next try may start
    const savedReadingsRetry = useStorage<{ version: number, failures: number, notBefore: number }>("SAVED_READINGS_RETRY", { version: 0, failures: 0, notBefore: 0 });
    let cacheVersionRequest: Promise<CacheVersionInfo | null> | null = null;
    let cacheVersionReceivedAt = 0;
    // The offline downloads (every reading of the coming months, then every
    // synaxarium story) start where the readings are read: App.vue allows
    // them there. Elsewhere only the day shown is asked for.
    const offlineDownloads = ref(false);
    let requested = false;

    // Asked once per start (and again when the app comes back to the front
    // after a while), then shared by the readings and the synaxarium stories.
    // An answer that is not a version (an error page) never replaces the last one.
    function fetchCacheVersionInfo(): Promise<CacheVersionInfo | null> {
        cacheVersionRequest ??= (async () => {
            try {
                const response = await fetch(CACHE_VERSION_URL);
                const info = response.ok ? await response.json() : null;
                if (isCacheVersionInfo(info)) {
                    cacheVersionInfo.value = info;
                    cacheVersionReceivedAt = Date.now();
                }
            } catch {
                // offline: keep the last values received
            }
            return cacheVersionInfo.value;
        })();
        return cacheVersionRequest;
    }

    // Only the latest request may show its readings: an older one (the
    // previous day, language or Bible) can be answered last
    let latestRequest = 0;

    async function getReadings() {
        const request = ++latestRequest;
        requested = true;
        fetchSecondLanguageReadings()

        const version = pickedBibles.value.find(b => b.langId === language.value)?.bibleId;

        sections.value = null;
        title.value = null;
        periodInfo.value = null;
        error.value = false;
        noConnection.value = false;

        const formatedDate = formatDate(date.value);


        const params: { languageId: number, bibleId?: number } = { languageId: language.value };
        if (version) {
            params["bibleId"] = version;
        }
        const key = `${formatedDate}-${language.value}`;

        // Read what is saved first (fast IndexedDB read). Knowing whether we
        // already have something displayable lets us reserve the skeleton for the
        // cases where we genuinely have to hit the API.
        const cached = await readSavedReading(key);
        if (request !== latestRequest)
            return;
        const cacheHasMatchingBible = !version || cached?.bible?.id === version;

        // Nothing displayable saved -> an API round-trip is unavoidable, so show
        // the skeleton now instead of waiting on the cache-version network call.
        if (!cached || !cacheHasMatchingBible) {
            apiLoading.value = true;
        }

        const cacheInfo = await fetchCacheVersionInfo();
        if (request !== latestRequest)
            return;
        const savedIsCurrent = isCacheVersionInfo(cacheInfo) && currentCacheVersion.value === cacheInfo.CacheVersion;

        // Where the readings are read, the saved ones are brought up to date in
        // the background: the day shown never waits for the file
        const refresh = !disableCache && offlineDownloads.value ? refreshSavedReadings(cacheInfo) : null;

        // The API could not be reached and the day shown is the saved copy
        let savedCopyShown = false;

        // The saved copy is the published one, in the Bible asked for
        if (cached && savedIsCurrent && cacheHasMatchingBible) {
            setReading(cached);
            apiLoading.value = false;
            loading.value = false;
        }
        // Nothing saved for this day, a newer file was published, or another
        // Bible was chosen: the API answers. What is saved shows meanwhile.
        else {
            loading.value = true;
            if (cached && cacheHasMatchingBible) {
                setReading(cached);
                apiLoading.value = false;
            }
            try {
                const res = await fetchFromApi(formatedDate, params);
                if (request !== latestRequest)
                    return;
                setReading(res);
                // Kept in the language's usual Bible only, like the published
                // file: no Bible was asked for, or the language has only one
                if (!version || res.bibles?.length === 1)
                    saveReading(key, res);
            } catch (e) {
                if (request !== latestRequest)
                    return;
                // No connection or no answer: a saved copy, even an older one or
                // one in the language's usual Bible, is better than an error
                if (cached) {
                    setReading(cached);
                    savedCopyShown = true;
                }
                else {
                    // An error answered by the API is not a missing connection
                    const disconnected = !(e instanceof HttpStatusError) && await isDisconnected();
                    if (request !== latestRequest)
                        return;
                    noConnection.value = disconnected;
                    error.value = true;
                }
            }
            apiLoading.value = false;
            loading.value = false;
        }

        refresh?.then((saved) => {
            // The file arrived while this day could not be shown, or was shown
            // from the older saved copy: read it in the file
            if (saved === 'updated' && request === latestRequest && (error.value || savedCopyShown))
                getReadings();
            // The synaxarium stories download last, once the readings are
            // saved, so they never slow them down
            if (cacheInfo)
                loadSynaxCache(cacheInfo);
        });
    }

    // Called where the readings are read (see App.vue). When the day's
    // readings were already asked for without the downloads (the visitor came
    // by another page), they start now; otherwise getReadings starts them.
    async function startOfflineDownloads() {
        if (offlineDownloads.value)
            return;
        offlineDownloads.value = true;
        if (disableCache || !requested)
            return;
        const cacheInfo = await fetchCacheVersionInfo();
        await refreshSavedReadings(cacheInfo);
        if (cacheInfo)
            loadSynaxCache(cacheInfo);
    }

    let refreshRequest: Promise<SavedReadings> | null = null;
    let downloadFailedAt = 0;

    /**
     * Brings the saved readings to the published file, when it is not the one
     * saved. The file is downloaded and checked first, what is saved is only
     * touched once it has arrived whole, and the version is only recorded once
     * everything is written: a failure at any point leaves the device with the
     * readings it had, and the file is tried again later.
     */
    function refreshSavedReadings(info: CacheVersionInfo | null, reconnected = false): Promise<SavedReadings> {
        if (disableCache || !isCacheVersionInfo(info))
            return Promise.resolve('failed');
        refreshRequest ??= (async (): Promise<SavedReadings> => {
            let tried = false;
            try {
                await checkSavedReadingsOnce(info);
                if (currentCacheVersion.value === info.CacheVersion)
                    return 'current';
                const now = Date.now();
                const retry = savedReadingsRetry.value;
                const waiting = retry.version === info.CacheVersion && now < retry.notBefore;
                if (waiting || (!reconnected && now - downloadFailedAt < RETRY_DOWNLOAD_AFTER))
                    return 'failed';
                tried = true;
                preloading.value = true;
                const readings = await downloadReadings(info.CacheDataUrl);
                await replaceSavedReadings(readings);
                currentCacheVersion.value = info.CacheVersion;
                savedReadingsChecked.value = true;
                savedReadingsRetry.value = { version: info.CacheVersion, failures: 0, notBefore: 0 };
                return 'updated';
            } catch (e) {
                if (tried)
                    noteFailedDownload(info.CacheVersion, (e as DOMException | null)?.name === 'QuotaExceededError');
                return 'failed';
            } finally {
                preloading.value = false;
                refreshRequest = null;
            }
        })();
        return refreshRequest;
    }

    // A new start tries again at once after a first failure. From the second
    // failure of the same file in a row the wait grows (one hour, up to three
    // days), and a device with no room waits a day at least.
    function noteFailedDownload(version: number, noRoom: boolean) {
        downloadFailedAt = Date.now();
        const before = savedReadingsRetry.value;
        const failures = (before.version === version ? before.failures : 0) + 1;
        const wait = Math.max(RETRY_WAITS[Math.min(failures, RETRY_WAITS.length) - 1] ?? 0, noRoom ? RETRY_STORAGE_AFTER : 0);
        savedReadingsRetry.value = { version, failures, notBefore: downloadFailedAt + wait };
    }

    // Anything else than a file of readings (an error page, a cut download)
    // throws here, before the saved readings are touched
    async function downloadReadings(url: string): Promise<Record<string, DayReading>> {
        const response = await fetch(url);
        if (!response.ok)
            throw new Error(`Readings file: HTTP ${response.status}`);
        const readings = await response.json();
        const keys = readings && typeof readings === 'object' ? Object.keys(readings) : [];
        if (!keys.length || !keys.every(key => READING_KEY.test(key) && Array.isArray(readings[key]?.sections)))
            throw new Error('Readings file: unexpected content');
        return readings;
    }

    // The new days are written over the saved ones, then the days saved
    // before that the file no longer has are removed: stopped halfway, the
    // device still has a reading for every day it had
    async function replaceSavedReadings(readings: Record<string, DayReading>) {
        const savedBefore = await localforage.keys();
        for (const [key, reading] of Object.entries(readings))
            await localforage.setItem(key, reading);
        for (const key of savedBefore) {
            if (!(key in readings))
                await localforage.removeItem(key);
        }
    }

    async function checkSavedReadingsOnce(info: CacheVersionInfo) {
        if (savedReadingsChecked.value)
            return;
        if (currentCacheVersion.value === info.CacheVersion && !await savedReadingsLookWhole())
            currentCacheVersion.value = 0;
        savedReadingsChecked.value = true;
    }

    // A whole file gives every language the same days. A failed download left
    // nothing, a write stopped halfway left the first languages only.
    async function savedReadingsLookWhole() {
        const days = new Map<string, number>();
        for (const key of await localforage.keys()) {
            if (!READING_KEY.test(key))
                continue;
            const languageId = key.slice(key.lastIndexOf('-') + 1);
            days.set(languageId, (days.get(languageId) ?? 0) + 1);
        }
        const perLanguage = Object.values(LANGUAGES).map(l => days.get(String(l.id)) ?? 0);
        const most = Math.max(...perLanguage);
        return most > 0 && Math.min(...perLanguage) >= most * 0.9;
    }

    // The browser knows when no network is connected. When one is (a Wi-Fi
    // without internet, or the API alone failing), the version beacon, which
    // is on another host than the API, tells which of the two it is.
    async function isDisconnected() {
        if (navigator.onLine === false)
            return true;
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 4000);
        try {
            await fetch(CACHE_VERSION_URL, { cache: 'no-store', signal: controller.signal });
            return false;
        } catch {
            return true;
        } finally {
            clearTimeout(timer);
        }
    }

    async function readSavedReading(key: string) {
        if (disableCache)
            return null;
        try {
            return await localforage.getItem<DayReading>(key);
        } catch {
            // No storage on this device (some private modes): the API answers
            return null;
        }
    }

    // A day answered by the API is kept too: it can be read again without a
    // connection, even on a device the whole file never reached
    function saveReading(key: string, reading: DayReading) {
        if (!disableCache)
            localforage.setItem(key, reading).catch(() => { });
    }

    // A download can fail, and a phone app stays open for days: when the
    // connection or the app comes back, the published file is looked at again
    function lookAtPublishedFileAgain(reconnected: boolean) {
        if (disableCache || !offlineDownloads.value || !requested)
            return;
        if (Date.now() - cacheVersionReceivedAt > ASK_VERSION_AGAIN_AFTER)
            cacheVersionRequest = null;
        fetchCacheVersionInfo().then(async (cacheInfo) => {
            const refresh = refreshSavedReadings(cacheInfo, reconnected);
            // The day could not be shown: ask for it again now
            if (error.value && navigator.onLine !== false)
                getReadings();
            await refresh;
            if (cacheInfo)
                loadSynaxCache(cacheInfo);
        });
    }
    if (!import.meta.env.SSR) {
        window.addEventListener('online', () => lookAtPublishedFileAgain(true));
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible')
                lookAtPublishedFileAgain(false);
        });
    }

    // The synaxarium list downloads the stories when it opens, for the search
    // in their text and offline reading, without the readings
    async function downloadStories() {
        if (disableCache)
            return;
        const cacheInfo = await fetchCacheVersionInfo();
        if (cacheInfo && !preloading.value)
            loadSynaxCache(cacheInfo);
    }

    const secondSections = ref<Section[] | null>(null);
    const secondBible = ref<Bible | null>(null);
    const secondBibles = ref<Bible[] | null>(null);
    // Read back as a number: with a null default, useStorage would return the
    // saved string ("3"), which no language id equals after a reload
    const secondLanguage = skipHydrate(useStorage<number | null>(SECOND_LANGUAGE_LOCAL_STORAGE, null, undefined, {
        // A language that is no longer offered (Thai) reads as none
        serializer: { read: v => Object.values(LANGUAGES).find(l => l.id === Number(v))?.id ?? null, write: v => String(v) },
        initOnMounted: hydrating,
    }));
    const secondLanguageDisplaySetting = skipHydrate(useStorage<"side-by-side" | "line-by-line">("SETTING_READINGS_SECOND_LANGUAGE", "side-by-side", undefined, { initOnMounted: hydrating }));

    // Only the latest request may set the second language's readings: an older
    // one (previous language or date) can answer last when it hits the API
    let secondRequest = 0;

    async function fetchSecondLanguageReadings() {
        const request = ++secondRequest;
        const languageId = secondLanguage.value;
        if (!languageId) {
            secondSections.value = null;
            secondBible.value = null;
            secondBibles.value = null;
            return;
        }
        const formatedDate = formatDate(date.value);
        const key = `${formatedDate}-${languageId}`;
        const cached = await readSavedReading(key);
        if (request !== secondRequest)
            return;
        if (cached) {
            secondSections.value = cached.sections;
            secondBible.value = cached.bible;
            secondBibles.value = cached.bibles;
        }
        else {
            try {
                const params: { languageId: number } = { languageId };
                const res = await fetchFromApi(formatedDate, params);
                saveReading(key, res);
                if (request !== secondRequest)
                    return;
                secondSections.value = res.sections;
                secondBible.value = res.bible;
                secondBibles.value = res.bibles;
            } catch (e) {
                if (request !== secondRequest)
                    return;
                secondSections.value = null;
                secondBible.value = null;
                secondBibles.value = null;
            }
        }
    }

    async function setSecondLanguage(id: number | null) {
        secondLanguage.value = id;
        await fetchSecondLanguageReadings();
    }


    async function fetchFromApi(formatedDate: string, params: { languageId: number, bibleId?: number }) {
        const res = await http.get<DayReading>(`/readings/gregorian/${formatedDate}`, params)
        return res;
    }

    function setReading(reading: DayReading) {
        bible.value = reading.bible;
        bibleOriginalName.value = reading.bible.name;
        bibles.value = reading.bibles;
        periodInfo.value = reading.periodInfo;
        sections.value = reading.sections;
        title.value = reading.title;
    }

    function changeBible(id: number) {
        if (bibles.value?.findIndex(b => b.id === id) !== -1) {
            const version = pickedBibles.value.find(b => b.langId === language.value);
            if (version?.bibleId === id)
                return;
            if (version) {
                version.bibleId = id;
            } else {
                pickedBibles.value.push({ langId: language.value, bibleId: id });
            }
            getReadings();
        }
    }

    function changeLanguage(id: number) {
        const lang = Object.values(LANGUAGES).find(x => x.id === id);
        if (!lang)
            return;
        // Swap languages if switching to the current secondary language
        if (secondLanguage.value == id) {
            secondLanguage.value = language.value;
        }
        language.value = lang.id;
        getReadings();
    }

    return { date, copticDate, sections, title, periodInfo, loading, apiLoading, language, error, noConnection, bibleOriginalName, changeBible, getReadings, currentSection, panel, visibleSections, currentSectionAnimation, openSection, changeLanguage, languageCode, preloading, bible, bibles, secondLanguage, secondSections, fetchSecondLanguageReadings, setSecondLanguage, secondLanguageDisplaySetting, secondBible, secondBibles, fetchCacheVersionInfo, startOfflineDownloads, downloadStories }
})