import axios from "axios";
import * as cheerio from "cheerio";

export async function getParsableInfodata(
  input: number | cheerio.CheerioAPI
): Promise<cheerio.CheerioAPI> {
  if (typeof input !== "number") {
    return input;
  }

  const url = `https://archiveofourown.org/works/${input}`;
  const response = await axios({
    method: "get",
    url: url,
    headers: {
      cookie: "view_adult=true;",
      "User-Agent": "Axios/1.3.5 ao3-toolkit bot",
    },
  });

  if (response.status !== 200) {
    throw new Error(`Error while fetching work: ${response.data}`);
  }

  return cheerio.load(response.data);
}

export function linkToAbsolute(linktext: string | undefined) {
  if (typeof linktext == "undefined") {
    throw new Error(`link ${linktext} is undefined`);
  }

  const regex = new RegExp("^(?:[a-z+]+:)?//", "i");
  if (!regex.test(linktext)) {
    return `https://archiveofourown.org${linktext}`;
  }
  return linktext;
}
