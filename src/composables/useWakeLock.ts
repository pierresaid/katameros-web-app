import { onBeforeUnmount, onMounted } from 'vue';

/**
 * Keeps the screen on while the component is shown. For the web: the native
 * app keeps the screen on already (helpers/keepAwake.ts).
 */
export function useWakeLock() {
    let lock: WakeLockSentinel | null = null;
    let pending = false;
    let active = false;

    async function request() {
        if (!active || lock || pending || document.visibilityState !== 'visible' || !('wakeLock' in navigator))
            return;
        pending = true;
        try {
            const sentinel = await navigator.wakeLock.request('screen');
            if (!active) {
                sentinel.release().catch(() => { });
                return;
            }
            lock = sentinel;
            sentinel.addEventListener('release', () => {
                if (lock === sentinel)
                    lock = null;
            });
        } catch {
            // Refused (battery saver, no support): the screen dims as usual
        } finally {
            pending = false;
        }
    }

    // The browser drops the lock when the tab is hidden: take it again on return
    function onVisibility() {
        if (document.visibilityState === 'visible')
            request();
    }

    onMounted(() => {
        active = true;
        request();
        document.addEventListener('visibilitychange', onVisibility);
    });

    onBeforeUnmount(() => {
        active = false;
        document.removeEventListener('visibilitychange', onVisibility);
        lock?.release().catch(() => { });
        lock = null;
    });
}
