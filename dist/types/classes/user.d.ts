import type { UserInfo } from "../interfaces.js";
import { WorkList } from "./works.js";
export declare class User {
    #private;
    constructor(info: UserInfo, works: WorkList, lists: WorkList[]);
    get info(): UserInfo;
    get stats(): {
        wordsRead: number;
        worksRead: number;
    } | undefined;
    get works(): WorkList | undefined;
    get lists(): WorkList[] | undefined;
}
//# sourceMappingURL=user.d.ts.map