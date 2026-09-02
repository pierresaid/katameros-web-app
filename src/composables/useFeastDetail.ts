import { ref } from 'vue';
import type { FastListItem, FeastListItem } from './useFeastList';

export type FeastDetail =
    | { kind: 'feast', item: FeastListItem }
    | { kind: 'fast', item: FastListItem };

// Module-level state: the single detail sheet mounted in App.vue serves
// every caller (feasts page, calendar dialog). The last item stays set
// while the sheet animates closed so its content does not vanish mid-way.
const detail = ref<FeastDetail | null>(null);
const open = ref(false);

export function useFeastDetail() {
    function showFeast(item: FeastListItem) {
        detail.value = { kind: 'feast', item };
        open.value = true;
    }

    function showFast(item: FastListItem) {
        detail.value = { kind: 'fast', item };
        open.value = true;
    }

    function close() {
        open.value = false;
    }

    return { detail, open, showFeast, showFast, close };
}
