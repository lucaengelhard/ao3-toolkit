import { WorkUserData } from "../classes/ClassWorkUserData";
import { Tag, User } from "./InterfaceWorkInfo";

export default interface WorkUsersData {
  users: WorkUserData[];
}

export interface WorkHistory {
  lastVisit: Date;
  timesVisited: number;
  ratio: number;
  wordsRead: number;
}

export interface WorkBookmark {
  dateBookmarked: Date;
  bookmarker: User;
  bookmarkerTags?: Tag[];
  bookmarkNotes?: string;
}
