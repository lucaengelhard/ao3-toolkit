"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.historyFanfiction = exports.Fanfiction = exports.ao3 = void 0;
const functions_1 = require("./functions");
const login_1 = require("./login");
class ao3 {
    #logindata;
    constructor(logindata) {
        this.#logindata = logindata;
    }
    get logindata() {
        return this.#logindata;
    }
    set username(username) {
        this.#logindata.username = username;
    }
    set password(password) {
        this.#logindata.password = password;
    }
}
exports.ao3 = ao3;
class Fanfiction {
    #content;
    #info;
    constructor(info, content) {
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
exports.Fanfiction = Fanfiction;
class historyFanfiction extends Fanfiction {
    #info;
    #timesVisited;
    #lastVisit;
    constructor(info, content, lastVisit, timesVisited) {
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
        return (this.#info.stats.words *
            (this.#timesVisited / this.#info.stats.chapters.chaptersWritten));
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
