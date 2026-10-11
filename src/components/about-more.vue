<script setup lang="ts">
import type { AboutMore } from '@/content/about/types';

// A closed panel of details on the About page. A native <details>, so it opens
// without JavaScript and its content stays in the prerendered HTML.
defineProps<{ more: AboutMore }>();

const lines = (text: string | string[]) => (Array.isArray(text) ? text : [text]);
</script>

<template>
    <details class="about-more">
        <summary class="about-more-summary">
            <span class="about-more-title">{{ more.title }}</span>
            <v-icon icon="mdi-chevron-down" size="20" class="about-more-chevron" aria-hidden="true" />
        </summary>
        <div class="about-more-body">
            <p v-if="more.intro" class="about-more-intro">{{ more.intro }}</p>
            <dl class="about-more-list" :class="{ 'about-more-list--stacked': more.stacked }">
                <div v-for="item in more.items" :key="item.name" class="about-more-row">
                    <dt class="about-more-term">{{ item.name }}</dt>
                    <dd class="about-more-text" :class="{ 'about-more-text--list': item.list }">
                        <p v-if="item.lead" class="about-more-line about-more-lead">{{ item.lead }}</p>
                        <p v-for="(line, i) in lines(item.text)" :key="i" class="about-more-line">{{ line }}</p>
                    </dd>
                </div>
            </dl>
            <p v-for="(note, i) in more.notes" :key="i" class="about-more-note">{{ note }}</p>
        </div>
    </details>
</template>

<style scoped>
/* The quiet card of the feasts page, with a header that opens it */
.about-more {
    margin-top: 14px;
    border-radius: 12px;
    background-color: rgba(var(--v-theme-on-surface), 0.03);
    border: 1px solid rgba(var(--v-theme-on-surface), 0.08);
}

.about-more-summary {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 12px 16px;
    border-radius: 12px;
    font-weight: 600;
    line-height: 1.4;
    cursor: pointer;
    list-style: none;
    transition: background-color 0.15s;
}

/* A title that wraps keeps its words together rather than leaving one alone */
.about-more-title {
    text-wrap: balance;
}

.about-more-summary::-webkit-details-marker {
    display: none;
}

.about-more-summary:hover {
    background-color: rgba(var(--v-theme-on-surface), 0.04);
}

.about-more-summary:focus-visible {
    outline: 2px solid rgba(var(--v-theme-on-surface), 0.87);
    outline-offset: 2px;
}

.about-more-chevron {
    flex: none;
    color: rgba(var(--v-theme-on-surface), 0.6);
    transition: transform 0.2s;
}

.about-more[open] .about-more-chevron {
    transform: rotate(180deg);
}

@media (prefers-reduced-motion: reduce) {
    .about-more-chevron {
        transition: none;
    }
}

.about-more-body {
    padding: 0 16px 14px;
}

.about-more-intro {
    margin: 0 0 10px;
    line-height: 1.6;
    color: rgba(var(--v-theme-on-surface), 0.78);
    text-wrap: pretty;
}

.about-more-list {
    margin: 0;
}

.about-more-row {
    display: grid;
    grid-template-columns: 8.5em 1fr;
    gap: 12px;
    align-items: baseline;
    padding: 9px 0;
    border-top: 1px solid rgba(var(--v-theme-on-surface), 0.08);
}

/* Phones, and long terms such as questions: the term above its description */
@media (max-width: 479px) {
    .about-more-row {
        grid-template-columns: 1fr;
        row-gap: 2px;
    }
}

@media (min-width: 600px) {
    .about-more-row {
        grid-template-columns: 10.5em 1fr;
    }
}

.about-more-list--stacked .about-more-row {
    grid-template-columns: 1fr;
    row-gap: 2px;
}

.about-more-term {
    font-weight: 600;
    line-height: 1.4;
}

.about-more-text {
    margin: 0;
    line-height: 1.55;
    color: rgba(var(--v-theme-on-surface), 0.8);
    text-wrap: pretty;
}

/* A row can have several lines: who and when first, then which readings */
.about-more-line {
    margin: 0;
}

.about-more-line + .about-more-line {
    margin-top: 8px;
}

/* Rows that read like a list (one line per day or per Sunday): wrapped lines are
   indented, so a continuation never looks like the next item. A lead line stays flush. */
.about-more-text--list .about-more-line:not(.about-more-lead) {
    padding-inline-start: 1em;
    text-indent: -1em;
}

.about-more-note {
    margin: 10px 0 0;
    font-size: 0.88em;
    line-height: 1.55;
    color: rgba(var(--v-theme-on-surface), 0.7);
    text-wrap: pretty;
}
</style>
