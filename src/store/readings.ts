import { computed } from '@vue/reactivity';
import { defineStore } from 'pinia'
import { ref, watch, watchEffect } from 'vue';
import LANGUAGES from '../consts/languages';
import formatDate from '../helpers/formatDate';
import { http } from '../services/http';
import { type Bible, type DayReading, type Section } from '../types/readings';
import { useStorage } from '@vueuse/core';
import localforage from 'localforage';

const today = new Date()

const LANGUAGE_LOCAL_STORAGE = "LANGUAGE_LOCAL_STORAGE";
const SECOND_LANGUAGE_LOCAL_STORAGE = "SECOND_LANGUAGE_LOCAL_STORAGE";

export const useReadings = defineStore('readings', () => {
    const date = ref(new Date(today.getFullYear(), today.getMonth(), today.getDate()));
    const sections = ref<Section[] | null>(null);
    const title = ref<string | null>(null);
    const preloading = ref(false);
    const bible = ref<Bible>()
    const error = ref(true);
    const bibleOriginalName = ref("")
    const bibles = ref<Bible[]>()
    const pickedBibles = useStorage<{ langId: number, bibleId: number }[]>("BIBLES_LOCAL_STORAGE", [])
    const periodInfo = ref<string | null>(null);
    const loading = ref(false);
    const langIsDefined = localStorage.getItem(LANGUAGE_LOCAL_STORAGE) !== null;
    const language = useStorage<number>(LANGUAGE_LOCAL_STORAGE, 1);
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

    const latestCacheVersion = 6;
    const disableCache = false;
    const currentCacheVersion = useStorage<number>("CURRENT_CACHE_VERSION", 0);

    async function getReadings() {
        fetchSecondLanguageReadings()
        
        const version = pickedBibles.value.find(b => b.langId === language.value)?.bibleId;

        sections.value = null;
        title.value = null;
        periodInfo.value = null;
        error.value = false;

        const formatedDate = formatDate(date.value);


        const params: { languageId: number, bibleId?: number } = { languageId: language.value };
        if (version) {
            params["bibleId"] = version;
        }
        const key = `${formatedDate}-${language.value}`;
        const cached = await localforage.getItem<DayReading>(key);
        if (!disableCache && cached && currentCacheVersion.value === latestCacheVersion) {
            setReading(cached);
        }
        else {
            loading.value = true;

            if (
                !disableCache &&
                date.value >= new Date(2025, 10, 4) && // November 4, 2025
                date.value <= new Date(2026, 10, 4)    // November 4, 2026
            ) {
                preloading.value = true;
                fetchFromApi(formatedDate, params)
                    .then(res => { // We don't await here to parallelize fetching and caching
                        setReading(res);
                        loading.value = false;
                    })
                    .catch(e => {
                        error.value = true;
                    });
                // bust cache
                await localforage.clear();
                await loadCacheData()
                const cached = await localforage.getItem<DayReading>(key);
                currentCacheVersion.value = latestCacheVersion;
                if (cached) {
                    setReading(cached);
                }
                preloading.value = false;
            }
            else {
                try {
                    const res = await fetchFromApi(formatedDate, params);
                    setReading(res);
                } catch (e) {
                    error.value = true;
                }
            }
        }
        loading.value = false;
    }

    const secondSections = ref<Section[] | null>(null);
    const secondBible = ref<Bible | null>(null);
    const secondBibles = ref<Bible[] | null>(null);
    const secondLanguage = useStorage<number | null>(SECOND_LANGUAGE_LOCAL_STORAGE, null);
    const secondLanguageDisplaySetting = useStorage<"side-by-side" | "line-by-line">("SECOND_LANGUAGE_SETTING", "side-by-side");

    async function fetchSecondLanguageReadings() {
        if (!secondLanguage.value) {
            secondSections.value = null;
            secondBible.value = null;
            secondBibles.value = null;
            return;
        }
        const key = `${formatDate(date.value)}-${secondLanguage.value}`;
        const cached = await localforage.getItem<DayReading>(key);
        if (cached) {
            secondSections.value = cached.sections;
            secondBible.value = cached.bible;
            secondBibles.value = cached.bibles;
        }
        else {
            try {
                const params: { languageId: number } = { languageId: secondLanguage.value };
                const res = await fetchFromApi(formatDate(date.value), params);
                secondSections.value = res.sections;
                secondBible.value = res.bible;
                secondBibles.value = res.bibles;
            } catch (e) {
                secondSections.value = null;
                secondBible.value = null;
                secondBibles.value = null;
            }
        }
    }


    async function fetchFromApi(formatedDate: string, params: { languageId: number, bibleId?: number }) {
        const res = await http.get<DayReading>(`/readings/gregorian/${formatedDate}`, params)
        return res;
    }

    async function loadCacheData() {
        try {
            const response = await fetch('https://katameros.blob.core.windows.net/cache/current.json');
            const data = await response.json();

            const entries = Object.entries(data);
            for (const [enkey, value] of entries) {
                const [day, month, year, lang] = enkey.split("-");
                const key = `${day}-${month}-${year}-${lang}`;
                await localforage.setItem(key, value);
            }
        } catch (error) {
        }
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
        language.value = lang.id;
        getReadings();
    }

    return { date, copticDate, sections, title, periodInfo, loading, language, error, bibleOriginalName, changeBible, getReadings, currentSection, panel, visibleSections, currentSectionAnimation, openSection, changeLanguage, languageCode, preloading, langIsDefined, bible, bibles, secondLanguage, secondSections, fetchSecondLanguageReadings, secondLanguageDisplaySetting, secondBible, secondBibles }
})