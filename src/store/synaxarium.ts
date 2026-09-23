import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { SynaxEntry } from '@/types/synaxarium';
import { normalizeSearchText } from '@/helpers/searchText';

// Import all language files
import synaxDataFr from '../../assets/synax-days-fr.json';
import synaxDataEn from '../../assets/synax-days-en.json';
import synaxDataAr from '../../assets/synax-days-ar.json';
import synaxDataIt from '../../assets/synax-days-it.json';
import synaxDataNl from '../../assets/synax-days-nl.json';

// Map language codes to their data
const synaxDataMap: Record<string, SynaxEntry[]> = {
  'fr': synaxDataFr as SynaxEntry[],
  'en': synaxDataEn as SynaxEntry[],
  'ar': synaxDataAr as SynaxEntry[],
  'it': synaxDataIt as SynaxEntry[],
  'nl': synaxDataNl as SynaxEntry[],
};

export const useSynaxarium = defineStore('synaxarium', () => {
  // State
  const searchQuery = ref('');
  // Set by the synaxarium page from the route language: the persisted reading
  // language is only synced to the route once the app is mounted, so while a
  // page is prerendered it would still hold the default one.
  const currentLanguage = ref('fr');

  const setLanguage = (languageCode: string) => {
    // Fallback to French if language not available
    currentLanguage.value = synaxDataMap[languageCode] ? languageCode : 'fr';
  };

  // Computed
  // Derived rather than stored so the list isn't serialized into the prerendered page
  const entries = computed(() => synaxDataMap[currentLanguage.value] ?? []);

  const sortedEntries = computed(() => {
    return [...entries.value].sort((a, b) => {
      if (a.Month !== b.Month) {
        return a.Month - b.Month;
      }
      return a.Day - b.Day;
    });
  });

  const searchableTitles = computed(() =>
    sortedEntries.value.map(entry => normalizeSearchText(entry.Title))
  );

  const filteredEntries = computed(() => {
    const query = normalizeSearchText(searchQuery.value.trim());
    if (!query) {
      return sortedEntries.value;
    }

    const titles = searchableTitles.value;
    return sortedEntries.value.filter((_, idx) => titles[idx]?.includes(query) ?? false);
  });

  return {
    entries,
    searchQuery,
    filteredEntries,
    currentLanguage,
    setLanguage,
  };
});
