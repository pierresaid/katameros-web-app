<script setup lang="ts">
const props = defineProps<{
    modelValue: string,
    label: string,
    items: { name: string, icon: string, value: string }[]
}>()

defineEmits<{
    (e: 'update:model-value', value: string): void
}>()
</script>

<template>
    <div>
        <div class="picker-label">{{ label }}</div>
        <div class="picker-track" role="radiogroup" :aria-label="label">
            <button v-for="item in props.items" :key="item.value" type="button" class="picker-option"
                :class="{ 'picker-option--active': modelValue === item.value }"
                role="radio" :aria-checked="modelValue === item.value"
                @click="$emit('update:model-value', item.value)">
                <v-icon :icon="item.icon" size="15" />
                <span class="picker-option-text">{{ $t(item.name) }}</span>
            </button>
        </div>
    </div>
</template>

<style scoped>
.picker-label {
    font-size: 0.8em;
    color: rgba(var(--v-theme-on-surface), 0.6);
    margin-bottom: 6px;
}

.picker-track {
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: 1fr;
    gap: 4px;
    padding: 3px;
    border-radius: 10px;
    background-color: rgba(var(--v-theme-on-surface), 0.06);
}

.picker-option {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 6px 4px;
    border-radius: 8px;
    font-size: 0.85em;
    color: rgba(var(--v-theme-on-surface), 0.7);
    transition: background-color 0.15s, color 0.15s;
}

.picker-option:not(.picker-option--active):hover {
    background-color: rgba(var(--v-theme-on-surface), 0.05);
}

.picker-option--active {
    background-color: rgba(var(--v-theme-primary), 0.28);
    color: rgba(var(--v-theme-on-surface), 0.95);
    font-weight: 600;
}

.picker-option-text {
    line-height: 1.2;
}
</style>
