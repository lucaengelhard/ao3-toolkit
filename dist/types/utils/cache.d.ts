import { Work, WorkList } from "../classes/works.js";
/**
 * takes a work or worklist and stores it in the cache as a json file
 *
 * @param context
 * @param username
 * @param object
 * @returns
 */
export declare function save(context: string, username: string, object: Work | WorkList): {
    type: string;
    context: string;
    index: number;
    username: string;
};
/**
 * retrieve a work or worklist from the cache.
 *
 * @param context
 * @param username
 * @param type
 * @param index
 * @returns
 */
export declare function getCached(context: string, username: string, type: string, index: number): Work | WorkList | undefined;
/**
 * delete a complete folder-content or just specified files
 *
 * @param context
 * @param username
 * @param type
 * @param span
 * @returns
 */
export declare function deleteCache(context: string, username: string, type: string, span?: number[]): void;
//# sourceMappingURL=cache.d.ts.map