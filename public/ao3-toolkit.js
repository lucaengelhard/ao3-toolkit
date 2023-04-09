"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.historyFanfiction = exports.Fanfiction = void 0;
const functions_1 = require("./functions");
const login_1 = require("./login");
class Fanfiction {
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
    constructor(title, id, author, fandom, words, chapters, relationships, characters, rating, archiveWarnings, categories, tags, language, series, collections, summary, preNote, endNote, content, adult) {
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
}
exports.Fanfiction = Fanfiction;
class historyFanfiction extends Fanfiction {
    #words;
    #chapters;
    #timesVisited;
    #lastVisit;
    constructor(title, id, author, fandom, words, chapters, relationships, characters, rating, archiveWarnings, categories, tags, language, series, collections, summary, preNote, endNote, content, adult, lastVisit, timesVisited) {
        super(title, id, author, fandom, words, chapters, relationships, characters, rating, archiveWarnings, categories, tags, language, series, collections, summary, preNote, endNote, content, adult);
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
exports.historyFanfiction = historyFanfiction;
history(login_1.logindata);
async function history(logindata) {
    let userhistory = await (0, functions_1.getHistory)(logindata);
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
