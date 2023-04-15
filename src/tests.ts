import ao3 from "./";

test();

async function test() {
  console.time("test");

  let session = new ao3.session(ao3.config.logindata);

  await session.login();
  let history = await session.getHistory();

  console.log(history);

  console.timeEnd("test");
}
