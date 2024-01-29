import {
  WorkHistory,
  WorkBookmark,
} from "../interfaces/InterfaceWorkUsersData";
import User from "./ClassUser";

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
