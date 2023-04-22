import * as cheerio from "cheerio";
import type { BookmarkSearch, PeopleSearch, SearchedTag, TagSearch, WorkSearch } from "../types.d.ts";
import { WorkList } from "../classes/works.js";
/**
 * Simple search bar search -> for more information view:
 
 *
[https://archiveofourown.org/admin_posts/10851](https://archiveofourown.org/admin_posts/10851)

[https://archiveofourown.org/admin_posts/10575](https://archiveofourown.org/admin_posts/10575)

[https://archiveofourown.org/admin_posts/329](https://archiveofourown.org/admin_posts/329)
 *
 * @param query
 * @param index
 * @returns an object containing the current page number, maximum pages and search results
 */
export declare function search(query: string, index?: number): Promise<{
    index: number | undefined;
    navLength: number;
    result: WorkList;
}>;
/**
 * More detailed Work search.
 *
 * @param search  {@link WorkSearch} Object to specify the search parameters
 * @param index
 * @returns an object containing the current page number, maximum pages and search results
 */
export declare function advancedWorkSearch(search: WorkSearch, index?: number): Promise<{
    index: number | undefined;
    navLength: number;
    result: WorkList;
}>;
export declare function parseSearchList($: cheerio.CheerioAPI): WorkList;
/**
 * More detailed people search.
 *
 * @param search  {@link PeopleSearch} Object to specify the search parameters
 * @param index
 * @returns an object containing the current page number, maximum pages and search results
 */
export declare function advancedPeopleSearch(search: PeopleSearch, index?: number): Promise<{
    index: number;
    navLength: number;
    result: any;
}>;
/**
 * More detailed bookmark search.
 *
 * @param search  {@link BookmarkSearch} Object to specify the search parameters
 * @param index
 * @returns an object containing the current page number, maximum pages and search results
 */
export declare function advancedBookmarkSearch(search: BookmarkSearch, index?: number): Promise<{
    index: number;
    navLength: number;
    result: any;
}>;
/**
 * More detailed Tag search.
 *
 * @param search  {@link TagSearch} Object to specify the search parameters
 * @param index
 * @returns an object containing the current page number, maximum pages and search results
 */
export declare function advancedTagSearch(search: TagSearch, index?: number): Promise<{
    index: number;
    navLength: number;
    result: SearchedTag[];
}>;
//# sourceMappingURL=search.d.ts.map