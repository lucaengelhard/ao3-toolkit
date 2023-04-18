//EXTERNAL MODULES
import axios, { AxiosInstance } from "axios";
import { wrapper } from "axios-cookiejar-support";
import { CookieJar } from "tough-cookie";
import * as cheerio from "cheerio";

//INTERNAL MODULES
import ao3 from "..";

/**
 * The base class of the module. Contains the methods to log in to an ao3 account and create a logged in session, to get single works and get a users reading history.
 *
 */
export class Session {
  #logindata;
  #instance: AxiosInstance | undefined;

  constructor(logindata: ao3.Login) {
    this.#logindata = logindata;

    this.#instance = undefined;
  }

  /**
   * Log in to an ao3 account and return a logged in axios instance
   * @returns a logged in axios instance
   */
  async login() {
    if (this.#logindata.username.length == 0) {
      throw new Error("length of username is 0");
    }

    if (this.#logindata.password.length == 0) {
      throw new Error("length of password is 0");
    }

    let loginurl = "/users/login";

    let jar = new CookieJar();
    let instance = wrapper(
      axios.create({
        withCredentials: true,
        baseURL: "https://archiveofourown.org",
        jar,
        
      })
    );
axios.defaults.headers.common['User-Agent'] = "axios-bot;"
    let initialload = await instance.get(loginurl);

    let $ = cheerio.load(initialload.data);

    let token = $("#new_user input[name='authenticity_token']")[0].attribs
      .value;

    let payload = `authenticity_token=${encodeURIComponent(
      token
    )}&user%5Blogin%5D=${this.#logindata.username}&user%5Bpassword%5D=${
      this.#logindata.password
    }&user%5Bremember_me%5D=1&commit=Log+in`;

    //Check if Login is successfull
    let loginres = await instance.post(loginurl, payload);

    if (loginres.request.res.responseUrl.includes(this.#logindata.username)) {
      console.log(`Login of user ${this.#logindata.username} successfull`);
    } else {
      throw new Error(`Login of user ${this.#logindata.username} failed`);
    }

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
   * Get the reading history of the logged in user (runs the {@link ao3.getHistory} method)
   * @returns a new user userhistory object
   */
  async getHistory(info?: boolean) {
    return await ao3.getHistory(this.#logindata, this.#instance, info);
  }

  //TODO: getBookmarks() {}
  //TODO: getHistory + andere user-based functions
}
