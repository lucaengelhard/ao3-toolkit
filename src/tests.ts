import ao3 from ".";

test();

async function test() {
  console.time("test");
  /*
  let session = new ao3.Session(ao3.defaults.logindata);
  await session.login();

  let history: any = await session.getHistory(true);

  let tosave = new ao3.WorkList(history, "history");
  let saved = tosave.save();
*/

  let cached = ao3.getCached("history", "capmaennle", "list", 0);

  if (cached instanceof ao3.WorkList) {
    cached.works.forEach((element) => {
      console.log(element.info.title);
    });
  }

  console.timeEnd("test");
}
