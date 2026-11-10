<template>
  <article class="story-page">
    <a v-if="hasList" :href="listHref" class="story-back" @click="backToList">
      <v-icon icon="mdi-arrow-left" size="18" class="story-back-icon" />
      {{ $t('synaxarium.title') }}
    </a>

    <div class="story-eyebrow-row">
      <div class="story-eyebrow">{{ dateLine }}</div>
      <!-- The same story in another language -->
      <v-menu v-if="languages.length > 1" location="bottom end">
        <template #activator="{ props: activator }">
          <v-btn v-bind="activator" variant="text" size="small" class="story-language" prepend-icon="mdi-translate"
            append-icon="mdi-chevron-down" :aria-label="$t('synaxarium.storyLanguage')">
            {{ languageName }}
          </v-btn>
        </template>
        <v-list density="compact">
          <v-list-item v-for="language in languages" :key="language.id" :title="language.name"
            :active="language.id === storyLanguageId" @click="storyLanguageId = language.id" />
        </v-list>
      </v-menu>
    </div>
    <h1 v-if="shownTitle" class="story-title" :lang="storyLang" :dir="storyDir">{{ shownTitle }}</h1>

    <!-- The reading size applies once on the device: the page is prerendered at the default one -->
    <div v-if="status === 'ready' && story" class="story-text" :lang="storyLang" :dir="storyDir"
      :style="mounted ? { fontSize: textSize } : undefined" v-html="storyHtml"></div>
    <div v-else-if="status === 'loading' || status === 'idle'" class="story-loading" aria-busy="true">
      <span v-for="n in 7" :key="n" class="story-loading-line" />
    </div>
    <p v-else-if="status === 'unavailable'" class="story-message">{{ $t('synaxarium.unavailable') }}</p>
    <p v-else-if="status === 'notFound'" class="story-message">{{ $t('synaxarium.notFound') }}</p>
    <div v-else class="story-message">
      <p>{{ $t('synaxarium.loadError') }}</p>
      <v-btn variant="tonal" size="small" @click="reload">{{ $t('synaxarium.retry') }}</v-btn>
    </div>

    <nav v-if="sameDay.length" class="story-same-day" :aria-label="$t('synaxarium.sameDay')">
      <div class="story-same-day-label">{{ $t('synaxarium.sameDay') }}</div>
      <router-link v-for="other in sameDay" :key="other.Slug" :to="storyRoute(other.Slug)" replace
        class="story-same-day-item">
        {{ other.Title }}
      </router-link>
    </nav>

    <div class="story-actions">
      <!-- Left to right in every language, like the date arrows of the readings.
           From story to story the page is replaced, so back returns to the list. -->
      <div class="story-nav" dir="ltr">
        <v-btn icon="mdi-chevron-left" variant="text" size="small" density="comfortable" :disabled="!neighbours.prev"
          :to="neighbours.prev ? storyRoute(neighbours.prev.Slug) : undefined" replace
          :aria-label="$t('synaxarium.previous')" :title="$t('synaxarium.previous')" />
        <v-btn icon="mdi-chevron-right" variant="text" size="small" density="comfortable" :disabled="!neighbours.next"
          :to="neighbours.next ? storyRoute(neighbours.next.Slug) : undefined" replace
          :aria-label="$t('synaxarium.next')" :title="$t('synaxarium.next')" />
      </div>
      <v-btn icon="mdi-share-variant" variant="text" size="small" density="comfortable"
        :aria-label="$t('synaxarium.share')" :title="$t('synaxarium.share')" @click="share" />
      <v-spacer />
      <v-btn v-if="target" variant="flat" class="story-action" :loading="goingToDay" :size="xs ? 'small' : 'default'"
        @click="goToStoryDay(target)">
        {{ $t('synaxarium.goToDay') }}
      </v-btn>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { onBeforeRouteLeave, useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useDisplay } from 'vuetify';
import { useHead } from '@unhead/vue';
import { useSynaxarium } from '@/store/synaxarium';
import { useMenu } from '@/store/menu';
import { useNotif } from '@/store/notif';
import { useCurrentLang } from '@/composables/useCurrentLang';
import { useSynaxStory, type StoryStatus } from '@/composables/useSynaxStory';
import { useGoToStoryDay, type StoryTarget } from '@/composables/useGoToStoryDay';
import { SITE_URL, useSeo } from '@/composables/useSeo';
import { getCopticMonth } from '@/helpers/copticMonth';
import { copticToGregorian, toCoptic } from '@/helpers/copticDate';
import { findLanguage, languageDir } from '@/helpers/languages';
import { highlightHtml } from '@/helpers/searchText';
import { SYNAX_LANGS, type SupportedLang } from '@/consts/supportedLangs';
import LANGUAGES from '@/consts/languages';
import type { SynaxEntry } from '@/types/synaxarium';

const route = useRoute();
const router = useRouter();
const lang = useCurrentLang();
const synaxStore = useSynaxarium();
watch(lang, (code) => synaxStore.setLanguage(code), { immediate: true });
const menu = useMenu();
const notif = useNotif();
const { t, locale } = useI18n();
const { xs } = useDisplay();
const { goingToDay, goToStoryDay } = useGoToStoryDay();

const slug = computed(() => {
  const value = route.params.slug;
  return typeof value === 'string' && value ? value : null;
});

// The story is read in the page's language, or in another one the reader
// picks. A story that is not written in that language (German has fewer,
// Polish and Spanish have none) says so: no other language takes its place,
// and nothing is asked for.
const pageLanguageId = computed(() => Object.values(LANGUAGES).find(l => l.code === synaxStore.currentLanguage)?.id ?? 1);
const storyLanguageId = ref(pageLanguageId.value);
watch(pageLanguageId, (id) => { storyLanguageId.value = id; });
const storyLang = computed(() => findLanguage(storyLanguageId.value)?.code);
// The languages the story is written in (none for an unknown story: the API tells)
const storyLangs = computed(() => slug.value ? synaxStore.languagesOf(slug.value) : []);
const unavailable = computed(() => storyLangs.value.length > 0 && !storyLangs.value.includes(storyLang.value ?? ''));
const { story, status: loadStatus, reload } = useSynaxStory(computed(() => unavailable.value ? null : slug.value), storyLanguageId);
const status = computed<StoryStatus>(() => unavailable.value ? 'unavailable' : loadStatus.value);

const entry = computed(() => synaxStore.entries.find(e => e.Slug === slug.value) ?? null);
const shownTitle = computed(() => story.value?.title || entry.value?.Title || '');
const storyDir = computed(() => languageDir(storyLanguageId.value));
const languageName = computed(() => findLanguage(storyLanguageId.value)?.name ?? '');
const textSize = computed(() => `${Number((menu.zoom * 1).toFixed(2))}rem`);

// The Gregorian day depends on the year: it comes once on the device
const mounted = ref(false);
const copticYear = ref<number | null>(null);
onMounted(() => {
  copticYear.value = toCoptic(new Date())?.year ?? null;
  mounted.value = true;
});

// "23 Babah · 2 novembre"
const dateLine = computed(() => {
  const day = story.value?.day ?? entry.value?.Day;
  const month = story.value?.month ?? entry.value?.Month;
  if (!day || !month)
    return '';
  const gregorian = copticYear.value ? copticToGregorian(month, day, copticYear.value) : null;
  const gregorianText = gregorian
    ? new Intl.DateTimeFormat(String(locale.value), { day: 'numeric', month: 'long' }).format(gregorian)
    : '';
  return [`${day} ${getCopticMonth(month)}`, gregorianText].filter(Boolean).join(' · ');
});

const languages = computed(() => Object.values(LANGUAGES)
  .filter(l => storyLangs.value.includes(l.code))
  .map(l => ({ id: l.id, name: l.name })));

const storyRoute = (other: string) => ({ name: 'synaxarium-story', params: { lang: lang.value, slug: other } });

// Opened from search results: previous and next follow them, and the searched
// words are marked (never on a prerendered page: nothing was searched)
const context = computed(() => {
  const opened = synaxStore.opened;
  return opened && slug.value && opened.slugs.includes(slug.value) ? opened : null;
});
const storyHtml = computed(() => story.value && context.value
  ? highlightHtml(story.value.html, context.value.tokens)
  : story.value?.html ?? '');

// The other stories of the same day, and the stories before and after:
// in the results, or in the calendar
const sameDay = computed(() => synaxStore.sortedEntries
  .filter(e => e.Month === entry.value?.Month && e.Day === entry.value?.Day && e.Slug !== slug.value));
const neighbours = computed(() => {
  let list: SynaxEntry[] = synaxStore.sortedEntries;
  if (context.value) {
    const bySlug = new Map(list.map(e => [e.Slug, e]));
    list = context.value.slugs.map(s => bySlug.get(s)).filter((e): e is SynaxEntry => !!e);
  }
  const index = list.findIndex(e => e.Slug === slug.value);
  return {
    prev: index > 0 ? list[index - 1] : undefined,
    next: index !== -1 ? list[index + 1] : undefined,
  };
});

// Back to the list: a step back when the list is the page before, so it keeps
// its search and comes back to this story's row; otherwise the list itself.
// The list only exists in the languages that have a synaxarium.
const hasList = computed(() => (SYNAX_LANGS as readonly string[]).includes(lang.value));
const listRoute = computed(() => ({ name: 'synaxarium', params: { lang: lang.value } }));
const listHref = computed(() => hasList.value ? router.resolve(listRoute.value).href : '');
function backToList(e: MouseEvent) {
  if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)
    return;
  e.preventDefault();
  const back = router.options.history.state.back;
  const previous = typeof back === 'string' ? router.resolve(back) : null;
  if (previous?.name === 'synaxarium' && previous.params.lang === lang.value)
    router.back();
  else
    router.push(listRoute.value);
}

// Leaving for the list (back, the link above or the menu): it comes back to this story's row
onBeforeRouteLeave((to) => {
  synaxStore.returnTo = to.name === 'synaxarium' ? slug.value : null;
});

// Another story reads from its start, or from the first searched word once its text is in
let toStart = false;
async function showStart() {
  if (!toStart || status.value !== 'ready')
    return;
  toStart = false;
  await nextTick();
  const match = document.querySelector('.story-text mark.story-match');
  if (match)
    window.scrollTo({ top: Math.max(0, window.scrollY + match.getBoundingClientRect().top - 120) });
}
watch(slug, () => {
  window.scrollTo({ top: 0 });
  toStart = true;
  showStart();
}, { flush: 'post' });
watch(status, showStart, { flush: 'post' });

// The arrow keys go from story to story, like the buttons
function onKeydown(e: KeyboardEvent) {
  if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey)
    return;
  const target = e.target as HTMLElement | null;
  if (target?.closest('input, textarea, select, [contenteditable="true"]'))
    return;
  const which = e.key === 'ArrowLeft' ? 'prev' : e.key === 'ArrowRight' ? 'next' : null;
  const other = which ? neighbours.value[which] : undefined;
  if (!other)
    return;
  e.preventDefault();
  router.replace(storyRoute(other.Slug));
}
onMounted(() => {
  window.addEventListener('keydown', onKeydown);
  if (context.value) {
    toStart = true;
    showStart();
  }
});
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown));

const target = computed<StoryTarget | null>(() => story.value
  ? { Day: story.value.day, Month: story.value.month, StoryId: story.value.storyId, Title: story.value.title }
  : entry.value);

const pageUrl = computed(() => `${SITE_URL}/${lang.value}/synaxarium/${slug.value}/`);

// The beginning of the story, for search results and shared links
const excerpt = computed(() => {
  const text = (story.value?.html ?? '')
    .replace(/<sup>.*?<\/sup>/g, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
  if (text.length <= 160)
    return text;
  const cut = text.slice(0, 160);
  return `${cut.slice(0, cut.lastIndexOf(' '))}…`;
});

const seoTitle = computed(() => shownTitle.value.replace(/\.+$/, ''));
useSeo({
  title: () => seoTitle.value ? `${seoTitle.value} - ${t('synaxarium.title')}` : t('synaxarium.title'),
  description: () => excerpt.value || t('seo.synaxariumDescription'),
  // Shown in the languages it is written in; on the other pages (German without the story, Polish...) it is noindex
  langs: computed(() => SYNAX_LANGS.filter(l => storyLangs.value.includes(l)) as SupportedLang[]),
});

useHead(() => story.value ? {
  script: [{
    type: 'application/ld+json',
    // unhead escapes the "<" of JSON scripts
    innerHTML: JSON.stringify([
      {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: seoTitle.value,
        description: excerpt.value,
        inLanguage: storyLang.value,
        image: `${SITE_URL}/banner.png`,
        url: pageUrl.value,
        mainEntityOfPage: pageUrl.value,
        isPartOf: { '@type': 'WebSite', name: 'Katameros', url: `${SITE_URL}/` },
        publisher: { '@type': 'Organization', name: 'Katameros', logo: `${SITE_URL}/img/logo-512.png` },
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Katameros', item: `${SITE_URL}/${lang.value}/` },
          { '@type': 'ListItem', position: 2, name: t('synaxarium.title'), item: `${SITE_URL}/${lang.value}/synaxarium/` },
          { '@type': 'ListItem', position: 3, name: seoTitle.value, item: pageUrl.value },
        ],
      },
    ]),
  }],
} : {});

async function share() {
  const title = shownTitle.value || t('synaxarium.title');
  if (typeof navigator.share === 'function') {
    try {
      await navigator.share({ title, url: pageUrl.value });
    } catch {
      // closed without sharing
    }
    return;
  }
  try {
    await navigator.clipboard.writeText(pageUrl.value);
    notif.success(t('synaxarium.linkCopied'));
  } catch {
    // no clipboard either
  }
}
</script>

<style scoped>
.story-page {
  max-width: 680px;
  margin: 0 auto;
  padding: 12px 20px 0;
}

.story-back {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin: 4px 0 10px;
  font-size: 0.86em;
  font-weight: 600;
  text-decoration: none;
  color: rgba(var(--v-theme-on-surface), 0.7);
}

.story-back:hover {
  color: rgba(var(--v-theme-on-surface), 0.95);
}

[dir='rtl'] .story-back-icon {
  transform: scaleX(-1);
}

.story-eyebrow-row {
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 28px;
}

.story-eyebrow {
  flex: 1;
  min-width: 0;
  font-size: 0.76em;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: rgba(var(--v-theme-on-surface), 0.6);
}

.story-language.v-btn {
  margin-inline-end: -8px;
  text-transform: none;
  letter-spacing: normal;
  color: rgba(var(--v-theme-on-surface), 0.7);
}

.story-title {
  font-family: 'Suez one';
  font-weight: 400;
  font-size: 1.6em;
  line-height: 1.25;
  margin: 6px 0 14px;
  text-wrap: balance;
}

.story-text {
  line-height: 1.6;
  color: rgba(var(--v-theme-on-surface), 0.9);
}

.story-text :deep(p) {
  margin-bottom: 10px;
}

/* The searched words */
.story-text :deep(mark.story-match) {
  color: inherit;
  background-color: rgba(255, 193, 7, 0.35);
  border-radius: 3px;
  padding: 0 1px;
}

.story-same-day {
  margin: 10px 0 4px;
  padding-top: 12px;
  border-top: 1px solid rgba(var(--v-theme-on-surface), 0.08);
}

.story-same-day-label {
  margin-bottom: 4px;
  font-size: 0.76em;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: rgba(var(--v-theme-on-surface), 0.6);
}

.story-same-day-item {
  display: block;
  padding: 8px 10px;
  margin: 0 -10px;
  border-radius: 10px;
  line-height: 1.35;
  text-decoration: none;
  color: inherit;
  transition: background-color 0.15s;
}

.story-same-day-item:hover,
.story-same-day-item:focus-visible {
  background-color: rgba(var(--v-theme-on-surface), 0.06);
}

.story-loading {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 6px 0 18px;
}

.story-loading-line {
  height: 0.9em;
  border-radius: 4px;
  background-color: rgba(var(--v-theme-on-surface), 0.08);
  animation: story-pulse 1.4s ease-in-out infinite;
}

.story-loading-line:nth-child(3n) {
  width: 72%;
}

@keyframes story-pulse {
  50% {
    opacity: 0.45;
  }
}

.story-message {
  color: rgba(var(--v-theme-on-surface), 0.75);
  margin: 4px 0 16px;
}

.story-message p {
  margin-bottom: 10px;
}

/* The buttons stay reachable at the bottom while a long story scrolls */
.story-actions {
  position: sticky;
  bottom: 0;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px;
  margin-top: 8px;
  padding: 8px 0 calc(12px + env(safe-area-inset-bottom));
  background: rgb(var(--v-theme-background));
}

.story-nav {
  display: flex;
}

/* amber wash with a neutral label, like the feast sheet's action */
.story-action.v-btn {
  background-color: rgba(var(--v-theme-primary), 0.28);
  color: rgb(var(--v-theme-on-surface));
}
</style>
