import { nextTick, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useReadings } from '@/store/readings';
import { useSynaxarium } from '@/store/synaxarium';
import { convertCopticToGregorian } from '@/helpers/convertCopticToGregorian';
import { scrollToReading, scrollToSubSection } from '@/helpers/scrollTo';
import type { SubSection } from '@/types/readings';

/** The day of a story: from the API answer, or from the list while it loads */
export interface StoryTarget { Day: number; Month: number; StoryId: number; Title: string }

// The static synaxarium JSON and the API titles can differ by invisible
// characters (non-breaking spaces, curly apostrophes) or casing: normalize
// both sides before comparing.
const normalizeTitle = (title: unknown): string => String(title ?? '')
  .normalize('NFC')
  .replace(/[‘’ʼ]/g, "'")
  .replace(/[“”]/g, '"')
  .replace(/[​-‍﻿]/g, '')
  .replace(/\s+/g, ' ')
  .trim()
  .replace(/\.+$/, '')
  .toLowerCase();

/** Opens the readings of a story's day, scrolled to the story. */
export function useGoToStoryDay() {
  const readings = useReadings();
  const synaxStore = useSynaxarium();
  const router = useRouter();
  const route = useRoute();
  const goingToDay = ref(false);

  const findReadingIdx = (subSection: SubSection, entry: StoryTarget): number => {
    // 1. Exact title match
    let idx = subSection.readings.findIndex(r => r.title === entry.Title);
    if (idx !== -1) return idx;

    // 2. Normalized title match
    const target = normalizeTitle(entry.Title);
    idx = subSection.readings.findIndex(r => normalizeTitle(r.title) === target);
    if (idx !== -1) return idx;

    // 3. Positional match: the static list and the API stories of a day are in
    // the same order, so when both have the same count, entry k is reading k.
    const dayEntries = synaxStore.entries.filter(e => e.Day === entry.Day && e.Month === entry.Month);
    if (dayEntries.length === subSection.readings.length) {
      const pos = dayEntries.findIndex(e => e.Title === entry.Title);
      if (pos !== -1) return pos;
    }

    return -1;
  };

  const goToStoryDay = async (entry: StoryTarget) => {
    // Convert the Coptic date of the current Coptic year to Gregorian (MM/DD/YYYY).
    // 6 Nasie only exists in Coptic leap years: then use the next year that has it.
    const currentCopticYear = readings.copticDate[2] ?? 0;
    let gregorianDateStr: unknown = false;
    for (let year = currentCopticYear; year < currentCopticYear + 4 && !gregorianDateStr; year++)
      gregorianDateStr = convertCopticToGregorian(`${entry.Month}/${entry.Day}/${year}`);

    if (gregorianDateStr && typeof gregorianDateStr === 'string') {
      // Parse the gregorian date string (MM/DD/YYYY)
      const parts = gregorianDateStr.split('/').map(Number);
      const month = parts[0];
      const day = parts[1];
      const year = parts[2];

      if (month && day && year) {
        // Set loading state
        goingToDay.value = true;

        // Set the date in the readings store (JavaScript Date uses 0-indexed months)
        readings.date = new Date(year, month - 1, day);
        await readings.getReadings();

        // Navigate to home page
        await router.push({ name: 'home', params: { lang: route.params.lang } });

        // Wait for the DOM to update and sections to load
        await nextTick();

        if (readings.sections) {
          // Find the Liturgy section (section id 3)
          const sectionIdx = readings.sections.findIndex(section => section.id === 3);
          const section = sectionIdx !== -1 ? readings.sections[sectionIdx] : undefined;

          if (section) {
            // Find the Synaxarium subsection
            const subSectionIdx = section.subSections.findIndex(ss => ss.id == 10);
            const subSection = subSectionIdx !== -1 ? section.subSections[subSectionIdx] : undefined;

            if (subSection) {
              // The readings carry the same story id; the title match is a fallback
              // for readings cached before the ids existed.
              let readingIdx = subSection.readings.findIndex(r => r.storyId === entry.StoryId);
              if (readingIdx === -1) readingIdx = findReadingIdx(subSection, entry);

              if (readingIdx !== -1) {
                // Found the story - scroll to it
                await scrollToReading(sectionIdx, subSectionIdx, readingIdx);
              } else {
                // Fallback: scroll to the beginning of synaxarium subsection
                await scrollToSubSection(sectionIdx, subSectionIdx);
              }
            }
          }
        }

        // Reset loading state
        goingToDay.value = false;
      }
    }
  };

  return { goingToDay, goToStoryDay };
}
