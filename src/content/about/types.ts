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
    note: string
}

/** A service of the day, with the readings the Katameros gives for it. */
export interface AboutService {
    name: string
    when: string
    /** The readings in order, under the titles the app uses. */
    parts: string[]
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
        note: string
    }
    books: {
        heading: string
        intro: string
        items: AboutLabeledText[]
    }
    calendar: AboutSection
    choice: {
        heading: string
        intro: string
        weekdays: AboutSection
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
