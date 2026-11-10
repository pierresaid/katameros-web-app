import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const SITE_URL = 'https://katameros.app'
const SUPPORTED_LANGS = ['fr', 'en', 'ar', 'it', 'de', 'pl', 'es', 'nl']
const DEFAULT_LANG = 'fr'
const SYNAX_LANGS = new Set(['fr', 'en', 'ar', 'it', 'de', 'nl'])
const ROUTE_LANGS = { '/synaxarium': SYNAX_LANGS }
const ROUTES = ['', '/feasts', '/about', '/contact', '/synaxarium']

const __dirname = dirname(fileURLToPath(import.meta.url))
const distDir = resolve(__dirname, '../dist')
const assetsDir = resolve(__dirname, '../assets')

if (!existsSync(distDir)) {
    mkdirSync(distDir, { recursive: true })
}

// Trailing slash everywhere: the pages are prerendered as <path>/index.html,
// which the host only serves for the trailing-slash URL.
function urlFor(lang, route) {
    return `${SITE_URL}/${lang}${route}/`
}

// The bare root sends visitors to their own language, so it is the home
// page's x-default; the other pages fall back to DEFAULT_LANG, or to their
// first language when they do not exist in it (mirrors useSeo.ts).
const ROOT_URL = `${SITE_URL}/`
function xDefaultFor(route, langsForRoute) {
    if (route === '')
        return ROOT_URL
    return urlFor(langsForRoute.includes(DEFAULT_LANG) ? DEFAULT_LANG : langsForRoute[0], route)
}

function entryFor(loc, route, langsForRoute) {
    const alts = langsForRoute
        .map(l => `    <xhtml:link rel="alternate" hreflang="${l}" href="${urlFor(l, route)}" />`)
        .join('\n')
    const xDefault = `    <xhtml:link rel="alternate" hreflang="x-default" href="${xDefaultFor(route, langsForRoute)}" />`
    return `  <url>
    <loc>${loc}</loc>
${alts}
${xDefault}
  </url>`
}

function urlset(entries) {
    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries.join('\n')}
</urlset>
`
}

// The pages of the app
const pages = [entryFor(ROOT_URL, '', SUPPORTED_LANGS)]
for (const route of ROUTES) {
    const langs = ROUTE_LANGS[route]
        ? SUPPORTED_LANGS.filter(l => ROUTE_LANGS[route].has(l))
        : SUPPORTED_LANGS
    for (const lang of langs) {
        pages.push(entryFor(urlFor(lang, route), route, langs))
    }
}

// The synaxarium stories, one file per language so the search consoles count
// them apart: only the pages the build made, in calendar order
const storyLangs = SUPPORTED_LANGS.filter(l => SYNAX_LANGS.has(l))
const storySlugs = new Map(storyLangs.map(lang => {
    const entries = JSON.parse(readFileSync(resolve(assetsDir, `synax-days-${lang}.json`), 'utf8'))
    const slugs = entries
        .sort((a, b) => a.Month - b.Month || a.Day - b.Day)
        .map(e => e.Slug)
        .filter(slug => existsSync(resolve(distDir, lang, 'synaxarium', slug, 'index.html')))
    return [lang, slugs]
}))
const langsOfStory = new Map()
for (const [lang, slugs] of storySlugs) {
    for (const slug of slugs) {
        langsOfStory.set(slug, [...(langsOfStory.get(slug) ?? []), lang])
    }
}

const files = [['sitemap-pages.xml', pages]]
for (const [lang, slugs] of storySlugs) {
    if (slugs.length) {
        files.push([`sitemap-synaxarium-${lang}.xml`, slugs.map(slug =>
            entryFor(urlFor(lang, `/synaxarium/${slug}`), `/synaxarium/${slug}`, langsOfStory.get(slug)))])
    }
}

for (const [name, entries] of files) {
    writeFileSync(resolve(distDir, name), urlset(entries))
}

// sitemap.xml (named in robots.txt) lists the files
const index = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${files.map(([name]) => `  <sitemap>
    <loc>${SITE_URL}/${name}</loc>
  </sitemap>`).join('\n')}
</sitemapindex>
`
writeFileSync(resolve(distDir, 'sitemap.xml'), index)
console.log(`[sitemap] wrote dist/sitemap.xml: ${files.map(([name, entries]) => `${name} (${entries.length} URLs)`).join(', ')}`)
