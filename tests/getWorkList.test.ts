import { Listtype, Login, LoginSession, WorkList, getWorkList } from "../src";

test("get the first reading history page of the given user", async () => {
  if (!process.env.AO3_LOGIN_USERNAME || !process.env.AO3_LOGIN_PASSWORD) {
    throw new Error();
  }
  const logindata: Login = {
    username: process.env.AO3_LOGIN_USERNAME,
    password: process.env.AO3_LOGIN_PASSWORD,
  };

  const session = await new LoginSession(logindata).login();
  const list = await getWorkList(
    logindata,
    session.instance,
    Listtype.History,
    1
  );

  expect(list).toHaveProperty("works");
}, 10000);
