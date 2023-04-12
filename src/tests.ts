import { ao3 } from "./classes/base.js";
import { logindata } from "./config/login.js";

console.time("test");

let session = new ao3(logindata);

await session.login();

let history = await ao3.getInfo(19865440);

console.log(history);

console.timeEnd("test");
