<script setup lang="ts">
import { useMenu } from '../store/menu';

const menu = useMenu()

function inc() {
    if (menu.zoom < 2.5) {
        menu.zoom = Math.round((menu.zoom + 0.1) * 10) / 10;
    }
}

function dec() {
    if (menu.zoom > 0.5) {
        menu.zoom = Math.round((menu.zoom - 0.1) * 10) / 10;
    }
}
</script>

<template>
    <div>
        <div class="zoom-label">
            <span>{{ $t('zoom') }}</span>
            <span class="zoom-value">{{ Math.round(menu.zoom * 100) }}%</span>
        </div>
        <div class="zoom-row">
            <v-btn icon="mdi-minus" size="x-small" variant="tonal" @click="dec" :aria-label="$t('aria.zoomOut')" />
            <v-slider v-model="menu.zoom" step="0.1" min="0.5" max="2.5" hide-details density="compact" />
            <v-btn icon="mdi-plus" size="x-small" variant="tonal" @click="inc" :aria-label="$t('aria.zoomIn')" />
        </div>
    </div>
</template>

<style scoped>
.zoom-label {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    font-size: 0.8em;
    color: rgba(var(--v-theme-on-surface), 0.6);
    margin-bottom: 2px;
}

.zoom-value {
    font-variant-numeric: tabular-nums;
}

.zoom-row {
    display: flex;
    align-items: center;
    gap: 10px;
}
</style>
