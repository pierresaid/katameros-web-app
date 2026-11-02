import { Capacitor } from '@capacitor/core';

// Safari (iPad) still only has the prefixed API
type FullscreenDocument = Document & {
    webkitFullscreenEnabled?: boolean;
    webkitFullscreenElement?: Element | null;
    webkitExitFullscreen?: () => Promise<void> | void;
};
type FullscreenElement = HTMLElement & {
    webkitRequestFullscreen?: () => Promise<void> | void;
};

/**
 * Whether the browser can go fullscreen. Not in the native app (the webview
 * does not support it; the status bar is hidden instead), nor on iPhone.
 */
export function canFullscreen(): boolean {
    if (typeof document === 'undefined' || Capacitor.isNativePlatform())
        return false;
    const doc = document as FullscreenDocument;
    return !!(doc.fullscreenEnabled || doc.webkitFullscreenEnabled);
}

export function isFullscreen(): boolean {
    if (typeof document === 'undefined')
        return false;
    const doc = document as FullscreenDocument;
    return !!(doc.fullscreenElement || doc.webkitFullscreenElement);
}

/**
 * Must run during a click or a key press. The whole page goes fullscreen, not
 * one element: Vuetify's menus are mounted on <body> and would not show.
 */
export function enterFullscreen() {
    if (!canFullscreen() || isFullscreen())
        return;
    const root = document.documentElement as FullscreenElement;
    try {
        const result = root.requestFullscreen
            ? root.requestFullscreen({ navigationUI: 'hide' })
            : root.webkitRequestFullscreen?.();
        Promise.resolve(result).catch(() => { });
    } catch {
        // refused (no user gesture, or blocked): the slideshow still fills the window
    }
}

export function exitFullscreen() {
    if (!isFullscreen())
        return;
    const doc = document as FullscreenDocument;
    try {
        const result = doc.exitFullscreen ? doc.exitFullscreen() : doc.webkitExitFullscreen?.();
        Promise.resolve(result).catch(() => { });
    } catch {
        // already left
    }
}

/** Calls back when fullscreen starts or ends; returns the function that stops listening. */
export function onFullscreenChange(callback: () => void): () => void {
    document.addEventListener('fullscreenchange', callback);
    document.addEventListener('webkitfullscreenchange', callback);
    return () => {
        document.removeEventListener('fullscreenchange', callback);
        document.removeEventListener('webkitfullscreenchange', callback);
    };
}
