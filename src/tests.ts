import axios from "axios";
import * as ao3 from "./index.js";

test();

async function test() {
  console.time("test");
  /*
  let res = await ao3.advancedTagSearch({
    canonical: true,
    name: "test",
  });
  res.result.forEach((element: ao3.SearchedTag) => {
    console.log(element.link);
  });


  let session = new ao3.Session(ao3.defaults.logindata);
  await session.login();

  let span: ao3.PageSpan = { start: 125, end: undefined };
  let bookmarks: any = await session.getBookmarks();
  bookmarks.works.forEach((work: ao3.Work) => {
    console.log(work.info.title);
    console.log(work.userdata?.bookmark);
  });

  let saved = bookmarks.save();

  */
  /*
  let cached = ao3.getCached(ao3.Listtype.History, "capmaennle", "list", 3);

  if (cached instanceof ao3.WorkList) {
    cached.sortByWordsRead();
    cached.works.forEach((element) => {
      try {
        console.log(element.history?.wordsRead);
      } catch (error) {
        return;
      }
    });
  }
*/
  /*
  let res = await ao3.advancedWorkSearch(
    {
      fandoms: ["Harry Potter"],
      languageCode: ao3.LanguageCode.English,
    },
    3
  );

  res.result.works.forEach((element) => {
    console.log(element.info.title);
  });
*/

  // ao3.deleteCache(ao3.Listtype.History, "capmaennle", "list", [1, 3]);

  let work = await ao3.getWork(19865440);

  work.save();

  console.log(work.content);

  console.timeEnd("test");
}
