import { writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const SITE_URL = 'https://katameros.app'
const SUPPORTED_LANGS = ['fr', 'en', 'ar', 'it', 'de', 'pl', 'es', 'nl', 'th']
const SYNAX_LANGS = new Set(['fr', 'en', 'ar', 'it'])
const ROUTES = ['', '/about', '/contact', '/synaxarium']

const __dirname = dirname(fileURLToPath(import.meta.url))
const distDir = resolve(__dirname, '../dist')

if (!existsSync(distDir)) {
    mkdirSync(distDir, { recursive: true })
}

function urlFor(lang, route) {
    return `${SITE_URL}/${lang}${route === '' ? '/' : route}`
}

function entryFor(lang, route, langsForRoute) {
    const alts = langsForRoute
        .map(l => `    <xhtml:link rel="alternate" hreflang="${l}" href="${urlFor(l, route)}" />`)
        .join('\n')
    const xDefault = `    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}${route === '' ? '/' : route}" />`
    return `  <url>
    <loc>${urlFor(lang, route)}</loc>
${alts}
${xDefault}
  </url>`
}

const urls = []
for (const route of ROUTES) {
    const langs = route === '/synaxarium'
        ? SUPPORTED_LANGS.filter(l => SYNAX_LANGS.has(l))
        : SUPPORTED_LANGS
    for (const lang of langs) {
        urls.push(entryFor(lang, route, langs))
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
