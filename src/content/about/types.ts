// Long-form copy of the About page, one module per language (en.ts, ...).
// The page goes from the essentials down to the details: each section says the
// basics in the open, and its deeper material sits in a closed "more" panel.

export interface AboutLabeledText {
    name: string
    text: string
}

export interface AboutSection {
    heading: string
    paragraphs: string[]
}

/** A row of a "more" panel. Several strings are shown as separate lines (e.g. who, then which readings). */
export interface AboutMoreItem {
    name: string
    /** A line before the text, not part of the list (e.g. what the items have in common). */
    lead?: string
    text: string | string[]
    /** The lines are list items (one per day, per Sunday…): wrapped lines get indented. */
    list?: boolean
    /** Continues the row above (e.g. Holy Week, then its days): no separator line between them */
    joined?: boolean
}

/** Details the reader can open: term / description rows framed by an intro and notes. */
export interface AboutMore {
    title: string
    intro?: string
    items: AboutMoreItem[]
    notes?: string[]
    /** Put each term above its description (for long terms such as questions). */
    stacked?: boolean
}

/** A section whose paragraphs lead into term / description rows. */
export interface AboutListSection extends AboutSection {
    items: AboutLabeledText[]
    /** Short paragraphs after the rows */
    after: string[]
}

/** A service of the day, with the readings the Katameros gives for it. */
export interface AboutService {
    name: string
    when: string
    /** The readings in order, under the titles the app uses. */
    parts: string[]
}

/** The Gospels of the weekdays list (texts in passages/weekdays-<lang>.json) */
export type AboutPassageKey = 'prophets' | 'persecution' | 'shepherd' | 'virgins'

/** A Gospel passage in the reader's language, with its verses as [number, text] */
export interface AboutPassage {
    ref: string
    /** The verse label is its number, or "16:1" in the second chapter of a passage across two */
    verses: [number | string, string][]
}

/** passages/<group>-<lang>.json: passages in that language's default Bible in the app,
    keyed by AboutPassageKey (weekdays) or by reference, as "42.7:28-35" (sundays) */
export interface AboutPassages {
    bible: string
    passages: Record<string, AboutPassage>
}

/** A Gospel the Katameros reads for one kind of saint */
export interface AboutGospel {
    /** Who it is read for ("For a prophet") */
    name: string
    /** What it tells ("The prophets who were killed") */
    text: string
    /** The short reference on the page ("Matthew 23"); the passage itself is more precise */
    ref: string
    passage: AboutPassageKey
}

export interface AboutContent {
    /** The page's heading (for screen readers), also its title in search results */
    title: string
    /** For search results and link previews only, not shown on the page (about 150 characters) */
    description: string
    lead: string
    name: AboutSection
    church: AboutSection
    contents: {
        heading: string
        intro: string
        services: AboutService[]
        readingsLabel: string
        readings: AboutLabeledText[]
    }
    books: {
        heading: string
        intro: string
        items: AboutLabeledText[]
    }
    calendar: AboutSection
    choice: {
        heading: string
        /** Leads into the list of the three things that decide a day's readings */
        intro: string
        /** One row each, in the order of the subsections that explain them */
        factors: { name: string, detail?: string }[]
        /** Which one wins when they fall on the same day */
        priority: string
        weekdays: {
            heading: string
            /** Leads into the Gospels list */
            intro: string
            gospels: AboutGospel[]
            /** The button that opens a Gospel's text */
            openLabel: string
            /** After the list */
            paragraphs: string[]
        }
        sundays: AboutSection & { more: AboutMore }
        seasons: AboutListSection & { more: AboutMore }
    }
    /** Labels of the buttons and links that close the page */
    footer: {
        readings: string
        contact: string
        /** Before the store links, with its colon (e.g. "Get the app:") */
        getApp: string
        sourceCode: string
    }
}
