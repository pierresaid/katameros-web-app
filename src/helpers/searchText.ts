const escapeHtml = (text: string): string => text
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;');

export const normalizeSearchText = (text: string): string => text
  .toLowerCase()
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/\u0153/g, 'oe')
  .replace(/\u00e6/g, 'ae')
  .replace(/\u00df/g, 'ss')
  .replace(/[\u2018\u2019\u02bc]/g, "'")
  .replace(/[\u201c\u201d]/g, '"')
  .replace(/[-\u2010-\u2015]/g, ' ')
  .replace(/[\u064b-\u065f\u0670\u0640]/g, '')
  .replace(/[\u0622\u0623\u0625\u0671]/g, '\u0627')
  .replace(/\u0629/g, '\u0647')
  .replace(/\u0649/g, '\u064a');

export const highlightSearchMatches = (text: string, query: string): string => {
  const needle = normalizeSearchText(query.trim());
  if (!needle) {
    return escapeHtml(text);
  }

  const chars = Array.from(text);
  let folded = '';
  const sourceIndex: number[] = [];
  chars.forEach((char, index) => {
    const foldedChar = normalizeSearchText(char);
    folded += foldedChar;
    for (let i = 0; i < foldedChar.length; i++) {
      sourceIndex.push(index);
    }
  });

  const ranges: Array<[number, number]> = [];
  let from = 0;
  while (from <= folded.length - needle.length) {
    const at = folded.indexOf(needle, from);
    if (at === -1) {
      break;
    }
    const end = at + needle.length;
    const start = sourceIndex[at];
    const last = sourceIndex[end - 1];
    if (start === undefined || last === undefined) {
      break;
    }
    ranges.push([start, last + 1]);
    from = end;
  }

  if (ranges.length === 0) {
    return escapeHtml(text);
  }

  let html = '';
  let cursor = 0;
  for (const [start, end] of ranges) {
    html += escapeHtml(chars.slice(cursor, start).join(''));
    html += `<b>${escapeHtml(chars.slice(start, end).join(''))}</b>`;
    cursor = end;
  }
  html += escapeHtml(chars.slice(cursor).join(''));
  return html;
};
