<template>
  <v-container class="synax-page">
    <h1 class="synax-heading">{{ $t('synaxarium.title') }}</h1>
    <p class="synax-description">{{ $t('seo.synaxariumDescription') }}</p>

    <!-- Stays at the top while the list scrolls -->
    <div ref="controlsEl" class="synax-controls">
      <v-text-field
        v-model="query"
        :placeholder="$t('synaxarium.search')"
        :aria-label="$t('synaxarium.search')"
        prepend-inner-icon="mdi-magnify"
        clearable
        variant="solo-filled"
        flat
        rounded="pill"
        density="comfortable"
        hide-details
        :loading="textState === 'loading'"
        :disabled="isLoadingReadings"
      />
      <div v-if="mode === 'browse'" ref="monthsEl" class="synax-months" role="navigation"
        :aria-label="$t('synaxarium.months')">
        <button type="button" class="synax-chip" @click="scrollToToday()">
          <v-icon icon="mdi-calendar-today" size="15" />
          {{ $t('synaxarium.today') }}
        </button>
        <button v-for="month in monthGroups" :key="month.month" type="button" class="synax-chip"
          :class="{ 'synax-chip--active': month.month === activeMonth }" :data-month="month.month"
          @click="scrollToMonth(month.month)">
          {{ month.name }}
        </button>
      </div>
      <div v-else-if="mounted && (resultCount || titlesOnly)" class="synax-summary" aria-live="polite">
        <span v-if="resultCount">{{ $t('synaxarium.results', resultCount) }}</span>
        <span v-if="titlesOnly">{{ $t('synaxarium.titlesOnly') }}</span>
      </div>
    </div>

    <div v-if="isLoadingReadings" class="synax-loading">
      <v-progress-circular indeterminate color="primary" size="64" />
    </div>

    <div v-else-if="mounted" ref="listEl" class="synax-list">
      <!-- The calendar, day by day -->
      <template v-if="mode === 'browse'">
        <section v-for="month in monthGroups" :key="month.month">
          <h2 class="synax-month-title" :data-month="month.month">{{ month.name }}</h2>
          <div v-for="day in month.days" :key="day.key" class="synax-day" :class="{ 'synax-day--today': day.today }"
            :data-day="day.key">
            <div class="synax-day-head">
              <span class="synax-day-date">{{ day.day }} {{ month.name }}</span>
              <span v-if="day.gregorian">{{ day.gregorian }}</span>
              <span v-if="day.today" class="synax-day-badge">{{ $t('synaxarium.today') }}</span>
            </div>
            <button v-for="entry in day.entries" :key="entry.Slug" type="button" class="synax-row"
              @click="openStory(entry)">
              <span class="synax-row-title">{{ entry.Title }}</span>
            </button>
          </div>
        </section>
      </template>

      <!-- A day searched for -->
      <template v-else-if="mode === 'date'">
        <div v-if="dateDay" class="synax-day" :class="{ 'synax-day--today': dateDay.today }">
          <div class="synax-day-head">
            <span class="synax-day-date">{{ dateDay.day }} {{ dateDay.monthName }}</span>
            <span v-if="dateDay.gregorian">{{ dateDay.gregorian }}</span>
            <span v-if="dateDay.today" class="synax-day-badge">{{ $t('synaxarium.today') }}</span>
          </div>
          <button v-for="entry in dateDay.entries" :key="entry.Slug" type="button" class="synax-row"
            @click="openStory(entry)">
            <span class="synax-row-title">{{ entry.Title }}</span>
          </button>
        </div>
        <p v-else class="synax-empty">{{ $t('synaxarium.noResults') }}</p>
      </template>

      <!-- Words searched for: in the titles first, then in the stories -->
      <template v-else>
        <section v-if="shownTitleMatches.length">
          <h2 class="synax-results-title">{{ $t('synaxarium.inTitles') }}</h2>
          <button v-for="entry in shownTitleMatches" :key="entry.Slug" type="button"
            class="synax-row synax-row--dated" @click="openStory(entry)">
            <span class="synax-row-date">
              <span class="synax-row-day">{{ entry.Day }}</span>
              <span class="synax-row-month">{{ getCopticMonth(entry.Month) }}</span>
            </span>
            <span class="synax-row-title" v-html="highlightTokens(entry.Title, tokens)"></span>
          </button>
        </section>
        <section v-if="shownTextMatches.length">
          <h2 class="synax-results-title">{{ $t('synaxarium.inText') }}</h2>
          <button v-for="match in shownTextMatches" :key="match.entry.Slug" type="button"
            class="synax-row synax-row--dated" @click="openStory(match.entry)">
            <span class="synax-row-date">
              <span class="synax-row-day">{{ match.entry.Day }}</span>
              <span class="synax-row-month">{{ getCopticMonth(match.entry.Month) }}</span>
            </span>
            <span class="synax-row-body">
              <span class="synax-row-title" v-html="highlightTokens(match.entry.Title, tokens)"></span>
              <span class="synax-row-excerpt" v-html="match.excerpt"></span>
            </span>
          </button>
        </section>
        <!-- The next results come as the end of the list gets near -->
        <div v-if="moreResults" :key="shownCount"
          v-intersect="{ handler: showMoreResults, options: { rootMargin: '600px' } }" class="synax-more" />
        <p v-if="!resultCount && textState !== 'loading'" class="synax-empty">{{ $t('synaxarium.noResults') }}</p>
      </template>
    </div>

    <synax-story-sheet
      :open="!!storySlug"
      :day="sheetEntry?.Day ?? null"
      :month="sheetEntry?.Month ?? null"
      :title="sheetEntry?.Title ?? ''"
      :story="story"
      :status="status"
      :going-to-day="isLoadingReadings"
      :coptic-year="today?.year ?? null"
      :same-day="sameDay"
      :has-prev="!!neighbours.prev"
      :has-next="!!neighbours.next"
      :languages="storyLanguages"
      :language-id="storyLanguageId"
      :highlight="mode === 'search' ? tokens : []"
      @close="closeStory"
      @go-to-day="goToDay"
      @retry="reload"
      @prev="showNeighbour('prev')"
      @next="showNeighbour('next')"
      @open="showStory"
      @language="storyLanguageId = $event"
      @share="shareStory"
    />
  </v-container>
</template>

<script setup lang="ts">
import { useSynaxarium } from '@/store/synaxarium';
import { SITE_URL, useSeo } from '@/composables/useSeo';
import { SYNAX_LANGS } from '@/consts/supportedLangs';
import { getCopticMonth } from '@/helpers/copticMonth';
import type { SynaxEntry } from '@/types/synaxarium';
import type { SubSection } from '@/types/readings';
import { useReadings } from '@/store/readings';
import { useNotif } from '@/store/notif';
import { useRoute, useRouter } from 'vue-router';
import { convertCopticToGregorian } from '@/helpers/convertCopticToGregorian';
import { copticToGregorian, toCoptic, type CopticDate } from '@/helpers/copticDate';
import { scrollToReading, scrollToSubSection } from '@/helpers/scrollTo';
import { excerptAround, highlightTokens } from '@/helpers/searchText';
import { useCurrentLang } from '@/composables/useCurrentLang';
import { useSynaxStory } from '@/composables/useSynaxStory';
import { useSynaxSearch } from '@/composables/useSynaxSearch';
import { useBackClose } from '@/composables/useBackClose';
import SynaxStorySheet from '@/components/synax-story-sheet.vue';
import LANGUAGES from '@/consts/languages';
import { useHead } from '@unhead/vue';
import { useI18n } from 'vue-i18n';
import { watchDebounced } from '@vueuse/core';
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';

useSeo({
  titleKey: 'synaxarium.title',
  descriptionKey: 'seo.synaxariumDescription',
  langs: SYNAX_LANGS,
});

const synaxStore = useSynaxarium();
const lang = useCurrentLang();
watch(lang, (code) => synaxStore.setLanguage(code), { immediate: true });
const readings = useReadings();
const notif = useNotif();
const router = useRouter();
const route = useRoute();
const isLoadingReadings = ref(false);
const { t, locale } = useI18n();

// The page is prerendered: the list, today and the search from the address
// only come once it runs in the browser
const mounted = ref(false);
const today = ref<CopticDate | null>(null);

// What is typed, and the search it runs a moment later
const query = ref<string | null>('');
const searchQuery = ref('');
watchDebounced(query, (value) => { searchQuery.value = value ?? ''; }, { debounce: 150 });

// The language the list is in: German, Polish, Spanish and Thai have no
// synaxarium and show the French list, so their stories load in French too.
const languageId = computed(() => Object.values(LANGUAGES).find(l => l.code === synaxStore.currentLanguage)?.id ?? 1);

const { tokens, date, dayEntries, titleMatches, textMatches, textState, titlesOnly } = useSynaxSearch({
  entries: computed(() => synaxStore.sortedEntries),
  query: searchQuery,
  languageId,
  locale: computed(() => String(locale.value)),
  todayWord: computed(() => t('synaxarium.today')),
});

const mode = computed<'browse' | 'date' | 'search'>(() =>
  !searchQuery.value.trim() ? 'browse' : date.value ? 'date' : 'search');

const resultCount = computed(() => {
  if (mode.value === 'date')
    return dayEntries.value.length;
  if (mode.value === 'search')
    return titleMatches.value.length + textMatches.value.length;
  return 0;
});

// A common word matches hundreds of stories: the results show a page at a
// time, the next one coming as the end of the list gets near
const RESULTS_PAGE = 40;
const shownCount = ref(RESULTS_PAGE);
watch(searchQuery, () => { shownCount.value = RESULTS_PAGE; });
const shownTitleMatches = computed(() => titleMatches.value.slice(0, shownCount.value));
const shownTextMatches = computed(() => textMatches.value
  .slice(0, Math.max(0, shownCount.value - titleMatches.value.length))
  .map(match => ({ entry: match.entry, excerpt: excerptAround(match.text, tokens.value) })));
const moreResults = computed(() => shownCount.value < resultCount.value);

function showMoreResults(isIntersecting: boolean) {
  if (isIntersecting && moreResults.value)
    shownCount.value += RESULTS_PAGE;
}

interface DayGroup {
  key: string;
  month: number;
  day: number;
  monthName: string;
  /** The day in the Gregorian calendar this year */
  gregorian: string;
  today: boolean;
  entries: SynaxEntry[];
}

interface MonthGroup {
  month: number;
  name: string;
  days: DayGroup[];
}

const shortDate = computed(() => new Intl.DateTimeFormat(String(locale.value), { day: 'numeric', month: 'short' }));

function dayGroup(month: number, day: number, entries: SynaxEntry[]): DayGroup {
  const gregorian = today.value ? copticToGregorian(month, day, today.value.year) : null;
  return {
    key: `${month}-${day}`,
    month,
    day,
    monthName: getCopticMonth(month),
    gregorian: gregorian ? shortDate.value.format(gregorian) : '',
    today: today.value?.month === month && today.value?.day === day,
    entries,
  };
}

// The calendar: the months, their days, and the stories of each day
const monthGroups = computed(() => {
  const months: MonthGroup[] = [];
  for (const entry of synaxStore.sortedEntries) {
    let month = months[months.length - 1];
    if (!month || month.month !== entry.Month) {
      month = { month: entry.Month, name: getCopticMonth(entry.Month), days: [] };
      months.push(month);
    }
    let day = month.days[month.days.length - 1];
    if (!day || day.day !== entry.Day) {
      day = dayGroup(entry.Month, entry.Day, []);
      month.days.push(day);
    }
    day.entries.push(entry);
  }
  return months;
});

const dateDay = computed(() => date.value && dayEntries.value.length
  ? dayGroup(date.value.month, date.value.day, dayEntries.value)
  : null);

const controlsEl = ref<HTMLElement | null>(null);
const monthsEl = ref<HTMLElement | null>(null);
const listEl = ref<HTMLElement | null>(null);

// What stays at the top: the app bar, then the search and the month row
const APP_BAR_HEIGHT = 64;
const scrollOffset = () => APP_BAR_HEIGHT + (controlsEl.value?.offsetHeight ?? 0) + 8;

// Days far from the screen are laid out at an estimated height until they come
// near (content-visibility): once those around the target have their real
// size, it has moved, so aim again over the next frames
function scrollToElement(el: Element | null | undefined, attempts = 4) {
  if (!el)
    return;
  const delta = el.getBoundingClientRect().top - scrollOffset();
  if (Math.abs(delta) > 1)
    window.scrollTo({ top: Math.max(0, window.scrollY + delta), behavior: 'instant' });
  if (attempts > 1)
    requestAnimationFrame(() => requestAnimationFrame(() => scrollToElement(el, attempts - 1)));
}

// A day without a story (German has fewer) goes to the next one that has some
function scrollToDay(month: number, day: number) {
  const days = monthGroups.value.flatMap(m => m.days);
  const target = days.find(d => d.month > month || (d.month === month && d.day >= day)) ?? days[0];
  if (target)
    scrollToElement(listEl.value?.querySelector(`[data-day="${target.key}"]`));
}

function scrollToToday() {
  if (today.value)
    scrollToDay(today.value.month, today.value.day);
}

function scrollToMonth(month: number) {
  scrollToElement(listEl.value?.querySelector(`h2[data-month="${month}"]`));
}

// The month at the top of the screen, lit in the month row
const activeMonth = ref<number | null>(null);

function updateActiveMonth() {
  if (mode.value !== 'browse' || !listEl.value)
    return;
  const limit = scrollOffset() + 1;
  let current = monthGroups.value[0]?.month ?? null;
  for (const title of listEl.value.querySelectorAll<HTMLElement>('h2[data-month]')) {
    if (title.getBoundingClientRect().top > limit)
      break;
    current = Number(title.dataset.month);
  }
  activeMonth.value = current;
}

let scrollFrame = 0;
function onScroll() {
  if (!scrollFrame) {
    scrollFrame = requestAnimationFrame(() => {
      scrollFrame = 0;
      updateActiveMonth();
    });
  }
}

watch(activeMonth, async (month) => {
  await nextTick();
  monthsEl.value?.querySelector(`[data-month="${month}"]`)
    ?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'instant' });
});

// The search is kept in the address (?q=), so it can be shared and comes back
watch(searchQuery, async (value) => {
  if (!mounted.value)
    return;
  const q = value.trim() || undefined;
  if (route.query.q !== q)
    router.replace({ query: { ...route.query, q } });
  await nextTick();
  if (!q) {
    // Back to the calendar, on today
    scrollToToday();
    updateActiveMonth();
  } else {
    // The results, from their start
    const top = (listEl.value?.getBoundingClientRect().top ?? 0) + window.scrollY - scrollOffset();
    if (window.scrollY > top)
      window.scrollTo({ top: Math.max(0, top), behavior: 'instant' });
  }
});

// The open story lives in the URL (?story=<slug>), so a story can be shared
// and the back button closes the sheet.
const storySlug = computed(() => {
  const value = route.query.story;
  return typeof value === 'string' && value ? value : null;
});
// Keeps the last story while the sheet animates closed, so it does not empty mid-way
const shownSlug = ref<string | null>(storySlug.value);
// A story can be read in another language than the list's, while the sheet is open
const storyLanguageId = ref(languageId.value);
watch(languageId, (id) => { storyLanguageId.value = id; });
const sheetEntry = computed(() => synaxStore.entries.find(e => e.Slug === shownSlug.value) ?? null);
const { story, status, reload } = useSynaxStory(shownSlug, storyLanguageId);
watch(storySlug, (slug) => {
  if (!slug) {
    storyLanguageId.value = languageId.value;
    return;
  }
  // Reopening the same story: refresh it (an earlier failure, or newer text)
  if (slug === shownSlug.value) reload();
  else shownSlug.value = slug;
});

const storyLanguages = computed(() => {
  const codes = shownSlug.value ? synaxStore.languagesOf(shownSlug.value) : [];
  return Object.values(LANGUAGES).filter(l => codes.includes(l.code)).map(l => ({ id: l.id, name: l.name }));
});

// The other stories of the same day
const sameDay = computed(() => {
  const month = story.value?.month ?? sheetEntry.value?.Month;
  const day = story.value?.day ?? sheetEntry.value?.Day;
  return synaxStore.sortedEntries
    .filter(e => e.Month === month && e.Day === day && e.Slug !== shownSlug.value)
    .map(e => ({ slug: e.Slug, title: e.Title }));
});

// Previous and next follow the list on screen: the calendar, the day or the results
const neighbours = computed(() => {
  const shown: SynaxEntry[] = mode.value === 'date' ? dayEntries.value
    : mode.value === 'search' ? [...titleMatches.value, ...textMatches.value.map(m => m.entry)]
      : synaxStore.sortedEntries;
  let list = shown;
  let index = list.findIndex(e => e.Slug === shownSlug.value);
  if (index === -1) {
    list = synaxStore.sortedEntries;
    index = list.findIndex(e => e.Slug === shownSlug.value);
  }
  return {
    prev: index > 0 ? list[index - 1] : undefined,
    next: index !== -1 ? list[index + 1] : undefined,
  };
});

const openStory = (entry: SynaxEntry) => {
  router.push({ query: { ...route.query, story: entry.Slug } });
};

// From one story to another inside the sheet: replaced, so back still closes it
const showStory = (slug: string) => {
  router.replace({ query: { ...route.query, story: slug } });
};

const showNeighbour = (which: 'prev' | 'next') => {
  const entry = neighbours.value[which];
  if (entry)
    showStory(entry.Slug);
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

async function shareStory() {
  const slug = shownSlug.value;
  if (!slug)
    return;
  const url = `${SITE_URL}/${lang.value}/synaxarium/?story=${encodeURIComponent(slug)}`;
  const title = story.value?.title || sheetEntry.value?.Title || t('synaxarium.title');
  if (typeof navigator.share === 'function') {
    try {
      await navigator.share({ title, url });
    } catch {
      // closed without sharing
    }
    return;
  }
  try {
    await navigator.clipboard.writeText(url);
    notif.success(t('synaxarium.linkCopied'));
  } catch {
    // no clipboard either
  }
}

// The arrow keys go from story to story while the sheet is open
function onKeydown(e: KeyboardEvent) {
  if (!storySlug.value || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey)
    return;
  const target = e.target as HTMLElement | null;
  if (target?.closest('input, textarea, select, [contenteditable="true"]'))
    return;
  const which = e.key === 'ArrowLeft' ? 'prev' : e.key === 'ArrowRight' ? 'next' : null;
  if (!which || !neighbours.value[which])
    return;
  e.preventDefault();
  showNeighbour(which);
}

onMounted(async () => {
  today.value = toCoptic(new Date());
  const q = route.query.q;
  if (typeof q === 'string' && q.trim())
    query.value = searchQuery.value = q;
  mounted.value = true;
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('keydown', onKeydown);
  await nextTick();
  if (!searchQuery.value) {
    // Open on today, or on the day of a story opened from a link
    const entry = storySlug.value ? synaxStore.entries.find(e => e.Slug === storySlug.value) : undefined;
    if (entry)
      scrollToDay(entry.Month, entry.Day);
    else
      scrollToToday();
  }
  updateActiveMonth();
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll);
  window.removeEventListener('keydown', onKeydown);
  cancelAnimationFrame(scrollFrame);
});

useHead(() => {
  const title = story.value?.title || sheetEntry.value?.Title;
  return storySlug.value && title ? { title: `${title} - ${t('seo.brand')}` } : {};
});

// The static synaxarium JSON and the API titles can differ by invisible
// characters (non-breaking spaces, curly apostrophes) or casing — normalize
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
  margin: 0 auto 16px;
}

/* Under the app bar: the search and the month row stay in view */
.synax-controls {
  position: sticky;
  top: 64px;
  z-index: 2;
  padding: 8px 0 6px;
  background-color: rgb(var(--v-theme-background));
}

.synax-months {
  display: flex;
  gap: 6px;
  overflow-x: auto;
  padding-top: 10px;
  scrollbar-width: none;
}

.synax-months::-webkit-scrollbar {
  display: none;
}

.synax-chip {
  flex: none;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 5px 12px;
  border-radius: 999px;
  font-size: 0.82em;
  white-space: nowrap;
  color: rgba(var(--v-theme-on-surface), 0.75);
  background-color: rgba(var(--v-theme-on-surface), 0.06);
  transition: background-color 0.15s;
}

.synax-chip:hover {
  background-color: rgba(var(--v-theme-on-surface), 0.1);
}

.synax-chip--active,
.synax-chip--active:hover {
  font-weight: 600;
  color: rgba(var(--v-theme-on-surface), 0.95);
  background-color: rgba(var(--v-theme-primary), 0.28);
}

.synax-summary {
  display: flex;
  flex-wrap: wrap;
  gap: 2px 12px;
  padding: 8px 12px 0;
  font-size: 0.8em;
  color: rgba(var(--v-theme-on-surface), 0.6);
}

.synax-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 300px);
}

.synax-month-title {
  font-family: 'Suez one';
  font-weight: 400;
  font-size: 1.25em;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  margin: 28px 12px 2px;
  color: rgba(var(--v-theme-on-surface), 0.85);
}

section:first-child > .synax-month-title {
  margin-top: 10px;
}

.synax-day {
  margin-top: 8px;
  border-radius: 14px;
}

.synax-day--today {
  padding-bottom: 4px;
  background-color: rgba(var(--v-theme-primary), 0.12);
}

.synax-day-head {
  display: flex;
  align-items: baseline;
  gap: 8px;
  padding: 8px 12px 2px;
  font-size: 0.78em;
  color: rgba(var(--v-theme-on-surface), 0.55);
}

.synax-day-date {
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: rgba(var(--v-theme-on-surface), 0.75);
}

.synax-day-badge {
  margin-inline-start: auto;
  padding: 1px 8px;
  border-radius: 999px;
  font-weight: 700;
  color: rgba(var(--v-theme-on-surface), 0.9);
  background-color: rgba(var(--v-theme-primary), 0.35);
}

.synax-row {
  display: block;
  width: 100%;
  padding: 9px 12px;
  border-radius: 12px;
  text-align: start;
  line-height: 1.35;
  transition: background-color 0.15s;
}

.synax-row:hover,
.synax-row:focus-visible {
  background-color: rgba(var(--v-theme-on-surface), 0.06);
}

.synax-row--dated {
  display: flex;
  align-items: center;
  gap: 14px;
  min-height: 64px;
  padding: 8px 12px;
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

.synax-row-body {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.synax-row-title,
.synax-row-excerpt {
  min-width: 0;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
}

/* A hair under two line-heights: the third line's highlight background
   otherwise peeks through the clip as an amber sliver */
.synax-row-title {
  max-height: 2.6em;
}

.synax-row-excerpt {
  max-height: 2.7em;
  font-size: 0.86em;
  line-height: 1.4;
  color: rgba(var(--v-theme-on-surface), 0.62);
}

.synax-row :deep(b) {
  font-weight: 700;
  background-color: rgba(255, 193, 7, 0.3);
  padding: 0 2px;
  border-radius: 3px;
}

.synax-results-title {
  margin: 18px 12px 6px;
  font-size: 0.76em;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(var(--v-theme-on-surface), 0.55);
}

.synax-empty {
  margin-top: 32px;
  text-align: center;
  color: rgba(var(--v-theme-on-surface), 0.55);
}

.synax-more {
  height: 1px;
}

/* Days and results far from the screen skip their layout: the calendar holds
   some 860 stories. Only where the browser keeps the view still when their real
   size comes in (scroll anchoring); Safari would jump while scrolling up. */
@supports (overflow-anchor: auto) {
  .synax-day {
    content-visibility: auto;
    contain-intrinsic-size: auto 150px;
  }

  .synax-row--dated {
    content-visibility: auto;
    contain-intrinsic-size: auto 64px;
  }
}
</style>
