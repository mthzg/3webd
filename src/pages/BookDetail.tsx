import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { coverUrlFromId, getItemByOlid } from "../api/openLibrary";
import { getWikipediaData } from "../api/wikipedia";
import type { WikipediaSummary } from "../api/wikipedia";

const PLACEHOLDER = "/placeholder-book.svg";

function formatDate(value?: string): string {
  if (!value) return "Unknown";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function BookDetail() {
  const { id } = useParams<{ id: string }>();

  const [item, setItem] = useState<any>(null);
  const [wiki, setWiki] = useState<WikipediaSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) {
      setError("Missing book id.");
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const data = await getItemByOlid(id);
        setItem(data);

        const title = typeof data?.title === "string" ? data.title : "";
        if (title) {
          const w = await getWikipediaData(title);
          setWiki(w);
        } else {
          setWiki(null);
        }
      } catch {
        setError("Book not found.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const description = useMemo(() => {
    if (!item) return "";
    return typeof item.description === "string"
      ? item.description
      : typeof item.description?.value === "string"
      ? item.description.value
      : "";
  }, [item]);

  const coverId = useMemo(() => {
    if (!item) return undefined;
    return Array.isArray(item.covers) && typeof item.covers[0] === "number"
      ? item.covers[0]
      : undefined;
  }, [item]);

  const cover = useMemo(() => coverUrlFromId(coverId, "L"), [coverId]);

  const publishedDate = useMemo(() => {
    if (!item) return undefined;
    // works peuvent avoir first_publish_date, sinon fallback created.value
    if (typeof item.first_publish_date === "string" && item.first_publish_date.trim()) {
      return item.first_publish_date.trim();
    }
    if (typeof item.created?.value === "string") return item.created.value;
    return undefined;
  }, [item]);

  const modifiedDate = useMemo(() => {
    if (!item) return undefined;
    if (typeof item.last_modified?.value === "string") return item.last_modified.value;
    return undefined;
  }, [item]);

  if (loading) {
    return (
      <div className="container">
        <div className="card" style={{ padding: 14 }}>Loading…</div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="container">
        <div className="card" style={{ padding: 14 }}>{error || "Unavailable"}</div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="pageHeader">
        <h1>{item.title}</h1>
        <p>Open Library ID: {id}</p>
      </div>

      <div className="card" style={styles.layout}>
        {/* LEFT: cover + quick info */}
        <div style={styles.left}>
          <img
            src={cover || PLACEHOLDER}
            alt={item.title}
            style={styles.cover}
            loading="eager"
            onError={(e) => {
              const img = e.currentTarget;
              if (img.src.endsWith(PLACEHOLDER)) return;
              img.src = PLACEHOLDER;
            }}
          />

          <div style={{ marginTop: 10, display: "flex", gap: 10, flexWrap: "wrap" }}>
            <span className="badge">{coverId ? "Open Library cover" : "Default cover"}</span>
            {wiki?.thumbnail?.source && <span className="badge">Wikipedia image</span>}
          </div>
        </div>

        {/* RIGHT: metadata + description + wikipedia */}
        <div style={styles.right}>
          {/* METADATA CARD */}
          <div className="card" style={{ padding: 14, marginBottom: 14 }}>
            <h2 style={styles.h2}>Metadata</h2>

            <div style={metaGrid}>
              <div>
                <div style={metaLabel}>Publication date</div>
                <div style={metaValue}>{formatDate(publishedDate)}</div>
              </div>

              <div>
                <div style={metaLabel}>Last modified</div>
                <div style={metaValue}>{formatDate(modifiedDate)}</div>
              </div>
            </div>
          </div>

          {/* DESCRIPTION */}
          {description && (
            <div className="card" style={{ padding: 14, marginBottom: 14 }}>
              <h2 style={styles.h2}>Description</h2>
              <p style={{ margin: 0, color: "var(--text)" }}>{description}</p>
            </div>
          )}

          {/* WIKIPEDIA */}
          <div className="card" style={{ padding: 14 }}>
            <h2 style={styles.h2}>Wikipedia</h2>

            {!wiki && <p style={{ margin: 0, color: "var(--muted)" }}>No Wikipedia data found.</p>}

            {wiki && (
              <div style={{ display: "grid", gap: 12 }}>
                {wiki.thumbnail?.source && (
                  <img
                    src={wiki.thumbnail.source}
                    alt={`${item.title} (Wikipedia)`}
                    style={styles.wikiThumb}
                    loading="lazy"
                    onError={(e) => {
                      const img = e.currentTarget;
                      if (img.src.endsWith(PLACEHOLDER)) return;
                      img.src = PLACEHOLDER;
                    }}
                  />
                )}

                {wiki.extract && <p style={{ margin: 0 }}>{wiki.extract}</p>}

                {wiki.content_urls?.desktop?.page && (
                  <a
                    href={wiki.content_urls.desktop.page}
                    target="_blank"
                    rel="noreferrer"
                    style={styles.wikiLink}
                  >
                    Open Wikipedia →
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  layout: {
    padding: 14,
    display: "grid",
    gridTemplateColumns: "320px 1fr",
    gap: 18,
    alignItems: "start",
  },
  left: { display: "flex", flexDirection: "column" },
  right: { display: "flex", flexDirection: "column" },

  cover: {
    width: "100%",
    height: 440,
    objectFit: "cover",
    borderRadius: 12,
    border: "1px solid var(--border)",
    background: "#111827",
    display: "block",
  },

  wikiThumb: {
    width: "min(280px, 100%)",
    borderRadius: 12,
    border: "1px solid var(--border)",
    background: "#111827",
    display: "block",
  },

  h2: {
    margin: "0 0 10px 0",
    fontSize: 15,
    fontWeight: 900,
    letterSpacing: "-0.01em",
  },

  wikiLink: {
    color: "var(--primary)",
    fontWeight: 900,
    textDecoration: "none",
  },
};

const metaGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 14,
};

const metaLabel: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 900,
  color: "var(--muted)",
  marginBottom: 4,
};

const metaValue: React.CSSProperties = {
  fontSize: 14,
  fontWeight: 800,
};
