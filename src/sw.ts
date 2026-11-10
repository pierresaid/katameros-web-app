/// <reference lib="webworker" />
import { precacheAndRoute, cleanupOutdatedCaches, matchPrecache } from 'workbox-precaching'
import { clientsClaim } from 'workbox-core'

declare let self: ServiceWorkerGlobalScope

self.skipWaiting()
clientsClaim()

cleanupOutdatedCaches()
// Parameters the precached files are found without (offline reloads and
// shared links): ?q= searches the synaxarium, ?story= (old story links) goes
// on to the story's page and ?date= opens a day, all on a precached page;
// ?v= is how the icon font's stylesheet asks for the font file.
precacheAndRoute(self.__WB_MANIFEST, {
    ignoreURLParametersMatching: [/^utm_/, /^fbclid$/, /^story$/, /^q$/, /^date$/, /^v$/],
})

// The story pages are not precached (there are thousands, see vite.config.ts).
// Offline, a story link opens on the synaxarium page of its language, or the
// root page, and the app shows the story from the ones saved for offline reading.
const STORY_PAGE = /^\/([a-z]{2})\/synaxarium\/[a-z0-9-]+\/?$/

self.addEventListener('fetch', (event) => {
    const { request } = event
    const match = request.mode === 'navigate' ? STORY_PAGE.exec(new URL(request.url).pathname) : null
    if (!match)
        return
    event.respondWith(fetch(request).catch(async () =>
        await matchPrecache(`/${match[1]}/synaxarium/index.html`)
        ?? await matchPrecache('/index.html')
        ?? Response.error()))
})
