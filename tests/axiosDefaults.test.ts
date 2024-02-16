import { axiosDefaults } from "../src";
import { mockAxiosDefaults } from "./_mocks_/axiosDefaultsMock";

test("get the name of the main module and add it to the axios request header", () => {
  expect(axiosDefaults).toEqual(mockAxiosDefaults);
});
