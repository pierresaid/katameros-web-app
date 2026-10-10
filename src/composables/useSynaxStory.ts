import { ref, watch, type Ref } from 'vue';
import localforage from 'localforage';
import type { SynaxStory } from '@/types/synaxarium';

// Its own localforage instance, so the readings cache reload
// (localforage.clear() on a version bump) does not wipe the stories.
const storyCache = localforage.createInstance({ name: 'katameros-synaxarium' });
const memory = new Map<string, SynaxStory>();

const baseURL = String(import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/+$/, '');

export type StoryStatus = 'idle' | 'loading' | 'ready' | 'unavailable' | 'notFound' | 'error';

// Network first so text corrections show up; the saved copy is the offline fallback.
async function loadStory(slug: string, languageId: number): Promise<{ status: StoryStatus, story: SynaxStory | null }> {
    const key = `${slug}-${languageId}`;
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
        const cached = memory.get(`${slug.value}-${languageId.value}`);
        story.value = cached ?? null;
        status.value = cached ? 'ready' : 'loading';
        const result = await loadStory(slug.value, languageId.value);
        if (current !== request)
            return;
        story.value = result.story;
        status.value = result.status;
    }

    if (!import.meta.env.SSR)
        watch([slug, languageId], load, { immediate: true });

    return { story, status, reload: load };
}
