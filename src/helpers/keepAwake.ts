import { Capacitor } from '@capacitor/core'
import { KeepAwake } from '@capacitor-community/keep-awake'

/**
 * Keep the device screen awake while the native app is open.
 * Native (Android/iOS) only — a no-op on web/PWA. Best-effort: any failure
 * (unsupported device, plugin missing) is swallowed so it never breaks boot.
 */
export async function enableKeepAwake() {
    if (!Capacitor.isNativePlatform()) return
    try {
        await KeepAwake.keepAwake()
    } catch {
        /* best-effort; ignore */
    }
}
