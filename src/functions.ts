import {
  ao3,
  Fanfiction,
  historyFanfiction,
  Info,
  Chapter,
} from "./ao3-toolkit";
import { Login } from "./login";

import axios from "axios";
import * as cheerio from "cheerio";
import puppeteer from "puppeteer";

export async function getFic(id: number) {
  let url: string = "https://archiveofourown.org/works/" + id;

  //Initial Page Load
  let initialLoad = await axios({
    method: "get",
    url: url,
  });

  let $ = cheerio.load(initialLoad.data);

  let info: Info = await getInfo($, id);
  let chapters: Array<Chapter> = await getContent($);

  return new Fanfiction(info, chapters);
}

export async function getContent(fic: number | cheerio.CheerioAPI) {
  let $: cheerio.CheerioAPI = await getParsableInfoData(fic);

  let download =
    "https://archiveofourown.org" +
    $(".download").find("li:contains('HTML')").find("a").attr("href");

  //Check for adult Content
  let adultContent = $(
    "p:contains('This work could have adult content. If you proceed you have agreed that you are willing to see such content.')"
  );

  if (adultContent.length <= 1) {
    let proceedLink =
      "https://archiveofourown.org" +
      adultContent.next().find("a").first().attr("href");

    let browser = await puppeteer.launch();
    let page = await browser.newPage();
    await page.goto(proceedLink);

    download = await page.$$eval(".download li a", (elements) => {
      return elements[elements.length - 1].href;
    });

    //Download
    let completeDownload = await axios({
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

export async function getInfo(fic: number | cheerio.CheerioAPI, id?: number) {
  if (typeof fic == "number") {
    id = fic;
  }

  if (typeof id == "undefined") {
    throw new Error(
      "If the first argument is a Cheerio Object and not an ID, input an ID with the type number as the second argument"
    );
  }

  fic = await getParsableInfoData(fic);
  
  let functions = [getTitle(fic), getAuthor(fic), getFandom(fic), getStats(fic), getRelationships(fic), getCharacters(fic), getAdult(fic), getRating(fic), getWarnings(fic),getCategories(fic), getTags(fic), getLanguage(fic), getSeries(fic), getCollections(fic), getSummary(fic)];

  let resolved = await Promise.allSettled(functions);
  
  let info: Info = {
    title: resolved[0] ,
    id: id,
    author: resolved[1] ,
    fandom: resolved[2] ,
    stats: resolved[3] ,
    relationships: resolved[4] ,
    characters: resolved[5] ,
    adult: resolved[6] ,
    rating: resolved[7] ,
    archiveWarnings: resolved[7] ,
    categories: resolved[8] ,
    tags: resolved[9] ,
    language: resolved[10] ,
    series: resolved[11] ,
    collections: resolved[12] ,
    summary: resolved[13] ,
  };

  return info;
}

export async function getTitle(fic: number | cheerio.CheerioAPI) {
  let $: cheerio.CheerioAPI = await getParsableInfoData(fic);

  return $("#preface").find("b").first().text();
}

export async function getAuthor(fic: number | cheerio.CheerioAPI) {
  let $: cheerio.CheerioAPI = await getParsableInfoData(fic);

  return {
    authorName: $("[rel=author]").text(),
    authorLink: $("[rel=author]").attr("href"),
  };
}

export async function getFandom(fic: number | cheerio.CheerioAPI) {
  let $: cheerio.CheerioAPI = await getParsableInfoData(fic);

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

export async function getStats(fic: number | cheerio.CheerioAPI) {
  let $: cheerio.CheerioAPI = await getParsableInfoData(fic);

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

  function getWords(stats: string) {
    return parseInt(stats.slice(stats.search("Words:") + 7, stats.length));
  }

  function getChaptersWritten(stats: string) {
    return parseInt(
      stats.slice(stats.search("Chapters:") + 10, stats.search("/"))
    );
  }

  function getChaptersMax(stats: string) {
    return parseInt(stats.slice(stats.search("/") + 1, stats.search("Words:")));
  }

  function getKudos(stats: string) {
    return parseInt(stats.slice(stats.search("/") + 1, stats.search("Words:")));
  }

  function getHits(stats: string) {
    return parseInt(stats.slice(stats.search("/") + 1, stats.search("Words:")));
  }

  function getBookmarks(stats: string) {
    return parseInt(stats.slice(stats.search("/") + 1, stats.search("Words:")));
  }
}

export async function getRelationships(fic: number | cheerio.CheerioAPI) {
  let $: cheerio.CheerioAPI = await getParsableInfoData(fic);

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

export async function getCharacters(fic: number | cheerio.CheerioAPI) {
  let $: cheerio.CheerioAPI = await getParsableInfoData(fic);

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

export async function getAdult(fic: number | cheerio.CheerioAPI) {
  let $: cheerio.CheerioAPI = await getParsableInfoData(fic);

  let adultContent = $(
    "p:contains('This work could have adult content. If you proceed you have agreed that you are willing to see such content.')"
  );

  let adult = false;
  if (adultContent.length <= 1) {
    adult = true;
  }

  return adult;
}

export async function getRating(fic: number | cheerio.CheerioAPI) {
  let $: cheerio.CheerioAPI = await getParsableInfoData(fic);

  return {
    ratingName: $(".tags dt:contains('Rating:')").next().text(),
    ratingLink: $(".tags dt:contains('Rating:')").next().find("a").attr("href"),
  };
}

export async function getWarnings(fic: number | cheerio.CheerioAPI) {
  let $: cheerio.CheerioAPI = await getParsableInfoData(fic);

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

export async function getCategories(fic: number | cheerio.CheerioAPI) {
  let $: cheerio.CheerioAPI = await getParsableInfoData(fic);

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

export async function getTags(fic: number | cheerio.CheerioAPI) {
  let $: cheerio.CheerioAPI = await getParsableInfoData(fic);

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

export async function getLanguage(fic: number | cheerio.CheerioAPI) {
  let $: cheerio.CheerioAPI = await getParsableInfoData(fic);

  return $(".tags dt:contains('Language:')").next().text();
}

export async function getSeries(fic: number | cheerio.CheerioAPI) {
  let $: cheerio.CheerioAPI = await getParsableInfoData(fic);

  let seriesName = $(".tags dt:contains('Series:')").next().find("a").text();

  let seriesPart = parseInt(
    $(".tags dt:contains('Series:')")
      .next()
      .text()
      .replace(seriesName, "")
      .replace(/\D/g, "")
  );

  return {
    seriesName: seriesName,
    seriesLink: $(".tags dt:contains('Series:')").next().find("a").attr("href"),
    seriesPart: seriesPart,
  };
}

export async function getCollections(fic: number | cheerio.CheerioAPI) {
  let $: cheerio.CheerioAPI = await getParsableInfoData(fic);

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

export async function getSummary(fic: number | cheerio.CheerioAPI) {
  let $: cheerio.CheerioAPI = await getParsableInfoData(fic);

  return $("#preface p:contains('Summary')").next().text();
}

export async function getPreNote(fic: number | cheerio.CheerioAPI) {
  let $: cheerio.CheerioAPI = await getParsableInfoData(fic);

  return $("#preface p:contains('Notes')").next().text();
}

export async function getEndNote(fic: number | cheerio.CheerioAPI) {
  let $: cheerio.CheerioAPI = await getParsableInfoData(fic);

  return $("#endnotes").find("blockquote").text();
}

async function getParsableInfoData(fic: number | cheerio.CheerioAPI) {
  let inputIsID = getInfoInputTypeID(fic);

  if (inputIsID) {
    //use Axios to get content -> change content of fic
    let url: string = "https://archiveofourown.org/works/" + fic;

    //Initial Page Load
    let initialLoad = await axios({
      method: "get",
      url: url,
    });

    let downloadedFic = cheerio.load(initialLoad.data);
    return downloadedFic;
  } else {
    let downloadedFic: any = fic;
    return downloadedFic;
  }
}

function getInfoInputTypeID(
  input: number | cheerio.CheerioAPI
): input is number {
  return true;
}

export interface historyFic {
  id: number;
  lastVisit: Date;
  timesVisited: number;
}

export async function getHistory(logindata: Login) {
  let historyURLinit: string =
    "https://archiveofourown.org/users/" +
    logindata.username +
    "/readings?page=1";

  let browser = await puppeteer.launch({ headless: true });
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
    let lastNumber: number;
    if (elements[elements.length - 1].classList.contains("next")) {
      lastNumber = parseInt(elements[elements.length - 2].innerText);
      return lastNumber;
    } else {
      lastNumber = parseInt(elements[elements.length - 1].innerText);
      return lastNumber;
    }
  });

  let userHistory: Array<historyFic> = [];

  for (let i = 2; i < navLength; i++) {
    console.log("Scanning Page " + i);

    let newPage = await browser.newPage();

    await newPage.goto(
      "https://archiveofourown.org/users/capmaennle/readings?page=" + i
    );

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

      let id: number = parseInt(currentWork.attribs.id.replace("work_", ""));

      let viewedText: string = $("h4.viewed.heading")
        .text()
        .replace("Last visited: ", "")
        .trim();

      let lastindex: number = viewedText.indexOf("(");

      let lastsub: string = viewedText.substring(0, lastindex).trim();

      let lastVisit: Date = new Date(lastsub);

      let visitedindex = viewedText.indexOf("Visited");

      let visitedsub: any = viewedText.substring(visitedindex);

      let timesVisited: number;

      if (visitedsub.includes("once")) {
        timesVisited = 1;
      } else {
        timesVisited = parseInt(visitedsub.match(/(\d+)/)[0]);
      }

      let historyElement: historyFic = {
        id: id,
        lastVisit: lastVisit,
        timesVisited: timesVisited,
      };

      userHistory.push(historyElement);
    });
  }
  return userHistory;
}
