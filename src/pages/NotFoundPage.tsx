import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <section className="empty-state">
      <svg
        className="empty-state__art"
        viewBox="0 0 64 64"
        role="img"
        aria-hidden="true"
        focusable="false"
      >
        <rect
          x="8"
          y="18"
          width="48"
          height="34"
          rx="6"
          fill="none"
          stroke="#0E7C86"
          strokeWidth="2"
        />
        <path
          d="M24 18v-5a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v5"
          fill="none"
          stroke="#C9CED6"
          strokeWidth="2"
        />
        <path d="M8 34h48" stroke="#C9CED6" strokeWidth="2" />
        <path d="M28 28l10 10M38 28l-10 10" stroke="#B42318" strokeWidth="2" />
      </svg>
      <h1 className="empty-state__title">Diese Seite gibt es nicht.</h1>
      <p className="empty-state__text">
        Die aufgerufene Adresse existiert nicht. Zurück zur Übersicht deiner Reisen.
      </p>
      <Link to="/" className="btn btn-secondary">
        Zurück zur Reiseliste
      </Link>
    </section>
  )
}
