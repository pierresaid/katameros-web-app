import type { RouteRecordRaw } from 'vue-router'
import Index from '@/views/index.vue'
import About from '@/views/about.vue'
import Contact from '@/views/contact.vue'
import Synaxarium from '@/views/synaxarium.vue'
import SynaxariumStory from '@/views/synaxarium-story.vue'
import Feasts from '@/views/feasts.vue'
import NotFound from '@/views/not-found.vue'
import RedirectHome from '@/views/redirect-home.vue'
import { LANG_PATTERN, SYNAX_LANG_PATTERN } from '@/consts/supportedLangs'

// Pages are prerendered as <path>/index.html, which the host only serves for the
// trailing-slash URL. Named links resolve to these paths, so they keep the slash;
// the slash-less forms still match.
export const routes: Array<RouteRecordRaw> = [
  { path: '/', component: RedirectHome, name: 'redirect-home' },
  { path: `/:lang${LANG_PATTERN}/`, component: Index, name: 'home' },
  // The list only exists in the languages that have a synaxarium: in the
  // others its address is an unknown page, not the list of another language
  {
    path: `/:lang${SYNAX_LANG_PATTERN}/synaxarium/`, component: Synaxarium, name: 'synaxarium',
    // Stories used to open over the list (?story=<slug>): those links go to the story's page
    beforeEnter: (to) => {
      const slug = to.query.story
      if (typeof slug === 'string' && /^[a-z0-9-]+$/.test(slug))
        return { name: 'synaxarium-story', params: { lang: to.params.lang, slug }, replace: true }
    },
  },
  // One page per story, by its permanent slug (see assets/synax-days-*.json)
  { path: `/:lang${LANG_PATTERN}/synaxarium/:slug([a-z0-9-]+)/`, component: SynaxariumStory, name: 'synaxarium-story' },
  { path: `/:lang${LANG_PATTERN}/feasts/`, component: Feasts, name: 'feasts' },
  { path: `/:lang${LANG_PATTERN}/about/`, component: About, name: 'about' },
  { path: `/:lang${LANG_PATTERN}/contact/`, component: Contact, name: 'contact' },
  // Full screen, without the header and the menu (see App.vue); loaded on demand
  {
    path: `/:lang${LANG_PATTERN}/slideshow/`, component: () => import('@/views/slideshow.vue'), name: 'slideshow',
    meta: { immersive: true },
  },
  { path: `/:lang${LANG_PATTERN}/:pathMatch(.*)*`, component: NotFound, name: 'not-found' },
  // Paths without a language, including the legacy pre-lang-prefix ones
  // (/synaxarium, /feasts, ...) — bounce through RedirectHome which preserves the suffix
  { path: '/:pathMatch(.*)*', component: RedirectHome },
]
