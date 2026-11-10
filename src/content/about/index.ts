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

// The About page's copy, in every language of the app
export const ABOUT_CONTENT = { fr, en, ar, it, de, pl, es, nl } satisfies Record<SupportedLang, AboutContent>

export type AboutLang = keyof typeof ABOUT_CONTENT
