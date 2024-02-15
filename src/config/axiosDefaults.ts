import fs from "fs";
import { findNearestPackageJson } from "../utils/helpers";

export function getAxiosUserAgent() {
  const packageJSON = JSON.parse(
    fs.readFileSync("package.json", {
      encoding: "utf8",
      flag: "r",
    })
  );

  let findUpPath = findNearestPackageJson(__dirname);

  if (!findUpPath) {
    findUpPath = "package.json";
  }

  const scopedPackageJSON = JSON.parse(
    fs.readFileSync(findUpPath, {
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
      axios: scopedPackageJSON["dependencies"]["axios"]
        ? scopedPackageJSON["dependencies"]["axios"].replace("^", "")
        : "",
    },
  };

  return `bot/${packageInfo.name}/${packageInfo.version}/ao3-toolkit/${packageInfo.depsVersion.ao3Toolkit}/Axios/${packageInfo.depsVersion.axios}`;
}

//TODO: Write Docs (https://www.notion.so/Write-Docs-6bf773f91ce64068b8a920428e171ef6)
export const axiosDefaults = {
  batch: 10,

  axios: {
    headers: {
      "User-Agent": getAxiosUserAgent(),
    },
  },
};
