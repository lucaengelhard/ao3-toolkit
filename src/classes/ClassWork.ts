import type { WorkContent } from "../types/TypesWorkContent.ts";
import getWorkContent from "../utils/getWorkContent.ts";
import getWorkInfo from "../utils/getWorkInfo.ts";
import type WorkInfo from "./ClassWorkInfo.ts";
import type WorkUserData from "./ClassWorkUserData.ts";

/**
 * Base class that holds information about a single Work and optional data based on the context or the user. (e.g. history/bookmarks)
 * @param info - {@link WorkInfo} object containing information about the work
 * @param content - {@link WorkContent} object containing the content of the work
 * @param userdata - Arry of {@link WorkUserData} objects containing user-linked information relating to the work
 */
export default class Work {
  info: WorkInfo | undefined;
  content: WorkContent | undefined;
  userdata: WorkUserData[] | undefined;
  constructor(
    info?: WorkInfo,
    content?: WorkContent,
    userdata?: WorkUserData[]
  ) {
    this.info = info;
    this.content = content;
    this.userdata = userdata;
  }

  async refresh(): Promise<void> {
    if (this.info?.id) {
      this.info = await getWorkInfo(this.info?.id);
    }
    if (this.info?.id) {
      this.content = await getWorkContent(this.info?.id);
    }
  }

  public async get(id: number): Promise<Work> {
    return new Work(await getWorkInfo(id), await getWorkContent(id));
  }
}
