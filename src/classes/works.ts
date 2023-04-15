import ao3 from "..";

/**
 * Base class for works. Stores information about the work as well as the content.
 */
export class Work {
  #content;
  #info;
  #history;

  constructor(
    info: ao3.Info,
    content?: ao3.Content,
    history?: ao3.WorkHistory
  ) {
    this.#content = content;
    this.#info = info;
    this.#history = history;

    if (typeof this.#history !== "undefined") {
      this.#history.ratio =
        this.#history.timesVisited / info.stats.chapters.chaptersWritten;

      this.#history.wordsRead = info.stats.words * this.#history.ratio;
    }
  }

  get content() {
    return this.#content;
  }

  get info() {
    return this.#info;
  }

  get history() {
    return this.#history;
  }
}
