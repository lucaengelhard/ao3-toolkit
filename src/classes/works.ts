import { Info, Content } from "../types/works.js";

/**
 * Base class for works. Stores information about the work as well as the content.
 */
export class Work {
  #content;
  #info;

  constructor(info: Info, content: Content) {
    this.#content = content;
    this.#info = info;
  }

  get content() {
    return this.#content;
  }

  get info() {
    return this.#info;
  }
}

/**
 * Extends the work class with information about the reading history of the work
 */
export class historyWork extends Work {
  #ratio;
  #wordsRead;
  #timesVisited;
  #lastVisit;
  constructor(
    info: Info,
    content: Content,
    lastVisit: Date,
    timesVisited: number
  ) {
    super(info, content);
    this.#lastVisit = lastVisit;
    this.#timesVisited = timesVisited;
    this.#ratio = this.#timesVisited / info.stats.chapters.chaptersWritten;
    this.#wordsRead =
      info.stats.words *
      (this.#timesVisited / info.stats.chapters.chaptersWritten);
  }

  get timesVisited() {
    return this.#timesVisited;
  }

  get lastVisit() {
    return this.#lastVisit;
  }

  /**
   * get the ratio - how many times this work was read (times visited / chapters written)
   */
  get ratio() {
    return this.#ratio;
  }

  get wordsRead() {
    return this.#wordsRead;
  }
}
