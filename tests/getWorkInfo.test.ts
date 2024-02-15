//TODO: Make Mockup data for Jest to parse, so the test will always return successfull (https://www.notion.so/Make-Mockup-data-for-Jest-to-parse-so-the-test-will-always-return-successfull-3b3f0764a3a24baaa7c6ab31045669f4)

import {
  WorkStats,
  getArchiveWarnings,
  getAuthor,
  getCategories,
  getCharacter,
  getFandom,
  getRating,
  getRelationship,
  getSummary,
  getTitle,
  getWorkInfo,
  getWorkStats,
} from "../src";

describe.skip("getting information about a single work", () => {
  const workID = 19865440;

  test("gets the title of the selected work", async () => {
    await expect(getTitle(workID)).resolves.toBe("In The Forest Of Dean");
  });

  test("get author(s) of the selected work", async () => {
    await expect(getAuthor(workID)).resolves.toEqual([
      {
        username: "T3Tohru",
        userLink: "https://archiveofourown.org/users/T3Tohru/pseuds/T3Tohru",
      },
    ]);
  });

  test("get fandoms of the work", async () => {
    await expect(getFandom(workID)).resolves.toEqual([
      {
        fandomName: "Harry Potter - J. K. Rowling",
        fandomLink:
          "https://archiveofourown.org/tags/Harry%20Potter%20-%20J*d*%20K*d*%20Rowling/works",
      },
    ]);
  });

  test("get relationships of the work", async () => {
    await expect(getRelationship(workID)).resolves.toEqual([
      {
        relationshipName: "Hermione Granger/Harry Potter",
        relationshipLink:
          "https://archiveofourown.org/tags/Hermione%20Granger*s*Harry%20Potter/works",
      },
      {
        relationshipName: "Susan Bones/Ginny Weasley",
        relationshipLink:
          "https://archiveofourown.org/tags/Susan%20Bones*s*Ginny%20Weasley/works",
      },
    ]);
  });

  test("get characters of the work", async () => {
    await expect(getCharacter(35364469)).resolves.toEqual([
      {
        characterName: "Caitlyn (League of Legends)",
        characterLink:
          "https://archiveofourown.org/tags/Caitlyn%20(League%20of%20Legends)/works",
      },
      {
        characterName: "Vi (League of Legends)",
        characterLink:
          "https://archiveofourown.org/tags/Vi%20(League%20of%20Legends)/works",
      },
    ]);
  });

  test("get rating of the work", async () => {
    await expect(getRating(workID)).resolves.toEqual({
      ratingName: "Explicit",
      ratingLink: "https://archiveofourown.org/tags/Explicit/works",
    });
  });

  test("get the warnings associated with the work", async () => {
    await expect(getArchiveWarnings(49826860)).resolves.toEqual([
      {
        warningName: "Graphic Depictions Of Violence",
        warningLink:
          "https://archiveofourown.org/tags/Graphic%20Depictions%20Of%20Violence/works",
      },
      {
        warningName: "Major Character Death",
        warningLink:
          "https://archiveofourown.org/tags/Major%20Character%20Death/works",
      },
    ]);
  });

  test("get the categories associated with the work", async () => {
    await expect(getCategories(workID)).resolves.toEqual([
      {
        categoryName: "F/M",
        categoryLink: "https://archiveofourown.org/tags/F*s*M/works",
      },
      {
        categoryName: "F/F",
        categoryLink: "https://archiveofourown.org/tags/F*s*F/works",
      },
    ]);
  });

  test("gets the summary of the selected work", async () => {
    await expect(getSummary(35364469)).resolves.toBe(
      "vi gets strapped and is a needy bottom about it"
    );
  });

  test.skip("get the stats of the work", async () => {
    await expect(getWorkStats(workID)).resolves.toEqual({
      words: 961329,
      chapters: {
        chaptersWritten: 87,
        chaptersMax: 87,
      },
      kudos: 6933,
      hits: 542696,
      bookmarks: 2060,
      finished: true,
    });
  });

  test.skip("get the complet workinfo of the work", async () => {
    await expect(getWorkInfo(workID)).resolves.toEqual({
      title: "In The Forest Of Dean",
      id: 19865440,
      authors: {
        username: "T3Tohru",
        userLink: "https://archiveofourown.org/users/T3Tohru/pseuds/T3Tohru",
      },
      fandoms: {
        fandomName: "Harry Potter - J. K. Rowling",
        fandomLink:
          "https://archiveofourown.org/tags/Harry%20Potter%20-%20J*d*%20K*d*%20Rowling/works",
      },
      stats: new WorkStats({
        words: 961329,
        chapters: {
          chaptersWritten: 87,
          chaptersMax: 87,
        },
        kudos: 6933,
        hits: 542739,
        bookmarks: 2061,
        finished: true,
      }),
      series: [
        {
          seriesLink: "https://archiveofourown.org/series/2605207",
          seriesName: "In The Forest Of Dean Universe",
          seriesPart: 1,
        },
      ],
      relationships: [
        {
          relationshipName: "Hermione Granger/Harry Potter",
          relationshipLink:
            "https://archiveofourown.org/tags/Hermione%20Granger*s*Harry%20Potter/works",
        },
        {
          relationshipName: "Susan Bones/Ginny Weasley",
          relationshipLink:
            "https://archiveofourown.org/tags/Susan%20Bones*s*Ginny%20Weasley/works",
        },
      ],
      characters: [
        {
          characterName: "Hermione Granger",
          characterLink:
            "https://archiveofourown.org/tags/Hermione%20Granger/works",
        },
        {
          characterName: "Harry Potter",
          characterLink:
            "https://archiveofourown.org/tags/Harry%20Potter/works",
        },
        {
          characterName: "Ron Weasley",
          characterLink: "https://archiveofourown.org/tags/Ron%20Weasley/works",
        },
        {
          characterName: "Ginny Weasley",
          characterLink:
            "https://archiveofourown.org/tags/Ginny%20Weasley/works",
        },
        {
          characterName: "Arthur Weasley",
          characterLink:
            "https://archiveofourown.org/tags/Arthur%20Weasley/works",
        },
        {
          characterName: "Molly Weasley",
          characterLink:
            "https://archiveofourown.org/tags/Molly%20Weasley/works",
        },
        {
          characterName: "Susan Bones",
          characterLink: "https://archiveofourown.org/tags/Susan%20Bones/works",
        },
        {
          characterName: "Luna Lovegood",
          characterLink:
            "https://archiveofourown.org/tags/Luna%20Lovegood/works",
        },
        {
          characterName: "Fred Weasley",
          characterLink:
            "https://archiveofourown.org/tags/Fred%20Weasley/works",
        },
        {
          characterName: "George Weasley",
          characterLink:
            "https://archiveofourown.org/tags/George%20Weasley/works",
        },
        {
          characterName: "Severus Snape",
          characterLink:
            "https://archiveofourown.org/tags/Severus%20Snape/works",
        },
        {
          characterName: "Kingsley Shacklebolt",
          characterLink:
            "https://archiveofourown.org/tags/Kingsley%20Shacklebolt/works",
        },
        {
          characterName: "Portrait Phineas Nigellus Black",
          characterLink:
            "https://archiveofourown.org/tags/Portrait%20Phineas%20Nigellus%20Black/works",
        },
        {
          characterName: "Bill Weasley",
          characterLink:
            "https://archiveofourown.org/tags/Bill%20Weasley/works",
        },
        {
          characterName: "Remus Lupin",
          characterLink: "https://archiveofourown.org/tags/Remus%20Lupin/works",
        },
        {
          characterName: "Original Characters",
          characterLink:
            "https://archiveofourown.org/tags/Original%20Characters/works",
        },
        {
          characterName: "Fleur Delacour",
          characterLink:
            "https://archiveofourown.org/tags/Fleur%20Delacour/works",
        },
      ],
      rating: {
        ratingName: "Explicit",
        ratingLink: "https://archiveofourown.org/tags/Explicit/works",
      },
      archiveWarnings: [],
      categories: [
        {
          categoryName: "F/M",
          categoryLink: "https://archiveofourown.org/tags/F*s*M/works",
        },
        {
          categoryName: "F/F",
          categoryLink: "https://archiveofourown.org/tags/F*s*F/works",
        },
      ],
      summary: undefined,
      tags: [{ tagName: "", tagLink: "" }],
    });
  });
});
