import { Capacitor } from '@capacitor/core'

// The website's pages are built ahead (prerendered). When the browser starts on
// the very page that was built, the app adopts that page as it is (hydration)
// instead of emptying it and drawing it again: what the visitor already sees
// stays in place. The build stamps each page with its address (vite.config.ts).
// Any other start draws the page from nothing: the phone app, a "not found" page
// (built for another address), an old ?story= link (sent on to the story's page
// before anything shows).
function startsOnItsPrerenderedPage(): boolean {
  if (import.meta.env.SSR || Capacitor.isNativePlatform())
    return false
  const built = document.getElementById('app')?.getAttribute('data-page')
  if (!built)
    return false
  const path = location.pathname.endsWith('/') ? location.pathname : `${location.pathname}/`
  return built === path && !new URLSearchParams(location.search).has('story')
}

/**
 * True while the app adopts a prerendered page. Until it is in place, the app must
 * draw exactly what the build drew: saved settings are read afterwards (the stores
 * pass this to useStorage's initOnMounted), and Vuetify starts from the build's screen size.
 */
export const hydrating = startsOnItsPrerenderedPage()
