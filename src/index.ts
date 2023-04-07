interface Fic {
    title: string;
      id: number;
      author: string;
      fandom: Array<string>;
      words: number;
      chapters: number;
      relationships: Array<string>;
      characters: Array<string>;
      tags: Array<string>;
      language: string;
      timesVisited: number;
      lastVisit: string;
      content: any;
      ratio: number;
}

class Fanfiction {
    #title;
    #id;
    #author;
    #fandom;
    #words;
    #chapters;
    #relationships;
    #characters;
    #tags;
    #language;
    #timesVisited;
    #lastVisit ;
    #content;
    constructor(
      title: string,
      id: number,
      author: string,
      fandom: Array<string>,
      words: number,
      chapters: number,
      relationships: Array<string>,
      characters: Array<string>,
      tags: Array<string>,
      language: string,
      timesVisited: number,
      lastVisit: string,
      content: any
    ) {
      this.#title = title;
      this.#id = id;
      this.#author = author;
      this.#fandom = fandom;
      this.#words = words;
      this.#chapters = chapters;
      this.#relationships = relationships;
      this.#characters = characters;
      this.#tags = tags;
      this.#language = language;
      this.#timesVisited = timesVisited;
      this.#lastVisit = lastVisit;
      this.#content = content;
    }
  
    get title() {
      return this.#title;
    }
  
    get id() {
      return this.#id;
    }
  
    get author() {
      return this.#author;
    }
  
    get fandom() {
      return this.#fandom;
    }
  
    get words() {
      return this.#words;
    }
  
    get chapters() {
      return this.#chapters;
    }
  
    get relationships() {
      return this.#relationships;
    }
  
    get characters() {
      return this.#characters;
    }
  
    get tags() {
      return this.#tags;
    }
  
    get language() {
      return this.#language;
    }
  
    get timesVisited() {
      return this.#timesVisited;
    }
  
    get lastVisit() {
      return this.#lastVisit;
    }
  
    get content() {
      return this.#content;
    }
  
    get ratio() {
      return this.#chapters / this.#timesVisited;
    }
  }
  
const fic1: Fic = new Fanfiction(
    "titel",
    1234,
    "Luca",
    ["Harry Potter", "other Fandom"],
    13000,
    10,
    ["Hermione Ganger/Harry Potter"],
    ["Harry Potter", "Hermione Granger"],
    ["test"],
    "English",
    3,
    "", ""
  );
  
  console.log(fic1.ratio);
  