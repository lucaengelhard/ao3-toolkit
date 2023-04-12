import { ao3 } from "./classes/base.js";

console.time("test");

let fic = (await ao3.getWork(19865440)).author;
console.log(fic);

console.timeEnd("test");
