import WorkContent from "../interfaces/InterfaceWorkContent";
import WorkUsersData from "../interfaces/InterfaceWorkUsersData";
import WorkInfo from "./ClassWorkInfo";

/**
 * Base class that holds information about a single Work and optional data based on the context or the user. (e.g. history/bookmarks)
 * @param info - {@link WorkInfo} object containing information about the work
 * @param content - {@link WorkContent} object containing the content of the work
 * @param userdata - {@link WorkUsersData} object containing user-linked information relating to the work
 */
export default class Work {
  info;
  content;
  userdata;
  constructor(
    info?: WorkInfo,
    content?: WorkContent,
    userdata?: WorkUsersData
  ) {
    this.info = info;
    this.content = content;
    this.userdata = userdata;
  }
}
