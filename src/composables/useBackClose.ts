import { onScopeDispose, watch } from 'vue';

interface Closer {
    isOpen: () => boolean;
    close: () => void;
    openedAt: number;
}

// Module-level: every overlay that the Android back button should close
// registers here, and back closes the most recently opened one.
const closers = new Set<Closer>();
let openCounter = 0;

/** Lets the Android back button close this overlay (sheet, dialog, drawer) while it is open. */
export function useBackClose(isOpen: () => boolean, close: () => void) {
    if (import.meta.env.SSR)
        return;
    const closer: Closer = { isOpen, close, openedAt: 0 };
    closers.add(closer);
    watch(isOpen, open => { if (open) closer.openedAt = ++openCounter; }, { immediate: true });
    onScopeDispose(() => closers.delete(closer));
}

/** Closes the top open overlay. Returns false when nothing was open. */
export function closeTopOverlay(): boolean {
    let top: Closer | null = null;
    for (const c of closers)
        if (c.isOpen() && (!top || c.openedAt > top.openedAt))
            top = c;
    if (!top)
        return false;
    top.close();
    return true;
}
