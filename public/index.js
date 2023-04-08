"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Fanfiction = void 0;
const functions_1 = require("./functions");
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
    #content;
    #timesVisited;
    #lastVisit;
    constructor(title, id, author, fandom, words, chapters, relationships, characters, tags, language, content, timesVisited, lastVisit) {
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
        this.#content = content;
        this.#timesVisited = timesVisited;
        this.#lastVisit = lastVisit;
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
    get timesVisited() {
        return this.#timesVisited;
    }
    get lastVisit() {
        return this.#lastVisit;
    }
    get content() {
        return this.#content;
    }
}
exports.Fanfiction = Fanfiction;
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
);*/
let id = "19865440";
download(id);
async function download(id) {
    let fic1 = await (0, functions_1.getFic)(id);
    console.log(fic1.title);
}
//console.log(fic1.ratio);
