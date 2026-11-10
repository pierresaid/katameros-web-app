import type { RouteLocationNormalizedLoaded, RouteLocationRaw } from 'vue-router';
import { SYNAX_LANGS } from '@/consts/supportedLangs';

/**
 * The page the reader is on, in another language. The synaxarium list only
 * exists in the languages that have a synaxarium: from it, the other
 * languages open on the readings.
 */
export function routeInLang(route: RouteLocationNormalizedLoaded, lang: string): RouteLocationRaw {
    if (route.name === 'synaxarium' && !(SYNAX_LANGS as readonly string[]).includes(lang))
        return { name: 'home', params: { lang } };
    return { name: (route.name as string) || 'home', params: { ...route.params, lang } };
}
