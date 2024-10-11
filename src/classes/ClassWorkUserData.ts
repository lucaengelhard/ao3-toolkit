import type { WorkHistory, WorkBookmark } from "../types/TypesWorkUsersData.ts";
import type User from "./ClassUser.ts";

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
