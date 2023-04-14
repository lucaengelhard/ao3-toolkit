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

  get title() {
    return this.#info.title;
  }

  get id() {
    return this.#info.id;
  }

  get author() {
    return this.#info.author;
  }

  get fandom() {
    return this.#info.fandom;
  }

  get words() {
    return this.#info.stats.words;
  }

  get chapters() {
    return this.#info.stats.chapters;
  }

  get relationships() {
    return this.#info.relationships;
  }

  get characters() {
    return this.#info.characters;
  }

  get rating() {
    return this.#info.rating;
  }

  get warnings() {
    return this.#info.archiveWarnings;
  }

  get categories() {
    return this.#info.categories;
  }

  get tags() {
    return this.#info.tags;
  }

  get language() {
    return this.#info.language;
  }

  get series() {
    return this.#info.series;
  }

  get collections() {
    return this.#info.collections;
  }

  get summary() {
    return this.#info.summary;
  }

  get preNote() {
    return this.#content.notes.preNote;
  }

  get endNote() {
    return this.#content.notes.endNote;
  }

  set info(info: Info) {
    this.#info = info;
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