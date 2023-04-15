import ao3 from "..";

/**
 * Base class for works. Stores information about the work as well as the content.
 */
export class Work {
  #content;
  #info;
  #history;

  constructor(
    info: ao3.Info,
    content?: ao3.Content,
    history?: ao3.WorkHistory
  ) {
    this.#content = content;
    this.#info = info;
    this.#history = history;

    if (typeof this.#history !== "undefined") {
      this.#history.ratio =
        this.#history.timesVisited / info.stats.chapters.chaptersWritten;

      this.#history.wordsRead = info.stats.words * this.#history.ratio;
    }
  }

  get content() {
    return this.#content;
  }

  get info() {
    return this.#info;
  }

  get history() {
    return this.#history;
  }
}

export class WorkList {
  #works;

  constructor(works: ao3.Work[]) {
    this.#works = works;
  }

  get works() {
    return this.#works;
  }

  sortByHits() {
    this.#works.sort((a: ao3.Work, b: ao3.Work) => {
      return a.info.stats.hits - b.info.stats.hits;
    });
  }

  sortByWords() {
    this.#works.sort((a: ao3.Work, b: ao3.Work) => {
      return a.info.stats.words - b.info.stats.words;
    });
  }

  sortByKudos() {
    this.#works.sort((a: ao3.Work, b: ao3.Work) => {
      return a.info.stats.kudos - b.info.stats.kudos;
    });
  }

  sortByBookmarks() {
    this.#works.sort((a: ao3.Work, b: ao3.Work) => {
      return a.info.stats.bookmarks - b.info.stats.bookmarks;
    });
  }

  sortByChaptersWritten() {
    this.#works.sort((a: ao3.Work, b: ao3.Work) => {
      return (
        a.info.stats.chapters.chaptersWritten -
        b.info.stats.chapters.chaptersWritten
      );
    });
  }

  sortByChaptersMax() {
    this.#works.sort((a: ao3.Work, b: ao3.Work) => {
      return (
        a.info.stats.chapters.chaptersMax - b.info.stats.chapters.chaptersMax
      );
    });
  }

  sortByCollectionNumber() {
    this.#works.sort((a: ao3.Work, b: ao3.Work) => {
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
        aNum = a.info.collections.length;
      }

      if (typeof b.info.collections == "number") {
        bNum = b.info.collections;
      } else if (typeof b.info.collections !== "undefined") {
        bNum = b.info.collections.length;
      }

      return aNum - bNum;
    });
  }

  sortByChaptersTagNumber() {
    this.#works.sort((a: ao3.Work, b: ao3.Work) => {
      return a.info.tags.length - b.info.tags.length;
    });
  }

  sortByRelationshipNumber() {
    this.#works.sort((a: ao3.Work, b: ao3.Work) => {
      return a.info.relationships.length - b.info.relationships.length;
    });
  }

  sortByCharacterNumber() {
    this.#works.sort((a: ao3.Work, b: ao3.Work) => {
      return a.info.characters.length - b.info.characters.length;
    });
  }

  sortByTitle() {
    this.#works.sort((a: ao3.Work, b: ao3.Work) => {
      let fa = a.info.title.toLowerCase(),
        fb = b.info.title.toLowerCase();

      if (fa < fb) {
        return -1;
      }
      if (fa > fb) {
        return 1;
      }
      return 0;
    });
  }

  sortByAuthor() {
    this.#works.sort((a: ao3.Work, b: ao3.Work) => {
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
    this.#works.sort((a: ao3.Work, b: ao3.Work) => {
      let fa = a.info.fandom[0].fandomName.toLowerCase(),
        fb = b.info.fandom[0].fandomName.toLowerCase();

      if (fa < fb) {
        return -1;
      }
      if (fa > fb) {
        return 1;
      }
      return 0;
    });
  }

  sortByLastRead() {
    this.#works.sort((a: ao3.Work, b: ao3.Work) => {
      if (typeof a.history == "undefined" || typeof b.history == "undefined") {
        if (
          typeof a.history == "undefined" &&
          typeof b.history !== "undefined"
        ) {
          return -1;
        }

        if (
          typeof b.history == "undefined" &&
          typeof a.history !== "undefined"
        ) {
          return 1;
        }

        if (
          typeof a.history == "undefined" &&
          typeof b.history == "undefined"
        ) {
          return 0;
        } else if (
          typeof a.history !== "undefined" &&
          typeof b.history !== "undefined"
        ) {
          let da = a.history.lastVisit.getTime(),
            db = b.history.lastVisit.getTime();
          return da - db;
        }
      }
      return 0;
    });
  }

  sortByTimesVisited() {
    this.#works.sort((a: ao3.Work, b: ao3.Work) => {
      if (typeof a.history == "undefined" || typeof b.history == "undefined") {
        if (
          typeof a.history == "undefined" &&
          typeof b.history !== "undefined"
        ) {
          return -1;
        }

        if (
          typeof b.history == "undefined" &&
          typeof a.history !== "undefined"
        ) {
          return 1;
        }

        if (
          typeof a.history == "undefined" &&
          typeof b.history == "undefined"
        ) {
          return 0;
        } else if (
          typeof a.history !== "undefined" &&
          typeof b.history !== "undefined"
        ) {
          let da = a.history.timesVisited,
            db = b.history.timesVisited;
          return da - db;
        }
      }
      return 0;
    });
  }

  sortByRatio() {
    this.#works.sort((a: ao3.Work, b: ao3.Work) => {
      if (typeof a.history == "undefined" || typeof b.history == "undefined") {
        if (
          typeof a.history == "undefined" &&
          typeof b.history !== "undefined"
        ) {
          return -1;
        }

        if (
          typeof b.history == "undefined" &&
          typeof a.history !== "undefined"
        ) {
          return 1;
        }

        if (
          typeof a.history == "undefined" &&
          typeof b.history == "undefined"
        ) {
          return 0;
        } else if (
          typeof a.history !== "undefined" &&
          typeof b.history !== "undefined"
        ) {
          let da = a.history.ratio,
            db = b.history.ratio;
          return da - db;
        }
      }
      return 0;
    });
  }

  sortByWordsRead() {
    this.#works.sort((a: ao3.Work, b: ao3.Work) => {
      if (typeof a.history == "undefined" || typeof b.history == "undefined") {
        if (
          typeof a.history == "undefined" &&
          typeof b.history !== "undefined"
        ) {
          return -1;
        }

        if (
          typeof b.history == "undefined" &&
          typeof a.history !== "undefined"
        ) {
          return 1;
        }

        if (
          typeof a.history == "undefined" &&
          typeof b.history == "undefined"
        ) {
          return 0;
        } else if (
          typeof a.history !== "undefined" &&
          typeof b.history !== "undefined"
        ) {
          let da = a.history.wordsRead,
            db = b.history.wordsRead;
          return da - db;
        }
      }
      return 0;
    });
  }
}
