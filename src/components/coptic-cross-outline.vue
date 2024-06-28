<script setup lang="ts">
import { useTheme } from 'vuetify';


const theme = useTheme()

</script>

<template>
    <!-- <svg width="13cm" height="13cm" viewBox="-67 -45 260 260" xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink">
        <g>
            <polygon style="fill: transparent;"
                points="63.9,-38.34 80.94,-8.52 115.02,-8.52 89.46,21.3 89.46,59.64 127.8,59.64 157.62,34.08 157.62,68.16 187.44,85.2 157.62,102.24 157.62,136.32 127.8,110.76 89.46,110.76 89.46,149.1 115.02,178.92 80.94,178.92 63.9,208.74 46.86,178.92 12.78,178.92 38.34,149.1 38.34,110.76 0,110.76 -29.82,136.32 -29.82,102.24 -59.64,85.2 -29.82,68.16 -29.82,34.08 0,59.64 38.34,59.64 38.34,21.3 12.78,-8.52 46.86,-8.52 " />
            <polygon class="cross-outline" style="fill: none; fill-opacity:0; stroke-width: 6.39;"
                points="63.9,-38.34 80.94,-8.52 115.02,-8.52 89.46,21.3 89.46,59.64 127.8,59.64 157.62,34.08 157.62,68.16 187.44,85.2 157.62,102.24 157.62,136.32 127.8,110.76 89.46,110.76 89.46,149.1 115.02,178.92 80.94,178.92 63.9,208.74 46.86,178.92 12.78,178.92 38.34,149.1 38.34,110.76 0,110.76 -29.82,136.32 -29.82,102.24 -59.64,85.2 -29.82,68.16 -29.82,34.08 0,59.64 38.34,59.64 38.34,21.3 12.78,-8.52 46.86,-8.52 " />
        </g>
    </svg> -->

    <img class="cross-main" :src="theme.current.value.dark ? '/cross_dark_theme.png' : '/cross-black.png'" :alt="$t('aria.cross')"
        :class="theme.current.value.dark ? 'cross-dark' : 'cross-light'" />

</template>

<style>
.cross-outline {
    stroke: #000;
}

.v-theme--dark .cross-outline {
    stroke: #FFC107;
}

/* subtle shadow */
.cross-main {
    /* filter: drop-shadow(0 0 2.5rem #868686); */
}

.cross-dark {
    filter: drop-shadow(0 0 0.6rem #ffc1078a);
}
</style>