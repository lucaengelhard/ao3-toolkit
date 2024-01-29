import { AxiosInstance, AxiosResponse } from "axios";
import * as cheerio from "cheerio";
import { Login } from "../interfaces/InterfaceUserData";
import { Listtype } from "../enums/EnumWorkLists";
import { PageSpan } from "../interfaces/InterfaceWorkList";
import {
  defineParseIntString,
  delay,
  getAxiosSuccess,
  getPageNumber,
  linkToAbsolute,
} from "./helpers";
import { axiosDefaults } from "../config/axiosDefaults";
import WorkList from "../classes/ClassWorkList";
import Work from "../classes/ClassWork";
import {
  WorkBookmark,
  WorkHistory,
} from "../interfaces/InterfaceWorkUsersData";
import User from "../classes/ClassUser";
import { WorkUserData } from "../classes/ClassWorkUserData";
import WorkInfo, { WorkStats } from "../classes/ClassWorkInfo";

export default async function getWorkList(
  logindata: Login,
  instance: AxiosInstance | undefined,
  listtype?: Listtype,
  span?: PageSpan | number[] | number
) {
  if (typeof instance == "undefined") {
    throw new Error(
      "instance is undefined. There needs to be a logged in session"
    );
  }

  if (typeof listtype == "undefined") {
    return;
  }
  if (listtype == Listtype.History) {
  }

  if (listtype == Listtype.Bookmarks) {
  }

  let firstUrl = "";
  switch (listtype) {
    case Listtype.History:
      firstUrl = `/users/${encodeURIComponent(logindata.username)}/readings`;
      break;
    case Listtype.Bookmarks:
      firstUrl = `/users/${encodeURIComponent(logindata.username)}/bookmarks`;
      break;
    default:
      throw new Error("Listtype is undefined");
  }

  const firstPage = await instance.get(firstUrl);
  getAxiosSuccess(firstPage);

  const firstLoadContent = firstPage.data;

  const $ = cheerio.load(firstLoadContent);

  //Get the number of history pages
  const navLength = getPageNumber($);

  if (typeof span == "number") {
    span = {
      start: 1,
      end: span,
    };
  }

  let resolvedListPages: AxiosResponse<any, any>[] = [];

  const batchlength = axiosDefaults.batch;
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
      const loadedpage = await instance.get(
        `${firstUrl}?page=${i}`,
        axiosDefaults.axios
      );

      try {
        getAxiosSuccess(loadedpage);
      } catch (error) {
        console.error(
          `Problems while loading page ${i} of ${listtype} of user ${logindata.username}. This could be because there were to many requests.!`
        );

        continue;
      }
      resolvedListPages.push(loadedpage);
    } catch (error) {
      console.error(
        `Problems while loading page ${i} of ${listtype} of user ${logindata.username}. This could be because there were to many requests.`
      );
    }
    batchbase++;
  }

  //Parse each loaded Page
  let parsed: Work[] = [];

  resolvedListPages.forEach((res) => {
    const $ = cheerio.load(res.data);
    const works = $("li[role='article']").toArray();

    works.forEach((work: cheerio.Element) => {
      try {
        parsed.push(parseListWork(work, listtype, logindata));
      } catch (error) {
        console.log(error);
      }
    });
  });

  return new WorkList(parsed, listtype);
}

function parseListWork(
  work: cheerio.Element,
  listtype: Listtype,
  logindata: Login
): Work {
  const $ = cheerio.load(work);
  const isdeleted = work.attribs.class?.includes("deleted");
  if (isdeleted) {
    throw new Error("work is deleted");
  }

  let idString = work.attribs.id;
  if (!idString) {
    idString = "0";
  }
  const id: number = parseInt(idString.replace("work_", ""));

  let userHistoryData: WorkHistory | undefined;
  let userBookmarkData: WorkBookmark | undefined;
  switch (listtype) {
    case Listtype.History:
      userHistoryData = parseHistoryWork($);
      break;

    case Listtype.Bookmarks:
      userBookmarkData = parseBookmarkWork($);
      break;

    default:
      break;
  }

  return new Work(parseListWorkInfo($), undefined, [
    new WorkUserData({
      user: new User({ username: logindata.username }),
      historyWithWork: userHistoryData,
      bookmark: userBookmarkData,
    }),
  ]);

  function parseHistoryWork($: cheerio.CheerioAPI): WorkHistory {
    const viewedText: string = $("h4.viewed.heading")
      .text()
      .replace("Last visited: ", "")
      .trim();

    const lastindex: number = viewedText.indexOf("(");
    const lastSubstring: string = viewedText.substring(0, lastindex).trim();
    const lastVisit: Date = new Date(lastSubstring);

    const visitedindex = viewedText.indexOf("Visited");
    const visitedsub: any = viewedText.substring(visitedindex);

    let timesVisited: number;

    if (visitedsub.includes("once")) {
      timesVisited = 1;
    } else {
      timesVisited = parseInt(visitedsub.match(/(\d+)/)[0]);
    }

    return {
      lastVisit: lastVisit,
      timesVisited: timesVisited,
      ratio: 0,
      wordsRead: 0,
    };
  }

  function parseBookmarkWork($: cheerio.CheerioAPI): WorkBookmark {
    return {
      dateBookmarked: new Date($(".own.user .datetime").text()),
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
  }

  function parseListWorkInfo($: cheerio.CheerioAPI): WorkInfo {
    return {
      title: $(".heading a").first().text(),
      id: id,
      authors: $("[rel=author]")
        .get()
        .map((el: cheerio.Element) => {
          return new User({
            username: $(el).text(),
            userLink: linkToAbsolute($(el).attr("href")),
          });
        }),
      fandom: $(".fandoms a")
        .get()
        .map((el) => {
          return {
            fandomName: $(el).text(),
            fandomLink: linkToAbsolute($(el).attr("href")),
          };
        }),
      stats: new WorkStats({
        words: parseInt($(".stats dd.words").text().replace(",", "")),
        chapters: {
          chaptersWritten: parseInt(
            defineParseIntString($(".stats dd.chapters").text().split("/")[0])
          ),
          chaptersMax: parseInt(
            defineParseIntString($(".stats dd.chapters").text().split("/")[1])
          ),
        },
        kudos: parseInt($(".stats dd.kudos").text()),
        hits: parseInt($(".stats dd.hits").text()),
        bookmarks: parseInt($(".stats dd.bookmarks").text()),
      }),
      relationships: $("li.relationships a")
        .get()
        .map((el) => {
          return {
            relationshipName: $(el).text(),
            relationshipLink: linkToAbsolute($(el).attr("href")),
          };
        }),
      characters: $("li.characters a")
        .get()
        .map((el) => {
          return {
            characterName: $(el).text(),
            characterLink: linkToAbsolute($(el).attr("href")),
          };
        }),
      rating: {
        ratingName: $("ul.required-tags rating").text().trim(),
        ratingLink: linkToAbsolute(
          `https://archiveofourown.org/tags/${$("ul.required-tags rating")
            .text()
            .trim()}/works`
        ),
      },
      archiveWarnings: [
        {
          warningName: $(".warnings a").text().trim(),
          warningLink: linkToAbsolute($(".warnings a").attr("href")),
        },
      ],
      categories: $(".category")
        .text()
        .split(",")
        .map((el) => {
          return {
            categoryName: el.trim(),
            categoryLink: linkToAbsolute(
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
            tagLink: linkToAbsolute($(el).attr("href")),
          };
        }),
      language: $("dd.language").text().replace("\n", "").trim(),
      series: $("dd.series")
        .find(".series")
        .get()
        .map((el) => {
          return {
            seriesName: $(el).find("a").text(),
            seriesLink: linkToAbsolute($(el).find("a").attr("href")),
            seriesPart: parseInt($(el).find("strong").text()),
          };
        }),
      summary: $(".summary p")
        .get()
        .map((el) => {
          return $(el).text();
        })
        .join("\n"),
    };
  }
}

function instaceOfPageSpan(span: any): span is PageSpan {
  return span;
}

function instaceOfPageArray(span: any): span is number[] {
  return span;
}
