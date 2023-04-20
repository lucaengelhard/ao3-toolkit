export interface Author {
  authorName: string;
  authorLink: string | undefined;
}

export interface Fandom {
  fandomName: string;
  fandomLink: string | undefined;
}

export interface ChaptersWritten {
  chaptersWritten: number;
  chaptersMax: number;
}

export interface Relationship {
  relationshipName: string;
  relationshipLink: string | undefined;
}

export interface Character {
  characterName: string;
  characterLink: string | undefined;
}

export interface Rating {
  ratingName: string;
  ratingLink: string | undefined;
}

export interface archiveWarning {
  warningName: string;
  warningLink: string | undefined;
}

export interface Category {
  categoryName: string;
  categoryLink: string | undefined;
}

export interface Tag {
  tagName: string;
  tagLink: string | undefined;
}

export interface Series {
  seriesName: string;
  seriesLink: string | undefined;
  seriesPart: number;
}

export interface Collection {
  collectionName: string;
  collectionLink: string | undefined;
}

export interface Stats {
  words: number;
  chapters: ChaptersWritten;
  kudos: number;
  hits: number;
  bookmarks: number;
}

export interface Notes {
  preNote: string;
  endNote: string;
}

export interface Chapter {
  chapterTitle: string;
  chapterSummary: string;
  chapterNotes: string;
  chapterContent: string | null;
}

export interface Content {
  notes: Notes;
  chapters: Chapter[];
}

export interface Info {
  title: string;
  id: number;
  author: Author;
  fandom: Fandom[];
  stats: Stats;
  relationships: Relationship[];
  characters: Character[];
  rating: Rating;
  archiveWarnings: archiveWarning;
  categories: Category[];
  tags: Tag[];
  language: string;
  series: Series[];
  collections: Collection[] | number | undefined;
  summary: string;
  finished?: boolean;
}

export interface WorkHistory {
  user: string;
  lastVisit: Date;
  timesVisited: number;
  ratio: number;
  wordsRead: number;
}

export interface HistoryElement {
  user: string;
  id: number;
  lastVisit: Date;
  timesVisited: number;
}

export interface Cached {
  cached: boolean;
  index: number;
}
