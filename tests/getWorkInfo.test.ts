import {
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

import axios from "axios";
import { mockWorkInfoResponse, mockWorkInfo } from "./_mocks_/getWorkInfoMock";
jest.mock("axios");

describe("get information about a single given work", () => {
  const workID = 19865440;
  axios.get = jest.fn().mockResolvedValue(mockWorkInfoResponse);

  it("should return a new workinfo object", async () => {
    const workinfo = await getWorkInfo(workID);

    expect(mockWorkInfo).toEqual(workinfo);
  });

  it("should return the title of the given work", async () => {
    const workTitle = await getTitle(workID);

    expect(mockWorkInfo.title).toEqual(workTitle);
  });

  it("should return the author(s) of the given work", async () => {
    const workAuthors = await getAuthor(workID);

    expect(mockWorkInfo.authors).toEqual(workAuthors);
  });

  it("should return the fandoms of the given work", async () => {
    const workFandoms = await getFandom(workID);

    expect(mockWorkInfo.fandom).toEqual(workFandoms);
  });

  it("should return the relationships of the given work", async () => {
    const workRelationships = await getRelationship(workID);

    expect(mockWorkInfo.relationships).toEqual(workRelationships);
  });

  it("should return the characters of the given work", async () => {
    const workCharacters = await getCharacter(workID);

    expect(mockWorkInfo.characters).toEqual(workCharacters);
  });

  it("should return the rating of the given work", async () => {
    const workRating = await getRating(workID);

    expect(mockWorkInfo.rating).toEqual(workRating);
  });

  it("should return the warnings of the given work", async () => {
    const workWarning = await getArchiveWarnings(workID);

    expect(mockWorkInfo.archiveWarnings).toEqual(workWarning);
  });

  it("should return the categories of the given work", async () => {
    const workCategories = await getCategories(workID);

    expect(mockWorkInfo.categories).toEqual(workCategories);
  });

  it("should return the summary of the given work", async () => {
    const workSummary = await getSummary(workID);

    expect(mockWorkInfo.summary).toEqual(workSummary);
  });

  it("should return the stats of the given work", async () => {
    const workStats = await getWorkStats(workID);

    expect(mockWorkInfo.stats).toEqual(workStats);
  });
});
