import axios, { AxiosResponse } from "axios";
import * as cheerio from "cheerio";
import path from "path";
import fs from "fs";

import Work from "../classes/ClassWork";
import { SortOptions } from "../enums/EnumSortOptions";

/**
 *
 * @param input - a work id as a number or a parsable cheerio object
 * @returns a parsable cheerio object
 */
export async function getParsableInfodata(
  input: number | cheerio.CheerioAPI
): Promise<cheerio.CheerioAPI> {
  if (typeof input !== "number") {
    return input;
  }

  const url = `https://archiveofourown.org/works/${input}`;
  const response = await axios.get(url, {
    headers: {
      cookie: "view_adult=true;",
      "User-Agent": "Axios/1.3.5 ao3-toolkit bot",
    },
  });

  getAxiosSuccess(response);

  return cheerio.load(response.data);
}

/**
 * Takes a Axios response and throws an error if the request was unsuccessful
 *
 * @param res an Axios response
 */
export function getAxiosSuccess(res: AxiosResponse) {
  if (res.status !== 200) {
    throw new Error(`Error while fetching work: ${res}`);
  }
}

/**
 * Creates an absolute link from a part of a url
 *
 * @param linktext
 * @returns
 */
export function linkToAbsolute(linktext: string | undefined) {
  if (typeof linktext == "undefined") {
    throw new Error(`link ${linktext} is undefined`);
  }

  const regex = new RegExp("^(?:[a-z+]+:)?//", "i");
  if (!regex.test(linktext)) {
    return `https://archiveofourown.org${linktext}`;
  }
  return linktext;
}

/**
 * Make sure the variable in a parseInt is a string
 *
 * @param input a string or undefined variable
 * @returns a string or "0" if input is undefined
 */
export function defineParseIntString(input: string | undefined): string {
  if (input) {
    return input;
  }

  return "0";
}

/**
 *
 * @param $ cheerio object of a list of works
 * @returns the number of pages from the bottom navigation
 */
export function getPageNumber($: cheerio.CheerioAPI) {
  return parseInt($(".pagination li").not(".next").last().text());
}

/**
 * insert to add a delay in a function
 *
 * @param ms number of milliseconds the delay should last
 * @returns
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function findNearestPackageJson(startDir: string): string | undefined {
  let currentDir = path.resolve(startDir);

  while (currentDir !== "/") {
    const packageJsonPath = path.join(currentDir, "package.json");

    if (fs.existsSync(packageJsonPath)) {
      // Package.json found, return its path
      return packageJsonPath;
    }

    // Move up to the parent directory
    currentDir = path.dirname(currentDir);
  }

  // No package.json found in the directory tree
  return undefined;
}

export function mergeSort(list: Work[], sortby: SortOptions): Work[] {
  // Base case
  if (list.length <= 1) return list;
  let mid = Math.floor(list.length / 2);
  // Recursive calls
  let left = mergeSort(list.slice(0, mid), sortby);
  let right = mergeSort(list.slice(mid), sortby);
  return mergeSortMerge(left, right, sortby);
}

function mergeSortMerge(
  left: Work[],
  right: Work[],
  sortby: SortOptions
): Work[] {
  let sortedArray: Work[] = [];
  let values: {
    left: number | string;
    right: number | string;
  } = {
    left: 0,
    right: 0,
  };

  switch (sortby) {
    case SortOptions.hits:
      values.left = left[0]?.info?.stats?.hits ? left[0]?.info?.stats?.hits : 0;
      values.right = right[0]?.info?.stats?.hits
        ? right[0]?.info?.stats?.hits
        : 0;
      break;
    case SortOptions.bookmarks:
      values.left = left[0]?.info?.stats?.bookmarks
        ? left[0]?.info?.stats?.bookmarks
        : 0;
      values.right = right[0]?.info?.stats?.bookmarks
        ? right[0]?.info?.stats?.bookmarks
        : 0;
      break;

    case SortOptions.chaptersMax:
      values.left = left[0]?.info?.stats?.chapters.chaptersMax
        ? left[0]?.info?.stats?.chapters.chaptersMax
        : 0;
      values.right = right[0]?.info?.stats?.chapters.chaptersMax
        ? right[0]?.info?.stats?.chapters.chaptersMax
        : 0;
      break;

    case SortOptions.chaptersWritten:
      values.left = left[0]?.info?.stats?.chapters.chaptersWritten
        ? left[0]?.info?.stats?.chapters.chaptersWritten
        : 0;
      values.right = right[0]?.info?.stats?.chapters.chaptersWritten
        ? right[0]?.info?.stats?.chapters.chaptersWritten
        : 0;
      break;

    case SortOptions.characters:
      values.left = left[0]?.info?.characters?.length
        ? left[0]?.info?.characters.length
        : 0;
      values.right = right[0]?.info?.characters?.length
        ? right[0]?.info?.characters.length
        : 0;
      break;

    case SortOptions.kudos:
      values.left = left[0]?.info?.stats?.kudos
        ? left[0]?.info?.stats?.kudos
        : 0;
      values.right = right[0]?.info?.stats?.kudos
        ? right[0]?.info?.stats?.kudos
        : 0;
      break;

    case SortOptions.relationships:
      values.left = left[0]?.info?.relationships?.length
        ? left[0]?.info?.relationships.length
        : 0;
      values.right = right[0]?.info?.relationships?.length
        ? right[0]?.info?.relationships.length
        : 0;
      break;

    case SortOptions.tags:
      values.left = left[0]?.info?.tags?.length
        ? left[0]?.info?.tags.length
        : 0;
      values.right = right[0]?.info?.tags?.length
        ? right[0]?.info?.tags.length
        : 0;
      break;

    case SortOptions.title:
      values.left = left[0]?.info?.title ? left[0]?.info.title : "a";
      values.right = right[0]?.info?.title ? right[0]?.info.title : "a";
      break;

    case SortOptions.words:
      values.left = left[0]?.info?.stats?.words
        ? left[0]?.info?.stats?.words
        : 0;
      values.right = right[0]?.info?.stats?.words
        ? right[0]?.info?.stats?.words
        : 0;
      break;

    case SortOptions.fandom:
      if (left[0]?.info?.fandom) {
        values.left = left[0].info.fandom[0]?.fandomName
          ? left[0].info.fandom[0]?.fandomName
          : "a";
      } else {
        values.left = "a";
      }

      if (right[0]?.info?.fandom) {
        values.right = right[0].info.fandom[0]?.fandomName
          ? right[0].info.fandom[0]?.fandomName
          : "a";
      } else {
        values.right = "a";
      }
      break;

    default:
      throw new Error("Unknown SortOption or SortOption not defined");
  }

  while (left.length && right.length) {
    // Insert the smallest item into sortedArr

    if (values.left < values.right) {
      sortedArray.push(left.shift() as Work);
    } else {
      sortedArray.push(right.shift() as Work);
    }
  }
  // Use spread operators to create a new array, combining the three arrays
  return [...sortedArray, ...left, ...right];
}
