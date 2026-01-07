import { Err, Ok, Result } from "@joyful/result";
import { DOMParser, HTMLDocument, type Element } from "jsr:@b-fuze/deno-dom";
import type { User } from "./user.ts";
import type { Tag } from "./tag.ts";
import {
  optionQuerySelector,
  optionQuerySelectorAll,
  reduceResultObj,
  type QueryAble,
} from "../util/helpers.ts";
import type { Series } from "./series.ts";
import { cachedFetch } from "../util/cachedFetch.ts";

interface Work {
  info: WorkInfo;
  content: WorkContent;
}

interface WorkInfo {
  title: string;
  authors: User[];
  fandoms: Tag[];
  characters: Tag[];
  rating: string;
  warnings: Tag[];
  categories: Tag[];
  tags: Tag[];
  language: string;
  series: Series[];
  collections: Tag[];
  summary: string;
  stats: Stats;
}

interface Stats {
  words: number;
  chapters: Chapters;
  kudos: number;
  hits: number;
  bookmarks: number;
}

interface Chapters {
  written: number;
  max: number;
}

interface WorkContent {}

export async function getWork(workID: number): Result<Work, string> {
  return reduceResultObj({
    info: await getWorkInfo(workID),
    content: await getWorkContent(workID),
  });
}

export async function getWorkInfo(
  workID: number
): Promise<Result<WorkInfo, string>> {
  const res = await fetchWorkHTML(workID);
  if (res.err()) return new Err(res.error);
  const doc = res.value;

  return reduceResultObj({
    title: getSingle(doc, "Title", ".preface .title"),
    authors: getTags(doc, "Authors", "[rel=author]"),
    fandoms: getTags(doc, "Fandoms", ".fandom a"),
    characters: getTags(doc, "Characters", ".character a"),
    rating: getSingle(doc, "Rating", "dd.rating"),
    warnings: getTags(doc, "ArchiveWarnings", "dd.warning a"),
    categories: getTags(doc, "Categories", ".category a"),
    tags: getTags(doc, "Tags", ".freeform a"),
    language: getSingle(doc, "Language", ".language + *", (el) =>
      el.textContent.replaceAll("\n", "")
    ),
    series: getMultiple(doc, "Series", "dd.series span.position", (el) => {
      const aEl = el.querySelector("a")!;

      return {
        name: aEl.textContent,
        url: aEl.attributes.getNamedItem("href")!.value,
        part: parseInt(
          el.textContent.replaceAll(aEl.textContent, "").replaceAll(/\D/g, "")
        ),
      };
    }),
    collections: getTags(doc, "Collections", "dd.collections a"),
    summary: getSingleStringFromMultiple(
      doc,
      "Summary",
      ".summary blockquote p",
      (el) => el.textContent
    ),
    stats: getWorkStats(doc),
  });
}

function getWorkStats(doc: HTMLDocument): Result<Stats, string> {
  const statsElement = optionQuerySelector(doc, "dl.stats");
  if (statsElement.isNone()) return new Err("Stats element not found");

  return reduceResultObj({
    words: getSingleInt(statsElement.value, "Words", ".words + *"),
    chapters: getWorkChapterCount(statsElement.value),
    kudos: getSingleInt(statsElement.value, "Kudos", ".kudos + *"),
    hits: getSingleInt(statsElement.value, "Hits", ".hits + *"),
    bookmarks: getSingleInt(statsElement.value, "Bookmarks", ".bookmarks + *"),
  });
}

function getWorkChapterCount(doc: QueryAble): Result<Chapters, string> {
  return reduceResultObj({
    written: getSingleInt(
      doc,
      "Chapters",
      ".chapters + *",
      (str) => str.split("/")[0]
    ),
    max: getSingleInt(
      doc,
      "Chapters",
      ".chapters + *",
      (str) => str.split("/")[1]
    ),
  });
}

function getSingle(
  doc: QueryAble,
  name: string,
  selectors: string
): Result<string, string>;
function getSingle<T>(
  doc: QueryAble,
  name: string,
  selectors: string,
  transform: (el: Element) => T
): Result<T, string>;
function getSingle<T>(
  doc: QueryAble,
  name: string,
  selectors: string,
  transform?: (el: Element) => T
) {
  console.log(`Getting ${name}`);
  const el = optionQuerySelector(doc, selectors);
  if (el.isNone()) return new Err(`${name} not found`);
  const text = el.value.textContent.trim();
  const value = transform ? transform(el.value) : text;

  return new Ok(value);
}

function getMultiple<T>(
  doc: QueryAble,
  name: string,
  selectors: string,
  transform: (el: Element) => T,
  filter?: (el: T) => boolean
): Result<T[], string> {
  console.log(`Getting ${name}`);
  const els = optionQuerySelectorAll(doc, selectors);
  if (els.isNone()) return new Err(`${name} not found`);
  return new Ok(
    els.value
      .map((el) => transform(el))
      .filter((el) => (filter ? filter(el) : true))
  );
}

function getSingleStringFromMultiple(
  doc: QueryAble,
  name: string,
  selectors: string,
  transform: (el: Element) => string
): Result<string, string> {
  const res = getMultiple(doc, name, selectors, transform);
  if (res.err()) return new Err(res.error);

  return new Ok(res.value.join("\n"));
}

function getSingleInt(
  doc: QueryAble,
  name: string,
  selectors: string,
  extractIntString?: (str: string) => string
) {
  if (extractIntString === undefined)
    extractIntString = (str: string) => str.replaceAll(",", "");

  return getSingle(doc, name, selectors, (el) =>
    parseInt(extractIntString(el.textContent))
  );
}

function getTags(
  doc: QueryAble,
  name: string,
  selectors: string
): Result<Tag[], string> {
  return getMultiple(doc, name, selectors, (el) => ({
    name: el.textContent,
    url: el.attributes.getNamedItem("href")!.value,
  }));
}

async function fetchWorkHTML(
  workID: number
): Promise<Result<HTMLDocument, string>> {
  console.log(`Getting Work with ID: ${workID}`);

  const res = await cachedFetch(`https://archiveofourown.org/works/${workID}`, {
    headers: {
      cookie: "view_adult=true;",
      "User-Agent": "bot/ao3-toolkit",
    },
  });

  if (!res.ok)
    return new Err(
      `Error while fetching work with ID: ${workID}: ${await res.text()}`
    );

  const doc = new DOMParser().parseFromString(await res.text(), "text/html");

  return new Ok(doc);
}

async function getWorkContent(
  workID: number
): Promise<Result<WorkContent, string>> {
  const work = await downloadWork(workID);

  if (work.err()) return new Err(work.error);

  return reduceResultObj({
    preNote: getMultiple(
      work.value,
      "preNote",
      "#preface",
      (el) => el.textContent,
      (str) => str.includes("Notes")
    ),
  });
}

async function downloadWork(
  workID: number
): Promise<Result<HTMLDocument, string>> {
  const workHTML = await fetchWorkHTML(workID);

  if (workHTML.err()) return workHTML;
  const downloadURL = `https://archiveofourown.org${
    [...workHTML.value.querySelectorAll(".download li a")]
      .find((a) => a.textContent.includes("HTML"))
      ?.attributes.getNamedItem("href")?.value
  }`;

  const res = await cachedFetch(downloadURL);

  if (!res.ok)
    return new Err(
      `Error while downloading work with ID: ${workID}: ${await res.text()}`
    );

  const doc = new DOMParser().parseFromString(await res.text(), "text/html");

  return new Ok(doc);
}
