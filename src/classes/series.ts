import ao3 from "..";

export class Series {
  #info;
  #bookmark?;
  #works?;
  constructor(
    info: ao3.SeriesFullInfo,
    bookmark?: ao3.WorkBookmark,
    works?: ao3.WorkList
  ) {
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
