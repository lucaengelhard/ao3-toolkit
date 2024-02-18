import { Tag } from "./TypesWorkInfo";

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
