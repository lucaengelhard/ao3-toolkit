import ao3 from ".";

test();

async function test() {
  console.time("test");

  let work = await ao3.getWork(30527505);

  let workstats = work.info.finished;
  console.log(workstats);

  console.timeEnd("test");
}
