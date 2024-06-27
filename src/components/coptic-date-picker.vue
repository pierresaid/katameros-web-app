<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useReadings } from '../store/readings';
import { coptic_months } from '../helpers/copticMonth'


const readings = useReadings();

const days: number[] = []
const day = ref(readings.copticDate[0])
for (let i = 1; i < 31; i++)
    days.push(i)


const months = coptic_months.map((x, idx) => ({ title: x, value: idx }))
const month = ref(readings.copticDate[1] - 1)

const years: number[] = []
const year = ref(readings.copticDate[2])
for (let i = year.value - 50; i < year.value + 50; i++) {
    years.push(i)

}

const emit = defineEmits<{
    (event: 'update', date: [number, number, number]): void
}>()

watch([day, month, year], () => {
    emit('update', [day.value, month.value, year.value])
})

// debug https://github.com/vuetifyjs/vuetify/issues/15587
const dbg = ref(true)
const dbg2 = ref(true)
const dbg3 = ref(true)
onMounted(() => {
    emit('update', [day.value, month.value, year.value])
    setTimeout(() => {
        dbg.value = false
        dbg2.value = false
        dbg3.value = false
    }, 0);
})

</script>


<template>
    <div class="flex" style="margin-top: 10px;">
        <v-select :items="days" v-model="day" label="Day" @update:menu="dbg = $event" :menu="dbg" variant="plain" />
        <v-select :items="months" v-model="month" label="Month" @update:menu="dbg2 = $event" :menu="dbg2"
            variant="plain" />
        <v-select :items="years" v-model="year" label="Year" @update:menu="dbg3 = $event" :menu="dbg3"
            variant="plain" />
    </div>
</template>
