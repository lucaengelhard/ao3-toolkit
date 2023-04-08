import { getFic } from "./functions";

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

export interface Chapter {
  chapterTitle: string;
  chapterSummary: string;
  chapterNotes: string;
  chapterContent: string | null;
}

/*

export interface Fic {
  title: string;
  id: number;
  author: Author;
  fandom: Array<Fandom>;
  words: number;
  chapters: ChaptersWritten;
  relationships: Array<Relationship>;
  characters: Array<Character>;
  tags: Array<Tag>;
  language: string;
  series: Series;
  collections: Array<Collection>;
  summary: string;
  preNote: string;
  content: Array<Chapter>;
  timesVisited: number;
  lastVisit: string;
  ratio: number;
}*/

export class Fanfiction {
  #title;
  #id;
  #author;
  #fandom;
  #words;
  #chapters;
  #relationships;
  #characters;
  #tags;
  #language;
  #series;
  #collections;
  #summary;
  #preNote;
  #content;
  #adult;
  constructor(
    title: string,
    id: number,
    author: Author,
    fandom: Array<Fandom>,
    words: number,
    chapters: ChaptersWritten,
    relationships: Array<Relationship>,
    characters: Array<Character>,
    tags: Array<Tag>,
    language: string,
    series: Series,
    collections: Array<Collection>,
    summary: string,
    preNote: string,
    content: Array<Chapter>,
    adult: boolean
  ) {
    this.#title = title;
    this.#id = id;
    this.#author = author;
    this.#fandom = fandom;
    this.#words = words;
    this.#chapters = chapters;
    this.#relationships = relationships;
    this.#characters = characters;
    this.#tags = tags;
    this.#language = language;
    this.#series = series;
    this.#collections = collections;
    this.#summary = summary;
    this.#preNote = preNote;
    this.#content = content;
    this.#adult = adult;
  }

  get title() {
    return this.#title;
  }

  get id() {
    return this.#id;
  }

  get author() {
    return this.#author;
  }

  get fandom() {
    return this.#fandom;
  }

  get words() {
    return this.#words;
  }

  get chapters() {
    return this.#chapters;
  }

  get relationships() {
    return this.#relationships;
  }

  get characters() {
    return this.#characters;
  }

  get tags() {
    return this.#tags;
  }

  get language() {
    return this.#language;
  }

  get series() {
    return this.#series;
  }

  get collections() {
    return this.#collections;
  }

  get summary() {
    return this.#summary;
  }

  get preNote() {
    return this.#preNote;
  }

  get content() {
    return this.#content;
  }

  get adult() {
    return this.#adult;
  }

  /*
  get ratio() {
    return this.#chapters / this.#timesVisited;
  }*/
}

export class historyFanfiction extends Fanfiction {
  #words;
  #chapters;
  #timesVisited;
  #lastVisit;
  constructor(
    title: string,
    id: number,
    author: Author,
    fandom: Array<Fandom>,
    words: number,
    chapters: ChaptersWritten,
    relationships: Array<Relationship>,
    characters: Array<Character>,
    tags: Array<Tag>,
    language: string,
    series: Series,
    collections: Array<Collection>,
    summary: string,
    preNote: string,
    content: Array<Chapter>,
    adult: boolean,
    lastVisit: string,
    timesVisited: number
  ) {
    super(
      title,
      id,
      author,
      fandom,
      words,
      chapters,
      relationships,
      characters,
      tags,
      language,
      series,
      collections,
      summary,
      preNote,
      content,
      adult
    );
    this.#words = words;
    this.#chapters = chapters;
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
    return this.#timesVisited / this.#chapters.chaptersWritten;
  }

  get wordsRead() {
    return this.#words * (this.#timesVisited / this.#chapters.chaptersWritten);
  }
}

/*const fic1: Fic = new Fanfiction(
  "titel",
  1234,
  "Luca",
  ["Harry Potter", "other Fandom"],
  13000,
  10,
  ["Hermione Ganger/Harry Potter"],
  ["Harry Potter", "Hermione Granger"],
  ["test"],
  "English",
  3,
  "",
  ""
);

*/
let id: string = "19865440";

download(id);

async function download(id: string) {
  let fic1 = await getFic(id);
  console.log(fic1.adult);
}
