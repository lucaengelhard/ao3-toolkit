import axios, { AxiosInstance, AxiosResponse } from "axios";
import * as cheerio from "cheerio";

import ao3 from "..";

/**
 * Takes a logindata object to use the username and an axios instance that is logged in to ao3.
 * It downloads every page of the reading history of the user, parses it and returns an array of objects containing
 * a work id, the last time the user read it and the number of the times the user read it.
 *
 * @param logindata a logindata object containing a username
 * @param instance an axios instance logged in to ao3
 * @returns a new user userhistory array
 */
export async function getHistory(
  logindata: ao3.Login,
  instance: AxiosInstance | undefined,
  info?: boolean
) {
  if (typeof instance == "undefined") {
    throw new Error(
      "instance is undefined. wait for the instance to be resolved (execute ao3.login() on this instance) and then execute code"
    );
  }

  //Load the first history page
  //TODO: don't load the first page twice
  let history = await instance.get(
    `/users/${encodeURIComponent(logindata.username)}/readings`
  );

  ao3.getSuccess(history);

  let firstLoadContent = history.data;

  let $ = cheerio.load(firstLoadContent);

  //Get the number of history pages
  let navLength = parseInt($(".pagination li").not(".next").last().text());

  let resolvedHistoryPages: AxiosResponse<any, any>[] = [];

  //Load every history page
  //TODO: change the length of the for loop to navLength
  for (let i = 1; i <= 2; i++) {
    console.log("getting Page " + i);

    let loadedpage = await instance.get(
      `/users/${encodeURIComponent(logindata.username)}/readings?page=${i}`
    );

    try {
      ao3.getSuccess(loadedpage);
    } catch (error) {
      console.error(
        `Problems while loading page ${i} of the reading history of user ${logindata.username}`
      );

      continue;
    }

    resolvedHistoryPages.push(loadedpage);
  }

  //Parse each loaded Page
  //TODO: async page parsing? -> create timeout callbacks?
  let userHistory: Array<ao3.HistoryElement | ao3.Work> = [];

  resolvedHistoryPages.forEach((res) => {
    let page = res.data;

    let $ = cheerio.load(page);
    let works = $("li[role='article']").toArray();

    works.forEach((currentWork) => {
      parseWork(currentWork, userHistory, info);
    });
  });
  return userHistory;
}

function parseWork(
  currentWork: cheerio.Element,
  userHistory: (ao3.HistoryElement | ao3.Work)[],
  info: boolean | undefined
) {
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

  let historyElement: ao3.HistoryElement | ao3.Work;

  if (typeof info == "undefined" || info == false) {
    let historyElement: ao3.HistoryElement = {
      id: id,
      lastVisit: lastVisit,
      timesVisited: timesVisited,
    };
    userHistory.push(historyElement);
    return;
  } else {
    let historyStats: ao3.WorkHistory = {
      lastVisit: lastVisit,
      timesVisited: timesVisited,
      ratio: 0,
      wordsRead: 0,
    };

    historyElement = new ao3.Work(
      getHistoryInfo($, id),
      undefined,
      historyStats
    );

    userHistory.push(historyElement);
    return;
  }
}

function getHistoryInfo($: cheerio.CheerioAPI, id: number) {
  let info: ao3.Info = {
    title: $(".heading a").first().text(),
    id: id,
    author: {
      authorName: $("[rel=author]").text(),
      authorLink: ao3.linkToAbsolute($("[rel=author]").attr("href")),
    },
    fandom: $(".fandoms a")
      .get()
      .map((el) => {
        return {
          fandomName: $(el).text(),
          fandomLink: ao3.linkToAbsolute($(el).attr("href")),
        };
      }),
    stats: {
      words: parseInt($(".stats dd.words").text().replace(",", "")),
      chapters: {
        chaptersWritten: parseInt($(".stats dd.chapters a").text()),
        chaptersMax: parseInt(
          $(".stats dd.chapters")
            .text()
            .replace($(".stats dd.chapters a").text(), "")
        ),
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
          relationshipLink: ao3.linkToAbsolute($(el).attr("href")),
        };
      }),
    characters: $("li.characters a")
      .get()
      .map((el) => {
        return {
          characterName: $(el).text(),
          characterLink: ao3.linkToAbsolute($(el).attr("href")),
        };
      }),
    rating: {
      ratingName: $("ul.required-tags rating").text().trim(),
      ratingLink: ao3.linkToAbsolute(
        `https://archiveofourown.org/tags/${$("ul.required-tags rating")
          .text()
          .trim()}/works`
      ),
    },
    archiveWarnings: {
      warningName: $(".warnings a").text().trim(),
      warningLink: ao3.linkToAbsolute($(".warnings a").attr("href")),
    },
    categories: $(".category")
      .text()
      .split(",")
      .map((el) => {
        return {
          categoryName: el.trim(),
          categoryLink: ao3.linkToAbsolute(
            `https://archiveofourown.org/tags/${el
              .trim()
              .replace("/", "*s*")}/works`
          ),
        };
      }),
    tags: $(".freeforms a")
      .get()
      .map((el) => {
        return {
          tagName: $(el).text(),
          tagLink: ao3.linkToAbsolute($(el).attr("href")),
        };
      }),
    language: $("dd.language").text().replace("\n", "").trim(),
    series: $("dd.series")
      .find(".series")
      .get()
      .map((el) => {
        return {
          seriesName: $(el).find("a").text(),
          seriesLink: ao3.linkToAbsolute($(el).find("a").attr("href")),
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
