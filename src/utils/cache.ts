import fs from "fs";
import { Work, WorkList } from "../classes/works.js";
import { defaults } from "../config/defaults.js";

/**
 * takes a work or worklist and stores it in the cache as a json file
 *
 * @param context
 * @param username
 * @param object
 * @returns
 */
export function save(
  context: string,
  username: string,
  object: Work | WorkList
) {
  let index = 0;
  let type = "unknown";
  if (object instanceof WorkList) {
    type = "List";
  }

  if (object instanceof Work) {
    type = "Work";
  }

  let dirpath: string = `${defaults.cachePath}/${username}/${type}s/${context}`;

  //Check if cache folder exists
  if (!fs.existsSync(dirpath)) {
    fs.mkdirSync(dirpath, { recursive: true });
    console.log("created directory");
  }

  //Get File names
  let files = fs.readdirSync(dirpath).map((file) => {
    let parts = file.split("_");
    let type = parts[0];
    let thisIndex = parseInt(parts[2]);

    if (thisIndex >= index) {
      index = thisIndex + 1;
    }
    let username = parts.slice(3, parts.length).join("").replace(".json", "");

    return { type, index, username };
  });

  let toSave = undefined;

  if (object instanceof WorkList) {
    let works = object.works.map((work) => {
      try {
        return work.objectify();
      } catch (error) {
        console.log(
          `error saving ${work} work - this could be because it was deleted`
        );
      }
    });

    toSave = {
      works: works,
    };
  }
  if (object instanceof Work) {
    toSave = {
      work: object.objectify(),
    };
  }

  //JSON.stringify
  let stringyfied = JSON.stringify(toSave);
  let filename = `${type}_${context}_${index
    .toString()
    .padStart(3, "0")}_${username}.json`;

  //Save file
  fs.writeFileSync(`${dirpath}/${filename}`, stringyfied);

  console.log(`stored ${filename} in the cache`);

  return { type, context, index, username };
}

/**
 * retrieve a work or worklist from the cache.
 *
 * @param context
 * @param username
 * @param type
 * @param index
 * @returns
 */
export function getCached(
  context: string,
  username: string,
  type: string,
  index: number
) {
  let dirpath: string = `${defaults.cachePath}/${username}/${type}s/${context}`;
  let filename = `${type}_${context}_${index
    .toString()
    .padStart(3, "0")}_${username}.json`;

  let filepath = `${dirpath}/${filename}`;

  let parsed = JSON.parse(fs.readFileSync(filepath, { encoding: "utf8" }));

  if (type == "list") {
    let list = parsed.works.map((work: any) => {
      if (work == null) {
        console.log("problems with parsing work -> skipping to next work");

        return;
      }

      return new Work(work.info, work.content, work.userdata);
    });

    return new WorkList(list);
  }

  if (type == "work") {
    return new Work(parsed.info, parsed.content, parsed.history);
  }
}

/**
 * delete a complete folder-content or just specified files
 *
 * @param context
 * @param username
 * @param type
 * @param span
 * @returns
 */
export function deleteCache(
  context: string,
  username: string,
  type: string,
  span?: number[]
) {
  let dirpath: string = `${defaults.cachePath}/${username}/${type}s/${context}`;

  //Check if cache folder exists
  if (!fs.existsSync(dirpath)) {
    throw new Error("Directory does not exist");
  }

  //Get File names
  let files = fs.readdirSync(dirpath).map((file) => {
    let parts = file.split("_");
    let type = parts[0];
    let context = parts[1];
    let index = parseInt(parts[2]);
    let username = parts.slice(3, parts.length).join("").replace(".json", "");

    return { type, context, index, username, filename: file };
  });

  if (typeof span == "undefined") {
    files.forEach((file) => {
      fs.unlinkSync(`${dirpath}/${file.filename}`);
    });
    return;
  }

  span.forEach((index) => {
    fs.unlinkSync(`${dirpath}/${files[index].filename}`);
  });
}
