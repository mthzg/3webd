const BASE = "https://openlibrary.org";
const HOME_CACHE_KEY = "home_recent_books";
const HOME_CACHE_TIME_KEY = "home_recent_books_time";
const HOME_CACHE_DURATION = 5 * 60 * 1000;


export type BookSummary = {
  key: string;                 
  olid: string;                
  title: string;
  author_name?: string[];
  coverId?: number;
  first_publish_year?: number;
};

export function extractOlidFromKey(key: string): string {
  const parts = key.split("/");
  return parts[parts.length - 1] || key;
}

export function keyFromOlid(olid: string): string {
  if (olid.endsWith("W")) return `/works/${olid}`;
  if (olid.endsWith("M")) return `/books/${olid}`;
  // fallback -> works
  return `/works/${olid}`;
}

export function coverUrlFromId(coverId?: number, size: "S" | "M" | "L" = "M"): string {
  if (!coverId) return "/placeholder-book.svg";
  return `https://covers.openlibrary.org/b/id/${coverId}-${size}.jpg`;
}

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json() as Promise<T>;
}

export async function searchBooks(query: string): Promise<BookSummary[]> {
  const data: any = await fetchJson(`${BASE}/search.json?q=${encodeURIComponent(query)}&limit=24`);
  return (data.docs || []).map((d: any) => ({
    key: d.key,
    olid: extractOlidFromKey(d.key),
    title: d.title,
    author_name: d.author_name,
    coverId: d.cover_i,
    first_publish_year: d.first_publish_year,
  }));
}

export async function advancedSearch(params: Record<string, string>): Promise<BookSummary[]> {
  const qp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    const value = v?.trim();
    if (value) qp.set(k, value);
  });

  const data: any = await fetchJson(`${BASE}/search.json?${qp.toString()}&limit=24`);
  return (data.docs || []).map((d: any) => ({
    key: d.key,
    olid: extractOlidFromKey(d.key),
    title: d.title,
    author_name: d.author_name,
    coverId: d.cover_i,
    first_publish_year: d.first_publish_year,
  }));
}

export async function getRecentChanges(limit = 40): Promise<any[]> {
  return fetchJson(`${BASE}/recentchanges.json?limit=${limit}`);
}

export async function getItemByOlid(olid: string): Promise<any> {
  const key = keyFromOlid(olid);
  return fetchJson(`${BASE}${key}.json`);
}

export async function getItemByKey(key: string): Promise<any> {
  return fetchJson(`${BASE}${key}.json`);
}

export async function getRecentlyChangedBooks(limit = 48) {
  const now = Date.now();

  const cached = sessionStorage.getItem(HOME_CACHE_KEY);
  const cachedTime = sessionStorage.getItem(HOME_CACHE_TIME_KEY);

  if (cached && cachedTime && now - Number(cachedTime) < HOME_CACHE_DURATION) {
    return JSON.parse(cached);
  }

  const changes = await getRecentChanges(60);

  const keys: string[] = changes
    .filter((c: any) => c?.kind === "edit-book" && Array.isArray(c?.changes))
    .flatMap((c: any) => c.changes.map((x: any) => x.key))
    .filter((k: any) => k.startsWith("/books/") || k.startsWith("/works/"))
    .slice(0, limit);

  const books = await Promise.all(
    keys.map(async (key) => {
      try {
        const data: any = await getItemByKey(key);
        return {
          key,
          olid: extractOlidFromKey(key),
          title: data.title,
          coverId: Array.isArray(data.covers) ? data.covers[0] : undefined,
        };
      } catch {
        return null;
      }
    })
  );

  const clean = books.filter(Boolean);

  sessionStorage.setItem(HOME_CACHE_KEY, JSON.stringify(clean));
  sessionStorage.setItem(HOME_CACHE_TIME_KEY, String(now));

  return clean;
}

export async function searchBooksPaged(query: string, page = 1, limit = 24): Promise<BookSummary[]> {
  const url =
    `${BASE}/search.json?q=${encodeURIComponent(query)}` +
    `&page=${page}&limit=${limit}`;

  const data: any = await fetchJson(url);

  return (data.docs || []).map((d: any) => ({
    key: d.key,
    olid: extractOlidFromKey(d.key),
    title: d.title,
    author_name: d.author_name,
    coverId: d.cover_i,
    first_publish_year: d.first_publish_year,
  }));
}
