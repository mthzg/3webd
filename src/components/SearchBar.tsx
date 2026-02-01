import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const trimmed = useMemo(() => query.trim(), [query]);
  const canSearch = trimmed.length > 0;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSearch) return;
    navigate(`/search?q=${encodeURIComponent(trimmed)}`);
  }

  function clear() {
    setQuery("");
    inputRef.current?.focus();
  }

  // Optionnel: focus auto au chargement de la page
  useEffect(() => {
    // inputRef.current?.focus();
  }, []);

  return (
    <div className="container" style={{ paddingTop: 14, paddingBottom: 8 }}>
      <div className="card" style={styles.wrap}>
        <div style={styles.topRow}>
          <span style={styles.title}>Quick search</span>
          <span style={styles.hint}>
            Search by title, author, keyword
          </span>
        </div>

        <form onSubmit={submit} style={styles.form} aria-label="Quick search form">
          <div style={styles.inputWrap}>
            <span style={styles.icon} aria-hidden="true">🔎</span>

            <input
              ref={inputRef}
              className="input"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher"
              aria-label="Search query"
              style={styles.input}
            />

            {query.length > 0 && (
              <button
                type="button"
                onClick={clear}
                className="btn btnSecondary"
                style={styles.clearBtn}
                aria-label="Clear search"
                title="Clear"
              >
                ✕
              </button>
            )}
          </div>

          <div style={styles.actions}>
            <button className="btn" type="submit" disabled={!canSearch} style={styles.searchBtn}>
              Search
            </button>

          </div>
        </form>

        {!canSearch && (
          <div style={styles.helper}>
          </div>
        )}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrap: {
    padding: 14,
  },
  topRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: 12,
    alignItems: "baseline",
    marginBottom: 10,
    flexWrap: "wrap",
  },
  title: {
    fontWeight: 900,
    letterSpacing: "-0.02em",
  },
  hint: {
    color: "var(--muted)",
    fontSize: 12,
    fontWeight: 700,
  },
  form: {
    display: "grid",
    gridTemplateColumns: "1fr auto",
    gap: 10,
    alignItems: "center",
  },
  inputWrap: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  icon: {
    position: "absolute",
    left: 10,
    color: "var(--muted)",
    fontSize: 14,
    pointerEvents: "none",
  },
  input: {
    paddingLeft: 34,
    paddingRight: 44,
  },
  clearBtn: {
    position: "absolute",
    right: 6,
    padding: "6px 10px",
    borderRadius: 10,
    lineHeight: 1,
  },
  actions: {
    display: "flex",
    gap: 10,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  searchBtn: {
    opacity: 1,
  },
  advancedBtn: {
    textDecoration: "none",
  },
  helper: {
    marginTop: 10,
    color: "var(--muted)",
    fontSize: 12,
    fontWeight: 650,
  },
};
