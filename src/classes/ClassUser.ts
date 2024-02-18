import { Login } from "../types/TypesUserData";

/**
 * Class defining information about a single user
 * @param user.username - string of the username
 * @param user.userLink - optional string of link to user profile
 * @param user.logindata - optional {@link Login} object to store the users username and password
 * @param user.pseuds - array of strings containing the pseuds of the user
 */
export default class User {
  username: string;
  userLink?: string;
  logindata?: Login;
  pseuds?: string[];
  constructor(user: {
    username: string;
    userLink?: string;
    logindata?: Login;
    pseuds?: string[];
  }) {
    this.username = user.username;
    this.userLink = user.userLink;
    this.logindata = user.logindata;
    this.pseuds = user.pseuds;
  }
}
