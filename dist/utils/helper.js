import axios from "axios";
import * as cheerio from "cheerio";
/**
 * This helper function takes a link and checks if it is a relative or absolute ao3 link. If the link is relative link, it returns an absolute version of the link.
 *
 * @param link an ao3 link string
 * @returns the link as an absolute link
 */
export function linkToAbsolute(link, strict) {
    if (typeof strict == "undefined") {
        strict = true;
    }
    if (typeof link == "undefined") {
        if (strict) {
            throw new Error(`link ${link} is undefined`);
        }
        else {
            link = "";
        }
    }
    var regex = new RegExp("^(?:[a-z+]+:)?//", "i");
    if (!regex.test(link)) {
        return `https://archiveofourown.org${link}`;
    }
    return link;
}
/**
 * This helper function takes either an ao3 work id or a cheerio object. If the input is an id, it makes a get request and creates a cheerio object.
 *
 * @param fic a work id or a cheerio object of the first chapter
 * @returns a parssable cheerio Object for the other functions to use
 */
export async function getParsableInfoData(fic) {
    if (typeof fic == "number") {
        let url = "https://archiveofourown.org/works/" + fic;
        let initialLoad = await axios({
            method: "get",
            url: url,
            headers: {
                cookie: "view_adult=true;",
                "User-Agent": "Axios/1.3.5 ao3-toolkit bot",
            },
        });
        getSuccess(initialLoad);
        let downloadedFic = cheerio.load(initialLoad.data);
        return downloadedFic;
    }
    else {
        let downloadedFic = fic;
        return downloadedFic;
    }
}
/**
 * Takes a Axios response and throws an error if the request was unsuccessful
 *
 * @param res an Axios response
 */
export function getSuccess(res) {
    if (res.status !== 200) {
        throw new Error("error while fetching work");
    }
}
/**
 * insert to add a delay in a function
 *
 * @param ms number of milliseconds the delay should last
 * @returns
 */
export function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
/**
 *
 * @param $ cheerio object of a list of works
 * @returns the number of pages from the bottom navigation
 */
export function getPageNumber($) {
    return parseInt($(".pagination li").not(".next").last().text());
}
