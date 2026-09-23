import type { RouteRecordRaw } from 'vue-router'
import Index from '@/views/index.vue'
import About from '@/views/about.vue'
import Contact from '@/views/contact.vue'
import Synaxarium from '@/views/synaxarium.vue'
import Feasts from '@/views/feasts.vue'
import NotFound from '@/views/not-found.vue'
import RedirectHome from '@/views/redirect-home.vue'
import { LANG_PATTERN } from '@/consts/supportedLangs'

// Pages are prerendered as <path>/index.html, which the host only serves for the
// trailing-slash URL. Named links resolve to these paths, so they keep the slash;
// the slash-less forms still match.
export const routes: Array<RouteRecordRaw> = [
  { path: '/', component: RedirectHome, name: 'redirect-home' },
  { path: `/:lang${LANG_PATTERN}/`, component: Index, name: 'home' },
  { path: `/:lang${LANG_PATTERN}/synaxarium/`, component: Synaxarium, name: 'synaxarium' },
  { path: `/:lang${LANG_PATTERN}/feasts/`, component: Feasts, name: 'feasts' },
  { path: `/:lang${LANG_PATTERN}/about/`, component: About, name: 'about' },
  { path: `/:lang${LANG_PATTERN}/contact/`, component: Contact, name: 'contact' },
  { path: `/:lang${LANG_PATTERN}/:pathMatch(.*)*`, component: NotFound, name: 'not-found' },
  // Paths without a language, including the legacy pre-lang-prefix ones
  // (/synaxarium, /feasts, ...) — bounce through RedirectHome which preserves the suffix
  { path: '/:pathMatch(.*)*', component: RedirectHome },
]
