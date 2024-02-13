import { parentPort } from "worker_threads";
import * as cheerio from "cheerio";
import { AxiosResponse } from "axios";
import User from "../../classes/ClassUser";
import Work from "../../classes/ClassWork";
import WorkInfo, { WorkStats } from "../../classes/ClassWorkInfo";
import WorkUserData from "../../classes/ClassWorkUserData";
import { Listtype } from "../../enums/EnumWorkLists";
import { Login } from "../../interfaces/InterfaceUserData";
import {
  Fandom,
  Relationship,
  Character,
  Rating,
  ArchiveWarning,
  Category,
  Tag,
  SeriesInfo,
} from "../../interfaces/InterfaceWorkInfo";
import {
  WorkHistory,
  WorkBookmark,
} from "../../interfaces/InterfaceWorkUsersData";
import { linkToAbsolute, defineParseIntString } from "../helpers";

parentPort?.on(
  "message",
  (mesage: {
    data: { loadedPage: AxiosResponse<any, any>; i: number };
    logindata: Login;
    listtype: Listtype;
  }) => {
    const $ = cheerio.load(mesage.data.loadedPage.data);
    const works = $("li[role='article']").toArray();

    let handledStack: Work[] = [];

    for (let index = 0; index < works.length; index++) {
      const work: cheerio.Element | undefined = works[index];
      if (!work) {
        continue;
      }

      try {
        handledStack.push(
          parseListWork(work, mesage.listtype, mesage.logindata)
        );
      } catch (error) {
        console.log(error);
        parentPort?.postMessage("error");
      }
    }

    parentPort?.postMessage(handledStack);
  }
);

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
  const id: number = parseInt(idString.replaceAll("work_", ""));

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
      .replaceAll("Last visited: ", "")
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
      title: getListWorkTitle($),
      id: id,
      authors: getListWorkAuthor($),
      fandom: getListWorkFandom($),
      stats: getListWorkStats($),
      relationships: getListWorkRelationship($),
      characters: getListWorkCharacter($),
      rating: getListWorkRating($),
      archiveWarnings: getListWorkArchiveWarning($),
      categories: getListWorkCategory($),
      tags: getListWorkTags($),
      language: getListWorkLanguage($),
      series: getListWorkSeries($),
      summary: getListWorkSummary($),
    };
  }
}

function getListWorkTitle($: cheerio.CheerioAPI): string {
  return $(".heading a").first().text();
}

function getListWorkAuthor($: cheerio.CheerioAPI): User[] {
  return $("[rel=author]")
    .get()
    .map((el: cheerio.Element) => {
      return new User({
        username: $(el).text(),
        userLink: linkToAbsolute($(el).attr("href")),
      });
    });
}

function getListWorkFandom($: cheerio.CheerioAPI): Fandom[] {
  return $(".fandoms a")
    .get()
    .map((el) => {
      return {
        fandomName: $(el).text(),
        fandomLink: linkToAbsolute($(el).attr("href")),
      };
    });
}

function getListWorkStats($: cheerio.CheerioAPI): WorkStats {
  return new WorkStats({
    words: parseInt($(".stats dd.words").text().replaceAll(",", "")),
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
  });
}

function getListWorkRelationship($: cheerio.CheerioAPI): Relationship[] {
  return $("li.relationships a")
    .get()
    .map((el) => {
      return {
        relationshipName: $(el).text(),
        relationshipLink: linkToAbsolute($(el).attr("href")),
      };
    });
}

function getListWorkCharacter($: cheerio.CheerioAPI): Character[] {
  return $("li.characters a")
    .get()
    .map((el) => {
      return {
        characterName: $(el).text(),
        characterLink: linkToAbsolute($(el).attr("href")),
      };
    });
}

function getListWorkRating($: cheerio.CheerioAPI): Rating {
  return {
    ratingName: $("ul.required-tags rating").text().trim(),
    ratingLink: linkToAbsolute(
      `https://archiveofourown.org/tags/${$("ul.required-tags rating")
        .text()
        .trim()}/works`
    ),
  };
}

function getListWorkArchiveWarning($: cheerio.CheerioAPI): ArchiveWarning[] {
  return $(".warnings span.text")
    .text()
    .split(",")
    .map((el) => {
      return {
        warningName: el.trim(),
        warningLink: `https://archiveofourown.org/tags/${el.replaceAll(
          " ",
          "%20"
        )}/works`,
      };
    });
}

function getListWorkCategory($: cheerio.CheerioAPI): Category[] {
  return $(".category")
    .text()
    .split(",")
    .map((el) => {
      return {
        categoryName: el.trim(),
        categoryLink: `https://archiveofourown.org/tags/${el
          .trim()
          .replaceAll("/", "*s*")}/works`,
      };
    });
}

function getListWorkTags($: cheerio.CheerioAPI): Tag[] {
  return $(".freeforms a")
    .get()
    .map((el) => {
      return {
        tagName: $(el).text(),
        tagLink: linkToAbsolute($(el).attr("href")),
      };
    });
}

function getListWorkLanguage($: cheerio.CheerioAPI): string {
  return $("dd.language").text().replaceAll("\n", "").trim();
}

function getListWorkSeries($: cheerio.CheerioAPI): SeriesInfo[] {
  return $("ul.series li")
    .get()
    .map((el) => {
      return {
        seriesName: $(el).find("a").text(),
        seriesLink: linkToAbsolute($(el).find("a").attr("href")),
        seriesPart: parseInt($(el).find("strong").text()),
      };
    });
}

function getListWorkSummary($: cheerio.CheerioAPI): string {
  return $(".summary p")
    .get()
    .map((el) => {
      return $(el).text();
    })
    .join("\n");
}
