<script setup lang="ts">
import { computed, inject } from 'vue';
import { ABOUT_FOOTNOTES, richParts } from '@/content/about/footnotes';

// A string of the About copy with its inline markup: foreign terms in italics,
// and footnote calls, small raised numbers that lead to the note
const props = defineProps<{ text: string }>();
const notes = inject(ABOUT_FOOTNOTES, null);
const parts = computed(() => richParts(props.text));
</script>

<template>
    <template v-for="(part, i) in parts" :key="i">
        <!-- Isolated left to right, so a Latin term stays in one piece in Arabic text -->
        <em v-if="part.kind === 'italic'" dir="ltr">{{ part.text }}</em>
        <sup v-else-if="part.kind === 'note'" class="about-note-call"><a v-if="notes?.number(part.id)"
                :id="`note-ref-${part.id}`" :href="`#note-${part.id}`"
                :aria-label="`${notes.label()} ${notes.number(part.id)}`"
                @click.prevent="notes.open(part.id)">{{ notes.number(part.id) }}</a></sup>
        <template v-else>{{ part.text }}</template>
    </template>
</template>

<style scoped>
/* Raised without opening up the line above it */
.about-note-call {
    font-size: 0.72em;
    line-height: 0;
    vertical-align: super;
}

/* A small number is a small target: the link reaches past it on every side */
.about-note-call a {
    position: relative;
    padding: 0 1px;
    font-weight: 600;
    color: rgba(var(--v-theme-on-surface), 0.87);
    text-decoration: none;
}

.about-note-call a::after {
    content: '';
    position: absolute;
    inset: -10px -8px;
}
</style>
