import { WorkHistory, WorkBookmark } from "../types/TypesWorkUsersData";
import User from "./ClassUser";

/**
 * Class that describes data about a single user like their reading history and bookmarks
 */
export default class WorkUserData {
  user: User;
  historyWithWork?: WorkHistory;
  bookmark?: WorkBookmark;
  constructor(input: {
    user: User;
    historyWithWork?: WorkHistory;
    bookmark?: WorkBookmark;
  }) {
    this.user = input.user;
    this.historyWithWork = input.historyWithWork;
    this.bookmark = input.bookmark;
  }
}
