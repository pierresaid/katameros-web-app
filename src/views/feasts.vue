<template>
  <v-container class="feasts-page">
    <h1 class="text-h4 mb-2">{{ $t('feasts.title') }}</h1>
    <p class="text-body-2 text-medium-emphasis mb-4">{{ $t('seo.feastsDescription') }}</p>

    <ClientOnly>
      <template #placeholder>
        <v-skeleton-loader type="heading, list-item-two-line@6" class="bg-transparent" />
      </template>

      <v-locale-provider :rtl="false">
        <div class="feasts-year-nav">
          <v-btn icon="mdi-chevron-left" variant="text" :aria-label="$t('aria.prevYear')" @click="year--" />
          <span class="feasts-year-label">{{ year }}</span>
          <v-btn icon="mdi-chevron-right" variant="text" :aria-label="$t('aria.nextYear')" @click="year++" />
        </div>
      </v-locale-provider>

      <button v-if="nextFeast && year === currentYear" type="button" class="next-feast-card"
        @click="openFeast(nextFeast)">
        <div class="next-feast-overline">{{ $t('feasts.next') }}</div>
        <div class="next-feast-name">{{ nextFeast.name }}</div>
        <div class="next-feast-date">
          {{ formatFeastDate(nextFeast, { weekday: 'long', day: 'numeric', month: 'long' }) }}
          · {{ copticDateOf(nextFeast) }}
        </div>
      </button>

      <template v-if="feasts.length">
        <section v-for="group in monthGroups" :key="group.month" class="feasts-month">
          <h2 class="feasts-month-label">{{ group.label }}</h2>
          <button v-for="feast in group.feasts" :key="`${feast.id}-${+feast.date}`" type="button"
            class="feast-item"
            :class="{
              'feast-item--past': feast.isPast && year === currentYear,
              'feast-item--next': feast.isNext && year === currentYear,
              'feast-item--today': feast.isToday,
            }"
            @click="openFeast(feast)">
            <span class="feast-item-date">
              <span class="feast-item-day">{{ formatFeastDate(feast, { day: 'numeric' }) }}</span>
              <span class="feast-item-weekday">{{ formatFeastDate(feast, { weekday: 'short' }) }}</span>
            </span>
            <span class="feast-item-main">
              <span class="feast-item-name">{{ feast.name }}</span>
              <span class="feast-item-coptic">{{ copticDateOf(feast) }}</span>
            </span>
            <v-icon class="feast-item-chevron" icon="mdi-chevron-right" size="small" />
          </button>
        </section>
      </template>
      <v-skeleton-loader v-else-if="loading" type="list-item-two-line@6" class="bg-transparent" />
      <div v-else class="feasts-empty">
        {{ $t('feasts.empty') }}
        <div class="mt-3">
          <v-btn variant="tonal" color="primary" @click="feastsStore.ensureYear(year)">
            {{ $t('reload') }}
          </v-btn>
        </div>
      </div>
    </ClientOnly>
  </v-container>
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue';
import { useSeo } from '@/composables/useSeo';
import { useFeastList } from '@/composables/useFeastList';
import { useFeasts } from '@/store/feasts';

useSeo({
  titleKey: 'feasts.title',
  descriptionKey: 'seo.feastsDescription',
});

const feastsStore = useFeasts();
const {
  year,
  currentYear,
  loading,
  feasts,
  nextFeast,
  monthGroups,
  formatFeastDate,
  copticDateOf,
  openFeast,
} = useFeastList();

// On first load of the current year, jump the timeline to the next upcoming
// feast so the past (dimmed) feasts don't have to be scrolled past. Offset
// clears the fixed app bar and shows a little context above.
let didAutoScroll = false;
function attemptScroll(retries = 60) {
  if (typeof window === 'undefined' || didAutoScroll) return;
  if (year.value === currentYear && nextFeast.value) {
    const el = document.querySelector<HTMLElement>('.feast-item--next');
    if (el) {
      didAutoScroll = true;
      const top = el.getBoundingClientRect().top + window.scrollY - 96;
      window.scrollTo({ top: Math.max(0, top), behavior: 'auto' });
      return;
    }
  }
  // The list is behind <ClientOnly> and its data may arrive after a fetch, so
  // keep retrying until the target row is actually in the DOM. setTimeout
  // (not requestAnimationFrame) so it still fires when the tab is backgrounded.
  if (retries > 0) setTimeout(() => attemptScroll(retries - 1), 50);
}

onMounted(() => {
  attemptScroll();
  // Re-arm when a later fetch first populates the list.
  watch([nextFeast, feasts], () => attemptScroll());
});
</script>

<style scoped>
.feasts-page {
  max-width: 640px;
}

.feasts-year-nav {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 16px;
}

.feasts-year-label {
  font-family: 'Suez one';
  font-size: 1.6em;
  min-width: 3.2em;
  text-align: center;
}

/* Hero card for the closest upcoming feast */
.next-feast-card {
  display: block;
  width: 100%;
  text-align: start;
  padding: 16px 20px;
  border-radius: 16px;
  margin-bottom: 24px;
  background-color: rgba(var(--v-theme-primary), 0.14);
  border: 1px solid rgba(var(--v-theme-primary), 0.35);
  transition: background-color 0.15s;
}

.next-feast-card:hover,
.next-feast-card:focus-visible {
  background-color: rgba(var(--v-theme-primary), 0.22);
}

.next-feast-overline {
  font-size: 0.72em;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: rgba(var(--v-theme-on-surface), 0.65);
  margin-bottom: 2px;
}

.next-feast-name {
  font-family: 'Suez one';
  font-size: 1.45em;
  line-height: 1.25;
}

.next-feast-date {
  margin-top: 2px;
  color: rgba(var(--v-theme-on-surface), 0.75);
}

.feasts-month {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-bottom: 18px;
}

.feasts-month-label {
  font-size: 0.78em;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: rgba(var(--v-theme-on-surface), 0.55);
  margin: 0 0 6px;
  padding-inline-start: 12px;
}

.feast-item {
  display: flex;
  align-items: center;
  gap: 14px;
  width: 100%;
  text-align: start;
  padding: 9px 12px;
  border-radius: 12px;
  transition: background-color 0.15s;
}

.feast-item:hover,
.feast-item:focus-visible {
  background-color: rgba(var(--v-theme-on-surface), 0.06);
}

.feast-item-date {
  flex: none;
  width: 2.9em;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.feast-item-day {
  font-family: 'Suez one';
  font-size: 1.35em;
  line-height: 1.15;
}

.feast-item-weekday {
  font-size: 0.68em;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: rgba(var(--v-theme-on-surface), 0.55);
}

.feast-item-main {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.feast-item-name {
  line-height: 1.3;
}

.feast-item-coptic {
  font-size: 0.78em;
  color: rgba(var(--v-theme-on-surface), 0.55);
}

.feast-item-chevron {
  margin-inline-start: auto;
  color: rgba(var(--v-theme-on-surface), 0.4);
}

[dir='rtl'] .feast-item-chevron {
  transform: scaleX(-1);
}

.feast-item--past {
  opacity: 0.55;
}

.feast-item--next {
  background-color: var(--feast-accent-soft);
}

.feast-item--next .feast-item-day {
  color: var(--feast-accent);
}

.feast-item--today {
  background-color: rgba(var(--v-theme-primary), 0.15);
}

.feasts-empty {
  text-align: center;
  padding: 32px 0;
  color: rgba(var(--v-theme-on-surface), 0.7);
}
</style>
