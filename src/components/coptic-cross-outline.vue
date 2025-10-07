<script setup lang="ts">
import { useTheme } from 'vuetify';


const theme = useTheme()

</script>

<template>
    <img class="cross-main" fetchpriority=high :src="theme.current.value.dark ? '/cross_dark_theme.png' : '/cross-black.png'" :alt="$t('aria.cross')"
        :class="theme.current.value.dark ? 'cross-dark' : 'cross-light'" />

</template>

<style>
.cross-outline {
    stroke: #000;
}

.v-theme--dark .cross-outline {
    stroke: #FFC107;
}

.cross-dark {
    filter: drop-shadow(0 0 0.6rem #ffc1078a);
}
</style>