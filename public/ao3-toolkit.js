"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.historyFanfiction = exports.Fanfiction = exports.ao3 = void 0;
const functions_1 = require("./functions");
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
    async getHistory() {
        return await (0, functions_1.getHistory)(this.#logindata);
    }
    async getHistoryFic(id) {
        let userHistory = await (0, functions_1.getHistory)(this.#logindata);
        let fanFiction = await (0, functions_1.getFic)(id);
        let matchingElement = userHistory.find((element) => {
            return element.id == fanFiction.id;
        });
        if (matchingElement == undefined) {
            return;
        }
        else {
            return new historyFanfiction(fanFiction.info, fanFiction.content, matchingElement.lastVisit, matchingElement.timesVisited);
        }
    }
    //getBookmarks() {}
    //getHistory + andere user-based functions
    static async getFic(id) {
        return await (0, functions_1.getFic)(id);
    }
    static async getContent(fic) {
        return await (0, functions_1.getContent)(fic);
    }
    static async getInfo(fic, id) {
        return await (0, functions_1.getInfo)(fic, id);
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
test(19865440);
async function test(id) {
    console.time("test");
    let fic = await (0, functions_1.getInfo)(id);
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
