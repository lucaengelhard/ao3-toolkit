import { AxiosInstance } from "axios";
import type { Login, PageSpan } from "../interfaces.js";
/**
 * The base class of the module. Contains the methods to log in to an ao3 account and create a logged in session, to perform actions only logged in users can do, like fetching their reading history.
 *
 */
export declare class Session {
    #private;
    constructor(logindata: Login);
    /**
     * Log in to an ao3 account and return a logged in axios instance
     * @returns a logged in axios instance
     */
    login(): Promise<AxiosInstance>;
    /**
     * get the logindata of the session
     */
    get logindata(): Login;
    /**
     * Get the reading history of the logged in user (runs the {@link getList} method)
     * @returns a new user userhistory object
     */
    getHistory(span?: number | PageSpan | number[]): Promise<import("./works.js").WorkList | undefined>;
    /**
     * Get the bookmarks of the logged in user (runs the {@link getList} method)
     * @returns a new user bookmarks object
     */
    getBookmarks(span?: number | PageSpan | number[]): Promise<import("./works.js").WorkList | undefined>;
}
//# sourceMappingURL=base.d.ts.map