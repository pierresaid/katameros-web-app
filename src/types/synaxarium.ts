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

// GET /synaxarium/{slug}?languageId=
export interface SynaxStory {
  storyId: number;
  slug: string;
  month: number;
  day: number;
  title: string;
  html: string;
}
