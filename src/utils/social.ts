import ao3 from "..";
import axios, { AxiosResponse } from "axios";
import * as cheerio from "cheerio";

/**
 * get all the users that kudosed a work
 *
 * @param id work id
 * @returns
 */
export async function getKudos(id: number) {
  let $: cheerio.CheerioAPI = await ao3.getParsableInfoData(id);

  let moreLink = ao3.linkToAbsolute($("#kudos_more_link").attr("href"));

  console.log(moreLink);

  let initialLoad = await axios.get(moreLink, ao3.defaults.axios);

  const navLength = ao3.getPageNumber(cheerio.load(initialLoad.data));
  console.log(navLength);

  let resolvedKudosPages: AxiosResponse<any, any>[] = [];

  let batchlength = ao3.defaults.batch;
  let batchbase = 1;

  for (let i = 0; i <= navLength; i++) {
    const pageUrl = `https://archiveofourown.org/works/19865440/kudos?before=4967066680&page=${i}`;

    if (batchbase == batchlength) {
      await ao3.delay(1500);
      batchbase = 1;
    }

    console.log("getting Page " + i);

    try {
      let loadedpage = await axios.get(pageUrl, ao3.defaults.axios);
      ao3.getSuccess(loadedpage);
      resolvedKudosPages.push(loadedpage);
      batchbase++;
    } catch (error) {
      console.error(
        `Problems while loading page ${i} of the kudos of work ${id}. This could be because there were to many requests.!`
      );
    }
  }

  let kudos: { username: string; userLink: string }[] = [];

  resolvedKudosPages.forEach((res) => {
    let page = res.data;

    let $ = cheerio.load(page);
    let users = $("#kudos a").toArray();

    users.forEach((user) => {
      let $ = cheerio.load(user);
      kudos.push({
        username: $("a").text(),
        userLink: ao3.linkToAbsolute($("a").attr("href")),
      });
    });
  });

  return kudos;
}
