<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import LANGUAGES from '@/consts/languages';
import { useReadings } from '@/store/readings';
import { useBackClose } from '@/composables/useBackClose';
import { findLanguage } from '@/helpers/languages';
import type { NavGroup } from '@/helpers/slideshow';
import ThemePicker from '@/components/theme-picker.vue';

const props = defineProps<{
    visible: boolean,
    /** Where the slideshow stands: "Liturgie · Épître de saint Paul  2/5" */
    label: string,
    dateLabel: string,
    groups: NavGroup[],
    /** The unit on screen */
    current: number,
    zoom: number,
    fullscreen: boolean,
    fullscreenSupported: boolean,
}>();

const emit = defineEmits<{
    (e: 'go', unit: number): void,
    (e: 'zoom', value: number): void,
    (e: 'fullscreen'): void,
    (e: 'exit'): void,
    /** A menu is open: the controls stay */
    (e: 'menus', open: boolean): void,
    (e: 'hover', over: boolean): void,
    /** Touched or focused while hidden */
    (e: 'reveal'): void,
}>();

const { t } = useI18n();
const readings = useReadings();
const route = useRoute();
const router = useRouter();

const navOpen = ref(false);
const settingsOpen = ref(false);
useBackClose(() => navOpen.value, () => { navOpen.value = false; });
useBackClose(() => settingsOpen.value, () => { settingsOpen.value = false; });
watch(() => navOpen.value || settingsOpen.value, open => emit('menus', open));

const languages = Object.values(LANGUAGES);
const secondLanguages = computed(() => languages.filter(l => l.id !== readings.language));

// The main language follows the address, as everywhere in the app. Replaced
// rather than pushed, so leaving the slideshow doesn't step back through it.
function setLanguage(id: number) {
    const lang = findLanguage(id);
    if (!lang || lang.id === readings.language)
        return;
    router.replace({ name: 'slideshow', params: { lang: lang.code }, query: route.query });
}

// Making the second language the main one swaps the two (App.vue's syncLanguage)
function swap() {
    if (readings.secondLanguage)
        setLanguage(readings.secondLanguage);
}

function setSecond(id: number | null) {
    readings.setSecondLanguage(id ?? null);
}

function onBandDown() {
    if (!props.visible)
        emit('reveal');
}
</script>

<template>
    <div class="ss-band" :class="{ 'ss-band--hidden': !visible }" @pointerdown="onBandDown"
        @pointerenter="emit('hover', true)" @pointerleave="emit('hover', false)" @focusin="emit('reveal')">
        <div class="ss-band-inner">
            <div class="ss-pos" :title="label">{{ label }}</div>

            <!-- No max-height: Vuetify reads it in pixels ("75vh" would be 75px); the
                 menu is kept within the space above the button anyway -->
            <v-menu v-model="navOpen" location="top end">
                <template #activator="{ props: activator }">
                    <v-btn v-bind="activator" icon="mdi-format-list-bulleted" variant="text" size="small"
                        :aria-label="t('slideshow.sections')" :title="t('slideshow.sections')" />
                </template>
                <v-list density="compact" class="ss-nav" nav>
                    <div class="ss-nav-date">{{ dateLabel }}</div>
                    <template v-for="group in groups" :key="group.sectionIdx">
                        <v-list-subheader class="ss-nav-section">{{ group.title }}</v-list-subheader>
                        <v-list-item v-for="unit in group.units" :key="unit.key" :active="unit.index === current"
                            color="primary" rounded="lg" @click="emit('go', unit.index)">
                            <v-list-item-title>{{ unit.title }}</v-list-item-title>
                            <v-list-item-subtitle v-if="unit.subtitle">{{ unit.subtitle }}</v-list-item-subtitle>
                        </v-list-item>
                    </template>
                </v-list>
            </v-menu>

            <v-menu v-model="settingsOpen" location="top end" :close-on-content-click="false">
                <template #activator="{ props: activator }">
                    <v-btn v-bind="activator" icon="mdi-translate" variant="text" size="small"
                        :aria-label="t('slideshow.settings')" :title="t('slideshow.settings')" />
                </template>
                <v-card class="ss-settings" min-width="280" max-width="320">
                    <div class="ss-settings-row">
                        <v-select density="compact" variant="underlined" :label="t('language')" hide-details
                            :model-value="readings.language" @update:model-value="setLanguage"
                            :items="languages" item-title="name" item-value="id" autocomplete="off" />
                    </div>
                    <div class="ss-settings-row ss-second">
                        <v-select density="compact" variant="underlined" :label="t('secondLanguage')" hide-details
                            :model-value="readings.secondLanguage" @update:model-value="setSecond"
                            :items="secondLanguages" item-title="name" item-value="id" clearable persistent-clear
                            :placeholder="t('none')" autocomplete="off" />
                        <v-btn icon="mdi-swap-horizontal" variant="text" size="small" :disabled="!readings.secondLanguage"
                            :aria-label="t('slideshow.swap')" :title="t('slideshow.swap')" @click="swap" />
                    </div>
                    <div class="ss-settings-row">
                        <div class="ss-size-label">
                            <span>{{ t('slideshow.textSize') }}</span>
                            <span class="ss-size-value">{{ Math.round(zoom * 100) }}%</span>
                        </div>
                        <div class="ss-size">
                            <v-btn icon="mdi-minus" size="x-small" variant="tonal" :aria-label="t('aria.zoomOut')"
                                @click="emit('zoom', zoom - 0.1)" />
                            <v-slider :model-value="zoom" @update:model-value="emit('zoom', $event)" step="0.1"
                                min="0.5" max="2" hide-details density="compact" />
                            <v-btn icon="mdi-plus" size="x-small" variant="tonal" :aria-label="t('aria.zoomIn')"
                                @click="emit('zoom', zoom + 0.1)" />
                        </div>
                    </div>
                    <div class="ss-settings-row">
                        <ThemePicker />
                    </div>
                </v-card>
            </v-menu>

            <v-btn v-if="fullscreenSupported" :icon="fullscreen ? 'mdi-fullscreen-exit' : 'mdi-fullscreen'"
                variant="text" size="small" :aria-label="fullscreen ? t('slideshow.exitFullscreen') : t('slideshow.fullscreen')"
                :title="fullscreen ? t('slideshow.exitFullscreen') : t('slideshow.fullscreen')" @click="emit('fullscreen')" />
            <v-btn icon="mdi-close" variant="text" size="small" :aria-label="t('slideshow.exit')"
                :title="t('slideshow.exit')" @click="emit('exit')" />
        </div>
    </div>
</template>

<style scoped>
/* A strip kept free under the slides: the controls never cover a verse */
.ss-band {
    flex: none;
    height: 44px;
    display: flex;
    align-items: center;
    font-size: 14px;
    transition: opacity 0.35s ease;
}

.ss-band--hidden {
    opacity: 0;
}

/* Hidden: a touch on the strip only shows the controls, it presses nothing */
.ss-band--hidden .ss-band-inner {
    pointer-events: none;
}

.ss-band-inner {
    flex: 1;
    min-width: 0;
    display: flex;
    align-items: center;
    gap: 2px;
}

.ss-band-inner .v-btn {
    opacity: 0.7;
}

.ss-band-inner .v-btn:hover,
.ss-band-inner .v-btn:focus-visible {
    opacity: 1;
}

.ss-pos {
    flex: 1;
    min-width: 0;
    padding-inline-end: 8px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-size: 13px;
    opacity: 0.55;
}

.ss-nav {
    min-width: 260px;
    max-width: min(380px, 90vw);
}

.ss-nav-date {
    padding: 6px 12px 2px;
    font-size: 0.8rem;
    color: rgba(var(--v-theme-on-surface), 0.6);
}

.ss-nav-section {
    font-family: "Suez One", "ScheherazadeNew", sans-serif;
    text-transform: uppercase;
    letter-spacing: 0.04em;
}

.ss-settings {
    padding: 4px 0;
}

.ss-settings-row {
    padding: 10px 16px;
}

.ss-settings-row + .ss-settings-row {
    border-top: 1px solid rgba(var(--v-theme-on-surface), 0.07);
}

.ss-second {
    display: flex;
    align-items: flex-end;
    gap: 6px;
}

.ss-size-label {
    display: flex;
    justify-content: space-between;
    font-size: 0.8em;
    color: rgba(var(--v-theme-on-surface), 0.6);
    margin-bottom: 2px;
}

.ss-size-value {
    font-variant-numeric: tabular-nums;
}

.ss-size {
    display: flex;
    align-items: center;
    gap: 10px;
}

@media (prefers-reduced-motion: reduce) {
    .ss-band {
        transition: none;
    }
}
</style>
