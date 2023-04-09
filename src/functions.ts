import { Fanfiction, historyFanfiction } from "./ao3-toolkit";
import { Login } from "./login";

import axios from "axios";
import * as cheerio from "cheerio";
import puppeteer from "puppeteer";

export async function getFic(id: string) {
  let url: string = "https://archiveofourown.org/works/" + id;

  //Initial Page Load
  let initialLoad = await axios({
    method: "get",
    url: url,
  });

  let $ = cheerio.load(initialLoad.data);

  let download =
    "https://archiveofourown.org" +
    $(".download").find("li:contains('HTML')").find("a").attr("href");

  //Check for adult Content
  let adultContent = $(
    "p:contains('This work could have adult content. If you proceed you have agreed that you are willing to see such content.')"
  );
  let adult = false;
  if (adultContent.length <= 1) {
    //console.log("adult content");
    adult = true;
    let proceedLink =
      "https://archiveofourown.org" +
      adultContent.next().find("a").first().attr("href");

    let browser = await puppeteer.launch();
    let page = await browser.newPage();
    await page.goto(proceedLink);

    download = await page.$$eval(".download li a", (elements) => {
      return elements[elements.length - 1].href;
    });
  }

  //Download
  //console.log("download Link: " + download);

  let completeDownload = await axios({
    method: "get",
    url: download,
  });

  //Parse Data
  $ = cheerio.load(completeDownload.data);
  let title = $("#preface").find("b").first().text();

  let author = {
    authorName: $("[rel=author]").text(),
    authorLink: $("[rel=author]").attr("href"),
  };

  let fandom = $(".tags dt:contains('Fandom:')")
    .next()
    .filter("dd")
    .find("a")
    .get()
    .map((el) => {
      return {
        fandomName: $(el).text(),
        fandomLink: $(el).attr("href"),
      };
    });

  let stats = $("dt:contains('Stats:')").next().text();
  let words = parseInt(stats.slice(stats.search("Words:") + 7, stats.length));
  let chaptersWritten = parseInt(
    stats.slice(stats.search("Chapters:") + 10, stats.search("/"))
  );

  let chaptersMax = parseInt(
    stats.slice(stats.search("/") + 1, stats.search("Words:"))
  );

  let chapterNumber = {
    chaptersWritten: chaptersWritten,
    chaptersMax: chaptersMax,
  };

  let relationships = $(".tags dt:contains('Relationship:')")
    .next()
    .filter("dd")
    .find("a")
    .get()
    .map((el) => {
      return {
        relationshipName: $(el).text(),
        relationshipLink: $(el).attr("href"),
      };
    });

  let characters = $(".tags dt:contains('Character:')")
    .next()
    .filter("dd")
    .find("a")
    .get()
    .map((el) => {
      return {
        characterName: $(el).text(),
        characterLink: $(el).attr("href"),
      };
    });

  let rating = {
    ratingName: $(".tags dt:contains('Rating:')").next().text(),
    ratingLink: $(".tags dt:contains('Rating:')").next().find("a").attr("href"),
  };

  let archiveWarnings = $(".tags dt:contains('Archive Warning:')")
    .next()
    .filter("dd")
    .find("a")
    .get()
    .map((el) => {
      return {
        warningName: $(el).text(),
        warningLink: $(el).attr("href"),
      };
    });

  let categories = $(".tags dt:contains('Category:')")
    .next()
    .filter("dd")
    .find("a")
    .get()
    .map((el) => {
      return {
        categoryName: $(el).text(),
        categoryLink: $(el).attr("href"),
      };
    });

  let tags = $(".tags dt:contains('Additional Tags:')")
    .next()
    .filter("dd")
    .find("a")
    .get()
    .map((el) => {
      return {
        tagName: $(el).text(),
        tagLink: $(el).attr("href"),
      };
    });

  let language = $(".tags dt:contains('Language:')").next().text();

  let seriesName = $(".tags dt:contains('Series:')").next().find("a").text();

  let seriesPart = parseInt(
    $(".tags dt:contains('Series:')")
      .next()
      .text()
      .replace(seriesName, "")
      .replace(/\D/g, "")
  );

  let series = {
    seriesName: seriesName,
    seriesLink: $(".tags dt:contains('Series:')").next().find("a").attr("href"),
    seriesPart: seriesPart,
  };

  let collections = $(".tags dt:contains('Collections:')")
    .next()
    .filter("dd")
    .find("a")
    .get()
    .map((el) => {
      return {
        collectionName: $(el).text(),
        collectionLink: $(el).attr("href"),
      };
    });

  let summary = $("#preface p:contains('Summary')").next().text();

  let preNote = $("#preface p:contains('Notes')").next().text();

  let endNote = $("#endnotes").find("blockquote").text();

  let chapters = $("#chapters")
    .find(".meta")
    .get()
    .map((chapter) => {
      return {
        chapterTitle: $(chapter).find(".heading").text(),
        chapterSummary: $(chapter)
          .find("p:contains('Chapter Summary')")
          .next()
          .text(),
        chapterNotes: $(chapter)
          .find("p:contains('Chapter Notes')")
          .next()
          .text(),

        chapterContent: $(chapter).next().html(),
      };
    });

  //Create Fic Object
  return new Fanfiction(
    title,
    parseInt(id),
    author,
    fandom,
    words,
    chapterNumber,
    relationships,
    characters,
    rating,
    archiveWarnings,
    categories,
    tags,
    language,
    series,
    collections,
    summary,
    preNote,
    endNote,
    chapters,
    adult
  );
}

export interface historyFic {
  id: number;
  lastVisit: Date;
  timesVisited: number;
}

export async function getHistory(logindata: Login) {
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

  let userHistory: Array<historyFic> = [];

  for (let i = 2; i < navLength; i++) {
    console.log("Scanning Page " + i);

    let newPage = await browser.newPage();

    await newPage.goto(
      "https://archiveofourown.org/users/capmaennle/readings?page=" + i
    );

    await newPage.waitForSelector("#footer");

    let content = await newPage.content();

    await newPage.close();

    let $ = cheerio.load(content);

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
  }
  return userHistory;
}
