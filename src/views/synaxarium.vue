<template>
  <v-container class="synax-page">
    <v-row>
      <v-col>
        <h1 class="synax-heading">{{ $t('synaxarium.title') }}</h1>
        <p class="synax-description">{{ $t('seo.synaxariumDescription') }}</p>

        <v-text-field
          v-model="synaxStore.searchQuery"
          :placeholder="$t('synaxarium.search')"
          :aria-label="$t('synaxarium.search')"
          prepend-inner-icon="mdi-magnify"
          clearable
          variant="solo-filled"
          flat
          rounded="pill"
          density="comfortable"
          hide-details
          @click:clear="synaxStore.searchQuery = ''"
          class="mb-4"
          :disabled="isLoadingReadings"
        />

        <v-virtual-scroll
          v-if="!isLoadingReadings"
          :items="synaxStore.filteredEntries"
          height="calc(100dvh - 290px)"
          item-height="76"
        >
          <template v-slot:default="{ item }">
            <button
              :key="item.Slug"
              type="button"
              class="synax-row"
              @click="openStory(item)"
            >
              <span class="synax-row-date">
                <span class="synax-row-day">{{ item.Day }}</span>
                <span class="synax-row-month">{{ getCopticMonth(item.Month) }}</span>
              </span>
              <span class="synax-row-title" v-html="highlightSearchText(item.Title)"></span>
            </button>
          </template>
        </v-virtual-scroll>

        <div v-if="isLoadingReadings" class="d-flex align-center justify-center" style="height: calc(100vh - 300px);">
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

    <synax-story-sheet
      :open="!!storySlug"
      :day="sheetEntry?.Day ?? null"
      :month="sheetEntry?.Month ?? null"
      :title="sheetEntry?.Title ?? ''"
      :story="story"
      :status="status"
      :going-to-day="isLoadingReadings"
      @close="closeStory"
      @go-to-day="goToDay"
      @retry="reload"
    />
  </v-container>
</template>

<script setup lang="ts">
import { useSynaxarium } from '@/store/synaxarium';
import { useSeo } from '@/composables/useSeo';
import { SYNAX_LANGS } from '@/consts/supportedLangs';
import { getCopticMonth } from '@/helpers/copticMonth';
import type { SynaxEntry } from '@/types/synaxarium';
import type { SubSection } from '@/types/readings';
import { useReadings } from '@/store/readings';
import { useRoute, useRouter } from 'vue-router';
import { convertCopticToGregorian } from '@/helpers/convertCopticToGregorian';
import { scrollToReading, scrollToSubSection } from '@/helpers/scrollTo';
import { highlightSearchMatches } from '@/helpers/searchText';
import { useCurrentLang } from '@/composables/useCurrentLang';
import { useSynaxStory } from '@/composables/useSynaxStory';
import { useBackClose } from '@/composables/useBackClose';
import SynaxStorySheet from '@/components/synax-story-sheet.vue';
import LANGUAGES from '@/consts/languages';
import { useHead } from '@unhead/vue';
import { useI18n } from 'vue-i18n';
import { computed, nextTick, ref, watch } from 'vue';

useSeo({
  titleKey: 'synaxarium.title',
  descriptionKey: 'seo.synaxariumDescription',
  langs: SYNAX_LANGS,
});

const synaxStore = useSynaxarium();
const lang = useCurrentLang();
watch(lang, (code) => synaxStore.setLanguage(code), { immediate: true });
const readings = useReadings();
const router = useRouter();
const route = useRoute();
const isLoadingReadings = ref(false);
const { t } = useI18n();

// The open story lives in the URL (?story=<slug>), so a story can be shared
// and the back button closes the sheet.
const storySlug = computed(() => {
  const value = route.query.story;
  return typeof value === 'string' && value ? value : null;
});
// Keeps the last story while the sheet animates closed, so it does not empty mid-way
const shownSlug = ref<string | null>(storySlug.value);
// The language the list is in: German, Polish, Spanish and Thai have no
// synaxarium and show the French list, so their stories load in French too.
const languageId = computed(() => Object.values(LANGUAGES).find(l => l.code === synaxStore.currentLanguage)?.id ?? 1);
const sheetEntry = computed(() => synaxStore.entries.find(e => e.Slug === shownSlug.value) ?? null);
const { story, status, reload } = useSynaxStory(shownSlug, languageId);
watch(storySlug, (slug) => {
  if (!slug) return;
  // Reopening the same story: refresh it (an earlier failure, or newer text)
  if (slug === shownSlug.value) reload();
  else shownSlug.value = slug;
});

const openStory = (entry: SynaxEntry) => {
  router.push({ query: { ...route.query, story: entry.Slug } });
};

// When the entry before is the plain list, closing steps back to it, so the
// history keeps no duplicate. This holds after a remount or a reload too.
// A story opened from a shared link replaces its entry instead.
const closeStory = () => {
  if (!storySlug.value) return;
  const { story: _story, ...query } = route.query;
  const listPath = router.resolve({ query }).fullPath;
  if (router.options.history.state.back === listPath) router.back();
  else router.replace({ query });
};

useBackClose(() => !!storySlug.value, closeStory);

useHead(() => {
  const title = story.value?.title || sheetEntry.value?.Title;
  return storySlug.value && title ? { title: `${title} - ${t('seo.brand')}` } : {};
});

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

const findReadingIdx = (subSection: SubSection, entry: { Day: number; Month: number; Title: string }): number => {
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

// The day of the open story: from the API answer, or from the list while it loads
interface StoryTarget { Day: number; Month: number; StoryId: number; Title: string }

const goToDay = () => {
  const target: StoryTarget | null = story.value
    ? { Day: story.value.day, Month: story.value.month, StoryId: story.value.storyId, Title: story.value.title }
    : sheetEntry.value;
  if (target) showStoryInReadings(target);
};

const showStoryInReadings = async (entry: StoryTarget) => {
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
      isLoadingReadings.value = false;
    }
  }
};

const highlightSearchText = (text: string): string =>
  highlightSearchMatches(text, synaxStore.searchQuery ?? '');
</script>

<style scoped>
.synax-page {
  max-width: 640px;
}

.synax-heading {
  font-family: 'Suez one';
  font-weight: 400;
  font-size: 1.8em;
  line-height: 1.2;
  text-align: center;
  margin: 8px 0 6px;
}

.synax-description {
  text-align: center;
  font-size: 0.88em;
  line-height: 1.55;
  color: rgba(var(--v-theme-on-surface), 0.65);
  max-width: 46ch;
  margin: 0 auto 24px;
}

.synax-row {
  display: flex;
  align-items: center;
  gap: 14px;
  width: 100%;
  height: 72px;
  padding: 8px 12px;
  border-radius: 12px;
  text-align: start;
  transition: background-color 0.15s;
}

.synax-row:hover,
.synax-row:focus-visible {
  background-color: rgba(var(--v-theme-on-surface), 0.06);
}

.synax-row-date {
  flex: none;
  width: 4.4em;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.synax-row-day {
  font-family: 'Suez one';
  font-size: 1.35em;
  line-height: 1.15;
  color: rgba(var(--v-theme-on-surface), 0.85);
}

.synax-row-month {
  max-width: 100%;
  font-size: 0.66em;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: rgba(var(--v-theme-on-surface), 0.55);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.synax-row-title {
  min-width: 0;
  line-height: 1.35;
  /* a hair under two line-heights: the third line's highlight background
     otherwise peeks through the clip as an amber sliver */
  max-height: 2.6em;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
}

.synax-row-title :deep(b) {
  font-weight: 700;
  background-color: rgba(255, 193, 7, 0.3);
  padding: 0 2px;
  border-radius: 3px;
}
</style>
