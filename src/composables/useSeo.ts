import { useHead } from '@unhead/vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { DEFAULT_LANG, SUPPORTED_LANGS, type SupportedLang } from '@/consts/supportedLangs'
import { useCurrentLang } from './useCurrentLang'

const SITE_URL = 'https://katameros.app'

// Netlify serves the prerendered pages as directories and 301s the slash-less
// form, so every canonical/hreflang URL must carry a trailing slash.
function pathWithoutLang(fullPath: string): string {
    const match = fullPath.match(/^\/[a-z]{2}(\/.*)?$/)
    const suffix = match ? (match[1] ?? '/') : fullPath
    if (suffix === '' || suffix === '/') return '/'
    return suffix.endsWith('/') ? suffix : `${suffix}/`
}

interface SeoOptions {
    titleKey?: string
    descriptionKey?: string
    isRoot?: boolean
    brandOnly?: boolean
    /** Languages this route actually exists in (defaults to all). */
    langs?: readonly SupportedLang[]
}

export function useSeo(titleKey: string | SeoOptions, descriptionKey?: string) {
    const opts: SeoOptions = typeof titleKey === 'string'
        ? { titleKey, descriptionKey }
        : titleKey

    const { t } = useI18n()
    const route = useRoute()
    const lang = useCurrentLang()
    const langs = opts.langs ?? SUPPORTED_LANGS

    useHead(() => {
        const brand = t('seo.brand')
        const brandOnly = opts.isRoot || opts.brandOnly || !opts.titleKey
        const fullTitle = brandOnly ? brand : `${t(opts.titleKey!)} - ${brand}`
        const description = t(opts.descriptionKey ?? 'seo.tagline')
        const suffix = pathWithoutLang(route.path)
        const urlFor = (l: SupportedLang) => `${SITE_URL}/${l}${suffix}`
        // The bare root duplicates the default-language page, so both it and
        // x-default resolve to the DEFAULT_LANG URL (mirrors generate-sitemap.mjs).
        const canonical = opts.isRoot ? urlFor(DEFAULT_LANG) : urlFor(lang.value)

        return {
            title: fullTitle,
            meta: [
                { name: 'description', content: description },
                { property: 'og:title', content: fullTitle },
                { property: 'og:description', content: description },
                { property: 'og:locale', content: lang.value },
                { property: 'og:url', content: canonical },
                { name: 'twitter:title', content: fullTitle },
                { name: 'twitter:description', content: description },
            ],
            link: [
                { rel: 'canonical', href: canonical },
                ...langs.map(l => ({
                    rel: 'alternate',
                    hreflang: l,
                    href: urlFor(l),
                })),
                { rel: 'alternate', hreflang: 'x-default', href: urlFor(DEFAULT_LANG) },
            ],
        }
    })
}
