import { Login } from "../types/base.js";

import { AxiosInstance, AxiosResponse } from "axios";
import * as cheerio from "cheerio";
import { historyWork } from "../types/works.js";

/**
 *
 * @param logindata a logindata object containing a username
 * @param instance an axios instance logged in to ao3
 * @returns a new user userhistory object
 */
export async function getHistory(
  logindata: Login,
  instance: AxiosInstance | undefined
) {
  if (typeof instance == "undefined") {
    throw new Error(
      "instance is undefined. wait for the instance to be resolved (execute ao3.login() on this instance) and then execute code"
    );
  }

  let history = await instance.get(
    `/users/${encodeURIComponent(logindata.username)}/readings`
  );

  let userHistory: Array<historyWork> = [];

  let firstLoadContent = history.data;

  let $ = cheerio.load(firstLoadContent);

  let navLength = parseInt($(".pagination li").not(".next").last().text());

  let historypages: Promise<AxiosResponse<any, any>>[] = [];

  for (let i = 1; i < 5; i++) {
    console.log("getting Page " + i);

    historypages.push(
      instance.get(
        `/users/${encodeURIComponent(logindata.username)}/readings?page=${i}`
      )
    );
  }

  let resolvedHistoryPages = await Promise.all(historypages);

  resolvedHistoryPages.forEach((res) => {
    let page = res.data;
    let $ = cheerio.load(page);
    let works = $("li[role='article']").toArray();

    works.forEach((currentWork) => {
      let $ = cheerio.load(currentWork);
      let isdeleted = false;

      isdeleted = currentWork.attribs.class.includes("deleted");

      if (isdeleted) {
        return;
      }

      let id: number = parseInt(currentWork.attribs.id.replace("work_", ""));

      let viewedText: string = $("h4.viewed.heading")
        .text()
        .replace("Last visited: ", "")
        .trim();

      let lastindex: number = viewedText.indexOf("(");

      let lastsub: string = viewedText.substring(0, lastindex).trim();

      let lastVisit: Date = new Date(lastsub);

      let visitedindex = viewedText.indexOf("Visited");

      let visitedsub: any = viewedText.substring(visitedindex);

      let timesVisited: number;

      if (visitedsub.includes("once")) {
        timesVisited = 1;
      } else {
        timesVisited = parseInt(visitedsub.match(/(\d+)/)[0]);
      }

      let historyElement: historyWork = {
        id: id,
        lastVisit: lastVisit,
        timesVisited: timesVisited,
      };

      userHistory.push(historyElement);
    });
  });

  //Load Content

  return userHistory;
}
