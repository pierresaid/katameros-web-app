import { CACHE_VERSION_URL, type CacheVersionInfo } from '@/store/readings';
import type { SynaxStory } from '@/types/synaxarium';

export interface PublishedStories {
    /** The synaxarium version the texts are from */
    version: number;
    /** Every published story, keyed `{slug}-{languageId}` like the saved stories */
    stories: Map<string, SynaxStory>;
}

// Build only: the story pages are prerendered with the text of the published
// synaxarium file (the one the app downloads for offline reading), fetched once
// per build. Without it the build stops: a build without the story pages would
// take them off the site and out of the sitemap.
let published: Promise<PublishedStories> | null = null;

// A few tries: one failed request should not cost a whole build
async function fetchJson<T>(url: string): Promise<T> {
    const tries = 3;
    for (let attempt = 1; ; attempt++) {
        try {
            const response = await fetch(url);
            if (!response.ok)
                throw new Error(`answered ${response.status}`);
            return await response.json() as T;
        } catch (error) {
            if (attempt === tries)
                throw new Error(`[synaxarium] ${url}: ${error instanceof Error ? error.message : error}`);
            await new Promise(resolve => setTimeout(resolve, attempt * 2000));
        }
    }
}

export function loadPublishedStories(): Promise<PublishedStories> {
    published ??= (async () => {
        const info = await fetchJson<CacheVersionInfo>(CACHE_VERSION_URL);
        if (!info.SynaxDataUrl || !info.SynaxVersion)
            throw new Error(`[synaxarium] ${CACHE_VERSION_URL} gives no synaxarium file`);
        const stories = await fetchJson<Record<string, SynaxStory>>(info.SynaxDataUrl);
        console.log(`[synaxarium] ${Object.keys(stories).length} stories from ${info.SynaxDataUrl}`);
        return { version: info.SynaxVersion, stories: new Map(Object.entries(stories)) };
    })();
    return published;
}
