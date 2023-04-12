import axios, { AxiosInstance } from "axios";
import * as cheerio from "cheerio";
import { Work } from "../classes/works.js";
import { Info } from "../types/works.js";
import { linkToAbsolute } from "../utils/helper.js";

export async function getWork(id: number) {
  return new Work(await getInfo(id), await getContent(id));
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

  let functions = [
    getTitle(fic),
    getAuthor(fic),
    getFandom(fic),
    getStats(fic),
    getRelationships(fic),
    getCharacters(fic),
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

  return $(".preface").find(".title").first().text().trim();
}

export async function getAuthor(fic: number | cheerio.CheerioAPI) {
  let $: cheerio.CheerioAPI = await getParsableInfoData(fic);

  return {
    authorName: $("[rel=author]").text(),
    authorLink: linkToAbsolute($("[rel=author]").attr("href")),
  };
}

export async function getFandom(fic: number | cheerio.CheerioAPI) {
  let $: cheerio.CheerioAPI = await getParsableInfoData(fic);

  return $(".fandom a")
    .get()
    .map((el) => {
      return {
        fandomName: $(el).text(),
        fandomLink: linkToAbsolute($(el).attr("href")),
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
        relationshipLink: linkToAbsolute($(el).attr("href")),
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
        characterLink: linkToAbsolute($(el).attr("href")),
      };
    });
}

export async function getRating(fic: number | cheerio.CheerioAPI) {
  let $: cheerio.CheerioAPI = await getParsableInfoData(fic);

  return {
    ratingName: $("dd.rating").text().trim(),
    ratingLink: linkToAbsolute($("dd.rating").find("a").attr("href")),
  };
}

export async function getWarnings(fic: number | cheerio.CheerioAPI) {
  let $: cheerio.CheerioAPI = await getParsableInfoData(fic);

  return {
    warningName: $("dd.warning").text().trim(),
    warningLink: linkToAbsolute($("dd.warning").find("a").attr("href")),
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
        categoryLink: linkToAbsolute($(el).attr("href")),
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
        tagLink: linkToAbsolute($(el).attr("href")),
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
        seriesLink: linkToAbsolute($(el).find("a").attr("href")),
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
        collectionLink: linkToAbsolute($(el).attr("href")),
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
