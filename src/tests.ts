import ao3 from "./";

test();

async function test() {
  console.time("test");

  let session = new ao3.Session(ao3.logindata);

  await session.login();

  console.timeEnd("test");
}
