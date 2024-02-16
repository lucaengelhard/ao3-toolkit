import fs from "fs";

export const mockWorkContentResponse = {
  status: 200,
  data: fs.readFileSync("./tests/_mocks_/getWorkContentMock.html", "utf-8"),
};

export const mockWorkContent = JSON.parse(
  fs.readFileSync("./tests/_mocks_/getWorkContentMock.json", "utf-8")
);
