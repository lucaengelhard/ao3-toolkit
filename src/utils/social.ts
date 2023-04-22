import axios, { AxiosResponse } from "axios";
import * as cheerio from "cheerio";
import {
  delay,
  getPageNumber,
  getParsableInfoData,
  getSuccess,
  linkToAbsolute,
} from "./helper.js";
import { defaults } from "../config/defaults.js";
import type { UserInfo } from "../interfaces.js";

/**
 * get all the users that kudosed a work
 *
 * @param id work id
 * @returns
 */
export async function getKudos(id: number) {
  let $: cheerio.CheerioAPI = await getParsableInfoData(id);

  let moreLink = linkToAbsolute($("#kudos_more_link").attr("href"));

  console.log(moreLink);

  let initialLoad = await axios.get(moreLink, defaults.axios);

  const navLength = getPageNumber(cheerio.load(initialLoad.data));
  console.log(navLength);

  let resolvedKudosPages: AxiosResponse<any, any>[] = [];

  let batchlength = defaults.batch;
  let batchbase = 1;

  for (let i = 0; i <= navLength; i++) {
    const pageUrl = `https://archiveofourown.org/works/19865440/kudos?before=4967066680&page=${i}`;

    if (batchbase == batchlength) {
      await delay(1500);
      batchbase = 1;
    }

    console.log("getting Page " + i);

    try {
      let loadedpage = await axios.get(pageUrl, defaults.axios);
      getSuccess(loadedpage);
      resolvedKudosPages.push(loadedpage);
      batchbase++;
    } catch (error) {
      console.error(
        `Problems while loading page ${i} of the kudos of work ${id}. This could be because there were to many requests.!`
      );
    }
  }

  let kudos: UserInfo[] = [];

  resolvedKudosPages.forEach((res) => {
    let page = res.data;

    let $ = cheerio.load(page);
    let users = $("#kudos a").toArray();

    users.forEach((user) => {
      let $ = cheerio.load(user);
      kudos.push({
        username: $("a").text(),
        userLink: linkToAbsolute($("a").attr("href")),
      });
    });
  });

  return kudos;
}
