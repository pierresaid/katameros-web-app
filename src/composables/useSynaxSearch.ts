import { computed, ref, shallowRef, watch, type Ref } from 'vue';
import type { SynaxEntry } from '@/types/synaxarium';
import { normalizeSearchText, searchTokens } from '@/helpers/searchText';
import { useReadings } from '@/store/readings';
import { currentSynaxVersion, synaxCacheIsCurrent } from '@/services/synaxCache';
import { loadStoryTexts, type StoryText } from '@/services/synaxTexts';

export interface TextMatch {
    entry: SynaxEntry;
    /** The story's text, for an excerpt around the words (made for the rows shown only) */
    text: string;
}

// The text is searched from this many letters: fewer would match nearly every story
const TEXT_MIN_LENGTH = 3;

/**
 * Searches the synaxarium for words, found in any order, in the titles first,
 * then in the text of the stories (`excerptAround` in helpers/searchText.ts
 * makes the passage to show). The text is the one downloaded for offline
 * reading; until it is there, only the titles are searched.
 */
export function useSynaxSearch(options: {
    /** In calendar order */
    entries: Ref<SynaxEntry[]>,
    query: Ref<string>,
    languageId: Ref<number>,
}) {
    const readings = useReadings();
    const tokens = computed(() => searchTokens(options.query.value));

    const titles = computed(() => options.entries.value.map(e => normalizeSearchText(e.Title)));
    const titleMatches = computed(() => {
        const words = tokens.value;
        if (!words.length)
            return [];
        return options.entries.value.filter((_, i) => words.every(word => titles.value[i]!.includes(word)));
    });

    const wantsText = computed(() => tokens.value.join('').length >= TEXT_MIN_LENGTH);
    const texts = shallowRef<Map<string, StoryText> | null>(null);
    /** 'titles': the stories' text is not downloaded (yet) */
    const textState = ref<'idle' | 'loading' | 'ready' | 'titles'>('idle');
    let textsKey = '';
    let request = 0;

    async function loadTexts() {
        if (!wantsText.value)
            return;
        const languageId = options.languageId.value;
        const key = `${currentSynaxVersion.value}-${languageId}`;
        if (texts.value && textsKey === key)
            return;
        const current = ++request;
        textState.value = 'loading';
        const info = await readings.fetchCacheVersionInfo();
        if (current !== request)
            return;
        if (!synaxCacheIsCurrent(info)) {
            texts.value = null;
            textState.value = 'titles';
            return;
        }
        try {
            const loaded = await loadStoryTexts(languageId, currentSynaxVersion.value);
            if (current !== request)
                return;
            texts.value = loaded;
            textsKey = key;
            textState.value = 'ready';
        } catch {
            if (current === request) {
                texts.value = null;
                textState.value = 'titles';
            }
        }
    }

    // Loaded at the first real search, again for another language, and once a
    // download of the stories completes
    if (!import.meta.env.SSR)
        watch([wantsText, options.languageId, currentSynaxVersion], loadTexts, { immediate: true });

    const textMatches = computed<TextMatch[]>(() => {
        const stories = texts.value;
        const words = tokens.value;
        if (!stories || !wantsText.value)
            return [];
        const inTitle = new Set(titleMatches.value.map(e => e.Slug));
        const matches: TextMatch[] = [];
        options.entries.value.forEach((entry, i) => {
            const story = stories.get(entry.Slug);
            if (!story || inTitle.has(entry.Slug))
                return;
            // Words may be split between the title and the text
            if (words.every(word => story.folded.includes(word) || titles.value[i]!.includes(word)))
                matches.push({ entry, text: story.text });
        });
        return matches;
    });

    const titlesOnly = computed(() => wantsText.value && textState.value === 'titles');

    return { tokens, titleMatches, textMatches, textState, titlesOnly };
}
