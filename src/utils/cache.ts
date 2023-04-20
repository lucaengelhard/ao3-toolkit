import ao3 from "..";
import fs from "fs";

export function save(
  context: string,
  username: string,
  object: ao3.Work | ao3.WorkList
) {
  let index = 0;
  let type = "unknown";
  if (object instanceof ao3.WorkList) {
    type = "list";
  }

  if (object instanceof ao3.Work) {
    type = "work";
  }

  let dirpath: string = `${ao3.defaults.cachePath}/${username}/${type}s/${context}`;

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
    let username = parts.slice(2, parts.length).join("").replace(".json", "");

    return { type, index, username };
  });

  let toSave = undefined;

  if (object instanceof ao3.WorkList) {
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
  if (object instanceof ao3.Work) {
    toSave = {
      work: object.objectify,
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

export function getCached(
  context: string,
  username: string,
  type: string,
  index: number
) {
  let dirpath: string = `${ao3.defaults.cachePath}/${username}/${type}s/${context}`;
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

      return new ao3.Work(work.info, work.content, work.userdata);
    });

    return new ao3.WorkList(list);
  }

  if (type == "work") {
    return new ao3.Work(parsed.info, parsed.content, parsed.history);
  }
}
