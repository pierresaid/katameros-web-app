<template>
  <div class="synax-page">
    <!-- Stays in place: the list below scrolls on its own -->
    <div class="synax-top">
      <h1 class="synax-heading">{{ $t('synaxarium.title') }}</h1>
      <p class="synax-description">{{ $t('seo.synaxariumDescription') }}</p>

      <div class="synax-search-row">
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
        />
        <v-btn icon="mdi-calendar" variant="tonal" class="synax-calendar" :aria-label="$t('aria.openDatePicker')"
          :title="$t('aria.openDatePicker')" @click="menu.dateDialog = true" />
      </div>

      <div class="synax-nav">
        <!-- Outside the months, so it can always be reached -->
        <button type="button" class="synax-chip synax-chip--today" @click="goToToday">
          <v-icon icon="mdi-calendar-today" size="15" />
          {{ $t('synaxarium.today') }}
        </button>
        <div ref="monthsEl" class="synax-months" role="navigation" :aria-label="$t('synaxarium.months')">
          <button v-for="month in monthGroups" :key="month.month" type="button" class="synax-chip"
            :class="{ 'synax-chip--active': mode === 'browse' && month.month === activeMonth }"
            :data-month="month.month" @click="goTo({ month: month.month })">
            {{ month.name }}
          </button>
        </div>
      </div>

      <div v-if="mode === 'search' && mounted && (resultCount || titlesOnly)" class="synax-summary"
        aria-live="polite">
        <span v-if="resultCount">{{ $t('synaxarium.results', resultCount) }}</span>
        <span v-if="titlesOnly">{{ $t('synaxarium.titlesOnly') }}</span>
      </div>
    </div>

    <div ref="scrollEl" class="synax-scroll" @scroll.passive="onScroll">
      <div v-if="mounted" ref="listEl" class="synax-list">
        <!-- The calendar, day by day -->
        <template v-if="mode === 'browse'">
          <section v-for="month in monthGroups" :key="month.month">
            <h2 class="synax-month-title" :data-month="month.month">{{ month.name }}</h2>
            <div v-for="day in month.days" :key="day.key" class="synax-day"
              :class="{ 'synax-day--today': day.today, 'synax-day--selected': isSelected(day) }" :data-day="day.key">
              <div class="synax-day-head">
                <span class="synax-day-date">{{ day.day }} {{ month.name }}</span>
                <span v-if="day.gregorian">{{ day.gregorian }}</span>
                <span v-if="day.today" class="synax-day-badge">{{ $t('synaxarium.today') }}</span>
              </div>
              <router-link v-for="entry in day.entries" :key="entry.Slug" :to="storyRoute(entry.Slug)"
                class="synax-row" :data-slug="entry.Slug" @click="rememberOpened(entry.Slug, $event)">
                <span class="synax-row-title">{{ entry.Title }}</span>
              </router-link>
            </div>
          </section>
        </template>

        <!-- Words searched for: in the titles first, then in the stories -->
        <template v-else>
          <section v-if="shownTitleMatches.length">
            <h2 class="synax-results-title">{{ $t('synaxarium.inTitles') }}</h2>
            <router-link v-for="entry in shownTitleMatches" :key="entry.Slug" :to="storyRoute(entry.Slug)"
              class="synax-row synax-row--dated" :data-slug="entry.Slug" @click="rememberOpened(entry.Slug, $event)">
              <span class="synax-row-date">
                <span class="synax-row-day">{{ entry.Day }}</span>
                <span class="synax-row-month">{{ getCopticMonth(entry.Month) }}</span>
              </span>
              <span class="synax-row-title" v-html="highlightTokens(entry.Title, tokens)"></span>
            </router-link>
          </section>
          <section v-if="shownTextMatches.length">
            <h2 class="synax-results-title">{{ $t('synaxarium.inText') }}</h2>
            <router-link v-for="match in shownTextMatches" :key="match.entry.Slug" :to="storyRoute(match.entry.Slug)"
              class="synax-row synax-row--dated" :data-slug="match.entry.Slug"
              @click="rememberOpened(match.entry.Slug, $event)">
              <span class="synax-row-date">
                <span class="synax-row-day">{{ match.entry.Day }}</span>
                <span class="synax-row-month">{{ getCopticMonth(match.entry.Month) }}</span>
              </span>
              <span class="synax-row-body">
                <span class="synax-row-title" v-html="highlightTokens(match.entry.Title, tokens)"></span>
                <span class="synax-row-excerpt" v-html="match.excerpt"></span>
              </span>
            </router-link>
          </section>
          <p v-if="!resultCount && textState !== 'loading'" class="synax-empty">{{ $t('synaxarium.noResults') }}</p>
        </template>
      </div>
    </div>

    <date-picker-dialog v-model="menu.dateDialog" pick :initial-date="pickerDate"
      @pick="showDay($event.month, $event.day)" />
  </div>
</template>

<script setup lang="ts">
import { useSynaxarium } from '@/store/synaxarium';
import { useSeo } from '@/composables/useSeo';
import { SYNAX_LANGS } from '@/consts/supportedLangs';
import { getCopticMonth } from '@/helpers/copticMonth';
import type { SynaxEntry } from '@/types/synaxarium';
import { useMenu } from '@/store/menu';
import { useReadings } from '@/store/readings';
import { useRoute, useRouter } from 'vue-router';
import { copticToGregorian, toCoptic, type CopticDate } from '@/helpers/copticDate';
import { excerptAround, highlightTokens } from '@/helpers/searchText';
import { useCurrentLang } from '@/composables/useCurrentLang';
import { useSynaxSearch } from '@/composables/useSynaxSearch';
import DatePickerDialog from '@/components/date-picker-dialog.vue';
import LANGUAGES from '@/consts/languages';
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
const menu = useMenu();
const readings = useReadings();
const router = useRouter();
const route = useRoute();
const { locale } = useI18n();

// The page is prerendered: the list, today and the search from the address
// only come once it runs in the browser
const mounted = ref(false);
const today = ref<CopticDate | null>(null);

// What is typed, and the search it runs a moment later
const query = ref<string | null>('');
const searchQuery = ref('');
watchDebounced(query, (value) => { searchQuery.value = value ?? ''; }, { debounce: 150 });

// The language the list is in (the page only exists in the languages that have a synaxarium)
const languageId = computed(() => Object.values(LANGUAGES).find(l => l.code === synaxStore.currentLanguage)?.id ?? 1);

const { tokens, titleMatches, textMatches, textState, titlesOnly } = useSynaxSearch({
  entries: computed(() => synaxStore.sortedEntries),
  query: searchQuery,
  languageId,
});

const mode = computed<'browse' | 'search'>(() => searchQuery.value.trim() ? 'search' : 'browse');

const resultCount = computed(() =>
  mode.value === 'search' ? titleMatches.value.length + textMatches.value.length : 0);

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

interface DayGroup {
  key: string;
  month: number;
  day: number;
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
      const gregorian = today.value ? copticToGregorian(entry.Month, entry.Day, today.value.year) : null;
      day = {
        key: `${entry.Month}-${entry.Day}`,
        month: entry.Month,
        day: entry.Day,
        gregorian: gregorian ? shortDate.value.format(gregorian) : '',
        today: today.value?.month === entry.Month && today.value?.day === entry.Day,
        entries: [],
      };
      month.days.push(day);
    }
    day.entries.push(entry);
  }
  return months;
});

// The day chosen in the date picker, outlined in the list
const selectedDay = ref<{ month: number, day: number } | null>(null);
const isSelected = (day: DayGroup) => selectedDay.value?.month === day.month && selectedDay.value?.day === day.day;
// The picker opens on that day this year, or on today
const pickerDate = computed(() => selectedDay.value && today.value
  ? copticToGregorian(selectedDay.value.month, selectedDay.value.day, today.value.year)
  : null);

const scrollEl = ref<HTMLElement | null>(null);
const monthsEl = ref<HTMLElement | null>(null);
const listEl = ref<HTMLElement | null>(null);
// A little room above a day or month reached from a button
const TOP_GAP = 6;

// Days far from the screen are laid out at an estimated height until they come
// near (content-visibility): once those around the target have their real
// size, it has moved, so aim again over the next frames
function scrollToElement(el: Element | null | undefined, gap = TOP_GAP, attempts = 4) {
  const box = scrollEl.value;
  if (!el || !box)
    return;
  const delta = el.getBoundingClientRect().top - box.getBoundingClientRect().top - gap;
  if (Math.abs(delta) > 1)
    box.scrollTop = Math.max(0, box.scrollTop + delta);
  if (attempts > 1)
    requestAnimationFrame(() => requestAnimationFrame(() => scrollToElement(el, gap, attempts - 1)));
}

// A day without a story (German has fewer) goes to the next one that has some
function scrollToDay(month: number, day: number): DayGroup | undefined {
  const days = monthGroups.value.flatMap(m => m.days);
  const target = days.find(d => d.month > month || (d.month === month && d.day >= day)) ?? days[0];
  if (target)
    scrollToElement(listEl.value?.querySelector(`[data-day="${target.key}"]`));
  return target;
}

// Where the calendar goes: a month, a day, or (null) the chosen day or today.
// From the search results the calendar comes back first.
let pendingSpot: { month: number, day?: number } | null = null;

function goTo(spot: { month: number, day?: number } | null) {
  pendingSpot = spot;
  if (query.value || searchQuery.value) {
    query.value = '';
    searchQuery.value = '';
  } else {
    showSpot();
  }
}

function showSpot() {
  const spot = pendingSpot;
  pendingSpot = null;
  if (spot && spot.day === undefined) {
    scrollToElement(listEl.value?.querySelector(`h2[data-month="${spot.month}"]`));
    return;
  }
  const wanted = spot ?? selectedDay.value ?? today.value;
  if (!wanted?.day)
    return;
  const target = scrollToDay(wanted.month, wanted.day);
  if (selectedDay.value && target)
    selectedDay.value = { month: target.month, day: target.day };
}

function showDay(month: number, day: number) {
  selectedDay.value = { month, day };
  goTo({ month, day });
}

function goToToday() {
  selectedDay.value = null;
  goTo(null);
}

// The month at the top of the list, lit in the month row
const activeMonth = ref<number | null>(null);

function updateActiveMonth() {
  const box = scrollEl.value;
  if (mode.value !== 'browse' || !listEl.value || !box)
    return;
  const limit = box.getBoundingClientRect().top + TOP_GAP + 1;
  let current = monthGroups.value[0]?.month ?? null;
  for (const title of listEl.value.querySelectorAll<HTMLElement>('h2[data-month]')) {
    if (title.getBoundingClientRect().top > limit)
      break;
    current = Number(title.dataset.month);
  }
  activeMonth.value = current;
}

// The next page of results, before the end of the list is reached
function loadMoreResults() {
  const box = scrollEl.value;
  if (mode.value === 'search' && box && moreResults.value
    && box.scrollTop + box.clientHeight > box.scrollHeight - 600)
    shownCount.value += RESULTS_PAGE;
}

let scrollFrame = 0;
function onScroll() {
  if (!scrollFrame) {
    scrollFrame = requestAnimationFrame(() => {
      scrollFrame = 0;
      updateActiveMonth();
      loadMoreResults();
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
    // Back to the calendar: the day asked for, the chosen day or today
    showSpot();
    updateActiveMonth();
  } else if (scrollEl.value) {
    // The results, from their start
    scrollEl.value.scrollTop = 0;
  }
});

// Each story has its own page
const storyRoute = (slug: string) => ({ name: 'synaxarium-story', params: { lang: lang.value, slug } });

// The results in their order: the matches in the titles, then in the texts
const resultEntries = computed(() => [...titleMatches.value, ...textMatches.value.map(m => m.entry)]);

// Kept on the way to a story: where its row was, so the list comes back to it,
// and the results it was in, which the story's previous and next follow
function rememberOpened(slug: string, event: MouseEvent) {
  const row = event.currentTarget as HTMLElement | null;
  const box = scrollEl.value;
  const search = mode.value === 'search';
  synaxStore.opened = {
    slug,
    offset: row && box ? row.getBoundingClientRect().top - box.getBoundingClientRect().top : TOP_GAP,
    shown: shownCount.value,
    slugs: search ? resultEntries.value.map(e => e.Slug) : [],
    tokens: search ? [...tokens.value] : [],
  };
}

// Back from a story's page: the row of that story, where the opened row was
// on the screen. In the results, once the matches in the texts are in.
async function showReturned(slug: string) {
  if (mode.value === 'search') {
    if (textState.value === 'loading') {
      await new Promise<void>((resolve) => {
        const stop = watch(textState, (state) => {
          if (state !== 'loading') {
            stop();
            resolve();
          }
        });
      });
    }
    const index = resultEntries.value.findIndex(e => e.Slug === slug);
    shownCount.value = Math.max(shownCount.value, synaxStore.opened?.shown ?? 0,
      Math.ceil((index + 1) / RESULTS_PAGE) * RESULTS_PAGE);
    await nextTick();
  }
  const row = listEl.value?.querySelector(`[data-slug="${slug}"]`);
  if (row)
    scrollToElement(row, synaxStore.opened?.offset ?? TOP_GAP);
  else if (mode.value === 'browse')
    showSpot();
}

let htmlOverflow = '';
onMounted(async () => {
  // The stories download when the list opens: the search looks in their
  // text, and they can be read offline
  readings.downloadStories();
  today.value = toCoptic(new Date());
  const q = route.query.q;
  if (typeof q === 'string' && q.trim())
    query.value = searchQuery.value = q;
  // The list scrolls in its own area: no page scrollbar beside it
  htmlOverflow = document.documentElement.style.overflow;
  document.documentElement.style.overflow = 'hidden';
  // The search from the address is in before the list shows, so the search
  // watcher leaves the results' scroll alone
  await nextTick();
  mounted.value = true;
  await nextTick();
  // Back from a story: its row. Otherwise today, or the results from their start.
  const returned = synaxStore.returnTo;
  synaxStore.returnTo = null;
  if (returned)
    await showReturned(returned);
  else if (!searchQuery.value)
    showSpot();
  updateActiveMonth();
});

onBeforeUnmount(() => {
  document.documentElement.style.overflow = htmlOverflow;
  cancelAnimationFrame(scrollFrame);
});
</script>

<style scoped>
/* The page fits the screen under the app bar: the top stays in place and
   only the list scrolls */
.synax-page {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 64px);
  height: calc(100dvh - 64px);
}

.synax-top {
  flex: none;
  width: 100%;
  max-width: 640px;
  margin: 0 auto;
  padding: 6px 12px 4px;
}

.synax-heading {
  font-family: 'Suez one';
  font-weight: 400;
  font-size: 1.5em;
  line-height: 1.2;
  text-align: center;
  margin: 2px 0 2px;
}

.synax-description {
  text-align: center;
  font-size: 0.8em;
  line-height: 1.45;
  color: rgba(var(--v-theme-on-surface), 0.65);
  max-width: 56ch;
  margin: 0 auto 10px;
}

/* Short screens (a phone held sideways) keep their room for the list */
@media (max-height: 640px) {
  .synax-description {
    display: none;
  }
}

@media (max-height: 480px) {
  .synax-heading {
    display: none;
  }
}

.synax-search-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.synax-calendar {
  flex: none;
}

.synax-nav {
  display: flex;
  align-items: center;
  gap: 6px;
  padding-top: 10px;
}

.synax-months {
  flex: 1;
  min-width: 0;
  display: flex;
  gap: 6px;
  overflow-x: auto;
  scrollbar-width: none;
  /* The months scroll under faded edges, rather than ending in a cut-off sliver */
  padding: 0 10px;
  -webkit-mask-image: linear-gradient(to right, transparent, black 10px, black calc(100% - 10px), transparent);
  mask-image: linear-gradient(to right, transparent, black 10px, black calc(100% - 10px), transparent);
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

/* Set apart from the months that scroll beside it */
.synax-chip--today {
  font-weight: 600;
  color: rgba(var(--v-theme-on-surface), 0.9);
  background-color: rgba(var(--v-theme-primary), 0.18);
}

.synax-summary {
  display: flex;
  flex-wrap: wrap;
  gap: 2px 12px;
  padding: 8px 12px 0;
  font-size: 0.8em;
  color: rgba(var(--v-theme-on-surface), 0.6);
}

.synax-scroll {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overscroll-behavior: contain;
}

.synax-list {
  max-width: 640px;
  margin: 0 auto;
  padding: 0 12px calc(24px + env(safe-area-inset-bottom));
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

/* The day chosen in the date picker */
.synax-day--selected {
  padding-bottom: 4px;
  box-shadow: inset 0 0 0 2px rgba(var(--v-theme-primary), 0.75);
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
  color: inherit;
  text-decoration: none;
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
