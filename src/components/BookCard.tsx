import { Link } from "react-router-dom";
import { coverUrlFromId } from "../api/openLibrary";
import type { BookSummary } from "../api/openLibrary";


export default function BookCard({ book }: { book: BookSummary }) {
  const cover = coverUrlFromId(book.coverId, "M");

  return (
    <article className="card" style={styles.card}>
        <img
          src="/placeholder-book.svg"
          alt={book.title}
          style={styles.cover}
          onLoad={(e) => {
            const img = e.currentTarget;
            const realSrc = cover;
        
            if (realSrc && realSrc !== img.src) {
              img.src = realSrc;
            }
          }}
          onError={(e) => {
            e.currentTarget.src = "/placeholder-book.svg";
          }}
        />


      <div style={styles.body}>
        <h3 style={styles.title} title={book.title}>
          {book.title}
        </h3>

        <div style={styles.meta}>
          <span style={styles.metaLine}>
            {book.author_name?.[0] ? book.author_name[0] : "Unknown author"}
          </span>
          {book.first_publish_year && (
            <span className="badge">First published: {book.first_publish_year}</span>
          )}
        </div>

        <Link to={`/book/${book.olid}`} style={styles.link}>
          View details →
        </Link>
      </div>
    </article>
  );
}

const styles: Record<string, React.CSSProperties> = {
  card: {
    overflow: "hidden",
    transition: "transform 0.15s ease, box-shadow 0.15s ease",
  },
  cover: {
    width: "100%",
    height: 220,
    objectFit: "cover",
    background: "#eef2ff",
    display: "block",
  },
  body: { padding: 14, display: "flex", flexDirection: "column", gap: 10 },
  title: {
    margin: 0,
    fontSize: 15,
    fontWeight: 800,
    letterSpacing: "-0.01em",
    lineHeight: 1.3,
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  },
  meta: { display: "flex", flexDirection: "column", gap: 8 },
  metaLine: { color: "var(--muted)", fontSize: 13 },
  link: {
    marginTop: 6,
    textDecoration: "none",
    color: "var(--primary)",
    fontWeight: 700,
  },
};
