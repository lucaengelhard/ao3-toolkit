import LoginSession from "../classes/ClassLoginSession";
import { Login } from "../interfaces/InterfaceUserData";
import "dotenv/config";
import getWorkList from "../utils/getWorkList";
import { Listtype } from "../enums/EnumWorkLists";
import WorkList from "../classes/ClassWorkList";
main();
async function main() {
  if (!process.env.AO3_LOGIN_USERNAME || !process.env.AO3_LOGIN_PASSWORD) {
    throw new Error();
  }
  const logindata: Login = {
    username: process.env.AO3_LOGIN_USERNAME,
    password: process.env.AO3_LOGIN_PASSWORD,
  };

  const session = await new LoginSession(logindata).login();
  const list: WorkList | undefined = await getWorkList(
    logindata,
    session.instance,
    Listtype.History,
    1
  );

  if (list) {
    console.log(list.works);
  }
}
