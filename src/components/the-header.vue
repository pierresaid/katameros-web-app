<script setup lang="ts">
import { useRoute } from 'vue-router';
import { useMenu } from '../store/menu';
import { useReadings } from '../store/readings';
import CurrentReading from './current-reading.vue';
import LangPickerSmall from './lang-picker-small.vue';
import { useDisplay } from 'vuetify';

const readings = useReadings()
const menu = useMenu()
const { xs } = useDisplay()
const route = useRoute();

</script>


<template>
    <v-app-bar color="primary" class="header-main">
        <template v-slot:prepend>
            <v-app-bar-nav-icon @click="menu.navOpen = !menu.navOpen" :aria-label="$t('aria.toggleNav')" />
        </template>
        <v-app-bar-title style="display: flex; margin-left: 0px;">
            <router-link to="/">
                <h1 class="coptic kt">Katameroc</h1>
            </router-link>
        </v-app-bar-title>

        <template v-slot:append>
            <Transition v-if="xs && route.path == '/'" name="fade" mode="out-in">
                <div v-if="readings.currentSection">
                    <CurrentReading />
                </div>
                <div v-else>
                    <LangPickerSmall />
                </div>
            </Transition>
            <div v-else class="flex">
                <CurrentReading v-if="route.path == '/'" />
                <LangPickerSmall />
            </div>
        </template>
    </v-app-bar>
</template>

<style>
.fade-enter-active {
    transition: all 0.3s ease-out;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

@media (max-width: 376px) {
    #app .v-toolbar__prepend+.v-toolbar-title {
        padding-inline-start: 5px;

    }
}

/* fix for ios */
.header-main {
    top:  env(safe-area-inset-top) !important;
}

body {
    padding-top: env(safe-area-inset-top) !important;
}
</style>
