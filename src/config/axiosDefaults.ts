import fs from "fs";
import path from "path";

export function getAxiosUserAgent() {
  const packageJSON = JSON.parse(
    fs.readFileSync("package.json", {
      encoding: "utf8",
      flag: "r",
    })
  );

  const packageInfo = {
    name: packageJSON["name"],
    version: packageJSON["version"].replace("^", ""),
    depsVersion: {
      ao3Toolkit: packageJSON["dependencies"]["ao3-toolkit"]
        ? packageJSON["dependencies"]["ao3-toolkit"].replace("^", "")
        : packageJSON["version"].replace("^", ""),
      axios: packageJSON["dependencies"]["axios"]
        ? packageJSON["dependencies"]["axios"].replace("^", "")
        : packageJSON["version"].replace("^", ""),
    },
  };

  return `bot/${packageInfo.name}/${packageInfo.version}/ao3-toolkit/${packageInfo.depsVersion.ao3Toolkit}/Axios/${packageInfo.depsVersion.axios}`;
}

//TODO: Write Docs
export const axiosDefaults = {
  batch: 10,

  axios: {
    headers: {
      "User-Agent": getAxiosUserAgent(),
    },
  },
};
