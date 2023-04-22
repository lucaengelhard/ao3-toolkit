import { AxiosInstance } from "axios";
import * as cheerio from "cheerio";
import type { Login, PageSpan, WorkBookmark } from "../interfaces.js";
import { WorkList } from "../classes/works.js";
import { Listtype } from "../enums.js";
/**
 * get a worklist from ao3
 *
 * @param logindata
 * @param instance
 * @param listtype
 * @param span
 * @returns a new  {@link WorkList} Object
 */
export declare function getList(logindata: Login, instance: AxiosInstance | undefined, listtype?: Listtype, span?: PageSpan | number[] | number): Promise<WorkList | undefined>;
export declare function parseBookmarkWork($: cheerio.CheerioAPI): WorkBookmark;
//# sourceMappingURL=lists.d.ts.map