export type WikipediaSummary = {
  extract?: string;
  thumbnail?: { source: string; width: number; height: number };
  content_urls?: { desktop?: { page?: string } };
};

export async function getWikipediaData(title: string): Promise<WikipediaSummary | null> {
  const t = title?.trim();
  if (!t) return null;

  const res = await fetch(
    `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(t)}`
  );

  if (!res.ok) return null;
  return res.json();
}
