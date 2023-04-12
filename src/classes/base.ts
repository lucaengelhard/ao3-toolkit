import axios, { AxiosInstance } from "axios";
import { wrapper } from "axios-cookiejar-support";
import { CookieJar } from "tough-cookie";
import { Login } from "../config/login";
import { getHistory } from "../utils/history";
import { getFic, getContent, getInfo } from "../utils/works";
import { historyFanfiction } from "./works";
import * as cheerio from "cheerio";

export class ao3 {
  #logindata;
  #instance: AxiosInstance | undefined;

  constructor(logindata: Login) {
    this.#logindata = logindata;

    this.#instance = undefined;

    this.login();
  }

  async login() {
    let loginurl = "/users/login";

    let jar = new CookieJar();
    let instance = wrapper(
      axios.create({
        withCredentials: true,
        baseURL: "https://archiveofourown.org",
        jar,
        timeout: 300,
      })
    );

    let initialload = await instance.get(loginurl);

    let $ = cheerio.load(initialload.data);

    let token = $("#new_user input[name='authenticity_token']")[0].attribs
      .value;

    let payload = `authenticity_token=${encodeURIComponent(
      token
    )}&user%5Blogin%5D=${this.#logindata.username}&user%5Bpassword%5D=${
      this.#logindata.password
    }&user%5Bremember_me%5D=1&commit=Log+in`;

    await instance.post(loginurl, payload);

    this.#instance = instance;

    return instance;
  }

  get logindata() {
    return this.#logindata;
  }

  set username(username: string) {
    this.#logindata.username = username;
  }

  set password(password: string) {
    this.#logindata.password = password;
  }

  async getHistory() {
    return await getHistory(this.#logindata, this.#instance);
  }

  async getHistoryFic(id: number) {
    let userHistory = await getHistory(this.#logindata, this.#instance);
    let fanFiction = await getFic(id);

    let matchingElement = userHistory.find((element) => {
      return element.id == fanFiction.id;
    });

    if (matchingElement == undefined) {
      return;
    } else {
      return new historyFanfiction(
        fanFiction.info,
        fanFiction.content,
        matchingElement.lastVisit,
        matchingElement.timesVisited
      );
    }
  }

  //getBookmarks() {}
  //getHistory + andere user-based functions

  static async getFic(id: number) {
    return await getFic(id);
  }

  static async getContent(fic: number | cheerio.CheerioAPI) {
    return await getContent(fic);
  }

  static async getInfo(fic: number | cheerio.CheerioAPI, id?: number) {
    return await getInfo(fic, id);
  }

  //static get Functions
}
