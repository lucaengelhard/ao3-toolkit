import ao3 from "./";

test();

async function test() {
  console.time("test");

  let work = await ao3.getWork(19865440);

  console.timeEnd("test");
}
