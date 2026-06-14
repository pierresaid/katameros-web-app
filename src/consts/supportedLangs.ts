export const SUPPORTED_LANGS = ['fr', 'en', 'ar', 'it', 'de', 'pl', 'es', 'nl', 'th'] as const
export type SupportedLang = typeof SUPPORTED_LANGS[number]

export const DEFAULT_LANG: SupportedLang = 'fr'

export const RTL_LANGS: Set<SupportedLang> = new Set(['ar'])

export const LANG_PATTERN = `(${SUPPORTED_LANGS.join('|')})`

const LANG_ID_TO_CODE: Record<number, SupportedLang> = {
    1: 'fr', 2: 'en', 3: 'ar', 4: 'it', 6: 'de', 7: 'pl', 8: 'es', 9: 'nl', 10: 'th',
}

export function isSupportedLang(value: string | undefined): value is SupportedLang {
    return !!value && (SUPPORTED_LANGS as readonly string[]).includes(value)
}

export function detectLang(): SupportedLang {
    if (typeof window === 'undefined' || typeof navigator === 'undefined') return DEFAULT_LANG
    // Honour the user's previously chosen language first. It's persisted as a
    // numeric id under LANGUAGE_LOCAL_STORAGE whenever the route language changes,
    // so a returning visitor keeps the language they last used.
    const stored = window.localStorage?.getItem('LANGUAGE_LOCAL_STORAGE')
    if (stored) {
        const fromStored = LANG_ID_TO_CODE[Number(stored)]
        if (fromStored) return fromStored
    }
    // First launch (nothing stored yet): fall back to the visitor's browser language.
    const nav = navigator.language?.slice(0, 2)
    if (isSupportedLang(nav)) return nav
    return DEFAULT_LANG
}
