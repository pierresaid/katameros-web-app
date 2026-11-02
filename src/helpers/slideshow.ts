import type { Reading, Section, Verse } from '../types/readings';
import { formatRef, pairSecond } from './readingPairs';

/** A slide's heading in one language: "LITURGIE · ÉPÎTRE DE SAINT PAUL", then the reference. */
export interface SlideHead {
    label: string;
    main: string;
}

/** A verse in both languages: the two cells start at the same height. */
export interface VerseRow {
    /** Passage and verse number: the same in every language and Bible */
    key: string;
    /** HTML: the verse number and its text */
    primary: string;
    /** Empty when the second language has no such verse */
    secondary: string;
}

/** A sentence of a synaxarium story: the smallest bit a slide can end on. */
export interface StoryPiece {
    /** The paragraph it belongs to */
    para: number;
    html: string;
    /** Its length in characters: what keeps the two languages level */
    weight: number;
}

interface UnitBase {
    /** Stable across languages, to stay on the same reading when they change */
    key: string;
    /** Section and subsection: a story missing in the new language falls back to its subsection */
    group: string;
    sectionIdx: number;
    sectionId: number;
    sectionTitle: string;
    /** What the readings menu lists */
    navTitle: string;
    navSubtitle: string;
    head: SlideHead;
    /** null when the second language has no version of this reading: one column */
    secondHead: SlideHead | null;
}

export interface VerseUnit extends UnitBase {
    kind: 'verses';
    rows: VerseRow[];
}

export interface StoryUnit extends UnitBase {
    kind: 'story';
    pieces: StoryPiece[];
    secondPieces: StoryPiece[] | null;
}

/** One reading, cut into as many slides as it needs. */
export type SlideUnit = VerseUnit | StoryUnit;

/** A section in the slideshow's readings menu. */
export interface NavGroup {
    sectionIdx: number;
    title: string;
    units: { index: number, key: string, title: string, subtitle: string }[];
}

/**
 * The day's readings as the slideshow shows them: only their text. The
 * introductions and conclusions said around each reading are left out.
 */
export function buildSlideUnits(sections: Section[] | null, secondSections: Section[] | null): SlideUnit[] {
    const units: SlideUnit[] = [];
    sections?.forEach((section, sectionIdx) => {
        section.subSections.forEach((subSection, subIdx) => {
            subSection.readings.forEach((reading, readingIdx) => {
                const second = pairSecond(section, subSection, readingIdx, secondSections);
                const label = joinLabel(section.title, subSection.title);
                const secondLabel = joinLabel(second.section?.title, second.subSection?.title);
                // A subsection with one reading is named by its title, the others by their reference
                const named = subSection.readings.length === 1 && !!subSection.title;
                const base = {
                    group: `${section.id}-${subIdx}`,
                    sectionIdx,
                    sectionId: section.id,
                    sectionTitle: section.title,
                };

                if (hasVerses(reading)) {
                    const ref = readingRef(reading);
                    const secondReading = hasVerses(second.reading) ? second.reading : undefined;
                    units.push({
                        ...base,
                        kind: 'verses',
                        key: `${section.id}-${subIdx}-${readingIdx}`,
                        navTitle: named ? subSection.title : ref,
                        navSubtitle: named ? ref : '',
                        head: { label, main: ref },
                        secondHead: secondReading ? { label: secondLabel, main: readingRef(secondReading) } : null,
                        rows: verseRows(reading, secondReading),
                    });
                }
                else if (reading.html) {
                    const title = plainText(reading.title);
                    const secondReading = second.reading?.html ? second.reading : undefined;
                    units.push({
                        ...base,
                        kind: 'story',
                        key: `${section.id}-${subIdx}-story-${reading.storyId ?? readingIdx}`,
                        navTitle: subSection.title || title,
                        navSubtitle: subSection.title ? title : '',
                        head: { label, main: title },
                        secondHead: secondReading ? { label: secondLabel, main: plainText(secondReading.title) } : null,
                        pieces: splitStory(reading.html),
                        secondPieces: secondReading ? splitStory(secondReading.html) : null,
                    });
                }
            });
        });
    });
    return units;
}

function joinLabel(...parts: (string | null | undefined)[]): string {
    return parts.filter(Boolean).join(' · ');
}

function plainText(value: unknown): string {
    return typeof value === 'string' ? value.trim() : '';
}

function hasVerses(reading: Reading | undefined): boolean {
    return !!reading?.passages?.some(p => p.verses?.length);
}

function readingRef(reading: Reading): string {
    const ref = formatRef(reading.passages);
    const title = plainText(reading.title);
    return title && ref ? `${title} — ${ref}` : title || ref;
}

/** The verses side by side, matched on their number within the same passage. */
function verseRows(reading: Reading, second: Reading | undefined): VerseRow[] {
    const rows: VerseRow[] = [];
    const keys = new Set<string>();
    reading.passages?.forEach((passage, passageIdx) => {
        const secondVerses = second?.passages?.[passageIdx]?.verses ?? [];
        const used = new Set<Verse>();
        const pairs = passage.verses.map(verse => {
            const match = secondVerses.find(v => v.number === verse.number && !used.has(v));
            if (match)
                used.add(match);
            return { verse, second: match ? [match] : [] };
        });
        // A verse only the second Bible has joins the verse before it, rather than being lost
        for (const verse of secondVerses) {
            if (used.has(verse) || !pairs.length)
                continue;
            const before = pairs.filter(p => p.verse.number < verse.number).pop() ?? pairs[0]!;
            before.second.push(verse);
            before.second.sort((a, b) => a.number - b.number);
        }
        for (const pair of pairs) {
            let key = `${passageIdx}:${pair.verse.number}`;
            while (keys.has(key))
                key += "'";
            keys.add(key);
            rows.push({ key, primary: versesHtml([pair.verse]), secondary: versesHtml(pair.second) });
        }
    });
    return rows;
}

const ESCAPES: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

export function escapeHtml(text: string): string {
    return text.replace(/[&<>"']/g, c => ESCAPES[c] ?? c);
}

export function versesHtml(verses: Pick<Verse, 'number' | 'text'>[]): string {
    return verses
        .map(v => `<span class="ss-num">${v.number}</span> ${escapeHtml(v.text.trim())}`)
        .join(' ');
}

export function headHtml(head: SlideHead): string {
    const main = head.main ? `<div class="ss-main">${escapeHtml(head.main)}</div>` : '';
    return `<div class="ss-label">${escapeHtml(head.label)}</div>${main}`;
}

/** Story pieces `from` to before `to`, back in their paragraphs. */
export function storyHtml(pieces: StoryPiece[], from: number, to: number): string {
    let html = '';
    let para = -1;
    for (let i = from; i < to; i++) {
        const piece = pieces[i];
        if (!piece)
            break;
        if (piece.para !== para) {
            if (para !== -1)
                html += '</p>';
            html += '<p>';
            para = piece.para;
        }
        else
            html += ' ';
        html += piece.html;
    }
    if (para !== -1)
        html += '</p>';
    return html;
}

const BLOCKS = new Set(['P', 'DIV', 'LI', 'BLOCKQUOTE', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6']);
const LISTS = new Set(['UL', 'OL']);

function tagOf(node: Node): string {
    return node.nodeType === Node.ELEMENT_NODE ? (node as Element).tagName : '';
}

function holdsBlocks(node: Node): boolean {
    return Array.from(node.childNodes).some(c => BLOCKS.has(tagOf(c)) || LISTS.has(tagOf(c)));
}

/**
 * A synaxarium story cut into sentences, in their paragraphs. The two columns
 * of a story can't be matched paragraph by paragraph (the translations don't
 * split them the same way), so slides end between sentences and each column
 * stops at the same share of its story.
 */
export function splitStory(html: string): StoryPiece[] {
    if (typeof document === 'undefined')
        return [{ para: 0, html, weight: html.length }];
    const template = document.createElement('template');
    template.innerHTML = html;

    const paragraphs: { nodes: Node[], item: boolean }[] = [];
    let loose: Node[] = [];
    const flush = () => {
        if (loose.length)
            paragraphs.push({ nodes: loose, item: false });
        loose = [];
    };
    const walk = (parent: Node) => {
        for (const node of Array.from(parent.childNodes)) {
            const tag = tagOf(node);
            if (LISTS.has(tag) || (BLOCKS.has(tag) && holdsBlocks(node))) {
                flush();
                walk(node);
            }
            else if (BLOCKS.has(tag)) {
                flush();
                paragraphs.push({ nodes: Array.from(node.childNodes), item: tag === 'LI' });
            }
            else if (node.nodeType === Node.TEXT_NODE) {
                // Stories without markup put their paragraphs on separate lines
                (node.textContent ?? '').split(/\r?\n/).forEach((line, i) => {
                    if (i > 0)
                        flush();
                    if (line)
                        loose.push(document.createTextNode(line));
                });
            }
            else if (node.nodeType === Node.ELEMENT_NODE)
                loose.push(node);
        }
    };
    walk(template.content);
    flush();

    const pieces: StoryPiece[] = [];
    paragraphs.forEach(({ nodes, item }, para) => {
        let html = item ? '• ' : '';
        let text = '';
        const push = () => {
            if (text.trim())
                pieces.push({ para, html: html.trim(), weight: text.trim().length });
            html = '';
            text = '';
        };
        for (const node of nodes) {
            if (node.nodeType === Node.TEXT_NODE) {
                splitSentences(node.textContent ?? '').forEach((sentence, i) => {
                    if (i > 0)
                        push();
                    html += escapeHtml(sentence);
                    text += sentence;
                });
            }
            else if (node.nodeType === Node.ELEMENT_NODE) {
                html += (node as Element).outerHTML;
                text += node.textContent ?? '';
            }
        }
        push();
    });
    return pieces;
}

// A dot, ! or ? (Arabic ؟ too), closing quotes or brackets, then a space
const SENTENCE_END = /[.!?؟…]+(?:\s*["'»”’)\]])*\s+/g;
// Words ending with a dot that don't end a sentence: "St. Mark", "Mgr. ..."
const ABBREVIATIONS = new Set(['st', 'sts', 'ste', 'sta', 'sto', 'ss', 'mt', 'mr', 'mrs', 'dr', 'fr', 'br', 'sr',
    'rev', 'hl', 'nr', 'no', 'vol', 'ch', 'cf', 'ca', 'mgr', 'abp', 'bp', 'chr', 'ap', 'etc', 'vs', 'pp']);

export function splitSentences(text: string): string[] {
    const sentences: string[] = [];
    let start = 0;
    for (const match of text.matchAll(SENTENCE_END)) {
        const at = match.index ?? 0;
        const end = at + match[0].length;
        // A sentence starts after: not a lowercase letter, and not the end of the text
        if (end >= text.length || /\p{Ll}/u.test(text.charAt(end)))
            continue;
        const word = text.slice(start, at).split(/\s/).pop() ?? '';
        if (!endsSentence(word))
            continue;
        sentences.push(text.slice(start, end));
        start = end;
    }
    sentences.push(text.slice(start));
    return sentences;
}

function endsSentence(word: string): boolean {
    const bare = word.replace(/^[(«"“'‘]+/, '');
    if (/^\p{L}$/u.test(bare))       // an initial: "J. Smith"
        return false;
    if (bare.includes('.'))           // "A.D.", "J.-C.", "d.C."
        return false;
    if (/^\d+$/.test(bare))           // German ordinals: "im 4. Jahrhundert"
        return false;
    return !ABBREVIATIONS.has(bare.toLowerCase());
}
