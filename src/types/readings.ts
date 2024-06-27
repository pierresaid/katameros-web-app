
export interface Verse {
    id: number;
    bibleId: number;
    bookId: number;
    chapter: number;
    number: number;
    text: string;
}

export interface Passage {
    bookId: number;
    bookTranslation: string;
    chapter: number;
    ref: string;
    verses: Verse[];
}

export interface Reading {
    id: number;
    title?: any;
    introduction: string;
    conclusion: string;
    passages?: Passage[];
    html: string;
}

export interface SubSection {
    id: number;
    title: string;
    introduction: string;
    readings: Reading[];
}

export interface Section {
    id: number;
    title: string;
    subSections: SubSection[];
}

export interface Bible {
    id: number;
    name: string;
    languageId: number;
}
export interface DayReading {
    title?: any;
    periodInfo: string;
    bible: Bible;
    bibles: Bible[];
    sections: Section[];
}


