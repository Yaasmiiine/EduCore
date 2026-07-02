import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

// Renders a page-number strip from a Laravel paginator response
// ({ current_page, last_page, total, ... }). Relies on each page's own
// scoped `.pagination` / `.pagination .active` CSS.
export default function Pagination({ meta, onPageChange }) {
  if (!meta || meta.last_page <= 1) return null;

  const pages = Array.from({ length: meta.last_page }, (_, i) => i + 1);

  return (
    <div className="pagination">
      <button
        disabled={meta.current_page === 1}
        onClick={() => onPageChange(meta.current_page - 1)}
        aria-label="Page précédente"
      >
        <FaChevronLeft />
      </button>

      {pages.map((p) => (
        <button
          key={p}
          className={p === meta.current_page ? "active" : ""}
          onClick={() => onPageChange(p)}
        >
          {p}
        </button>
      ))}

      <button
        disabled={meta.current_page === meta.last_page}
        onClick={() => onPageChange(meta.current_page + 1)}
        aria-label="Page suivante"
      >
        <FaChevronRight />
      </button>
    </div>
  );
}
