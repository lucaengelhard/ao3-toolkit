import axios from "axios";
import ao3 from "..";
import * as cheerio from "cheerio";

export async function search(query: string, index?: number) {
  let page = "";
  if (!(index == 1 || typeof index == "undefined")) {
    page = `page=${index}&`;
  }

  let baseurl = `https://archiveofourown.org/works/search?${page}work_search%5Bquery%5D=`;

  let searchurl = `${baseurl}${query}`;

  axios.defaults.headers.common["User-Agent"] = "Axios/1.3.5 ao3-toolkit bot";
  let res = await axios.get(searchurl, ao3.defaults.axios);

  ao3.getSuccess(res);

  let firstLoadContent = res.data;

  let $ = cheerio.load(firstLoadContent);

  //Get the number of history pages
  let navLength = ao3.getPageNumber($);

  return { index, navLength, result: parseSearchList($) };
}

export async function advancedWorkSearch(search: ao3.Search, index?: number) {
  let page = "";
  if (!(index == 1 || typeof index == "undefined")) {
    page = `page=${index}&`;
  }

  let baseurl = `https://archiveofourown.org/works/search?commit=Search&${page}work_search`;

  let bookmarks = "";
  let characterNames = "";
  let comments = "";
  let complete = "";
  let creators = "";
  let crossover = "";
  let fandoms = "";
  let freeforms = "";
  let hits = "";
  let kudos = "";
  let language = "";
  let query = "";
  let rating = "";
  let relationships = "";
  let revisedAt = "";
  let singleChapter = "";
  let sortBy = "";
  let sortDirection = "";
  let title = "";
  let wordCount = "";

  if (typeof search.bookmarks !== "undefined") {
    bookmarks = search.bookmarks.toString();
  }

  if (typeof search.characterNames !== "undefined") {
    characterNames = search.characterNames
      .map((name) => {
        return name.replaceAll(" ", "+");
      })
      .join("%2C");
  }

  if (typeof search.comments !== "undefined") {
    comments = search.comments.toString();
  }

  if (typeof search.complete !== "undefined") {
    if (search.complete) {
      complete = "T";
    } else {
      complete = "F";
    }
  }

  if (typeof search.creators !== "undefined") {
    creators = search.creators
      .map((name) => {
        return name.replaceAll(" ", "+");
      })
      .join("%2C");
  }

  if (typeof search.crossover !== "undefined") {
    if (search.crossover) {
      crossover = "T";
    } else {
      crossover = "F";
    }
  }

  if (typeof search.fandoms !== "undefined") {
    fandoms = search.fandoms
      .map((name) => {
        return name.replaceAll(" ", "+");
      })
      .join("%2C");
  }

  if (typeof search.freeforms !== "undefined") {
    freeforms = search.freeforms
      .map((name) => {
        return name.replaceAll(" ", "+");
      })
      .join("%2C");
  }

  if (typeof search.hits !== "undefined") {
    hits = search.hits.toString();
  }

  if (typeof search.kudos !== "undefined") {
    kudos = search.kudos.toString();
  }

  if (typeof search.languageCode !== "undefined") {
    language = search.languageCode;
  }

  if (typeof search.query !== "undefined") {
    query = search.query;
  }

  if (typeof search.rating !== "undefined") {
    rating = search.rating;
  }

  if (typeof search.relationships !== "undefined") {
    relationships = search.relationships
      .map((name) => {
        return name.replaceAll(" ", "+");
      })
      .join("%2C");
  }

  if (typeof search.revisedAt !== "undefined") {
    revisedAt = search.revisedAt;
  }

  if (typeof search.singleChapter !== "undefined") {
    if (search.singleChapter) {
      singleChapter = "1";
    } else {
      singleChapter = "0";
    }
  }

  if (typeof search.sortBy !== "undefined") {
    sortBy = search.sortBy;
  }

  if (typeof search.sortDirection !== "undefined") {
    sortDirection = search.sortDirection;
  }

  if (typeof search.title !== "undefined") {
    title = search.title;
  }

  if (typeof search.wordCount !== "undefined") {
    wordCount = search.wordCount.toString();
  }

  let searchstring = `%5Bbookmarks_count%5D=${bookmarks}&work_search%5Bcharacter_names%5D=${characterNames}&work_search%5Bcomments_count%5D=${comments}&work_search%5Bcomplete%5D=${complete}&work_search%5Bcreators%5D=${creators}&work_search%5Bcrossover%5D=${crossover}&work_search%5Bfandom_names%5D=${fandoms}&work_search%5Bfreeform_names%5D=${freeforms}&work_search%5Bhits%5D=${hits}&work_search%5Bkudos_count%5D=${kudos}&work_search%5Blanguage_id%5D=${language}&work_search%5Bquery%5D=${query}&work_search%5Brating_ids%5D=${rating}&work_search%5Brelationship_names%5D=${relationships}&work_search%5Brevised_at%5D=${revisedAt}&work_search%5Bsingle_chapter%5D=${singleChapter}&work_search%5Bsort_column%5D=${sortBy}&work_search%5Bsort_direction%5D=${sortDirection}&work_search%5Btitle%5D=${title}&work_search%5Bword_count%5D=${wordCount}`;

  let searchurl = `${baseurl}${searchstring}`.replaceAll(" ", "+");

  axios.defaults.headers.common["User-Agent"] = "Axios/1.3.5 ao3-toolkit bot";
  let res = await axios.get(searchurl, ao3.defaults.axios);

  ao3.getSuccess(res);

  let firstLoadContent = res.data;

  let $ = cheerio.load(firstLoadContent);

  //Get the number of history pages
  let navLength = ao3.getPageNumber($);

  return { index, navLength, result: parseSearchList($) };
}

export function parseSearchList($: cheerio.CheerioAPI) {
  let works = $("li[role='article']").toArray();

  let parsed: any = [];
  works.forEach((currentWork) => {
    parsed.push(parseSearchWork(currentWork));
  });

  return new ao3.WorkList(parsed);
}

function parseSearchWork(currentWork: cheerio.Element) {
  let $ = cheerio.load(currentWork);

  let id: number = parseInt(currentWork.attribs.id.replace("work_", ""));

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
        chaptersWritten: parseInt($(".stats dd.chapters").text().split("/")[0]),
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
              .replaceAll("/", "*s*")}/works`,
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
    language: $("dd.language").text().replaceAll("\n", "").trim(),
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

  return new ao3.Work(info);
}
