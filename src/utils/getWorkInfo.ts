import * as cheerio from "cheerio";

import WorkInfo from "../classes/ClassWorkInfo";
import { getParsableInfodata, linkToAbsolute } from "./helpers";
import {
  Author,
  Fandom,
  Relationship,
  Title,
} from "../interfaces/InterfaceWorkInfo";

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
 * @returns - Array of {@link Author} objects containing information about the authors of the work
 */
export async function getAuthor(
  input: number | cheerio.CheerioAPI
): Promise<Author[]> {
  const $ = await getParsableInfodata(input);

  return $("[rel=author]")
    .get()
    .map((el: cheerio.Element) => {
      return {
        authorName: $(el).text(),
        authorLink: linkToAbsolute($(el).attr("href")),
      };
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
  let $: cheerio.CheerioAPI = await getParsableInfodata(input);

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
