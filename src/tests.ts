import { ao3 } from "./classes/base";

test(19865440);

async function test(id: number) {
  console.time("test");

  let fic = (await ao3.getFic(id)).author;
  console.log(fic);

  console.timeEnd("test");
}
