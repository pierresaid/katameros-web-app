<script setup lang="ts">
import { ref } from 'vue';

defineProps<{
    animate?: boolean
}>()

const clickCount = ref(0)
const activatedByClick = ref(false)

function handleClick() {
    clickCount.value++
    if (clickCount.value >= 3) {
        activatedByClick.value = !activatedByClick.value
        clickCount.value = 0
    }
}
</script>

<template>
    <div class="cross-wrapper"
        :class="{ 'preloading-glow': animate, 'click-glow': activatedByClick }"
        role="img" :aria-label="$t('aria.cross')" @click="handleClick">
        <img class="cross-img cross-img-light" fetchpriority="high" src="/cross-black.png" alt="" aria-hidden="true" />
        <img class="cross-img cross-img-dark" fetchpriority="high" src="/cross_dark_theme.png" alt="" aria-hidden="true" />
    </div>
</template>

<style>
.cross-wrapper {
    cursor: pointer;
    width: 100%;
    height: 100%;
    display: inline-block;
}

.cross-img {
    width: 100%;
    height: 100%;
    object-fit: contain;
}

.cross-img-dark { display: none; }

.v-theme--dark .cross-img-light { display: none; }

.v-theme--dark .cross-img-dark {
    display: block;
    filter: drop-shadow(0 0 0.4rem #ffc1078a);
}

/* preloading glow only in dark theme (matches original asymmetry) */
.v-theme--dark .preloading-glow .cross-img-dark {
    animation: glow-dark 3s ease-in-out infinite;
}

/* click-toggle glow in either theme */
.click-glow .cross-img-light {
    animation: glow-light 3s ease-in-out infinite;
}

.v-theme--dark .click-glow .cross-img-dark {
    animation: glow-dark 3s ease-in-out infinite;
}

@keyframes glow-dark {
    0%, 100% { filter: drop-shadow(0 0 0.4rem #000); }
    50% { filter: drop-shadow(0 0 0.9rem #ffc1078a); }
}

@keyframes glow-light {
    0%, 100% { filter: drop-shadow(0 0 1.6rem #ffffff); }
    50% { filter: drop-shadow(0 0 1.6rem #ffe607); }
}
</style>
