import axios, { AxiosInstance, AxiosResponse } from "axios";
import * as cheerio from "cheerio";

import ao3 from "..";

export async function getList(
  logindata: ao3.Login,
  instance: AxiosInstance | undefined,
  listtype?: ao3.Listtype,
  span?: ao3.PageSpan | number[] | number
) {
  if (typeof instance == "undefined") {
    throw new Error(
      "instance is undefined. wait for the instance to be resolved (execute ao3.login() on this instance) and then execute code"
    );
  }

  //Load the first history page
  //TODO: don't load the first page twice
  let firstUrl = "";
  if (typeof listtype == "undefined") {
    return;
  }
  if (listtype == ao3.Listtype.History) {
    firstUrl = `/users/${encodeURIComponent(logindata.username)}/readings`;
  }

  let firstPage = await instance.get(firstUrl);

  ao3.getSuccess(firstPage);

  let firstLoadContent = firstPage.data;

  let $ = cheerio.load(firstLoadContent);

  //Get the number of history pages
  let navLength = ao3.getPageNumber($);

  if (typeof span == "number") {
    span = {
      start: 1,
      end: span,
    };
  }

  let resolvedListPages: AxiosResponse<any, any>[] = [];

  let batchlength = ao3.defaults.batch;
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
      await ao3.delay(1500);
      batchbase = 1;
    }

    console.log("getting Page " + i);

    try {
      let loadedpage = await instance.get(`${firstUrl}?page=${i}`);

      try {
        ao3.getSuccess(loadedpage);
      } catch (error) {
        console.error(
          `Problems while loading page ${i} of ${listtype} of user ${logindata.username}. This could be because there were to many requests.`
        );

        continue;
      }
      resolvedListPages.push(loadedpage);
      ao3.defaults.listBuffer.push(loadedpage);
    } catch (error) {
      console.error(
        `Problems while loading page ${i} of ${listtype} of user ${logindata.username}. This could be because there were to many requests.`
      );
    }
    batchbase++;
  }

  //Parse each loaded Page
  let parsed: any = [];

  resolvedListPages.forEach((res) => {
    let page = res.data;

    let $ = cheerio.load(page);
    let works = $("li[role='article']").toArray();

    works.forEach((currentWork) => {
      try {
        parsed.push(parseListWork(logindata.username, currentWork, listtype));
      } catch (error) {
        throw ao3.defaults.listBuffer;
      }
    });
  });

  let list = new ao3.WorkList(parsed, listtype);

  return list;
}

function parseListWork(
  username: string,
  currentWork: cheerio.Element,
  listtype: ao3.Listtype
) {
  let $ = cheerio.load(currentWork);
  let isdeleted = false;

  isdeleted = currentWork.attribs.class.includes("deleted");

  if (isdeleted) {
    return;
  }

  let id: number = parseInt(currentWork.attribs.id.replace("work_", ""));

  let history: ao3.WorkHistory | undefined = undefined;
  if (listtype == ao3.Listtype.History) {
    history = parseHistoryWork($);
  }

  let bookmark: ao3.WorkBookmark | undefined = undefined;
  if (listtype == ao3.Listtype.Bookmarks) {
    bookmark = parseBookmarkWork($);
  }

  let userdata: ao3.WorkUserData = {
    user: username,
    history,
    bookmark,
  };
  let info = parseListWorkInfo($);

  return new ao3.Work(info, undefined, userdata);

  function parseListWorkInfo($: cheerio.CheerioAPI) {
    let info: ao3.Info = {
      title: $(".heading a").first().text(),
      id: id,
      author: {
        authorName: $("[rel=author]").text(),
        authorLink: ao3.linkToAbsolute($("[rel=author]").attr("href"), false),
      },
      fandom: $(".fandoms a")
        .get()
        .map((el) => {
          return {
            fandomName: $(el).text(),
            fandomLink: ao3.linkToAbsolute($(el).attr("href"), false),
          };
        }),
      stats: {
        words: parseInt($(".stats dd.words").text().replace(",", "")),
        chapters: {
          chaptersWritten: parseInt(
            $(".stats dd.chapters").text().split("/")[0]
          ),
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
            relationshipLink: ao3.linkToAbsolute($(el).attr("href"), false),
          };
        }),
      characters: $("li.characters a")
        .get()
        .map((el) => {
          return {
            characterName: $(el).text(),
            characterLink: ao3.linkToAbsolute($(el).attr("href"), false),
          };
        }),
      rating: {
        ratingName: $("ul.required-tags rating").text().trim(),
        ratingLink: ao3.linkToAbsolute(
          `https://archiveofourown.org/tags/${$("ul.required-tags rating")
            .text()
            .trim()}/works`,
          false
        ),
      },
      archiveWarnings: {
        warningName: $(".warnings a").text().trim(),
        warningLink: ao3.linkToAbsolute($(".warnings a").attr("href"), false),
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
                .replace("/", "*s*")}/works`,
              false
            ),
          };
        }),
      tags: $(".freeforms a")
        .get()
        .map((el) => {
          return {
            tagName: $(el).text(),
            tagLink: ao3.linkToAbsolute($(el).attr("href"), false),
          };
        }),
      language: $("dd.language").text().replace("\n", "").trim(),
      series: $("dd.series")
        .find(".series")
        .get()
        .map((el) => {
          return {
            seriesName: $(el).find("a").text(),
            seriesLink: ao3.linkToAbsolute($(el).find("a").attr("href"), false),
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

  function parseHistoryWork($: cheerio.CheerioAPI) {
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

    let historyStats: ao3.WorkHistory = {
      lastVisit: lastVisit,
      timesVisited: timesVisited,
      ratio: 0,
      wordsRead: 0,
    };

    return historyStats;
  }

  function parseBookmarkWork($: cheerio.CheerioAPI) {
    return undefined;
  }
}

function instaceOfPageSpan(span: any): span is ao3.PageSpan {
  return span;
}

function instaceOfPageArray(span: any): span is number[] {
  return span;
}
