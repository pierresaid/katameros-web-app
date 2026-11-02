import { normalizeSearchText } from './searchText';
import { toCoptic } from './copticDate';

export interface DayOfYear {
    month: number;
    day: number;
}

// The Coptic months as they are usually written, in the languages of the app
const COPTIC_MONTHS = [
    ['thout', 'tout', 'tut', 'توت'],
    ['babah', 'baba', 'paopi', 'paope', 'phaophi', 'بابه'],
    ['hatour', 'hatur', 'hathor', 'hator', 'athyr', 'هاتور', 'هتور'],
    ['kiahk', 'kiyahk', 'koiak', 'khoiak', 'choiak', 'kiak', 'كيهك', 'كياك'],
    ['toubah', 'touba', 'tobi', 'tubah', 'tuba', 'طوبه'],
    ['amshir', 'amchir', 'meshir', 'mechir', 'emshir', 'امشير'],
    ['baramhat', 'paremhat', 'barmahat', 'phamenoth', 'برمهات'],
    ['baramoudah', 'baramouda', 'barmouda', 'barmoudah', 'parmouti', 'pharmouthi', 'برموده'],
    ['bashans', 'bachans', 'pashons', 'bachons', 'بشنس'],
    ['baounah', 'baouna', 'paoni', 'payni', 'baoni', 'بؤونه', 'بوونه'],
    ['abib', 'epip', 'epiph', 'epep', 'ابيب'],
    ['misra', 'mesori', 'mesra', 'mesore', 'مسري'],
    ['nasie', 'nasi', 'nasieh', 'kogi enavot', 'pi kogi enavot', 'نسيء', 'النسيء'],
].map(names => names.map(normalizeSearchText));

const gregorianMonthsByLocale = new Map<string, string[][]>();

// January to December, long and short, in the page language and in English
function gregorianMonths(locale: string): string[][] {
    let months = gregorianMonthsByLocale.get(locale);
    if (!months) {
        months = Array.from({ length: 12 }, (_, m) => {
            const date = new Date(2026, m, 1);
            const names = new Set<string>();
            for (const loc of [locale, 'en'])
                for (const month of ['long', 'short'] as const)
                    names.add(normalizeSearchText(new Intl.DateTimeFormat(loc, { month }).format(date)).replace(/\.$/, ''));
            return [...names];
        });
        gregorianMonthsByLocale.set(locale, months);
    }
    return months;
}

// The month (1-based) whose name starts with the word; none when the word
// is too short or fits several months ("bar": Baramhat and Baramoudah)
function monthOf(months: string[][], word: string): number | null {
    if (word.length < 3)
        return null;
    const found = new Set<number>();
    months.forEach((names, i) => {
        if (names.some(name => name.startsWith(word)))
            found.add(i + 1);
    });
    return found.size === 1 ? [...found][0]! : null;
}

/**
 * A day searched for: "23 babah", "babah 23", "1er thout", a Gregorian date
 * of this year in the page language ("2 novembre", "November 2"), or the
 * word for today. Null for any other search.
 */
export function parseDateQuery(query: string, locale: string, todayWord: string): DayOfYear | null {
    const text = normalizeSearchText(query.trim())
        .replace(/[٠-٩]/g, d => String(d.charCodeAt(0) - 0x660))
        .replace(/[۰-۹]/g, d => String(d.charCodeAt(0) - 0x6f0))
        .replace(/\s+/g, ' ');
    if (!text)
        return null;
    if (text === normalizeSearchText(todayWord) || text === 'today') {
        const today = toCoptic(new Date());
        return { month: today.month, day: today.day };
    }

    const dayFirst = text.match(/^(\d{1,2})(?:er|re|e|st|nd|rd|th)?\.?\s*(\D+)$/);
    const monthFirst = text.match(/^(\D+?)\s*(\d{1,2})(?:er|re|e|st|nd|rd|th)?\.?$/);
    const day = Number(dayFirst?.[1] ?? monthFirst?.[2]);
    const word = (dayFirst?.[2] ?? monthFirst?.[1] ?? '')
        .trim()
        .replace(/^(de|del|di|van|of)\s+/, '')
        .replace(/\.$/, '');
    if (!day || !word)
        return null;

    const coptic = monthOf(COPTIC_MONTHS, word);
    if (coptic)
        return day <= (coptic === 13 ? 6 : 30) ? { month: coptic, day } : null;

    const gregorian = monthOf(gregorianMonths(locale), word);
    if (gregorian) {
        const date = new Date(new Date().getFullYear(), gregorian - 1, day);
        if (date.getMonth() !== gregorian - 1)
            return null;
        const coptic = toCoptic(date);
        return { month: coptic.month, day: coptic.day };
    }
    return null;
}
