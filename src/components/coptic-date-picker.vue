<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useReadings } from '../store/readings';
import { coptic_months } from '../helpers/copticMonth'
import { watchEffect } from 'vue';

const readings = useReadings();

const days = ref<number[]>([])
const day = ref(readings.copticDate[0]!)
for (let i = 1; i < 31; i++)
    days.value.push(i)

const months = coptic_months.map((x, idx) => ({ title: x, value: idx + 1 }))
const month = ref(readings.copticDate[1]!)

const years: number[] = []
const year = ref(readings.copticDate[2]!)
for (let i = year.value - 50; i < year.value + 50; i++) {
    years.push(i)
}

const emit = defineEmits<{
    (event: 'update', date: [number, number, number]): void
}>()

watchEffect(() => {
    if (month.value === 13) {
        day.value = 1
        days.value = []
        for (let i = 1; i < 6; i++)
            days.value.push(i)
    }
    else {
        days.value = []
        for (let i = 1; i < 31; i++)
            days.value.push(i)
    }
})

watch([day, month, year], () => {
    emit('update', [day.value, month.value, year.value])
})

onMounted(() => {
    emit('update', [day.value, month.value, year.value])
})
</script>

<template>
    <div class="flex">
        <v-select :items="days" v-model="day" :label="$t('day')" variant="plain" />
        <v-select :items="months" v-model="month" :label="$t('month')" variant="plain" />
        <v-select :items="years" v-model="year" :label="$t('year')" variant="plain" />
    </div>
</template>
