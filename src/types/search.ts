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
