import { Tag } from "./InterfaceWorkInfo";

export interface WorkHistory {
  lastVisit: Date;
  timesVisited: number;
  ratio: number;
  wordsRead: number;
}

export interface WorkBookmark {
  dateBookmarked: Date;
  bookmarkerTags?: Tag[];
  bookmarkNotes?: string;
}
