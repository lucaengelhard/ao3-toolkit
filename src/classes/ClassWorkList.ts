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

  sortByHits() {
    this.works.sort((a: Work, b: Work) => {
      let numberA = a.info?.stats?.hits;
      if (!numberA) {
        numberA = 0;
      }
      let numberB = b.info?.stats?.hits;
      if (!numberB) {
        numberB = 0;
      }

      return numberA - numberB;
    });
  }

  sortByWords() {
    this.works.sort((a: Work, b: Work) => {
      let numberA = a.info?.stats?.words;
      if (!numberA) {
        numberA = 0;
      }
      let numberB = b.info?.stats?.words;
      if (!numberB) {
        numberB = 0;
      }

      return numberA - numberB;
    });
  }

  sortByKudos() {
    this.works.sort((a: Work, b: Work) => {
      let numberA = a.info?.stats?.kudos;
      if (!numberA) {
        numberA = 0;
      }
      let numberB = b.info?.stats?.kudos;
      if (!numberB) {
        numberB = 0;
      }

      return numberA - numberB;
    });
  }

  sortByBookmarks() {
    this.works.sort((a: Work, b: Work) => {
      let numberA = a.info?.stats?.bookmarks;
      if (!numberA) {
        numberA = 0;
      }
      let numberB = b.info?.stats?.bookmarks;
      if (!numberB) {
        numberB = 0;
      }

      return numberA - numberB;
    });
  }

  sortByChaptersWritten() {
    this.works.sort((a: Work, b: Work) => {
      let numberA = a.info?.stats?.chapters.chaptersWritten;
      if (!numberA) {
        numberA = 0;
      }
      let numberB = b.info?.stats?.chapters.chaptersWritten;
      if (!numberB) {
        numberB = 0;
      }

      return numberA - numberB;
    });
  }

  sortByChaptersMax() {
    this.works.sort((a: Work, b: Work) => {
      let numberA = a.info?.stats?.chapters.chaptersMax;
      if (!numberA) {
        numberA = 0;
      }
      let numberB = b.info?.stats?.chapters.chaptersMax;
      if (!numberB) {
        numberB = 0;
      }

      return numberA - numberB;
    });
  }

  sortByChaptersTagNumber() {
    this.works.sort((a: Work, b: Work) => {
      let numberA = a.info?.tags?.length;
      if (!numberA) {
        numberA = 0;
      }
      let numberB = b.info?.tags?.length;
      if (!numberB) {
        numberB = 0;
      }

      return numberA - numberB;
    });
  }

  sortByRelationshipNumber() {
    this.works.sort((a: Work, b: Work) => {
      let numberA = a.info?.relationships?.length;
      if (!numberA) {
        numberA = 0;
      }
      let numberB = b.info?.relationships?.length;
      if (!numberB) {
        numberB = 0;
      }

      return numberA - numberB;
    });
  }

  sortByCharacterNumber() {
    this.works.sort((a: Work, b: Work) => {
      let numberA = a.info?.characters?.length;
      if (!numberA) {
        numberA = 0;
      }
      let numberB = b.info?.characters?.length;
      if (!numberB) {
        numberB = 0;
      }

      return numberA - numberB;
    });
  }

  sortByTitle() {
    this.works.sort((a: Work, b: Work) => {
      let fa = a.info?.title?.toLowerCase(),
        fb = b.info?.title?.toLowerCase();

      if (!fa) {
        fa = "z";
      }

      if (!fb) {
        fb = "z";
      }

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
