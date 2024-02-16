/**
 * a span of Pages that should be parsed when fetching a list of pages. The exclude key is an array of numbers that define the pages that should be ignored
 */
export interface PageSpan {
  start: number;
  end: number;
  exclude?: number[];
}
