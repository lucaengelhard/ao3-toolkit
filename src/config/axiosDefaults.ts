import fs from "fs";
import { findUpSync } from "find-up-simple";

export function getAxiosUserAgent() {
  const packageJSON = JSON.parse(
    fs.readFileSync("package.json", {
      encoding: "utf8",
      flag: "r",
    })
  );

  let findUpPath = findUpSync("package.json");

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

//TODO: Write Docs
export const axiosDefaults = {
  batch: 10,

  axios: {
    headers: {
      "User-Agent": getAxiosUserAgent(),
    },
  },
};
