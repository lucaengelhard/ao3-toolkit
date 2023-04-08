"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.historyFanfiction = exports.Fanfiction = void 0;
const functions_1 = require("./functions");
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
class Fanfiction {
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
    constructor(title, id, author, fandom, words, chapters, relationships, characters, tags, language, series, collections, summary, preNote, content) {
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
}
exports.Fanfiction = Fanfiction;
class historyFanfiction extends Fanfiction {
    #chapters;
    #timesVisited;
    #lastVisit;
    constructor(title, id, author, fandom, words, chapters, relationships, characters, tags, language, series, collections, summary, preNote, content, lastVisit, timesVisited) {
        super(title, id, author, fandom, words, chapters, relationships, characters, tags, language, series, collections, summary, preNote, content);
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
        console.log(this.#timesVisited / this.#chapters.chaptersWritten);
        return;
    }
}
exports.historyFanfiction = historyFanfiction;
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
let id = "19865440";
download(id);
async function download(id) {
    let fic1 = await (0, functions_1.getFic)(id);
    console.log(fic1.ratio);
}
