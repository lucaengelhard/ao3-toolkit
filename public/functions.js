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
exports.getFic = void 0;
const _1 = require(".");
const axios_1 = __importDefault(require("axios"));
const cheerio = __importStar(require("cheerio"));
const puppeteer_1 = __importDefault(require("puppeteer"));
async function getFic(id) {
    let url = "https://archiveofourown.org/works/" + id;
    //Initial Page Load
    let initialLoad = await (0, axios_1.default)({
        method: "get",
        url: url,
    });
    let $ = cheerio.load(initialLoad.data);
    let download = "https://archiveofourown.org" +
        $(".download").find("li:contains('HTML')").find("a").attr("href");
    //Check for adult Content
    let adultContent = $("p:contains('This work could have adult content. If you proceed you have agreed that you are willing to see such content.')");
    if (adultContent.length <= 1) {
        console.log("adult content");
        let proceedLink = "https://archiveofourown.org" +
            adultContent.next().find("a").first().attr("href");
        let browser = await puppeteer_1.default.launch();
        let page = await browser.newPage();
        await page.goto(proceedLink);
        download = await page.$$eval(".download li a", (elements) => {
            return elements[elements.length - 1].href;
        });
    }
    //Download
    console.log("download Link: " + download);
    let completeDownload = await (0, axios_1.default)({
        method: "get",
        url: download,
    });
    //Parse Data
    $ = cheerio.load(completeDownload.data);
    let title = $("#preface").find("b").first().text();
    let author = {
        authorName: $("[rel=author]").text(),
        authorLink: $("[rel=author]").attr("href"),
    };
    let fandom = $(".tags dt:contains('Fandom:')")
        .next()
        .filter("dd")
        .find("a")
        .get()
        .map((el) => {
        return {
            fandomName: $(el).text(),
            fandomLink: $(el).attr("href"),
        };
    });
    let stats = $("dt:contains('Stats:')").next().text();
    let words = parseInt(stats.slice(stats.search("Words:") + 7, stats.length));
    let chaptersWritten = parseInt(stats.slice(stats.search("Chapters:") + 10, stats.search("/")));
    let chaptersMax = parseInt(stats.slice(stats.search("/") + 1, stats.search("Words:")));
    let chapterNumber = {
        chaptersWritten: chaptersWritten,
        chaptersMax: chaptersMax,
    };
    let relationships = $(".tags dt:contains('Relationship:')")
        .next()
        .filter("dd")
        .find("a")
        .get()
        .map((el) => {
        return {
            relationshipName: $(el).text(),
            relationshipLink: $(el).attr("href"),
        };
    });
    let characters = $(".tags dt:contains('Character:')")
        .next()
        .filter("dd")
        .find("a")
        .get()
        .map((el) => {
        return {
            characterName: $(el).text(),
            characterLink: $(el).attr("href"),
        };
    });
    let tags = $(".tags dt:contains('Additional Tags:')")
        .next()
        .filter("dd")
        .find("a")
        .get()
        .map((el) => {
        return {
            tagName: $(el).text(),
            tagLink: $(el).attr("href"),
        };
    });
    let language = $(".tags dt:contains('Language:')").next().text();
    let seriesName = $(".tags dt:contains('Series:')").next().find("a").text();
    let seriesPart = parseInt($(".tags dt:contains('Series:')")
        .next()
        .text()
        .replace(seriesName, "")
        .replace(/\D/g, ""));
    let series = {
        seriesName: seriesName,
        seriesLink: $(".tags dt:contains('Series:')").next().find("a").attr("href"),
        seriesPart: seriesPart,
    };
    let collections = $(".tags dt:contains('Collections:')")
        .next()
        .filter("dd")
        .find("a")
        .get()
        .map((el) => {
        return {
            collectionName: $(el).text(),
            collectionLink: $(el).attr("href"),
        };
    });
    let summary = $("#preface p:contains('Summary')").next().text();
    let preNote = $("#preface p:contains('Notes')").next().text();
    let chapters = $("#chapters")
        .find(".meta")
        .get()
        .map((chapter) => {
        return {
            chapterTitle: $(chapter).find(".heading").text(),
            chapterSummary: $(chapter)
                .find("p:contains('Chapter Summary')")
                .next()
                .text(),
            chapterNotes: $(chapter)
                .find("p:contains('Chapter Notes')")
                .next()
                .text(),
            chapterContent: $(chapter).next().html(),
        };
    });
    //Create Fic Object
    return new _1.historyFanfiction(title, parseInt(id), author, fandom, words, chapterNumber, relationships, characters, tags, language, series, collections, summary, preNote, chapters, "", 3);
}
exports.getFic = getFic;
