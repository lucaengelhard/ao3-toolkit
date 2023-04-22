import { Listtype } from "../enums.js";
import type { UserInfo } from "../types.d.ts";
import { WorkList } from "./works.js";

export class User {
  #info;
  #stats?;
  #works?;
  #lists?;
  constructor(info: UserInfo, works: WorkList, lists: WorkList[]) {
    this.#info = info;
    this.#works = works;
    this.#lists = lists;

    let historycheck = false;
    let historyList: WorkList | undefined = undefined;
    this.#lists.forEach((list) => {
      if (list.context == Listtype.History && historycheck == false) {
        historycheck = true;
        historyList = list;
      }
    });

    if (typeof historyList !== "undefined") {
      let list: WorkList = historyList;

      let wordsRead = 0;
      let worksRead = list.works.length;

      let stats = { wordsRead, worksRead };
      list.works.forEach((work) => {
        if (typeof work.userdata?.history?.wordsRead !== "undefined") {
          wordsRead = wordsRead + work.userdata?.history?.wordsRead;
        }
      });

      this.#stats = stats;
    } else {
      this.#stats = undefined;
    }
  }

  get info() {
    return this.#info;
  }

  get stats() {
    return this.#stats;
  }

  get works() {
    return this.#works;
  }

  get lists() {
    return this.#lists;
  }
}
