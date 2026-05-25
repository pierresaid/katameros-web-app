import type { RouteRecordRaw } from 'vue-router'
import Index from '@/views/index.vue'
import About from '@/views/about.vue'
import Contact from '@/views/contact.vue'
import Synaxarium from '@/views/synaxarium.vue'
import RedirectHome from '@/views/redirect-home.vue'
import { LANG_PATTERN } from '@/consts/supportedLangs'

export const routes: Array<RouteRecordRaw> = [
  { path: '/', component: RedirectHome, name: 'redirect-home' },
  // Legacy paths (pre-lang-prefix) — bounce through RedirectHome which preserves the suffix
  { path: '/synaxarium', component: RedirectHome },
  { path: '/about', component: RedirectHome },
  { path: '/contact', component: RedirectHome },
  { path: `/:lang${LANG_PATTERN}`, component: Index, name: 'home' },
  { path: `/:lang${LANG_PATTERN}/synaxarium`, component: Synaxarium, name: 'synaxarium' },
  { path: `/:lang${LANG_PATTERN}/about`, component: About, name: 'about' },
  { path: `/:lang${LANG_PATTERN}/contact`, component: Contact, name: 'contact' },
]
