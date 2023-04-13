import axios from "axios";
import * as cheerio from "cheerio";

/**
 *
 * @param link an ao3 link string
 * @returns the link as an absolute link
 */
export function linkToAbsolute(link: string | undefined) {
  //Checks if Link is absolute, if not returns absolute link

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
 *
 * @param fic a work id or a cheerio object of the first chapter
 * @returns a parssable cheerio Object for the other functions to use
 */
export async function getParsableInfoData(fic: number | cheerio.CheerioAPI) {
  if (typeof fic == "number") {
    //use Axios to get content -> change content of fic
    let url: string = "https://archiveofourown.org/works/" + fic;

    //Initial Page Load
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
