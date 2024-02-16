import { SortOptions } from "../enums/EnumSortOptions";
import { mergeSort } from "../utils/helpers";
import Work from "./ClassWork";

/**
 * This Class describes a list of works. It includes methods to sort the works by different metrics
 */
export default class WorkList {
  works;
  #context;
  //#cached?: Cached;
  constructor(works: Work[], context?: string) {
    this.works = works;

    this.#context = context;
  }

  /**
   * Sorts the Worklist by the given sorting metric
   * @param sortby - define the metric after which the list should be sorted (defaults to {@link SortOptions.title})
   */
  sort(sortby?: SortOptions) {
    if (!sortby) {
      sortby = SortOptions.title;
    }

    this.works = mergeSort(this.works, sortby);

    return this;
  }

  /*
  

  sortByAuthor() {
    this.works.sort((a: Work, b: Work) => {
      let fa = a.info.author.authorName.toLowerCase(),
        fb = b.info.author.authorName.toLowerCase();

      if (fa < fb) {
        return -1;
      }
      if (fa > fb) {
        return 1;
      }
      return 0;
    });
  }

  sortByFandom() {
    this.works.sort((a: Work, b: Work) => {
      let fa = "";
      try {
        fa = a.info.fandom[0].fandomName.toLowerCase();
      } catch (error) {}

      let fb = "";
      try {
        fb = b.info.fandom[0].fandomName.toLowerCase();
      } catch (error) {}

      if (fa < fb) {
        return -1;
      }
      if (fa > fb) {
        return 1;
      }
      return 0;
    });
  }
  /* 
  sortByCollectionNumber() {
    this.#works.sort((a: Work, b: Work) => {
      let aNum: number = 0;
      let bNum: number = 0;
      if (
        typeof a.info.collections == "undefined" ||
        typeof b.info.collections == "undefined"
      ) {
        if (
          typeof a.info.collections == "undefined" &&
          typeof b.info.collections == "undefined"
        ) {
          return 0;
        }
        if (
          typeof a.info.collections == "undefined" &&
          typeof b.info.collections !== "undefined"
        ) {
          return -1;
        }

        if (
          typeof b.info.collections == "undefined" &&
          typeof a.info.collections !== "undefined"
        ) {
          return 1;
        }
      }

      if (typeof a.info.collections == "number") {
        aNum = a.info.collections;
      } else if (typeof a.info.collections !== "undefined") {
        try {
          aNum = a.info.collections.length;
        } catch (error) {
          aNum = 0;
        }
      }

      if (typeof b.info.collections == "number") {
        bNum = b.info.collections;
      } else if (typeof b.info.collections !== "undefined") {
        try {
          bNum = b.info.collections.length;
        } catch (error) {
          bNum = 0;
        }
      }

      return aNum - bNum;
    });
  }

 

  

  sortByTimesVisited() {
    this.#works.sort((a: Work, b: Work) => {
      let aNum = 0;
      if (typeof a.history !== "undefined") {
        aNum = a.history.timesVisited;
      }

      let bNum = 0;
      if (typeof b.history !== "undefined") {
        bNum = b.history.timesVisited;
      }

      return aNum - bNum;
    });
  }

  sortByRatio() {
    this.#works.sort((a: Work, b: Work) => {
      let aNum = 0;
      if (typeof a.history !== "undefined") {
        aNum = a.history.ratio;
      }

      let bNum = 0;
      if (typeof b.history !== "undefined") {
        bNum = b.history.ratio;
      }

      return aNum - bNum;
    });
  }

  sortByWordsRead() {
    this.#works.sort((a: Work, b: Work) => {
      let aNum = 0;
      if (typeof a.history !== "undefined") {
        aNum = a.history.wordsRead;
      }

      let bNum = 0;
      if (typeof b.history !== "undefined") {
        bNum = b.history.wordsRead;
      }

      return aNum - bNum;
    });
  }

  save(username?: string) {
    if (typeof username == "undefined") {
      username = logindata.username;
    }

    let context = "undefined"; //Andere Bezeichnung finden?

    if (typeof this.#context !== "undefined") {
      context = this.#context;
    }

    let saved = save(context, username, this);
    this.#cached = { cached: true, index: saved.index };

    return saved;
  }*/
}
