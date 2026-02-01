import { useState } from "react";
import BookCard from "../components/BookCard";
import { advancedSearch } from "../api/openLibrary";
import type { BookSummary } from "../api/openLibrary";


export default function AdvancedSearch() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [subject, setSubject] = useState("");
  const [year, setYear] = useState("");

  const [results, setResults] = useState<BookSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await advancedSearch({
        title,
        author,
        subject,
        first_publish_year: year,
      });
      setResults(data);
    } catch {
      setError("Advanced search failed.");
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setTitle("");
    setAuthor("");
    setSubject("");
    setYear("");
    setResults([]);
    setError("");
  }

  return (
    <div className="container">
      <div className="pageHeader">
        <h1>Advanced search</h1>
        <p>Search using specific fields (title, author, Subject).</p>
      </div>

      <form onSubmit={submit} className="card" style={{ padding: 14, marginBottom: 18 }}>
        <div className="row">
          <div style={{ flex: "1 1 220px" }}>
            <label style={labelStyle}>Title</label>
            <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          <div style={{ flex: "1 1 220px" }}>
            <label style={labelStyle}>Author</label>
            <input className="input" value={author} onChange={(e) => setAuthor(e.target.value)} />
          </div>

          <div style={{ flex: "1 1 220px" }}>
            <label style={labelStyle}>Subject / tag</label>
            <input className="input" value={subject} onChange={(e) => setSubject(e.target.value)} />
          </div>


        </div>

        <hr className="hr" />

        <div className="row">
          <button className="btn" type="submit">Search</button>
          <button className="btn btnSecondary" type="button" onClick={reset}>Reset</button>
        </div>
      </form>

      {loading && <div className="card" style={{ padding: 14 }}>Loading…</div>}
      {error && !loading && <div className="card" style={{ padding: 14 }}>{error}</div>}

      {!loading && !error && results.length === 0 && (
        <div className="card" style={{ padding: 14 }}>
          No results yet. Use the form above.
        </div>
      )}

      {!loading && !error && results.length > 0 && (
        <div className="grid">
          {results.map((b) => (
            <BookCard key={b.key} book={b} />
          ))}
        </div>
      )}
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 12,
  fontWeight: 800,
  color: "var(--muted)",
  marginBottom: 6,
};
