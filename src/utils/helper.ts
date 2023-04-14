import axios from "axios";
import * as cheerio from "cheerio";

/**
 * This helper function takes a link and checks if it is a relative or absolute ao3 link. If the link is relative link, it returns an absolute version of the link.
 *
 * @param link an ao3 link string
 * @returns the link as an absolute link
 */
export function linkToAbsolute(link: string | undefined) {
  if (typeof link == "undefined") {
    return link;
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
export async function getParsableInfoData(fic: number | cheerio.CheerioAPI) {
  if (typeof fic == "number") {

    let url: string = "https://archiveofourown.org/works/" + fic;
    let initialLoad = await axios({
      method: "get",
      url: url,
      headers: {
        cookie: "view_adult=true;",
      },
    });

    let downloadedFic = cheerio.load(initialLoad.data);
    return downloadedFic;
  } else {
    let downloadedFic: any = fic;
    return downloadedFic;
  }
}
