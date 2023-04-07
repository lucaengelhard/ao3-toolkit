class Fanfiction {
  #title = new String();
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
  #lastVisit;
  #content;
  constructor(
    title,
    id,
    author,
    fandom,
    words,
    chapters,
    relationships,
    characters,
    tags,
    language,
    timesVisited,
    lastVisit,
    content
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

fic1 = new Fanfiction(
  "titel",
  1234,
  "Luca",
  "Harry Potter",
  13000,
  10,
  "Hermione Ganger/Harry Potter",
  ["Harry Potter", "Hermione Granger"],
  ["test"],
  "English",
  3,
  "",
  ""
);

console.log(fic1.ratio);
