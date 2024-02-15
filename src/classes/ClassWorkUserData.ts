import {
  WorkHistory,
  WorkBookmark,
} from "../interfaces/InterfaceWorkUsersData";
import User from "./ClassUser";

//TODO: Write Docs (https://www.notion.so/Write-Docs-02f09f5aed5342ecbaefcbec125062b3)
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
