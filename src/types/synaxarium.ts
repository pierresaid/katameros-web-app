// One row of the static title lists in assets/synax-days-*.json
export interface SynaxEntry {
  Day: number;
  Month: number;
  Title: string;
  // Same id as the readings' synaxarium storyId, shared by every translation
  StoryId: number;
  // Permanent English slug, the same in every language
  Slug: string;
}

// A story opened from the synaxarium list, so the list comes back to it
export interface OpenedStory {
  slug: string;
  /** Where its row was, from the top of the list's area */
  offset: number;
  /** How many search results were shown */
  shown: number;
  /** The search results in their order (empty from the calendar): the story page's previous and next follow them */
  slugs: string[];
  /** The searched words, marked in the story */
  tokens: string[];
}

// GET /synaxarium/{slug}?languageId=
export interface SynaxStory {
  storyId: number;
  slug: string;
  month: number;
  day: number;
  title: string;
  html: string;
}
