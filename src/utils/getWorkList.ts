import { AxiosInstance, AxiosResponse } from "axios";
import * as cheerio from "cheerio";
import { Worker } from "worker_threads";

import { Login } from "../interfaces/InterfaceUserData";
import { Listtype } from "../enums/EnumWorkLists";
import { PageSpan } from "../interfaces/InterfaceWorkList";
import { getAxiosSuccess, getPageNumber } from "./helpers";
import WorkList from "../classes/ClassWorkList";
import Work from "../classes/ClassWork";

//TODO: Write Docs
export default async function getWorkList(
  logindata: Login,
  instance: AxiosInstance | undefined,
  listtype?: Listtype,
  pageSpan?: PageSpan | number
) {
  if (typeof instance == "undefined") {
    throw new Error(
      "instance is undefined. There needs to be a logged in session"
    );
  }

  if (typeof listtype == "undefined") {
    return;
  }
  if (listtype == Listtype.History) {
  }

  if (listtype == Listtype.Bookmarks) {
  }

  let firstUrl = "";
  switch (listtype) {
    case Listtype.History:
      firstUrl = `/users/${encodeURIComponent(logindata.username)}/readings`;
      break;
    case Listtype.Bookmarks:
      firstUrl = `/users/${encodeURIComponent(logindata.username)}/bookmarks`;
      break;
    default:
      throw new Error("Listtype is undefined");
  }

  const firstPage = await instance.get(firstUrl);
  getAxiosSuccess(firstPage);

  const firstLoadContent = firstPage.data;

  const $ = cheerio.load(firstLoadContent);

  //Get the number of history pages
  const navLength = getPageNumber($);

  //Create a worker to download pages
  const LoadWorker = new Worker("./workers/WorkerFetchWorkList.js");
  const postData = {
    instance,
    firstUrl,
    navLength,
    pageSpan,
  };
  LoadWorker.postMessage(postData);
  let doneDownloading = false;

  //create parsing workers
  let concurrentParsingWorkers = 4;
  let parsingWorkers: {
    worker: Worker;
    free: boolean;
  }[] = [];
  for (let i = 0; i <= concurrentParsingWorkers; i++) {
    parsingWorkers[i] = {
      worker: new Worker("./workers/WorkerParseWorkListPage.js"),
      free: true,
    };
  }

  //Wait for all pages to be downloaded and parse them
  let workPagesToParse: { loadedPage: AxiosResponse<any, any>; i: number }[] =
    [];
  let parsedWorkPages: Work[] = [];
  do {
    LoadWorker.on("message", (message) => {
      if (message === "done") {
        doneDownloading = true;
      }
      if (message.hasOwnProperty("loadedPage")) {
        workPagesToParse.push(message.loadedPage);
      }
    });

    //Check if any worker is free and there is a page to parse
    parsingWorkers.forEach((worker) => {
      if (worker.free && workPagesToParse.length) {
        worker.free = false;
        worker.worker.postMessage({
          data: workPagesToParse[0],
          logindata,
          listtype,
        });
        workPagesToParse.shift;
        worker.worker.on("message", (message) => {
          if (message === "error") {
            throw new Error("Error while parsing WorkList Works");
          }
          if (typeof message === "object") {
            message.forEach((work: Work) => {
              parsedWorkPages.push(work);
            });
          }
        });
      }
    });
  } while (!doneDownloading && workPagesToParse.length);

  return new WorkList(parsedWorkPages, listtype);
}
