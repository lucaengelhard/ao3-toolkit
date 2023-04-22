import type { SeriesFullInfo, WorkBookmark } from "../types.d.ts";
import { WorkList } from "./works.js";
/**
 * Class that stores information about a single series.
 */
export declare class Series {
    #private;
    constructor(info: SeriesFullInfo, bookmark?: WorkBookmark, works?: WorkList);
    get info(): SeriesFullInfo;
    get bookmark(): WorkBookmark | undefined;
    get works(): WorkList | undefined;
}
//# sourceMappingURL=series.d.ts.map