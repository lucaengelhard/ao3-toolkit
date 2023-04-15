import ao3 from "./";

console.time("test");

let test = await new ao3.session(ao3.config.logindata).login();

console.timeEnd("test");
