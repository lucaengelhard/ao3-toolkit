import * as cheerio from "npm:cheerio@1.0.0";

export const globals: {
  isBrowser: boolean;
  // username: string;
  // password: string;
  // cookieJar: Record<string, string>;
} = {
  isBrowser: typeof window !== "undefined",
  // username: Deno.env.get("AO3_LOGIN_USERNAME") ?? "",
  // password: Deno.env.get("AO3_LOGIN_PASSWORD") ?? "",
  // cookieJar: {},
};

export class Session {
  username: string;
  #password: string;
  cookieJar!: Record<string, string>;

  constructor(username: string, password: string) {
    this.username = username;
    this.#password = password;
    this.cookieJar = {};
  }

  async login() {
    const loginPageRes = await cookieFetch(
      "https://archiveofourown.org/users/login",
      undefined,
      this
    );
    const loginpage = await loginPageRes.text();

    const token = cheerio.load(loginpage)(
      "#new_user input[name='authenticity_token']"
    )[0].attribs.value;

    const formData = new URLSearchParams();
    formData.append("authenticity_token", token);
    formData.append("user[login]", this.username);
    formData.append("user[password]", this.#password);
    formData.append("commit", "Log in");

    const headers = new Headers();
    headers.set("User-Agent", "bot/ao3-toolkit");
    headers.set("Content-Type", "application/x-www-form-urlencoded");

    const loginRes = await cookieFetch(
      "https://archiveofourown.org/users/login",
      { method: "POST", body: formData.toString(), headers },
      this
    );

    console.log(await loginRes.text());

    return this;
  }

  fetch(input: string | URL | Request, init?: RequestInit) {
    return cookieFetch(input, init, this);
  }
}

export async function cookieFetch(
  input: string | URL | Request,
  init?: RequestInit,
  session?: Session
) {
  // console.log(input, init);

  if (globals.isBrowser) return fetch(input, init);
  if (!session) throw "Session missing";

  const headers = new Headers(init?.headers);
  const cookieHeader = serializeCookies(session.cookieJar);

  if (cookieHeader) {
    headers.set("Cookie", cookieHeader);
  }

  // console.log(headers);

  const response = await fetch(input, { ...init, headers });

  storeCookies(response.headers, session);

  return response;
}

function serializeCookies(jar: Record<string, string>): string {
  return Object.entries(jar)
    .map(([key, value]) => `${key}=${value}`)
    .join("; ");
}

function storeCookies(headers: Headers, session: Session) {
  const setCookieHeaders = headers.get("set-cookie");
  if (setCookieHeaders) {
    const cookies = setCookieHeaders.split(/,\s*(?=[^;]+=[^;]+)/); // Handle multiple cookies
    for (const cookie of cookies) {
      const [keyValue] = cookie.split(";"); // Ignore attributes (e.g., Secure, HttpOnly)
      const [key, value] = keyValue.split("=");

      if (key && value) {
        session.cookieJar[key.trim()] = value.trim();
      }
    }
  }
}
