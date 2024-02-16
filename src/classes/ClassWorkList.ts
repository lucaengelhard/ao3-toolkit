import { SortOptions } from "../enums/EnumSortOptions";
import { mergeSort } from "../utils/helpers";
import Work from "./ClassWork";

/**
 * This Class describes a list of works. It includes methods to sort the works by different metrics
 */
export default class WorkList {
  works;
  #context;
  //#cached?: Cached;
  constructor(works: Work[], context?: string) {
    this.works = works;

    this.#context = context;
  }

  /**
   * Sorts the Worklist by the given sorting metric
   * @param sortby - define the metric after which the list should be sorted (defaults to {@link SortOptions.title})
   */
  sort(sortby?: SortOptions) {
    if (!sortby) {
      sortby = SortOptions.title;
    }

    this.works = mergeSort(this.works, sortby);

    return this;
  }
}
