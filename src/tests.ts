import axios from "axios";
import ao3 from ".";

test();

async function test() {
  console.time("test");

  let session = new ao3.Session(ao3.defaults.logindata);
  await session.login();

  let span: ao3.PageSpan = { start: 125, end: undefined };
  let history: any = await session.getHistory();

  let saved = history.save();

  /*
  let cached = ao3.getCached(ao3.Listtype.History, "capmaennle", "list", 0);

  if (cached instanceof ao3.WorkList) {
    cached.works.forEach((element) => {
      console.log(element.history?.lastVisit);
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
  console.timeEnd("test");
}
