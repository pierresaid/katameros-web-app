<script setup lang="ts">
import { ref } from 'vue';
import { useTheme } from 'vuetify';

const props = defineProps<{
    animate?: boolean
}>()

const theme = useTheme()

const clickCount = ref(0)
const activatedByClick = ref(false)

function handleClick() {
    clickCount.value++
    if (clickCount.value >= 3) {
        activatedByClick.value = !activatedByClick.value
        clickCount.value = 0
    }
}

const shouldAnimate = () => (props.animate && theme.current.value.dark) || activatedByClick.value

</script>

<template>
    <img class="cross-main" fetchpriority=high :src="theme.current.value.dark ? '/cross_dark_theme.png' : '/cross-black.png'" :alt="$t('aria.cross')"
        :class="[theme.current.value.dark ? 'cross-dark' : 'cross-light', { 'cross-glow': shouldAnimate() }]"
        @click="handleClick" />

</template>

<style>
.cross-outline {
    stroke: #000;
}

.v-theme--dark .cross-outline {
    stroke: #FFC107;
}

.cross-dark {
    filter: drop-shadow(0 0 0.4rem #ffc1078a);
}

.cross-dark.cross-glow {
    animation: glow-dark 3s ease-in-out infinite;
}

.cross-light.cross-glow {
    animation: glow-light 3s ease-in-out infinite;
}

@keyframes glow-dark {
    0%, 100% {
        filter: drop-shadow(0 0 0.4rem #000);
    }
    50% {
        filter: drop-shadow(0 0 0.9rem #ffc1078a);
    }
}

@keyframes glow-light {
    0%, 100% {
        filter: drop-shadow(0 0 1.6rem #ffffff);
    }
    50% {
        filter: drop-shadow(0 0 1.6rem #ffe607);
    }
}
</style>