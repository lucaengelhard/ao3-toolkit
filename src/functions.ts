import {
  ao3,
  Fanfiction,
  historyFanfiction,
  Info,
  Chapter,
} from "./ao3-toolkit";
import { Login } from "./login";

import axios, { AxiosInstance } from "axios";
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
  let content = await getContent($);

  return new Fanfiction(info, content);
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

    browser.close();
  }

  let content = {
    notes: {
      preNote: await getPreNote($),
      endNote: await getEndNote($),
    },

    chapters: $("#chapters")
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

  let functions = [
    getTitle(fic),
    getAuthor(fic),
    getFandom(fic),
    getStats(fic),
    getRelationships(fic),
    getCharacters(fic),
    getAdult(fic),
    getRating(fic),
    getWarnings(fic),
    getCategories(fic),
    getTags(fic),
    getLanguage(fic),
    getSeries(fic),
    getCollections(fic),
    getSummary(fic),
  ];

  let resolved = (await Promise.allSettled(functions)).map((el, i) => {
    let element: any = el;

    return element;
  });

  let info: Info = {
    title: resolved[0].value,
    id: id,
    author: resolved[1].value,
    fandom: resolved[2].value,
    stats: resolved[3].value,
    relationships: resolved[4].value,
    characters: resolved[5].value,
    adult: resolved[6].value,
    rating: resolved[7].value,
    archiveWarnings: resolved[7].value,
    categories: resolved[8].value,
    tags: resolved[9].value,
    language: resolved[10].value,
    series: resolved[11].value,
    collections: resolved[12].value,
    summary: resolved[13].value,
  };

  return info;
}

export async function getTitle(fic: number | cheerio.CheerioAPI) {
  let $: cheerio.CheerioAPI = await getParsableInfoData(fic);

  let adult = await getAdult(fic);

  if (adult) {
    return $(".header.module").find("a").first().text();
  } else {
    return $("#preface").find("title").first().text();
  }
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

  let adult = await getAdult(fic);

  if (adult) {
    return $(".fandoms a")
      .get()
      .map((el) => {
        return {
          fandomName: $(el).text(),
          fandomLink: $(el).attr("href"),
        };
      });
  } else {
    return $(".fandom a")
      .get()
      .map((el) => {
        return {
          fandomName: $(el).text(),
          fandomLink: $(el).attr("href"),
        };
      });
  }
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

  let adult = await getAdult(fic);

  if (adult) {
    return $(".relationships a")
      .get()
      .map((el) => {
        return {
          relationshipName: $(el).text(),
          relationshipLink: $(el).attr("href"),
        };
      });
  } else {
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
}

export async function getCharacters(fic: number | cheerio.CheerioAPI) {
  let $: cheerio.CheerioAPI = await getParsableInfoData(fic);

  let adult = await getAdult(fic);

  if (adult) {
    return $(".characters a")
      .get()
      .map((el) => {
        return {
          characterName: $(el).text(),
          characterLink: $(el).attr("href"),
        };
      });
  } else {
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

  let adult = await getAdult(fic);

  if (adult) {
    return {
      ratingName: $(".rating").text(),
      ratingLink:
        "https://archiveofourown.org/tags/" + $(".rating").text() + "/works",
    };
  } else {
    return {
      ratingName: $(".rating a").find("a").text(),
      ratingLink: $(".rating a").find("a").attr("href"),
    };
  }
}

export async function getWarnings(fic: number | cheerio.CheerioAPI) {
  let $: cheerio.CheerioAPI = await getParsableInfoData(fic);

  let adult = await getAdult(fic);

  if (adult) {
    return {
      warningName: $(".warnings").first().text(),
      warningLink:
        "https://archiveofourown.org/tags/" +
        encodeURIComponent($(".warnings").first().text()) +
        "/works",
    };
  } else {
    return {
      warningName: $(".warning a").find("a").text(),
      warningLink: $(".warning a").find("a").attr("href"),
    };
  }
}

export async function getCategories(fic: number | cheerio.CheerioAPI) {
  let $: cheerio.CheerioAPI = await getParsableInfoData(fic);

  let adult = await getAdult(fic);

  if (adult) {
    return $(".category")
      .first()
      .text()
      .split(",")
      .map((el) => {
        return {
          categoryName: el.trim(),
          categoryLink:
            "https://archiveofourown.org/tags/" +
            encodeURIComponent(el.trim()) +
            "/works",
        };
      });
  } else {
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
}

export async function getTags(fic: number | cheerio.CheerioAPI) {
  let $: cheerio.CheerioAPI = await getParsableInfoData(fic);

  let adult = await getAdult(fic);

  if (adult) {
    return $(".freeforms a")
      .get()
      .map((el) => {
        return {
          tagName: $(el).text(),
          tagLink: $(el).attr("href"),
        };
      });
  } else {
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
}

export async function getLanguage(fic: number | cheerio.CheerioAPI) {
  let $: cheerio.CheerioAPI = await getParsableInfoData(fic);

  return $(".language").first().next().text();
}

export async function getSeries(fic: number | cheerio.CheerioAPI) {
  let $: cheerio.CheerioAPI = await getParsableInfoData(fic);

  let adult = await getAdult(fic);

  if (adult) {
    return $("ul.series")
      .find("li")
      .get()
      .map((el) => {
        return {
          seriesName: $(el).find("a").text(),
          seriesLink: $(el).find("a").attr("href"),
          seriesPart: parseInt($(el).find("strong").text()),
        };
      });
  } else {
    return $("dd.series")
      .find("span.series")
      .get()
      .map((el) => {
        return {
          seriesName: $(el).find("a").text(),
          seriesLink: $(el).find("a").attr("href"),
          seriesPart: parseInt(
            $(el).find(".positon").first().text().replace(/\D/g, "")
          ),
        };
      });
  }
}

export async function getCollections(fic: number | cheerio.CheerioAPI) {
  let $: cheerio.CheerioAPI = await getParsableInfoData(fic);

  let adult = await getAdult(fic);

  if (adult) {
    let collectionsURL =
      "https://archiveofourown.org" + $("dd.collections a").attr("href");

    let loadedCollections = await axios({
      method: "get",
      url: collectionsURL,
    });

    let $col = cheerio.load(loadedCollections.data);

    return $col("ul.collection")
      .first()
      .find("li")
      .get()
      .map((el) => {
        return {
          collectionName: $(el).find("a").first().text(),
          collectionLink: $(el).find("a").first().attr("href"),
        };
      });
  } else {
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
}

export async function getSummary(fic: number | cheerio.CheerioAPI) {
  let $: cheerio.CheerioAPI = await getParsableInfoData(fic);

  let adult = await getAdult(fic);

  if (adult) {
    let summaryArray = $("blockquote.summary")
      .find("p")
      .get()
      .map((el) => {
        return $(el).text();
      });

    return summaryArray.join("\n\n");
  } else {
    let summaryArray = $(".summary blockquote")
      .find("p")
      .get()
      .map((el) => {
        return $(el).text();
      });

    return summaryArray.join("\n");
  }
}

async function getParsableInfoData(fic: number | cheerio.CheerioAPI) {
  if (typeof fic == "number") {
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

export interface historyFic {
  id: number;
  lastVisit: Date;
  timesVisited: number;
}

export async function getHistory(
  logindata: Login,
  instance: AxiosInstance | undefined
) {
  /*
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

  

  for (let i = 2; i < navLength; i++) {
    

    let newPage = await browser.newPage();

    await newPage.goto(
      "https://archiveofourown.org/users/capmaennle/readings?page=" + i
    );

    await newPage.waitForSelector("#footer");

    let content = await newPage.content();

    await newPage.close();
*/
  if (typeof instance == "undefined") {
    throw new Error(
      "instance is undefined. wait for the instance to be resolved and then execute code"
    );
  }

  let history = await instance.get(`/users/${logindata.username}/readings`);

  let userHistory: Array<historyFic> = [];

  let firstLoadContent = history.data;

  let $ = cheerio.load(firstLoadContent);

  let navLength = parseInt($(".pagination li").not(".next").last().text());

  let historypages = [];

  for (let i = 1; i < navLength; i++) {
    console.log("getting Page " + i);

    historypages.push(
      instance.get(`/users/${logindata.username}/readings?page=${i}`)
    );
  }

  let resolvedHistoryPages = await Promise.all(historypages);

  resolvedHistoryPages.forEach((res) => {
    let page = res.data;
    let $ = cheerio.load(page);
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
  });

  //Load Content

  return userHistory;
}
