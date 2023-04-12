"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.historyFanfiction = exports.Fanfiction = exports.ao3 = void 0;
const axios_1 = __importDefault(require("axios"));
const axios_cookiejar_support_1 = require("axios-cookiejar-support");
const tough_cookie_1 = require("tough-cookie");
const functions_1 = require("./functions");
const login_1 = require("./login");
const cheerio = __importStar(require("cheerio"));
class ao3 {
    #logindata;
    constructor(logindata) {
        this.#logindata = logindata;
    }
    async login() {
        let loginurl = "/users/login";
        let jar = new tough_cookie_1.CookieJar();
        let instance = (0, axios_cookiejar_support_1.wrapper)(axios_1.default.create({
            withCredentials: true,
            baseURL: "https://archiveofourown.org",
            jar,
        }));
        let initialload = await instance.get(loginurl);
        let $ = cheerio.load(initialload.data);
        let token = $("#new_user input[name='authenticity_token']")[0].attribs
            .value;
        console.log(token);
        let payload = `authenticity_token=${encodeURIComponent(token)}&user%5Blogin%5D=${this.#logindata.username}&user%5Bpassword%5D=${this.#logindata.password}&user%5Bremember_me%5D=1&commit=Log+in`;
        let session = await instance.post(loginurl, payload);
        let history = await instance.get(`/users/${this.#logindata.username}/readings`);
        console.log(history.data);
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
test(19865440);
async function test(id) {
    console.time("test");
    let session = new ao3(login_1.logindata).login();
    console.timeEnd("test");
}
/*

history(logindata);

async function history(logindata: Login) {
  let userhistory = await getHistory(logindata);
  console.log(userhistory);
}
*/
