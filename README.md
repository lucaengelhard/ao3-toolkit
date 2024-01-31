# ao3-toolkit

A Toolkit for interfacing with the Archive of Our Own

## Installation

ao3-toolkit runs on Node.js and is available as a [NPM package](https://www.npmjs.com/package/ao3-toolkit).

```text
npm install ao3-toolkit
```

## Usage

> [!IMPORTANT]
> In a [blog post](https://archiveofourown.org/admin_posts/25888?show_comments=true) the admins talk about how they handle data scraping:
> "We've put in place certain technical measures to hinder large-scale data scraping on AO3, such as rate limiting, and we're constantly monitoring our traffic for signs of abusive data collection. We do not make exceptions for researchers or those wishing to create datasets. However, we don't have a policy against responsible data collection — such as those done by academic researchers, fans backing up works to Wayback Machine or Google's search indexing. Putting systems in place that attempt to block all scraping would be difficult or impossible without also blocking legitimate uses of the site."

### Logging in to ao3

```ts
import { LoginSession } from "ao3-toolkit";

const session = await new LoginSession({
  username: string,
  password: string,
}).login();
```

### Fetching single works

```ts
import { getWorkInfo } from "ao3-toolkit";

const work = await getWorkInfo(id: number)
```

#### Fetching work content

```ts
import { getWorkContent } from "ao3-toolkit";

const work = await getWorkContent(id: number)
```

#### Fetching work stats

```ts
import { getWorkStats } from "ao3-toolkit";

const work = await getWorkStats(id: number)
```

### Fetching user history

```ts
import { LoginSession, getWorkList } from "ao3-toolkit";

const session = await new LoginSession({
  username: string,
  password: string,
}).login();

const history = await getWorkList(
  logindata,
  session.instance,
  Listtype.History
);
```

### Fetching user bookmarks

```ts
import { LoginSession, getWorkList } from "ao3-toolkit";

const session = await new LoginSession({
  username: string,
  password: string,
}).login();

const history = await getWorkList(
  logindata,
  session.instance,
  Listtype.Bookmark
);
```

## Roadmap

- Fetching work comments
- Fetching user stats
  - favourite tags
  - favourite fandoms
- Fetching user stats
  - words read
  - fics read

## Documentation

[Documentation](https://lucaengelhard.github.io/ao3-toolkit/) is generated with [TypeDoc](https://typedoc.org/)

## Contributing

This project is written by a lone developer who learns as they go. Contributions are welcome and appreciated. So clone the repository, make a Pull request and add a [Changeset](https://github.com/changesets/changesets). If you have any feedback, please open an Issue or reach out to me at me@lucaengelhard.com.

## Inspiration and similar Projects:

https://github.com/cyrusae/AO3.js  
https://github.com/misaalanshori/ao3webapi  
https://github.com/timing1337/ao3_ts  
https://github.com/ReyhanArdiya/stories-scrapper  
https://github.com/dr-off/ao3-api  
https://github.com/Dramatycznie/AO3_Scraper  
https://github.com/rsanjabi/narratives  
https://github.com/syrtis-m/ao3-bookmark-getter  
https://github.com/niacdoial/AO3-stylish-downloader  
https://github.com/gmastergreatee/Fanfiction-Manager

## License

[MIT](https://github.com/lucaengelhard/ao3-toolkit/blob/main/LICENSE)
