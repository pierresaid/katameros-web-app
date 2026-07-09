<template>
  <v-container>
    <v-row>
      <v-col>
        <h1 class="text-h4 mb-4">{{ $t('synaxarium.title') }}</h1>

        <v-text-field
          v-model="synaxStore.searchQuery"
          :label="$t('synaxarium.search')"
          prepend-icon="mdi-magnify"
          clearable
          variant="outlined"
          @click:clear="synaxStore.searchQuery = ''"
          class="mb-4"
          :disabled="isLoadingReadings"
        />

        <v-virtual-scroll
          v-if="!isLoadingReadings"
          :items="synaxStore.filteredEntries"
          height="calc(100vh - 250px)"
          item-height="80"
        >
          <template v-slot:default="{ item, index }">
            <v-list-item
              :key="`${item.Month}-${item.Day}-${index}`"
              @click="handleEntryClick(item)"
              class="synax-item"
            >
              <template v-slot:title>
                <div class="synax-date">
                  <strong>{{ $t('synaxarium.day') }} {{ item.Day }} {{ $t('synaxarium.of') }} {{ getCopticMonth(item.Month) }}</strong>
                </div>
              </template>
              <template v-slot:subtitle>
                <div class="synax-title" v-html="highlightSearchText(item.Title)"></div>
              </template>
            </v-list-item>
          </template>
        </v-virtual-scroll>

        <div v-if="isLoadingReadings" class="d-flex align-center justify-center" style="height: calc(100vh - 250px);">
          <v-progress-circular
            indeterminate
            color="primary"
            size="64"
          />
        </div>

        <div v-else-if="synaxStore.filteredEntries.length === 0" class="text-center text-grey mt-8">
          {{ $t('synaxarium.noResults') }}
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { useSynaxarium } from '@/store/synaxarium';
import { useSeo } from '@/composables/useSeo';
import { getCopticMonth } from '@/helpers/copticMonth';
import type { SynaxEntry } from '@/types/synaxarium';
import type { SubSection } from '@/types/readings';
import { useReadings } from '@/store/readings';
import { useRoute, useRouter } from 'vue-router';
import { convertCopticToGregorian } from '@/helpers/convertCopticToGregorian';
import { scrollToReading, scrollToSubSection } from '@/helpers/scrollTo';
import { nextTick, ref } from 'vue';

useSeo('synaxarium.title');

const synaxStore = useSynaxarium();
const readings = useReadings();
const router = useRouter();
const route = useRoute();
const isLoadingReadings = ref(false);

// The static synaxarium JSON and the API titles can differ by invisible
// characters (non-breaking spaces, curly apostrophes) or casing — normalize
// both sides before comparing.
const normalizeTitle = (title: unknown): string => String(title ?? '')
  .normalize('NFC')
  .replace(/[\u2018\u2019\u02BC]/g, "'")
  .replace(/[\u201C\u201D]/g, '"')
  .replace(/[\u200B-\u200D\uFEFF]/g, '')
  .replace(/\s+/g, ' ')
  .trim()
  .replace(/\.+$/, '')
  .toLowerCase();

const findReadingIdx = (subSection: SubSection, entry: SynaxEntry): number => {
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
    const pos = dayEntries.indexOf(entry);
    if (pos !== -1) return pos;
  }

  return -1;
};

const handleEntryClick = async (entry: SynaxEntry) => {
  // Get current coptic year from the readings store
  const currentCopticYear = readings.copticDate[2];

  // Convert coptic date to gregorian (format: MM/DD/YYYY)
  const copticDateStr = `${entry.Month}/${entry.Day}/${currentCopticYear}`;
  const gregorianDateStr = convertCopticToGregorian(copticDateStr);

  if (gregorianDateStr && typeof gregorianDateStr === 'string') {
    // Parse the gregorian date string (MM/DD/YYYY)
    const parts = gregorianDateStr.split('/').map(Number);
    const month = parts[0];
    const day = parts[1];
    const year = parts[2];

    if (month && day && year) {
      // Set loading state
      isLoadingReadings.value = true;

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
            const readingIdx = findReadingIdx(subSection, entry);

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
      isLoadingReadings.value = false;
    }
  }
};

const highlightSearchText = (text: string): string => {
  const query = synaxStore.searchQuery?.trim();
  if (!query) {
    return text;
  }

  const regex = new RegExp(`(${escapeRegex(query)})`, 'gi');
  return text.replace(regex, '<b>$1</b>');
};

const escapeRegex = (str: string): string => {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};
</script>

<style scoped>
.synax-item {
  min-height: 80px;
}

.synax-date {
  margin-bottom: 4px;
}

.synax-title {
  white-space: normal;
  word-wrap: break-word;
  overflow-wrap: break-word;
  line-height: 1.4;
}

.synax-title :deep(b) {
  font-weight: 700;
  background-color: rgba(255, 193, 7, 0.3);
  padding: 0 2px;
}
</style>
