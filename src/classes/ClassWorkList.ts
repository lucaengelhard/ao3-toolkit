import Work from "./ClassWork";

export default class WorkList {
  #works;
  #context;
  //#cached?: Cached;
  constructor(works: Work[], context?: string) {
    this.#works = works;

    this.#context = context;
  }

  get works() {
    return this.#works;
  }

  /*
  get cached() {
    return this.#cached;
  }

  get context() {
    return this.#context;
  }
*/

  sortByHits() {
    this.#works.sort((a: Work, b: Work) => {
      return a.info.stats.hits - b.info.stats.hits;
    });
  }

  sortByWords() {
    this.#works.sort((a: Work, b: Work) => {
      return a.info.stats.words - b.info.stats.words;
    });
  }

  sortByKudos() {
    this.#works.sort((a: Work, b: Work) => {
      return a.info.stats.kudos - b.info.stats.kudos;
    });
  }

  sortByBookmarks() {
    this.#works.sort((a: Work, b: Work) => {
      return a.info.stats.bookmarks - b.info.stats.bookmarks;
    });
  }

  sortByChaptersWritten() {
    this.#works.sort((a: Work, b: Work) => {
      return (
        a.info.stats.chapters.chaptersWritten -
        b.info.stats.chapters.chaptersWritten
      );
    });
  }

  sortByChaptersMax() {
    this.#works.sort((a: Work, b: Work) => {
      return (
        a.info.stats.chapters.chaptersMax - b.info.stats.chapters.chaptersMax
      );
    });
  }

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

  sortByChaptersTagNumber() {
    this.#works.sort((a: Work, b: Work) => {
      return a.info.tags.length - b.info.tags.length;
    });
  }

  sortByRelationshipNumber() {
    this.#works.sort((a: Work, b: Work) => {
      return a.info.relationships.length - b.info.relationships.length;
    });
  }

  sortByCharacterNumber() {
    this.#works.sort((a: Work, b: Work) => {
      return a.info.characters.length - b.info.characters.length;
    });
  }

  sortByTitle() {
    this.#works.sort((a: Work, b: Work) => {
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
    this.#works.sort((a: Work, b: Work) => {
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
    this.#works.sort((a: Work, b: Work) => {
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

  sortByLastRead() {
    this.#works.sort((a: Work, b: Work) => {
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
  }
}
