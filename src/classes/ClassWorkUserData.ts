import {
  WorkHistory,
  WorkBookmark,
} from "../interfaces/InterfaceWorkUsersData";

export class WorkUserData {
  username: string;
  historyWithWork?: WorkHistory;
  bookmark?: WorkBookmark;
  constructor(input: {
    username: string;
    historyWithWork?: WorkHistory;
    bookmark?: WorkBookmark;
  }) {
    this.username = input.username;
    this.historyWithWork = input.historyWithWork;
    this.bookmark = input.bookmark;
  }
}
