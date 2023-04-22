import ao3 from "../index.js";
import fs from "fs";
/**
 * takes a work or worklist and stores it in the cache as a json file
 *
 * @param context
 * @param username
 * @param object
 * @returns
 */
export function save(context, username, object) {
    let index = 0;
    let type = "unknown";
    if (object instanceof ao3.WorkList) {
        type = "List";
    }
    if (object instanceof ao3.Work) {
        type = "Work";
    }
    let dirpath = `${ao3.defaults.cachePath}/${username}/${type}s/${context}`;
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
    if (object instanceof ao3.WorkList) {
        let works = object.works.map((work) => {
            try {
                return work.objectify();
            }
            catch (error) {
                console.log(`error saving ${work} work - this could be because it was deleted`);
            }
        });
        toSave = {
            works: works,
        };
    }
    if (object instanceof ao3.Work) {
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
export function getCached(context, username, type, index) {
    let dirpath = `${ao3.defaults.cachePath}/${username}/${type}s/${context}`;
    let filename = `${type}_${context}_${index
        .toString()
        .padStart(3, "0")}_${username}.json`;
    let filepath = `${dirpath}/${filename}`;
    let parsed = JSON.parse(fs.readFileSync(filepath, { encoding: "utf8" }));
    if (type == "list") {
        let list = parsed.works.map((work) => {
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
/**
 * delete a complete folder-content or just specified files
 *
 * @param context
 * @param username
 * @param type
 * @param span
 * @returns
 */
export function deleteCache(context, username, type, span) {
    let dirpath = `${ao3.defaults.cachePath}/${username}/${type}s/${context}`;
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
