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
    // Prefer the visitor's browser language when we support it.
    const nav = navigator.language?.slice(0, 2)
    if (isSupportedLang(nav)) return nav
    // Otherwise fall back to a previously stored (legacy numeric-id) preference.
    const legacy = window.localStorage?.getItem('LANGUAGE_LOCAL_STORAGE')
    if (legacy) {
        const fromLegacy = LANG_ID_TO_CODE[Number(legacy)]
        if (fromLegacy) return fromLegacy
    }
    return DEFAULT_LANG
}
