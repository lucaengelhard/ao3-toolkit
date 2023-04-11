import axios from "axios";
import {
  getAuthor,
  getCategories,
  getCharacters,
  getCollections,
  getContent,
  getFandom,
  getFic,
  getHistory,
  getInfo,
  getLanguage,
  getRating,
  getRelationships,
  getSeries,
  getStats,
  getSummary,
  getTags,
  getTitle,
  getWarnings,
} from "./functions";
import { logindata, Login } from "./login";
import * as cheerio from "cheerio";

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

export interface Notes {
  preNote: string;
  endNote: string;
}

export interface Chapter {
  chapterTitle: string;
  chapterSummary: string;
  chapterNotes: string;
  chapterContent: string | null;
}

export interface Content {
  notes: Notes;
  chapters: Array<Chapter>;
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
  archiveWarnings: archiveWarning;
  categories: Array<Category>;
  tags: Array<Tag>;
  language: string;
  series: Array<Series>;
  collections: Array<Collection>;
  summary: string;
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

  async getHistory() {
    return await getHistory(this.#logindata);
  }

  async getHistoryFic(id: number) {
    let userHistory = await getHistory(this.#logindata);
    let fanFiction = await getFic(id);

    let matchingElement = userHistory.find((element) => {
      return element.id == fanFiction.id;
    });

    if (matchingElement == undefined) {
      return;
    } else {
      return new historyFanfiction(
        fanFiction.info,
        fanFiction.content,
        matchingElement.lastVisit,
        matchingElement.timesVisited
      );
    }
  }

  //getBookmarks() {}
  //getHistory + andere user-based functions

  static async getFic(id: number) {
    return await getFic(id);
  }

  static async getContent(fic: number | cheerio.CheerioAPI) {
    return await getContent(fic);
  }

  static async getInfo(fic: number | cheerio.CheerioAPI, id?: number) {
    return await getInfo(fic, id);
  }

  //static get Functions
}

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

test(19865440);

async function test(id: number) {
  console.time("test");
  let fic = await getInfo(id);
  console.log(fic);
  console.timeEnd("test");
}

/*

history(logindata);

async function history(logindata: Login) {
  let userhistory = await getHistory(logindata);
  console.log(userhistory);
}
*/
