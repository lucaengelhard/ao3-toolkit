import LoginSession from "../classes/ClassLoginSession";
import "dotenv/config";
import getWorkList from "../utils/getWorkList";
import { Login } from "../interfaces/InterfaceUserData";
import { Listtype } from "../enums/EnumWorkLists";
import WorkList from "../classes/ClassWorkList";

test("get the first reading history page of the given user", async () => {
  if (!process.env.AO3_LOGIN_USERNAME || !process.env.AO3_LOGIN_PASSWORD) {
    throw new Error();
  }
  const logindata: Login = {
    username: process.env.AO3_LOGIN_USERNAME,
    password: process.env.AO3_LOGIN_PASSWORD,
  };

  const session = await new LoginSession(logindata).login();

  await expect(
    getWorkList(logindata, session.instance, Listtype.History, 1)
  ).resolves.toBeInstanceOf(WorkList);
});
