import { getFic, getHistory } from "./functions";
import { logindata, Login } from "./login";

export interface Author {
  authorName: string;
  authorLink: string | undefined;
}

export interface Fandom {
  fandomName: string;
  fandomLink: string | undefined;
}

export interface ChaptersWritten {
  chaptersWritten: number;
  chaptersMax: number;
}

export interface Relationship {
  relationshipName: string;
  relationshipLink: string | undefined;
}

export interface Character {
  characterName: string;
  characterLink: string | undefined;
}

export interface Rating {
  ratingName: string;
  ratingLink: string | undefined;
}

export interface archiveWarning {
  warningName: string;
  warningLink: string | undefined;
}

export interface Category {
  categoryName: string;
  categoryLink: string | undefined;
}

export interface Tag {
  tagName: string;
  tagLink: string | undefined;
}

export interface Series {
  seriesName: string;
  seriesLink: string | undefined;
  seriesPart: number;
}

export interface Collection {
  collectionName: string;
  collectionLink: string | undefined;
}

export interface Stats {
  words: number;
  chapters: ChaptersWritten;
  kudos: number;
  hits: number;
  bookmarks: number;
}

export interface Chapter {
  chapterTitle: string;
  chapterSummary: string;
  chapterNotes: string;
  chapterContent: string | null;
}

export interface Info {
  title: string;
  id: number;
  author: Author;
  fandom: Array<Fandom>;
  stats: Stats;
  relationships: Array<Relationship>;
  characters: Array<Character>;
  adult: boolean;
  rating: Rating;
  archiveWarnings: Array<archiveWarning>;
  categories: Array<Category>;
  tags: Array<Tag>;
  language: string;
  series: Series;
  collections: Array<Collection>;
  summary: string;
  preNote: string;
  endNote: string;
}

export class ao3 {
  #logindata;
  constructor(logindata: Login) {
    this.#logindata = logindata;
  }

  get logindata() {
    return this.#logindata;
  }

  set username(username: string) {
    this.#logindata.username = username;
  }

  set password(password: string) {
    this.#logindata.password = password;
  }

  //getHistory + andere user-based functions
  //static get Functions
}

export class Fanfiction {
  #content;
  #info;

  constructor(info: Info, content: Array<Chapter>) {
    this.#content = content;
    this.#info = info;
  }

  get content() {
    return this.#content;
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
    return this.#info.preNote;
  }

  get endNote() {
    return this.#info.endNote;
  }

  get adult() {
    return this.#info.adult;
  }
}

export class historyFanfiction extends Fanfiction {
  #info;
  #timesVisited;
  #lastVisit;
  constructor(
    info: Info,
    content: Array<Chapter>,
    lastVisit: string,
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

history(logindata);

async function history(logindata: Login) {
  let userhistory = await getHistory(logindata);
  console.log(userhistory);
}

/*
let id: string = "19865440";

download(id);

async function download(id: string) {
  let fic1 = await getFic(id);
  console.log(fic1.endNote);
}
*/
