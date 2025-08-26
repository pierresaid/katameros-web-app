<script setup lang="ts">
import { scrollToSection, scrollToSubSection } from '../helpers/scrollTo.js';
import { useReadings } from '../store/readings.js';
import { useDisplay } from 'vuetify'

const readings = useReadings();
const { smAndUp } = useDisplay();

async function onInput(id: number) {
    scrollToSection(id);
    readings.openSection(id);
}

async function onInputSub(sectionId: number, subSectionId: number) {
    scrollToSubSection(sectionId, subSectionId);
    readings.openSection(sectionId);
}

function close() {
    readings.panel = []
}

</script>

<template>
    <v-menu>
        <template v-slot:activator="{ props }">
            <v-btn variant="tonal" class="current-reading-btn" v-bind="props" :size="smAndUp ? 'default' : 'small'" :aria-label="$t('aria.readingMenu')" style="margin-right: 5px;">
                <Transition :name="readings.currentSectionAnimation" mode="out-in">
                    <div :key="readings.currentSection?.id" style="max-width: 25vw; overflow-wrap: break-word;">
                        <span v-if="readings.currentSection"
                            style="display: block; max-width: 30vw; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;">{{
                            readings.currentSection?.title }}</span>
                        <v-icon v-else>mdi-format-list-bulleted</v-icon>
                    </div>
                </Transition>
            </v-btn>
        </template>
        <v-list class="current-reading-list" role="menu">
            <v-list-item value="close" @click="close" variant="plain">
                <v-list-item-title role="menuitem">{{$t('close')}}</v-list-item-title>
            </v-list-item>
            <v-list-item v-for="(section, idx) in readings.sections" :key="section.id" :value="section.id"
                :active="readings.currentSection?.id === section.id" @click="onInput(idx)">
                <v-list-item-title style="width : 100%;">
                    <div class="d-flex justify-center">
                        <div class="d-flex" style="align-items:center; text-wrap: auto;">
                            {{ section.title }}
                        </div>
                        <v-spacer />
                        <v-menu v-if="section && section.subSections.length > 1">
                            <template v-slot:activator="{ props }">
                                <v-btn icon="mdi-chevron-down" size="small" class="ml-2 mb-1" @click.prevent.stop="" v-bind="props" :aria-label="$t('aria.subSectionMenu')" />
                            </template>
                            <v-list role="menu">
                                <v-list-item v-for="(subsection, subidx) in section.subSections" :value="subsection.id"
                                    :key="subsection.id" @click="onInputSub(idx, subidx)">
                                    <v-list-item-title role="menuitem">
                                        {{ subsection.title || subsection.readings[0].passages![0].bookTranslation }}
                                    </v-list-item-title>
                                </v-list-item>
                            </v-list>
                        </v-menu>
                    </div>
                </v-list-item-title>
            </v-list-item>
        </v-list>
    </v-menu>

</template>


<style>
.slide-enter-active,
.slide-rev-enter-active {
    transition: all 0.3s ease-out;
}

.slide-enter-from,
.slide-leave-to {
    transform: translateY(-20px);
    opacity: 0;
}

.slide-rev-enter-from,
.slide-rev-leave-to {
    transform: translateY(20px);
    opacity: 0;
}

.current-reading-btn {
    width: auto;
    transition: all 0.3s ease-out;
}

.v-list.current-reading-list {
    padding: 0;
}
</style>