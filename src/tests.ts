import ao3 from ".";

test();

async function test() {
  console.time("test");

  /* let session = new ao3.Session(ao3.defaults.logindata);
  await session.login();

  let history: any = await session.getHistory(2);

  let saved = history.save();
*/

  let cached = ao3.getCached(ao3.Listtype.History, "capmaennle", "list", 0);

  if (cached instanceof ao3.WorkList) {
    cached.works.forEach((element) => {
      console.log(element.info.title);
    });
  }

  console.timeEnd("test");
}
