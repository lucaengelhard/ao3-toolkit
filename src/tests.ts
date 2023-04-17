import ao3 from ".";

test();

async function test() {
  console.time("test");
  /*
  let session = new ao3.Session(ao3.defaults.logindata);
  await session.login();

  let history: any = await session.getHistory(true);

  let tosave = new ao3.WorkList(history);
  let saved = tosave.save();*/

  let cached = ao3.WorkList.getCached(7);
  console.log(
    cached.works.forEach((work: ao3.Work) => {
      if (typeof work.history !== "undefined") {
        console.log({
          chapters: work.info.stats.chapters.chaptersWritten,
          timesVisited: work.history.timesVisited,
          ratio:
            work.history.timesVisited /
            work.info.stats.chapters.chaptersWritten,
        });
      }
    })
  );

  console.timeEnd("test");
}
