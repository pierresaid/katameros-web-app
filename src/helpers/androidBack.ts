import type { Router } from 'vue-router';
import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';
import { closeTopOverlay } from '@/composables/useBackClose';
import { detectLang, isSupportedLang } from '@/consts/supportedLangs';

export type BackAction = 'closed' | 'back' | 'home' | 'exit';

/**
 * What the Android back button does, in order: close the open sheet, dialog or
 * drawer; go back to the previous page in the same language; otherwise go to
 * the readings; on the readings, leave the app.
 */
export function handleBack(router: Router): BackAction {
    if (closeTopOverlay())
        return 'closed';
    const route = router.currentRoute.value;
    // Stepping back over a language switch would undo it (and save the old
    // language again), so only go back within the same language.
    const back = router.options.history.state.back;
    if (typeof back === 'string' && router.resolve(back).params.lang === route.params.lang) {
        router.back();
        return 'back';
    }
    if (route.name !== 'home') {
        const param = route.params.lang as string | undefined;
        const lang = isSupportedLang(param) ? param : detectLang();
        router.replace({ name: 'home', params: { lang } });
        return 'home';
    }
    // Same as Android's own back on a root screen: the app goes to the background
    App.minimizeApp().catch(() => { });
    return 'exit';
}

export function setupAndroidBackButton(router: Router) {
    if (import.meta.env.DEV && typeof window !== 'undefined') {
        // Lets the back button logic be tried in a desktop browser during development
        (window as any).__katamerosBack = () => handleBack(router);
    }
    if (Capacitor.getPlatform() !== 'android')
        return;
    App.addListener('backButton', () => handleBack(router));
}
