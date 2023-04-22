export type * from "./index.js";

export interface Login {
  username: string;
  password: string;
}

export interface UserInfo {
  id?: number;
  username: string;
  userLink: string;
  pseuds?: string[];
  joined?: Date;
}

export interface WorkSearch {
  bookmarks?: number;
  characterNames?: string[];
  comments?: number;
  complete?: boolean;
  creators?: string[];
  crossover?: boolean;
  fandoms?: string[];
  freeforms?: string[];
  hits?: number;
  kudos?: number;
  languageCode?: string;
  query?: string;
  rating?: string;
  relationships?: string[];
  revisedAt?: string;
  singleChapter?: boolean;
  sortBy?: string;
  sortDirection?: string;
  title?: string;
  wordCount?: number;
}

export interface PeopleSearch {
  query?: string;
  name?: string;
  fandoms?: string[];
}

export interface BookmarkSearch {
  workQuery?: string;
  workTags?: string[];
  workType?: string;
  workLanguage?: string;
  workDateUpdated?: string;
  bookmarkQuery?: string;
  bookmarkTags?: string[];
  bookmarker?: string;
  bookmarkNotes?: string;
  rec?: boolean;
  withNotes?: boolean;
  bookmarkDate?: string;
  sortBy?: string;
}

export interface TagSearch {
  canonical?: boolean;
  fandoms?: string[];
  name?: string;
  sortBy?: string;
  sortDirection?: string;
  type?: string;
}

export interface SearchedTag {
  type: string;
  name: string;
  link: string;
}

export interface SeriesFullInfo {
  title: string;
  id: number;
  author: Author;
  fandom: Fandom[];
  stats: SeriesStats;
  relationships: Relationship[];
  characters: Character[];
  rating: Rating;
  archiveWarnings: archiveWarning;
  categories: Category[];
  tags: Tag[];
  summary: string;
}

export interface SeriesStats {
  words: number;
  bookmarks: number;
  works: number;
}

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

export interface SeriesInfo {
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
  series: SeriesInfo[];
  collections: Collection[] | number | undefined;
  summary: string;
  finished?: boolean;
}

export interface WorkUserData {
  user?: string;
  history?: WorkHistory;
  bookmark?: WorkBookmark;
}

export interface WorkHistory {
  lastVisit: Date;
  timesVisited: number;
  ratio: number;
  wordsRead: number;
}

export interface WorkBookmark {
  dateBookmarked: Date;
  bookmarker: Author;
  bookmarkerTags?: Tag[];
  bookmarkNotes?: string;
}

export interface PageSpan {
  start: number | undefined;
  end: number | undefined;
}

export interface Cached {
  cached: boolean;
  index: number;
}
