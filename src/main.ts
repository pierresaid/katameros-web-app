import { ViteSSG } from 'vite-ssg'
import { createPinia } from 'pinia'

import App from './App.vue'
import { routes } from './router'
import { createVuetifyInstance } from './plugins/vuetify'
import { createI18nInstance } from './plugins/i18n'
import './plugins/vee-validate'
import { setLocale as setVeeValidateLocale } from '@vee-validate/i18n'
import { isSupportedLang, DEFAULT_LANG, SUPPORTED_LANGS, SYNAX_LANGS, type SupportedLang } from './consts/supportedLangs'
import LANGUAGES from './consts/languages'
import { storySlugs } from './store/synaxarium'
import { hydrating } from './helpers/hydrating'

if (import.meta.env.SSR) {
  class NoopObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() { return [] }
  }
  const g = globalThis as any
  g.ResizeObserver ??= NoopObserver
  g.IntersectionObserver ??= NoopObserver
  g.MutationObserver ??= NoopObserver
  g.visualViewport ??= {
    width: 1024, height: 768, scale: 1,
    pageLeft: 0, pageTop: 0, offsetLeft: 0, offsetTop: 0,
    onresize: null, onscroll: null,
    addEventListener() {}, removeEventListener() {}, dispatchEvent() { return false },
  }
  if (g.window) {
    g.window.visualViewport ??= g.visualViewport
    // Every page renders a new app against this one window: the listeners added
    // to it (Vuetify's resize, VueUse's storage events) would keep every app in
    // memory, some 4 MB a page, and thousands of story pages run out of it.
    // Nothing listens while a page is prerendered.
    g.window.addEventListener = () => {}
    g.document.addEventListener = () => {}
  }
}

export const createApp = ViteSSG(
  App,
  { routes, base: import.meta.env.BASE_URL },
  ({ app, router, initialState, isClient, onSSRAppRendered }) => {
    const pinia = createPinia()
    app.use(pinia)

    if (import.meta.env.SSR) {
      onSSRAppRendered(() => {
        initialState.pinia = pinia.state.value
      })
    } else if (initialState.pinia) {
      pinia.state.value = initialState.pinia
    }

    const i18n = createI18nInstance()
    app.use(i18n)

    const vuetify = createVuetifyInstance(isClient, hydrating)
    app.use(vuetify)

    // Keep in-app URLs on the trailing-slash form the pages are served at
    // (first loads are redirected by the inline script in index.html).
    router.beforeEach((to) => {
      const last = to.path.slice(to.path.lastIndexOf('/') + 1)
      if (last && !last.includes('.')) {
        return { path: `${to.path}/`, query: to.query, hash: to.hash, replace: true }
      }
    })

    router.beforeEach((to) => {
      const param = to.params.lang
      const lang: SupportedLang = isSupportedLang(param as string)
        ? (param as SupportedLang)
        : DEFAULT_LANG
      i18n.global.locale.value = lang
      vuetify.locale.current.value = lang
      setVeeValidateLocale(lang)
    })
  },
  // The browser adopts the prerendered page it starts on, instead of drawing it again
  { hydration: hydrating },
)

export async function includedRoutes(_paths: string[], _routes: any[]) {
  return [
    '/',
    ...SUPPORTED_LANGS.flatMap(lang => [
      `/${lang}/`,
      `/${lang}/feasts/`,
      `/${lang}/about/`,
      `/${lang}/contact/`,
      // Prerendered so it reloads offline too; kept out of the index and the sitemap
      `/${lang}/slideshow/`,
      ...(SYNAX_LANGS.includes(lang) ? [`/${lang}/synaxarium/`] : []),
    ]),
    // Not in the app's build (--mode app): the app starts on its home page and
    // never loads these pages, which would only make it bigger
    ...(import.meta.env.MODE === 'app' ? [] : [
      // The "not found" page of each language: the host answers unknown
      // addresses with it and a 404 (moved to /<lang>/404.html after the build)
      ...SUPPORTED_LANGS.map(lang => `/${lang}/404/`),
      ...await storyRoutes(),
    ]),
  ]
}

// One page per story and language, for the stories the published synaxarium file has the text of
async function storyRoutes(): Promise<string[]> {
  if (!import.meta.env.SSR)
    return []
  const { loadPublishedStories } = await import('./services/synaxPrerender')
  const { stories } = await loadPublishedStories()
  return SYNAX_LANGS.flatMap((lang) => {
    const languageId = Object.values(LANGUAGES).find(l => l.code === lang)?.id
    return storySlugs(lang)
      .filter(slug => stories.has(`${slug}-${languageId}`))
      .map(slug => `/${lang}/synaxarium/${slug}/`)
  })
}
