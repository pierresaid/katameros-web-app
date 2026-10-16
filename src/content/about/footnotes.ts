import type { InjectionKey } from 'vue'

// The inline markup of the About copy: *foreign term*, set in italics, and [^id], the call
// of a footnote (the note of that id at the bottom of the page).

export type AboutRichPart =
    | { kind: 'text', text: string }
    | { kind: 'italic', text: string }
    | { kind: 'note', id: string }

const MARKUP = /\*([^*]+)\*|\[\^([a-z0-9-]+)\]/g

export function richParts(text: string): AboutRichPart[] {
    const parts: AboutRichPart[] = []
    const markup = new RegExp(MARKUP)
    let last = 0
    let m: RegExpExecArray | null
    while ((m = markup.exec(text))) {
        if (m.index > last)
            parts.push({ kind: 'text', text: text.slice(last, m.index) })
        const [, italic, note] = m
        parts.push(note !== undefined ? { kind: 'note', id: note } : { kind: 'italic', text: italic ?? '' })
        last = markup.lastIndex
    }
    if (last < text.length)
        parts.push({ kind: 'text', text: text.slice(last) })
    return parts
}

/** What a footnote call needs from the page: the note's number, and the way to it */
export interface AboutFootnotes {
    number: (id: string) => number | undefined
    /** Before the number, for screen readers ("Note 1") */
    label: () => string
    open: (id: string) => void
}

export const ABOUT_FOOTNOTES: InjectionKey<AboutFootnotes> = Symbol('about-footnotes')
