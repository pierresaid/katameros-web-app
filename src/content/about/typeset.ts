// Keeps units a reader scans as one piece on one line: dates, Bible references,
// "St. Paul", number ranges and a few fixed names. Applied once to the whole
// copy, so the source strings stay plain.

import type { AboutLang } from './index'

type Rule = [RegExp, string]

const NBSP = ' '
const WORD_JOINER = '⁠'

const COPTIC_MONTHS = 'Thout|Babah|Hatour|Kiahk|Toubah|Amshir|Baramhat|Baramoudah|Bashans|Baounah|Abib|Misra|Nasie'
const MONTHS = 'January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sep|Oct|Nov|Dec'
const BOOKS = 'Psalms?|Matthew|Mark|Luke|John|Acts|Romans|James|Hebrews|Colossians|Isaiah|Genesis|Exodus'

// Start and end of a left-to-right isolate (Unicode bidi)
const LRI = '⁦'
const PDI = '⁩'

// A number range never breaks after its dash
const RANGE: Rule = [/(\d)–(\d)/g, `$1–${WORD_JOINER}$2`]

const ENGLISH: Rule[] = [
    [/\b(Sts?)\. /g, `$1.${NBSP}`],
    [new RegExp(`\\b(\\d{1,2}) (${COPTIC_MONTHS})\\b`, 'g'), `$1${NBSP}$2`],
    [new RegExp(`\\b(${MONTHS}) (\\d{1,2})\\b`, 'g'), `$1${NBSP}$2`],
    [new RegExp(`\\b(${BOOKS}) (\\d)`, 'g'), `$1${NBSP}$2`],
    [/\b([1-3]) (John|Peter)\b/g, `$1${NBSP}$2`],
    [/\bA\.D\. (\d)/g, `A.D.${NBSP}$1`],
    [/\b(Cyril|Gabriel) (II|V)\b/g, `$1${NBSP}$2`],
    [/\bGreat Lent\b/g, `Great${NBSP}Lent`],
    [/\bFifty Days\b/g, `Fifty${NBSP}Days`],
    [/\bGood Shepherd\b/g, `Good${NBSP}Shepherd`],
    [/\b(\d+) (dates?)\b/g, `$1${NBSP}$2`],
    [/\b(\d+(?:st|nd|rd|th)) (Sunday|day|century)\b/g, `$1${NBSP}$2`],
    RANGE,
]

// The other languages: a number stays with the word before it ("Luc 7:28", "Psaume 105")
// and with the word after it ("22 Toubah", "11. September", "1er dimanche", "13 mois")
const NUMBERS: Rule[] = [
    [/([\p{L}\p{M}]) (\d)/gu, `$1${NBSP}$2`],
    // (not the end of a verse range: "Luc 8:4–15 et Matthieu" may break after 15)
    [/(^|[^\d:–-])(\d+\p{L}*\.?) ([\p{L}\p{M}])/gu, `$1$2${NBSP}$3`],
    RANGE,
]

const RULES: Record<AboutLang, Rule[]> = {
    en: ENGLISH,
    // French spacing: a non-breaking space before : ; ! ? » and after «
    fr: [[/ ([:;!?»])/g, `${NBSP}$1`], [/« /g, `«${NBSP}`], ...NUMBERS],
    // Polish typography: "św." stays with the name, and a one-letter word
    // (a, i, o, u, w, z) never ends a line. Twice, for two in a row ("i w")
    pl: [
        [/św\. /g, `św.${NBSP}`],
        [/(^|[\s(„])([aiouwzAIOUWZ]) /g, `$1$2${NBSP}`],
        [/(^|[\s(„])([aiouwzAIOUWZ]) /g, `$1$2${NBSP}`],
        ...NUMBERS,
    ],
    // Arabic: a verse range ("6:5-14") is isolated left to right, so it reads in order in
    // right-to-left text, and a word joiner keeps the line from breaking after its hyphen
    // A Latin term in italics ("*kata meros*") stays in one piece too
    ar: [
        ...NUMBERS,
        [/(\d+:\d+)-(\d+(?::\d+)?)/g, `${LRI}$1-${WORD_JOINER}$2${PDI}`],
        [/(\*[^* ]+) ([^*]+\*)/g, `$1${NBSP}$2`],
    ],
    it: NUMBERS,
    de: NUMBERS,
    es: NUMBERS,
    nl: NUMBERS,
}

function typesetString(text: string, rules: Rule[]): string {
    return rules.reduce((s, [pattern, replacement]) => s.replace(pattern, replacement), text)
}

function typesetValue<T>(value: T, rules: Rule[]): T {
    if (typeof value === 'string') return typesetString(value, rules) as T
    if (Array.isArray(value)) return value.map(v => typesetValue(v, rules)) as T
    if (value && typeof value === 'object') {
        return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, typesetValue(v, rules)])) as T
    }
    return value
}

export function typeset<T>(value: T, lang: AboutLang): T {
    return typesetValue(value, RULES[lang])
}
