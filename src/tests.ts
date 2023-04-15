import ao3 from "./";

test();

async function test() {
  console.time("test");

  let session = new ao3.Session(ao3.logindata);

  await session.login();

  let history: any = await session.getHistory(true);

  console.log(history[0].history);

  console.timeEnd("test");
}
