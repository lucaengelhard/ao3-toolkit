import { AxiosResponse } from "axios";
import * as cheerio from "cheerio";
/**
 * This helper function takes a link and checks if it is a relative or absolute ao3 link. If the link is relative link, it returns an absolute version of the link.
 *
 * @param link an ao3 link string
 * @returns the link as an absolute link
 */
export declare function linkToAbsolute(link: string | undefined, strict?: boolean): string;
/**
 * This helper function takes either an ao3 work id or a cheerio object. If the input is an id, it makes a get request and creates a cheerio object.
 *
 * @param fic a work id or a cheerio object of the first chapter
 * @returns a parssable cheerio Object for the other functions to use
 */
export declare function getParsableInfoData(fic: number | cheerio.CheerioAPI): Promise<any>;
/**
 * Takes a Axios response and throws an error if the request was unsuccessful
 *
 * @param res an Axios response
 */
export declare function getSuccess(res: AxiosResponse): void;
/**
 * insert to add a delay in a function
 *
 * @param ms number of milliseconds the delay should last
 * @returns
 */
export declare function delay(ms: number): Promise<void>;
/**
 *
 * @param $ cheerio object of a list of works
 * @returns the number of pages from the bottom navigation
 */
export declare function getPageNumber($: cheerio.CheerioAPI): number;
//# sourceMappingURL=helper.d.ts.map