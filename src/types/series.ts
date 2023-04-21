import ao3 from "../index.js";

export interface SeriesFullInfo {
  title: string;
  id: number;
  author: ao3.Author;
  fandom: ao3.Fandom[];
  stats: SeriesStats;
  relationships: ao3.Relationship[];
  characters: ao3.Character[];
  rating: ao3.Rating;
  archiveWarnings: ao3.archiveWarning;
  categories: ao3.Category[];
  tags: ao3.Tag[];
  summary: string;
}

export interface SeriesStats {
  words: number;
  bookmarks: number;
  works: number;
}
