/**
 * Class that stores information about a single series.
 */
export class Series {
    #info;
    #bookmark;
    #works;
    constructor(info, bookmark, works) {
        this.#info = info;
        this.#bookmark = bookmark;
        this.#works = works;
    }
    get info() {
        return this.#info;
    }
    get bookmark() {
        return this.#bookmark;
    }
    get works() {
        return this.#works;
    }
}
