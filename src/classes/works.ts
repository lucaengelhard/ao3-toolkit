import ao3 from "..";
import fs from "fs";

/**
 * Base class for works. Stores information about the work as well as the content.
 */
export class Work {
  #content;
  #info;
  #history?;
  #cached?: ao3.Cached;

  constructor(
    info: ao3.Info,
    content?: ao3.Content,
    history?: ao3.WorkHistory
  ) {
    this.#content = content;
    this.#info = info;
    this.#info.finished =
      this.#info.stats.chapters.chaptersMax ==
      this.#info.stats.chapters.chaptersWritten;

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

  get cached() {
    return this.#cached;
  }

  objectify() {
    return {
      content: this.#content,
      info: this.#info,
      history: this.#history,
    };
  }
}

export class WorkList {
  #works;
  #cached?: ao3.Cached;
  constructor(works: ao3.Work[]) {
    this.#works = works;
  }

  get works() {
    return this.#works;
  }

  get cached() {
    return this.#cached;
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

  save() {
    let type = "list";
    let typepath = ao3.defaults.cachePath + `/${type}s`;
    let index = 0;
    let username = ao3.defaults.logindata.username;

    //Check if cache folder exists
    if (!fs.existsSync(typepath)) {
      fs.mkdirSync(typepath, { recursive: true });
      console.log("created direcotry");
    }

    //Get File names
    let files = fs.readdirSync(typepath).map((file) => {
      let parts = file.split("_");
      let type = parts[0];
      let thisIndex = parseInt(parts[1]);
      if (thisIndex >= index) {
        index = thisIndex + 1;
      }
      let username = parts.slice(2, parts.length).join("").replace(".json", "");

      return { type, index, username };
    });

    //objectify works
    let works = this.#works.map((work) => {
      return work.objectify();
    });

    let toSave = {
      works: works,
    };

    //JSON.stringify
    let stringyfied = JSON.stringify(toSave);

    //Save file
    fs.writeFileSync(
      typepath +
        `/${type}_${index.toString().padStart(3, "0")}_${username}.json`,
      stringyfied
    );

    console.log(
      `stored ${type}_${index
        .toString()
        .padStart(3, "0")}_${username}.json in the cache`
    );

    this.#cached = { cached: true, index: index };

    //Return type, index, username
    return { type, index, username };
  }

  static getCached(index: number) {
    let type = "list";
    let username = ao3.defaults.logindata.username;
    let filepath =
      ao3.defaults.cachePath +
      `/${type}s/${type}_${index.toString().padStart(3, "0")}_${username}.json`;

    let parsed = JSON.parse(fs.readFileSync(filepath, { encoding: "utf8" }));

    let list = parsed.works.map((work: any) => {
      return new ao3.Work(work.info, work.content, work.history);
    });

    return new WorkList(list);
  }
}
