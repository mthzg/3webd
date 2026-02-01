import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import BookCard from "../components/BookCard";
import { searchBooksPaged } from "../api/openLibrary";
import type { BookSummary } from "../api/openLibrary";

const PAGE_SIZE = 24;

export default function Search() {
  const [params] = useSearchParams();
  const q = useMemo(() => (params.get("q") || "").trim(), [params]);

  const [results, setResults] = useState<BookSummary[]>([]);
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");

  const [hasMore, setHasMore] = useState(false);

  // Reset when query changes
  useEffect(() => {
    if (!q) {
      setResults([]);
      setPage(1);
      setHasMore(false);
      setError("");
      return;
    }

    (async () => {
      setLoading(true);
      setError("");
      try {
        const first = await searchBooksPaged(q, 1, PAGE_SIZE);
        setResults(first);
        setPage(1);
        setHasMore(first.length === PAGE_SIZE);
      } catch {
        setError("Search failed. Please try again.");
        setResults([]);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    })();
  }, [q]);

  async function loadMore() {
    if (!q || loadingMore || !hasMore) return;

    setLoadingMore(true);
    setError("");

    try {
      const nextPage = page + 1;
      const next = await searchBooksPaged(q, nextPage, PAGE_SIZE);

      // dédoublonnage par key
      const merged = [...results, ...next];
      const uniqueByKey = Array.from(new Map(merged.map((b) => [b.key, b])).values());

      setResults(uniqueByKey);
      setPage(nextPage);

      // si on reçoit moins que PAGE_SIZE, plus rien à charger
      setHasMore(next.length === PAGE_SIZE);
    } catch {
      setError("Unable to load more results.");
    } finally {
      setLoadingMore(false);
    }
  }

  return (
    <div className="container">
      <div className="pageHeader">
        <h1>Search</h1>
        <p>Results for your query.</p>
      </div>

      {q && (
        <div className="row" style={{ marginBottom: 14 }}>
          <span className="badge">Query: {q}</span>
          <span className="badge">Results: {results.length}</span>
        </div>
      )}

      {!q && (
        <div className="card" style={{ padding: 14 }}>
          Type a query in the search bar.
        </div>
      )}

      {loading && (
        <div className="card" style={{ padding: 14 }}>
          Loading…
        </div>
      )}

      {error && !loading && (
        <div className="card" style={{ padding: 14 }}>
          {error}
        </div>
      )}

      {!loading && !error && q && results.length === 0 && (
        <div className="card" style={{ padding: 14 }}>
          No results found.
        </div>
      )}

      {!loading && results.length > 0 && (
        <>
          <div className="grid">
            {results.map((b) => (
              <BookCard key={b.key} book={b} />
            ))}
          </div>

          <div style={{ marginTop: 18, display: "flex", justifyContent: "center" }}>
            {hasMore ? (
              <button
                className="btn"
                onClick={loadMore}
                disabled={loadingMore}
                aria-label="Load more results"
              >
                {loadingMore ? "Loading…" : "Load more"}
              </button>
            ) : (
              <span className="badge">No more results</span>
            )}
          </div>
        </>
      )}
    </div>
  );
}
