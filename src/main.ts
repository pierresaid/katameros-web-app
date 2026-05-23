import { ViteSSG } from 'vite-ssg'
import { createPinia } from 'pinia'

import App from './App.vue'
import { routes } from './router'
import { createVuetifyInstance } from './plugins/vuetify'
import { createI18nInstance } from './plugins/i18n'
import './plugins/vee-validate'
import { setLocale as setVeeValidateLocale } from '@vee-validate/i18n'
import { isSupportedLang, DEFAULT_LANG, SUPPORTED_LANGS, type SupportedLang } from './consts/supportedLangs'

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

    const vuetify = createVuetifyInstance(isClient)
    app.use(vuetify)

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
)

const SYNAX_LANGS = new Set<SupportedLang>(['fr', 'en', 'ar', 'it'])

export async function includedRoutes(_paths: string[], _routes: any[]) {
  return [
    '/',
    ...SUPPORTED_LANGS.flatMap(lang => [
      `/${lang}`,
      `/${lang}/about`,
      `/${lang}/contact`,
      ...(SYNAX_LANGS.has(lang) ? [`/${lang}/synaxarium`] : []),
    ]),
  ]
}
