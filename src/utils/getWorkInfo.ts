import * as cheerio from "cheerio";

import WorkInfo from "../classes/ClassWorkInfo";
import { getParsableInfodata, linkToAbsolute } from "./helpers";
import {
  ArchiveWarning,
  Category,
  Character,
  Collection,
  Fandom,
  Language,
  Rating,
  Relationship,
  SeriesInfo,
  Summary,
  Tag,
  Title,
} from "../interfaces/InterfaceWorkInfo";
import User from "../classes/ClassUser";

/**
 *
 * @param input - either a work id in form of a mumber or a parsable {@link cheerio.CheerioAPI} Object
 * @returns - the {@link WorkInfo} of the corresponding work
 */
export default async function getWorkInfo(
  input: number | cheerio.CheerioAPI
): Promise<WorkInfo> {
  const work = await getParsableInfodata(input);

  const parseFuntions = [
    getTitle(work),
    getAuthor(work),
    getFandom(work),
    getRelationship(work),
    getCharacter(work),
    getRating(work),
  ];

  return Object.assign(await Promise.all(parseFuntions));
}

/**
 *
 * @param input - either a work id in form of a number or a parsable {@link cheerio.CheerioAPI} Object
 * @returns - {@link Title} object containing the title of the work
 */
export async function getTitle(
  input: number | cheerio.CheerioAPI
): Promise<Title> {
  const $ = await getParsableInfodata(input);
  return { title: $(".preface").find(".title").first().text().trim() };
}

/**
 *
 * @param input - either a work id in form of a number or a parsable {@link cheerio.CheerioAPI} Object
 * @returns - Array of {@link User} objects containing information about the authors of the work
 */
export async function getAuthor(
  input: number | cheerio.CheerioAPI
): Promise<User[]> {
  const $ = await getParsableInfodata(input);

  return $("[rel=author]")
    .get()
    .map((el: cheerio.Element) => {
      return new User({
        username: $(el).text(),
        userLink: linkToAbsolute($(el).attr("href")),
      });
    });
}

/**
 *
 * @param input - either a work id in form of a number or a parsable {@link cheerio.CheerioAPI} Object
 * @returns - Array of {@link Fandom} objects cotaining information about the fandoms associated with the work
 */
export async function getFandom(
  input: number | cheerio.CheerioAPI
): Promise<Fandom[]> {
  const $ = await getParsableInfodata(input);
  return $(".fandom a")
    .get()
    .map((el: cheerio.Element) => {
      return {
        fandomName: $(el).text(),
        fandomLink: linkToAbsolute($(el).attr("href")),
      };
    });
}

/**
 *
 * @param input - either a work id in form of a number or a parsable {@link cheerio.CheerioAPI} Object
 * @returns - Array of {@link Relationship} objects cotaining information about the fandoms associated with the work
 */
export async function getRelationship(
  input: number | cheerio.CheerioAPI
): Promise<Relationship[]> {
  const $: cheerio.CheerioAPI = await getParsableInfodata(input);

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

/**
 *
 * @param input - either a work id in form of a number or a parsable {@link cheerio.CheerioAPI} Object
 * @returns - Array of {@link Character} objects cotaining information about the fandoms associated with the work
 */
export async function getCharacter(
  input: number | cheerio.CheerioAPI
): Promise<Character[]> {
  const $: cheerio.CheerioAPI = await getParsableInfodata(input);

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

/**
 *
 * @param input - either a work id in form of a number or a parsable {@link cheerio.CheerioAPI} Object
 * @returns - {@link Rating} object detailing the rating of the work
 */
export async function getRating(
  input: number | cheerio.CheerioAPI
): Promise<Rating> {
  const $: cheerio.CheerioAPI = await getParsableInfodata(input);

  return {
    rating: {
      ratingName: $("dd.rating").text().trim(),
      ratingLink: linkToAbsolute($("dd.rating").find("a").attr("href")),
    },
  };
}

/**
 *
 * @param input - either a work id in form of a number or a parsable {@link cheerio.CheerioAPI} Object
 * @returns - Array of {@link ArchiveWarning} objects cotaining information about the warnings associated with the work
 */
export async function getArchiveWarnings(
  input: number | cheerio.CheerioAPI
): Promise<ArchiveWarning[]> {
  const $: cheerio.CheerioAPI = await getParsableInfodata(input);

  //Update for warnings!!!
  return $(".relationship")
    .next()
    .find("a")
    .get()
    .map((el) => {
      return {
        warningName: $(el).text(),
        warningLink: linkToAbsolute($(el).attr("href")),
      };
    });
}

/**
 *
 * @param input - either a work id in form of a number or a parsable {@link cheerio.CheerioAPI} Object
 * @returns - Array of {@link Category} objects cotaining information about the categories associated with the work
 */
export async function getCategories(
  input: number | cheerio.CheerioAPI
): Promise<Category[]> {
  const $: cheerio.CheerioAPI = await getParsableInfodata(input);

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

/**
 *
 * @param input - either a work id in form of a number or a parsable {@link cheerio.CheerioAPI} Object
 * @returns - Array of {@link Tag} objects cotaining information about the tags associated with the work
 */
export async function getTags(
  input: number | cheerio.CheerioAPI
): Promise<Tag[]> {
  const $: cheerio.CheerioAPI = await getParsableInfodata(input);

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

/**
 *
 * @param input - either a work id in form of a number or a parsable {@link cheerio.CheerioAPI} Object
 * @returns - {@link Language} object containing the language of the work
 */
export async function getLanguage(
  input: number | cheerio.CheerioAPI
): Promise<Language> {
  const $: cheerio.CheerioAPI = await getParsableInfodata(input);

  return {
    language: $(".language").first().next().text().replace("\n", "").trim(),
  };
}

/**
 *
 * @param input - either a work id in form of a number or a parsable {@link cheerio.CheerioAPI} Object
 * @returns - Array of {@link SeriesInfo} objects cotaining information about the series associated with the work
 */
export async function getSeries(
  input: number | cheerio.CheerioAPI
): Promise<SeriesInfo[]> {
  const $: cheerio.CheerioAPI = await getParsableInfodata(input);

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

/**
 *
 * @param input - either a work id in form of a number or a parsable {@link cheerio.CheerioAPI} Object
 * @returns - Array of {@link Collection} objects cotaining information about the series associated with the work
 */
export async function getCollections(
  input: number | cheerio.CheerioAPI
): Promise<Collection[]> {
  const $: cheerio.CheerioAPI = await getParsableInfodata(input);

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

/**
 *
 * @param input - either a work id in form of a number or a parsable {@link cheerio.CheerioAPI} Object
 * @returns - {@link Summary} object containing the language of the work
 */
export async function getSummary(
  input: number | cheerio.CheerioAPI
): Promise<Summary> {
  const $: cheerio.CheerioAPI = await getParsableInfodata(input);

  let summaryArray = $(".summary blockquote")
    .find("p")
    .get()
    .map((el) => {
      return $(el).text();
    });

  return { summary: summaryArray.join("\n") };
}
