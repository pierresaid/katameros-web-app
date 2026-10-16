<script setup lang="ts">
import { computed, onMounted, provide, ref, shallowRef } from 'vue';
import { Capacitor } from '@capacitor/core';
import CopticCrossOutline from '@/components/coptic-cross-outline.vue';
import AboutMore from '@/components/about-more.vue';
import AboutPassageSheet from '@/components/about-passage-sheet.vue';
import AboutRichText from '@/components/about-rich-text.vue';
import { useSeo } from '@/composables/useSeo';
import { useCurrentLang } from '@/composables/useCurrentLang';
import { track } from '@/helpers/track';
import { ABOUT_CONTENT, ABOUT_LANGS, aboutLang } from '@/content/about';
import { typeset } from '@/content/about/typeset';
import { splitRefs } from '@/content/about/refs';
import { ABOUT_FOOTNOTES } from '@/content/about/footnotes';
import type { AboutPassages } from '@/content/about/types';

const lang = useCurrentLang();
// The copy's own language: English on the Thai page, which has no translation
const copyLang = computed(() => aboutLang(lang.value));
const c = computed(() => typeset(ABOUT_CONTENT[copyLang.value], copyLang.value));

// The page's heading is its title in search results ("What is the Katameros? - Katameros")
useSeo({ title: () => c.value.title, description: () => c.value.description, langs: ABOUT_LANGS });

// Footnotes, as in a book: a small number in the text and the note at the bottom of the page.
// Each leads to the other: the page scrolls it to the middle of the screen, clear of the app
// bar, and moves the focus there (on a note, its row stays lit until the focus leaves).
const noteNumbers = computed(() => new Map(c.value.footnotes.items.map((n, i) => [n.id, i + 1])));
function goTo(id: string) {
    const el = document.getElementById(id);
    if (!el)
        return;
    const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'center' });
    el.focus({ preventScroll: true });
}
provide(ABOUT_FOOTNOTES, {
    number: id => noteNumbers.value.get(id),
    label: () => c.value.footnotes.label,
    open: id => goTo(`note-${id}`),
});

// The Gospels of the weekdays list and the references of the Sundays and seasons panels
// open in a sheet. Their texts load on the first opening only (one file per group and language),
// so they cost nothing to the page.
type PassageGroup = 'weekdays' | 'sundays' | 'seasons';
const passageFiles = import.meta.glob<AboutPassages>('@/content/about/passages/*.json', { import: 'default' });
const loadedPassages = shallowRef<Record<string, AboutPassages>>({});
const opened = ref<{ group: PassageGroup, key: string, eyebrow: string } | null>(null);

async function openPassage(group: PassageGroup, key: string, eyebrow: string) {
    opened.value = { group, key, eyebrow };
    track('about-passage', { passage: key });
    const file = `${group}-${copyLang.value}`;
    if (loadedPassages.value[file])
        return;
    const load = Object.entries(passageFiles).find(([path]) => path.endsWith(`/${file}.json`))?.[1];
    const data = load ? await load() : null;
    if (data)
        loadedPassages.value = { ...loadedPassages.value, [file]: data };
}
const openedFile = computed(() => (opened.value ? loadedPassages.value[`${opened.value.group}-${copyLang.value}`] : undefined));
const openedPassage = computed(() => (opened.value && openedFile.value?.passages[opened.value.key]) || null);
const refsIn = (text: string) => splitRefs(text, copyLang.value);

// Store links only make sense on the web: hidden in the native apps, and in
// the prerendered HTML until the page knows where it runs.
const isNative = ref(true);
onMounted(() => { isNative.value = Capacitor.isNativePlatform(); });
</script>

<template>
    <v-container class="about-page" :lang="copyLang">
        <!-- The readings page's cross, still, above the one-sentence intro. No visible title:
             the heading is for screen readers and search engines -->
        <header class="about-intro">
            <h1 class="d-sr-only">{{ c.title }}</h1>
            <CopticCrossOutline class="about-cross" aria-hidden="true" />
            <p class="about-lead">{{ c.lead }}</p>
        </header>

        <section class="about-section" aria-labelledby="about-name">
            <h2 id="about-name" class="about-heading">{{ c.name.heading }}</h2>
            <p v-for="(p, i) in c.name.paragraphs" :key="i" class="about-text"><AboutRichText :text="p" /></p>
        </section>

        <section class="about-section" aria-labelledby="about-church">
            <h2 id="about-church" class="about-heading">{{ c.church.heading }}</h2>
            <p v-for="(p, i) in c.church.paragraphs" :key="i" class="about-text"><AboutRichText :text="p" /></p>
        </section>

        <section class="about-section" aria-labelledby="about-contents">
            <h2 id="about-contents" class="about-heading">{{ c.contents.heading }}</h2>
            <p class="about-text"><AboutRichText :text="c.contents.intro" /></p>
            <ol class="about-card about-day" role="list">
                <li v-for="s in c.contents.services" :key="s.name" class="about-day-row">
                    <div class="about-eyebrow">{{ s.when }}</div>
                    <div class="about-card-title">{{ s.name }}</div>
                    <ul class="about-day-parts" role="list">
                        <li v-for="p in s.parts" :key="p">{{ p }}</li>
                    </ul>
                </li>
            </ol>
            <h3 class="about-label">{{ c.contents.readingsLabel }}</h3>
            <dl class="about-list">
                <div v-for="r in c.contents.readings" :key="r.name" class="about-list-row">
                    <dt class="about-list-term">{{ r.name }}</dt>
                    <dd class="about-list-text">{{ r.text }}</dd>
                </div>
            </dl>
        </section>

        <section class="about-section" aria-labelledby="about-books">
            <h2 id="about-books" class="about-heading">{{ c.books.heading }}</h2>
            <p class="about-text"><AboutRichText :text="c.books.intro" /></p>
            <dl class="about-list">
                <div v-for="b in c.books.items" :key="b.name" class="about-list-row">
                    <dt class="about-list-term">{{ b.name }}</dt>
                    <dd class="about-list-text">{{ b.text }}</dd>
                </div>
            </dl>
        </section>

        <section class="about-section" aria-labelledby="about-calendar">
            <h2 id="about-calendar" class="about-heading">{{ c.calendar.heading }}</h2>
            <p v-for="(p, i) in c.calendar.paragraphs" :key="i" class="about-text"><AboutRichText :text="p" /></p>
        </section>

        <!-- The three things that decide a day's readings, one subsection each -->
        <section class="about-section" aria-labelledby="about-choice">
            <h2 id="about-choice" class="about-heading">{{ c.choice.heading }}</h2>
            <p class="about-text"><AboutRichText :text="c.choice.intro" /></p>
            <ul class="about-list about-factors" role="list">
                <li v-for="f in c.choice.factors" :key="f.name" class="about-list-row about-factor">
                    <span>
                        {{ f.name }}
                        <span v-if="f.detail" class="about-factor-detail">({{ f.detail }})</span>
                    </span>
                </li>
            </ul>
            <p class="about-text about-after-list"><AboutRichText :text="c.choice.priority" /></p>

            <h3 class="about-subheading">{{ c.choice.weekdays.heading }}</h3>
            <p v-for="(p, i) in c.choice.weekdays.intro" :key="`intro-${i}`" class="about-text"><AboutRichText :text="p" /></p>
            <!-- Each Gospel opens its text: the reference is the button, and it covers the whole row -->
            <dl class="about-list">
                <div v-for="g in c.choice.weekdays.gospels" :key="g.passage" class="about-list-row about-gospel-row">
                    <dt class="about-list-term">{{ g.name }}</dt>
                    <dd class="about-list-text">
                        {{ g.text }}
                        <button type="button" class="about-ref" :aria-label="`${c.choice.weekdays.openLabel} ${g.ref}`"
                            @click="openPassage('weekdays', g.passage, g.name)">
                            <v-icon icon="mdi-book-open-variant" size="14" class="about-ref-icon" aria-hidden="true" />
                            <span class="about-ref-text">{{ g.ref }}</span>
                        </button>
                    </dd>
                </div>
            </dl>
            <p v-for="(p, i) in c.choice.weekdays.paragraphs" :key="i" class="about-text"
                :class="{ 'about-after-list': i === 0 }"><AboutRichText :text="p" /></p>

            <h3 class="about-subheading">{{ c.choice.sundays.heading }}</h3>
            <p v-for="(p, i) in c.choice.sundays.paragraphs" :key="i" class="about-text"><AboutRichText :text="p" /></p>
            <AboutMore :more="c.choice.sundays.more" :refs="refsIn" :open-label="c.choice.weekdays.openLabel"
                @open-ref="(key, eyebrow) => openPassage('sundays', key, eyebrow)" />

            <h3 class="about-subheading">{{ c.choice.seasons.heading }}</h3>
            <p v-for="(p, i) in c.choice.seasons.paragraphs" :key="i" class="about-text"><AboutRichText :text="p" /></p>
            <dl class="about-list">
                <div v-for="item in c.choice.seasons.items" :key="item.name" class="about-list-row">
                    <dt class="about-list-term">{{ item.name }}</dt>
                    <dd class="about-list-text">{{ item.text }}</dd>
                </div>
            </dl>
            <AboutMore :more="c.choice.seasons.more" :refs="refsIn" :open-label="c.choice.weekdays.openLabel"
                @open-ref="(key, eyebrow) => openPassage('seasons', key, eyebrow)" />
        </section>

        <!-- The footnotes: each note links back to its number in the text -->
        <section v-if="c.footnotes.items.length" class="about-section about-footnotes"
            aria-labelledby="about-footnotes">
            <h2 id="about-footnotes" class="about-subheading">{{ c.footnotes.heading }}</h2>
            <ol class="about-footnotes-list">
                <li v-for="n in c.footnotes.items" :id="`note-${n.id}`" :key="n.id" class="about-footnote"
                    tabindex="-1">
                    <!-- A no-break space keeps the arrow on the line of the note's last word -->
                    <AboutRichText :text="n.text" />&nbsp;<a :href="`#note-ref-${n.id}`" class="about-footnote-back"
                        :aria-label="c.footnotes.backLabel" @click.prevent="goTo(`note-ref-${n.id}`)">↑</a>
                </li>
            </ol>
        </section>

        <!-- The Gospel texts the page can open (weekdays list, Sundays panel) -->
        <AboutPassageSheet :open="!!opened" :eyebrow="opened?.eyebrow ?? ''" :passage="openedPassage"
            :bible="openedFile?.bible ?? ''" @close="opened = null" />

        <!-- The page's closing actions -->
        <footer class="about-footer">
            <div class="about-actions">
                <v-btn :to="{ name: 'home', params: { lang } }" color="primary" variant="flat"
                    prepend-icon="mdi-book-open-page-variant">
                    {{ c.footer.readings }}
                </v-btn>
                <v-btn :to="{ name: 'contact', params: { lang } }" variant="tonal"
                    prepend-icon="mdi-message-alert-outline" @click="track('about-contact')">
                    {{ c.footer.contact }}
                </v-btn>
            </div>
            <p v-if="!isNative" class="about-links">
                {{ c.footer.getApp }}
                <a href="https://play.google.com/store/apps/details?id=com.dcoanbamarc.katamerosmobile"
                    target="_blank" rel="noopener" @click="track('about-play')">Google Play</a>
                ·
                <a href="https://apps.apple.com/app/id6475370514" target="_blank" rel="noopener"
                    @click="track('about-app-store')">App Store</a>
            </p>
            <p class="about-links about-links--source">
                <a href="https://github.com/pierresaid/katameros-web-app" target="_blank" rel="noopener"
                    @click="track('about-github')">{{ c.footer.sourceCode }}</a>
            </p>
        </footer>
    </v-container>
</template>

<style scoped>
.about-page {
    max-width: 680px;
    padding-bottom: 48px;
}

/* The app's global container padding is 8px on phones: too tight for long text */
@media (max-width: 768px) {
    .about-page {
        padding-inline: 16px;
    }
}

/* The cross of the readings page, still and smaller, above the centered intro */
.about-intro {
    text-align: center;
}

.about-cross {
    display: block;
    width: 64px;
    height: 64px;
    margin: 10px auto 14px;
}

.about-lead {
    font-size: 1.05em;
    line-height: 1.6;
    color: rgba(var(--v-theme-on-surface), 0.8);
    max-width: 32em;
    margin: 0 auto;
    text-wrap: balance;
}

.about-section {
    margin-top: 44px;
}

/* Suez One has no Arabic or Thai letters: Arabic falls back to the app's Arabic face,
   as in the body text, rather than to the browser's default */
.about-heading {
    font-family: 'Suez one', 'ScheherazadeNew', sans-serif;
    font-weight: 400;
    font-size: 1.5em;
    line-height: 1.25;
    margin: 0 0 12px;
}

.about-subheading {
    font-family: 'Suez one', 'ScheherazadeNew', sans-serif;
    font-weight: 400;
    font-size: 1.2em;
    line-height: 1.3;
    margin: 32px 0 10px;
}

/* Quiet uppercase label above a list, as above the fasts band on the feasts page */
.about-label {
    font-size: 0.82em;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: rgba(var(--v-theme-on-surface), 0.6);
    margin: 24px 0 6px;
}

.about-heading,
.about-subheading {
    text-wrap: balance;
}

.about-eyebrow {
    font-size: 0.78em;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: rgba(var(--v-theme-on-surface), 0.6);
}

.about-text {
    line-height: 1.7;
    color: rgba(var(--v-theme-on-surface), 0.87);
    margin: 0 0 12px;
    text-wrap: pretty;
}

/* Term / description rows: the five books */
.about-list {
    margin: 0;
}

.about-list-row {
    display: grid;
    grid-template-columns: 8.5em 1fr;
    gap: 12px;
    align-items: baseline;
    padding: 9px 0;
    border-top: 1px solid rgba(var(--v-theme-on-surface), 0.08);
}

.about-list-row:last-child {
    border-bottom: 1px solid rgba(var(--v-theme-on-surface), 0.08);
}

/* Phones: the term above its description, so the text gets the full width */
@media (max-width: 479px) {
    .about-list-row {
        grid-template-columns: 1fr;
        row-gap: 2px;
    }
}

/* Wide enough for "Acts of the Apostles" on one line */
@media (min-width: 600px) {
    .about-list-row {
        grid-template-columns: 10.5em 1fr;
    }
}

.about-list-term {
    font-weight: 600;
    line-height: 1.4;
}

.about-list-text {
    margin: 0;
    line-height: 1.5;
    color: rgba(var(--v-theme-on-surface), 0.78);
    text-wrap: pretty;
}

/* A day's three services, as hairline rows of one card (card tokens of the feasts page) */
.about-card {
    border-radius: 12px;
    background-color: rgba(var(--v-theme-on-surface), 0.03);
    border: 1px solid rgba(var(--v-theme-on-surface), 0.06);
}

.about-card-title {
    font-family: 'Suez one', 'ScheherazadeNew', sans-serif;
    font-size: 1.1em;
    line-height: 1.3;
    margin-top: 2px;
}

.about-day {
    list-style: none;
    margin: 16px 0 0;
    padding: 2px 16px;
}

.about-day-row {
    padding: 12px 0;
}

.about-day-row + .about-day-row {
    border-top: 1px solid rgba(var(--v-theme-on-surface), 0.08);
}

.about-day-parts {
    list-style: none;
    padding: 0;
    margin: 4px 0 0;
    display: flex;
    flex-wrap: wrap;
    column-gap: 6px;
    font-weight: 600;
    line-height: 1.5;
}

/* Trailing separators, so a wrapped line never starts with a dot; silent for screen readers */
.about-day-parts li:not(:last-child)::after {
    content: '·';
    content: '·' / '';
    margin-inline-start: 6px;
    font-weight: 400;
    color: rgba(var(--v-theme-on-surface), 0.45);
}

/* The three things that decide the readings: short items in the hairline rows of the lists */
.about-factors {
    list-style: none;
    padding: 0;
}

.about-factors .about-list-row {
    grid-template-columns: 1fr;
}

.about-factor {
    font-weight: 600;
    line-height: 1.4;
}

.about-factor-detail {
    font-weight: 400;
    color: rgba(var(--v-theme-on-surface), 0.78);
}

/* The footnotes: smaller text under a hairline, numbered as in a book */
.about-footnotes {
    padding-top: 20px;
    border-top: 1px solid rgba(var(--v-theme-on-surface), 0.12);
}

.about-footnotes .about-subheading {
    margin-top: 0;
}

.about-footnotes-list {
    margin: 0;
    padding-inline-start: 1.6em;
    font-size: 0.92em;
    line-height: 1.6;
    color: rgba(var(--v-theme-on-surface), 0.78);
}

.about-footnote {
    padding: 4px 6px;
    margin-inline-start: -6px;
    border-radius: 6px;
    transition: background-color 0.3s;
}

.about-footnote + .about-footnote {
    margin-top: 6px;
}

.about-footnote:focus {
    outline: none;
    background-color: rgba(var(--v-theme-on-surface), 0.06);
}

.about-footnote::marker {
    font-weight: 600;
}

/* Back to the number in the text: up, whatever the direction of the script */
.about-footnote-back {
    padding: 0 6px;
    color: rgba(var(--v-theme-on-surface), 0.6);
    text-decoration: none;
}

/* A list followed by prose: the same air as before a list's note */
.about-after-list {
    margin-top: 14px;
}

/* A Gospel reference that opens its text: reads as part of the line, with a small
   book and a soft underline saying it can be opened */
.about-ref {
    display: inline-flex;
    align-items: baseline;
    gap: 4px;
    margin-inline-start: 4px;
    padding: 0 2px;
    color: rgba(var(--v-theme-on-surface), 0.87);
    white-space: nowrap;
    cursor: pointer;
}

/* The whole row opens the text: the button's ::after is stretched over the row
   (the button itself has no position), so the list keeps one real button per row */
.about-gospel-row {
    position: relative;
}

.about-ref::after {
    content: '';
    position: absolute;
    inset: 1px -8px;
    border-radius: 8px;
    transition: background-color 0.15s;
}

.about-ref-icon {
    align-self: center;
    color: rgba(var(--v-theme-on-surface), 0.55);
}

.about-ref-text {
    text-decoration-line: underline;
    text-decoration-style: dotted;
    text-decoration-thickness: 1px;
    text-underline-offset: 3px;
    text-decoration-color: rgba(var(--v-theme-on-surface), 0.45);
}

.about-ref:hover::after {
    background-color: rgba(var(--v-theme-on-surface), 0.04);
}

.about-ref:hover .about-ref-text {
    text-decoration-color: rgba(var(--v-theme-on-surface), 0.8);
}

/* The focus ring goes around the row it opens */
.about-ref:focus-visible {
    outline: none;
}

.about-ref:focus-visible::after {
    outline: 2px solid rgba(var(--v-theme-on-surface), 0.87);
}

/* After the last section, with the same air as between sections */
.about-footer {
    margin-top: 44px;
}

.about-footer .about-actions {
    margin-top: 0;
}

.about-actions {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 8px;
    margin-top: 24px;
}

/* Equal widths, so the pair lines up when it stacks on phones */
.about-actions .v-btn {
    min-width: 220px;
}

.about-links {
    margin: 14px 0 0;
    text-align: center;
    font-size: 0.85em;
    color: rgba(var(--v-theme-on-surface), 0.7);
}

.about-links + .about-links--source {
    margin-top: 4px;
}

/* The global `a { text-decoration: none }` would leave these links unmarked */
.about-links a {
    color: inherit;
    text-decoration-line: underline;
    text-underline-offset: 3px;
    text-decoration-color: rgba(var(--v-theme-on-surface), 0.35);
}
</style>
