import localforage from 'localforage';
import { useStorage } from '@vueuse/core';
import type { CacheVersionInfo } from '@/store/readings';
import type { SynaxStory } from '@/types/synaxarium';

// Its own localforage instance, so the readings cache reload
// (localforage.clear() on a version bump) does not wipe the stories.
export const storyCache = localforage.createInstance({ name: 'katameros-synaxarium' });

// The synaxarium version the saved stories come from
const currentSynaxVersion = useStorage<number>('CURRENT_SYNAX_CACHE_VERSION', 0);
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
        // Cleared only after a successful download, so a failed one keeps the saved stories for offline use
        await storyCache.clear();
        for (const [key, story] of Object.entries(stories))
            await storyCache.setItem(key, story);
        currentSynaxVersion.value = info.SynaxVersion;
    } catch {
        // offline or interrupted: the next readings load tries again
    } finally {
        downloading = false;
    }
}
