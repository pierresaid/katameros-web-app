import type { SupportedLang } from '@/consts/supportedLangs'
import type { AboutContent } from './types'
import fr from './fr'
import en from './en'
import ar from './ar'
import it from './it'
import de from './de'
import pl from './pl'
import es from './es'
import nl from './nl'

// The About page's copy in each language it is translated into. Not in Thai, by choice:
// Thai readers get the English copy, and the Thai page stays out of the index.
export const ABOUT_CONTENT = { fr, en, ar, it, de, pl, es, nl } satisfies Partial<Record<SupportedLang, AboutContent>>

export type AboutLang = keyof typeof ABOUT_CONTENT

// Keep in sync with ABOUT_LANGS in scripts/generate-sitemap.mjs
export const ABOUT_LANGS = Object.keys(ABOUT_CONTENT) as AboutLang[]

/** The language of the copy shown for an app language: its own, or English. */
export function aboutLang(lang: SupportedLang): AboutLang {
    return lang in ABOUT_CONTENT ? (lang as AboutLang) : 'en'
}
