<script setup lang="ts">
import { capitalize, ref } from 'vue';
import ReadingSections from '../components/readings/reading-sections.vue';
import DatePickerDialog from '../components/date-picker-dialog.vue';
import { computed } from '@vue/reactivity';
import CopticCrossOutline from '../components/coptic-cross-outline.vue';
import { useReadings } from '@/store/readings';
import { getCopticMonth } from '@/helpers/copticMonth';
import { useMenu } from '@/store/menu';
import { useSeo } from '@/composables/useSeo';

useSeo({ brandOnly: true });

const readings = useReadings();

const menu = useMenu()

let date = computed(() => new Intl.DateTimeFormat(readings.languageCode, { day: "numeric", month: "long", weekday: 'long' }).format(readings.date).split(' ').map(x => capitalize(x)).join(' '));
let copticDate = computed(() => {


    const [day, month] = readings.date
        .toLocaleDateString("fr-FR-u-ca-coptic", {
            month: "numeric",
            day: "numeric",
        })
        .split("/");
    return `${Number(day)} ${getCopticMonth(Number(month))}`;
});

function setDate(inc: number) {
    readings.date = new Date(readings.date.setDate(readings.date.getDate() + inc))
    readings.getReadings();
}
</script>

<template>
    <div class="text-center date">
        <h1 class="d-sr-only">{{ $t('seo.homeHeading') }}</h1>
        <CopticCrossOutline style="width : 120px; height: 120px;" :animate="readings.preloading" />
        <div class="g-date">
            <span class="g-date-text">
                <ClientOnly>
                    <template #placeholder><span class="date-placeholder" aria-hidden="true">&nbsp;</span></template>
                    {{ date }}
                </ClientOnly>
            </span>
            <v-locale-provider :rtl="false" class="date-control-wrap">
                <div class="date-control">
                    <v-btn icon="mdi-chevron-left" @click="setDate(-1)" size="small" variant="text"
                         :aria-label="$t('aria.prevDay')" />
                    <v-btn icon="mdi-calendar" size="small" variant="text" class="date-control-cal"
                        @click="menu.dateDialog = true" :aria-label="$t('aria.openDatePicker')" />
                    <v-btn icon="mdi-chevron-right" @click="setDate(1)" size="small" variant="text"
                         :aria-label="$t('aria.nextDay')" />
                    <DatePickerDialog v-model="menu.dateDialog" />
                </div>
            </v-locale-provider>
        </div>
        <div>
            <ClientOnly>
                <template #placeholder><span class="date-placeholder" aria-hidden="true">&nbsp;</span></template>
                {{ copticDate }}
            </ClientOnly>
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
            <v-btn variant="elevated" size="small" class="reload-btn" @click="readings.getReadings">
                {{ $t('reload') }}
            </v-btn>
        </template>
    </v-snackbar>
</template>

<style>
/* Phones and tablets: the buttons sit under the date. Pure CSS, so SSR and
   the client agree. */
.g-date {
    width: 100%;
}

/* One quiet pill grouping prev / calendar / next, matching the app's
   segmented controls; the calendar gets a slightly deeper neutral wash
   to read as the main action without shouting */
.date-control {
    display: flex;
    align-items: center;
    width: fit-content;
    margin-left: auto;
    margin-right: auto;
    gap: 2px;
    padding: 3px;
    border-radius: 999px;
    background-color: rgba(var(--v-theme-on-surface), 0.03);
    border: 1px solid rgba(var(--v-theme-on-surface), 0.05);
}

.date-control-cal {
    background-color: rgba(var(--v-theme-on-surface), 0.04);
}

.v-theme--dark .date-control-cal {
    background-color: rgba(var(--v-theme-on-surface), 0.06);
}

/* Wider screens: the buttons sit beside the date, in the flow, so a long
   date ("Wednesday, September 30") can never cover them. The two side
   columns stay equal while there is room, which keeps the date centered
   over the Coptic date. */
@media (min-width: 960px) {
    .g-date {
        display: grid;
        grid-template-columns: 1fr auto 1fr;
        column-gap: 20px;
        align-items: center;
    }

    .g-date-text {
        grid-column: 2;
    }

    .date-control-wrap {
        grid-column: 3;
        justify-self: start;
    }

    .date-control {
        margin: 0;
    }
}

/* Inside the red bar the light theme gives this button a white label on
   its white background */
.reload-btn.v-theme--light {
    color: #c62828;
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