import axios from "axios";
import ao3 from "..";
import * as cheerio from "cheerio";

/**
 * Simple search bar search
 *
 * @param query
 * @param index
 * @returns an object containing the current page number, maximum pages and search results
 */
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

/**
 * More detailed Work search.
 *
 * @param search  {@link ao3.WorkSearch} Object to specify the search parameters
 * @param index
 * @returns an object containing the current page number, maximum pages and search results
 */
export async function advancedWorkSearch(
  search: ao3.WorkSearch,
  index?: number
) {
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

/**
 * More detailed people search.
 *
 * @param search  {@link ao3.PeopleSearch} Object to specify the search parameters
 * @param index
 * @returns an object containing the current page number, maximum pages and search results
 */
export async function advancedPeopleSearch(
  search: ao3.PeopleSearch,
  index?: number
) {
  if (typeof index == "undefined") {
    index = 1;
  }

  let page = "";
  if (!(index == 1 || typeof index == "undefined")) {
    page = `page=${index}&`;
  }

  let baseurl = `https://archiveofourown.org/people/search?commit=Search+People&${page}people_search`;

  let query = "";
  let name = "";
  let fandoms = "";

  if (typeof search.query !== "undefined") {
    query = search.query;
  }

  if (typeof search.name !== "undefined") {
    name = search.name;
  }

  if (typeof search.fandoms !== "undefined") {
    fandoms = search.fandoms
      .map((name) => {
        return name.replaceAll(" ", "+");
      })
      .join("%2C");
  }

  let searchstring = `%5Bquery%5D=${query}&people_search%5Bname%5D=${name}&people_search%5Bfandom%5D=${fandoms}&commit=Search+People`;

  let searchurl = `${baseurl}${searchstring}`.replaceAll(" ", "+");

  let res = await axios.get(searchurl, ao3.defaults.axios);

  ao3.getSuccess(res);

  let firstLoadContent = res.data;

  let $ = cheerio.load(firstLoadContent);

  //Get the number of history pages
  let navLength = ao3.getPageNumber($);

  return { index, navLength, result: parsePeopleSearch($) };

  function parsePeopleSearch($: cheerio.CheerioAPI) {
    let people = $("li[role='article']").toArray();

    let parsed: any = [];
    people.forEach((person) => {
      let $ = cheerio.load(person);
      let user = {
        userName: $("h4 a").last().text(),
        userLink: ao3.linkToAbsolute($("h4 a").last().attr("href"), false),
      };

      let pseud = {
        pseudName: $("h4 a").first().text(),
        pseudLink: ao3.linkToAbsolute($("h4 a").first().attr("href"), false),
      };

      let works = {};
      try {
        works = {
          workNumber: parseInt($("h5 a").first().text().split(" ")[0]),
          workLink: ao3.linkToAbsolute($("h5 a").first().attr("href"), false),
        };
      } catch (error) {}

      if (($("h4 a").toArray().length = 1)) {
        user.userLink = `https://archiveofourown.org/users/${user.userName}`;
      }

      parsed.push({ user, pseud, works });
    });

    return parsed;
  }
}

/**
 * More detailed bookmark search.
 *
 * @param search  {@link ao3.BookmarkSearch} Object to specify the search parameters
 * @param index
 * @returns an object containing the current page number, maximum pages and search results
 */
export async function advancedBookmarkSearch(
  search: ao3.BookmarkSearch,
  index?: number
) {
  if (typeof index == "undefined") {
    index = 1;
  }

  let page = "";
  if (!(index == 1 || typeof index == "undefined")) {
    page = `page=${index}&`;
  }

  let baseurl = `https://archiveofourown.org/bookmarks/search?commit=Search+Bookmarks&${page}`;

  let workQuery = "";
  let workTags = "";
  let workType = "";
  let workLanguage = "";
  let workDateUpdated = "";
  let bookmarkQuery = "";
  let bookmarkTags = "";
  let bookmarker = "";
  let bookmarkNotes = "";
  let rec = "0";
  let withNotes = "0";
  let bookmarkDate = "";
  let sortBy = "";

  if (typeof search.workQuery !== "undefined") {
    workQuery = search.workQuery;
  }

  if (typeof search.workTags !== "undefined") {
    workTags = search.workTags
      .map((name) => {
        return name.replaceAll(" ", "+");
      })
      .join("%2C");
  }

  if (typeof search.workType !== "undefined") {
    workType = search.workType;
  }

  if (typeof search.workLanguage !== "undefined") {
    workLanguage = search.workLanguage;
  }

  if (typeof search.workDateUpdated !== "undefined") {
    workDateUpdated = search.workDateUpdated;
  }

  if (typeof search.bookmarkQuery !== "undefined") {
    bookmarkQuery = search.bookmarkQuery;
  }

  if (typeof search.bookmarkTags !== "undefined") {
    bookmarkTags = search.bookmarkTags
      .map((name) => {
        return name.replaceAll(" ", "+");
      })
      .join("%2C");
  }

  if (typeof search.bookmarker !== "undefined") {
    bookmarker = search.bookmarker;
  }

  if (typeof search.rec !== "undefined") {
    if (search.rec) {
      rec = "1";
    } else {
      rec = "0";
    }
  }

  if (typeof search.withNotes !== "undefined") {
    if (search.withNotes) {
      withNotes = "1";
    } else {
      withNotes = "0";
    }
  }

  if (typeof search.sortBy !== "undefined") {
    sortBy = search.sortBy;
  }

  let searchstring = `bookmark_search%5Bbookmarkable_query%5D=${workQuery}&bookmark_search%5Bother_tag_names%5D=${workTags}&bookmark_search%5Bbookmarkable_type%5D=${workType}&bookmark_search%5Blanguage_id%5D=${workLanguage}&bookmark_search%5Bbookmarkable_date%5D=${workDateUpdated}&bookmark_search%5Bbookmark_query%5D=${bookmarkQuery}&bookmark_search%5Bother_bookmark_tag_names%5D=${bookmarkTags}&bookmark_search%5Bbookmarker%5D=${bookmarker}&bookmark_search%5Bbookmark_notes%5D=${bookmarkNotes}&bookmark_search%5Brec%5D=${rec}&bookmark_search%5Bwith_notes%5D=${withNotes}&bookmark_search%5Bdate%5D=${bookmarkDate}&bookmark_search%5Bsort_column%5D=${sortBy}`;

  let searchurl = `${baseurl}${searchstring}`.replaceAll(" ", "+");

  let res = await axios.get(searchurl, ao3.defaults.axios);

  ao3.getSuccess(res);

  let firstLoadContent = res.data;

  let $ = cheerio.load(firstLoadContent);

  //Get the number of history pages
  let navLength = ao3.getPageNumber($);

  return { index, navLength, result: parseBookmarkSearch($) };

  function parseBookmarkSearch($: cheerio.CheerioAPI) {
    let bookmarks = $("ol li[role='article']").toArray();

    let parsed: any = [];
    bookmarks.forEach((bookmark) => {
      let $ = cheerio.load(bookmark);
      let type = getBookmarkType($);

      if (type == "work") {
        let work = parseSearchWork(bookmark);
        let userdata: ao3.WorkUserData = { bookmark: ao3.parseBookmarkWork($) };
        work.userdata = userdata;
      }

      if (type == "series") {
        let bookmarkdata: ao3.WorkBookmark = ao3.parseBookmarkWork($);
        let id: number = parseInt(
          bookmark.attribs.class.split(" ")[3].replace("series-", "")
        );

        let info: ao3.SeriesFullInfo = {
          title: $(".header h4.heading a").first().text(),
          id: id,
          author: {
            authorName: $("[rel=author]").text(),
            authorLink: ao3.linkToAbsolute(
              $("[rel=author]").attr("href"),
              false
            ),
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
            words: parseInt(
              $(".stats dt:contains('Words')").next().text().replace(",", "")
            ),
            bookmarks: parseInt(
              $(".stats dt:contains('Bookmarks')").next().text()
            ),
            works: parseInt($(".stats dt:contains('Works')").next().text()),
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
            warningLink: ao3.linkToAbsolute(
              $(".warnings a").attr("href"),
              false
            ),
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

          summary: $(".summary p")
            .get()
            .map((el) => {
              return $(el).text();
            })
            .join("\n"),
        };

        parsed.push(new ao3.Series(info, bookmarkdata));
      }

      if (type == "external") {
        let bookmarkdata: ao3.WorkBookmark = ao3.parseBookmarkWork($);
        let id: number = parseInt(bookmark.attribs.id.replace("bookmark_", ""));
        let info = {
          title: $(".heading a").first().text(),
          id: id,
          author: {
            authorName: $("[rel=author]").text(),
            authorLink: ao3.linkToAbsolute(
              $("[rel=author]").attr("href"),
              false
            ),
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
            bookmarks: parseInt($(".stats dd").first().text()),
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
            warningLink: ao3.linkToAbsolute(
              $(".warnings a").attr("href"),
              false
            ),
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

          summary: $(".summary p")
            .get()
            .map((el) => {
              return $(el).text();
            })
            .join("\n"),
        };

        parsed.push(new ao3.ExternalWork(info, bookmarkdata));
      }
    });

    return parsed;

    function getBookmarkType($: cheerio.CheerioAPI) {
      let workbase = "https://archiveofourown.org/works/";
      let seriesbase = "https://archiveofourown.org/series/";
      let externalbase = "https://archiveofourown.org/external_works/";

      let bookmarkUrl = ao3.linkToAbsolute(
        $(".heading a").first().attr("href"),
        false
      );

      if (bookmarkUrl?.includes(workbase)) {
        return "work";
      }

      if (bookmarkUrl?.includes(seriesbase)) {
        return "series";
      }

      if (bookmarkUrl?.includes(externalbase)) {
        return "external";
      }
    }
  }
}

/**
 * More detailed Tag search.
 *
 * @param search  {@link ao3.TagSearch} Object to specify the search parameters
 * @param index
 * @returns an object containing the current page number, maximum pages and search results
 */
export async function advancedTagSearch(search: ao3.TagSearch, index?: number) {
  if (typeof index == "undefined") {
    index = 1;
  }

  let page = "";
  if (!(index == 1 || typeof index == "undefined")) {
    page = `page=${index}&`;
  }

  let baseurl = `https://archiveofourown.org/tags/search?commit=Search+Tags&${page}tag_search`;

  let canonical = "";
  let fandoms = "";
  let name = "";
  let sortBy = "";
  let sortDirection = "";
  let type = "";

  if (typeof search.canonical !== "undefined") {
    if (search.canonical) {
      canonical = "1";
    } else {
      canonical = "0";
    }
  }

  if (typeof search.fandoms !== "undefined") {
    fandoms = search.fandoms
      .map((name) => {
        return name.replaceAll(" ", "+");
      })
      .join("%2C");
  }

  if (typeof search.name !== "undefined") {
    name = search.name;
  }

  if (typeof search.sortBy !== "undefined") {
    sortBy = search.sortBy;
  }

  if (typeof search.sortDirection !== "undefined") {
    sortDirection = search.sortDirection;
  }

  if (typeof search.type !== "undefined") {
    type = search.type;
  }

  let searchstring = `%5Bcanonical%5D=${canonical}&tag_search%5Bfandoms%5D=${fandoms}&tag_search%5Bname%5D=${name}&tag_search%5Bsort_column%5D=${sortBy}&tag_search%5Bsort_direction%5D=${sortDirection}&tag_search%5Btype%5D=${type}`;

  let searchurl = `${baseurl}${searchstring}`.replaceAll(" ", "+");

  let res = await axios.get(searchurl, ao3.defaults.axios);

  ao3.getSuccess(res);

  let firstLoadContent = res.data;

  let $ = cheerio.load(firstLoadContent);

  //Get the number of history pages
  let navLength = ao3.getPageNumber($);

  return { index, navLength, result: parseTagSearch($) };

  function parseTagSearch($: cheerio.CheerioAPI) {
    let tags = $("ol.tag li").toArray();

    let parsed: ao3.SearchedTag[] = [];
    tags.forEach((tag) => {
      let $ = cheerio.load(tag);
      let parsedTag: ao3.SearchedTag = {
        name: $("a").first().text(),
        link: ao3.linkToAbsolute($("a").attr("href"), false),
        type: $("span")
          .text()
          .replace($("a").first().text(), "")
          .replace(":", ""),
      };

      parsed.push(parsedTag);
    });

    return parsed;
  }
}
