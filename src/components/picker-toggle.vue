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
    <div class="picker-container">
        <div class="font-weight-bold my-2">{{ label }}</div>
        <div class="options-grid">
            <div v-for="item in props.items" :key="item.value" class="option-card"
                :class="{ 'selected': modelValue === item.value }" @click="$emit('update:model-value', item.value)"
                v-ripple>
                <v-icon :icon="item.icon" class="mb-1" size="x-small"/>
                <span class="option-text">{{ $t(item.name) }}</span>
            </div>
        </div>
    </div>
</template>

<style scoped>
.options-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
    gap: 8px;
}

.option-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 4px 4px;
    border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
    text-align: center;
    min-height: 40px;
    background-color: rgb(var(--v-theme-surface));
    position: relative;
    overflow: hidden;
}

.option-card:hover {
    background-color: rgba(var(--v-theme-on-surface), 0.05);
}

.option-card.selected {
    background-color: rgb(var(--v-theme-primary));
    color: rgb(var(--v-theme-on-primary));
    border-color: rgb(var(--v-theme-primary));
}

.option-text {
    font-size: 0.875rem;
    line-height: 1.2;
    word-break: break-word;
}
</style>