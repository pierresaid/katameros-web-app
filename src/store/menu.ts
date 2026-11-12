import { tryOnMounted, useStorage } from "@vueuse/core";
import { defineStore, skipHydrate } from "pinia";
import { ref } from "vue";
import { hydrating } from "@/helpers/hydrating";

const THEME_LOCAL_STORAGE = "THEME_LOCAL_STORAGE";
const LINEMODE_LOCAL_STORAGE = "LINEMODE_LOCAL_STORAGE";

function systemTheme(): 'light' | 'dark' {
    const prefersDark = typeof window !== 'undefined'
        && typeof window.matchMedia === 'function'
        && window.matchMedia('(prefers-color-scheme: dark)').matches
    return prefersDark ? 'dark' : 'light'
}

export const useMenu = defineStore('menu', () => {
    const navOpen = ref(false)
    // While the browser adopts a prerendered page (helpers/hydrating.ts), the saved
    // settings are read once the page is in place (initOnMounted): until then the
    // values are the build's, so that the app draws what the page already shows.
    // The build knows no system theme: its value is "light".
    const theme = skipHydrate(useStorage<'light' | 'dark'>(THEME_LOCAL_STORAGE, hydrating ? 'light' : systemTheme(), undefined,
        { initOnMounted: hydrating, writeDefaults: !hydrating }))
    if (hydrating) {
        // No saved choice yet: the system's theme, saved like a choice
        tryOnMounted(() => {
            if (localStorage.getItem(THEME_LOCAL_STORAGE) !== null)
                return
            const system = systemTheme()
            localStorage.setItem(THEME_LOCAL_STORAGE, system)
            theme.value = system
        })
    }
    const spacing = skipHydrate(useStorage<'line' | 'paragraph'>(LINEMODE_LOCAL_STORAGE, 'line', undefined, { initOnMounted: hydrating }))
    const zoom = skipHydrate(useStorage<number>("ZOOM_LOCAL_STORAGE", 1, undefined, { initOnMounted: hydrating }))

    const dateDialog = ref(false)

    return { navOpen, theme, spacing, dateDialog, zoom }
})
