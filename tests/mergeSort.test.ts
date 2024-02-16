import { Work, WorkInfo, WorkList } from "../src";
import { SortOptions } from "../src/enums/EnumSortOptions";
import { mergeSort } from "../src/utils/helpers";

it("sorts a given Worklist with mergesort", () => {
  const list = new WorkList([
    new Work(
      new WorkInfo({
        title: "second smallest",
        stats: {
          hits: 20,
          words: 12,
          chapters: {
            chaptersMax: 12,
            chaptersWritten: 13,
          },
          kudos: 1312,
          bookmarks: 1234,
          finished: false,
        },
      })
    ),
    new Work(
      new WorkInfo({
        title: "smallest",
        stats: {
          hits: 19,
          words: 12,
          chapters: {
            chaptersMax: 12,
            chaptersWritten: 13,
          },
          kudos: 1312,
          bookmarks: 1234,
          finished: false,
        },
      })
    ),
    new Work(
      new WorkInfo({
        title: "largest",
        stats: {
          hits: 34,
          words: 12,
          chapters: {
            chaptersMax: 12,
            chaptersWritten: 13,
          },
          kudos: 1312,
          bookmarks: 1234,
          finished: false,
        },
      })
    ),
    new Work(
      new WorkInfo({
        title: "second largest",
        stats: {
          hits: 23,
          words: 12,
          chapters: {
            chaptersMax: 12,
            chaptersWritten: 13,
          },
          kudos: 1312,
          bookmarks: 1234,
          finished: false,
        },
      })
    ),
  ]);

  const sorted = mergeSort(list.works, SortOptions.hits);
  let sortedTitles: string[] = [];

  sorted.forEach((work) => {
    sortedTitles.push(work.info?.title ? work.info?.title : "no title found");
  });

  expect(sortedTitles).toEqual([
    "smallest",
    "second smallest",
    "second largest",
    "largest",
  ]);
});
