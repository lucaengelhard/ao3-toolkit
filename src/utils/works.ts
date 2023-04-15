import axios, { AxiosInstance } from "axios";
import * as cheerio from "cheerio";
import ao3 from "..";

/**
 * This function takes a work id, runs the {@link getInfo} and {@link ao3.getContent} function and returns a new {@link ao3.Work} object.
 *
 * @param id a work id
 * @returns a new Work Object
 */
export async function getWork(id: number) {
  return new ao3.Work(await getInfo(id), await getContent(id));
}

/**
 * This function takes a work id or cheerio object, parses the data and returns an object containing the forword, afterword and each chapter
 *
 * @param fic a work id or a cheerio object of the first chapter
 * @returns an object containing the forword, afterword and each chapter
 */
export async function getContent(fic: number | cheerio.CheerioAPI) {
  let $: cheerio.CheerioAPI = await ao3.getParsableInfoData(fic);

  let downloadURL =
    "https://archiveofourown.org" +
    $(".download").find("li:contains('HTML')").find("a").attr("href");

  let initialLoad = await axios.get(downloadURL);

  ao3.getSuccess(initialLoad);

  let download = initialLoad.data;

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

  /**
   *
   * @param fic a cheerio object of the first chapter
   * @returns the foreword of the work
   */
  async function getPreNote(fic: cheerio.CheerioAPI) {
    return fic("#preface p:contains('Notes')").next().text();
  }

  /**
   *
   * @param fic a cheerio object of the first chapter
   * @returns the afterword of the work
   */
  async function getEndNote(fic: cheerio.CheerioAPI) {
    return fic("#endnotes").find("blockquote").text();
  }
}

/**
 * This function takes a work id or cheerio object, runs multiple getter functions asynchronously and returns an info object.
 *
 * @param fic a work id or a cheerio object of the first chapter
 * @param id (optional) a work id
 * @returns a new info Object
 */
export async function getInfo(fic: number | cheerio.CheerioAPI, id?: number) {
  if (typeof fic == "number") {
    id = fic;
  }

  if (typeof id == "undefined") {
    throw new Error(
      "If the first argument is a Cheerio Object and not an ID, input an ID with the type number as the second argument"
    );
  }

  fic = await ao3.getParsableInfoData(fic);

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

  let info: ao3.Info = {
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

/**
 *
 * @param fic a work id or a cheerio object of the first chapter
 * @returns the title of the work
 */
export async function getTitle(fic: number | cheerio.CheerioAPI) {
  let $: cheerio.CheerioAPI = await ao3.getParsableInfoData(fic);

  return $(".preface").find(".title").first().text().trim();
}

/**
 *
 * @param fic a work id or a cheerio object of the first chapter
 * @returns the author of the work and the link to to the authors profile
 */
export async function getAuthor(fic: number | cheerio.CheerioAPI) {
  let $: cheerio.CheerioAPI = await ao3.getParsableInfoData(fic);

  return {
    authorName: $("[rel=author]").text(),
    authorLink: ao3.linkToAbsolute($("[rel=author]").attr("href")),
  };
}

/**
 *
 * @param fic a work id or a cheerio object of the first chapter
 * @returns an array of objects containing the name of a fandom and the link to the fandom overview
 */
export async function getFandom(fic: number | cheerio.CheerioAPI) {
  let $: cheerio.CheerioAPI = await ao3.getParsableInfoData(fic);

  return $(".fandom a")
    .get()
    .map((el) => {
      return {
        fandomName: $(el).text(),
        fandomLink: ao3.linkToAbsolute($(el).attr("href")),
      };
    });
}

/**
 *
 * @param fic a work id or a cheerio object of the first chapter
 * @returns the stats of the work
 */
export async function getStats(fic: number | cheerio.CheerioAPI) {
  let $: cheerio.CheerioAPI = await ao3.getParsableInfoData(fic);

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

  /**
   *
   * @param stats a cheerio element of an ao3 page stat block
   * @returns the number of words of the work
   */
  function getWords(stats: cheerio.Cheerio<cheerio.Element>) {
    return parseInt(stats.find(".words").next().text().replace(",", ""));
  }

  /**
   *
   * @param stats a cheerio element of an ao3 page stat block
   * @returns the number of published chapters of the work
   */
  function getChaptersWritten(stats: cheerio.Cheerio<cheerio.Element>) {
    return parseInt(stats.find(".chapters").next().text().split("/")[0]);
  }

  /**
   *
   * @param stats a cheerio element of an ao3 page stat block
   * @returns the maximum number of chapters of the work (returns NaN if not defined)
   */
  function getChaptersMax(stats: cheerio.Cheerio<cheerio.Element>) {
    return parseInt(stats.find(".chapters").next().text().split("/")[1]);
  }

  /**
   *
   * @param stats a cheerio element of an ao3 page stat block
   * @returns the number of kudos of the work
   */
  function getKudos(stats: cheerio.Cheerio<cheerio.Element>) {
    return parseInt(stats.find(".kudos").next().text());
  }

  /**
   *
   * @param stats a cheerio element of an ao3 page stat block
   * @returns the number of hits of the work
   */
  function getHits(stats: cheerio.Cheerio<cheerio.Element>) {
    return parseInt(stats.find(".hits").next().text());
  }

  /**
   *
   * @param stats a cheerio element of an ao3 page stat block
   * @returns the number of bookmarks of the work
   */
  function getBookmarks(stats: cheerio.Cheerio<cheerio.Element>) {
    return parseInt(stats.find(".bookmarks").next().text());
  }
}

/**
 *
 * @param fic a work id or a cheerio object of the first chapter
 * @returns an array of objects containing the name of a relationship and the link to the relationship overview
 */
export async function getRelationships(fic: number | cheerio.CheerioAPI) {
  let $: cheerio.CheerioAPI = await ao3.getParsableInfoData(fic);

  return $(".relationship")
    .next()
    .find("a")
    .get()
    .map((el) => {
      return {
        relationshipName: $(el).text(),
        relationshipLink: ao3.linkToAbsolute($(el).attr("href")),
      };
    });
}

/**
 *
 * @param fic a work id or a cheerio object of the first chapter
 * @returns an array of objects containing the name of a character and the link to the character overview
 */
export async function getCharacters(fic: number | cheerio.CheerioAPI) {
  let $: cheerio.CheerioAPI = await ao3.getParsableInfoData(fic);

  return $(".character")
    .next()
    .find("a")
    .get()
    .map((el) => {
      return {
        characterName: $(el).text(),
        characterLink: ao3.linkToAbsolute($(el).attr("href")),
      };
    });
}

/**
 *
 * @param fic a work id or a cheerio object of the first chapter
 * @returns an object containing the rating of the work and a link to the rating overview
 */
export async function getRating(fic: number | cheerio.CheerioAPI) {
  let $: cheerio.CheerioAPI = await ao3.getParsableInfoData(fic);

  return {
    ratingName: $("dd.rating").text().trim(),
    ratingLink: ao3.linkToAbsolute($("dd.rating").find("a").attr("href")),
  };
}

/**
 *
 * @param fic a work id or a cheerio object of the first chapter
 * @returns an object containing the warnings of the work and a link to the warnings overview
 */
export async function getWarnings(fic: number | cheerio.CheerioAPI) {
  let $: cheerio.CheerioAPI = await ao3.getParsableInfoData(fic);

  return {
    warningName: $("dd.warning").text().trim(),
    warningLink: ao3.linkToAbsolute($("dd.warning").find("a").attr("href")),
  };
}

/**
 *
 * @param fic a work id or a cheerio object of the first chapter
 * @returns an array of objects containing the name of a category and the link to the category overview
 */
export async function getCategories(fic: number | cheerio.CheerioAPI) {
  let $: cheerio.CheerioAPI = await ao3.getParsableInfoData(fic);

  return $(".category")
    .next()
    .find("a")
    .get()
    .map((el) => {
      return {
        categoryName: $(el).text(),
        categoryLink: ao3.linkToAbsolute($(el).attr("href")),
      };
    });
}

/**
 *
 * @param fic a work id or a cheerio object of the first chapter
 * @returns an array of objects containing the name of a freeform tag and the link to the freeform tag overview
 */
export async function getTags(fic: number | cheerio.CheerioAPI) {
  let $: cheerio.CheerioAPI = await ao3.getParsableInfoData(fic);

  return $(".freeform")
    .next()
    .find("a")
    .get()
    .map((el) => {
      return {
        tagName: $(el).text(),
        tagLink: ao3.linkToAbsolute($(el).attr("href")),
      };
    });
}

/**
 *
 * @param fic a work id or a cheerio object of the first chapter
 * @returns the language of the work
 */
export async function getLanguage(fic: number | cheerio.CheerioAPI) {
  let $: cheerio.CheerioAPI = await ao3.getParsableInfoData(fic);

  return $(".language").first().next().text().replace("\n", "").trim();
}

/**
 *
 * @param fic a work id or a cheerio object of the first chapter
 * @returns an array of objects containing the name of a series, the link to the series overview and a number of the part in ther series
 */
export async function getSeries(fic: number | cheerio.CheerioAPI) {
  let $: cheerio.CheerioAPI = await ao3.getParsableInfoData(fic);

  return $("dd.series")
    .find("span.position")
    .get()
    .map((el) => {
      return {
        seriesName: $(el).find("a").text(),
        seriesLink: ao3.linkToAbsolute($(el).find("a").attr("href")),
        seriesPart: parseInt(
          $(el).text().replace($(el).find("a").text(), "").replace(/\D/g, "")
        ),
      };
    });
}

/**
 *
 * @param fic a work id or a cheerio object of the first chapter
 * @returns an array of objects containing the name of a collection and the link to the collection overview
 */
export async function getCollections(fic: number | cheerio.CheerioAPI) {
  let $: cheerio.CheerioAPI = await ao3.getParsableInfoData(fic);

  return $("dd.collections")
    .first()
    .find("a")
    .get()
    .map((el) => {
      return {
        collectionName: $(el).text(),
        collectionLink: ao3.linkToAbsolute($(el).attr("href")),
      };
    });
}

/**
 *
 * @param fic a work id or a cheerio object of the first chapter
 * @returns the summary of the work
 */
export async function getSummary(fic: number | cheerio.CheerioAPI) {
  let $: cheerio.CheerioAPI = await ao3.getParsableInfoData(fic);

  let summaryArray = $(".summary blockquote")
    .find("p")
    .get()
    .map((el) => {
      return $(el).text();
    });

  return summaryArray.join("\n");
}
