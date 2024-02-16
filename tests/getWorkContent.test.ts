import { getWorkContent } from "../src";

import axios from "axios";
import {
  mockWorkContent,
  mockWorkContentResponse,
} from "./_mocks_/getWorkContentMock";
jest.mock("axios");

describe("get the content of the work", () => {
  const workID = 19865440;
  axios.get = jest.fn().mockResolvedValue(mockWorkContentResponse);

  it("returns the content of the work", async () => {
    const workContent = await getWorkContent(workID);
    expect(mockWorkContent).toEqual(workContent);
  });

  it("returns the first chapter of the given work", async () => {
    const workContent = await getWorkContent(workID);
    expect(mockWorkContent.chapters[0]).toEqual(workContent.chapters[0]);
  });
});
