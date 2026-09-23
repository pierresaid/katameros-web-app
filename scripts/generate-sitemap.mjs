import { writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const SITE_URL = 'https://katameros.app'
const SUPPORTED_LANGS = ['fr', 'en', 'ar', 'it', 'de', 'pl', 'es', 'nl', 'th']
const DEFAULT_LANG = 'fr'
const SYNAX_LANGS = new Set(['fr', 'en', 'ar', 'it', 'nl'])
const ROUTES = ['', '/feasts', '/about', '/contact', '/synaxarium']

const __dirname = dirname(fileURLToPath(import.meta.url))
const distDir = resolve(__dirname, '../dist')

if (!existsSync(distDir)) {
    mkdirSync(distDir, { recursive: true })
}

// Trailing slash everywhere: the pages are prerendered as <path>/index.html,
// which the host only serves for the trailing-slash URL.
function urlFor(lang, route) {
    return `${SITE_URL}/${lang}${route}/`
}

// The bare root sends visitors to their own language, so it is the home
// page's x-default; the other pages fall back to DEFAULT_LANG (mirrors useSeo.ts).
const ROOT_URL = `${SITE_URL}/`
function xDefaultFor(route) {
    return route === '' ? ROOT_URL : urlFor(DEFAULT_LANG, route)
}

function entryFor(loc, route, langsForRoute) {
    const alts = langsForRoute
        .map(l => `    <xhtml:link rel="alternate" hreflang="${l}" href="${urlFor(l, route)}" />`)
        .join('\n')
    const xDefault = `    <xhtml:link rel="alternate" hreflang="x-default" href="${xDefaultFor(route)}" />`
    return `  <url>
    <loc>${loc}</loc>
${alts}
${xDefault}
  </url>`
}

const urls = [entryFor(ROOT_URL, '', SUPPORTED_LANGS)]
for (const route of ROUTES) {
    const langs = route === '/synaxarium'
        ? SUPPORTED_LANGS.filter(l => SYNAX_LANGS.has(l))
        : SUPPORTED_LANGS
    for (const lang of langs) {
        urls.push(entryFor(urlFor(lang, route), route, langs))
    }
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join('\n')}
</urlset>
`

writeFileSync(resolve(distDir, 'sitemap.xml'), sitemap)
console.log(`[sitemap] wrote dist/sitemap.xml (${urls.length} URLs)`)
