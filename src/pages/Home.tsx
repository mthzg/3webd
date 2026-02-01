import { useEffect, useState } from "react";
import BookCard from "../components/BookCard";
import { getRecentlyChangedBooks } from "../api/openLibrary";
import type { BookSummary } from "../api/openLibrary";


function SkeletonGrid() {
  return (
    <div className="grid">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="card" style={{ overflow: "hidden" }}>
          <div className="skeleton" style={{ height: 220 }} />
          <div style={{ padding: 14, display: "grid", gap: 10 }}>
            <div className="skeleton" style={{ height: 16, width: "90%" }} />
            <div className="skeleton" style={{ height: 12, width: "60%" }} />
            <div className="skeleton" style={{ height: 12, width: "40%" }} />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  const [books, setBooks] = useState<BookSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const items = await getRecentlyChangedBooks(48);
        setBooks(items);
      } catch {
        setError("Unable to load recent updates.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="container">
      <div className="pageHeader">
        <h1>Recent updates</h1>
        <p>Books that were recently edited in Open Library (RecentChanges API).</p>
      </div>


      {loading && <SkeletonGrid />}
      {error && !loading && <div className="card" style={{ padding: 14 }}>{error}</div>}

      {!loading && !error && books.length === 0 && (
        <div className="card" style={{ padding: 14 }}>No recent updates found.</div>
      )}

      {!loading && !error && books.length > 0 && (
        <div className="grid">
          {books.map((b) => (
            <BookCard key={b.key} book={b} />
          ))}
        </div>
      )}
    </div>
  );
}
