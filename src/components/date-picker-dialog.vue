<script setup lang="ts">
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import { useReadings } from '../store/readings';
import { useMenu } from '../store/menu';
// import CopticDatePicker from './coptic-date-picker.vue';

const readings = useReadings();

const menu = useMenu()



// const copticDate = ref([0, 0, 0])
// function onUpdate(date: [number, number, number]) {
//     copticDate.value = date
// }

function onSave() {
    // console.log('save', copticDate.value);
}

</script>


<template>
    <v-dialog v-model="menu.dateDialog" :persistent="false"  width="auto"
    >
        <v-card>
            <!-- <v-tabs v-model="tab" color="primary">
                <v-tab value="date">Date</v-tab>
                <v-tab value="coptic-date">Coptic Date</v-tab>
            </v-tabs> -->
            <!-- <v-divider /> -->
            <!-- <v-card-text> -->
                <!-- <v-window v-model="tab"> -->
                <!-- <v-window-item value="date"> -->
                <Datepicker v-model="readings.date" @update:modelValue="$emit('update:model-value', false)" inline
                    :locale="readings.languageCode == 'ar' ? 'en' : readings.languageCode" auto-apply :enable-time-picker="false"
                    :dark="menu.theme === 'dark'">
                </Datepicker>
                <!-- </v-window-item> -->
                <!-- <v-window-item value="coptic-date">
                        <CopticDatePicker @update="onUpdate" />
                    </v-window-item> -->
                <!-- </v-window> -->
            <!-- </v-card-text> -->
            <v-divider />
            <v-card-actions>
                <v-spacer />
                <v-btn color="primary" variant="tonal" @click="() => { onSave(); $emit('update:model-value', false) }">
                    Save
                </v-btn>
                <v-btn variant="plain" @click="$emit('update:model-value', false)">Cancel</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<style>
.dp__theme_light {
    --dp-primary-color: var(--primary-color);
}

.dp__theme_dark {
    --dp-primary-color: var(--primary-color);
}
</style>