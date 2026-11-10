import { onServerPrefetch, ref, watch, type Ref } from 'vue';
import type { SynaxStory } from '@/types/synaxarium';
import { useReadings, type CacheVersionInfo } from '@/store/readings';
import { useSynaxarium } from '@/store/synaxarium';
import { storyCache, synaxCacheIsCurrent } from '@/services/synaxCache';

const memory = new Map<string, SynaxStory>();
const disableCache = import.meta.env.DEV;

const baseURL = String(import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/+$/, '');

export type StoryStatus = 'idle' | 'loading' | 'ready' | 'unavailable' | 'notFound' | 'error';

// Like the readings: while the saved stories are the published synaxarium version,
// they are read first. Otherwise the network comes first so text corrections show
// up, and the saved copy is the offline fallback. `built` is the text a
// prerendered page came with: while its version is the published one, it is
// the current text and the network is not asked.
async function loadStory(slug: string, languageId: number, fetchCacheVersionInfo: () => Promise<CacheVersionInfo | null>,
    built?: { story: SynaxStory, version: number }): Promise<{ status: StoryStatus, story: SynaxStory | null }> {
    const key = `${slug}-${languageId}`;
    const info = disableCache ? null : await fetchCacheVersionInfo();
    if (synaxCacheIsCurrent(info)) {
        const cached = await storyCache.getItem<SynaxStory>(key).catch(() => null);
        if (cached) {
            memory.set(key, cached);
            return { status: 'ready', story: cached };
        }
    }
    if (built && info?.SynaxVersion && info.SynaxVersion === built.version) {
        storyCache.setItem(key, built.story).catch(() => { });
        return { status: 'ready', story: built.story };
    }
    try {
        const response = await fetch(`${baseURL}/synaxarium/${encodeURIComponent(slug)}?languageId=${languageId}`,
            { headers: { Accept: 'application/json' } });
        if (response.ok) {
            const story = await response.json() as SynaxStory;
            memory.set(key, story);
            storyCache.setItem(key, story).catch(() => { });
            return { status: 'ready', story };
        }
        if (response.status === 404) {
            const problem = await response.json().catch(() => null);
            if (problem?.code === 'not-in-language')
                return { status: 'unavailable', story: null };
            if (problem?.code === 'unknown-story')
                return { status: 'notFound', story: null };
            // any other 404 (an API without this endpoint) is treated like an outage
        }
    } catch {
        // offline or API down: fall through to the saved copy
    }
    const saved = memory.get(key) ?? await storyCache.getItem<SynaxStory>(key).catch(() => null);
    return saved ? { status: 'ready', story: saved } : { status: 'error', story: null };
}

/** Loads the story for the given slug and language, and reloads when either changes. */
export function useSynaxStory(slug: Ref<string | null>, languageId: Ref<number>) {
    const readings = useReadings();
    const synaxStore = useSynaxarium();
    const story = ref<SynaxStory | null>(null);
    const status = ref<StoryStatus>('idle');
    let request = 0;

    async function load() {
        const current = ++request;
        if (!slug.value) {
            story.value = null;
            status.value = 'idle';
            return;
        }
        const key = `${slug.value}-${languageId.value}`;
        // A prerendered page starts on the text it was built with, then
        // checks whether a newer one was published
        const prerendered = synaxStore.prerendered[key];
        if (prerendered && !memory.has(key))
            memory.set(key, prerendered);
        const cached = memory.get(key);
        story.value = cached ?? null;
        status.value = cached ? 'ready' : 'loading';
        const result = await loadStory(slug.value, languageId.value, readings.fetchCacheVersionInfo,
            prerendered && { story: prerendered, version: synaxStore.prerenderedVersion });
        if (current !== request)
            return;
        story.value = result.story;
        status.value = result.status;
    }

    if (import.meta.env.SSR) {
        onServerPrefetch(async () => {
            if (!slug.value)
                return;
            const { loadPublishedStories } = await import('@/services/synaxPrerender');
            const key = `${slug.value}-${languageId.value}`;
            const { version, stories } = await loadPublishedStories();
            const found = stories.get(key);
            if (!found)
                return;
            story.value = found;
            status.value = 'ready';
            synaxStore.prerendered[key] = found;
            synaxStore.prerenderedVersion = version;
        });
    } else {
        watch([slug, languageId], load, { immediate: true });
    }

    return { story, status, reload: load };
}
