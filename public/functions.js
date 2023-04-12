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
exports.getHistory = exports.getSummary = exports.getCollections = exports.getSeries = exports.getLanguage = exports.getTags = exports.getCategories = exports.getWarnings = exports.getRating = exports.getCharacters = exports.getRelationships = exports.getStats = exports.getFandom = exports.getAuthor = exports.getTitle = exports.getInfo = exports.getContent = exports.getFic = void 0;
const ao3_toolkit_1 = require("./ao3-toolkit");
const axios_1 = __importDefault(require("axios"));
const cheerio = __importStar(require("cheerio"));
const puppeteer_1 = __importDefault(require("puppeteer"));
async function getFic(id) {
    let url = "https://archiveofourown.org/works/" + id;
    let initialLoad = await axios_1.default.get(encodeURI(url));
    let $ = cheerio.load(initialLoad.data);
    let info = await getInfo($, id);
    let content = await getContent($);
    return new ao3_toolkit_1.Fanfiction(info, content);
}
exports.getFic = getFic;
async function getContent(fic) {
    let $ = await getParsableInfoData(fic);
    let downloadURL = "https://archiveofourown.org" +
        $(".download").find("li:contains('HTML')").find("a").attr("href");
    let download = (await axios_1.default.get(downloadURL)).data;
    let $content = cheerio.load(download);
    let content = {
        notes: {
            preNote: await getPreNote($content),
            endNote: await getEndNote($content),
        },
        chapters: $content("#chapters")
            .find(".meta")
            .get()
            .map((chapter) => {
            return {
                chapterTitle: $content(chapter).find(".heading").text(),
                chapterSummary: $content(chapter)
                    .find("p:contains('Chapter Summary')")
                    .next()
                    .text(),
                chapterNotes: $content(chapter)
                    .find("p:contains('Chapter Notes')")
                    .next()
                    .text(),
                chapterContent: $content(chapter).next().html(),
            };
        }),
    };
    return content;
    async function getPreNote(fic) {
        return fic("#preface p:contains('Notes')").next().text();
    }
    async function getEndNote(fic) {
        return fic("#endnotes").find("blockquote").text();
    }
}
exports.getContent = getContent;
async function getInfo(fic, id) {
    if (typeof fic == "number") {
        id = fic;
    }
    if (typeof id == "undefined") {
        throw new Error("If the first argument is a Cheerio Object and not an ID, input an ID with the type number as the second argument");
    }
    fic = await getParsableInfoData(fic);
    let info = {
        title: await getTitle(fic),
        id: id,
        author: await getAuthor(fic),
        fandom: await getFandom(fic),
        stats: await getStats(fic),
        relationships: await getRelationships(fic),
        characters: await getCharacters(fic),
        rating: await getRating(fic),
        archiveWarnings: await getWarnings(fic),
        categories: await getCategories(fic),
        tags: await getTags(fic),
        language: await getLanguage(fic),
        series: await getSeries(fic),
        collections: await getCollections(fic),
        summary: await getSummary(fic),
    };
    return info;
}
exports.getInfo = getInfo;
async function getTitle(fic) {
    let $ = await getParsableInfoData(fic);
    return $(".preface").find(".title").first().text().trim();
}
exports.getTitle = getTitle;
async function getAuthor(fic) {
    let $ = await getParsableInfoData(fic);
    return {
        authorName: $("[rel=author]").text(),
        authorLink: $("[rel=author]").attr("href"),
    };
}
exports.getAuthor = getAuthor;
async function getFandom(fic) {
    let $ = await getParsableInfoData(fic);
    return $(".fandom a")
        .get()
        .map((el) => {
        return {
            fandomName: $(el).text(),
            fandomLink: $(el).attr("href"),
        };
    });
}
exports.getFandom = getFandom;
async function getStats(fic) {
    let $ = await getParsableInfoData(fic);
    let statsElement = $("dl.stats");
    return {
        words: getWords(statsElement),
        chapters: {
            chaptersWritten: getChaptersWritten(statsElement),
            chaptersMax: getChaptersMax(statsElement),
        },
        kudos: getKudos(statsElement),
        hits: getHits(statsElement),
        bookmarks: getBookmarks(statsElement),
    };
    function getWords(stats) {
        return parseInt(stats.find(".words").next().text().replace(",", ""));
    }
    function getChaptersWritten(stats) {
        return parseInt(stats.find(".chapters").next().text().split("/")[0]);
    }
    function getChaptersMax(stats) {
        return parseInt(stats.find(".chapters").next().text().split("/")[1]);
    }
    function getKudos(stats) {
        return parseInt(stats.find(".kudos").next().text());
    }
    function getHits(stats) {
        return parseInt(stats.find(".hits").next().text());
    }
    function getBookmarks(stats) {
        return parseInt(stats.find(".bookmarks").next().text());
    }
}
exports.getStats = getStats;
async function getRelationships(fic) {
    let $ = await getParsableInfoData(fic);
    return $(".relationship")
        .next()
        .find("a")
        .get()
        .map((el) => {
        return {
            relationshipName: $(el).text(),
            relationshipLink: $(el).attr("href"),
        };
    });
}
exports.getRelationships = getRelationships;
async function getCharacters(fic) {
    let $ = await getParsableInfoData(fic);
    return $(".character")
        .next()
        .find("a")
        .get()
        .map((el) => {
        return {
            characterName: $(el).text(),
            characterLink: $(el).attr("href"),
        };
    });
}
exports.getCharacters = getCharacters;
async function getRating(fic) {
    let $ = await getParsableInfoData(fic);
    return {
        ratingName: $("dd.rating").text().trim(),
        ratingLink: $("dd.rating").find("a").attr("href"),
    };
}
exports.getRating = getRating;
async function getWarnings(fic) {
    let $ = await getParsableInfoData(fic);
    return {
        warningName: $("dd.warning").text().trim(),
        warningLink: $("dd.warning").find("a").attr("href"),
    };
}
exports.getWarnings = getWarnings;
async function getCategories(fic) {
    let $ = await getParsableInfoData(fic);
    return $(".category")
        .next()
        .find("a")
        .get()
        .map((el) => {
        return {
            categoryName: $(el).text(),
            categoryLink: $(el).attr("href"),
        };
    });
}
exports.getCategories = getCategories;
async function getTags(fic) {
    let $ = await getParsableInfoData(fic);
    return $(".freeform")
        .next()
        .find("a")
        .get()
        .map((el) => {
        return {
            tagName: $(el).text(),
            tagLink: $(el).attr("href"),
        };
    });
}
exports.getTags = getTags;
async function getLanguage(fic) {
    let $ = await getParsableInfoData(fic);
    return $(".language").first().next().text().replace("\n", "").trim();
}
exports.getLanguage = getLanguage;
async function getSeries(fic) {
    let $ = await getParsableInfoData(fic);
    return $("dd.series")
        .find("span.position")
        .get()
        .map((el) => {
        return {
            seriesName: $(el).find("a").text(),
            seriesLink: $(el).find("a").attr("href"),
            seriesPart: parseInt($(el).text().replace($(el).find("a").text(), "").replace(/\D/g, "")),
        };
    });
}
exports.getSeries = getSeries;
async function getCollections(fic) {
    let $ = await getParsableInfoData(fic);
    return $("dd.collections")
        .first()
        .find("a")
        .get()
        .map((el) => {
        return {
            collectionName: $(el).text(),
            collectionLink: $(el).attr("href"),
        };
    });
}
exports.getCollections = getCollections;
async function getSummary(fic) {
    let $ = await getParsableInfoData(fic);
    let summaryArray = $(".summary blockquote")
        .find("p")
        .get()
        .map((el) => {
        return $(el).text();
    });
    return summaryArray.join("\n");
}
exports.getSummary = getSummary;
async function getParsableInfoData(fic) {
    if (typeof fic == "number") {
        //use Axios to get content -> change content of fic
        let url = "https://archiveofourown.org/works/" + fic;
        //Initial Page Load
        let initialLoad = await (0, axios_1.default)({
            method: "get",
            url: url,
            headers: {
                cookie: "view_adult=true;",
            },
        });
        let downloadedFic = cheerio.load(initialLoad.data);
        return downloadedFic;
    }
    else {
        let downloadedFic = fic;
        return downloadedFic;
    }
}
async function getHistory(logindata) {
    let historyURLinit = "https://archiveofourown.org/users/" +
        logindata.username +
        "/readings?page=1";
    let browser = await puppeteer_1.default.launch({ headless: true });
    let page = await browser.newPage();
    await page.goto(historyURLinit);
    //get number of pages
    //open new page for each number
    //download ids + visited data
    await page.click("#login-dropdown");
    await page.click("#user_remember_me_small");
    await page.waitForSelector("#user_session_login_small");
    await page.type("#user_session_login_small", logindata.username);
    await page.waitForSelector("#user_session_password_small");
    await page.type("#user_session_password_small", logindata.password);
    await page.keyboard.press("Enter");
    await page.waitForSelector("#footer");
    let navLength = await page.$$eval(".pagination li", (elements) => {
        let lastNumber;
        if (elements[elements.length - 1].classList.contains("next")) {
            lastNumber = parseInt(elements[elements.length - 2].innerText);
            return lastNumber;
        }
        else {
            lastNumber = parseInt(elements[elements.length - 1].innerText);
            return lastNumber;
        }
    });
    let userHistory = [];
    for (let i = 2; i < navLength; i++) {
        console.log("Scanning Page " + i);
        let newPage = await browser.newPage();
        await newPage.goto("https://archiveofourown.org/users/capmaennle/readings?page=" + i);
        await newPage.waitForSelector("#footer");
        let content = await newPage.content();
        await newPage.close();
        let $ = cheerio.load(content);
        let works = $("li[role='article']").toArray();
        works.forEach((currentWork) => {
            let $ = cheerio.load(currentWork);
            let isdeleted = false;
            isdeleted = currentWork.attribs.class.includes("deleted");
            if (isdeleted) {
                return;
            }
            let id = parseInt(currentWork.attribs.id.replace("work_", ""));
            let viewedText = $("h4.viewed.heading")
                .text()
                .replace("Last visited: ", "")
                .trim();
            let lastindex = viewedText.indexOf("(");
            let lastsub = viewedText.substring(0, lastindex).trim();
            let lastVisit = new Date(lastsub);
            let visitedindex = viewedText.indexOf("Visited");
            let visitedsub = viewedText.substring(visitedindex);
            let timesVisited;
            if (visitedsub.includes("once")) {
                timesVisited = 1;
            }
            else {
                timesVisited = parseInt(visitedsub.match(/(\d+)/)[0]);
            }
            let historyElement = {
                id: id,
                lastVisit: lastVisit,
                timesVisited: timesVisited,
            };
            userHistory.push(historyElement);
        });
    }
    return userHistory;
}
exports.getHistory = getHistory;
