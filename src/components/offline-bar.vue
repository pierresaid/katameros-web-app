<script setup lang="ts">
// The readings could not be asked for: the device is offline. A quiet pill
// rather than the red error bar; it leaves by itself when the readings arrive
// (the store asks for them again when the connection comes back).
defineProps<{ show: boolean }>()
</script>

<template>
    <!-- Always there, so that screen readers announce the pill when it appears -->
    <div class="offline-bar" role="status">
        <Transition name="offline-bar">
            <div v-if="show" class="offline-bar-pill">
                <v-icon icon="mdi-wifi-off" size="18" aria-hidden="true" />
                <span>{{ $t('error.noConnection') }}</span>
            </div>
        </Transition>
    </div>
</template>

<style scoped>
/* Centered over the page, beside an open drawer too, above the phone's home bar */
.offline-bar {
    position: fixed;
    left: 0;
    right: 0;
    bottom: calc(16px + env(safe-area-inset-bottom));
    padding: 0 var(--v-layout-right, 0px) 0 var(--v-layout-left, 0px);
    display: flex;
    justify-content: center;
    pointer-events: none;
    z-index: 1005;
}

.offline-bar-pill {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 7px 16px 7px 13px;
    border-radius: 999px;
    font-size: 14px;
    line-height: 20px;
    background: rgb(var(--v-theme-surface-variant));
    color: rgb(var(--v-theme-on-surface-variant));
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.16);
}

/* The dark theme's surface-variant is a light grey: a dark pill instead, set
   apart from the page by a hairline */
.v-theme--dark .offline-bar-pill {
    background: #2e2e2e;
    color: rgba(255, 255, 255, 0.87);
    box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.1), 0 4px 14px rgba(0, 0, 0, 0.5);
}

.offline-bar-enter-active,
.offline-bar-leave-active {
    transition: opacity 0.2s ease, transform 0.2s ease;
}

.offline-bar-enter-from,
.offline-bar-leave-to {
    opacity: 0;
    transform: translateY(8px);
}

@media (prefers-reduced-motion: reduce) {
    .offline-bar-enter-from,
    .offline-bar-leave-to {
        transform: none;
    }
}
</style>
