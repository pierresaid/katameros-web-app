import { useStorage } from "@vueuse/core";
import { defineStore } from "pinia";
import { ref } from "vue";

const THEME_LOCAL_STORAGE = "THEME_LOCAL_STORAGE";
const LINEMODE_LOCAL_STORAGE = "LINEMODE_LOCAL_STORAGE";

export const useMenu = defineStore('menu', () => {
    const navOpen = ref(false)
    const configOpen = ref(false)
    const defaultTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    const theme = useStorage<'light' | 'dark'>(THEME_LOCAL_STORAGE, defaultTheme)
    const spacing = useStorage<'line' | 'paragraph'>(LINEMODE_LOCAL_STORAGE, 'line')
    const zoom = useStorage<number>("ZOOM_LOCAL_STORAGE", 1);

    const dateDialog = ref(false)

    return { navOpen, configOpen, theme, spacing, dateDialog, zoom }
})