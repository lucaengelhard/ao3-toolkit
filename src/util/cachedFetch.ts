type CacheEntry = {
  response: Response;
  expiresAt: number;
};

const cache = new Map<string, CacheEntry>();
const inFlight = new Map<string, Promise<Response>>();

const TTL_MS = 30_000;

/* function makeCacheKey(url: string, options: RequestInit = {}): string {
  return JSON.stringify({
    url,
    method: options.method ?? "GET",
    headers: options.headers,
    body: options.body,
  });
} */

function makeCacheKey(url: string, options: RequestInit = {}) {
  return `${options.method ?? "GET"} ${url}`;
}

export async function cachedFetch(url: string, options: RequestInit = {}) {
  const key = makeCacheKey(url, options);
  console.log(`Fetching: ${key}`);

  if (cache.has(key)) {
    const entry = cache.get(key)!;

    if (Date.now() < entry.expiresAt) return entry.response.clone();
    cache.delete(key);
  }

  if (inFlight.has(key)) return (await inFlight.get(key)!).clone();

  console.log(`Network Fetch: ${key}`);
  const request = (async () => {
    try {
      const res = await fetch(url, options);
      if (res.ok)
        cache.set(key, {
          response: res.clone(),
          expiresAt: Date.now() + TTL_MS,
        });
      return res;
    } finally {
      inFlight.delete(key);
    }
  })();

  inFlight.set(key, request);
  const res = await request;
  return res.clone();
}
