import { useStorage } from "@vueuse/core";
import { defineStore, skipHydrate } from "pinia";
import { ref } from "vue";

/**
 * Where the slideshow stands: the reading, then the verse (or story piece) at
 * the top of the slide. The other fields are fallbacks when that reading is
 * gone (another language may not have the same synaxarium stories).
 */
export interface SlideshowSpot {
    unitKey?: string;
    row?: string | number;
    group?: string;
    sectionId?: number;
}

export const useSlideshow = defineStore('slideshow', () => {
    // The slides' text size, apart from the reading page's zoom: a projector needs its own
    const zoom = skipHydrate(useStorage<number>("SLIDESHOW_ZOOM", 1));
    // Where it was left, to come back to it the same day (for this visit only)
    const lastSpot = ref<(SlideshowSpot & { date: string }) | null>(null);

    return { zoom, lastSpot };
})
