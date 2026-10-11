// Finds the precise Gospel references in a line of the copy ("Luc 7:28–35"), so the
// page can let the reader open their text. Works on the typeset copy: a non-breaking
// space after the book, a word joiner after the dash, Arabic left-to-right isolates.

import type { AboutLang } from './index'

/** The Gospels as the copy names them, with their book ids in the app's database */
const GOSPELS: Record<AboutLang, Record<string, number>> = {
    en: { Matthew: 40, Mark: 41, Luke: 42, John: 43 },
    fr: { Matthieu: 40, Marc: 41, Luc: 42, Jean: 43 },
    ar: { 'متى': 40, 'مرقس': 41, 'لوقا': 42, 'يوحنا': 43 },
    it: { Matteo: 40, Marco: 41, Luca: 42, Giovanni: 43 },
    de: { 'Matthäus': 40, Markus: 41, Lukas: 42, Johannes: 43 },
    pl: { Mateusza: 40, Marka: 41, 'Łukasza': 42, Jana: 43 },
    es: { Mateo: 40, Marcos: 41, Lucas: 42, Juan: 43 },
    nl: { 'Mattheüs': 40, Markus: 41, Lukas: 42, Johannes: 43 },
}

const patterns = new Map<AboutLang, RegExp>()
function patternFor(lang: AboutLang): RegExp {
    let re = patterns.get(lang)
    if (!re) {
        const names = Object.keys(GOSPELS[lang]).sort((a, b) => b.length - a.length).join('|')
        // "Luc 7:28–35", or across two chapters "Jean 15:26–16:15"
        re = new RegExp(`(${names})[ \\u00a0]\\u2066?(\\d+):(\\d+)[–-]\\u2060?(?:(\\d+):)?(\\d+)\\u2069?`, 'gu')
        patterns.set(lang, re)
    }
    return re
}

/** A reference as shown, and the key of its passage ("42.7:28-35"). The brackets and
    punctuation that touch it come with it, so a line never breaks between them. */
export interface AboutRef {
    ref: string
    key: string
    before: string
    after: string
}

export type AboutTextPart = string | AboutRef

/** Splits a line into plain text and the references the reader can open */
export function splitRefs(text: string, lang: AboutLang): AboutTextPart[] {
    const parts: AboutTextPart[] = []
    let last = 0
    for (const m of text.matchAll(patternFor(lang))) {
        const [ref, book, chapter, from, toChapter, to] = m
        const index = m.index ?? 0
        const before = /[(«„“"]$/.exec(text.slice(last, index))?.[0] ?? ''
        const after = /^[)»“”"]*[.,;:!?،؛]?/.exec(text.slice(index + ref.length))?.[0] ?? ''
        if (index - before.length > last)
            parts.push(text.slice(last, index - before.length))
        const end = toChapter ? `${toChapter}:${to}` : to
        parts.push({ ref, key: `${GOSPELS[lang][book!]}.${chapter}:${from}-${end}`, before, after })
        last = index + ref.length + after.length
    }
    if (last < text.length)
        parts.push(text.slice(last))
    return parts
}
