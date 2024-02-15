import axios, { AxiosInstance } from "axios";
import { CookieJar } from "tough-cookie";
import { wrapper } from "axios-cookiejar-support";
import * as cheerio from "cheerio";
import { Login } from "../interfaces/InterfaceUserData";
import { axiosDefaults } from "../config/axiosDefaults";

//TODO: Write Docs (https://www.notion.so/Write-Docs-2cbcbd3f12334a30b2aa07ed94eb56c2)
export default class LoginSession {
  #logindata;
  #instance?: AxiosInstance;
  constructor(logindata: Login) {
    this.#logindata = logindata;
  }

  async login() {
    if (this.#logindata.username.length == 0) {
      throw new Error("length of username is 0");
    }

    if (this.#logindata.password.length == 0) {
      throw new Error("length of password is 0");
    }

    const loginurl = "/users/login";
    const jar = new CookieJar();
    const instance = wrapper(
      axios.create({
        withCredentials: true,
        baseURL: "https://archiveofourown.org",
        jar,
      })
    );

    const $ = cheerio.load((await instance.get(loginurl)).data);
    const tokenElement = $("#new_user input[name='authenticity_token']")[0];

    if (!tokenElement) {
      throw new Error(
        `Error while logging in to user ${
          this.#logindata.username
        }: tokenElement is undefined`
      );
    }

    const token = tokenElement.attribs.value;
    if (!token) {
      throw new Error(
        `Error while logging in to user ${
          this.#logindata.username
        }: token is undefined`
      );
    }

    const payload = `authenticity_token=${encodeURIComponent(
      token
    )}&user%5Blogin%5D=${this.#logindata.username}&user%5Bpassword%5D=${
      this.#logindata.password
    }&user%5Bremember_me%5D=1&commit=Log+in`;

    //Check if Login is successfull
    const loginres = await instance.post(
      loginurl,
      payload,
      axiosDefaults.axios
    );

    if (loginres.request.res.responseUrl.includes(this.#logindata.username)) {
      console.log(`Login of user ${this.#logindata.username} successfull`);
    } else {
      throw new Error(`Login of user ${this.#logindata.username} failed`);
    }

    this.#instance = instance;

    return { username: this.#logindata.username, instance };
  }
}
