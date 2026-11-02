const escapeHtml = (text: string): string => text
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;');

export const normalizeSearchText = (text: string): string => text
  .toLowerCase()
  .normalize('NFD')
  .replace(/[̀-ͯ]/g, '')
  .replace(/œ/g, 'oe')
  .replace(/æ/g, 'ae')
  .replace(/ß/g, 'ss')
  .replace(/[‘’ʼ]/g, "'")
  .replace(/[“”]/g, '"')
  .replace(/[-‐-―]/g, ' ')
  .replace(/[ً-ٰٟـ]/g, '')
  .replace(/[آأإٱ]/g, 'ا')
  .replace(/ة/g, 'ه')
  .replace(/ى/g, 'ي');

/**
 * The words of a search, folded like the texts they are looked for in. Every
 * word must be found, in any order.
 */
export const searchTokens = (query: string): string[] => normalizeSearchText(query)
  .split(/\s+/)
  .map(word => word.replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, ''))
  .filter(Boolean);

// Folding one character at a time is what maps a match back to the original
// text; the same few characters come back all the time, so they are kept
const foldedChars = new Map<string, string>();
const foldChar = (char: string): string => {
  let folded = foldedChars.get(char);
  if (folded === undefined) {
    folded = normalizeSearchText(char);
    foldedChars.set(char, folded);
  }
  return folded;
};

/** Where the words are found in `chars` (code points), as merged [start, end) ranges. */
const matchRanges = (chars: string[], tokens: string[]): Array<[number, number]> => {
  let folded = '';
  const sourceIndex: number[] = [];
  chars.forEach((char, index) => {
    const foldedChar = foldChar(char);
    folded += foldedChar;
    for (let i = 0; i < foldedChar.length; i++) {
      sourceIndex.push(index);
    }
  });

  const ranges: Array<[number, number]> = [];
  for (const token of tokens) {
    let from = 0;
    while (from <= folded.length - token.length) {
      const at = folded.indexOf(token, from);
      if (at === -1) {
        break;
      }
      const start = sourceIndex[at];
      const last = sourceIndex[at + token.length - 1];
      if (start === undefined || last === undefined) {
        break;
      }
      ranges.push([start, last + 1]);
      from = at + token.length;
    }
  }

  ranges.sort((a, b) => a[0] - b[0]);
  const merged: Array<[number, number]> = [];
  for (const [start, end] of ranges) {
    const previous = merged[merged.length - 1];
    if (previous && start <= previous[1]) {
      previous[1] = Math.max(previous[1], end);
    } else {
      merged.push([start, end]);
    }
  }
  return merged;
};

const markRanges = (chars: string[], ranges: Array<[number, number]>, from = 0, to = chars.length): string => {
  let html = '';
  let cursor = from;
  for (const [start, end] of ranges) {
    if (end <= from || start >= to) {
      continue;
    }
    const s = Math.max(start, from);
    const e = Math.min(end, to);
    html += escapeHtml(chars.slice(cursor, s).join(''));
    html += `<b>${escapeHtml(chars.slice(s, e).join(''))}</b>`;
    cursor = e;
  }
  return html + escapeHtml(chars.slice(cursor, to).join(''));
};

/** The text as HTML, with the searched words in <b>. */
export const highlightTokens = (text: string, tokens: string[]): string => {
  const chars = Array.from(text);
  return markRanges(chars, tokens.length ? matchRanges(chars, tokens) : []);
};

/**
 * A short passage around the first searched word found in the text, cut
 * between words, as HTML with the words in <b>; empty when none is found.
 */
export const excerptAround = (text: string, tokens: string[], before = 60, after = 120): string => {
  const chars = Array.from(text);
  const ranges = matchRanges(chars, tokens);
  const first = ranges[0];
  if (!first) {
    return '';
  }
  let start = Math.max(0, first[0] - before);
  let end = Math.min(chars.length, first[1] + after);
  if (start > 0) {
    const space = chars.indexOf(' ', start);
    if (space !== -1 && space < first[0]) {
      start = space + 1;
    }
  }
  if (end < chars.length) {
    const space = chars.lastIndexOf(' ', end);
    if (space > first[1]) {
      end = space;
    }
  }
  return (start > 0 ? '… ' : '') + markRanges(chars, ranges, start, end) + (end < chars.length ? ' …' : '');
};

/**
 * The story HTML with the searched words wrapped in <mark>, inside the text
 * only (never in a tag). Needs a DOM: only called in the browser.
 */
export const highlightHtml = (html: string, tokens: string[]): string => {
  if (!tokens.length || typeof document === 'undefined') {
    return html;
  }
  const template = document.createElement('template');
  template.innerHTML = html;
  const walker = document.createTreeWalker(template.content, NodeFilter.SHOW_TEXT);
  const nodes: Text[] = [];
  while (walker.nextNode()) {
    nodes.push(walker.currentNode as Text);
  }
  for (const node of nodes) {
    const chars = Array.from(node.data);
    const ranges = matchRanges(chars, tokens);
    if (!ranges.length) {
      continue;
    }
    const fragment = document.createDocumentFragment();
    let cursor = 0;
    for (const [start, end] of ranges) {
      fragment.append(chars.slice(cursor, start).join(''));
      const mark = document.createElement('mark');
      mark.className = 'story-match';
      mark.textContent = chars.slice(start, end).join('');
      fragment.append(mark);
      cursor = end;
    }
    fragment.append(chars.slice(cursor).join(''));
    node.replaceWith(fragment);
  }
  return template.innerHTML;
};
