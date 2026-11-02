/// <reference lib="webworker" />
import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching'
import { clientsClaim } from 'workbox-core'

declare let self: ServiceWorkerGlobalScope

self.skipWaiting()
clientsClaim()

cleanupOutdatedCaches()
// ?story= opens a synaxarium story and ?q= searches it, on the precached
// page, so ignore them when matching the precache (offline reloads and shared links)
precacheAndRoute(self.__WB_MANIFEST, {
    ignoreURLParametersMatching: [/^utm_/, /^fbclid$/, /^story$/, /^q$/],
})
