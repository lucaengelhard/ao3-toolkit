import { Tag } from "./InterfaceWorkInfo";

//TODO: Write Docs (https://www.notion.so/Write-Docs-7d5ca69100794a459b38d2d876a568fc)
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
