import { Info, Content } from "../types/works.js";

export class Fanfiction {
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
}

export class historyFanfiction extends Fanfiction {
  #info;
  #timesVisited;
  #lastVisit;
  constructor(
    info: Info,
    content: Content,
    lastVisit: Date,
    timesVisited: number
  ) {
    super(info, content);
    this.#info = info;
    this.#lastVisit = lastVisit;
    this.#timesVisited = timesVisited;
  }

  get timesVisited() {
    return this.#timesVisited;
  }

  get lastVisit() {
    return this.#lastVisit;
  }

  get ratio() {
    return this.#timesVisited / this.#info.stats.chapters.chaptersWritten;
  }

  get wordsRead() {
    return (
      this.#info.stats.words *
      (this.#timesVisited / this.#info.stats.chapters.chaptersWritten)
    );
  }
}
