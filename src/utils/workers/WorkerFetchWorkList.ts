import { AxiosInstance, AxiosResponse } from "axios";
import { axiosDefaults } from "../../config/axiosDefaults";
import { PageSpan } from "../../interfaces/InterfaceWorkList";
import { delay, getAxiosSuccess } from "../helpers";
import { parentPort } from "worker_threads";

parentPort?.on(
  "message",
  async (postData: {
    instance: AxiosInstance;
    firstUrl: string;
    navLength: number;
    pageSpan: PageSpan | number | undefined;
  }) => {
    console.log(postData);

    const { instance, firstUrl, navLength, pageSpan } = postData;

    const batchlength = axiosDefaults.batch;
    let batchbase = 1;

    const cleanedPageSpan = definePageSpan(pageSpan, navLength);

    for (let i = 1; i <= cleanedPageSpan.end; i++) {
      //Check if page should be included
      if (i < cleanedPageSpan.start || i > cleanedPageSpan.end) {
        continue;
      }
      if (cleanedPageSpan.exclude?.includes(i)) {
        continue;
      }

      //check if another request should be made or if there should be a delay (ao3 sometimes blocks an ip after to many requests)
      if (batchbase == batchlength) {
        await delay(1500);
        batchbase = 1;
      }

      //Load Page
      const loadedPage = await loadListPage(instance, i, firstUrl);

      try {
        getAxiosSuccess(loadedPage);
      } catch (error) {
        console.error(
          `Problems while loading page ${i}. This could be because there were to many requests.!`
        );
        continue;
      }

      parentPort?.postMessage({ loadedPage, i });
      batchbase++;
    }
    parentPort?.postMessage("done");
  }
);

async function loadListPage(
  instance: AxiosInstance,
  pageIndex: number,
  firstUrl: string
): Promise<AxiosResponse<any, any>> {
  return await instance(`${firstUrl}?page=${pageIndex}`, {
    headers: axiosDefaults.axios.headers,
  });
}

function instaceOfPageSpan(span: any): span is PageSpan {
  return span;
}

function instaceOfPageArray(span: any): span is number[] {
  return span;
}

function definePageSpan(
  pageSpan: PageSpan | number | undefined,
  navLength: number
): PageSpan {
  //If the span is only a number return that number of pages starting from  page 0
  if (typeof pageSpan === "number") {
    return { start: 0, end: pageSpan };
  }

  //If the span is of type PageSpan return it
  if (instaceOfPageSpan(pageSpan) && pageSpan.hasOwnProperty("start")) {
    if (typeof pageSpan.start == "undefined") {
      pageSpan.start = 0;
    }

    if (typeof pageSpan.end == "undefined") {
      pageSpan.end = navLength;
    }

    return pageSpan;
  }

  return { start: 0, end: navLength };
}
