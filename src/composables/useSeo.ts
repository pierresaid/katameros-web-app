import { useHead } from '@unhead/vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { SUPPORTED_LANGS } from '@/consts/supportedLangs'
import { useCurrentLang } from './useCurrentLang'

const SITE_URL = 'https://katameros.app'

function pathWithoutLang(fullPath: string): string {
    const match = fullPath.match(/^\/[a-z]{2}(\/.*)?$/)
    if (!match) return fullPath
    const suffix = match[1] ?? '/'
    return suffix === '' ? '/' : suffix
}

interface SeoOptions {
    titleKey?: string
    descriptionKey?: string
    isRoot?: boolean
    brandOnly?: boolean
}

export function useSeo(titleKey: string | SeoOptions, descriptionKey?: string) {
    const opts: SeoOptions = typeof titleKey === 'string'
        ? { titleKey, descriptionKey }
        : titleKey

    const { t } = useI18n()
    const route = useRoute()
    const lang = useCurrentLang()

    useHead(() => {
        const brand = t('seo.brand')
        const brandOnly = opts.isRoot || opts.brandOnly || !opts.titleKey
        const fullTitle = brandOnly ? brand : `${t(opts.titleKey!)} - ${brand}`
        const description = t(opts.descriptionKey ?? 'seo.tagline')
        const suffix = pathWithoutLang(route.path)
        const canonical = opts.isRoot
            ? `${SITE_URL}/`
            : `${SITE_URL}/${lang.value}${suffix === '/' ? '/' : suffix}`

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
                ...SUPPORTED_LANGS.map(l => ({
                    rel: 'alternate',
                    hreflang: l,
                    href: `${SITE_URL}/${l}${suffix === '/' ? '/' : suffix}`,
                })),
                { rel: 'alternate', hreflang: 'x-default', href: `${SITE_URL}${suffix === '/' ? '/' : suffix}` },
            ],
        }
    })
}
