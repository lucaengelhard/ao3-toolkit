import WorkInfo from "./ClassWorkInfo";

/**
 * Base class that holds information about a single Work and optional data based on the context or the user. (e.g. history/bookmarks)
 * @param info - {@link WorkInfo} object containing information about the work
 * @param content - {@link WorkContent} object containing the content of the work
 * @param userdata - {@link WorkUserData} object containing user-linked information relating to the work
 */
export default class Work {
  #info;
  #content;
  #userdata;
  constructor(info: WorkInfo, content?: WorkContent, userdata?: WorkUserData) {
    this.#info = info;
    this.#content = content;
    this.#userdata = userdata;

    this.#info.stats.finished =
      this.#info.stats.chapters.chaptersMax ==
      this.#info.stats.chapters.chaptersWritten;

    if (typeof this.#userdata?.history !== "undefined") {
      this.#userdata.history.ratio =
        this.#userdata.history.timesVisited /
        info.stats.chapters.chaptersWritten;

      this.#userdata.history.wordsRead =
        info.stats.words * this.#userdata.history.ratio;
    }
  }

  get content() {
    return this.#content;
  }

  get info() {
    return this.#info;
  }

  get userdata() {
    return this.#userdata;
  }

  get history() {
    return this.#userdata?.history;
  }

  get bookmark() {
    return this.#userdata?.bookmark;
  }

  set userdata(userdata: WorkUserData | undefined) {
    this.#userdata = userdata;
  }
}
