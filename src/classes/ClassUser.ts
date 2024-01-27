/**
 * Class defining information about a single user
 * @param user.username - string of the username
 * @param user.userLink - optional string of link to user profile
 */
export default class User {
  username: string;
  userLink?: string;
  constructor(user: { username: string; userLink: string }) {
    this.username = user.username;
    this.userLink = user.userLink;
  }
}
