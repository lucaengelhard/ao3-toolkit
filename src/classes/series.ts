import type { SeriesFullInfo, WorkBookmark } from "../interfaces.js";
import { WorkList } from "./works.js";

/**
 * Class that stores information about a single series.
 */
export class Series {
  #info;
  #bookmark?;
  #works?;
  constructor(info: SeriesFullInfo, bookmark?: WorkBookmark, works?: WorkList) {
    this.#info = info;
    this.#bookmark = bookmark;
    this.#works = works;
  }

  get info() {
    return this.#info;
  }

  get bookmark() {
    return this.#bookmark;
  }

  get works() {
    return this.#works;
  }
}
