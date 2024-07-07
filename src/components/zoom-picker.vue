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
    <div style="width: 100%;">
        <div class="font-weight-bold my-2">{{ $t('zoom') }}</div>
        <v-slider v-model="menu.zoom" step="0.1" min="0.5" max="2.5" thumb-label="always" thumb-size="24" />
        <v-btn-group variant="tonal" class="picker-toggle" style="margin-top: -20px;">
            <v-btn size="x-small" style="padding: 0;" icon="mdi-magnify-minus" @click="dec" :aria-label="$t('aria.zoomIn')"/>
            <v-btn size="x-small" style="padding: 0;" icon="mdi-magnify-plus" @click="inc" :aria-label="$t('aria.zoomOut')"/>
        </v-btn-group>
    </div>
</template>