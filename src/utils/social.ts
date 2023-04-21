import ao3 from "..";
import axios from "axios";
import * as cheerio from "cheerio";

export async function getKudos(id: number) {
  let $: cheerio.CheerioAPI = await ao3.getParsableInfoData(id);

  let moreLink = $("#kudos_more_link").attr("href");

  while (typeof moreLink !== "undefined") {
    moreLink = $("#kudos_more_link").attr("href");
    console.log(moreLink);
  }
}
