import type { Tag } from "./TypesWorkInfo.ts";

export type WorkHistory = {
  lastVisit: Date;
  timesVisited: number;
  ratio: number;
  wordsRead: number;
};

export type WorkBookmark = {
  dateBookmarked: Date;
  bookmarkerTags?: Tag[];
  bookmarkNotes?: string;
};
