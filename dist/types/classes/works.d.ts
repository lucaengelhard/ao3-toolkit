import type { Cached, Content, Info, WorkBookmark, WorkUserData } from "../types.d.ts";
/**
 * Base class for works. Stores information about the work as well as the content and userdata like history and bookmark information.
 */
export declare class Work {
    #private;
    constructor(info: Info, content?: Content, userdata?: WorkUserData, context?: string);
    get content(): Content | undefined;
    get info(): Info;
    get userdata(): WorkUserData | undefined;
    get history(): import("../types.d.ts").WorkHistory | undefined;
    get bookmark(): WorkBookmark | undefined;
    get cached(): Cached | undefined;
    set userdata(userdata: WorkUserData | undefined);
    objectify(): {
        content: Content | undefined;
        info: Info;
        userdata: WorkUserData | undefined;
        context: string | undefined;
        cached: Cached | undefined;
    };
    save(username?: string): {
        type: string;
        context: string;
        index: number;
        username: string;
    };
}
/**
 *
 *
 */
export declare class WorkList {
    #private;
    constructor(works: Work[], context?: string);
    get works(): Work[];
    get cached(): Cached | undefined;
    get context(): string | undefined;
    sortByHits(): void;
    sortByWords(): void;
    sortByKudos(): void;
    sortByBookmarks(): void;
    sortByChaptersWritten(): void;
    sortByChaptersMax(): void;
    sortByCollectionNumber(): void;
    sortByChaptersTagNumber(): void;
    sortByRelationshipNumber(): void;
    sortByCharacterNumber(): void;
    sortByTitle(): void;
    sortByAuthor(): void;
    sortByFandom(): void;
    sortByLastRead(): void;
    sortByTimesVisited(): void;
    sortByRatio(): void;
    sortByWordsRead(): void;
    save(username?: string): {
        type: string;
        context: string;
        index: number;
        username: string;
    };
}
export declare class ExternalWork {
    #private;
    constructor(info: any, bookmark: WorkBookmark);
    get info(): any;
    get bookmark(): WorkBookmark;
}
//# sourceMappingURL=works.d.ts.map