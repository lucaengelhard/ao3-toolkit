import { assertEquals } from "jsr:@std/assert";
import { Session } from "./main.ts";

import { DOMParser, Element } from "jsr:@b-fuze/deno-dom";

Deno.test("Login to ao3", async () => {
  const session = new Session(
    Deno.env.get("AO3_LOGIN_USERNAME") ?? "",
    Deno.env.get("AO3_LOGIN_PASSWORD") ?? ""
  );

  await session.login();

  const raw = await session
    .fetch("https://archiveofourown.org/users/capmaennle/readings")
    .then((res) => res.text());

  const doc = new DOMParser().parseFromString(raw, "text/html");

  const p = doc.querySelector("p");

  console.log(p?.textContent);

  assertEquals(1, 1);
});
