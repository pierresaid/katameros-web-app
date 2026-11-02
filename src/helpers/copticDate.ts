export interface CopticDate {
    day: number;
    month: number;
    year: number;
}

let formatter: Intl.DateTimeFormat | null = null;

/** The Coptic date of a day, from the browser's Coptic calendar. */
export function toCoptic(date: Date): CopticDate {
    formatter ??= new Intl.DateTimeFormat('en-u-ca-coptic', { day: 'numeric', month: 'numeric', year: 'numeric' });
    const parts = formatter.formatToParts(date);
    const part = (type: Intl.DateTimeFormatPartTypes) => Number(parts.find(p => p.type === type)?.value ?? 0);
    return { day: part('day'), month: part('month'), year: part('year') };
}

const yearStarts = new Map<number, Date>();

/** 1 Thout of a Coptic year: 11 September, or the 12th before a Gregorian leap year. */
function yearStart(year: number): Date | null {
    let start = yearStarts.get(year);
    for (let day = 9; day <= 13 && !start; day++) {
        const date = new Date(year + 283, 8, day);
        const coptic = toCoptic(date);
        if (coptic.year === year && coptic.month === 1 && coptic.day === 1)
            start = date;
    }
    if (start)
        yearStarts.set(year, start);
    return start ?? null;
}

/** The Gregorian day of a Coptic date; null for a 6 Nasie outside the leap years. */
export function copticToGregorian(month: number, day: number, year: number): Date | null {
    const start = yearStart(year);
    if (!start)
        return null;
    const date = new Date(start.getFullYear(), start.getMonth(), start.getDate() + (month - 1) * 30 + day - 1);
    const check = toCoptic(date);
    return check.month === month && check.day === day ? date : null;
}
