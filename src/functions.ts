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

  let initialLoad = await axios.get(encodeURI(url));

  let $ = cheerio.load(initialLoad.data);

  let info: Info = await getInfo($, id);

  let content = await getContent($);

  return new Fanfiction(info, content);
}

export async function getContent(fic: number | cheerio.CheerioAPI) {
  let $: cheerio.CheerioAPI = await getParsableInfoData(fic);

  let downloadURL =
    "https://archiveofourown.org" +
    $(".download").find("li:contains('HTML')").find("a").attr("href");

  let download = (await axios.get(downloadURL)).data;

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

  async function getPreNote(fic: cheerio.CheerioAPI) {
    return fic("#preface p:contains('Notes')").next().text();
  }

  async function getEndNote(fic: cheerio.CheerioAPI) {
    return fic("#endnotes").find("blockquote").text();
  }
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

  let info: Info = {
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

export async function getTitle(fic: number | cheerio.CheerioAPI) {
  let $: cheerio.CheerioAPI = await getParsableInfoData(fic);

  return $(".preface").find(".title").first().text().trim();
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

  return $(".fandom a")
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

  function getWords(stats: cheerio.Cheerio<cheerio.Element>) {
    return parseInt(stats.find(".words").next().text().replace(",", ""));
  }

  function getChaptersWritten(stats: cheerio.Cheerio<cheerio.Element>) {
    return parseInt(stats.find(".chapters").next().text().split("/")[0]);
  }

  function getChaptersMax(stats: cheerio.Cheerio<cheerio.Element>) {
    return parseInt(stats.find(".chapters").next().text().split("/")[1]);
  }

  function getKudos(stats: cheerio.Cheerio<cheerio.Element>) {
    return parseInt(stats.find(".kudos").next().text());
  }

  function getHits(stats: cheerio.Cheerio<cheerio.Element>) {
    return parseInt(stats.find(".hits").next().text());
  }

  function getBookmarks(stats: cheerio.Cheerio<cheerio.Element>) {
    return parseInt(stats.find(".bookmarks").next().text());
  }
}

export async function getRelationships(fic: number | cheerio.CheerioAPI) {
  let $: cheerio.CheerioAPI = await getParsableInfoData(fic);

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

export async function getCharacters(fic: number | cheerio.CheerioAPI) {
  let $: cheerio.CheerioAPI = await getParsableInfoData(fic);

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

export async function getRating(fic: number | cheerio.CheerioAPI) {
  let $: cheerio.CheerioAPI = await getParsableInfoData(fic);

  return {
    ratingName: $("dd.rating").text().trim(),
    ratingLink: $("dd.rating").find("a").attr("href"),
  };
}

export async function getWarnings(fic: number | cheerio.CheerioAPI) {
  let $: cheerio.CheerioAPI = await getParsableInfoData(fic);

  return {
    warningName: $("dd.warning").text().trim(),
    warningLink: $("dd.warning").find("a").attr("href"),
  };
}

export async function getCategories(fic: number | cheerio.CheerioAPI) {
  let $: cheerio.CheerioAPI = await getParsableInfoData(fic);

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

export async function getTags(fic: number | cheerio.CheerioAPI) {
  let $: cheerio.CheerioAPI = await getParsableInfoData(fic);

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

export async function getLanguage(fic: number | cheerio.CheerioAPI) {
  let $: cheerio.CheerioAPI = await getParsableInfoData(fic);

  return $(".language").first().next().text().replace("\n", "").trim();
}

export async function getSeries(fic: number | cheerio.CheerioAPI) {
  let $: cheerio.CheerioAPI = await getParsableInfoData(fic);

  return $("dd.series")
    .find("span.position")
    .get()
    .map((el) => {
      return {
        seriesName: $(el).find("a").text(),
        seriesLink: $(el).find("a").attr("href"),
        seriesPart: parseInt(
          $(el).text().replace($(el).find("a").text(), "").replace(/\D/g, "")
        ),
      };
    });
}

export async function getCollections(fic: number | cheerio.CheerioAPI) {
  let $: cheerio.CheerioAPI = await getParsableInfoData(fic);

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

export async function getSummary(fic: number | cheerio.CheerioAPI) {
  let $: cheerio.CheerioAPI = await getParsableInfoData(fic);

  let summaryArray = $(".summary blockquote")
    .find("p")
    .get()
    .map((el) => {
      return $(el).text();
    });

  return summaryArray.join("\n");
}

async function getParsableInfoData(fic: number | cheerio.CheerioAPI) {
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
