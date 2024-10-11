import * as cheerio from "cheerio";
import axios from "axios";

import { getAxiosSuccess, getParsableInfodata } from "./helpers.ts";
import { axiosDefaults } from "../config/axiosDefaults.ts";
import type { WorkContent } from "../types/TypesWorkContent.ts";

/**
 * This function takes a work id or cheerio object, parses the data and returns an object containing the forword, afterword and each chapter
 *
 * @param input - a work id or a cheerio object of the first chapter
 * @returns an object of tyoe {@link WorkContent} containing the forword, afterword and each chapter
 */
export default async function getWorkContent(
  input: number | cheerio.CheerioAPI
): Promise<WorkContent> {
  const work = await getParsableInfodata(input);

  const downloadURL =
    "https://archiveofourown.org" +
    work(".download").find("li:contains('HTML')").find("a").attr("href");

  const initialLoad = await axios.get(downloadURL, axiosDefaults.axios);

  getAxiosSuccess(initialLoad);

  let $content = cheerio.load(initialLoad.data);

  return {
    notes: {
      preNote: await getPreNote($content),
      endNote: await getEndNote($content),
    },

    chapters: $content("#chapters")
      .find(".userstuff")
      .get()
      .map((chapter) => {
        return {
          chapterTitle: $content(chapter).prev().find(".heading").text(),
          chapterSummary: $content(chapter)
            .prev()
            .find("p:contains('Chapter Summary')")
            .next()
            .text(),
          chapterNotes: $content(chapter)
            .prev()
            .find("p:contains('Chapter Notes')")
            .next()
            .text(),

          chapterContent: $content(chapter).html()?.trim(),
        };
      }),
  };

  /**
   *
   * @param - input a cheerio object of the first chapter
   * @returns the foreword of the work
   */
  async function getPreNote(input: cheerio.CheerioAPI) {
    return input("#preface p:contains('Notes')").next().text().trim();
  }

  /**
   *
   * @param - input a cheerio object of the first chapter
   * @returns the afterword of the work
   */
  async function getEndNote(input: cheerio.CheerioAPI) {
    return input("#endnotes").find("blockquote").text().trim();
  }
}
