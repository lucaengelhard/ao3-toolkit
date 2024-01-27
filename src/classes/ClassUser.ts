export default class User {
  username: string;
  userLink?: string;
  constructor(user: { username: string; userLink: string }) {
    this.username = user.username;
    this.userLink = user.userLink;
  }
}
