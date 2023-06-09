import * as cheerio from "cheerio";
import { delay, getPageNumber, getSuccess, linkToAbsolute } from "./helper.js";
import { defaults } from "../config/defaults.js";
import { Work, WorkList } from "../classes/works.js";
import { Listtype } from "../enums.js";
/**
 * get a worklist from ao3
 *
 * @param logindata
 * @param instance
 * @param listtype
 * @param span
 * @returns a new  {@link WorkList} Object
 */
export async function getList(logindata, instance, listtype, span) {
    if (typeof instance == "undefined") {
        throw new Error("instance is undefined. wait for the instance to be resolved (execute ao3.login() on this instance) and then execute code");
    }
    //Load the first history page
    //TODO: don't load the first page twice
    let firstUrl = "";
    if (typeof listtype == "undefined") {
        return;
    }
    if (listtype == Listtype.History) {
        firstUrl = `/users/${encodeURIComponent(logindata.username)}/readings`;
    }
    if (listtype == Listtype.Bookmarks) {
        firstUrl = `/users/${encodeURIComponent(logindata.username)}/bookmarks`;
    }
    let firstPage = await instance.get(firstUrl);
    getSuccess(firstPage);
    let firstLoadContent = firstPage.data;
    let $ = cheerio.load(firstLoadContent);
    //Get the number of history pages
    let navLength = getPageNumber($);
    if (typeof span == "number") {
        span = {
            start: 1,
            end: span,
        };
    }
    let resolvedListPages = [];
    let batchlength = defaults.batch;
    let batchbase = 1;
    //Load every list page
    for (let i = 1; i <= navLength; i++) {
        if (typeof span !== "undefined") {
            if (instaceOfPageSpan(span) && span.hasOwnProperty("start")) {
                if (typeof span.start == "undefined") {
                    span.start = 0;
                }
                if (typeof span.end == "undefined") {
                    span.end = navLength;
                }
                if (i < span.start || i > span.end) {
                    continue;
                }
            }
            if (instaceOfPageArray(span) && !span.hasOwnProperty("start")) {
                if (!span.includes(i)) {
                    continue;
                }
            }
        }
        if (batchbase == batchlength) {
            await delay(1500);
            batchbase = 1;
        }
        console.log("getting Page " + i);
        console.log(`${firstUrl}?page=${i}`);
        try {
            let loadedpage = await instance.get(`${firstUrl}?page=${i}`, defaults.axios);
            try {
                getSuccess(loadedpage);
            }
            catch (error) {
                console.error(`Problems while loading page ${i} of ${listtype} of user ${logindata.username}. This could be because there were to many requests.!`);
                continue;
            }
            resolvedListPages.push(loadedpage);
        }
        catch (error) {
            console.error(`Problems while loading page ${i} of ${listtype} of user ${logindata.username}. This could be because there were to many requests.`);
        }
        batchbase++;
    }
    //Parse each loaded Page
    let parsed = [];
    resolvedListPages.forEach((res) => {
        let page = res.data;
        let $ = cheerio.load(page);
        let works = $("li[role='article']").toArray();
        works.forEach((currentWork) => {
            try {
                parsed.push(parseListWork(logindata.username, currentWork, listtype));
            }
            catch (error) {
                throw (defaults.listBuffer = resolvedListPages);
            }
        });
    });
    let list = new WorkList(parsed, listtype);
    return list;
}
function parseListWork(username, currentWork, listtype) {
    let $ = cheerio.load(currentWork);
    let isdeleted = false;
    isdeleted = currentWork.attribs.class.includes("deleted");
    if (isdeleted) {
        return;
    }
    let id = parseInt(currentWork.attribs.id.replace("work_", ""));
    let history = undefined;
    if (listtype == Listtype.History) {
        history = parseHistoryWork($);
    }
    let bookmark = undefined;
    if (listtype == Listtype.Bookmarks) {
        bookmark = parseBookmarkWork($);
    }
    let userdata = {
        user: username,
        history,
        bookmark,
    };
    let info = parseListWorkInfo($);
    return new Work(info, undefined, userdata);
    function parseListWorkInfo($) {
        let info = {
            title: $(".heading a").first().text(),
            id: id,
            author: {
                authorName: $("[rel=author]").text(),
                authorLink: linkToAbsolute($("[rel=author]").attr("href"), false),
            },
            fandom: $(".fandoms a")
                .get()
                .map((el) => {
                return {
                    fandomName: $(el).text(),
                    fandomLink: linkToAbsolute($(el).attr("href"), false),
                };
            }),
            stats: {
                words: parseInt($(".stats dd.words").text().replace(",", "")),
                chapters: {
                    chaptersWritten: parseInt($(".stats dd.chapters").text().split("/")[0]),
                    chaptersMax: parseInt($(".stats dd.chapters").text().split("/")[1]),
                },
                kudos: parseInt($(".stats dd.kudos").text()),
                hits: parseInt($(".stats dd.hits").text()),
                bookmarks: parseInt($(".stats dd.bookmarks").text()),
            },
            relationships: $("li.relationships a")
                .get()
                .map((el) => {
                return {
                    relationshipName: $(el).text(),
                    relationshipLink: linkToAbsolute($(el).attr("href"), false),
                };
            }),
            characters: $("li.characters a")
                .get()
                .map((el) => {
                return {
                    characterName: $(el).text(),
                    characterLink: linkToAbsolute($(el).attr("href"), false),
                };
            }),
            rating: {
                ratingName: $("ul.required-tags rating").text().trim(),
                ratingLink: linkToAbsolute(`https://archiveofourown.org/tags/${$("ul.required-tags rating")
                    .text()
                    .trim()}/works`, false),
            },
            archiveWarnings: {
                warningName: $(".warnings a").text().trim(),
                warningLink: linkToAbsolute($(".warnings a").attr("href"), false),
            },
            categories: $(".category")
                .text()
                .split(",")
                .map((el) => {
                return {
                    categoryName: el.trim(),
                    categoryLink: linkToAbsolute(`https://archiveofourown.org/tags/${el
                        .trim()
                        .replace("/", "*s*")}/works`, false),
                };
            }),
            tags: $(".freeforms a")
                .get()
                .map((el) => {
                return {
                    tagName: $(el).text(),
                    tagLink: linkToAbsolute($(el).attr("href"), false),
                };
            }),
            language: $("dd.language").text().replace("\n", "").trim(),
            series: $("dd.series")
                .find(".series")
                .get()
                .map((el) => {
                return {
                    seriesName: $(el).find("a").text(),
                    seriesLink: linkToAbsolute($(el).find("a").attr("href"), false),
                    seriesPart: parseInt($(el).find("strong").text()),
                };
            }),
            collections: parseInt($("dd.collections").text()),
            summary: $(".summary p")
                .get()
                .map((el) => {
                return $(el).text();
            })
                .join("\n"),
        };
        return info;
    }
    function parseHistoryWork($) {
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
        let historyStats = {
            lastVisit: lastVisit,
            timesVisited: timesVisited,
            ratio: 0,
            wordsRead: 0,
        };
        return historyStats;
    }
}
function instaceOfPageSpan(span) {
    return span;
}
function instaceOfPageArray(span) {
    return span;
}
export function parseBookmarkWork($) {
    let bookmark = {
        dateBookmarked: new Date($(".own.user .datetime").text()),
        bookmarker: {
            authorName: $(".own.user a").first().text(),
            authorLink: linkToAbsolute($(".own.user a").first().attr("href"), false),
        },
        bookmarkerTags: $(".own.user tags li")
            .get()
            .map((tag) => {
            return {
                tagName: $(tag).find("a").text(),
                tagLink: linkToAbsolute($(tag).find("a").attr("href")),
            };
        }),
        bookmarkNotes: $(".own.user blockquote").first().text(),
    };
    return bookmark;
}
