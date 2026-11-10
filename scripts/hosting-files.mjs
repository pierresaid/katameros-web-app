// After the website build: the files the static host (Cloudflare Workers
// static assets, see wrangler.jsonc) reads besides the pages themselves.
import { copyFileSync, existsSync, readdirSync, renameSync, rmSync, writeFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const distDir = resolve(dirname(fileURLToPath(import.meta.url)), '../dist')
const subDirs = dir => readdirSync(dir, { withFileTypes: true }).filter(e => e.isDirectory()).map(e => e.name)
const hasPage = (...parts) => existsSync(resolve(distDir, ...parts, 'index.html'))

// The languages are the folders the build made a "not found" page in
const langs = subDirs(distDir).filter(lang => hasPage(lang, '404'))
if (!langs.length)
    throw new Error('[hosting] no /<lang>/404/ page in dist: was the website built (not --mode app)?')

// 1. "Not found" pages. The host answers an unknown address with the nearest
// 404.html and a 404 status: the page of the address's language, or the root
// page for addresses without one (it sends legacy ones like /about on to
// their language, as before).
for (const lang of langs) {
    renameSync(resolve(distDir, lang, '404', 'index.html'), resolve(distDir, lang, '404.html'))
    rmSync(resolve(distDir, lang, '404'), { recursive: true })
}
copyFileSync(resolve(distDir, 'index.html'), resolve(distDir, '404.html'))

// 2. Permanent redirects from the pages' addresses without their final slash
// (the pages are served at <path>/index.html), so search engines keep one
// address per page. Only fixed rules: a placeholder for the stories
// (/fr/synaxarium/:slug) would also catch /fr/synaxarium/index.html, which the
// service worker fetches. The stories get the host's own redirect instead.
const redirects = []
for (const lang of langs) {
    redirects.push(`/${lang} /${lang}/ 301`)
    for (const page of subDirs(resolve(distDir, lang)).filter(page => hasPage(lang, page)))
        redirects.push(`/${lang}/${page} /${lang}/${page}/ 301`)
}
// Thai was offered until November 2026: its addresses go to the English pages
redirects.push('/th /en/ 301', '/th/* /en/:splat 301')
writeFileSync(resolve(distDir, '_redirects'), `${redirects.join('\n')}\n`)

console.log(`[hosting] ${langs.length + 1} not-found pages, ${redirects.length} redirects`)
