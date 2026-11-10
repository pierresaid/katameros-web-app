import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { OpenedStory, SynaxEntry, SynaxStory } from '@/types/synaxarium';

// Import all language files
import synaxDataFr from '../../assets/synax-days-fr.json';
import synaxDataEn from '../../assets/synax-days-en.json';
import synaxDataAr from '../../assets/synax-days-ar.json';
import synaxDataIt from '../../assets/synax-days-it.json';
import synaxDataDe from '../../assets/synax-days-de.json';
import synaxDataNl from '../../assets/synax-days-nl.json';

// Map language codes to their data
const synaxDataMap: Record<string, SynaxEntry[]> = {
  'fr': synaxDataFr as SynaxEntry[],
  'en': synaxDataEn as SynaxEntry[],
  'ar': synaxDataAr as SynaxEntry[],
  'it': synaxDataIt as SynaxEntry[],
  'de': synaxDataDe as SynaxEntry[],
  'nl': synaxDataNl as SynaxEntry[],
};

// The languages each story is written in, by slug
const slugLanguages = new Map<string, string[]>();
for (const [code, list] of Object.entries(synaxDataMap)) {
  for (const entry of list) {
    const codes = slugLanguages.get(entry.Slug);
    if (codes) {
      codes.push(code);
    } else {
      slugLanguages.set(entry.Slug, [code]);
    }
  }
}

/** The slugs of the stories written in a language, for the pages to prerender */
export const storySlugs = (languageCode: string): string[] =>
  (synaxDataMap[languageCode] ?? []).map(entry => entry.Slug);

export const useSynaxarium = defineStore('synaxarium', () => {
  // Set by the synaxarium page from the route language: the persisted reading
  // language is only synced to the route once the app is mounted, so while a
  // page is prerendered it would still hold the default one.
  const currentLanguage = ref('fr');

  // A language without a synaxarium (Polish, Spanish) has no entries: no
  // other language takes its place
  const setLanguage = (languageCode: string) => {
    currentLanguage.value = languageCode;
  };

  // Derived rather than stored so the list isn't serialized into the prerendered page
  const entries = computed(() => synaxDataMap[currentLanguage.value] ?? []);

  // Calendar order: by month, then day; the stories of a day keep their order
  const sortedEntries = computed(() =>
    [...entries.value].sort((a, b) => a.Month - b.Month || a.Day - b.Day)
  );

  /** The codes of the languages a story is written in */
  const languagesOf = (slug: string): string[] => slugLanguages.get(slug) ?? [];

  // The story a page was prerendered with, keyed `{slug}-{languageId}`: it
  // travels with the page, so the browser starts from the same text. With
  // the synaxarium version it is from: while that is still the published
  // one, the text is not asked for again.
  const prerendered = ref<Record<string, SynaxStory>>({});
  const prerenderedVersion = ref(0);

  // The story last opened from the list, and the one shown when its page was
  // left for the list (read once by the list, to come back to its row)
  const opened = ref<OpenedStory | null>(null);
  const returnTo = ref<string | null>(null);

  return {
    entries,
    sortedEntries,
    currentLanguage,
    setLanguage,
    languagesOf,
    prerendered,
    prerenderedVersion,
    opened,
    returnTo,
  };
});
