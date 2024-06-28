<script setup lang="ts">
import { computed } from '@vue/reactivity';

const props = defineProps<{
    modelValue: string,
    label: string,
    items: { name: string, icon: string, value: string }[]
}>()

const modelValue = computed(() => props.items.findIndex(x => x.value === props.modelValue))

</script>


<template>
    <div style="width: 100%;">
        <div class="font-weight-bold my-2">{{ label }}</div>
        <v-btn-toggle color="primary" block :model-value="modelValue" border class="picker-toggle">
            <v-btn v-for="item in props.items" @click="$emit('update:model-value', item.value)" size="x-small"
                style="padding: 0;" :prepend-icon="item.icon">
                {{ $t(item.name) }}</v-btn>
        </v-btn-toggle>
    </div>
</template>


<style>
.picker-toggle.v-btn-group {
    width: 100%;
}

.picker-toggle.v-btn-group .v-btn {
    flex: 1;
}
</style>