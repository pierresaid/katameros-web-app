import { storyCache } from './synaxCache';
import { normalizeSearchText } from '@/helpers/searchText';
import type { SynaxStory } from '@/types/synaxarium';

export interface StoryText {
    /** The story without its markup */
    text: string;
    /** The same, folded for searching */
    folded: string;
}

// Saved next to the stories, per synaxarium version and language: after the
// first search the texts are read in one go instead of story by story. A new
// version clears the stories, and these with them.
const bundleKey = (version: number, languageId: number) => `__texts-${version}-${languageId}`;

const loading = new Map<string, Promise<Map<string, StoryText>>>();

/** The text of every saved story of a language, by slug, for searching. */
export function loadStoryTexts(languageId: number, version: number): Promise<Map<string, StoryText>> {
    const key = bundleKey(version, languageId);
    let texts = loading.get(key);
    if (!texts) {
        texts = readTexts(languageId, version);
        loading.set(key, texts);
        texts.catch(() => loading.delete(key));
    }
    return texts;
}

async function readTexts(languageId: number, version: number): Promise<Map<string, StoryText>> {
    const key = bundleKey(version, languageId);
    let list = await storyCache.getItem<[string, string][]>(key).catch(() => null);
    if (!list) {
        const found: [string, string][] = [];
        const template = document.createElement('template');
        await storyCache.iterate<unknown, void>((value, itemKey) => {
            const story = value as SynaxStory | null;
            if (!story?.slug || !story.html || itemKey !== `${story.slug}-${languageId}`)
                return;
            // A space after each paragraph, so the words of two paragraphs don't run together
            template.innerHTML = story.html.replace(/<\/(p|li|div|h\d)>|<br\s*\/?>/gi, '$& ');
            found.push([story.slug, (template.content.textContent ?? '').replace(/\s+/g, ' ').trim()]);
        });
        list = found;
        storyCache.setItem(key, list).catch(() => { });
    }
    return new Map(list.map(([slug, text]) => [slug, { text, folded: normalizeSearchText(text) }]));
}
