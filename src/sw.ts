/// <reference lib="webworker" />
import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching'
import { clientsClaim } from 'workbox-core'

declare let self: ServiceWorkerGlobalScope

self.skipWaiting()
clientsClaim()

cleanupOutdatedCaches()
// ?story= opens a synaxarium story on the precached page, so ignore it when
// matching the precache (offline reloads and shared links)
precacheAndRoute(self.__WB_MANIFEST, {
    ignoreURLParametersMatching: [/^utm_/, /^fbclid$/, /^story$/],
})
