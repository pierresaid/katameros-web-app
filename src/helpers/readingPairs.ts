import type { Passage, Reading, Section, SubSection, Verse } from '../types/readings';

export interface SecondPair {
    section?: Section;
    subSection?: SubSection;
    reading?: Reading;
}

/**
 * The second language's version of a reading: the section and subsection with
 * the same ids, then the reading at the same position. Synaxarium stories share
 * a storyId across translations, but the languages don't have the same stories
 * in the same order, so they are matched on it.
 */
export function pairSecond(section: Section | undefined, subSection: SubSection, readingIdx: number,
    secondSections: Section[] | null | undefined): SecondPair {
    const secondSection = section ? secondSections?.find(s => s.id === section.id) : undefined;
    const secondSubSection = secondSection?.subSections.find(ss => ss.id === subSection.id);
    if (!secondSubSection)
        return { section: secondSection };

    const storyId = subSection.readings[readingIdx]?.storyId;
    const reading = storyId != null
        ? secondSubSection.readings.find(r => r.storyId === storyId)
        : secondSubSection.readings[readingIdx];
    return { section: secondSection, subSection: secondSubSection, reading };
}

/** The verse with the same number in the same passage of the second language's reading. */
export function findSecondVerse(secondReading: Reading | undefined, passageIdx: number, verseNumber: number): Verse | undefined {
    return secondReading?.passages?.[passageIdx]?.verses.find(v => v.number === verseNumber);
}

/** "Romains 5:1-11 & 6:1-5": the book is only named again when it changes. */
export function formatRef(passages: Passage[] | undefined): string {
    if (!passages)
        return '';
    return passages
        .map((passage, i) => {
            const book = i === 0 || passages[i - 1]?.bookId !== passage.bookId ? passage.bookTranslation ?? '' : '';
            return `${book} ${passage.ref ?? ''}`.trim();
        })
        .join(' & ');
}
