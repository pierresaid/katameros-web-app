import LANGUAGES from '../consts/languages';

export type Language = (typeof LANGUAGES)[keyof typeof LANGUAGES];

export function findLanguage(id: number | null | undefined): Language | undefined {
    return Object.values(LANGUAGES).find(l => l.id === id);
}

export function languageDir(id: number | null | undefined): 'ltr' | 'rtl' {
    const lang = findLanguage(id);
    return lang && 'rtl' in lang && lang.rtl ? 'rtl' : 'ltr';
}
