import localforage from 'localforage';
import { useStorage } from '@vueuse/core';
import type { CacheVersionInfo } from '@/store/readings';
import type { SynaxStory } from '@/types/synaxarium';

// Its own localforage instance, apart from the saved readings: a new readings
// file replaces every saved reading, and must not touch the stories.
export const storyCache = localforage.createInstance({ name: 'katameros-synaxarium' });

// The synaxarium version the saved stories come from (the search waits for it to load the texts)
export const currentSynaxVersion = useStorage<number>('CURRENT_SYNAX_CACHE_VERSION', 0);
let downloading = false;

export function synaxCacheIsCurrent(info: CacheVersionInfo | null): boolean {
    return !!info?.SynaxVersion && currentSynaxVersion.value === info.SynaxVersion;
}

/**
 * Downloads every story when a new synaxarium version is published, keyed like
 * the stories saved one by one ("{slug}-{languageId}"). The readings store calls
 * it once the readings are loaded, so it never slows them down.
 */
export async function loadSynaxCache(info: CacheVersionInfo) {
    if (downloading || !info.SynaxVersion || !info.SynaxDataUrl || synaxCacheIsCurrent(info))
        return;
    downloading = true;
    try {
        const response = await fetch(info.SynaxDataUrl);
        if (!response.ok)
            return;
        const stories = await response.json() as Record<string, SynaxStory>;
        // An answer that is not the stories (an error page) never replaces the saved ones
        const keys = stories && typeof stories === 'object' ? Object.keys(stories) : [];
        if (!keys.length || !keys.every(key => typeof stories[key]?.html === 'string'))
            return;
        // The new stories are written over the saved ones, then what was saved
        // before and is not in the file (older stories, the texts gathered for
        // the search) is removed: stopped halfway, the device still has every
        // story it had, and the version is only recorded once all are written
        const savedBefore = await storyCache.keys();
        for (const [key, story] of Object.entries(stories))
            await storyCache.setItem(key, story);
        for (const key of savedBefore) {
            if (!(key in stories))
                await storyCache.removeItem(key);
        }
        currentSynaxVersion.value = info.SynaxVersion;
    } catch {
        // offline or interrupted: the next readings load tries again
    } finally {
        downloading = false;
    }
}
