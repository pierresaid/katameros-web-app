import { onBeforeUnmount, onMounted, shallowRef, watch, type Ref } from 'vue';
import { headHtml, storyHtml, type SlideUnit, type StoryUnit, type VerseUnit } from '../helpers/slideshow';

export interface LangAttrs {
    code: string;
    dir: 'ltr' | 'rtl';
}

export interface SlideLangs {
    primary: LangAttrs;
    /** null: one language */
    secondary: LangAttrs | null;
}

export interface Slide {
    unit: number;
    /** Verse rows, or the main language's story pieces, from `from` to before `to` */
    from: number;
    to: number;
    /** The second language's story pieces */
    secondFrom: number;
    secondTo: number;
    /** Below 1 when the text had to shrink to fit: a verse longer than a whole slide */
    scale: number;
}

export interface SlideDeck {
    units: SlideUnit[];
    slides: Slide[];
    /** The first slide of each unit */
    starts: number[];
}

type Cut = Omit<Slide, 'unit'>;

// Kept free under the last line, against rounding
const SAFETY = 2;
const MIN_SCALE = 0.3;
// How much further (in share of the story) a story column may stop to end a
// paragraph together with the other column
const PARAGRAPH_PULL = 0.04;

/** Two columns only when the second language has this reading too. */
export function twoColumns(unit: SlideUnit, langs: SlideLangs): boolean {
    return !!unit.secondHead && !!langs.secondary;
}

function div(className: string, lang?: LangAttrs | null, html?: string): HTMLDivElement {
    const el = document.createElement('div');
    el.className = className;
    if (lang) {
        el.lang = lang.code;
        el.dir = lang.dir;
    }
    if (html !== undefined)
        el.innerHTML = html;
    return el;
}

const heightOf = (el: Element) => el.getBoundingClientRect().height;

/** The same elements and classes as slide-view.vue, so that they measure the same. */
function skeleton(unit: SlideUnit, langs: SlideLangs) {
    const two = twoColumns(unit, langs);
    const slide = div(two ? 'ss-slide' : 'ss-slide ss-slide--single');
    const head = div('ss-head');
    head.append(div('ss-head-cell', langs.primary, headHtml(unit.head)));
    if (two)
        head.append(div('ss-head-cell', langs.secondary, headHtml(unit.secondHead!)));
    const body = div('ss-body');
    slide.append(head, body);
    return { slide, head, body, two };
}

/** The largest font scale (down to MIN_SCALE) at which `measure` fits. */
function fitScale(body: HTMLElement, measure: () => number, available: number): number {
    let lo = MIN_SCALE;
    let hi = 1;
    for (let i = 0; i < 7; i++) {
        const mid = (lo + hi) / 2;
        body.style.setProperty('--ss-fit', String(mid));
        if (measure() <= available)
            lo = mid;
        else
            hi = mid;
    }
    body.style.removeProperty('--ss-fit');
    return Math.floor(lo * 1000) / 1000;
}

/** Rows in order, a new slide whenever the next one doesn't fit. */
function pack(heights: number[], gap: number, capacity: number): [number, number][] {
    const ranges: [number, number][] = [];
    let start = 0;
    let used = 0;
    heights.forEach((height, i) => {
        if (i > start && used + gap + height > capacity) {
            ranges.push([start, i]);
            start = i;
            used = height;
        }
        else
            used += (i > start ? gap : 0) + height;
    });
    if (start < heights.length)
        ranges.push([start, heights.length]);
    return ranges;
}

/**
 * As few slides as possible, then evened out (the smallest capacity that still
 * needs no more slides), so the last one is not a stray verse.
 */
function packEvenly(heights: number[], gap: number, capacity: number): [number, number][] {
    const fewest = pack(heights, gap, capacity);
    if (fewest.length < 2)
        return fewest;
    let lo = 0;
    let hi = capacity;
    while (hi - lo > 1) {
        const mid = (lo + hi) / 2;
        if (pack(heights, gap, mid).length <= fewest.length)
            hi = mid;
        else
            lo = mid;
    }
    return pack(heights, gap, hi);
}

function cutVerses(unit: VerseUnit, langs: SlideLangs, root: HTMLElement, height: number): Cut[] {
    const { slide, head, body, two } = skeleton(unit, langs);
    const rows = div('ss-rows');
    for (const row of unit.rows) {
        const rowEl = div('ss-row');
        rowEl.append(div('ss-cell', langs.primary, row.primary));
        if (two)
            rowEl.append(div('ss-cell', langs.secondary, row.secondary));
        rows.append(rowEl);
    }
    body.append(rows);
    root.replaceChildren(slide);

    const available = height - heightOf(head) - SAFETY;
    const gap = parseFloat(getComputedStyle(rows).rowGap) || 0;
    const rowEls = Array.from(rows.children);
    const heights = rowEls.map(heightOf);
    return packEvenly(heights, gap, available).map(([from, to]) => {
        // Only a lone verse can be taller than the slide: it shrinks to fit
        const scale = to - from === 1 && heights[from]! > available
            ? fitScale(body, () => heightOf(rowEls[from]!), available)
            : 1;
        return { from, to, secondFrom: 0, secondTo: 0, scale };
    });
}

/**
 * A story in two columns that can't be matched sentence by sentence: each
 * slide ends where the column that fits less text ends, and the other column
 * stops at the same share of its story, so the two stay level.
 */
function cutStory(unit: StoryUnit, langs: SlideLangs, root: HTMLElement, height: number): Cut[] {
    const { slide, head, body, two } = skeleton(unit, langs);
    const story = div('ss-story');
    const cols = [div('ss-col', langs.primary)];
    if (two)
        cols.push(div('ss-col', langs.secondary));
    story.append(...cols);
    body.append(story);
    root.replaceChildren(slide);

    const available = height - heightOf(head) - SAFETY;
    const columns = [unit.pieces, two ? unit.secondPieces ?? [] : []];
    // Running total of the text length, to compare the columns' progress
    const sums = columns.map(pieces => {
        const sum = [0];
        for (const piece of pieces)
            sum.push(sum[sum.length - 1]! + piece.weight);
        return sum;
    });
    const share = (col: number, b: number) => {
        const sum = sums[col]!;
        const total = sum[sum.length - 1]!;
        return total ? sum[b]! / total : 1;
    };

    const measured = new Map<string, number>();
    const measure = (col: number, a: number, b: number) => {
        if (a >= b)
            return 0;
        const key = `${col}:${a}:${b}`;
        let value = measured.get(key);
        if (value === undefined) {
            cols[col]!.innerHTML = storyHtml(columns[col]!, a, b);
            value = heightOf(cols[col]!);
            measured.set(key, value);
        }
        return value;
    };

    // The most pieces from `a` that fit; a lone piece when even it is too tall
    const fit = (col: number, a: number, capacity: number) => {
        const n = columns[col]!.length;
        if (a >= n)
            return a;
        if (measure(col, a, n) <= capacity)
            return n;
        let lo = a + 1;
        let hi = n - 1;
        if (measure(col, a, lo) > capacity)
            return lo;
        while (lo < hi) {
            const mid = Math.ceil((lo + hi) / 2);
            if (measure(col, a, mid) <= capacity)
                lo = mid;
            else
                hi = mid - 1;
        }
        return lo;
    };

    // Whether the boundary before piece `b` ends a paragraph
    const paragraphEnd = (col: number, b: number) => {
        const pieces = columns[col]!;
        return b >= pieces.length || pieces[b]!.para !== pieces[b - 1]?.para;
    };

    // The boundary between `lo` and `hi` nearest to the given share of the
    // story; when the other column ends a paragraph, one that ends a paragraph
    // too wins if it is almost as near
    const nearest = (col: number, lo: number, hi: number, target: number, preferParagraph: boolean) => {
        const score = (b: number) => Math.abs(share(col, b) - target)
            - (preferParagraph && paragraphEnd(col, b) ? PARAGRAPH_PULL : 0);
        let best = hi;
        for (let b = lo; b < hi; b++)
            if (score(b) < score(best))
                best = b;
        return best;
    };

    const cut = (capacity: number) => {
        const ranges: [number, number, number, number][] = [];
        const [n0, n1] = [columns[0]!.length, columns[1]!.length];
        let a = 0;
        let c = 0;
        while (a < n0 || c < n1) {
            let b = fit(0, a, capacity);
            let d = fit(1, c, capacity);
            if (a < n0 && c < n1) {
                // The column that fits less sets the pace
                const pacing = share(0, b) <= share(1, d) ? 0 : 1;
                const target = Math.min(share(0, b), share(1, d));
                const atParagraphEnd = paragraphEnd(pacing, pacing === 0 ? b : d);
                b = nearest(0, a + 1, b, target, atParagraphEnd);
                d = nearest(1, c + 1, d, target, atParagraphEnd);
            }
            ranges.push([a, b, c, d]);
            a = b;
            c = d;
        }
        return ranges;
    };

    // Evened out like the verses: the smallest capacity that needs no more slides
    let ranges = cut(available);
    if (ranges.length > 1) {
        const count = ranges.length;
        let lo = available / 3;
        let hi = available;
        for (let i = 0; i < 9 && hi - lo > 2; i++) {
            const mid = (lo + hi) / 2;
            if (cut(mid).length <= count)
                hi = mid;
            else
                lo = mid;
        }
        ranges = cut(hi);
    }

    return ranges.map(([from, to, secondFrom, secondTo]) => {
        let scale = 1;
        if (Math.max(measure(0, from, to), measure(1, secondFrom, secondTo)) > available) {
            cols[0]!.innerHTML = storyHtml(columns[0]!, from, to);
            if (two)
                cols[1]!.innerHTML = storyHtml(columns[1]!, secondFrom, secondTo);
            scale = fitScale(body, () => Math.max(...cols.map(heightOf)), available);
        }
        return { from, to, secondFrom, secondTo, scale };
    });
}

/**
 * Cuts the readings into slides that fit the screen: whole verses (or whole
 * sentences of a story) as many as fit, measured on hidden copies of the
 * slides at the real size. Cuts again when the screen size, the text size, the
 * languages or the fonts change.
 */
export function useSlidePagination(options: {
    units: Ref<SlideUnit[]>,
    langs: Ref<SlideLangs>,
    zoom: Ref<number>,
    /** The area the slides fill */
    frame: Ref<HTMLElement | null>,
    /** A hidden element inside the frame, to measure in */
    measurer: Ref<HTMLElement | null>,
}) {
    const deck = shallowRef<SlideDeck>({ units: [], slides: [], starts: [] });
    let run = 0;
    let frameRequest = 0;
    let resizeTimer: ReturnType<typeof setTimeout> | undefined;
    let observer: ResizeObserver | null = null;
    let lastSize = '';
    let mounted = false;

    function schedule() {
        if (!mounted || frameRequest)
            return;
        frameRequest = requestAnimationFrame(() => {
            frameRequest = 0;
            void cutAll();
        });
    }

    async function cutAll() {
        const current = ++run;
        // Measuring with a fallback font would cut in the wrong places
        await document.fonts?.ready;
        if (current !== run || !mounted)
            return;
        const frame = options.frame.value;
        const root = options.measurer.value;
        const units = options.units.value;
        if (!frame || !root)
            return;
        const height = heightOf(frame);
        if (!units.length || height <= 0) {
            deck.value = { units, slides: [], starts: [] };
            return;
        }
        const langs = options.langs.value;
        const slides: Slide[] = [];
        const starts: number[] = [];
        units.forEach((unit, idx) => {
            starts.push(slides.length);
            const cuts = unit.kind === 'verses'
                ? cutVerses(unit, langs, root, height)
                : cutStory(unit, langs, root, height);
            for (const c of cuts)
                slides.push({ unit: idx, ...c });
        });
        root.replaceChildren();
        deck.value = { units, slides, starts };
    }

    watch([options.units, options.langs, options.zoom], schedule);

    onMounted(() => {
        mounted = true;
        const frame = options.frame.value;
        if (frame && typeof ResizeObserver !== 'undefined') {
            const rect = frame.getBoundingClientRect();
            lastSize = `${Math.round(rect.width)}x${Math.round(rect.height)}`;
            observer = new ResizeObserver(entries => {
                const box = entries[0]?.contentRect;
                const size = box ? `${Math.round(box.width)}x${Math.round(box.height)}` : '';
                if (size === lastSize)
                    return;
                lastSize = size;
                clearTimeout(resizeTimer);
                resizeTimer = setTimeout(schedule, 120);
            });
            observer.observe(frame);
        }
        // A font that loads late (Arabic is only fetched once some is shown) changes the measures
        document.fonts?.addEventListener?.('loadingdone', schedule);
        schedule();
    });

    onBeforeUnmount(() => {
        mounted = false;
        run++;
        cancelAnimationFrame(frameRequest);
        frameRequest = 0;
        clearTimeout(resizeTimer);
        observer?.disconnect();
        document.fonts?.removeEventListener?.('loadingdone', schedule);
    });

    return { deck };
}
