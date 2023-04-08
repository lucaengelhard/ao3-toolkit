import { getFic, getHistory } from "./functions";

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

export interface Chapter {
  chapterTitle: string;
  chapterSummary: string;
  chapterNotes: string;
  chapterContent: string | null;
}

export class Fanfiction {
  #title;
  #id;
  #author;
  #fandom;
  #words;
  #chapters;
  #relationships;
  #characters;
  #rating;
  #archiveWarnings;
  #categories;
  #tags;
  #language;
  #series;
  #collections;
  #summary;
  #preNote;
  #endNote;
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
    rating: Rating,
    archiveWarnings: Array<archiveWarning>,
    categories: Array<Category>,
    tags: Array<Tag>,
    language: string,
    series: Series,
    collections: Array<Collection>,
    summary: string,
    preNote: string,
    endNote: string,
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
    this.#rating = rating;
    this.#archiveWarnings = archiveWarnings;
    this.#categories = categories;
    this.#tags = tags;
    this.#language = language;
    this.#series = series;
    this.#collections = collections;
    this.#summary = summary;
    this.#preNote = preNote;
    this.#endNote = endNote;
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

  get rating() {
    return this.#rating;
  }

  get warnings() {
    return this.#archiveWarnings;
  }

  get categories() {
    return this.#categories;
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

  get endNote() {
    return this.#endNote;
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
    rating: Rating,
    archiveWarnings: Array<archiveWarning>,
    categories: Array<Category>,
    tags: Array<Tag>,
    language: string,
    series: Series,
    collections: Array<Collection>,
    summary: string,
    preNote: string,
    endNote: string,
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
      rating,
      archiveWarnings,
      categories,
      tags,
      language,
      series,
      collections,
      summary,
      preNote,
      endNote,
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

export interface Login {
  username: string;
  password: string;
}

let logindata: Login = {
  username: "",
  password: "",
};

getHistory(logindata);

/*
let id: string = "19865440";

download(id);

async function download(id: string) {
  let fic1 = await getFic(id);
  console.log(fic1.endNote);
}
*/
