<script setup lang="ts">
import { capitalize, ref } from 'vue';
import ReadingSections from '../components/readings/reading-sections.vue';
import DatePickerDialog from '../components/date-picker-dialog.vue';
import { computed } from '@vue/reactivity';
import CopticCrossOutline from '../components/coptic-cross-outline.vue';
import { useReadings } from '@/store/readings';
import { useDisplay } from 'vuetify';
import { getCopticMonth } from '@/helpers/copticMonth';
import { useMenu } from '@/store/menu';

const readings = useReadings();
const { smAndDown } = useDisplay()

const menu = useMenu()

let date = computed(() => new Intl.DateTimeFormat(readings.languageCode, { day: "numeric", month: "long", weekday: 'long' }).format(readings.date).split(' ').map(x => capitalize(x)).join(' '));
let copticDate = computed(() => {


    const [day, month] = readings.date
        .toLocaleDateString("fr-FR-u-ca-coptic", {
            month: "numeric",
            day: "numeric",
        })
        .split("/");
    return `${day} ${getCopticMonth(Number(month))}`;
});

function setDate(inc: number) {
    readings.date = new Date(readings.date.setDate(readings.date.getDate() + inc))
    readings.getReadings();
}
</script>

<template>
    <div class="text-center date">
        <CopticCrossOutline style="width : 120px; height: 120px;" />
        <div class="g-date" :style="smAndDown ? 'display: block;' : ''" style="width: 100%;">
            {{ date }}
            <v-locale-provider :rtl="false">
                <div class="date-control" :class="smAndDown ? 'mx-a p-u' : ''">
                    <v-btn icon="mdi-arrow-left" @click="setDate(-1)" size="small" variant="text"
                        :disabled="readings.preloading" :aria-label="$t('aria.prevDay')" />
                    <v-btn icon="mdi-calendar" @click="menu.dateDialog = true" :aria-label="$t('aria.openDatePicker')"
                        :disabled="readings.preloading" />
                    <v-btn icon="mdi-arrow-right" @click="setDate(1)" size="small" variant="text"
                        :disabled="readings.preloading" :aria-label="$t('aria.nextDay')" />
                    <DatePickerDialog v-model="menu.dateDialog" />
                </div>
            </v-locale-provider>
        </div>
        <div>
            {{ copticDate }}
        </div>
        <Transition name="fade">
            <div v-if="readings.periodInfo">
                {{ readings.periodInfo }}
            </div>
        </Transition>
        <Transition name="fade">
            <div v-if="readings.title">
                {{ readings.title }}
            </div>
        </Transition>
    </div>
    <ReadingSections />

    <v-snackbar v-model="readings.error" color="red" :timeout="-1">
        {{ $t('error.loadingReadings') }}
        <template v-slot:actions>
            <v-btn variant="elevated" size="small" @click="readings.getReadings">
                {{ $t('reload') }}
            </v-btn>
        </template>
    </v-snackbar>
</template>

<style>
@media (min-width: 950px) and (max-width: 1130px) {
    .g-date {
        width: 70vw !important;
    }
}

@media (min-width: 1670px) {
    .g-date {
        width: 40vw !important;
    }
}

.g-date {
    display: flex;
    align-items: center;
    position: relative;
    justify-content: center;
    width: 60vw;
    margin-left: auto;
    margin-right: auto;
}

.date-control {
    position: absolute;
    align-items: center;
    display: flex;
    right: 15%;
    width: fit-content;
}

.date {
    font-size: 2em;
    margin: 1em;
    margin-bottom: 0.4em;
    font-family: 'Suez one'
}

:root {
    font-synthesis: none;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    -webkit-text-size-adjust: 100%;
}

.justify-center {
    justify-content: center;
}

.items-baseline {
    align-items: baseline;
}

.items-center {
    align-items: center;
}

.flex {
    display: flex;
}

.mx-a,
.mx-auto {
    margin-left: auto;
    margin-right: auto;
}

.p-u {
    position: unset !important;
}

a {
    text-decoration: none;
    color: inherit;
}
</style>