<template>
  <v-container class="feasts-page">
    <h1 class="d-sr-only">{{ $t('feasts.title') }}</h1>

    <ClientOnly>
      <template #placeholder>
        <v-skeleton-loader type="heading, list-item-two-line@6" class="bg-transparent" />
      </template>

      <v-locale-provider :rtl="false">
        <div class="feasts-year-nav">
          <v-btn icon="mdi-chevron-left" variant="text" :aria-label="$t('aria.prevYear')" @click="year--" />
          <span class="feasts-year-label">{{ year }}</span>
          <v-btn icon="mdi-chevron-right" variant="text" :aria-label="$t('aria.nextYear')" @click="year++" />
          <v-btn icon="mdi-calendar" variant="text" class="feasts-calendar-btn"
            :aria-label="$t('aria.openDatePicker')" @click="menu.dateDialog = true" />
        </div>
      </v-locale-provider>
      <DatePickerDialog v-model="menu.dateDialog" date-only />

      <button v-if="nextFeast && year === currentYear" type="button" class="next-feast-card"
        @click="showFeast(nextFeast)">
        <div class="next-feast-overline">{{ $t('feasts.next') }} · {{ formatDaysUntil(nextFeast) }}</div>
        <div class="next-feast-name">{{ nextFeast.name }}</div>
        <div class="next-feast-date">
          {{ formatFeastDate(nextFeast, { weekday: 'long', day: 'numeric', month: 'long' }) }}
          · {{ copticDateOf(nextFeast) }}
        </div>
        <v-icon class="next-feast-chevron" icon="mdi-chevron-right" />
      </button>

      <!-- The fasting seasons of the year, as a band above the day timeline -->
      <template v-if="fasts.length">
        <h2 class="feasts-section-label">{{ $t('feasts.fasts') }}</h2>
        <div class="fasts-strip">
          <button v-for="fast in fasts" :key="fast.id" type="button" class="fast-card"
            :class="{
              'fast-card--past': fast.isPast && year === currentYear,
              'fast-card--current': fast.isCurrent,
            }"
            @click="showFast(fast)">
            <span class="fast-card-name">{{ fast.name }}</span>
            <span class="fast-card-meta">{{ formatFastRange(fast) }} · {{ formatFastDuration(fast) }}</span>
            <span v-if="fast.description" class="fast-card-teaser">{{ fast.description }}</span>
            <span v-if="fast.isCurrent" class="fast-card-track" role="presentation">
              <span class="fast-card-progress" :style="{ width: `${Math.round(currentFastProgress * 100)}%` }" />
            </span>
          </button>
        </div>
      </template>

      <template v-if="feasts.length">
        <h2 class="feasts-section-label">{{ $t('feasts.feasts') }}</h2>
        <section v-for="group in monthGroups" :key="group.month" class="feasts-month">
          <h3 class="feasts-month-label">{{ group.label }}</h3>
          <button v-for="feast in group.feasts" :key="`${feast.id}-${+feast.date}`" type="button"
            class="feast-item"
            :class="{
              'feast-item--past': feast.isPast && year === currentYear,
              'feast-item--next': feast.isNext && year === currentYear,
              'feast-item--today': feast.isToday,
            }"
            @click="showFeast(feast)">
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
import { useSeo } from '@/composables/useSeo';
import { useFeastList } from '@/composables/useFeastList';
import { useFeastDetail } from '@/composables/useFeastDetail';
import { useFeasts } from '@/store/feasts';
import { useMenu } from '@/store/menu';
import DatePickerDialog from '@/components/date-picker-dialog.vue';

useSeo({
  titleKey: 'feasts.title',
  descriptionKey: 'seo.feastsDescription',
});

const feastsStore = useFeasts();
const menu = useMenu();
const {
  year,
  currentYear,
  loading,
  feasts,
  nextFeast,
  fasts,
  currentFastProgress,
  monthGroups,
  formatFeastDate,
  formatDaysUntil,
  formatFastRange,
  formatFastDuration,
  copticDateOf,
} = useFeastList();
const { showFeast, showFast } = useFeastDetail();
</script>

<style scoped>
.feasts-page {
  max-width: 640px;
}

.feasts-year-nav {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 16px;
}

/* Calendar shortcut sits at the edge so the year stays centered */
.feasts-calendar-btn {
  position: absolute;
  right: 0;
  opacity: 0.75;
}

.feasts-year-label {
  font-family: 'Suez one';
  font-size: 1.6em;
  min-width: 3.2em;
  text-align: center;
}

/* Hero card for the closest upcoming feast */
.next-feast-card {
  position: relative;
  display: block;
  width: 100%;
  text-align: start;
  padding: 16px 44px 16px 20px;
  border-radius: 16px;
  margin-bottom: 10px;
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

/* Disclosure marks: the rows and cards open a detail sheet */
.next-feast-chevron,
.feast-item-chevron {
  color: rgba(var(--v-theme-on-surface), 0.38);
  flex: none;
}

.next-feast-chevron {
  position: absolute;
  inset-inline-end: 14px;
  top: 50%;
  transform: translateY(-50%);
}

[dir="rtl"] .next-feast-chevron {
  transform: translateY(-50%) scaleX(-1);
}

[dir="rtl"] .feast-item-chevron {
  transform: scaleX(-1);
}

/* Quiet section headers above the fasts band and the feast list */
.feasts-section-label {
  font-size: 0.78em;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: rgba(var(--v-theme-on-surface), 0.45);
  margin: 0 0 10px;
  padding-inline-start: 12px;
}

/* The year's fasting seasons */
.fasts-strip {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 8px;
  margin-bottom: 28px;
}

.fast-card {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 2px;
  text-align: start;
  padding: 10px 14px;
  border-radius: 12px;
  background-color: var(--fast-accent-soft);
  border: 1px solid transparent;
  transition: background-color 0.15s;
}

.fast-card:hover,
.fast-card:focus-visible {
  background-color: var(--fast-accent-hover);
}

.fast-card-name {
  font-weight: 500;
  font-size: 0.92em;
  line-height: 1.3;
}

.fast-card-meta {
  font-size: 0.76em;
  color: rgba(var(--v-theme-on-surface), 0.6);
}

/* Two faded lines of the description that trail off: there is more to read */
.fast-card-teaser {
  margin-top: 5px;
  font-size: 0.8em;
  line-height: 1.4;
  color: rgba(var(--v-theme-on-surface), 0.62);
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
}

.fast-card--current {
  border-color: var(--fast-accent-border);
}

.fast-card-track {
  margin-top: 7px;
  height: 3px;
  border-radius: 2px;
  background-color: rgba(var(--v-theme-on-surface), 0.12);
  overflow: hidden;
}

.fast-card-progress {
  display: block;
  height: 100%;
  border-radius: 2px;
  background-color: var(--fast-accent);
}

.fast-card--past {
  opacity: 0.78;
}

.feasts-month {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-bottom: 20px;
}

/* Month chapter marks: the display face in the taupe accent, a clearly
   different level from the uppercase section eyebrow above the list */
.feasts-month-label {
  display: flex;
  align-items: center;
  gap: 12px;
  font-family: 'Suez one';
  font-weight: 400;
  font-size: 1.02em;
  text-transform: capitalize;
  color: var(--feast-accent);
  margin: 0 0 6px;
  padding-inline-start: 12px;
}

.feasts-month-label::after {
  content: '';
  flex: 1;
  height: 1px;
  background-color: rgba(var(--v-theme-on-surface), 0.08);
}

.feast-item {
  display: flex;
  align-items: center;
  gap: 14px;
  width: 100%;
  text-align: start;
  padding: 10px 12px;
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
  color: var(--feast-accent);
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
  flex: 1;
}

.feast-item-name {
  line-height: 1.3;
}

.feast-item-coptic {
  font-size: 0.78em;
  color: rgba(var(--v-theme-on-surface), 0.55);
}

.feast-item--past {
  opacity: 0.78;
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
