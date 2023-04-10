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
exports.getHistory = exports.getEndNote = exports.getPreNote = exports.getSummary = exports.getCollections = exports.getSeries = exports.getLanguage = exports.getTags = exports.getCategories = exports.getWarnings = exports.getRating = exports.getAdult = exports.getCharacters = exports.getRelationships = exports.getStats = exports.getFandom = exports.getAuthor = exports.getTitle = exports.getInfo = exports.getContent = exports.getFic = void 0;
const ao3_toolkit_1 = require("./ao3-toolkit");
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
    let info = await getInfo($, id);
    let chapters = await getContent($);
    return new ao3_toolkit_1.Fanfiction(info, chapters);
}
exports.getFic = getFic;
async function getContent(fic) {
    let $ = await getParsableInfoData(fic);
    let download = "https://archiveofourown.org" +
        $(".download").find("li:contains('HTML')").find("a").attr("href");
    //Check for adult Content
    let adultContent = $("p:contains('This work could have adult content. If you proceed you have agreed that you are willing to see such content.')");
    if (adultContent.length <= 1) {
        let proceedLink = "https://archiveofourown.org" +
            adultContent.next().find("a").first().attr("href");
        let browser = await puppeteer_1.default.launch();
        let page = await browser.newPage();
        await page.goto(proceedLink);
        download = await page.$$eval(".download li a", (elements) => {
            return elements[elements.length - 1].href;
        });
        //Download
        let completeDownload = await (0, axios_1.default)({
            method: "get",
            url: download,
        });
        //Parse Data
        $ = cheerio.load(completeDownload.data);
    }
    return $("#chapters")
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
        adult: await getAdult(fic),
        rating: await getRating(fic),
        archiveWarnings: await getWarnings(fic),
        categories: await getCategories(fic),
        tags: await getTags(fic),
        language: await getLanguage(fic),
        series: await getSeries(fic),
        collections: await getCollections(fic),
        summary: await getSummary(fic),
        preNote: await getPreNote(fic),
        endNote: await getEndNote(fic),
    };
    return info;
}
exports.getInfo = getInfo;
async function getTitle(fic) {
    let $ = await getParsableInfoData(fic);
    return $("#preface").find("b").first().text();
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
    return $(".tags dt:contains('Fandom:')")
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
}
exports.getFandom = getFandom;
async function getStats(fic) {
    let $ = await getParsableInfoData(fic);
    let statsElement = $("dt:contains('Stats:')").next().text();
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
        return parseInt(stats.slice(stats.search("Words:") + 7, stats.length));
    }
    function getChaptersWritten(stats) {
        return parseInt(stats.slice(stats.search("Chapters:") + 10, stats.search("/")));
    }
    function getChaptersMax(stats) {
        return parseInt(stats.slice(stats.search("/") + 1, stats.search("Words:")));
    }
    function getKudos(stats) {
        return parseInt(stats.slice(stats.search("/") + 1, stats.search("Words:")));
    }
    function getHits(stats) {
        return parseInt(stats.slice(stats.search("/") + 1, stats.search("Words:")));
    }
    function getBookmarks(stats) {
        return parseInt(stats.slice(stats.search("/") + 1, stats.search("Words:")));
    }
}
exports.getStats = getStats;
async function getRelationships(fic) {
    let $ = await getParsableInfoData(fic);
    return $(".tags dt:contains('Relationship:')")
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
}
exports.getRelationships = getRelationships;
async function getCharacters(fic) {
    let $ = await getParsableInfoData(fic);
    return $(".tags dt:contains('Character:')")
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
}
exports.getCharacters = getCharacters;
async function getAdult(fic) {
    let $ = await getParsableInfoData(fic);
    let adultContent = $("p:contains('This work could have adult content. If you proceed you have agreed that you are willing to see such content.')");
    let adult = false;
    if (adultContent.length <= 1) {
        adult = true;
    }
    return adult;
}
exports.getAdult = getAdult;
async function getRating(fic) {
    let $ = await getParsableInfoData(fic);
    return {
        ratingName: $(".tags dt:contains('Rating:')").next().text(),
        ratingLink: $(".tags dt:contains('Rating:')").next().find("a").attr("href"),
    };
}
exports.getRating = getRating;
async function getWarnings(fic) {
    let $ = await getParsableInfoData(fic);
    return $(".tags dt:contains('Archive Warning:')")
        .next()
        .filter("dd")
        .find("a")
        .get()
        .map((el) => {
        return {
            warningName: $(el).text(),
            warningLink: $(el).attr("href"),
        };
    });
}
exports.getWarnings = getWarnings;
async function getCategories(fic) {
    let $ = await getParsableInfoData(fic);
    return $(".tags dt:contains('Category:')")
        .next()
        .filter("dd")
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
    return $(".tags dt:contains('Additional Tags:')")
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
}
exports.getTags = getTags;
async function getLanguage(fic) {
    let $ = await getParsableInfoData(fic);
    return $(".tags dt:contains('Language:')").next().text();
}
exports.getLanguage = getLanguage;
async function getSeries(fic) {
    let $ = await getParsableInfoData(fic);
    let seriesName = $(".tags dt:contains('Series:')").next().find("a").text();
    let seriesPart = parseInt($(".tags dt:contains('Series:')")
        .next()
        .text()
        .replace(seriesName, "")
        .replace(/\D/g, ""));
    return {
        seriesName: seriesName,
        seriesLink: $(".tags dt:contains('Series:')").next().find("a").attr("href"),
        seriesPart: seriesPart,
    };
}
exports.getSeries = getSeries;
async function getCollections(fic) {
    let $ = await getParsableInfoData(fic);
    return $(".tags dt:contains('Collections:')")
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
}
exports.getCollections = getCollections;
async function getSummary(fic) {
    let $ = await getParsableInfoData(fic);
    return $("#preface p:contains('Summary')").next().text();
}
exports.getSummary = getSummary;
async function getPreNote(fic) {
    let $ = await getParsableInfoData(fic);
    return $("#preface p:contains('Notes')").next().text();
}
exports.getPreNote = getPreNote;
async function getEndNote(fic) {
    let $ = await getParsableInfoData(fic);
    return $("#endnotes").find("blockquote").text();
}
exports.getEndNote = getEndNote;
async function getParsableInfoData(fic) {
    let inputIsID = getInfoInputTypeID(fic);
    if (inputIsID) {
        //use Axios to get content -> change content of fic
        let url = "https://archiveofourown.org/works/" + fic;
        //Initial Page Load
        let initialLoad = await (0, axios_1.default)({
            method: "get",
            url: url,
        });
        let downloadedFic = cheerio.load(initialLoad.data);
        return downloadedFic;
    }
    else {
        let downloadedFic = fic;
        return downloadedFic;
    }
}
function getInfoInputTypeID(input) {
    return true;
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
