import { computed } from '@vue/reactivity';
import { defineStore } from 'pinia'
import { ref, watch, watchEffect } from 'vue';
import LANGUAGES from '../consts/languages';
import formatDate from '../helpers/formatDate';
import { http } from '../services/http';
import { type Bible, type DayReading, type Section } from '../types/readings';
// import localForage from "localforage";
import { useStorage } from '@vueuse/core';

const today = new Date()

const LANGUAGE_LOCAL_STORAGE = "LANGUAGE_LOCAL_STORAGE";
const BIBLES_LOCAL_STORAGE = "LANGUAGE_LOCAL_STORAGE";

export const useReadings = defineStore('readings', () => {
    const date = ref(new Date(today.getFullYear(), today.getMonth(), today.getDate()));
    const sections = ref<Section[] | null>(null);
    const title = ref<string | null>(null);
    const bible = ref<Bible>()
    const bibleOriginalName = ref("")
    const bibles = ref<Bible[]>()
    const pickedBibles = useStorage<{ langId: number, bibleId: number }[]>("BIBLES_LOCAL_STORAGE", [])
    const periodInfo = ref<string | null>(null);
    const loading = ref(false);
    const language = useStorage<number>(LANGUAGE_LOCAL_STORAGE, 1);
    const langIsDefined = localStorage.getItem(LANGUAGE_LOCAL_STORAGE) !== null;
    const languageCode = computed(() => Object.values(LANGUAGES).find(l => l.id === language.value)?.code as string);
    const currentReading = ref<DayReading | null>(null);
    const panel = ref<number[]>([])
    const visibleSections = ref<number[]>([])
    const currentSectionIdx = computed(() => visibleSections.value[visibleSections.value.length - 1])
    const currentSectionAnimation = ref<"slide" | "slide-rev">("slide");

    const currentSection = computed(() => sections.value ? sections.value[currentSectionIdx.value] : null)
    const copticDate = computed(() => {
        const [day, month, year] = date.value
            .toLocaleDateString("fr-FR-u-ca-coptic", {
                month: "numeric",
                day: "numeric",
                year: "numeric",
            })
            .split("/");
        const copticDay = parseInt(day);
        const copticMonth = parseInt(month);
        const copticYear = parseInt(year.slice(0, 4));
        return [copticDay, copticMonth, copticYear];
    })

    deleteExpiredCache()

    watch(currentSection, (old: Section | null | undefined, newvalue: Section | null | undefined) => {
        if (old && newvalue && old.id > newvalue.id)
            currentSectionAnimation.value = 'slide-rev'
        else
            currentSectionAnimation.value = 'slide'
    })

    watch(date, () => {
        getReadings();
    })

    function openSection(id: number) {
        if (panel.value.includes(id)) {
            return;
        }
        panel.value.push(id);
    }

    async function getReadings() {
        const version = pickedBibles.value.find(b => b.langId === language.value)?.bibleId;

        sections.value = null;
        title.value = null;
        periodInfo.value = null;

        const formatedDate = formatDate(date.value);


        const params: { languageId: number, bibleId?: number } = { languageId: language.value };
        if (version) {
            params["bibleId"] = version;
        }
        const key = `${formatedDate}-${language.value}-${version}`;
        // const cached = await localForage.getItem<DayReading>(key);
        // if (cached) {
        //     setReading(cached);
        // }
        // else {
            loading.value = true;
            const res = await http.get<DayReading>(`/readings/gregorian/${formatedDate}`, params)
            // localForage.setItem(key, res);

            setReading(res);
        // }
        loading.value = false;
    }

    function deleteExpiredCache() {
        // const expirationDays = 7;
        // const expirationDate = new Date();
        // expirationDate.setDate(expirationDate.getDate() - expirationDays);
        // localForage.iterate((value: DayReading, key: string) => {
        //     const day = parseInt(key.split("-")[0]);
        //     const month = parseInt(key.split("-")[1]);
        //     const year = parseInt(key.split("-")[2]);
        //     const date = new Date(year, month - 1, day);
        //     if (date < expirationDate) {
        //         localForage.removeItem(key);
        //     }
        // });

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

    return { date, copticDate, sections, title, periodInfo, loading, language, bibleOriginalName, changeBible, getReadings, currentReading, currentSection, panel, visibleSections, currentSectionAnimation, openSection, changeLanguage, languageCode, langIsDefined, bible, bibles }
})