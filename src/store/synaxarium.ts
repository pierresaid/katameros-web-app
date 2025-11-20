import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';
import type { SynaxEntry } from '@/types/synaxarium';
import { useReadings } from './readings';

// Import all language files
import synaxDataFr from '../../assets/synax-days-fr.json';
import synaxDataEn from '../../assets/synax-days-en.json';
import synaxDataAr from '../../assets/synax-days-ar.json';
import synaxDataIt from '../../assets/synax-days-it.json';

// Map language codes to their data
const synaxDataMap: Record<string, SynaxEntry[]> = {
  'fr': synaxDataFr as SynaxEntry[],
  'en': synaxDataEn as SynaxEntry[],
  'ar': synaxDataAr as SynaxEntry[],
  'it': synaxDataIt as SynaxEntry[],
};

export const useSynaxarium = defineStore('synaxarium', () => {
  const readingsStore = useReadings();

  // State
  const entries = ref<SynaxEntry[]>([]);
  const searchQuery = ref('');
  const currentLanguage = ref('');

  // Load entries for the current language
  const loadEntriesForLanguage = (languageCode: string) => {
    const data = synaxDataMap[languageCode];
    if (data) {
      entries.value = data;
      currentLanguage.value = languageCode;
    } else {
      // Fallback to French if language not available
      entries.value = synaxDataMap['fr'] || [];
      currentLanguage.value = 'fr';
    }
  };

  // Initialize with current language
  loadEntriesForLanguage(readingsStore.languageCode);

  // Watch for language changes
  watch(() => readingsStore.languageCode, (newLang) => {
    loadEntriesForLanguage(newLang);
  });

  // Computed
  const filteredEntries = computed(() => {
    if (!searchQuery.value.trim()) {
      return sortedEntries.value;
    }

    const query = searchQuery.value.toLowerCase();
    return sortedEntries.value.filter(entry =>
      entry.Title.toLowerCase().includes(query)
    );
  });

  const sortedEntries = computed(() => {
    return [...entries.value].sort((a, b) => {
      if (a.Month !== b.Month) {
        return a.Month - b.Month;
      }
      return a.Day - b.Day;
    });
  });

  return {
    entries,
    searchQuery,
    filteredEntries,
    currentLanguage,
  };
});
