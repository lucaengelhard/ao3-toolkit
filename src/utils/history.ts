import { Login } from "../types/base.js";

import axios, { AxiosInstance } from "axios";
import * as cheerio from "cheerio";

export interface historyFic {
  id: number;
  lastVisit: Date;
  timesVisited: number;
}

export async function getHistory(
  logindata: Login,
  instance: AxiosInstance | undefined
) {
  /*
  let historyURLinit: string =
    "https://archiveofourown.org/users/" +
    logindata.username +
    "/readings?page=1";

  let browser = await puppeteer.launch({ headless: true });
  let page = await browser.newPage();
  await page.goto(historyURLinit);

  //get number of pages
  //open new page for each number
  //download ids + visited data

  await page.click("#login-dropdown");
  await page.click("#user_remember_me_small");

  await page.waitForSelector("#user_session_login_small");
  await page.type("#user_session_login_small", logindata.username);

  await page.waitForSelector("#user_session_password_small");
  await page.type("#user_session_password_small", logindata.password);

  await page.keyboard.press("Enter");

  await page.waitForSelector("#footer");

  let navLength = await page.$$eval(".pagination li", (elements) => {
    let lastNumber: number;
    if (elements[elements.length - 1].classList.contains("next")) {
      lastNumber = parseInt(elements[elements.length - 2].innerText);
      return lastNumber;
    } else {
      lastNumber = parseInt(elements[elements.length - 1].innerText);
      return lastNumber;
    }
  });

  

  for (let i = 2; i < navLength; i++) {
    

    let newPage = await browser.newPage();

    await newPage.goto(
      "https://archiveofourown.org/users/capmaennle/readings?page=" + i
    );

    await newPage.waitForSelector("#footer");

    let content = await newPage.content();

    await newPage.close();
*/
  if (typeof instance == "undefined") {
    throw new Error(
      "instance is undefined. wait for the instance to be resolved and then execute code"
    );
  }

  let history = await instance.get(`/users/${logindata.username}/readings`);

  let userHistory: Array<historyFic> = [];

  let firstLoadContent = history.data;

  let $ = cheerio.load(firstLoadContent);

  let navLength = parseInt($(".pagination li").not(".next").last().text());

  let historypages = [];

  for (let i = 1; i < navLength; i++) {
    console.log("getting Page " + i);

    historypages.push(
      instance.get(`/users/${logindata.username}/readings?page=${i}`)
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

      let historyElement: historyFic = {
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
