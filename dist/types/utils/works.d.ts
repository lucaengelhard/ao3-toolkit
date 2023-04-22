import * as cheerio from "cheerio";
import { Work } from "../classes/works.js";
import type { Info } from "../interfaces.js";
/**
 * This function takes a work id, runs the {@link getInfo} and {@link getContent} function and returns a new {@link Work} object.
 *
 * @param id a work id
 * @returns a new Work Object
 */
export declare function getWork(id: number): Promise<Work>;
/**
 * This function takes a work id or cheerio object, parses the data and returns an object containing the forword, afterword and each chapter
 *
 * @param fic a work id or a cheerio object of the first chapter
 * @returns an object containing the forword, afterword and each chapter
 */
export declare function getContent(fic: number | cheerio.CheerioAPI): Promise<{
    notes: {
        preNote: string;
        endNote: string;
    };
    chapters: {
        chapterTitle: string;
        chapterSummary: string;
        chapterNotes: string;
        chapterContent: string | null;
    }[];
}>;
/**
 * This function takes a work id or cheerio object, runs multiple getter functions asynchronously and returns an info object.
 *
 * @param fic a work id or a cheerio object of the first chapter
 * @param id (optional) a work id
 * @returns a new info Object
 */
export declare function getInfo(fic: number | cheerio.CheerioAPI, id?: number): Promise<Info>;
/**
 *
 * @param fic a work id or a cheerio object of the first chapter
 * @returns the title of the work
 */
export declare function getTitle(fic: number | cheerio.CheerioAPI): Promise<string>;
/**
 *
 * @param fic a work id or a cheerio object of the first chapter
 * @returns the author of the work and the link to to the authors profile
 */
export declare function getAuthor(fic: number | cheerio.CheerioAPI): Promise<{
    authorName: string;
    authorLink: string;
}>;
/**
 *
 * @param fic a work id or a cheerio object of the first chapter
 * @returns an array of objects containing the name of a fandom and the link to the fandom overview
 */
export declare function getFandom(fic: number | cheerio.CheerioAPI): Promise<{
    fandomName: string;
    fandomLink: string;
}[]>;
/**
 *
 * @param fic a work id or a cheerio object of the first chapter
 * @returns the stats of the work
 */
export declare function getStats(fic: number | cheerio.CheerioAPI): Promise<{
    words: number;
    chapters: {
        chaptersWritten: number;
        chaptersMax: number;
    };
    kudos: number;
    hits: number;
    bookmarks: number;
}>;
/**
 *
 * @param fic a work id or a cheerio object of the first chapter
 * @returns an array of objects containing the name of a relationship and the link to the relationship overview
 */
export declare function getRelationships(fic: number | cheerio.CheerioAPI): Promise<{
    relationshipName: string;
    relationshipLink: string;
}[]>;
/**
 *
 * @param fic a work id or a cheerio object of the first chapter
 * @returns an array of objects containing the name of a character and the link to the character overview
 */
export declare function getCharacters(fic: number | cheerio.CheerioAPI): Promise<{
    characterName: string;
    characterLink: string;
}[]>;
/**
 *
 * @param fic a work id or a cheerio object of the first chapter
 * @returns an object containing the rating of the work and a link to the rating overview
 */
export declare function getRating(fic: number | cheerio.CheerioAPI): Promise<{
    ratingName: string;
    ratingLink: string;
}>;
/**
 *
 * @param fic a work id or a cheerio object of the first chapter
 * @returns an object containing the warnings of the work and a link to the warnings overview
 */
export declare function getWarnings(fic: number | cheerio.CheerioAPI): Promise<{
    warningName: string;
    warningLink: string;
}>;
/**
 *
 * @param fic a work id or a cheerio object of the first chapter
 * @returns an array of objects containing the name of a category and the link to the category overview
 */
export declare function getCategories(fic: number | cheerio.CheerioAPI): Promise<{
    categoryName: string;
    categoryLink: string;
}[]>;
/**
 *
 * @param fic a work id or a cheerio object of the first chapter
 * @returns an array of objects containing the name of a freeform tag and the link to the freeform tag overview
 */
export declare function getTags(fic: number | cheerio.CheerioAPI): Promise<{
    tagName: string;
    tagLink: string;
}[]>;
/**
 *
 * @param fic a work id or a cheerio object of the first chapter
 * @returns the language of the work
 */
export declare function getLanguage(fic: number | cheerio.CheerioAPI): Promise<string>;
/**
 *
 * @param fic a work id or a cheerio object of the first chapter
 * @returns an array of objects containing the name of a series, the link to the series overview and a number of the part in ther series
 */
export declare function getSeries(fic: number | cheerio.CheerioAPI): Promise<{
    seriesName: string;
    seriesLink: string;
    seriesPart: number;
}[]>;
/**
 *
 * @param fic a work id or a cheerio object of the first chapter
 * @returns an array of objects containing the name of a collection and the link to the collection overview
 */
export declare function getCollections(fic: number | cheerio.CheerioAPI): Promise<{
    collectionName: string;
    collectionLink: string;
}[]>;
/**
 *
 * @param fic a work id or a cheerio object of the first chapter
 * @returns the summary of the work
 */
export declare function getSummary(fic: number | cheerio.CheerioAPI): Promise<string>;
//# sourceMappingURL=works.d.ts.map