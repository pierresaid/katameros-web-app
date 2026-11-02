import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { SynaxEntry } from '@/types/synaxarium';

// Import all language files
import synaxDataFr from '../../assets/synax-days-fr.json';
import synaxDataEn from '../../assets/synax-days-en.json';
import synaxDataAr from '../../assets/synax-days-ar.json';
import synaxDataIt from '../../assets/synax-days-it.json';
import synaxDataDe from '../../assets/synax-days-de.json';
import synaxDataNl from '../../assets/synax-days-nl.json';

// Map language codes to their data
const synaxDataMap: Record<string, SynaxEntry[]> = {
  'fr': synaxDataFr as SynaxEntry[],
  'en': synaxDataEn as SynaxEntry[],
  'ar': synaxDataAr as SynaxEntry[],
  'it': synaxDataIt as SynaxEntry[],
  'de': synaxDataDe as SynaxEntry[],
  'nl': synaxDataNl as SynaxEntry[],
};

// The languages each story is written in, by slug
const slugLanguages = new Map<string, string[]>();
for (const [code, list] of Object.entries(synaxDataMap)) {
  for (const entry of list) {
    const codes = slugLanguages.get(entry.Slug);
    if (codes) {
      codes.push(code);
    } else {
      slugLanguages.set(entry.Slug, [code]);
    }
  }
}

export const useSynaxarium = defineStore('synaxarium', () => {
  // Set by the synaxarium page from the route language: the persisted reading
  // language is only synced to the route once the app is mounted, so while a
  // page is prerendered it would still hold the default one.
  const currentLanguage = ref('fr');

  const setLanguage = (languageCode: string) => {
    // Fallback to French if language not available
    currentLanguage.value = synaxDataMap[languageCode] ? languageCode : 'fr';
  };

  // Derived rather than stored so the list isn't serialized into the prerendered page
  const entries = computed(() => synaxDataMap[currentLanguage.value] ?? []);

  // Calendar order: by month, then day; the stories of a day keep their order
  const sortedEntries = computed(() =>
    [...entries.value].sort((a, b) => a.Month - b.Month || a.Day - b.Day)
  );

  /** The codes of the languages a story is written in */
  const languagesOf = (slug: string): string[] => slugLanguages.get(slug) ?? [];

  return {
    entries,
    sortedEntries,
    currentLanguage,
    setLanguage,
    languagesOf,
  };
});
