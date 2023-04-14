//EXTERNAL MODULES
import axios, { AxiosInstance } from "axios";
import { wrapper } from "axios-cookiejar-support";
import { CookieJar } from "tough-cookie";
import * as cheerio from "cheerio";

//INTERNAL MODULES
import { Login } from "../types/base.js";
import { getHistory } from "../utils/history.js";
import { getWork, getContent, getInfo } from "../utils/works.js";
import { historyWork } from "./works.js";

export class ao3 {
  #logindata;
  #instance: AxiosInstance | undefined;

  constructor(logindata: Login) {
    this.#logindata = logindata;

    this.#instance = undefined;

    this.login();
  }

  /**
   * Log in to an ao3 account and return a logged in axios instance
   * @returns a logged in axios instance
   */
  async login() {
    let loginurl = "/users/login";

    let jar = new CookieJar();
    let instance = wrapper(
      axios.create({
        withCredentials: true,
        baseURL: "https://archiveofourown.org",
        jar,
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

  /**
   * get the logindata of the session
   */
  get logindata() {
    return this.#logindata;
  }

  /**
   * get the username of the session
   */
  set username(username: string) {
    this.#logindata.username = username;
  }

  /**
   * get the password of the session
   */
  set password(password: string) {
    this.#logindata.password = password;
  }

  /**
   * Get the reading history of the logged in user
   * @returns a new user userhistory object
   */
  async getHistory() {
    return await getHistory(this.#logindata, this.#instance);
  }

  /**
   *
   * @param id an ao3 work id
   * @returns a new work object with additonal information about the reading history
   */
  async getHistoryWork(id: number) {
    let userHistory = await getHistory(this.#logindata, this.#instance);
    let fanFiction = await getWork(id);

    let matchingElement = userHistory.find((element) => {
      return element.id == fanFiction.id;
    });

    if (matchingElement == undefined) {
      return;
    } else {
      return new historyWork(
        fanFiction.info,
        fanFiction.content,
        matchingElement.lastVisit,
        matchingElement.timesVisited
      );
    }
  }

  //getBookmarks() {}
  //getHistory + andere user-based functions

  /**
   * get a full work, including info and content
   * @param id an ao3 work id
   * @returns a new Work Object
   */
  static async getWork(id: number) {
    return await getWork(id);
  }

  /**
   * get the content of a work
   * @param id an ao3 work id
   * @returns the content of the work
   */
  static async getContent(fic: number | cheerio.CheerioAPI) {
    return await getContent(fic);
  }

  /**
   * get the information about a work
   * @param id an ao3 work id
   * @returns information about the work
   */
  static async getInfo(fic: number | cheerio.CheerioAPI, id?: number) {
    return await getInfo(fic, id);
  }

  //static get Functions
}