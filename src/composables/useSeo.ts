import { useHead } from '@unhead/vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { DEFAULT_LANG, SUPPORTED_LANGS, type SupportedLang } from '@/consts/supportedLangs'
import { useCurrentLang } from './useCurrentLang'

export const SITE_URL = 'https://katameros.app'

// Pages are prerendered as <path>/index.html, which the host only serves for the
// trailing-slash URL, so every canonical/hreflang URL must carry a trailing slash.
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
        // The bare root sends visitors to their own language, which is what
        // x-default is for: it is the home page's x-default and its own canonical.
        // The other pages fall back to DEFAULT_LANG (mirrors generate-sitemap.mjs).
        const rootUrl = `${SITE_URL}/`
        const xDefault = suffix === '/' ? rootUrl : urlFor(DEFAULT_LANG)
        const canonical = opts.isRoot ? rootUrl : urlFor(lang.value)
        // The language picker keeps the current page, so a page can be shown in a
        // language it has no content for (e.g. /de/synaxarium/): keep those out of the index.
        const indexable = opts.isRoot || langs.includes(lang.value)

        return {
            title: fullTitle,
            meta: [
                ...(indexable ? [] : [{ name: 'robots', content: 'noindex' }]),
                { name: 'description', content: description },
                { property: 'og:title', content: fullTitle },
                { property: 'og:description', content: description },
                { property: 'og:locale', content: lang.value },
                { property: 'og:url', content: canonical },
                { name: 'twitter:title', content: fullTitle },
                { name: 'twitter:description', content: description },
            ],
            // Noindexed pages keep a self canonical: when the host serves them the
            // root page as a fallback, this replaces the root's canonical.
            link: [
                { rel: 'canonical', href: canonical },
                ...(indexable ? [
                    ...langs.map(l => ({
                        rel: 'alternate',
                        hreflang: l,
                        href: urlFor(l),
                    })),
                    { rel: 'alternate', hreflang: 'x-default', href: xDefault },
                ] : []),
            ],
        }
    })
}
