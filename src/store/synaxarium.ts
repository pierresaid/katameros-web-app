import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { SynaxEntry } from '@/types/synaxarium';
import synaxData from '../../assets/synax-days-fr.json';

export const useSynaxarium = defineStore('synaxarium', () => {
  // State
  const entries = ref<SynaxEntry[]>(synaxData as SynaxEntry[]);
  const searchQuery = ref('');

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
  };
});
